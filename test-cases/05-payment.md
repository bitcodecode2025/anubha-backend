# Payment Test Cases

## 1. Payment Order Creation

### TC-PAYMENT-001: Create Razorpay Order - Valid Appointment

**Priority:** High  
**Type:** Functional  
**Preconditions:** User logged in, appointment exists, slot selected  
**Steps:**

1. Navigate to `/book/payment`
2. Click "Pay Now"
3. Verify order creation
   **Expected Result:**

- Razorpay order created successfully
- Order ID returned
- Order amount matches plan price
- Order linked to appointment
- Razorpay checkout opened
- Status 200 OK

### TC-PAYMENT-002: Create Razorpay Order - Missing Appointment

**Priority:** High  
**Type:** Error Handling  
**Preconditions:** User logged in, no appointment  
**Steps:**

1. Navigate directly to `/book/payment`
2. Attempt to create order
   **Expected Result:**

- Error message: "Appointment not found"
- Status 404 Not Found
- Order not created
- Redirected to slot selection

### TC-PAYMENT-003: Create Razorpay Order - Invalid Appointment Status

**Priority:** Medium  
**Type:** Business Logic  
**Preconditions:** Appointment with status `CONFIRMED`  
**Steps:**

1. Attempt to create order for confirmed appointment
   **Expected Result:**

- Error message: "Appointment already confirmed"
- Status 400 Bad Request
- Order not created

### TC-PAYMENT-004: Create Razorpay Order - Already Paid Appointment

**Priority:** Medium  
**Type:** Business Logic  
**Preconditions:** Appointment already has payment  
**Steps:**

1. Attempt to create order for paid appointment
   **Expected Result:**

- Error message: "Appointment already paid"
- Status 400 Bad Request
- Order not created

### TC-PAYMENT-005: Create Razorpay Order - Use Existing Order

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** Order previously created for appointment  
**Steps:**

1. Navigate to payment page
2. Check for existing order
   **Expected Result:**

- Existing order retrieved if available
- Order details displayed
- Can proceed with existing order
- No duplicate order created

### TC-PAYMENT-006: Create Razorpay Order - Rate Limiting

**Priority:** High  
**Type:** Security  
**Preconditions:** User logged in  
**Steps:**

1. Create 10 payment orders within 1 minute
2. Attempt to create 11th order
   **Expected Result:**

- Rate limit error displayed
- HTTP 429 status code
- Error message: "Too many payment requests"
- Order not created

### TC-PAYMENT-007: Create Razorpay Order - Invalid Plan Price

**Priority:** Medium  
**Type:** Error Handling  
**Preconditions:** Appointment with invalid plan price  
**Steps:**

1. Attempt to create order with invalid price
   **Expected Result:**

- Error message displayed
- Order not created
- Validation error shown

### TC-PAYMENT-008: Create Razorpay Order - Razorpay API Failure

**Priority:** Medium  
**Type:** Error Handling  
**Preconditions:** Razorpay API unavailable  
**Steps:**

1. Attempt to create order
2. Razorpay API returns error
   **Expected Result:**

- Error message displayed
- Error logged
- User can retry
- No partial state changes

## 2. Payment Verification

### TC-PAYMENT-009: Verify Payment - Valid Payment

**Priority:** High  
**Type:** Functional  
**Preconditions:** Payment completed in Razorpay  
**Steps:**

1. Complete payment in Razorpay
2. Return to application
3. Payment verification triggered
   **Expected Result:**

- Payment verified successfully
- Signature verified correctly
- Appointment status updated to `CONFIRMED`
- Appointment `bookingProgress` set to `null`
- Payment record created
- WhatsApp confirmation sent to patient and doctor
- Success toast displayed
- Redirected to `/profile` after 1 second

### TC-PAYMENT-010: Verify Payment - Invalid Signature

**Priority:** High  
**Type:** Security  
**Preconditions:** Payment response received  
**Steps:**

1. Send payment verification with invalid signature
2. Verify payment
   **Expected Result:**

- Payment verification fails
- Error message: "Invalid payment signature"
- Appointment not confirmed
- Payment not processed
- Status 400 Bad Request

### TC-PAYMENT-011: Verify Payment - Missing Payment ID

**Priority:** High  
**Type:** Validation  
**Preconditions:** Payment response received  
**Steps:**

1. Attempt to verify payment without payment ID
   **Expected Result:**

- Validation error displayed
- Error message: "Payment ID is required"
- Payment not verified
- Status 400 Bad Request

### TC-PAYMENT-012: Verify Payment - Missing Order ID

**Priority:** High  
**Type:** Validation  
**Preconditions:** Payment response received  
**Steps:**

1. Attempt to verify payment without order ID
   **Expected Result:**

- Validation error displayed
- Error message: "Order ID is required"
- Payment not verified
- Status 400 Bad Request

### TC-PAYMENT-013: Verify Payment - Missing Signature

**Priority:** High  
**Type:** Validation  
**Preconditions:** Payment response received  
**Steps:**

1. Attempt to verify payment without signature
   **Expected Result:**

- Validation error displayed
- Error message: "Payment signature is required"
- Payment not verified
- Status 400 Bad Request

### TC-PAYMENT-014: Verify Payment - Order Not Found

**Priority:** Medium  
**Type:** Error Handling  
**Preconditions:** Order ID doesn't exist  
**Steps:**

1. Attempt to verify payment with non-existent order ID
   **Expected Result:**

- Error message: "Order not found"
- Status 404 Not Found
- Payment not verified

### TC-PAYMENT-015: Verify Payment - Already Verified

**Priority:** Medium  
**Type:** Business Logic  
**Preconditions:** Payment already verified  
**Steps:**

1. Attempt to verify same payment again
   **Expected Result:**

- Error message: "Payment already verified"
- Status 400 Bad Request
- No duplicate verification
- Appointment remains confirmed

### TC-PAYMENT-016: Verify Payment - Rate Limiting

**Priority:** High  
**Type:** Security  
**Preconditions:** User logged in  
**Steps:**

1. Attempt to verify payment 5 times within 1 minute
2. Attempt 6th verification
   **Expected Result:**

- Rate limit error displayed
- HTTP 429 status code
- Error message: "Too many payment verification attempts"
- Verification blocked

### TC-PAYMENT-017: Verify Payment - Razorpay Verification Failure

**Priority:** Medium  
**Type:** Error Handling  
**Preconditions:** Razorpay verification fails  
**Steps:**

1. Payment signature invalid at Razorpay
2. Attempt to verify payment
   **Expected Result:**

- Verification fails
- Error message displayed
- Appointment not confirmed
- Payment not processed

### TC-PAYMENT-018: Verify Payment - Payment Amount Mismatch

**Priority:** Medium  
**Type:** Security  
**Preconditions:** Payment amount doesn't match order  
**Steps:**

1. Payment amount differs from order amount
2. Attempt to verify payment
   **Expected Result:**

- Verification fails
- Error message: "Payment amount mismatch"
- Appointment not confirmed
- Payment not processed

## 3. Payment Flow Integration

### TC-PAYMENT-019: Payment Success Flow - Complete Flow

**Priority:** High  
**Type:** End-to-End  
**Preconditions:** User in booking flow  
**Steps:**

1. Complete booking steps: User Details → Recall → Slot Selection
2. Proceed to payment
3. Complete payment in Razorpay
4. Return to application
   **Expected Result:**

- Payment verified successfully
- Appointment confirmed
- WhatsApp notifications sent
- Success toast displayed
- Redirected to profile
- Appointment visible in "My Appointments"
- Booking context cleared

### TC-PAYMENT-020: Payment Failure Flow - User Cancels

**Priority:** High  
**Type:** End-to-End  
**Preconditions:** User in payment step  
**Steps:**

1. Click "Pay Now"
2. Cancel payment in Razorpay
3. Return to application
   **Expected Result:**

- Payment not verified
- Appointment remains `PENDING`
- Error message displayed
- Can retry payment
- Booking context preserved

### TC-PAYMENT-021: Payment Failure Flow - Payment Failed

**Priority:** High  
**Type:** End-to-End  
**Preconditions:** User in payment step  
**Steps:**

1. Complete payment in Razorpay
2. Payment fails (insufficient funds, etc.)
3. Return to application
   **Expected Result:**

- Payment not verified
- Appointment remains `PENDING`
- Error message displayed
- Can retry payment
- Booking context preserved

### TC-PAYMENT-022: Payment - Resume from Payment Step

**Priority:** High  
**Type:** Functional  
**Preconditions:** Appointment with `bookingProgress: "PAYMENT"`  
**Steps:**

1. Navigate to profile
2. View pending appointments
3. Click "Continue Booking" for payment step
   **Expected Result:**

- Redirected to `/book/payment`
- Existing order retrieved if available
- Can complete payment
- Payment page loads correctly

### TC-PAYMENT-023: Payment - Get Existing Order

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** Order previously created  
**Steps:**

1. Navigate to payment page
2. Check for existing order
   **Expected Result:**

- Existing order retrieved
- Order details displayed
- Can proceed with existing order
- No duplicate order created

### TC-PAYMENT-024: Payment - Order Expiry

**Priority:** Low  
**Type:** Business Logic  
**Preconditions:** Order expired  
**Steps:**

1. Attempt to use expired order
   **Expected Result:**

- New order created
- Old order not used
- Payment proceeds with new order

## 4. Payment Security

### TC-PAYMENT-025: Payment - Signature Verification

**Priority:** High  
**Type:** Security  
**Preconditions:** Payment response received  
**Steps:**

1. Verify payment signature using Razorpay secret
2. Check signature validation
   **Expected Result:**

- Signature verified correctly
- Invalid signatures rejected
- Signature algorithm: HMAC SHA256
- Secret key from environment variable

### TC-PAYMENT-026: Payment - Environment Variable Validation

**Priority:** High  
**Type:** Security  
**Preconditions:** Application startup  
**Steps:**

1. Check Razorpay keys validation at startup
   **Expected Result:**

- `RAZORPAY_KEY_ID` validated (starts with `rzp_`)
- `RAZORPAY_KEY_SECRET` validated (minimum length)
- Application fails to start if keys invalid
- Error message displayed

### TC-PAYMENT-027: Payment - Webhook Security (Future)

**Priority:** Medium  
**Type:** Security  
**Preconditions:** Webhook endpoint configured  
**Steps:**

1. Receive webhook from Razorpay
2. Verify webhook signature
   **Expected Result:**

- Webhook signature verified
- Invalid signatures rejected
- Only verified webhooks processed

### TC-PAYMENT-028: Payment - Amount Validation

**Priority:** High  
**Type:** Security  
**Preconditions:** Payment verification  
**Steps:**

1. Verify payment amount matches order amount
   **Expected Result:**

- Amount validated
- Mismatch rejected
- Error logged
- Payment not processed

## 5. Payment UI/UX

### TC-PAYMENT-029: Payment Page - Display Order Details

**Priority:** High  
**Type:** UI/UX  
**Preconditions:** Order created  
**Steps:**

1. Navigate to payment page
2. View order details
   **Expected Result:**

- Plan name displayed
- Plan price displayed
- Appointment date/time displayed
- Patient name displayed
- Payment button visible

### TC-PAYMENT-030: Payment Page - Loading State

**Priority:** Medium  
**Type:** UI/UX  
**Preconditions:** Order creation in progress  
**Steps:**

1. Click "Pay Now"
2. Wait for order creation
   **Expected Result:**

- Loading indicator displayed
- Button disabled during creation
- Loading state clear

### TC-PAYMENT-031: Payment Page - Error Display

**Priority:** Medium  
**Type:** UI/UX  
**Preconditions:** Payment error occurs  
**Steps:**

1. Trigger payment error
2. Check error display
   **Expected Result:**

- Error message displayed clearly
- Error toast shown
- User can retry payment
- Error message helpful

### TC-PAYMENT-032: Payment Success - Success Toast

**Priority:** High  
**Type:** UI/UX  
**Preconditions:** Payment verified successfully  
**Steps:**

1. Complete payment verification
2. Check success notification
   **Expected Result:**

- Success toast displayed
- Message: "Payment successful! Your appointment is confirmed."
- Toast auto-dismisses
- Redirected to profile after 1 second

### TC-PAYMENT-033: Payment Success - No Modal

**Priority:** High  
**Type:** UI/UX  
**Preconditions:** Payment verified successfully  
**Steps:**

1. Complete payment verification
2. Check for modal
   **Expected Result:**

- No success modal displayed
- Only toast notification shown
- Direct redirect to profile
- Clean user experience

## 6. Edge Cases

### TC-PAYMENT-034: Payment - Concurrent Verification

**Priority:** Low  
**Type:** Edge Case  
**Preconditions:** Payment response received  
**Steps:**

1. Send payment verification request twice simultaneously
   **Expected Result:**

- Only one verification processed
- Second request handled gracefully
- No duplicate confirmations
- Appointment confirmed once

### TC-PAYMENT-035: Payment - Network Interruption

**Priority:** Medium  
**Type:** Error Handling  
**Preconditions:** Payment in progress  
**Steps:**

1. Start payment verification
2. Network disconnects
   **Expected Result:**

- Error message displayed
- User can retry after network restored
- No partial state changes
- Payment can be verified later

### TC-PAYMENT-036: Payment - Session Expiry

**Priority:** Medium  
**Type:** Error Handling  
**Preconditions:** User session expires during payment  
**Steps:**

1. Start payment flow
2. Session expires
3. Complete payment
4. Return to application
   **Expected Result:**

- Redirected to login
- After login, payment can be verified
- Booking context preserved
- Can complete payment

### TC-PAYMENT-037: Payment - Order ID Mismatch

**Priority:** Medium  
**Type:** Security  
**Preconditions:** Payment response received  
**Steps:**

1. Attempt to verify payment with order ID from different appointment
   **Expected Result:**

- Verification fails
- Error message: "Order ID mismatch"
- Payment not verified
- Appointment not confirmed

### TC-PAYMENT-038: Payment - Multiple Payment Attempts

**Priority:** Low  
**Type:** Edge Case  
**Preconditions:** User attempts payment multiple times  
**Steps:**

1. Create order
2. Cancel payment
3. Create new order
4. Complete payment
   **Expected Result:**

- New order created successfully
- Old order not used
- Payment verified with new order
- Appointment confirmed

### TC-PAYMENT-039: Payment - Plan Price Change

**Priority:** Low  
**Type:** Edge Case  
**Preconditions:** Plan price changed after order creation  
**Steps:**

1. Create order with old price
2. Admin changes plan price
3. Complete payment
   **Expected Result:**

- Payment verified with original order amount
- Price change doesn't affect existing orders
- Payment proceeds successfully

### TC-PAYMENT-040: Payment - Appointment Deletion

**Priority:** Medium  
**Type:** Edge Case  
**Preconditions:** Order created, appointment deleted  
**Steps:**

1. Create order for appointment
2. Admin deletes appointment
3. Attempt to verify payment
   **Expected Result:**

- Error message: "Appointment not found"
- Payment not verified
- Order not processed
