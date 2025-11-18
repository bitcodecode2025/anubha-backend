import prisma from "../../database/prismaclient";
import crypto from "crypto";
import { hashOtp, validateOtp, isOtpExpired } from "./utils/validateOtp";
import { generateTokenPair } from "./utils/token";

export class AuthService {
  /**
   * --------------------------
   * REGISTER → SEND OTP
   * --------------------------
   */
  async sendRegisterOtp(name: string, email: string) {
    // check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new Error("User already exists with this email.");
    }

    // create OTP
    const otp = crypto.randomInt(1000, 9999).toString();
    const hashed = await hashOtp(otp);

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    // store OTP
    await prisma.oTP.create({
      data: {
        email,
        code: hashed,
        expiresAt,
      },
    });

    // send OTP (currently mock)
    console.log("REGISTER OTP:", otp);

    return { message: "OTP sent successfully." };
  }

  /**
   * --------------------------
   * REGISTER → VERIFY OTP
   * --------------------------
   */
  async verifyRegisterOtp(name: string, email: string, otp: string) {
    // find OTP
    const foundOtp = await prisma.oTP.findFirst({
      where: {
        email,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!foundOtp) throw new Error("OTP not found. Request again.");

    // check expired
    if (isOtpExpired(foundOtp.expiresAt)) {
      throw new Error("OTP expired. Request a new one.");
    }

    // validate OTP
    const match = await validateOtp(otp, foundOtp.code);
    if (!match) throw new Error("Invalid OTP.");

    // delete OTP after verifying
    await prisma.oTP.delete({
      where: { id: foundOtp.id },
    });

    // create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    });

    // generate tokens
    const tokens = await generateTokenPair(user.id, user.role);

    return {
      message: "User registered successfully.",
      user,
      tokens,
    };
  }

  /**
   * --------------------------
   * LOGIN → SEND OTP
   * --------------------------
   */
  async sendLoginOtp(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) throw new Error("No account found with this email.");

    // create OTP
    const otp = crypto.randomInt(1000, 9999).toString();
    const hashed = await hashOtp(otp);

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.oTP.create({
      data: {
        email,
        code: hashed,
        expiresAt,
      },
    });

    console.log("LOGIN OTP:", otp);

    return { message: "OTP sent successfully." };
  }

  /**
   * --------------------------
   * LOGIN → VERIFY OTP
   * --------------------------
   */
  async verifyLoginOtp(email: string, otp: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) throw new Error("No account found.");

    // find latest OTP
    const foundOtp = await prisma.oTP.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    if (!foundOtp) throw new Error("OTP not found. Request again.");

    if (isOtpExpired(foundOtp.expiresAt)) throw new Error("OTP expired.");

    const match = await validateOtp(otp, foundOtp.code);
    if (!match) throw new Error("Invalid OTP.");

    // delete OTP
    await prisma.oTP.delete({ where: { id: foundOtp.id } });

    // generate tokens
    const tokens = await generateTokenPair(user.id, user.role);

    return {
      message: "Logged in successfully.",
      user,
      tokens,
    };
  }
}

export const authService = new AuthService();
