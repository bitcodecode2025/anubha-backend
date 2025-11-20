import { Router } from "express";
import imageUpload from "../middleware/multerConfig";
import { uploadImageToCloudinary } from "../controllers/uploadController";

const uploadRoutes = Router();

uploadRoutes.post(
  "/image",
  imageUpload.array("files", 10),
  uploadImageToCloudinary
);

export default uploadRoutes;
