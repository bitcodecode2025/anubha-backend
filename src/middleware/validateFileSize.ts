import { Request, Response, NextFunction } from "express";

/**
 * Middleware to validate total file size across all uploaded files
 * Prevents DoS attacks via multiple large files
 */
export function validateTotalFileSizeMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB total
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per file

  try {
    let totalSize = 0;
    const files: Express.Multer.File[] = [];

    // Collect all files
    if (req.file) {
      files.push(req.file);
    }
    if (req.files && Array.isArray(req.files)) {
      files.push(...req.files);
    }

    // Validate per-file size and calculate total
    for (const file of files) {
      // Check per-file size limit
      if (file.size > MAX_FILE_SIZE) {
        return res.status(400).json({
          success: false,
          error: `File "${file.originalname}" exceeds maximum size of ${
            MAX_FILE_SIZE / (1024 * 1024)
          }MB per file`,
        });
      }

      // Check for empty files
      if (file.size === 0) {
        return res.status(400).json({
          success: false,
          error: `File "${file.originalname}" is empty`,
        });
      }

      totalSize += file.size;
    }

    // Check total size limit
    if (totalSize > MAX_TOTAL_SIZE) {
      return res.status(400).json({
        success: false,
        error: `Total file size (${(totalSize / (1024 * 1024)).toFixed(
          2
        )}MB) exceeds maximum of ${MAX_TOTAL_SIZE / (1024 * 1024)}MB`,
      });
    }

    next();
  } catch (error: any) {
    console.error("[FILE SIZE VALIDATION] Error:", error.message);
    return res.status(400).json({
      success: false,
      error: "File size validation failed",
    });
  }
}
