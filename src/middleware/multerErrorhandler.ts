import { Request, Response, NextFunction } from "express";
import multer from "multer";

export const multerErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: "File too large! Maximum allowed size is 10MB.",
      });
    }

    return res.status(400).json({
      error: `Multer error: ${err.message}`,
    });
  }

  if (err.name === "MulterFileTypeError") {
    // Use the error message from the file filter (which is more specific)
    return res.status(400).json({
      error: err.message || "Invalid file type.",
    });
  }

  next(err);
};
