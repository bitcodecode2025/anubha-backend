import { Request, Response } from "express";
import cloudinary from "../util/cloudinary";

export const uploadImageToCloudinary = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    // Convert file buffer to Base64 for Cloudinary
    const fileBase64 = `data:${file.mimetype};base64,${file.buffer.toString(
      "base64"
    )}`;

    // Upload to Cloudinary (optimized)
    const uploadResult = await cloudinary.uploader.upload(fileBase64, {
      folder: "nutriwell_images",
      resource_type: "image",
      transformation: [
        {
          quality: "auto:best", // ✅ automatically picks best compression
          fetch_format: "auto", // ✅ delivers WebP/AVIF for browsers
          crop: "limit", // ✅ limits resize without cutting content
          width: 2000, // ✅ max width for high-quality display
          height: 2000, // ✅ prevents oversized uploads
        },
      ],
    });

    // Build response
    const response = {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      fileName: file.originalname,
      mimeType: file.mimetype,
      sizeInBytes: file.size,
    };

    res.status(200).json({
      message: "Image uploaded successfully ✅",
      file: response,
    });
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);

    // Optional: handle Multer file size limit error
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "File too large. Max size is 10MB." });
    }

    res.status(500).json({ error: "Image upload failed" });
  }
};
