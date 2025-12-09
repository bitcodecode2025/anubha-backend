# File Upload Test Cases

## 1. Image Upload

### TC-UPLOAD-001: Upload Image - Valid Image File

**Priority:** High  
**Type:** Functional  
**Preconditions:** User logged in  
**Steps:**

1. Navigate to file upload page
2. Select valid image file (JPG, PNG, WebP)
3. Upload file
   **Expected Result:**

- File uploaded successfully
- File stored in Cloudinary
- File URL returned
- File accessible via URL
- Success message displayed

### TC-UPLOAD-002: Upload Image - Multiple Files

**Priority:** High  
**Type:** Functional  
**Preconditions:** User logged in  
**Steps:**

1. Select multiple image files (up to 10)
2. Upload all files
   **Expected Result:**

- All files uploaded successfully
- Each file stored separately
- File URLs returned for each
- All files accessible

### TC-UPLOAD-003: Upload Image - Invalid File Type

**Priority:** High  
**Type:** Validation  
**Preconditions:** User logged in  
**Steps:**

1. Attempt to upload invalid file type (e.g., .exe, .pdf)
2. Upload file
   **Expected Result:**

- Validation error displayed
- Error message: "Invalid file type. Only images allowed."
- File not uploaded
- Status 400 Bad Request

### TC-UPLOAD-004: Upload Image - File Size Limit (Per File)

**Priority:** High  
**Type:** Validation  
**Preconditions:** User logged in  
**Steps:**

1. Attempt to upload file > 5MB
2. Upload file
   **Expected Result:**

- Validation error displayed
- Error message: "File size exceeds 5MB limit"
- File not uploaded
- Status 400 Bad Request

### TC-UPLOAD-005: Upload Image - Total File Size Limit

**Priority:** High  
**Type:** Validation  
**Preconditions:** User logged in  
**Steps:**

1. Attempt to upload multiple files totaling > 20MB
2. Upload files
   **Expected Result:**

- Validation error displayed
- Error message: "Total file size exceeds 20MB limit"
- Files not uploaded
- Status 400 Bad Request

### TC-UPLOAD-006: Upload Image - File Content Validation (Magic Bytes)

**Priority:** High  
**Type:** Security  
**Preconditions:** User logged in  
**Steps:**

1. Rename .exe file to .jpg
2. Attempt to upload file
   **Expected Result:**

- File content validation fails
- Error message: "File content does not match file type"
- File not uploaded
- Status 400 Bad Request
- Magic bytes checked

### TC-UPLOAD-007: Upload Image - Empty File

**Priority:** Medium  
**Type:** Validation  
**Preconditions:** User logged in  
**Steps:**

1. Attempt to upload empty file (0 bytes)
2. Upload file
   **Expected Result:**

- Validation error displayed
- Error message: "File is empty"
- File not uploaded
- Status 400 Bad Request

### TC-UPLOAD-008: Upload Image - Unauthenticated User

**Priority:** High  
**Type:** Security  
**Preconditions:** User not logged in  
**Steps:**

1. Attempt to upload file without authentication
   **Expected Result:**

- Status 401 Unauthorized
- File not uploaded
- Redirected to login page (frontend)

### TC-UPLOAD-009: Upload Image - Rate Limiting

**Priority:** High  
**Type:** Security  
**Preconditions:** User logged in  
**Steps:**

1. Upload 10 files within 1 minute
2. Attempt to upload 11th file
   **Expected Result:**

- Rate limit error displayed
- HTTP 429 status code
- Error message: "Too many file upload requests"
- File not uploaded

### TC-UPLOAD-010: Upload Image - Cloudinary Failure

**Priority:** Medium  
**Type:** Error Handling  
**Preconditions:** Cloudinary API unavailable  
**Steps:**

1. Attempt to upload file
2. Cloudinary API returns error
   **Expected Result:**

- Error message displayed
- Error logged
- User can retry
- No partial state changes

## 2. File Linking to Patient

### TC-UPLOAD-011: Link Files to Patient - Valid Files

**Priority:** High  
**Type:** Functional  
**Preconditions:** User logged in, patient exists, files uploaded  
**Steps:**

1. Navigate to patient details
2. Link uploaded files to patient
3. Save changes
   **Expected Result:**

- Files linked successfully
- Files visible in patient details
- File metadata stored
- Files accessible for download

### TC-UPLOAD-012: Link Files to Patient - Invalid File IDs

**Priority:** Medium  
**Type:** Error Handling  
**Preconditions:** User logged in, patient exists  
**Steps:**

1. Attempt to link non-existent file IDs
2. Save changes
   **Expected Result:**

- Error message: "One or more files not found"
- Patient not updated
- No partial updates
- Status 400 Bad Request

### TC-UPLOAD-013: Link Files to Patient - Other User's Files

**Priority:** High  
**Type:** Security  
**Preconditions:** User logged in, files belong to another user  
**Steps:**

1. Attempt to link files belonging to another user
   **Expected Result:**

- Access denied
- Error message: "File not found"
- Status 404 Not Found
- Files not linked

## 3. File Deletion

### TC-UPLOAD-014: Delete File - Valid File

**Priority:** High  
**Type:** Functional  
**Preconditions:** User logged in, file exists  
**Steps:**

1. Navigate to file list
2. Delete file
3. Confirm deletion
   **Expected Result:**

- File deleted successfully
- File removed from Cloudinary
- File removed from database
- File removed from patient (if linked)
- Success message displayed

### TC-UPLOAD-015: Delete File - Invalid File ID

**Priority:** Medium  
**Type:** Error Handling  
**Preconditions:** User logged in  
**Steps:**

1. Attempt to delete non-existent file ID
   **Expected Result:**

- Error message: "File not found"
- Status 404 Not Found
- No changes made

### TC-UPLOAD-016: Delete File - Other User's File

**Priority:** High  
**Type:** Security  
**Preconditions:** User logged in, file belongs to another user  
**Steps:**

1. Attempt to delete file belonging to another user
   **Expected Result:**

- Access denied
- Error message: "File not found"
- Status 404 Not Found
- File not deleted

### TC-UPLOAD-017: Delete File - File Linked to Patient

**Priority:** Medium  
**Type:** Business Logic  
**Preconditions:** File linked to patient  
**Steps:**

1. Delete file that is linked to patient
2. Check patient file list
   **Expected Result:**

- File deleted successfully
- File removed from patient file list
- Patient updated correctly
- No orphaned references

## 4. File Access

### TC-UPLOAD-018: Access File URL - Valid File

**Priority:** High  
**Type:** Functional  
**Preconditions:** File exists, URL available  
**Steps:**

1. Access file URL
2. Verify file accessible
   **Expected Result:**

- File accessible via URL
- File displays/downloads correctly
- URL valid
- No access errors

### TC-UPLOAD-019: Access File URL - Invalid URL

**Priority:** Medium  
**Type:** Error Handling  
**Preconditions:** Invalid file URL  
**Steps:**

1. Attempt to access invalid file URL
   **Expected Result:**

- Error displayed
- File not accessible
- Appropriate error message

### TC-UPLOAD-020: Access File URL - Deleted File

**Priority:** Medium  
**Type:** Error Handling  
**Preconditions:** File deleted from Cloudinary  
**Steps:**

1. Attempt to access URL of deleted file
   **Expected Result:**

- Error displayed
- File not accessible
- Appropriate error message

## 5. File Upload Security

### TC-UPLOAD-021: File Upload - MIME Type Spoofing Prevention

**Priority:** High  
**Type:** Security  
**Preconditions:** User logged in  
**Steps:**

1. Create malicious file with spoofed MIME type
2. Attempt to upload file
   **Expected Result:**

- Magic bytes validation catches spoofing
- File rejected
- Error message displayed
- File not uploaded

### TC-UPLOAD-022: File Upload - Malicious File Name

**Priority:** Medium  
**Type:** Security  
**Preconditions:** User logged in  
**Steps:**

1. Attempt to upload file with malicious name (path traversal, etc.)
2. Upload file
   **Expected Result:**

- File name sanitized
- Path traversal prevented
- File uploaded with safe name
- No security vulnerabilities

### TC-UPLOAD-023: File Upload - Large Number of Files

**Priority:** Low  
**Type:** Performance  
**Preconditions:** User logged in  
**Steps:**

1. Attempt to upload maximum allowed files (10)
2. Upload all files
   **Expected Result:**

- All files uploaded successfully
- Performance acceptable
- No timeout errors
- All files accessible

### TC-UPLOAD-024: File Upload - Concurrent Uploads

**Priority:** Low  
**Type:** Edge Case  
**Preconditions:** User logged in  
**Steps:**

1. Upload multiple files simultaneously
2. Check upload results
   **Expected Result:**

- All files uploaded successfully
- No conflicts
- All files accessible
- No data corruption

## 6. File Storage

### TC-UPLOAD-025: File Storage - Cloudinary Configuration

**Priority:** High  
**Type:** Configuration  
**Preconditions:** Application started  
**Steps:**

1. Check Cloudinary configuration
2. Verify environment variables
   **Expected Result:**

- Cloudinary configured correctly
- Environment variables validated at startup
- Configuration errors caught early
- Application fails to start if misconfigured

### TC-UPLOAD-026: File Storage - Storage Provider Validation

**Priority:** Medium  
**Type:** Configuration  
**Preconditions:** Application started  
**Steps:**

1. Check storage provider configuration
2. Verify provider type
   **Expected Result:**

- Storage provider validated
- Provider type correct (CLOUDINARY)
- Configuration errors caught

### TC-UPLOAD-027: File Storage - File Metadata Storage

**Priority:** Medium  
**Type:** Database  
**Preconditions:** File uploaded  
**Steps:**

1. Check file metadata in database
2. Verify metadata stored correctly
   **Expected Result:**

- File metadata stored in database
- Metadata includes: URL, filename, size, MIME type, owner
- Metadata accurate
- Can query metadata

## 7. Edge Cases

### TC-UPLOAD-028: File Upload - Network Interruption

**Priority:** Medium  
**Type:** Error Handling  
**Preconditions:** User logged in  
**Steps:**

1. Start file upload
2. Network disconnects during upload
   **Expected Result:**

- Error message displayed
- Upload fails gracefully
- User can retry after network restored
- No partial state changes

### TC-UPLOAD-029: File Upload - Session Expiry

**Priority:** Medium  
**Type:** Error Handling  
**Preconditions:** User session expires during upload  
**Steps:**

1. Start file upload
2. Session expires
3. Complete upload
   **Expected Result:**

- Upload fails with authentication error
- User redirected to login
- Can retry after login
- No partial uploads

### TC-UPLOAD-030: File Upload - Disk Space Full

**Priority:** Low  
**Type:** Error Handling  
**Preconditions:** Cloudinary storage full  
**Steps:**

1. Attempt to upload file
2. Storage full error received
   **Expected Result:**

- Error message displayed
- Error logged
- User notified
- Upload fails gracefully
