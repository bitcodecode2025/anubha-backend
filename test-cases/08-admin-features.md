# Admin Features Test Cases

## 1. Admin Authentication

### TC-ADMIN-001: Admin Login - Valid Admin User

**Priority:** High  
**Type:** Functional  
**Preconditions:** Admin user account exists  
**Steps:**

1. Navigate to login page
2. Enter admin phone number
3. Complete OTP verification
   **Expected Result:**

- Admin logged in successfully
- Admin role assigned
- Admin routes accessible
- Admin dashboard accessible

### TC-ADMIN-002: Admin Login - Non-Admin User

**Priority:** High  
**Type:** Security  
**Preconditions:** Regular user account exists  
**Steps:**

1. Attempt to access admin routes
2. Verify access denied
   **Expected Result:**

- Access denied
- Status 403 Forbidden
- Redirected to home page
- Error message displayed

### TC-ADMIN-003: Admin Route Protection - Middleware

**Priority:** High  
**Type:** Security  
**Preconditions:** Regular user logged in  
**Steps:**

1. Attempt to access `/admin/appointments`
   **Expected Result:**

- Access denied
- Status 403 Forbidden
- Redirected appropriately
- Admin middleware working

## 2. Appointment Management (Admin)

### TC-ADMIN-004: Admin List Appointments - All Appointments

**Priority:** High  
**Type:** Functional  
**Preconditions:** Admin user logged in  
**Steps:**

1. Navigate to `/admin/appointments`
2. View appointments list
   **Expected Result:**

- All appointments displayed
- Appointments from all users shown
- Pagination working
- Filters available (status, mode, date)

### TC-ADMIN-005: Admin List Appointments - Filter by Status

**Priority:** High  
**Type:** Functional  
**Preconditions:** Admin user logged in  
**Steps:**

1. Filter appointments by status (PENDING, CONFIRMED, CANCELLED, COMPLETED)
2. View filtered results
   **Expected Result:**

- Only appointments matching status displayed
- Filter working correctly
- Results accurate

### TC-ADMIN-006: Admin List Appointments - Filter by Mode

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** Admin user logged in  
**Steps:**

1. Filter appointments by mode (IN_PERSON, ONLINE)
2. View filtered results
   **Expected Result:**

- Only appointments matching mode displayed
- Filter working correctly
- Results accurate

### TC-ADMIN-007: Admin List Appointments - Filter by Date Range

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** Admin user logged in  
**Steps:**

1. Filter appointments by date range
2. View filtered results
   **Expected Result:**

- Only appointments in date range displayed
- Filter working correctly
- Results accurate

### TC-ADMIN-008: Admin List Appointments - Pagination

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** Admin user logged in, many appointments exist  
**Steps:**

1. Navigate through pages
2. Check pagination
   **Expected Result:**

- Pagination working correctly
- Page numbers displayed
- Can navigate between pages
- Results consistent

### TC-ADMIN-009: Admin Get Appointment Details - Valid ID

**Priority:** High  
**Type:** Functional  
**Preconditions:** Admin user logged in, appointment exists  
**Steps:**

1. Navigate to appointment details
2. View appointment information
   **Expected Result:**

- Appointment details displayed
- Patient information shown
- Slot information shown
- Payment information shown
- Doctor notes accessible

### TC-ADMIN-010: Admin Get Appointment Details - Invalid ID

**Priority:** Medium  
**Type:** Error Handling  
**Preconditions:** Admin user logged in  
**Steps:**

1. Attempt to access non-existent appointment
   **Expected Result:**

- Error message: "Appointment not found"
- Status 404 Not Found
- Redirected appropriately

### TC-ADMIN-011: Admin Update Appointment Status - To CONFIRMED

**Priority:** High  
**Type:** Functional  
**Preconditions:** Admin user logged in, appointment exists  
**Steps:**

1. Update appointment status to CONFIRMED
2. Verify status update
   **Expected Result:**

- Status updated successfully
- Appointment `bookingProgress` set to `null`
- WhatsApp confirmation sent to patient and doctor
- Status change logged
- Success message displayed

### TC-ADMIN-012: Admin Update Appointment Status - To CANCELLED

**Priority:** High  
**Type:** Functional  
**Preconditions:** Admin user logged in, appointment exists  
**Steps:**

1. Update appointment status to CANCELLED
2. Verify status update
   **Expected Result:**

- Status updated successfully
- Slot unbooked if appointment was confirmed
- Status change logged
- Success message displayed

### TC-ADMIN-013: Admin Update Appointment Status - To COMPLETED

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** Admin user logged in, appointment exists  
**Steps:**

1. Update appointment status to COMPLETED
2. Verify status update
   **Expected Result:**

- Status updated successfully
- Status change logged
- Success message displayed

### TC-ADMIN-014: Admin Update Appointment Status - Invalid Status

**Priority:** Medium  
**Type:** Validation  
**Preconditions:** Admin user logged in, appointment exists  
**Steps:**

1. Attempt to update with invalid status
   **Expected Result:**

- Validation error displayed
- Status not updated
- Error message shown

### TC-ADMIN-015: Admin Update Appointment Status - Rate Limiting

**Priority:** Medium  
**Type:** Security  
**Preconditions:** Admin user logged in  
**Steps:**

1. Update appointment status 30 times within 1 minute
2. Attempt 31st update
   **Expected Result:**

- Rate limit error displayed
- HTTP 429 status code
- Status not updated

## 3. Patient Management (Admin)

### TC-ADMIN-016: Admin List All Patients - All Patients

**Priority:** High  
**Type:** Functional  
**Preconditions:** Admin user logged in  
**Steps:**

1. Navigate to patient list
2. View all patients
   **Expected Result:**

- All patients from all users displayed
- Patient details shown
- Owner information visible
- Pagination working

### TC-ADMIN-017: Admin Get Patient Details - Valid ID

**Priority:** High  
**Type:** Functional  
**Preconditions:** Admin user logged in, patient exists  
**Steps:**

1. Navigate to patient details
2. View patient information
   **Expected Result:**

- Patient details displayed
- Owner information shown
- Associated appointments visible
- Files visible
- Can edit patient

### TC-ADMIN-018: Admin Update Patient - Valid Data

**Priority:** High  
**Type:** Functional  
**Preconditions:** Admin user logged in, patient exists  
**Steps:**

1. Update patient information
2. Save changes
   **Expected Result:**

- Patient updated successfully
- Changes saved to database
- Success message displayed
- Updated data visible

### TC-ADMIN-019: Admin Update Patient - Invalid Data

**Priority:** Medium  
**Type:** Validation  
**Preconditions:** Admin user logged in, patient exists  
**Steps:**

1. Attempt to update with invalid data
2. Save changes
   **Expected Result:**

- Validation error displayed
- Patient not updated
- Error message shown

## 4. Slot Management (Admin)

### TC-ADMIN-020: Admin Generate Slots - Valid Date Range

**Priority:** High  
**Type:** Functional  
**Preconditions:** Admin user logged in  
**Steps:**

1. Navigate to `/admin/slots`
2. Generate slots for date range
3. Verify slot generation
   **Expected Result:**

- Slots generated successfully
- Slots created for selected dates
- Slots created for selected modes
- Success message displayed

### TC-ADMIN-021: Admin List All Slots - With Filters

**Priority:** High  
**Type:** Functional  
**Preconditions:** Admin user logged in  
**Steps:**

1. Navigate to slots list
2. Apply filters
3. View filtered slots
   **Expected Result:**

- Filtered slots displayed
- Filters working correctly
- Pagination working
- Slot details shown

### TC-ADMIN-022: Admin Add Day-Off - Valid Date

**Priority:** High  
**Type:** Functional  
**Preconditions:** Admin user logged in  
**Steps:**

1. Add day-off for date
2. Verify day-off added
   **Expected Result:**

- Day-off added successfully
- Day-off visible in list
- No slots generated for this date
- Success message displayed

### TC-ADMIN-023: Admin Remove Day-Off - Valid Day-Off

**Priority:** High  
**Type:** Functional  
**Preconditions:** Admin user logged in, day-off exists  
**Steps:**

1. Remove day-off
2. Verify removal
   **Expected Result:**

- Day-off removed successfully
- Day-off removed from list
- Slots can be generated for this date
- Success message displayed

## 5. Doctor Notes Management (Admin)

### TC-ADMIN-024: Admin Save Doctor Notes - Complete Form

**Priority:** High  
**Type:** Functional  
**Preconditions:** Admin user logged in, appointment exists  
**Steps:**

1. Fill doctor notes form
2. Save notes
   **Expected Result:**

- Notes saved successfully
- All sections saved
- Data stored correctly
- Success message displayed

### TC-ADMIN-025: Admin Get Doctor Notes - Valid Appointment

**Priority:** High  
**Type:** Functional  
**Preconditions:** Admin user logged in, notes exist  
**Steps:**

1. Get doctor notes for appointment
2. Verify notes returned
   **Expected Result:**

- Notes returned successfully
- All sections included
- Data formatted correctly
- Status 200 OK

### TC-ADMIN-026: Admin Update Doctor Notes - Valid Data

**Priority:** High  
**Type:** Functional  
**Preconditions:** Admin user logged in, notes exist  
**Steps:**

1. Update doctor notes
2. Save changes
   **Expected Result:**

- Notes updated successfully
- Changes saved
- Previous data overwritten
- Success message displayed

## 6. Admin Dashboard

### TC-ADMIN-027: Admin Dashboard - Access

**Priority:** High  
**Type:** Functional  
**Preconditions:** Admin user logged in  
**Steps:**

1. Navigate to `/admin`
2. View dashboard
   **Expected Result:**

- Dashboard accessible
- Admin features visible
- Navigation working
- Statistics displayed (if available)

### TC-ADMIN-028: Admin Dashboard - Statistics

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** Admin user logged in  
**Steps:**

1. View dashboard statistics
2. Check statistics accuracy
   **Expected Result:**

- Statistics displayed correctly
- Counts accurate
- Data up-to-date

## 7. Edge Cases

### TC-ADMIN-029: Admin - Concurrent Status Updates

**Priority:** Low  
**Type:** Edge Case  
**Preconditions:** Multiple admins viewing same appointment  
**Steps:**

1. Two admins update appointment status simultaneously
2. Check final state
   **Expected Result:**

- Last update wins
- No data corruption
- Changes preserved
- Status consistent

### TC-ADMIN-030: Admin - Large Dataset Handling

**Priority:** Low  
**Type:** Performance  
**Preconditions:** Many appointments/patients exist  
**Steps:**

1. Load admin lists
2. Check performance
   **Expected Result:**

- Pagination working
- Page loads quickly
- No performance issues
- All data accessible

### TC-ADMIN-031: Admin - Session Expiry

**Priority:** Medium  
**Type:** Error Handling  
**Preconditions:** Admin session expires  
**Steps:**

1. Admin session expires during operation
2. Attempt to continue operation
   **Expected Result:**

- Redirected to login
- Operation not completed
- Can login and continue

### TC-ADMIN-032: Admin - Rate Limiting

**Priority:** Medium  
**Type:** Security  
**Preconditions:** Admin user logged in  
**Steps:**

1. Make 30 admin requests within 1 minute
2. Attempt 31st request
   **Expected Result:**

- Rate limit error displayed
- HTTP 429 status code
- Request blocked
