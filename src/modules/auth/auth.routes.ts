import { Router } from "express";
import { otpLimiter, authLimiter } from "../../middleware/rateLimit";
import { requireAuth } from "../../middleware/requireAuth";
import { authController } from "./auth.controller";
import { refreshSession } from "./refresh/auth.refresh";
import { logout } from "./utils/logout";
import { validateBody } from "../../middleware/validateRequest";

import {
  sendRegisterOtpSchema,
  verifyRegisterOtpSchema,
  sendLoginOtpSchema,
  verifyLoginOtpSchema,
  signupWithPasswordSchema,
  loginWithPasswordSchema,
  googleAuthSchema,
  updatePhoneSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  sendLinkPhoneEmailOtpSchema,
  verifyLinkPhoneEmailOtpSchema,
  sendAddEmailOtpSchema,
  verifyAddEmailOtpSchema,
  signupInitiateSchema,
  signupCompleteSchema,
  loginInitiateSchema,
  loginCompleteSchema
} from "./auth.schema";

const authRoutes = Router();

/* ---------------- OTP-BASED AUTH (INACTIVE BUT KEPT) ---------------- */
authRoutes.post(
  "/register/send-otp",
  otpLimiter,
  validateBody(sendRegisterOtpSchema),
  authController.sendRegisterOtp.bind(authController)
);

authRoutes.post(
  "/register/verify-otp",
  otpLimiter,
  validateBody(verifyRegisterOtpSchema),
  authController.verifyRegisterOtp.bind(authController)
);

authRoutes.post(
  "/login/send-otp",
  otpLimiter,
  validateBody(sendLoginOtpSchema),
  authController.sendLoginOtp.bind(authController)
);

authRoutes.post(
  "/login/verify-otp",
  otpLimiter,
  validateBody(verifyLoginOtpSchema),
  authController.verifyLoginOtp.bind(authController)
);

/* ---------------- UNIFIED AUTH ROUTES (NEW) ---------------- */
authRoutes.post(
  "/signup/initiate",
  authLimiter,
  validateBody(signupInitiateSchema),
  authController.signupInitiate.bind(authController)
);

authRoutes.post(
  "/signup/complete",
  authLimiter,
  validateBody(signupCompleteSchema),
  authController.signupComplete.bind(authController)
);

authRoutes.post(
  "/login/initiate",
  authLimiter,
  validateBody(loginInitiateSchema),
  authController.loginInitiate.bind(authController)
);

authRoutes.post(
  "/login/complete",
  authLimiter,
  validateBody(loginCompleteSchema),
  authController.loginComplete.bind(authController)
);

/* ---------------- PASSWORD-BASED AUTH (LEGACY - KEEPING FOR BACKWARD COMPAT IF NEEDED) ---------------- */
authRoutes.post(
  "/signup",
  authLimiter, // Rate limit: 20 requests per 15 min
  validateBody(signupWithPasswordSchema),
  authController.signupWithPassword.bind(authController)
);

authRoutes.post(
  "/login",
  authLimiter, // Rate limit: 20 requests per 15 min
  validateBody(loginWithPasswordSchema),
  authController.loginWithPassword.bind(authController)
);

authRoutes.post(
  "/forgot-password",
  authLimiter, // Rate limit: 20 requests per 15 min
  validateBody(forgotPasswordSchema),
  authController.forgotPassword.bind(authController)
);

authRoutes.post(
  "/reset-password",
  authLimiter, // Rate limit: 20 requests per 15 min
  validateBody(resetPasswordSchema),
  authController.resetPassword.bind(authController)
);

/* ---------------- GOOGLE AUTH (LEGACY) ---------------- */
authRoutes.post(
  "/google",
  authLimiter, // Rate limit: 20 requests per 15 min
  validateBody(googleAuthSchema),
  authController.googleAuth.bind(authController)
);

/* ---------------- SESSION MANAGEMENT ---------------- */
authRoutes.get("/session", refreshSession);
authRoutes.get("/me", authController.getMe.bind(authController));
authRoutes.post("/logout", logout);

/* ---------------- PROFILE MANAGEMENT ---------------- */
// Update user phone number (add, update, or delete)
// Requires authentication - only logged-in users can update their phone
authRoutes.patch(
  "/update-phone",
  authLimiter, // Rate limit: 20 requests per 15 min
  requireAuth, // Require authentication
  validateBody(updatePhoneSchema),
  authController.updatePhone.bind(authController)
);

/* ---------------- LINK PHONE TO EXISTING ACCOUNT ---------------- */
// Send email OTP to link phone number to existing account
authRoutes.post(
  "/link-phone/send-email-otp",
  authLimiter, // Rate limit: 20 requests per 15 min
  validateBody(sendLinkPhoneEmailOtpSchema),
  authController.sendLinkPhoneEmailOtp.bind(authController)
);

// Verify email OTP and link phone to existing account
authRoutes.post(
  "/link-phone/verify-email-otp",
  authLimiter, // Rate limit: 20 requests per 15 min
  validateBody(verifyLinkPhoneEmailOtpSchema),
  authController.verifyLinkPhoneEmailOtp.bind(authController)
);

/* ---------------- ADD EMAIL TO PHONE-ONLY ACCOUNT ---------------- */
// Send email OTP to add email to phone-only account
authRoutes.post(
  "/add-email/send-otp",
  authLimiter, // Rate limit: 20 requests per 15 min
  requireAuth, // Require authentication
  validateBody(sendAddEmailOtpSchema),
  authController.sendAddEmailOtp.bind(authController)
);

// Verify email OTP and add email to phone-only account
authRoutes.post(
  "/add-email/verify-otp",
  authLimiter, // Rate limit: 20 requests per 15 min
  requireAuth, // Require authentication
  validateBody(verifyAddEmailOtpSchema),
  authController.verifyAddEmailOtp.bind(authController)
);

/* ---------------- TOKEN VALIDATION ---------------- */
// Validates if auth_token cookie is valid
// Used by frontend to check token status before critical operations
authRoutes.get(
  "/validate-token",
  authController.validateToken.bind(authController)
);

export default authRoutes;
