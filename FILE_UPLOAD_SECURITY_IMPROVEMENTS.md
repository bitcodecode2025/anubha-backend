# File Upload Security Improvements

This document outlines the file upload security enhancements implemented to prevent malicious file uploads, DoS attacks, and unauthorized file access.

## Issues Fixed

### 1. No File Content Validation

**Issue:** Malicious files could be uploaded as images.

**Location:** `src/modules/upload/upload.controller.ts:20`

**Risk:** XSS, malware distribution

**Solution:**

- Implemented magic byte (file signature) validation
- Validates file content matches declared MIME type
- Prevents MIME type spoofing attacks
- Already implemented in previous fixes, verified to be in use

**Magic Bytes Validated:**

- JPEG/JPG: `0xFF 0xD8 0xFF`
- PNG: `0x89 0x50 0x4E 0x47 0x0D 0x0A 0x1A 0x0A`

**Implementation:**

- `src/utils/fileValidator.ts` - Magic byte validation utility
- `src/middleware/validateFileContent.ts` - File content validation middleware
- Applied to upload routes via `validateFileContentMiddleware`

### 2. No File Size Validation Per File

**Issue:** Multiple files could exceed total limit.

**Location:** `src/middleware/multerConfig.ts:27`

**Risk:** DoS via large files

**Current:** 10MB limit exists per file

**Edge Case:** Multiple files could exceed total limit

**Solution:**

- Added per-file size validation (10MB per file)
- Added total size validation (50MB total for all files)
- Added maximum file count limit (10 files)
- Validation happens in middleware before processing

**Limits:**

- Per-file: 10MB
- Total size: 50MB
- Maximum files: 10

**Implementation:**

- `src/middleware/validateFileSize.ts` - Total file size validation middleware
- Applied to upload routes via `validateTotalFileSizeMiddleware`
- Validates both per-file and total size limits

### 3. Cloudinary Public ID Exposure

**Issue:** Public IDs could be guessed, leading to unauthorized file access.

**Location:** `src/modules/upload/upload.controller.ts:37`

**Risk:** Unauthorized file access

**Solution:**

- Generate unique public IDs with timestamp and random string
- Use signed URLs for file access
- Regenerate signed URLs when files are accessed
- Signed URLs include signature parameter to prevent tampering

**Security Measures:**

1. **Unique Public IDs:** `nutriwell_{timestamp}_{randomString}`

   - Timestamp prevents sequential guessing
   - Random string adds entropy
   - Makes public IDs unpredictable

2. **Signed URLs:** Generated with `sign_url: true`

   - Includes signature parameter
   - Validated by Cloudinary server-side
   - Prevents URL tampering

3. **URL Regeneration:** Signed URLs regenerated when files are accessed
   - Ensures URLs are always valid
   - Prevents expired URL access
   - Maintains security over time

**Implementation:**

- `src/util/cloudinary.ts` - Added `generateSignedUrl()` function
- `src/utils/fileUrlHelper.ts` - Helper to regenerate signed URLs
- `src/modules/upload/upload.controller.ts` - Uses signed URLs for uploads
- `src/modules/patient/patient.service.ts` - Regenerates signed URLs when files are accessed

## Security Features

### 1. File Content Validation

- Magic byte validation prevents MIME type spoofing
- Validates file content matches declared type
- Rejects files with mismatched content

### 2. File Size Limits

- Per-file limit: 10MB
- Total size limit: 50MB
- Maximum file count: 10
- Prevents DoS attacks via large files

### 3. Secure File Access

- Unique public IDs prevent guessing
- Signed URLs prevent unauthorized access
- URL regeneration ensures validity
- Signature validation prevents tampering

## Files Created

1. `src/middleware/validateFileSize.ts` - Total file size validation middleware
2. `src/utils/fileUrlHelper.ts` - Helper to regenerate signed URLs

## Files Modified

1. `src/middleware/multerConfig.ts` - Added file count limit and comments
2. `src/modules/upload/upload.routes.ts` - Added file size validation middleware
3. `src/modules/upload/upload.controller.ts` - Added per-file validation, unique public IDs, signed URLs
4. `src/util/cloudinary.ts` - Added signed URL generation functions
5. `src/modules/patient/patient.service.ts` - Regenerates signed URLs when files are accessed

## Upload Flow

1. **Request received** → Authentication check
2. **Multer processes files** → Per-file size check (10MB limit)
3. **Total size validation** → Total size check (50MB limit)
4. **File content validation** → Magic byte validation
5. **Upload to Cloudinary** → Unique public ID generation
6. **Generate signed URL** → Secure URL with signature
7. **Store in database** → Save signed URL and public ID

## File Access Flow

1. **File requested** → Authentication check
2. **Authorization check** → Verify user has access
3. **Regenerate signed URL** → Fresh signed URL with expiration
4. **Return to client** → Secure, time-limited URL

## Testing

### Test File Content Validation

1. Upload file with fake MIME type (e.g., rename .exe to .jpg)
2. Verify file is rejected
3. Check magic bytes are validated

### Test File Size Limits

1. Upload file > 10MB
2. Verify per-file limit error
3. Upload multiple files totaling > 50MB
4. Verify total size limit error

### Test Public ID Security

1. Upload file and note public ID
2. Try to guess another public ID
3. Verify guessing is difficult (timestamp + random)
4. Verify signed URLs require signature

### Test Signed URL Access

1. Access file via API
2. Verify signed URL is generated
3. Verify URL includes signature parameter
4. Test URL expiration (if implemented)

## Best Practices

1. **Always validate file content** - Don't trust MIME types, verify magic bytes
2. **Set appropriate size limits** - Per-file and total limits prevent DoS
3. **Use unique public IDs** - Prevent guessing attacks
4. **Use signed URLs** - Prevent unauthorized access
5. **Regenerate URLs** - Ensure URLs are always valid
6. **Log file uploads** - Track uploads for security monitoring

## Monitoring

Monitor the following:

- `[FILE VALIDATION]` - File content validation failures
- `[FILE SIZE VALIDATION]` - File size limit violations
- `[UPLOAD]` - File upload errors
- `[FILE URL]` - Signed URL generation failures

## Performance Impact

### File Size Validation

- Minimal overhead (size check is fast)
- Prevents DoS attacks
- Protects server resources

### Magic Byte Validation

- Minimal overhead (checks first few bytes)
- Prevents malicious file uploads
- Essential security measure

### Signed URL Generation

- Minimal overhead (URL generation is fast)
- Regeneration on access ensures validity
- Prevents unauthorized access

## Future Enhancements

- Add virus scanning for uploaded files
- Implement file type detection beyond images
- Add rate limiting for file uploads
- Implement file access logging
- Add file expiration/deletion policies
- Consider Cloudinary's access control features
- Add image processing validation (verify image is valid after upload)

## Cloudinary Configuration

### Recommended Settings

- Use `secure: true` for HTTPS URLs
- Use `sign_url: true` for signed URLs
- Set appropriate expiration times
- Use unique public IDs
- Add metadata for tracking

### Access Control Options

- Signed URLs (current implementation)
- Access type restrictions (if needed)
- IP-based restrictions (if needed)
- Time-based access (via expiration)
