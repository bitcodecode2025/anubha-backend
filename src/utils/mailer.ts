import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Ensure environment variables are loaded
dotenv.config();

/**
 * Gmail SMTP Mailer Utility
 * Configures Nodemailer with Gmail SMTP for sending emails
 */

// Get email credentials from environment variables
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// Validate email configuration
if (!EMAIL_USER || !EMAIL_PASS) {
  console.warn(
    "[MAILER] ⚠️ EMAIL_USER or EMAIL_PASS not configured in environment variables"
  );
  console.warn("[MAILER] Email sending will be disabled");
}

// Create transporter instance with Gmail SMTP configuration
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

/**
 * Verify SMTP connection during server startup
 * Logs connection status for debugging
 */
export async function verifyMailerConnection(): Promise<void> {
  if (!EMAIL_USER || !EMAIL_PASS) {
    console.warn(
      "[MAILER] ⚠️ Email credentials not configured. Skipping verification."
    );
    return;
  }

  try {
    await transporter.verify();
    console.log("[MAILER] ✅ SMTP connection verified successfully");
    console.log("[MAILER] Email service ready (Gmail SMTP)");
  } catch (error: any) {
    console.error("[MAILER] ❌ SMTP connection verification failed:");
    console.error("[MAILER] Error:", error.message);
    console.error(
      "[MAILER] Please check your EMAIL_USER and EMAIL_PASS environment variables"
    );
    console.error(
      "[MAILER] For Gmail, you may need to use an App Password instead of your regular password"
    );
  }
}

/**
 * Send password reset email
 * @param to - Recipient email address
 * @param resetLink - Password reset link with token
 * @returns Promise<boolean> - true if email sent successfully, false otherwise
 */
export async function sendPasswordResetEmail(
  to: string,
  resetLink: string
): Promise<boolean> {
  if (!EMAIL_USER || !EMAIL_PASS) {
    console.error(
      "[MAILER] Cannot send email: EMAIL_USER or EMAIL_PASS not configured"
    );
    return false;
  }

  try {
    const mailOptions = {
      from: `"Anubha Nutrition Clinic" <${EMAIL_USER}>`,
      to: to,
      subject: "Reset your password",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Reset Your Password</h1>
            </div>
            
            <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; margin-bottom: 20px;">
                Hello,
              </p>
              
              <p style="font-size: 16px; margin-bottom: 20px;">
                We received a request to reset your password for your Anubha Nutrition Clinic account.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" 
                   style="display: inline-block; background-color: #10b981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                  Reset Password
                </a>
              </div>
              
              <p style="font-size: 14px; color: #6b7280; margin-top: 30px; margin-bottom: 10px;">
                Or copy and paste this link into your browser:
              </p>
              <p style="font-size: 12px; color: #9ca3af; word-break: break-all; background: #f9fafb; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
                ${resetLink}
              </p>
              
              <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <p style="font-size: 14px; color: #92400e; margin: 0;">
                  <strong>⚠️ Important:</strong> This link will expire in <strong>15 minutes</strong> for security reasons.
                </p>
              </div>
              
              <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
                If you did not request a password reset, please ignore this email. Your password will remain unchanged.
              </p>
              
              <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
                Best regards,<br>
                <strong>Anubha Nutrition Clinic</strong>
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 20px; padding: 20px; color: #9ca3af; font-size: 12px;">
              <p style="margin: 0;">This is an automated email. Please do not reply.</p>
            </div>
          </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("[MAILER] ✅ Password reset email sent successfully");
    console.log("[MAILER] Message ID:", info.messageId);
    return true;
  } catch (error: any) {
    console.error("[MAILER] ❌ Failed to send password reset email:");
    console.error("[MAILER] Error:", error.message);
    console.error("[MAILER] Recipient:", to);
    // Don't throw error - log only to prevent breaking the response
    return false;
  }
}

/**
 * Send email OTP for adding email to phone-only account
 * @param to - Recipient email address
 * @param otp - 4-digit OTP code
 * @returns Promise<boolean> - true if email sent successfully, false otherwise
 */
export async function sendAddEmailVerificationOtp(
  to: string,
  otp: string
): Promise<boolean> {
  if (!EMAIL_USER || !EMAIL_PASS) {
    console.error(
      "[MAILER] Cannot send email: EMAIL_USER or EMAIL_PASS not configured"
    );
    return false;
  }

  try {
    const mailOptions = {
      from: `"Anubha Nutrition Clinic" <${EMAIL_USER}>`,
      to: to,
      subject: "Verify Your Email Address - Verification Code",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email Address</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Verify Your Email Address</h1>
            </div>
            
            <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; margin-bottom: 20px;">
                Hello,
              </p>
              
              <p style="font-size: 16px; margin-bottom: 20px;">
                You requested to add and verify your email address to your Anubha Nutrition Clinic account. Please use the verification code below to complete the process.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <div style="background: #f0fdf4; border: 2px solid #10b981; border-radius: 8px; padding: 20px; display: inline-block;">
                  <p style="font-size: 12px; color: #6b7280; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
                  <p style="font-size: 36px; font-weight: bold; color: #10b981; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                    ${otp}
                  </p>
                </div>
              </div>
              
              <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <p style="font-size: 14px; color: #92400e; margin: 0;">
                  <strong>⚠️ Important:</strong> This code will expire in <strong>10 minutes</strong> for security reasons.
                </p>
              </div>
              
              <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
                If you did not request to add this email address, please ignore this email. Your account remains secure.
              </p>
              
              <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
                Best regards,<br>
                <strong>Anubha Nutrition Clinic</strong>
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 20px; padding: 20px; color: #9ca3af; font-size: 12px;">
              <p style="margin: 0;">This is an automated email. Please do not reply.</p>
            </div>
          </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("[MAILER] ✅ Email verification OTP sent successfully");
    console.log("[MAILER] Message ID:", info.messageId);
    return true;
  } catch (error: any) {
    console.error("[MAILER] ❌ Failed to send email verification OTP:");
    console.error("[MAILER] Error:", error.message);
    console.error("[MAILER] Recipient:", to);
    return false;
  }
}

/**
 * Send email OTP for linking phone to existing account
 * @param to - Recipient email address
 * @param otp - 4-digit OTP code
 * @returns Promise<boolean> - true if email sent successfully, false otherwise
 */
export async function sendEmailOtp(to: string, otp: string): Promise<boolean> {
  if (!EMAIL_USER || !EMAIL_PASS) {
    console.error(
      "[MAILER] Cannot send email: EMAIL_USER or EMAIL_PASS not configured"
    );
    return false;
  }

  try {
    const mailOptions = {
      from: `"Anubha Nutrition Clinic" <${EMAIL_USER}>`,
      to: to,
      subject: "Link Your Phone Number - Verification Code",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Link Your Phone Number</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Link Your Phone Number</h1>
            </div>
            
            <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; margin-bottom: 20px;">
                Hello,
              </p>
              
              <p style="font-size: 16px; margin-bottom: 20px;">
                You requested to link a phone number to your Anubha Nutrition Clinic account. Please use the verification code below to complete the process.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <div style="background: #f0fdf4; border: 2px solid #10b981; border-radius: 8px; padding: 20px; display: inline-block;">
                  <p style="font-size: 12px; color: #6b7280; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
                  <p style="font-size: 36px; font-weight: bold; color: #10b981; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                    ${otp}
                  </p>
                </div>
              </div>
              
              <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <p style="font-size: 14px; color: #92400e; margin: 0;">
                  <strong>⚠️ Important:</strong> This code will expire in <strong>10 minutes</strong> for security reasons.
                </p>
              </div>
              
              <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
                If you did not request to link a phone number, please ignore this email. Your account remains secure.
              </p>
              
              <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
                Best regards,<br>
                <strong>Anubha Nutrition Clinic</strong>
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 20px; padding: 20px; color: #9ca3af; font-size: 12px;">
              <p style="margin: 0;">This is an automated email. Please do not reply.</p>
            </div>
          </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("[MAILER] ✅ Email OTP sent successfully");
    console.log("[MAILER] Message ID:", info.messageId);
    return true;
  } catch (error: any) {
    console.error("[MAILER] ❌ Failed to send email OTP:");
    console.error("[MAILER] Error:", error.message);
    console.error("[MAILER] Recipient:", to);
    return false;
  }
}
