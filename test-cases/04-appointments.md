# Appointments Test Cases

## 1. Appointment Creation

### TC-APPT-001: Create Appointment - With Slot

**Priority:** High  
**Type:** Functional  
**Preconditions:** User logged in, patient exists, slot available  
**Steps:**

1. Create appointment with `slotId`
2. Verify appointment creation
   **Expected Result:**

- Appointment created successfully
- Appointment linked to slot
- Slot marked as booked (`isBooked: true`)
- Appointment `startAt` and `endAt` set from slot
- Appointment `bookingProgress` set appropriately
- Appointment status: `PENDING`

### TC-APPT-002: Create Appointment - Without Slot (Placeholder)

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** User logged in, patient exists  
**Steps:**

1. Create appointment without `slotId`
2. Provide `startAt` and `endAt` manually
   **Expected Result:**

- Appointment created with placeholder dates
- Dates validated (must be in future, `endAt` after `startAt`)
- Warning logged if invalid dates
- Appointment status: `PENDING`

### TC-APPT-003: Create Appointment - Invalid Slot ID

**Priority:** High  
**Type:** Error Handling  
**Preconditions:** User logged in, patient exists  
**Steps:**

1. Attempt to create appointment with non-existent `slotId`
   **Expected Result:**

- Error message: "Slot not found"
- Status 404 Not Found
- Appointment not created

### TC-APPT-004: Create Appointment - Already Booked Slot

**Priority:** High  
**Type:** Error Handling  
**Preconditions:** User logged in, slot already booked  
**Steps:**

1. Attempt to create appointment with already booked slot
   **Expected Result:**

- Error message: "Slot is already booked"
- Status 400 Bad Request
- Appointment not created

### TC-APPT-005: Create Appointment - Patient Validation

**Priority:** High  
**Type:** Security  
**Preconditions:** User logged in  
**Steps:**

1. Attempt to create appointment with patient belonging to another user
   **Expected Result:**

- Error message: "Patient not found"
- Status 404 Not Found
- Appointment not created

### TC-APPT-006: Create Appointment - Patient Deletion Race Condition

**Priority:** Medium  
**Type:** Edge Case  
**Preconditions:** User logged in, patient exists  
**Steps:**

1. Start creating appointment
2. Delete patient in another session
3. Complete appointment creation
   **Expected Result:**

- Patient re-verified within transaction
- Error if patient deleted: "Patient not found"
- Transaction ensures atomicity
- No orphaned appointments

### TC-APPT-007: Create Appointment - Rate Limiting

**Priority:** High  
**Type:** Security  
**Preconditions:** User logged in  
**Steps:**

1. Create 10 appointments within 1 minute
2. Attempt to create 11th appointment
   **Expected Result:**

- Rate limit error displayed
- HTTP 429 status code
- Appointment not created

### TC-APPT-008: Create Appointment - Field Size Validation

**Priority:** Medium  
**Type:** Security  
**Preconditions:** User logged in  
**Steps:**

1. Attempt to create appointment with very large field (>10KB)
   **Expected Result:**

- Validation error displayed
- Field size limit error
- Appointment not created

## 2. Appointment Updates

### TC-APPT-009: Update Appointment Slot - Valid Slot

**Priority:** High  
**Type:** Functional  
**Preconditions:** Appointment exists with status `PENDING`  
**Steps:**

1. Update appointment with new slot
2. Verify slot update
   **Expected Result:**

- Appointment slot updated successfully
- Old slot unbooked (`isBooked: false`) if status is `PENDING`
- New slot booked (`isBooked: true`)
- Appointment `startAt` and `endAt` updated
- Appointment `bookingProgress` updated to `"SLOT"`

### TC-APPT-010: Update Appointment Slot - Confirmed Appointment

**Priority:** High  
**Type:** Business Logic  
**Preconditions:** Appointment with status `CONFIRMED`  
**Steps:**

1. Attempt to change slot of confirmed appointment
   **Expected Result:**

- Error message: "Cannot change slot of confirmed appointment"
- Status 400 Bad Request
- Slot not changed
- Old slot remains booked

### TC-APPT-011: Update Appointment Slot - Cancelled Appointment

**Priority:** Medium  
**Type:** Business Logic  
**Preconditions:** Appointment with status `CANCELLED`  
**Steps:**

1. Attempt to change slot of cancelled appointment
   **Expected Result:**

- Error message: "Cannot change slot of cancelled appointment"
- Status 400 Bad Request
- Slot not changed

### TC-APPT-012: Update Appointment Slot - Already Booked Slot

**Priority:** High  
**Type:** Error Handling  
**Preconditions:** Appointment exists, slot already booked  
**Steps:**

1. Attempt to update appointment with already booked slot
   **Expected Result:**

- Error message: "Slot is already booked"
- Status 400 Bad Request
- Appointment not updated

### TC-APPT-013: Update Booking Progress - Valid Progress

**Priority:** High  
**Type:** Functional  
**Preconditions:** Appointment exists  
**Steps:**

1. Update appointment `bookingProgress` to `"SLOT"`
   **Expected Result:**

- Progress updated successfully
- Status 200 OK
- Progress saved in database

### TC-APPT-014: Update Booking Progress - Invalid Progress

**Priority:** Medium  
**Type:** Validation  
**Preconditions:** Appointment exists  
**Steps:**

1. Attempt to update with invalid `bookingProgress` value
   **Expected Result:**

- Validation error displayed
- Status 400 Bad Request
- Progress not updated

## 3. Appointment Listing

### TC-APPT-015: Get My Appointments - Authenticated User

**Priority:** High  
**Type:** Functional  
**Preconditions:** User logged in, has appointments  
**Steps:**

1. Navigate to `/profile` or call `/api/appointments/my`
2. View appointments list
   **Expected Result:**

- All user's appointments displayed
- Appointments sorted by date (newest first)
- Appointment details shown: Date, Time, Status, Patient
- Pagination working if many appointments

### TC-APPT-016: Get My Appointments - Include Pending

**Priority:** High  
**Type:** Functional  
**Preconditions:** User logged in, has pending and confirmed appointments  
**Steps:**

1. Call `/api/appointments/my?includePending=true`
   **Expected Result:**

- Both pending and confirmed appointments returned
- Pending appointments included
- Status filter working correctly

### TC-APPT-017: Get My Appointments - Exclude Pending

**Priority:** High  
**Type:** Functional  
**Preconditions:** User logged in, has pending and confirmed appointments  
**Steps:**

1. Call `/api/appointments/my?includePending=false`
   **Expected Result:**

- Only confirmed appointments returned
- Pending appointments excluded
- Status filter working correctly

### TC-APPT-018: Get My Appointments - No Appointments

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** User logged in, no appointments  
**Steps:**

1. View appointments list
   **Expected Result:**

- Empty state displayed
- Message: "No appointments found"
- Create appointment button visible

### TC-APPT-019: Get My Appointments - Unauthenticated

**Priority:** High  
**Type:** Security  
**Preconditions:** User not logged in  
**Steps:**

1. Attempt to access `/api/appointments/my`
   **Expected Result:**

- Status 401 Unauthorized
- Redirected to login page (frontend)

### TC-APPT-020: Get Pending Appointments - Valid Request

**Priority:** High  
**Type:** Functional  
**Preconditions:** User logged in, has pending appointments  
**Steps:**

1. Call `/api/appointments/pending`
   **Expected Result:**

- All pending appointments returned
- `bookingProgress` included for each
- Appointments sorted by creation date
- Status 200 OK

### TC-APPT-021: Get Pending Appointments - No Pending

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** User logged in, no pending appointments  
**Steps:**

1. Call `/api/appointments/pending`
   **Expected Result:**

- Empty array returned
- Status 200 OK
- No error message

### TC-APPT-022: Get Appointments by Patient - Valid Patient

**Priority:** High  
**Type:** Functional  
**Preconditions:** User logged in, patient has appointments  
**Steps:**

1. Call `/api/appointments/patient/:patientId`
   **Expected Result:**

- All appointments for patient returned
- Appointments sorted by date
- Status 200 OK

### TC-APPT-023: Get Appointments by Patient - Invalid Patient

**Priority:** Medium  
**Type:** Error Handling  
**Preconditions:** User logged in  
**Steps:**

1. Call `/api/appointments/patient/invalid-id`
   **Expected Result:**

- Error message: "Patient not found"
- Status 404 Not Found

### TC-APPT-024: Get Appointments by Patient - Other User's Patient

**Priority:** High  
**Type:** Security  
**Preconditions:** User logged in, patient belongs to another user  
**Steps:**

1. Attempt to get appointments for other user's patient
   **Expected Result:**

- Error message: "Patient not found"
- Status 404 Not Found
- No appointments returned

### TC-APPT-025: Get Appointment Details - Valid ID

**Priority:** High  
**Type:** Functional  
**Preconditions:** User logged in, appointment exists  
**Steps:**

1. Call `/api/appointments/my/:id`
   **Expected Result:**

- Appointment details returned
- All appointment data included
- Status 200 OK

### TC-APPT-026: Get Appointment Details - Invalid ID

**Priority:** Medium  
**Type:** Error Handling  
**Preconditions:** User logged in  
**Steps:**

1. Call `/api/appointments/my/invalid-id`
   **Expected Result:**

- Error message: "Appointment not found"
- Status 404 Not Found

### TC-APPT-027: Get Appointment Details - Other User's Appointment

**Priority:** High  
**Type:** Security  
**Preconditions:** User logged in, appointment belongs to another user  
**Steps:**

1. Attempt to access other user's appointment
   **Expected Result:**

- Error message: "Appointment not found"
- Status 404 Not Found
- No appointment data returned

## 4. Appointment Status Management

### TC-APPT-028: Confirm Appointment - Payment Success

**Priority:** High  
**Type:** Functional  
**Preconditions:** Payment verified successfully  
**Steps:**

1. Payment verification completes
2. Check appointment status
   **Expected Result:**

- Appointment status updated to `CONFIRMED`
- Appointment `bookingProgress` set to `null`
- WhatsApp confirmation sent to patient and doctor
- Appointment visible in confirmed appointments list

### TC-APPT-029: Confirm Appointment - Admin Manual

**Priority:** High  
**Type:** Functional  
**Preconditions:** Admin user logged in, appointment exists  
**Steps:**

1. Admin updates appointment status to `CONFIRMED`
2. Verify status update
   **Expected Result:**

- Appointment status updated to `CONFIRMED`
- Appointment `bookingProgress` set to `null`
- WhatsApp confirmation sent to patient and doctor
- Status change logged

### TC-APPT-030: Cancel Appointment - User

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** User logged in, appointment exists  
**Steps:**

1. Cancel appointment
2. Verify cancellation
   **Expected Result:**

- Appointment status updated to `CANCELLED`
- Slot unbooked if appointment was confirmed
- Cancellation reason saved (if provided)
- Appointment removed from active list

### TC-APPT-031: Cancel Appointment - Confirmed Appointment

**Priority:** High  
**Type:** Business Logic  
**Preconditions:** Appointment with status `CONFIRMED`  
**Steps:**

1. Cancel confirmed appointment
2. Verify slot unbooking
   **Expected Result:**

- Appointment status updated to `CANCELLED`
- Slot unbooked (`isBooked: false`)
- Slot available for other appointments
- Cancellation logged

### TC-APPT-032: Complete Appointment - Admin

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** Admin user logged in, appointment exists  
**Steps:**

1. Admin marks appointment as `COMPLETED`
2. Verify status update
   **Expected Result:**

- Appointment status updated to `COMPLETED`
- Status change logged
- Appointment visible in completed appointments list

## 5. Frontend Appointment Display

### TC-APPT-033: Profile Page - Pending Appointments Section

**Priority:** High  
**Type:** UI/UX  
**Preconditions:** User logged in, has pending appointments  
**Steps:**

1. Navigate to `/profile`
2. View pending appointments section
   **Expected Result:**

- Pending appointments displayed
- Progress indicator shown for each
- "Continue Booking" button visible
- Appointments sorted by creation date

### TC-APPT-034: Profile Page - My Appointments Section

**Priority:** High  
**Type:** UI/UX  
**Preconditions:** User logged in, has confirmed appointments  
**Steps:**

1. Navigate to `/profile`
2. View "My Appointments" section
   **Expected Result:**

- Confirmed appointments displayed
- Appointment date shown
- Slot timing displayed (e.g., "12:00 to 12:40")
- Patient name shown
- Appointment details accessible

### TC-APPT-035: Profile Page - Section Order

**Priority:** Medium  
**Type:** UI/UX  
**Preconditions:** User logged in, has both pending and confirmed appointments  
**Steps:**

1. Navigate to `/profile`
2. Check section order
   **Expected Result:**

- "My Appointments" section appears first
- "Pending Appointments" section appears second
- Sections clearly separated

### TC-APPT-036: Appointment Card - Slot Timing Display

**Priority:** High  
**Type:** UI/UX  
**Preconditions:** Confirmed appointment exists  
**Steps:**

1. View appointment card
2. Check slot timing display
   **Expected Result:**

- "Slot Timing" heading displayed
- Full time range shown (e.g., "12:00 to 12:40")
- Time formatted correctly
- Date displayed separately

### TC-APPT-037: Appointment Card - Appointment Date Display

**Priority:** Medium  
**Type:** UI/UX  
**Preconditions:** Confirmed appointment exists  
**Steps:**

1. View appointment card
2. Check appointment date display
   **Expected Result:**

- "Appointment Date" label shown
- Date formatted correctly (e.g., "Jan 15, 2024")
- Date clearly visible

### TC-APPT-038: Pending Appointment Card - Progress Icon

**Priority:** Medium  
**Type:** UI/UX  
**Preconditions:** Pending appointment exists  
**Steps:**

1. View pending appointment card
2. Check progress icon
   **Expected Result:**

- Progress icon displayed
- Icon color indicates step
- Icon matches current `bookingProgress`

### TC-APPT-039: Pending Appointment Card - Continue Booking

**Priority:** High  
**Type:** Functional  
**Preconditions:** Pending appointment exists  
**Steps:**

1. Click "Continue Booking" button
2. Verify navigation
   **Expected Result:**

- Booking form loaded with saved data
- Redirected to correct step based on `bookingProgress`
- Form context populated
- Can continue booking

## 6. Edge Cases

### TC-APPT-040: Appointment Creation - Concurrent Slot Booking

**Priority:** Medium  
**Type:** Edge Case  
**Preconditions:** Multiple users viewing same slot  
**Steps:**

1. Two users attempt to create appointment with same slot simultaneously
   **Expected Result:**

- Only one appointment created
- Other user gets error: "Slot is already booked"
- Database transaction ensures atomicity
- No double booking

### TC-APPT-041: Appointment Update - Slot Change Race Condition

**Priority:** Medium  
**Type:** Edge Case  
**Preconditions:** Appointment exists, slot being changed  
**Steps:**

1. Start updating appointment slot
2. Another process changes appointment status
3. Complete slot update
   **Expected Result:**

- Status checked before unbooking old slot
- Error if status changed to CONFIRMED/CANCELLED
- Transaction ensures atomicity

### TC-APPT-042: Appointment Listing - Large Dataset

**Priority:** Low  
**Type:** Performance  
**Preconditions:** User has many appointments (100+)  
**Steps:**

1. Load appointments list
2. Check performance
   **Expected Result:**

- Pagination working
- Page loads quickly
- No performance issues
- All appointments accessible

### TC-APPT-043: Appointment - Timezone Handling

**Priority:** Low  
**Type:** Edge Case  
**Preconditions:** Appointment exists  
**Steps:**

1. View appointment in different timezone
2. Check time display
   **Expected Result:**

- Times displayed correctly
- Timezone conversion handled
- No time mismatch errors

### TC-APPT-044: Appointment - Date Range Filtering

**Priority:** Low  
**Type:** Functional  
**Preconditions:** Appointments exist across date range  
**Steps:**

1. Filter appointments by date range
2. Check filtered results
   **Expected Result:**

- Only appointments in range displayed
- Filter working correctly
- No appointments outside range shown
