# Booking Flow Test Cases

## 1. Plan Selection

### TC-BOOKING-001: Select Plan - Valid Plan

**Priority:** High  
**Type:** Functional  
**Preconditions:** User logged in  
**Steps:**

1. Navigate to `/services`
2. Browse available plans
3. Click on a plan card
   **Expected Result:**

- Plan details displayed
- Plan slug, name, price stored in booking context
- Redirected to `/book/user-details`
- Plan data persisted in localStorage

### TC-BOOKING-002: Select Plan - Without Login

**Priority:** High  
**Type:** Functional  
**Preconditions:** User not logged in  
**Steps:**

1. Navigate to `/services`
2. Click on a plan card
   **Expected Result:**

- Redirected to `/login`
- Plan selection stored for redirect after login
- After login, redirected to booking flow

### TC-BOOKING-003: Select Plan - Invalid Plan Slug

**Priority:** Medium  
**Type:** Error Handling  
**Preconditions:** User logged in  
**Steps:**

1. Navigate to `/services/invalid-plan-slug`
   **Expected Result:**

- Error message displayed
- Redirected to `/services`
- Plan not selected

### TC-BOOKING-004: Select Plan - Plan Price Display

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** User logged in  
**Steps:**

1. View plan details
2. Check price display
   **Expected Result:**

- Price displayed correctly
- Currency formatted (₹ symbol)
- Plan duration shown

## 2. User Details Step

### TC-BOOKING-005: User Details - Complete Form

**Priority:** High  
**Type:** Functional  
**Preconditions:** Plan selected, user logged in  
**Steps:**

1. Navigate to `/book/user-details`
2. Fill all steps:
   - Step 1: Personal Info
   - Step 2: Measurements
   - Step 3: Medical
   - Step 4: Lifestyle
   - Step 5: Review
3. Click "Proceed to Recall"
   **Expected Result:**

- Patient created successfully
- Appointment created with `bookingProgress: "USER_DETAILS"`
- Redirected to `/book/recall`
- Form data saved in context

### TC-BOOKING-006: User Details - Step Navigation

**Priority:** High  
**Type:** Functional  
**Preconditions:** Plan selected  
**Steps:**

1. Navigate through steps using Next/Previous buttons
2. Fill data in each step
   **Expected Result:**

- Can navigate between steps
- Data preserved when navigating back
- Validation prevents skipping incomplete steps
- Step indicator updates correctly

### TC-BOOKING-007: User Details - Validation Per Step

**Priority:** High  
**Type:** Validation  
**Preconditions:** Plan selected  
**Steps:**

1. Attempt to proceed to next step without filling required fields
   **Expected Result:**

- Validation error displayed
- Cannot proceed to next step
- Error message shows missing field name
- Focus on first missing field

### TC-BOOKING-008: User Details - Resume Booking

**Priority:** High  
**Type:** Functional  
**Preconditions:** User has pending appointment with `bookingProgress: "USER_DETAILS"`  
**Steps:**

1. Navigate to profile
2. View pending appointments
3. Click "Continue Booking"
   **Expected Result:**

- Booking form loaded with saved data
- Redirected to `/book/recall` (next step)
- Form context populated
- Can continue from where left off

### TC-BOOKING-009: User Details - Select Existing Patient

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** User has existing patients  
**Steps:**

1. Navigate to booking flow
2. Select existing patient from plan card
3. Proceed to recall
   **Expected Result:**

- Existing patient selected
- Appointment created with existing patient
- Can proceed to recall step
- Patient data loaded correctly

## 3. Recall Step

### TC-BOOKING-010: Recall Form - Complete Submission

**Priority:** High  
**Type:** Functional  
**Preconditions:** Patient created, appointment exists  
**Steps:**

1. Navigate to `/book/recall`
2. Fill recall form with meal entries
3. Upload files (optional)
4. Submit form
   **Expected Result:**

- Recall created successfully
- Recall linked to appointment
- Appointment `bookingProgress` updated to `"RECALL"`
- Redirected to `/book/slot`
- Form data saved

### TC-BOOKING-011: Recall Form - Missing Plan Details

**Priority:** High  
**Type:** Error Handling  
**Preconditions:** User logged in, no plan selected  
**Steps:**

1. Navigate directly to `/book/recall`
   **Expected Result:**

- Redirected to `/services`
- Error message displayed
- Cannot proceed without plan

### TC-BOOKING-012: Recall Form - Missing Patient

**Priority:** High  
**Type:** Error Handling  
**Preconditions:** User logged in, plan selected, no patient created  
**Steps:**

1. Navigate directly to `/book/recall` without creating patient
   **Expected Result:**

- Redirected to `/book/user-details`
- Error message displayed
- Cannot proceed without patient

### TC-BOOKING-013: Recall Form - Appointment Mode Selection

**Priority:** High  
**Type:** Functional  
**Preconditions:** Patient created  
**Steps:**

1. Select appointment mode: "IN_PERSON" or "ONLINE"
2. Submit recall form
   **Expected Result:**

- Appointment mode saved
- Mode validated (must be "IN_PERSON" or "ONLINE")
- Default to "IN_PERSON" if invalid
- Mode used for slot filtering

### TC-BOOKING-014: Recall Form - File Upload

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** Patient created  
**Steps:**

1. Upload files in recall form
2. Submit form
   **Expected Result:**

- Files uploaded successfully
- Files linked to recall
- Files visible in recall details

### TC-BOOKING-015: Recall Form - Multiple Meal Entries

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** Patient created  
**Steps:**

1. Add multiple meal entries
2. Fill details for each
3. Submit form
   **Expected Result:**

- All entries saved
- Entries displayed correctly
- Data structured properly

## 4. Slot Selection Step

### TC-BOOKING-016: Slot Selection - View Available Slots

**Priority:** High  
**Type:** Functional  
**Preconditions:** Recall submitted, appointment exists  
**Steps:**

1. Navigate to `/book/slot`
2. Select date
3. View available slots
   **Expected Result:**

- Available slots displayed
- Slots filtered by appointment mode (IN_PERSON/ONLINE)
- Booked slots not shown
- Slots displayed in time order

### TC-BOOKING-017: Slot Selection - Select Slot

**Priority:** High  
**Type:** Functional  
**Preconditions:** Available slots exist  
**Steps:**

1. Click on an available slot
2. Confirm selection
   **Expected Result:**

- Slot selected successfully
- Slot marked as booked (`isBooked: true`)
- Appointment updated with `slotId`
- Appointment `bookingProgress` updated to `"SLOT"`
- Redirected to `/book/payment`

### TC-BOOKING-018: Slot Selection - No Slots Available

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** No slots available for selected date/mode  
**Steps:**

1. Select date with no available slots
   **Expected Result:**

- Message displayed: "No slots available for this date"
- Can select different date
- Can change appointment mode

### TC-BOOKING-019: Slot Selection - Slot Already Booked

**Priority:** High  
**Type:** Error Handling  
**Preconditions:** Slot becomes booked between loading and selection  
**Steps:**

1. Load slot selection page
2. Another user books the slot
3. Attempt to select same slot
   **Expected Result:**

- Error message: "Slot is already booked"
- Slot removed from available list
- Can select different slot

### TC-BOOKING-020: Slot Selection - Missing Plan Slug

**Priority:** Medium  
**Type:** Error Handling  
**Preconditions:** User logged in, plan not in context  
**Steps:**

1. Navigate directly to `/book/slot` without plan
   **Expected Result:**

- Redirected to `/services`
- Error message displayed
- Cannot proceed without plan

### TC-BOOKING-021: Slot Selection - Create Appointment if Missing

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** Patient exists but no appointment  
**Steps:**

1. Navigate to `/book/slot` with patientId but no appointmentId
2. Select slot
   **Expected Result:**

- Appointment created automatically
- Appointment `bookingProgress: "USER_DETAILS"`
- Slot assigned to appointment
- Can proceed to payment

## 5. Payment Step

### TC-BOOKING-022: Payment - Create Razorpay Order

**Priority:** High  
**Type:** Functional  
**Preconditions:** Slot selected, appointment exists  
**Steps:**

1. Navigate to `/book/payment`
2. View payment details
3. Click "Pay Now"
   **Expected Result:**

- Razorpay order created
- Order ID returned
- Razorpay checkout opened
- Order amount matches plan price

### TC-BOOKING-023: Payment - Missing Appointment

**Priority:** High  
**Type:** Error Handling  
**Preconditions:** User logged in, no appointment  
**Steps:**

1. Navigate directly to `/book/payment`
   **Expected Result:**

- Redirected to `/book/slot`
- Error message displayed
- Cannot proceed without appointment

### TC-BOOKING-024: Payment - Get Existing Order

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** Appointment exists, order previously created  
**Steps:**

1. Navigate to payment page
2. Check for existing order
   **Expected Result:**

- Existing order retrieved if available
- Order details displayed
- Can proceed with existing order

### TC-BOOKING-025: Payment - Verify Payment Success

**Priority:** High  
**Type:** Functional  
**Preconditions:** Payment initiated  
**Steps:**

1. Complete payment in Razorpay
2. Payment successful
3. Return to application
   **Expected Result:**

- Payment verified successfully
- Appointment status updated to `"CONFIRMED"`
- Appointment `bookingProgress` set to `null`
- WhatsApp confirmation sent to patient and doctor
- Success toast displayed
- Redirected to `/profile` after 1 second

### TC-BOOKING-026: Payment - Payment Failure

**Priority:** High  
**Type:** Error Handling  
**Preconditions:** Payment initiated  
**Steps:**

1. Cancel payment in Razorpay
2. Return to application
   **Expected Result:**

- Payment not verified
- Appointment remains `PENDING`
- Error message displayed
- Can retry payment

### TC-BOOKING-027: Payment - Invalid Payment Signature

**Priority:** High  
**Type:** Security  
**Preconditions:** Payment response received  
**Steps:**

1. Send payment verification with invalid signature
   **Expected Result:**

- Payment verification fails
- Error message: "Invalid payment signature"
- Appointment not confirmed
- Payment not processed

### TC-BOOKING-028: Payment - Rate Limiting

**Priority:** High  
**Type:** Security  
**Preconditions:** User logged in  
**Steps:**

1. Create 10 payment orders within 1 minute
2. Attempt to create 11th order
   **Expected Result:**

- Rate limit error displayed
- HTTP 429 status code
- Order not created

### TC-BOOKING-029: Payment - Payment Verification Rate Limiting

**Priority:** High  
**Type:** Security  
**Preconditions:** User logged in  
**Steps:**

1. Attempt to verify payment 5 times within 1 minute
2. Attempt 6th verification
   **Expected Result:**

- Rate limit error displayed
- HTTP 429 status code
- Verification blocked

## 6. Resume Booking Flow

### TC-BOOKING-030: Resume Booking - From User Details Step

**Priority:** High  
**Type:** Functional  
**Preconditions:** Appointment with `bookingProgress: "USER_DETAILS"`  
**Steps:**

1. Navigate to profile
2. View pending appointments
3. Click "Continue Booking"
   **Expected Result:**

- Booking form loaded
- Redirected to `/book/recall` (next step)
- Form context populated
- Can continue booking

### TC-BOOKING-031: Resume Booking - From Recall Step

**Priority:** High  
**Type:** Functional  
**Preconditions:** Appointment with `bookingProgress: "RECALL"`  
**Steps:**

1. Navigate to profile
2. View pending appointments
3. Click "Continue Booking"
   **Expected Result:**

- Redirected to `/book/slot` (next step)
- Recall data loaded
- Can select slot

### TC-BOOKING-032: Resume Booking - From Slot Step

**Priority:** High  
**Type:** Functional  
**Preconditions:** Appointment with `bookingProgress: "SLOT"`  
**Steps:**

1. Navigate to profile
2. View pending appointments
3. Click "Continue Booking"
   **Expected Result:**

- Redirected to `/book/payment` (next step)
- Slot data loaded
- Can proceed to payment

### TC-BOOKING-033: Resume Booking - From Payment Step

**Priority:** High  
**Type:** Functional  
**Preconditions:** Appointment with `bookingProgress: "PAYMENT"`  
**Steps:**

1. Navigate to profile
2. View pending appointments
3. Click "Continue Booking"
   **Expected Result:**

- Redirected to `/book/payment`
- Existing order retrieved if available
- Can complete payment

### TC-BOOKING-034: Resume Booking - Load Form Context

**Priority:** High  
**Type:** Functional  
**Preconditions:** Pending appointment exists  
**Steps:**

1. Resume booking
2. Check form context
   **Expected Result:**

- All form fields populated:
  - `planSlug`, `planName`, `planPrice`
  - `patientId`, `appointmentId`
  - `appointmentMode`
  - `planPackageDuration`
- Context persisted in localStorage
- Can navigate between steps

### TC-BOOKING-035: Resume Booking - Progress Indicator

**Priority:** Medium  
**Type:** UI/UX  
**Preconditions:** Pending appointment exists  
**Steps:**

1. View pending appointment card
2. Check progress indicator
   **Expected Result:**

- Progress step displayed correctly
- Icon shows current step
- Color indicates progress
- Label shows step name

## 7. Booking Context Management

### TC-BOOKING-036: Booking Context - Persistence

**Priority:** High  
**Type:** Functional  
**Preconditions:** User in booking flow  
**Steps:**

1. Fill booking form data
2. Refresh page
3. Check form data
   **Expected Result:**

- Form data persisted in localStorage
- Data restored on page load
- Can continue from same step

### TC-BOOKING-037: Booking Context - Clear on Completion

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** Booking completed  
**Steps:**

1. Complete payment successfully
2. Check localStorage
   **Expected Result:**

- Booking context cleared
- Form data removed from localStorage
- Fresh state for next booking

### TC-BOOKING-038: Booking Context - Multiple Bookings

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** User has multiple pending appointments  
**Steps:**

1. Start new booking
2. Check context doesn't mix with previous booking
   **Expected Result:**

- Each booking has separate context
- No data mixing
- Can switch between bookings

## 8. Edge Cases

### TC-BOOKING-039: Booking Flow - Network Interruption

**Priority:** Medium  
**Type:** Error Handling  
**Preconditions:** User in booking flow  
**Steps:**

1. Fill form data
2. Network disconnects
3. Submit form
   **Expected Result:**

- Error message displayed
- Data preserved in context
- Can retry after network restored
- No data loss

### TC-BOOKING-040: Booking Flow - Concurrent Slot Booking

**Priority:** Medium  
**Type:** Edge Case  
**Preconditions:** Multiple users viewing same slot  
**Steps:**

1. Two users attempt to book same slot simultaneously
   **Expected Result:**

- Only one user succeeds
- Other user gets error: "Slot already booked"
- Database transaction ensures atomicity
- No double booking

### TC-BOOKING-041: Booking Flow - Session Expiry

**Priority:** Medium  
**Type:** Error Handling  
**Preconditions:** User session expires during booking  
**Steps:**

1. Start booking flow
2. Session expires
3. Attempt to proceed to next step
   **Expected Result:**

- Redirected to login
- Booking context preserved
- After login, redirected back to booking flow
- Can continue from same step

### TC-BOOKING-042: Booking Flow - Plan Price Change

**Priority:** Low  
**Type:** Edge Case  
**Preconditions:** User selected plan, price changed  
**Steps:**

1. Select plan with price ₹1000
2. Admin changes plan price to ₹1500
3. Proceed to payment
   **Expected Result:**

- Payment uses price from booking context (₹1000)
- Original price honored
- No price mismatch errors

### TC-BOOKING-043: Booking Flow - Appointment Deletion

**Priority:** Medium  
**Type:** Edge Case  
**Preconditions:** User has pending appointment  
**Steps:**

1. Admin deletes appointment
2. User attempts to resume booking
   **Expected Result:**

- Error message: "Appointment not found"
- Pending appointment removed from list
- User can start new booking

### TC-BOOKING-044: Booking Flow - Invalid Appointment Mode

**Priority:** Medium  
**Type:** Validation  
**Preconditions:** User in recall step  
**Steps:**

1. Set invalid `appointmentMode` (e.g., `null` or invalid string)
2. Submit recall form
   **Expected Result:**

- Mode validated and defaulted to `"IN_PERSON"`
- Form submits successfully
- No errors in appointment creation
