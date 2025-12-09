import { Request, Response } from "express";
import { authService } from "./auth.service";

export class AuthController {
  async sendRegisterOtp(req: Request, res: Response) {
    try {
      const { name, phone } = req.body;

      // Additional validation - ensure body is not empty
      if (!name || !phone) {
        return res.status(400).json({
          success: false,
          message: "Name and phone are required",
        });
      }

      const response = await authService.sendRegisterOtp(name, phone);

      return res.status(200).json({
        success: true,
        ...response,
      });
    } catch (error: any) {
      // Return appropriate status code based on error type
      const statusCode = error.statusCode || 400;
      return res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to send OTP",
      });
    }
  }

  async verifyRegisterOtp(req: Request, res: Response) {
    try {
      const { name, phone, otp } = req.body;

      const response = await authService.verifyRegisterOtp(name, phone, otp);

      res.cookie("auth_token", response.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax", // Use "lax" for localhost compatibility
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/",
      });

      return res.status(200).json({
        success: true,
        message: response.message,
        user: response.user,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async sendLoginOtp(req: Request, res: Response) {
    try {
      const { phone } = req.body;

      // Additional validation - ensure body is not empty
      if (!phone) {
        return res.status(400).json({
          success: false,
          message: "Phone number is required",
        });
      }

      const response = await authService.sendLoginOtp(phone);

      return res.status(200).json({
        success: true,
        ...response,
      });
    } catch (error: any) {
      // Return appropriate status code based on error type
      const statusCode = error.statusCode || 400;
      return res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to send OTP",
      });
    }
  }

  async verifyLoginOtp(req: Request, res: Response) {
    try {
      const { phone, otp } = req.body;

      const response = await authService.verifyLoginOtp(phone, otp);

      res.cookie("auth_token", response.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax", // Use "lax" for localhost compatibility
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/",
      });

      return res.status(200).json({
        success: true,
        message: response.message,
        role: response.role,
        user: response.owner,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getMe(req: Request, res: Response) {
    try {
      console.log("[AUTH /me] Request received:", {
        hasUser: !!req.user,
        userId: req.user?.id,
        userRole: req.user?.role,
      });

      if (!req.user) {
        console.log("[AUTH /me] No user found - returning 401");
        return res.status(401).json({
          success: false,
          message: "Not authenticated",
        });
      }

      // Validate role before calling service
      if (req.user.role !== "USER" && req.user.role !== "ADMIN") {
        console.error("[AUTH /me] Invalid role:", req.user.role);
        return res.status(400).json({
          success: false,
          message: `Invalid role: ${req.user.role}. Expected USER or ADMIN.`,
        });
      }

      console.log("[AUTH /me] Calling authService.getMe with:", {
        id: req.user.id,
        role: req.user.role,
      });

      const response = await authService.getMe(req.user.id, req.user.role);

      console.log("[AUTH /me] Success - returning user data");
      return res.status(200).json({
        success: true,
        user: response,
      });
    } catch (error: any) {
      console.error("[AUTH /me] Error:", {
        message: error.message,
        statusCode: error.statusCode,
        errorCode: error.code,
        errorName: error.name,
        stack: error.stack,
      });

      // Check if it's a database connection error
      // Prisma error codes: https://www.prisma.io/docs/reference/api-reference/error-reference
      const isDatabaseError =
        error.code === "P1001" || // Can't reach database server
        error.code === "P1002" || // Database connection timeout
        error.code === "P1003" || // Database does not exist
        error.code === "P1008" || // Operations timed out
        error.code === "P1017" || // Server has closed the connection
        error.code === "P2002" || // Unique constraint violation (might indicate DB issues)
        error.code === "P2024" || // Connection pool timeout
        error.code === "P2025" || // Record not found (but could be DB issue)
        error.message?.includes("Can't reach database server") ||
        error.message?.includes("database server") ||
        error.message?.includes("connection") ||
        error.message?.includes("timeout") ||
        error.name === "PrismaClientInitializationError" ||
        error.name === "PrismaClientKnownRequestError" ||
        (error.name === "Error" && error.message?.includes("prisma"));

      // Use error statusCode if available
      // Database errors should be 500 (server error), not 400 (client error)
      // Authentication errors (AppError with statusCode) should use that statusCode
      let statusCode = error.statusCode;

      if (!statusCode) {
        // If no statusCode, determine based on error type
        if (isDatabaseError) {
          statusCode = 500; // Server error - database unavailable
        } else {
          statusCode = 400; // Client error - invalid request
        }
      }

      return res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to get user information",
        ...(isDatabaseError && {
          errorType: "database_error",
          retryable: true,
        }),
      });
    }
  }
}

export const authController = new AuthController();
