import multer from "multer";

/**
 * Multer configuration for PDF uploads (doctor notes)
 * Allows PDF files up to 10MB
 */
const storage = multer.memoryStorage();

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Allow PDF files for doctor notes
  const allowedMimeTypes = ["application/pdf"];

  // Basic MIME type check
  if (!allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
    const error = new Error("Only PDF files are allowed!");
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

// File size limits for PDFs
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per file
const MAX_FILES = 10; // Maximum number of PDF files

const limits = {
  fileSize: MAX_FILE_SIZE, // Per-file limit
  files: MAX_FILES, // Allow multiple PDF files
};

const pdfUpload = multer({
  storage,
  fileFilter,
  limits,
});

export default pdfUpload;
