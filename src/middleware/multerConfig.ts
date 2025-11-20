import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (!file.mimetype.startsWith("image/")) {
    const error = new Error("Only image files are allowed!");
    error.name = "MulterFileTypeError";
    return cb(error);
  }

  if (file.size === 0) {
    const error = new Error("Uploaded file is empty");
    return cb(error);
  }

  cb(null, true);
};

const limits = { fileSize: 10 * 1024 * 1024 }; // 10MB

const imageUpload = multer({
  storage,
  fileFilter,
  limits,
});

export default imageUpload;
