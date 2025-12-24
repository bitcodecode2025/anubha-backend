import { z } from "zod";

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^[0-9+ ]+$/, "Phone number contains invalid characters.")
  .transform((val) => val.replace(/\D/g, ""))
  .refine((val) => val.length === 10 || val.length === 12, {
    message: "Phone must be 10 digits or 12 digits with country code.",
  })
  .transform((val) => {
    if (val.length === 10) return "91" + val;
    return val;
  });

export const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters long.")
  .max(100, "Name must be less than 100 characters")
  .refine((val) => val.length <= 100, {
    message: "Name exceeds maximum length of 100 characters",
  });

export const otpSchema = z
  .string()
  .trim()
  .regex(/^[0-9]{4,6}$/, "OTP must be a 4–6 digit numeric code.");

export const sendRegisterOtpSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
});

export const verifyRegisterOtpSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  otp: otpSchema,
});

export const sendLoginOtpSchema = z.object({
  phone: phoneSchema,
});

export const verifyLoginOtpSchema = z.object({
  phone: phoneSchema,
  otp: otpSchema,
});

/* ---------------- PASSWORD-BASED AUTH SCHEMAS ---------------- */
export const signupWithPasswordSchema = z.object({
  name: nameSchema,
  phone: z
    .union([phoneSchema, z.null(), z.undefined()])
    .optional()
    .transform((val) => {
      // Convert null or empty string to undefined
      if (val === null || val === undefined || val === "") {
        return undefined;
      }
      return val;
    }),
  email: z.string().trim().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password must be less than 100 characters"),
});

export const loginWithPasswordSchema = z.object({
  identifier: z.string().trim().min(1, "Email or phone is required"),
  password: z.string().min(1, "Password is required"),
});

export const googleAuthSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  name: nameSchema,
  googleId: z.string().optional(),
});

/* ---------------- PROFILE UPDATE SCHEMAS ---------------- */
/**
 * Schema for updating user phone number
 * - phone can be a valid phone number (to add/update)
 * - phone can be null or empty string (to delete/remove)
 */
export const updatePhoneSchema = z.object({
  phone: z
    .union([
      phoneSchema, // Valid phone number
      z.string().length(0), // Empty string (delete)
      z.null(), // Null (delete)
    ])
    .optional()
    .transform((val) => {
      // Convert empty string to null for deletion
      if (val === "" || val === null || val === undefined) {
        return null;
      }
      return val;
    }),
});

/* ---------------- FORGOT PASSWORD SCHEMA ---------------- */
export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password must be less than 100 characters"),
});

/* ---------------- LINK PHONE SCHEMAS ---------------- */
export const sendLinkPhoneEmailOtpSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  phone: phoneSchema,
});

export const verifyLinkPhoneEmailOtpSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  phone: phoneSchema,
  otp: otpSchema,
});

/* ---------------- ADD EMAIL SCHEMAS ---------------- */
export const sendAddEmailOtpSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
});

export const verifyAddEmailOtpSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  otp: otpSchema,
});
