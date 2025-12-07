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
        stack: error.stack,
      });

      // Use error statusCode if available, otherwise default to 400
      const statusCode = error.statusCode || 400;
      return res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to get user information",
      });
    }
  }
}

export const authController = new AuthController();
