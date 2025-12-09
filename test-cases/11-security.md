# Security Test Cases

## 1. Authentication Security

### TC-SECURITY-001: JWT Token Validation - Valid Token

**Priority:** High  
**Type:** Security  
**Preconditions:** User logged in  
**Steps:**

1. Make API request with valid JWT token
2. Verify token validation
   **Expected Result:**

- Token validated successfully
- Request processed
- User information extracted correctly
- No security vulnerabilities

### TC-SECURITY-002: JWT Token Validation - Expired Token

**Priority:** High  
**Type:** Security  
**Preconditions:** Token expired  
**Steps:**

1. Make API request with expired token
2. Check token validation
   **Expected Result:**

- Token rejected
- Status 401 Unauthorized
- Error message: "Token expired"
- User redirected to login

### TC-SECURITY-003: JWT Token Validation - Invalid Token

**Priority:** High  
**Type:** Security  
**Preconditions:** Invalid token format  
**Steps:**

1. Make API request with invalid token
2. Check token validation
   **Expected Result:**

- Token rejected
- Status 401 Unauthorized
- Error message: "Invalid token"
- Request not processed

### TC-SECURITY-004: JWT Token Validation - Tampered Token

**Priority:** High  
**Type:** Security  
**Preconditions:** Token tampered with  
**Steps:**

1. Modify token signature
2. Make API request
   **Expected Result:**

- Token rejected
- Status 401 Unauthorized
- Signature verification fails
- Request not processed

### TC-SECURITY-005: JWT Token Validation - Missing Token

**Priority:** High  
**Type:** Security  
**Preconditions:** No token provided  
**Steps:**

1. Make API request without token
2. Check authentication
   **Expected Result:**

- Request rejected
- Status 401 Unauthorized
- Error message: "Authentication required"
- Request not processed

### TC-SECURITY-006: OTP Security - Rate Limiting

**Priority:** High  
**Type:** Security  
**Preconditions:** None  
**Steps:**

1. Attempt to send OTP 6 times within 5 minutes
2. Check rate limiting
   **Expected Result:**

- 6th request blocked
- Rate limit error displayed
- HTTP 429 status code
- OTP not sent

### TC-SECURITY-007: OTP Security - OTP Expiration

**Priority:** High  
**Type:** Security  
**Preconditions:** OTP sent  
**Steps:**

1. Attempt to verify OTP after expiration (10+ minutes)
2. Check OTP validation
   **Expected Result:**

- OTP rejected
- Error message: "OTP expired"
- OTP not verified
- Security maintained

### TC-SECURITY-008: OTP Security - OTP Reuse Prevention

**Priority:** High  
**Type:** Security  
**Preconditions:** OTP verified once  
**Steps:**

1. Attempt to verify same OTP again
2. Check OTP validation
   **Expected Result:**

- OTP rejected
- Error message: "OTP already used"
- OTP not verified
- Security maintained

## 2. Authorization Security

### TC-SECURITY-009: Role-Based Access Control - Admin Routes

**Priority:** High  
**Type:** Security  
**Preconditions:** Regular user logged in  
**Steps:**

1. Attempt to access admin routes
2. Check authorization
   **Expected Result:**

- Access denied
- Status 403 Forbidden
- Error message: "Admin access required"
- Request not processed

### TC-SECURITY-010: Role-Based Access Control - User Routes

**Priority:** High  
**Type:** Security  
**Preconditions:** Admin user logged in  
**Steps:**

1. Access user routes
2. Check authorization
   **Expected Result:**

- Access granted
- User routes accessible
- Authorization working correctly

### TC-SECURITY-011: Resource Ownership - Patient Access

**Priority:** High  
**Type:** Security  
**Preconditions:** User logged in, patient belongs to another user  
**Steps:**

1. Attempt to access other user's patient
2. Check authorization
   **Expected Result:**

- Access denied
- Status 404 Not Found (for security, don't reveal existence)
- Patient data not returned
- Security maintained

### TC-SECURITY-012: Resource Ownership - Appointment Access

**Priority:** High  
**Type:** Security  
**Preconditions:** User logged in, appointment belongs to another user  
**Steps:**

1. Attempt to access other user's appointment
2. Check authorization
   **Expected Result:**

- Access denied
- Status 404 Not Found (for security, don't reveal existence)
- Appointment data not returned
- Security maintained

### TC-SECURITY-013: Resource Ownership - File Access

**Priority:** High  
**Type:** Security  
**Preconditions:** User logged in, file belongs to another user  
**Steps:**

1. Attempt to access other user's file
2. Check authorization
   **Expected Result:**

- Access denied
- Status 404 Not Found (for security, don't reveal existence)
- File not accessible
- Security maintained

## 3. Input Validation Security

### TC-SECURITY-014: SQL Injection Prevention - User Input

**Priority:** High  
**Type:** Security  
**Preconditions:** User input fields  
**Steps:**

1. Enter SQL injection payload: `'; DROP TABLE users; --`
2. Submit form
   **Expected Result:**

- Input sanitized
- SQL injection prevented
- Prisma ORM handles parameterization
- No database damage
- Error handled gracefully

### TC-SECURITY-015: XSS Prevention - User Input

**Priority:** High  
**Type:** Security  
**Preconditions:** User input fields  
**Steps:**

1. Enter XSS payload: `<script>alert('XSS')</script>`
2. Submit form
   **Expected Result:**

- Input sanitized
- XSS prevented
- Script tags escaped
- No script execution
- Data stored safely

### TC-SECURITY-016: NoSQL Injection Prevention - User Input

**Priority:** High  
**Type:** Security  
**Preconditions:** User input fields  
**Steps:**

1. Enter NoSQL injection payload: `{"$ne": null}`
2. Submit form
   **Expected Result:**

- Input validated
- NoSQL injection prevented
- Prisma handles validation
- No database damage

### TC-SECURITY-017: Command Injection Prevention - File Upload

**Priority:** High  
**Type:** Security  
**Preconditions:** File upload functionality  
**Steps:**

1. Attempt to upload file with malicious name: `../../etc/passwd`
2. Upload file
   **Expected Result:**

- File name sanitized
- Path traversal prevented
- File stored safely
- No system access

### TC-SECURITY-018: Field Size Validation - Large Payloads

**Priority:** High  
**Type:** Security  
**Preconditions:** Form submission  
**Steps:**

1. Submit form with very large field (>100KB)
2. Check validation
   **Expected Result:**

- Field size validated
- Large payload rejected
- Error message displayed
- DoS attack prevented

### TC-SECURITY-019: Array Length Validation - Large Arrays

**Priority:** Medium  
**Type:** Security  
**Preconditions:** Form submission  
**Steps:**

1. Submit form with very large array (>100 items)
2. Check validation
   **Expected Result:**

- Array length validated
- Large array rejected
- Error message displayed
- DoS attack prevented

## 4. Rate Limiting Security

### TC-SECURITY-020: Rate Limiting - Payment Endpoints

**Priority:** High  
**Type:** Security  
**Preconditions:** User logged in  
**Steps:**

1. Make 10 payment requests within 1 minute
2. Attempt 11th request
   **Expected Result:**

- Rate limit error displayed
- HTTP 429 status code
- Request blocked
- DoS attack prevented

### TC-SECURITY-021: Rate Limiting - Appointment Creation

**Priority:** High  
**Type:** Security  
**Preconditions:** User logged in  
**Steps:**

1. Create 10 appointments within 1 minute
2. Attempt 11th creation
   **Expected Result:**

- Rate limit error displayed
- HTTP 429 status code
- Request blocked
- DoS attack prevented

### TC-SECURITY-022: Rate Limiting - File Uploads

**Priority:** High  
**Type:** Security  
**Preconditions:** User logged in  
**Steps:**

1. Upload 10 files within 1 minute
2. Attempt 11th upload
   **Expected Result:**

- Rate limit error displayed
- HTTP 429 status code
- Request blocked
- DoS attack prevented

### TC-SECURITY-023: Rate Limiting - General API

**Priority:** Medium  
**Type:** Security  
**Preconditions:** User logged in  
**Steps:**

1. Make 100 API requests within 15 minutes
2. Attempt 101st request
   **Expected Result:**

- Rate limit error displayed
- HTTP 429 status code
- Request blocked
- DoS attack prevented

## 5. Payment Security

### TC-SECURITY-024: Payment Signature Verification - Valid Signature

**Priority:** High  
**Type:** Security  
**Preconditions:** Payment response received  
**Steps:**

1. Verify payment signature
2. Check signature validation
   **Expected Result:**

- Signature verified successfully
- Payment processed
- HMAC SHA256 algorithm used
- Secret key from environment

### TC-SECURITY-025: Payment Signature Verification - Invalid Signature

**Priority:** High  
**Type:** Security  
**Preconditions:** Payment response with invalid signature  
**Steps:**

1. Attempt to verify payment with invalid signature
2. Check validation
   **Expected Result:**

- Signature verification fails
- Payment rejected
- Error message displayed
- Payment not processed

### TC-SECURITY-026: Payment Signature Verification - Tampered Data

**Priority:** High  
**Type:** Security  
**Preconditions:** Payment data tampered with  
**Steps:**

1. Modify payment data
2. Attempt to verify payment
   **Expected Result:**

- Signature verification fails
- Payment rejected
- Tampering detected
- Payment not processed

### TC-SECURITY-027: Payment Amount Validation - Amount Mismatch

**Priority:** High  
**Type:** Security  
**Preconditions:** Payment amount differs from order  
**Steps:**

1. Attempt to verify payment with different amount
2. Check validation
   **Expected Result:**

- Amount validation fails
- Payment rejected
- Error message displayed
- Payment not processed

### TC-SECURITY-028: Razorpay Keys - Environment Variable Security

**Priority:** High  
**Type:** Security  
**Preconditions:** Application configuration  
**Steps:**

1. Check Razorpay keys storage
2. Verify security
   **Expected Result:**

- Keys stored in environment variables
- Keys not hardcoded
- Keys not exposed in logs
- Keys validated at startup

## 6. File Upload Security

### TC-SECURITY-029: File Upload - MIME Type Validation

**Priority:** High  
**Type:** Security  
**Preconditions:** File upload functionality  
**Steps:**

1. Rename .exe file to .jpg
2. Attempt to upload file
   **Expected Result:**

- Magic bytes validation catches spoofing
- File rejected
- Error message displayed
- Malicious file not uploaded

### TC-SECURITY-030: File Upload - File Size Limits

**Priority:** High  
**Type:** Security  
**Preconditions:** File upload functionality  
**Steps:**

1. Attempt to upload very large file (>5MB)
2. Check validation
   **Expected Result:**

- File size validated
- Large file rejected
- Error message displayed
- DoS attack prevented

### TC-SECURITY-031: File Upload - File Type Restrictions

**Priority:** High  
**Type:** Security  
**Preconditions:** File upload functionality  
**Steps:**

1. Attempt to upload executable file (.exe, .sh)
2. Check validation
   **Expected Result:**

- File type validated
- Executable file rejected
- Error message displayed
- Security maintained

### TC-SECURITY-032: File Upload - Path Traversal Prevention

**Priority:** High  
**Type:** Security  
**Preconditions:** File upload functionality  
**Steps:**

1. Attempt to upload file with path traversal: `../../etc/passwd`
2. Check validation
   **Expected Result:**

- File name sanitized
- Path traversal prevented
- File stored safely
- No system access

## 7. Environment Variable Security

### TC-SECURITY-033: Environment Variables - Validation at Startup

**Priority:** High  
**Type:** Security  
**Preconditions:** Application startup  
**Steps:**

1. Check environment variable validation
2. Verify validation
   **Expected Result:**

- All required variables validated
- Application fails to start if missing
- Error messages clear
- Configuration errors caught early

### TC-SECURITY-034: Environment Variables - Sensitive Data Masking

**Priority:** Medium  
**Type:** Security  
**Preconditions:** Logging enabled  
**Steps:**

1. Check logs for sensitive data
2. Verify masking
   **Expected Result:**

- Sensitive data masked in logs
- API keys not exposed
- Passwords not logged
- Security maintained

### TC-SECURITY-035: Environment Variables - .env File Security

**Priority:** High  
**Type:** Security  
**Preconditions:** .env file exists  
**Steps:**

1. Check .env file security
2. Verify .gitignore
   **Expected Result:**

- .env file in .gitignore
- .env file not committed to repository
- Sensitive data not exposed
- Security maintained

## 8. CORS Security

### TC-SECURITY-036: CORS Configuration - Allowed Origins

**Priority:** High  
**Type:** Security  
**Preconditions:** CORS configured  
**Steps:**

1. Make request from allowed origin
2. Check CORS headers
   **Expected Result:**

- CORS headers present
- Origin allowed
- Request processed
- Security headers set

### TC-SECURITY-037: CORS Configuration - Disallowed Origins

**Priority:** High  
**Type:** Security  
**Preconditions:** CORS configured  
**Steps:**

1. Make request from disallowed origin
2. Check CORS headers
   **Expected Result:**

- CORS error displayed
- Request blocked
- Origin not allowed
- Security maintained

## 9. Session Security

### TC-SECURITY-038: Session Management - Token Expiration

**Priority:** High  
**Type:** Security  
**Preconditions:** User logged in  
**Steps:**

1. Wait for token to expire
2. Make API request
   **Expected Result:**

- Token expired
- Request rejected
- User redirected to login
- Session security maintained

### TC-SECURITY-039: Session Management - Token Refresh

**Priority:** Medium  
**Type:** Security  
**Preconditions:** User logged in, access token expired  
**Steps:**

1. Access token expires
2. Refresh token used
3. New access token issued
   **Expected Result:**

- Refresh token validated
- New access token issued
- Session continued
- Security maintained

### TC-SECURITY-040: Session Management - Concurrent Sessions

**Priority:** Low  
**Type:** Security  
**Preconditions:** User logged in on multiple devices  
**Steps:**

1. Logout from one device
2. Check other devices
   **Expected Result:**

- Only current device logged out
- Other devices remain logged in
- Session management working correctly
