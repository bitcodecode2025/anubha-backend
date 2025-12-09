import { Request, Response, NextFunction } from "express";
import { validateFileUpload } from "../utils/fileValidator";

/**
 * Middleware to validate file content matches declared MIME type
 * This prevents MIME type spoofing attacks
 * Handles both single file (req.file) and multiple files (req.files)
 */
export function validateFileContentMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Default allowed types (images)
  const defaultAllowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];

  // For doctor notes routes, also allow PDFs
  const isDoctorNotesRoute = req.path.includes("/doctor-notes");
  const allowedMimeTypes = isDoctorNotesRoute
    ? [...defaultAllowedMimeTypes, "application/pdf"]
    : defaultAllowedMimeTypes;

  try {
    // Handle single file upload
    if (req.file) {
      validateFileUpload(req.file, allowedMimeTypes);
    }

    // Handle multiple file uploads
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        validateFileUpload(file, allowedMimeTypes);
      }
    }

    next();
  } catch (error: any) {
    console.error(
      "[FILE VALIDATION] File content validation failed:",
      error.message
    );
    return res.status(400).json({
      success: false,
      error: error.message || "Invalid file type",
    });
  }
}
