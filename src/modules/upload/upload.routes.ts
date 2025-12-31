import { Router } from "express";
import imageUpload from "../../middleware/multerConfig";
import { uploadImageToCloudinary, uploadPDFHandler } from "./upload.controller";
import { requireAuth } from "../../middleware/requireAuth";
import { validateFileContentMiddleware } from "../../middleware/validateFileContent";
import { validateTotalFileSizeMiddleware } from "../../middleware/validateFileSize";
import { fileUploadLimiter, generalLimiter } from "../../middleware/rateLimit";
import multer from "multer";

const uploadRoutes = Router();

// Apply general rate limiting to all upload routes
uploadRoutes.use(generalLimiter);

// Configure multer for PDF uploads
const pdfUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 15, // Max 15 files
  },
  fileFilter: (req, file, cb) => {
    // Only accept PDF files
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

uploadRoutes.post(
  "/image",
  fileUploadLimiter, // Strict rate limiting for file uploads
  requireAuth,
  imageUpload.array("files", 10),
  validateTotalFileSizeMiddleware, // Validate per-file and total size limits
  validateFileContentMiddleware, // Validate file content matches MIME type (magic bytes)
  uploadImageToCloudinary
);

uploadRoutes.post(
  "/pdf",
  fileUploadLimiter, // Strict rate limiting for file uploads
  requireAuth,
  pdfUpload.array("files", 15),
  validateTotalFileSizeMiddleware, // Validate per-file and total size limits
  uploadPDFHandler
);

// Error handling middleware for multer errors
uploadRoutes.use((error: any, req: any, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    // Multer-specific errors
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large. Maximum size is 10MB per file.",
      });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Too many files. Maximum 15 files allowed.",
      });
    }
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        message: "Unexpected file field.",
      });
    }
    return res.status(400).json({
      success: false,
      message: error.message || "File upload error.",
    });
  } else if (error) {
    // Other errors (like file type validation from fileFilter)
    return res.status(400).json({
      success: false,
      message: error.message || "File upload failed.",
    });
  }
  next();
});

export default uploadRoutes;
