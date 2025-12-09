import multer from "multer";
import { validateFileUpload } from "../utils/fileValidator";

const storage = multer.memoryStorage();

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Allow only JPG, PNG, JPEG images
  const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];

  // Basic MIME type check
  if (!allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
    const error = new Error("Only JPG, PNG, and JPEG images are allowed!");
    error.name = "MulterFileTypeError";
    return cb(error);
  }

  if (file.size === 0) {
    const error = new Error("Uploaded file is empty");
    return cb(error);
  }

  // Note: File content validation happens after multer processes the file
  // We'll validate magic bytes in the route handler after file is uploaded
  cb(null, true);
};

// File size limits
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per file
const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB total for all files
const MAX_FILES = 10; // Maximum number of files

const limits = {
  fileSize: MAX_FILE_SIZE, // Per-file limit
  files: MAX_FILES, // Maximum number of files
};

const imageUpload = multer({
  storage,
  fileFilter,
  limits,
});

export default imageUpload;
