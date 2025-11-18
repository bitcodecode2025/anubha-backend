import { Request, Response } from "express";
import { authService } from "./auth.service";

export class AuthController {
  /**
   * ---------------------------------------
   * REGISTER → SEND OTP
   * ---------------------------------------
   */
  async sendRegisterOtp(req: Request, res: Response) {
    try {
      const { name, email } = req.body;

      if (!name || !email) {
        return res.status(400).json({
          success: false,
          message: "Name and email are required.",
        });
      }

      const response = await authService.sendRegisterOtp(name, email);

      return res.status(200).json({
        success: true,
        ...response,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * ---------------------------------------
   * REGISTER → VERIFY OTP
   * ---------------------------------------
   */
  async verifyRegisterOtp(req: Request, res: Response) {
    try {
      const { name, email, otp } = req.body;

      if (!name || !email || !otp) {
        return res.status(400).json({
          success: false,
          message: "Name, email & OTP are required.",
        });
      }

      const response = await authService.verifyRegisterOtp(name, email, otp);

      return res.status(200).json({
        success: true,
        ...response,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * ---------------------------------------
   * LOGIN → SEND OTP
   * ---------------------------------------
   */
  async sendLoginOtp(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required.",
        });
      }

      const response = await authService.sendLoginOtp(email);

      return res.status(200).json({
        success: true,
        ...response,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * ---------------------------------------
   * LOGIN → VERIFY OTP
   * ---------------------------------------
   */
  async verifyLoginOtp(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({
          success: false,
          message: "Email & OTP are required.",
        });
      }

      const response = await authService.verifyLoginOtp(email, otp);

      return res.status(200).json({
        success: true,
        ...response,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export const authController = new AuthController();
