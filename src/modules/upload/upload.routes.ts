import { Router } from "express";
import imageUpload from "../../middleware/multerConfig";
import { uploadImageToCloudinary } from "./upload.controller";
import { requireAuth } from "../../middleware/requireAuth";
import { validateFileContentMiddleware } from "../../middleware/validateFileContent";
import { validateTotalFileSizeMiddleware } from "../../middleware/validateFileSize";
import { fileUploadLimiter, generalLimiter } from "../../middleware/rateLimit";

const uploadRoutes = Router();

// Apply general rate limiting to all upload routes
uploadRoutes.use(generalLimiter);

uploadRoutes.post(
  "/image",
  fileUploadLimiter, // Strict rate limiting for file uploads
  requireAuth,
  imageUpload.array("files", 10),
  validateTotalFileSizeMiddleware, // Validate per-file and total size limits
  validateFileContentMiddleware, // Validate file content matches MIME type (magic bytes)
  uploadImageToCloudinary
);

export default uploadRoutes;
