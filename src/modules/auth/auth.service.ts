import prisma from "../../database/prismaclient";
import crypto from "crypto";
import { hashOtp, validateOtp, isOtpExpired } from "./utils/validateOtp";
import { generateToken } from "./utils/token";
import { AppError } from "../../util/AppError";
import {
  normalizePhoneNumber,
  arePhoneNumbersEqual,
} from "../../utils/phoneNormalizer";

export class AuthService {
  /**
   * Normalize phone number using centralized utility
   * Phone normalization is now handled at database level via Prisma middleware
   * This method is kept for backward compatibility and search operations
   */
  private normalizePhone(phone: string): string {
    try {
      // Use centralized normalization utility
      return normalizePhoneNumber(phone);
    } catch (error: any) {
      // Fallback to old normalization for search compatibility
      let digits = phone.replace(/\D/g, "");
      if (digits.startsWith("91") && digits.length === 12) {
        return digits; // Keep full number with country code
      }
      if (digits.length === 10) {
        return `91${digits}`;
      }
      return digits;
    }
  }

  private async findOwnerByPhone(phone: string) {
    // Normalize the phone number (database will normalize on create/update)
    // For search, we need to try both normalized and original formats
    // because older records might not be normalized yet
    let normalizedPhone: string;
    let originalPhone: string;

    try {
      normalizedPhone = normalizePhoneNumber(phone);
    } catch (error: any) {
      // If normalization fails, try original format
      normalizedPhone = phone.replace(/\D/g, "");
      if (normalizedPhone.length === 10) {
        normalizedPhone = `91${normalizedPhone}`;
      }
    }

    // Also try original format (10 digits without country code)
    originalPhone = phone.replace(/\D/g, "");
    const alternativePhone = originalPhone.length === 10 ? originalPhone : null;

    console.log("[AUTH] Searching for owner with phone:", {
      original: phone,
      normalized: normalizedPhone,
      alternative: alternativePhone,
    });

    // Build search conditions - try both normalized and alternative formats
    const phoneConditions: any[] = [{ phone: normalizedPhone }];
    if (alternativePhone && alternativePhone !== normalizedPhone) {
      phoneConditions.push({ phone: alternativePhone });
    }

    // Try to find user with either phone format
    const user = await prisma.user.findFirst({
      where: {
        OR: phoneConditions,
      },
      select: { id: true, name: true, phone: true },
    });

    // Try to find admin with either phone format
    const admin = await prisma.admin.findFirst({
      where: {
        OR: phoneConditions,
      },
      select: { id: true, name: true, phone: true },
    });

    console.log("[AUTH] Search results:", {
      user: user ? { id: user.id, name: user.name, phone: user.phone } : null,
      admin: admin
        ? { id: admin.id, name: admin.name, phone: admin.phone }
        : null,
    });

    if (user) return { ...user, role: "USER" as const };
    if (admin) return { ...admin, role: "ADMIN" as const };

    return null;
  }

  private async createOtp(phone: string) {
    const otp = crypto.randomInt(1000, 9999).toString();
    const hashed = await hashOtp(otp);

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Use transaction with atomic operation to prevent race conditions
    // Delete any existing OTPs for this phone first, then create new one
    // This ensures only one active OTP per phone at a time
    await prisma.$transaction(async (tx) => {
      // Delete existing OTPs for this phone (atomic operation)
      await tx.oTP.deleteMany({
        where: { phone },
      });

      // Create new OTP (atomic operation)
      await tx.oTP.create({
        data: { phone, code: hashed, expiresAt },
      });
    });

    console.log("OTP:", otp);
    return otp;
  }

  /* ---------------- REGISTER OTP ---------------- */
  async sendRegisterOtp(name: string, phone: string) {
    const existingOwner = await this.findOwnerByPhone(phone);

    if (existingOwner) {
      throw new AppError(
        "Account already exists with this number.Try login",
        409
      );
    }

    await this.createOtp(phone);

    return { message: "OTP sent successfully." };
  }

  async verifyRegisterOtp(name: string, phone: string, otp: string) {
    const existingOwner = await this.findOwnerByPhone(phone);

    if (existingOwner) {
      throw new AppError("Account already exists.Try login", 409);
    }

    const foundOtp = await prisma.oTP.findFirst({
      where: { phone },
      orderBy: { createdAt: "desc" },
    });

    if (!foundOtp) throw new AppError("OTP not found.", 404);
    if (isOtpExpired(foundOtp.expiresAt))
      throw new AppError("OTP expired.", 410);

    const match = await validateOtp(otp, foundOtp.code);
    if (!match) throw new AppError("Invalid OTP.", 401);

    await prisma.oTP.delete({ where: { id: foundOtp.id } });

    const user = await prisma.user.create({
      data: { name, phone },
    });

    const safeUser = {
      id: user.id,
      name: user.name,
      phone: user.phone,
      role: "USER" as const,
    };

    const token = generateToken(user.id, "USER");

    return {
      message: "User registered successfully.",
      user: safeUser,
      token,
    };
  }

  /* ---------------- LOGIN OTP ---------------- */
  async sendLoginOtp(phone: string) {
    console.log("[AUTH] sendLoginOtp called with phone:", phone);

    const owner = await this.findOwnerByPhone(phone);

    console.log(
      "[AUTH] Owner found:",
      owner
        ? {
            id: owner.id,
            name: owner.name,
            phone: owner.phone,
            role: owner.role,
          }
        : null
    );

    if (!owner) {
      // List all admins for debugging
      const allAdmins = await prisma.admin.findMany({
        select: { id: true, name: true, phone: true, email: true },
      });
      console.log("[AUTH] All admins in database:", allAdmins);

      throw new AppError(
        "No account found with this number.Register your account",
        404
      );
    }

    await this.createOtp(phone);

    return {
      message: "OTP sent successfully.",
      role: owner.role,
    };
  }

  async verifyLoginOtp(phone: string, otp: string) {
    const owner = await this.findOwnerByPhone(phone);

    if (!owner)
      throw new AppError("No account found.Register your account", 404);

    const foundOtp = await prisma.oTP.findFirst({
      where: { phone },
      orderBy: { createdAt: "desc" },
    });

    if (!foundOtp) throw new AppError("OTP not found.", 404);
    if (isOtpExpired(foundOtp.expiresAt))
      throw new AppError("OTP expired.", 410);

    const match = await validateOtp(otp, foundOtp.code);
    if (!match) throw new AppError("Invalid OTP.", 401);

    await prisma.oTP.delete({ where: { id: foundOtp.id } });

    const token = generateToken(owner.id, owner.role);

    return {
      message: "Logged in successfully.",
      role: owner.role,
      owner,
      user: owner,
      token,
    };
  }

  /* ---------------- GET ME ---------------- */
  async getMe(ownerId: string, role: "USER" | "ADMIN") {
    console.log("[AUTH SERVICE] getMe called with:", { ownerId, role });

    if (role === "USER") {
      const user = await prisma.user.findUnique({
        where: { id: ownerId },
        select: { id: true, name: true, phone: true },
      });

      if (!user) {
        console.error("[AUTH SERVICE] User not found:", ownerId);
        throw new AppError("User not found", 404);
      }

      console.log("[AUTH SERVICE] User found:", {
        id: user.id,
        name: user.name,
      });
      return { ...user, role: "USER" };
    }

    if (role === "ADMIN") {
      const admin = await prisma.admin.findUnique({
        where: { id: ownerId },
        select: { id: true, name: true, phone: true },
      });

      if (!admin) {
        console.error("[AUTH SERVICE] Admin not found:", ownerId);
        throw new AppError("Admin not found", 404);
      }

      console.log("[AUTH SERVICE] Admin found:", {
        id: admin.id,
        name: admin.name,
      });
      return { ...admin, role: "ADMIN" };
    }

    console.error("[AUTH SERVICE] Invalid role:", role);
    throw new AppError(`Invalid role: ${role}. Expected USER or ADMIN.`, 400);
  }
}

export const authService = new AuthService();
