# Authentication Test Cases

## 1. User Registration

### TC-AUTH-001: Send Registration OTP - Valid Phone Number

**Priority:** High  
**Type:** Functional  
**Preconditions:** None  
**Steps:**

1. Navigate to registration page
2. Enter valid phone number (10 digits, starts with 6-9)
3. Click "Send OTP"
   **Expected Result:**

- OTP sent successfully
- Success message displayed
- Rate limiting applied (max 5 requests per 5 minutes)
- OTP stored in database with expiration time
  **Test Data:** Phone: `9876543210`

### TC-AUTH-002: Send Registration OTP - Invalid Phone Number

**Priority:** High  
**Type:** Validation  
**Preconditions:** None  
**Steps:**

1. Navigate to registration page
2. Enter invalid phone number (less than 10 digits)
3. Click "Send OTP"
   **Expected Result:**

- Validation error displayed
- OTP not sent
- No database entry created
  **Test Data:** Phone: `12345`

### TC-AUTH-003: Send Registration OTP - Duplicate Phone Number

**Priority:** Medium  
**Type:** Business Logic  
**Preconditions:** User with phone `9876543210` already exists  
**Steps:**

1. Navigate to registration page
2. Enter existing phone number
3. Click "Send OTP"
   **Expected Result:**

- Error message: "Phone number already registered"
- OTP not sent
- User redirected to login page

### TC-AUTH-004: Send Registration OTP - Rate Limiting

**Priority:** High  
**Type:** Security  
**Preconditions:** None  
**Steps:**

1. Send OTP 5 times within 5 minutes
2. Attempt to send 6th OTP
   **Expected Result:**

- 6th request blocked
- Rate limit error: "Too many OTP requests. Please wait a moment."
- HTTP 429 status code
- Rate limit headers present (`X-RateLimit-Limit`, `X-RateLimit-Remaining`)

### TC-AUTH-005: Verify Registration OTP - Valid OTP

**Priority:** High  
**Type:** Functional  
**Preconditions:** OTP sent to phone number  
**Steps:**

1. Enter correct OTP received via SMS
2. Click "Verify OTP"
   **Expected Result:**

- OTP verified successfully
- User account created
- JWT access token and refresh token issued
- User redirected to home page
- User logged in automatically

### TC-AUTH-006: Verify Registration OTP - Invalid OTP

**Priority:** High  
**Type:** Validation  
**Preconditions:** OTP sent to phone number  
**Steps:**

1. Enter incorrect OTP
2. Click "Verify OTP"
   **Expected Result:**

- Error message: "Invalid OTP"
- User account not created
- User remains on verification page
- Can retry with correct OTP

### TC-AUTH-007: Verify Registration OTP - Expired OTP

**Priority:** Medium  
**Type:** Business Logic  
**Preconditions:** OTP sent more than 10 minutes ago  
**Steps:**

1. Enter expired OTP
2. Click "Verify OTP"
   **Expected Result:**

- Error message: "OTP expired"
- User account not created
- User can request new OTP

### TC-AUTH-008: Verify Registration OTP - Phone Number Normalization

**Priority:** Medium  
**Type:** Business Logic  
**Preconditions:** None  
**Steps:**

1. Send OTP with phone: `+91 9876543210`
2. Verify OTP with phone: `9876543210`
   **Expected Result:**

- Phone numbers normalized to same format
- OTP verification succeeds
- No duplicate accounts created

## 2. User Login

### TC-AUTH-009: Send Login OTP - Valid Phone Number

**Priority:** High  
**Type:** Functional  
**Preconditions:** User account exists  
**Steps:**

1. Navigate to login page
2. Enter registered phone number
3. Click "Send OTP"
   **Expected Result:**

- OTP sent successfully
- Success message displayed
- Rate limiting applied

### TC-AUTH-010: Send Login OTP - Unregistered Phone Number

**Priority:** High  
**Type:** Business Logic  
**Preconditions:** Phone number not registered  
**Steps:**

1. Navigate to login page
2. Enter unregistered phone number
3. Click "Send OTP"
   **Expected Result:**

- Error message: "Phone number not registered"
- OTP not sent
- Option to register displayed

### TC-AUTH-011: Verify Login OTP - Valid OTP

**Priority:** High  
**Type:** Functional  
**Preconditions:** Login OTP sent  
**Steps:**

1. Enter correct OTP
2. Click "Verify OTP"
   **Expected Result:**

- OTP verified successfully
- JWT tokens issued
- User logged in
- Redirected to home page or previous page
- User session created

### TC-AUTH-012: Verify Login OTP - Invalid OTP

**Priority:** High  
**Type:** Validation  
**Preconditions:** Login OTP sent  
**Steps:**

1. Enter incorrect OTP
2. Click "Verify OTP"
   **Expected Result:**

- Error message: "Invalid OTP"
- User not logged in
- Can retry verification

## 3. Session Management

### TC-AUTH-013: Get Current User (/auth/me) - Authenticated

**Priority:** High  
**Type:** Functional  
**Preconditions:** User logged in  
**Steps:**

1. Make GET request to `/auth/me` with valid JWT token
   **Expected Result:**

- User details returned
- Status 200
- Response includes: `id`, `phone`, `role`, `createdAt`

### TC-AUTH-014: Get Current User - Invalid Token

**Priority:** High  
**Type:** Security  
**Preconditions:** Invalid or expired token  
**Steps:**

1. Make GET request to `/auth/me` with invalid token
   **Expected Result:**

- Status 401 Unauthorized
- Error message: "Unauthorized"
- User redirected to login page (frontend)

### TC-AUTH-015: Get Current User - Missing Token

**Priority:** High  
**Type:** Security  
**Preconditions:** No authentication token  
**Steps:**

1. Make GET request to `/auth/me` without token
   **Expected Result:**

- Status 401 Unauthorized
- Error message: "Unauthorized"

### TC-AUTH-016: Get Current User - Invalid Role

**Priority:** Medium  
**Type:** Security  
**Preconditions:** Token with invalid role  
**Steps:**

1. Make GET request to `/auth/me` with token containing invalid role
   **Expected Result:**

- Status 400 Bad Request
- Error message about invalid role
- Frontend clears user state and localStorage

### TC-AUTH-017: Refresh Session - Valid Refresh Token

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** User logged in with refresh token  
**Steps:**

1. Make GET request to `/auth/session` with valid refresh token
   **Expected Result:**

- New access token issued
- Status 200
- Response includes new access token

### TC-AUTH-018: Refresh Session - Invalid Refresh Token

**Priority:** Medium  
**Type:** Security  
**Preconditions:** Invalid refresh token  
**Steps:**

1. Make GET request to `/auth/session` with invalid refresh token
   **Expected Result:**

- Status 401 Unauthorized
- Error message: "Invalid refresh token"

## 4. Logout

### TC-AUTH-019: Logout - Valid Session

**Priority:** High  
**Type:** Functional  
**Preconditions:** User logged in  
**Steps:**

1. Click logout button
2. Confirm logout
   **Expected Result:**

- User logged out successfully
- Tokens invalidated
- Cookies cleared
- Redirected to login page
- User state cleared from frontend

### TC-AUTH-020: Logout - Multiple Devices

**Priority:** Low  
**Type:** Functional  
**Preconditions:** User logged in on multiple devices  
**Steps:**

1. Logout from one device
   **Expected Result:**

- Only current device logged out
- Other devices remain logged in
- Refresh token invalidated for current device only

## 5. Frontend Authentication Flow

### TC-AUTH-021: Auto-Login on Page Load

**Priority:** High  
**Type:** Functional  
**Preconditions:** User previously logged in, token in localStorage  
**Steps:**

1. Open application in new tab
2. Wait for page load
   **Expected Result:**

- `/auth/me` called automatically
- User state loaded if token valid
- User redirected to appropriate page based on role

### TC-AUTH-022: Protected Route Access - Authenticated

**Priority:** High  
**Type:** Functional  
**Preconditions:** User logged in  
**Steps:**

1. Navigate to protected route (e.g., `/profile`)
   **Expected Result:**

- Page loads successfully
- User data displayed
- No redirect to login

### TC-AUTH-023: Protected Route Access - Unauthenticated

**Priority:** High  
**Type:** Security  
**Preconditions:** User not logged in  
**Steps:**

1. Navigate to protected route (e.g., `/profile`)
   **Expected Result:**

- Redirected to `/login`
- Original URL stored for redirect after login
- Login page displayed

### TC-AUTH-024: Admin Route Access - Non-Admin User

**Priority:** High  
**Type:** Security  
**Preconditions:** Regular user logged in  
**Steps:**

1. Navigate to admin route (e.g., `/admin/appointments`)
   **Expected Result:**

- Access denied
- Redirected to home page
- Error message displayed

### TC-AUTH-025: Admin Route Access - Admin User

**Priority:** High  
**Type:** Functional  
**Preconditions:** Admin user logged in  
**Steps:**

1. Navigate to admin route
   **Expected Result:**

- Page loads successfully
- Admin features accessible

## 6. Edge Cases

### TC-AUTH-026: Concurrent OTP Requests

**Priority:** Low  
**Type:** Edge Case  
**Preconditions:** None  
**Steps:**

1. Send OTP request
2. Immediately send another OTP request before first completes
   **Expected Result:**

- Only one OTP sent
- Second request handled gracefully
- No duplicate OTP entries in database

### TC-AUTH-027: OTP Cleanup - Expired OTPs

**Priority:** Low  
**Type:** Database  
**Preconditions:** Expired OTPs in database  
**Steps:**

1. Check database for expired OTPs
   **Expected Result:**

- Expired OTPs cleaned up automatically
- Database index on `(phone, expiresAt)` for efficient cleanup

### TC-AUTH-028: Phone Number Format Variations

**Priority:** Medium  
**Type:** Business Logic  
**Preconditions:** None  
**Steps:**

1. Test with phone formats:
   - `9876543210`
   - `+91 9876543210`
   - `09876543210`
   - `91-9876543210`
     **Expected Result:**

- All formats normalized to same format
- No duplicate accounts created
- OTP sent successfully for all valid formats

### TC-AUTH-029: Token Expiration Handling

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** User logged in  
**Steps:**

1. Wait for access token to expire
2. Make API request with expired token
   **Expected Result:**

- Request fails with 401
- Frontend automatically attempts refresh
- If refresh succeeds, request retried
- If refresh fails, user redirected to login

### TC-AUTH-030: Network Error During Authentication

**Priority:** Medium  
**Type:** Error Handling  
**Preconditions:** Network disconnected  
**Steps:**

1. Attempt to send OTP
2. Network error occurs
   **Expected Result:**

- Error message displayed: "Network error. Please check your connection."
- User can retry after network restored
- No partial state changes
