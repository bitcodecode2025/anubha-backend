// import multer from "multer";

// const ALLOWED_IMAGE_TYPES = ["image/jpg", "image/jpeg", "image/png"];

// // Configure Multer for in-memory storage (no temp files)
// const storage = multer.memoryStorage();

// // File filter – only allow JPG, JPEG, PNG
// const fileFilter = (
//   req: Express.Request,
//   file: Express.Multer.File,
//   cb: multer.FileFilterCallback
// ) => {
//   if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
//     const error = new Error("Only JPG, JPEG, and PNG files are allowed!");
//     error.name = "MulterFileTypeError";
//     return cb(error);
//   }
//   cb(null, true);
// };

// // 10MB limit for images
// const limits = { fileSize: 10 * 1024 * 1024 };

// const imageUpload = multer({
//   storage,
//   fileFilter,
//   limits,
// });

// export default imageUpload;
