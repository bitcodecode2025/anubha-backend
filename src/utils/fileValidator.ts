/**
 * File validation utilities
 * Validates file content using magic bytes (file signatures) to prevent MIME type spoofing
 */

// Magic bytes (file signatures) for common image formats and PDF
const MAGIC_BYTES: Record<string, number[][]> = {
  "image/jpeg": [
    [0xff, 0xd8, 0xff], // JPEG
  ],
  "image/jpg": [
    [0xff, 0xd8, 0xff], // JPEG (same as jpeg)
  ],
  "image/png": [
    [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], // PNG
  ],
  "application/pdf": [
    [0x25, 0x50, 0x44, 0x46], // PDF signature: %PDF
  ],
};

/**
 * Check if file buffer matches expected magic bytes for MIME type
 * @param buffer File buffer
 * @param mimeType Expected MIME type
 * @returns true if file content matches MIME type, false otherwise
 */
export function validateFileContent(buffer: Buffer, mimeType: string): boolean {
  if (!buffer || buffer.length === 0) {
    return false;
  }

  const expectedSignatures = MAGIC_BYTES[mimeType.toLowerCase()];
  if (!expectedSignatures) {
    // Unknown MIME type - reject for security
    console.warn(`[FILE VALIDATOR] Unknown MIME type: ${mimeType}`);
    return false;
  }

  // Check if buffer matches any of the expected signatures
  for (const signature of expectedSignatures) {
    if (buffer.length < signature.length) {
      continue;
    }

    let matches = true;
    for (let i = 0; i < signature.length; i++) {
      if (buffer[i] !== signature[i]) {
        matches = false;
        break;
      }
    }

    if (matches) {
      return true;
    }
  }

  return false;
}

/**
 * Validate file upload with both MIME type and content validation
 * @param file Multer file object
 * @param allowedMimeTypes Array of allowed MIME types
 * @returns true if valid, throws error if invalid
 */
export function validateFileUpload(
  file: Express.Multer.File,
  allowedMimeTypes: string[]
): void {
  if (!file || !file.buffer) {
    throw new Error("File buffer is required");
  }

  const mimeType = file.mimetype.toLowerCase();

  // Check MIME type
  if (!allowedMimeTypes.includes(mimeType)) {
    throw new Error(
      `Invalid MIME type: ${mimeType}. Allowed types: ${allowedMimeTypes.join(
        ", "
      )}`
    );
  }

  // Validate file content matches MIME type (prevent MIME type spoofing)
  if (!validateFileContent(file.buffer, mimeType)) {
    console.error(
      `[FILE VALIDATOR] File content does not match MIME type. MIME: ${mimeType}, Buffer start: ${Array.from(
        file.buffer.slice(0, 8)
      )
        .map((b) => `0x${b.toString(16).padStart(2, "0")}`)
        .join(" ")}`
    );
    throw new Error(
      `File content does not match declared MIME type. Possible file type spoofing detected.`
    );
  }
}
