# Input Validation and Sanitization Improvements

This document outlines the validation and sanitization enhancements implemented to address security vulnerabilities and data consistency issues.

## Issues Fixed

### 1. Phone Number Normalization Inconsistency

**Issue:** Same phone number in different formats could create duplicate accounts.

**Location:** `src/modules/auth/auth.service.ts:12-22`

**Risk:** User confusion, potential account duplication

**Solution:**

- Created centralized phone normalization utility (`src/utils/phoneNormalizer.ts`)
- Implemented Prisma middleware to normalize phone numbers at database level
- All phone numbers are normalized before being stored in the database
- Normalization rules:
  - Remove all non-digit characters
  - If starts with country code 91 and has 12 digits, keep as is
  - If has 10 digits, prepend country code 91
  - Result: Always 12 digits starting with 91

**Changes Made:**

- `src/utils/phoneNormalizer.ts` - Centralized normalization utility
- `src/database/prismaclient.ts` - Prisma middleware for automatic normalization
- `src/modules/auth/auth.service.ts` - Updated to use centralized utility

### 2. Missing Input Length Limits

**Issue:** Individual fields not validated for length, only overall payload size limited.

**Location:** Multiple endpoints

**Risk:** DoS via large payloads, database storage issues

**Current:** `express.json({ limit: "20mb" })` exists but individual fields not validated

**Solution:**

- Added field-level length validation in Zod schemas
- All string fields now have maximum length constraints
- Validation happens before data reaches database

**Fields Validated:**

- `name`: max 100 characters
- `phone`: max 15 characters
- `email`: max 255 characters
- `address`: max 500 characters
- `medicalHistory`: max 5000 characters
- `appointmentConcerns`: max 1000 characters
- `allergic`: max 500 characters
- `dailyFoodIntake`: max 2000 characters
- `wakeUpTime`: max 20 characters
- `sleepTime`: max 20 characters
- `dateOfBirth`: max 50 characters
- `fileIds`: max 50 files

**Changes Made:**

- `src/modules/auth/auth.schema.ts` - Added length validation to name schema
- `src/modules/patient/patient.validators.ts` - Added length validation to all string fields

### 3. File Upload MIME Type Validation Can Be Bypassed

**Issue:** Client can send fake MIME types, bypassing validation.

**Location:** `src/middleware/multerConfig.ts:13`

**Risk:** Malicious file uploads, security vulnerabilities

**Solution:**

- Implemented magic byte (file signature) validation
- Validates file content matches declared MIME type
- Prevents MIME type spoofing attacks

**Magic Bytes Validated:**

- JPEG/JPG: `0xFF 0xD8 0xFF`
- PNG: `0x89 0x50 0x4E 0x47 0x0D 0x0A 0x1A 0x0A`

**Changes Made:**

- `src/utils/fileValidator.ts` - Magic byte validation utility
- `src/middleware/validateFileContent.ts` - Middleware for file content validation
- `src/middleware/multerConfig.ts` - Updated comments
- `src/modules/upload/upload.routes.ts` - Added file content validation middleware
- `src/modules/admin/admin.routes.ts` - Added file content validation middleware

### 4. No Validation for Appointment Date Ranges

**Issue:** Appointments can be created in the past.

**Location:** `src/modules/appointment/appointment.controller.ts:180-212`

**Risk:** Invalid appointments, reminder cron issues

**Solution:**

- Added validation to ensure `startAt` is in the future
- Validates slot dates are in the future
- Minimum 1 minute buffer from current time

**Validation Rules:**

- `startAt` must be at least 1 minute in the future
- `endAt` must be after `startAt`
- Slot `startAt` must be in the future
- Slot `endAt` must be after `startAt`

**Changes Made:**

- `src/modules/appointment/appointment.controller.ts` - Added future date validation for both direct dates and slot dates

## Security Features

### 1. Database-Level Normalization

- Phone numbers normalized automatically via Prisma middleware
- Prevents duplicate accounts with different phone formats
- Consistent data storage

### 2. Field-Level Length Validation

- All string fields have maximum length constraints
- Prevents DoS attacks via large payloads
- Protects database storage

### 3. File Content Validation

- Magic byte validation prevents MIME type spoofing
- Validates file content matches declared type
- Prevents malicious file uploads

### 4. Date Range Validation

- Prevents creation of appointments in the past
- Ensures valid appointment scheduling
- Protects reminder cron jobs

## Files Created

1. `src/utils/phoneNormalizer.ts` - Phone normalization utility
2. `src/utils/fileValidator.ts` - File content validation utility
3. `src/middleware/validateFileContent.ts` - File validation middleware

## Files Modified

1. `src/database/prismaclient.ts` - Added Prisma middleware for phone normalization
2. `src/modules/auth/auth.service.ts` - Updated to use centralized phone normalization
3. `src/modules/auth/auth.schema.ts` - Added length validation
4. `src/modules/patient/patient.validators.ts` - Added length validation to all fields
5. `src/middleware/multerConfig.ts` - Updated comments
6. `src/modules/upload/upload.routes.ts` - Added file content validation
7. `src/modules/admin/admin.routes.ts` - Added file content validation
8. `src/modules/appointment/appointment.controller.ts` - Added future date validation

## Testing

### Test Phone Normalization

1. Create account with phone "916260440241"
2. Try to create account with phone "6260440241"
3. Verify only one account exists (normalized to same format)

### Test Field Length Validation

1. Send request with name > 100 characters
2. Verify 400 error with validation message
3. Check all fields have appropriate limits

### Test File Content Validation

1. Upload file with fake MIME type (e.g., rename .exe to .jpg)
2. Verify file is rejected
3. Check magic bytes are validated

### Test Date Validation

1. Try to create appointment with past date
2. Verify 400 error
3. Check slot dates are validated

## Best Practices

1. **Normalize at database level** - Ensures consistency regardless of input format
2. **Validate field lengths** - Prevent DoS attacks and storage issues
3. **Validate file content** - Don't trust MIME types, verify file signatures
4. **Validate date ranges** - Ensure business logic constraints are enforced
5. **Use Zod schemas** - Centralized validation with type safety

## Monitoring

Monitor the following logs:

- `[PRISMA] Phone normalization error` - Phone normalization failures
- `[FILE VALIDATOR]` - File content validation failures
- `[FILE VALIDATION]` - File validation middleware errors
- `[BACKEND] startAt must be in the future` - Date validation failures

## Future Enhancements

- Add rate limiting for file uploads
- Implement file virus scanning
- Add phone number format validation for international numbers
- Add timezone validation for appointment dates
- Implement file size validation per file type
