import { generateSignedUrl } from "../util/cloudinary";

/**
 * Regenerate signed URL for file access
 * Signed URLs expire, so we need to regenerate them when files are accessed
 * @param file File object from database
 * @returns File object with regenerated signed URL
 */
export function regenerateFileSignedUrl(file: {
  id: string;
  url: string;
  publicId: string | null;
  fileName: string;
  mimeType: string;
  sizeInBytes: number;
  [key: string]: any;
}): {
  id: string;
  url: string;
  publicId: string | null;
  fileName: string;
  mimeType: string;
  sizeInBytes: number;
  [key: string]: any;
} {
  if (!file.publicId) {
    // If no publicId, return original URL (might be external URL)
    return file;
  }

  try {
    // Determine resource type from mimeType
    let resourceType: "image" | "raw" | "video" | "auto" = "image";
    if (file.mimeType) {
      if (file.mimeType === "application/pdf") {
        resourceType = "raw";
      } else if (file.mimeType.startsWith("video/")) {
        resourceType = "video";
      } else if (file.mimeType.startsWith("image/")) {
        resourceType = "image";
      } else {
        // For other file types, use raw
        resourceType = "raw";
      }
    }

    // Regenerate signed URL (expires in 1 year)
    const signedUrl = generateSignedUrl(
      file.publicId,
      365 * 24 * 60 * 60,
      resourceType
    );
    return {
      ...file,
      url: signedUrl, // Replace with fresh signed URL
    };
  } catch (error: any) {
    console.error("[FILE URL] Failed to generate signed URL:", error.message);
    // Return original URL if signed URL generation fails
    return file;
  }
}

/**
 * Regenerate signed URLs for multiple files
 */
export function regenerateFileSignedUrls(
  files: Array<{
    id: string;
    url: string;
    publicId: string | null;
    fileName: string;
    mimeType: string;
    sizeInBytes: number;
    [key: string]: any;
  }>
): Array<{
  id: string;
  url: string;
  publicId: string | null;
  fileName: string;
  mimeType: string;
  sizeInBytes: number;
  [key: string]: any;
}> {
  return files.map((file) => regenerateFileSignedUrl(file));
}
