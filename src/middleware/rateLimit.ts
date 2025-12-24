import rateLimit from "express-rate-limit";

/**
 * Rate Limiters for Different Endpoint Types
 * Prevents DoS attacks and abuse
 */

// OTP Endpoints - Strict rate limiting
export const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // Max 5 OTP requests per 5 minutes (corrected from 100)
  message: {
    success: false,
    message: "Too many OTP requests. Please wait a moment.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false, // Count all requests, even successful ones
});

// Patient Form Submissions - Moderate rate limiting
export const patientLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // allow 5 patient form submissions per minute
  message: {
    success: false,
    message: "Too many patient submissions. Please wait a moment.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Payment Endpoints - Very strict rate limiting (critical for security)
export const paymentLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Max 10 payment requests per minute
  message: {
    success: false,
    message:
      "Too many payment requests. Please wait a moment before trying again.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

// Payment Verification - Even stricter (most critical)
export const paymentVerifyLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Max 5 payment verifications per minute
  message: {
    success: false,
    message: "Too many payment verification attempts. Please wait a moment.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

// Appointment Creation - Moderate rate limiting
export const appointmentCreateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Max 10 appointment creations per minute
  message: {
    success: false,
    message: "Too many appointment creation requests. Please wait a moment.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Appointment Updates - Moderate rate limiting
export const appointmentUpdateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // Max 20 appointment updates per minute
  message: {
    success: false,
    message: "Too many appointment update requests. Please wait a moment.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API Rate Limiter - Applied to all endpoints by default
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per 15 minutes per IP
  message: {
    success: false,
    message: "Too many requests from this IP. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

// File Upload Rate Limiter - Strict (file uploads are resource-intensive)
export const fileUploadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Max 10 file uploads per minute
  message: {
    success: false,
    message: "Too many file upload requests. Please wait a moment.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Admin Endpoints - Moderate rate limiting
export const adminLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Max 30 admin requests per minute
  message: {
    success: false,
    message: "Too many admin requests. Please wait a moment.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth Endpoints - Moderate rate limiting (login, signup, session-sync)
// Note: session-sync should be called once per login, but we allow more for retries
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Increased from 20 to 50 to allow for session-sync retries and multiple tabs
  message: {
    success: false,
    message: "Too many authentication attempts. Please wait a moment.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests - only failures count
});
