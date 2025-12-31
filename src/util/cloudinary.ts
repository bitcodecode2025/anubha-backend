import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true, // Always use HTTPS
});

export default cloudinary;

// DELETE FUNCTION
export const deleteFromCloudinary = async (publicId: string) => {
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Cloudinary delete error:", err);
    return null;
  }
};

/**
 * Generate signed URL for secure file access
 * Signed URLs prevent unauthorized access by requiring authentication
 * Cloudinary signed URLs include a signature parameter that validates the URL
 * @param publicId Cloudinary public ID
 * @param expiresInSeconds Optional expiration time in seconds (default: 1 year)
 * @param resourceType Optional resource type: "image" | "raw" | "video" | "auto" (default: "image")
 * @param inline Optional flag to display inline (true) or force download (false). Default: true for raw files
 * @returns Signed URL
 */
export const generateSignedUrl = (
  publicId: string,
  expiresInSeconds: number = 365 * 24 * 60 * 60, // 1 year default
  resourceType: "image" | "raw" | "video" | "auto" = "image",
  inline: boolean = true
): string => {
  const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;

  // Generate signed URL with expiration
  // The signature ensures URL cannot be tampered with
  const options: any = {
    secure: true,
    sign_url: true, // Generate signed URL with signature parameter
    expires_at: expiresAt, // URL expires after this timestamp
    resource_type: resourceType, // Specify resource type (image, raw, video, etc.)
  };

  // For raw files (like PDFs), add flags to control inline viewing vs download
  if (resourceType === "raw") {
    // Use 'attachment' flag to control download behavior
    // attachment:false = display inline (preview in browser)
    // attachment:true = force download
    options.flags = inline ? "attachment:false" : "attachment:true";
  }

  // Only add transformations for images (not for raw files like PDFs)
  if (resourceType === "image") {
    options.transformation = [
      {
        quality: "auto:best",
        fetch_format: "auto",
      },
    ];
  }

  return cloudinary.url(publicId, options);
};

/**
 * Generate unsigned URL (for public access when needed)
 * Use with caution - only for truly public content
 * @param publicId Cloudinary public ID
 * @returns Unsigned URL
 */
export const generateUnsignedUrl = (publicId: string): string => {
  return cloudinary.url(publicId, {
    secure: true,
    sign_url: false,
    transformation: [
      {
        quality: "auto:best",
        fetch_format: "auto",
      },
    ],
  });
};

/**
 * Upload PDF to Cloudinary with standardized settings
 * Reduces code duplication across PDF upload endpoints
 * @param filePathOrBase64 Local file path or Base64-encoded PDF data
 * @param options Upload configuration options
 * @returns Cloudinary upload result with secure_url
 */
export const uploadPDFToCloudinary = async (
  filePathOrBase64: string,
  options: {
    folder: string;
    publicId: string;
    context?: Record<string, string>;
  }
): Promise<{ secure_url: string; public_id: string; [key: string]: any }> => {
  try {
    const result = await cloudinary.uploader.upload(filePathOrBase64, {
      folder: options.folder,
      resource_type: "auto", // Auto-detect file type → serves with Content-Type: application/pdf
      public_id: options.publicId,
      access_mode: "public", // Make PDF publicly accessible for inline viewing
      use_filename: true,
      unique_filename: false,
      context: options.context || {},
    });

    return result;
  } catch (error: any) {
    console.error("[CLOUDINARY] PDF upload failed:", error);
    throw new Error(
      `Cloudinary upload failed: ${error.message || "Unknown error"}`
    );
  }
};

/**
 * Upload image to Cloudinary with standardized settings
 * @param filePathOrBase64 Local file path or Base64-encoded image data
 * @param options Upload configuration options
 * @returns Cloudinary upload result with secure_url
 */
export const uploadImageToCloudinary = async (
  filePathOrBase64: string,
  options: {
    folder: string;
    publicId: string;
    context?: Record<string, string>;
  }
): Promise<{ secure_url: string; public_id: string; [key: string]: any }> => {
  try {
    const result = await cloudinary.uploader.upload(filePathOrBase64, {
      folder: options.folder,
      resource_type: "image",
      public_id: options.publicId,
      access_mode: "public",
      use_filename: true,
      unique_filename: false,
      transformation: [
        {
          quality: "auto:best",
          fetch_format: "auto",
        },
      ],
      context: options.context || {},
    });

    return result;
  } catch (error: any) {
    console.error("[CLOUDINARY] Image upload failed:", error);
    throw new Error(
      `Cloudinary upload failed: ${error.message || "Unknown error"}`
    );
  }
};
