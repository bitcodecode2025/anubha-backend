# Slots Management Test Cases

## 1. Slot Generation (Admin)

### TC-SLOTS-001: Generate Slots - Valid Date Range

**Priority:** High  
**Type:** Functional  
**Preconditions:** Admin user logged in  
**Steps:**

1. Navigate to `/admin/slots`
2. Select start date and end date
3. Select appointment modes (IN_PERSON, ONLINE)
4. Click "Generate Slots"
   **Expected Result:**

- Slots generated successfully for date range
- Slots created for each day (excluding day-offs)
- Slots created for each selected mode
- Default slot duration: 40 minutes
- Default slot interval: 40 minutes
- Success message displayed

### TC-SLOTS-002: Generate Slots - Single Day

**Priority:** High  
**Type:** Functional  
**Preconditions:** Admin user logged in  
**Steps:**

1. Select same date for start and end date
2. Generate slots
   **Expected Result:**

- Slots generated for single day only
- Slots created correctly
- No errors

### TC-SLOTS-003: Generate Slots - Date Range with Day-Offs

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** Admin user logged in, day-offs exist in range  
**Steps:**

1. Select date range that includes day-offs
2. Generate slots
   **Expected Result:**

- Slots generated for all days except day-offs
- Day-offs respected
- No slots created for day-off dates

### TC-SLOTS-004: Generate Slots - Invalid Date Range

**Priority:** High  
**Type:** Validation  
**Preconditions:** Admin user logged in  
**Steps:**

1. Select end date before start date
2. Attempt to generate slots
   **Expected Result:**

- Validation error displayed
- Error message: "End date must be after start date"
- Slots not generated

### TC-SLOTS-005: Generate Slots - Past Date Range

**Priority:** Medium  
**Type:** Validation  
**Preconditions:** Admin user logged in  
**Steps:**

1. Select date range in the past
2. Attempt to generate slots
   **Expected Result:**

- Validation error displayed (if validation exists)
- Or slots generated but not available for booking
- Warning message displayed

### TC-SLOTS-006: Generate Slots - Large Date Range

**Priority:** Low  
**Type:** Performance  
**Preconditions:** Admin user logged in  
**Steps:**

1. Select date range of 30 days
2. Generate slots
   **Expected Result:**

- Slots generated successfully
- Performance acceptable
- No timeout errors
- All slots created

### TC-SLOTS-007: Generate Slots - Both Modes Selected

**Priority:** High  
**Type:** Functional  
**Preconditions:** Admin user logged in  
**Steps:**

1. Select both IN_PERSON and ONLINE modes
2. Generate slots
   **Expected Result:**

- Slots generated for both modes
- Each mode has separate slots
- Slots correctly labeled with mode

### TC-SLOTS-008: Generate Slots - Single Mode Selected

**Priority:** High  
**Type:** Functional  
**Preconditions:** Admin user logged in  
**Steps:**

1. Select only IN_PERSON mode
2. Generate slots
   **Expected Result:**

- Slots generated only for IN_PERSON
- No ONLINE slots created
- Slots correctly labeled

### TC-SLOTS-009: Generate Slots - Preview Before Generation

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** Admin user logged in  
**Steps:**

1. Select date range and modes
2. Click "Preview Slots"
3. Review preview
4. Generate slots
   **Expected Result:**

- Preview shows slots that will be created
- Preview accurate
- Can generate after preview
- Preview matches generated slots

### TC-SLOTS-010: Generate Slots - Overwrite Existing Slots

**Priority:** Medium  
**Type:** Business Logic  
**Preconditions:** Admin user logged in, slots exist for date range  
**Steps:**

1. Generate slots for date range with existing slots
2. Check existing slots
   **Expected Result:**

- Existing slots not overwritten
- Only new slots created
- No duplicate slots
- Existing bookings preserved

### TC-SLOTS-011: Generate Slots - Rate Limiting

**Priority:** Medium  
**Type:** Security  
**Preconditions:** Admin user logged in  
**Steps:**

1. Generate slots 30 times within 1 minute
2. Attempt 31st generation
   **Expected Result:**

- Rate limit error displayed
- HTTP 429 status code
- Error message: "Too many admin requests"
- Slots not generated

### TC-SLOTS-012: Generate Slots - Field Size Validation

**Priority:** Medium  
**Type:** Security  
**Preconditions:** Admin user logged in  
**Steps:**

1. Attempt to generate slots with very large date range (>10KB)
   **Expected Result:**

- Validation error displayed
- Field size limit error
- Slots not generated

## 2. Day-Off Management (Admin)

### TC-SLOTS-013: Add Day-Off - Valid Date

**Priority:** High  
**Type:** Functional  
**Preconditions:** Admin user logged in  
**Steps:**

1. Navigate to day-off section
2. Select date
3. Enter reason (optional)
4. Click "Add Day-Off"
   **Expected Result:**

- Day-off added successfully
- Day-off visible in list
- No slots generated for this date
- Success message displayed

### TC-SLOTS-014: Add Day-Off - Duplicate Date

**Priority:** Medium  
**Type:** Business Logic  
**Preconditions:** Admin user logged in, day-off exists  
**Steps:**

1. Attempt to add day-off for existing date
   **Expected Result:**

- Error message: "Day-off already exists for this date"
- Day-off not duplicated
- Status 400 Bad Request

### TC-SLOTS-015: Add Day-Off - Past Date

**Priority:** Low  
**Type:** Validation  
**Preconditions:** Admin user logged in  
**Steps:**

1. Attempt to add day-off for past date
   **Expected Result:**

- Validation error displayed (if validation exists)
- Or day-off added successfully
- Warning message displayed

### TC-SLOTS-016: Add Day-Off - With Reason

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** Admin user logged in  
**Steps:**

1. Add day-off with reason: "Holiday"
2. Verify day-off
   **Expected Result:**

- Day-off added with reason
- Reason displayed in list
- Reason stored in database

### TC-SLOTS-017: Add Day-Off - Without Reason

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** Admin user logged in  
**Steps:**

1. Add day-off without reason
2. Verify day-off
   **Expected Result:**

- Day-off added successfully
- Reason field optional
- Day-off visible in list

### TC-SLOTS-018: Remove Day-Off - Valid Day-Off

**Priority:** High  
**Type:** Functional  
**Preconditions:** Admin user logged in, day-off exists  
**Steps:**

1. Navigate to day-off list
2. Click "Remove" on day-off
3. Confirm removal
   **Expected Result:**

- Day-off removed successfully
- Day-off removed from list
- Slots can now be generated for this date
- Success message displayed

### TC-SLOTS-019: Remove Day-Off - Invalid ID

**Priority:** Medium  
**Type:** Error Handling  
**Preconditions:** Admin user logged in  
**Steps:**

1. Attempt to remove non-existent day-off ID
   **Expected Result:**

- Error message: "Day-off not found"
- Status 404 Not Found
- No changes made

### TC-SLOTS-020: List Day-Offs - Admin User

**Priority:** High  
**Type:** Functional  
**Preconditions:** Admin user logged in  
**Steps:**

1. Navigate to day-off list
2. View all day-offs
   **Expected Result:**

- All day-offs displayed
- Day-offs sorted by date
- Date and reason shown
- Remove button visible

### TC-SLOTS-021: List Day-Offs - No Day-Offs

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** Admin user logged in, no day-offs  
**Steps:**

1. Navigate to day-off list
   **Expected Result:**

- Empty state displayed
- Message: "No day-offs added"
- Add day-off button visible

## 3. Available Slots (Public/User)

### TC-SLOTS-022: Get Available Slots - Valid Date and Mode

**Priority:** High  
**Type:** Functional  
**Preconditions:** Slots exist for date and mode  
**Steps:**

1. Navigate to slot selection page
2. Select date
3. Select appointment mode (IN_PERSON/ONLINE)
4. View available slots
   **Expected Result:**

- Available slots displayed
- Only unbooked slots shown
- Slots filtered by mode
- Slots sorted by time
- Time displayed correctly

### TC-SLOTS-023: Get Available Slots - No Slots Available

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** No slots for selected date/mode  
**Steps:**

1. Select date with no available slots
2. View available slots
   **Expected Result:**

- Message displayed: "No slots available for this date"
- Empty state shown
- Can select different date
- Can change appointment mode

### TC-SLOTS-024: Get Available Slots - All Slots Booked

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** All slots for date/mode are booked  
**Steps:**

1. Select date with all slots booked
2. View available slots
   **Expected Result:**

- Message displayed: "No slots available"
- Empty state shown
- Can select different date

### TC-SLOTS-025: Get Available Slots - Day-Off Date

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** Day-off exists for selected date  
**Steps:**

1. Select date that is a day-off
2. View available slots
   **Expected Result:**

- No slots displayed
- Message: "No slots available (Day-off)"
- Can select different date

### TC-SLOTS-026: Get Available Slots - Past Date

**Priority:** Medium  
**Type:** Business Logic  
**Preconditions:** User logged in  
**Steps:**

1. Select past date
2. View available slots
   **Expected Result:**

- No slots displayed
- Message: "Cannot book slots for past dates"
- Date picker restricts past dates

### TC-SLOTS-027: Get Available Slots - Different Modes

**Priority:** High  
**Type:** Functional  
**Preconditions:** Slots exist for both modes  
**Steps:**

1. Select IN_PERSON mode
2. View slots
3. Switch to ONLINE mode
4. View slots
   **Expected Result:**

- Slots filtered by mode correctly
- IN_PERSON slots shown when IN_PERSON selected
- ONLINE slots shown when ONLINE selected
- No mixing of modes

### TC-SLOTS-028: Get Available Slots - Unauthenticated User

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** User not logged in  
**Steps:**

1. Navigate to slot selection
2. View available slots
   **Expected Result:**

- Slots displayed (public endpoint)
- Can view slots without login
- Cannot book without login

## 4. Slot Booking

### TC-SLOTS-029: Book Slot - Valid Slot

**Priority:** High  
**Type:** Functional  
**Preconditions:** User logged in, slot available  
**Steps:**

1. Select available slot
2. Confirm selection
   **Expected Result:**

- Slot booked successfully
- Slot marked as booked (`isBooked: true`)
- Appointment updated with slot
- Slot no longer available
- Redirected to payment page

### TC-SLOTS-030: Book Slot - Already Booked Slot

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
- No double booking

### TC-SLOTS-031: Book Slot - Concurrent Booking

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

### TC-SLOTS-032: Book Slot - Invalid Slot ID

**Priority:** Medium  
**Type:** Error Handling  
**Preconditions:** User logged in  
**Steps:**

1. Attempt to book non-existent slot ID
   **Expected Result:**

- Error message: "Slot not found"
- Status 404 Not Found
- Slot not booked

## 5. Admin Slot Management

### TC-SLOTS-033: Admin List All Slots - With Filters

**Priority:** High  
**Type:** Functional  
**Preconditions:** Admin user logged in  
**Steps:**

1. Navigate to admin slots list
2. Apply filters (date, mode, booked status)
3. View filtered slots
   **Expected Result:**

- Filtered slots displayed
- Filters working correctly
- Pagination working
- Slot details shown: Date, Time, Mode, Booked Status

### TC-SLOTS-034: Admin List All Slots - No Filters

**Priority:** High  
**Type:** Functional  
**Preconditions:** Admin user logged in  
**Steps:**

1. Navigate to admin slots list
2. View all slots without filters
   **Expected Result:**

- All slots displayed
- Pagination working
- Slots sorted by date/time
- Booked status visible

### TC-SLOTS-035: Admin List All Slots - Non-Admin User

**Priority:** High  
**Type:** Security  
**Preconditions:** Regular user logged in  
**Steps:**

1. Attempt to access admin slots list
   **Expected Result:**

- Access denied
- Status 403 Forbidden
- Redirected to home page

### TC-SLOTS-036: Admin List All Slots - Filter by Booked Status

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** Admin user logged in  
**Steps:**

1. Filter slots by booked status (booked/unbooked)
2. View filtered results
   **Expected Result:**

- Only slots matching filter displayed
- Filter working correctly
- Results accurate

### TC-SLOTS-037: Admin List All Slots - Filter by Mode

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** Admin user logged in  
**Steps:**

1. Filter slots by mode (IN_PERSON/ONLINE)
2. View filtered results
   **Expected Result:**

- Only slots matching mode displayed
- Filter working correctly
- Results accurate

### TC-SLOTS-038: Admin List All Slots - Filter by Date Range

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** Admin user logged in  
**Steps:**

1. Filter slots by date range
2. View filtered results
   **Expected Result:**

- Only slots in date range displayed
- Filter working correctly
- Results accurate

## 6. Edge Cases

### TC-SLOTS-039: Slot Generation - Timezone Handling

**Priority:** Low  
**Type:** Edge Case  
**Preconditions:** Admin user logged in  
**Steps:**

1. Generate slots in different timezone
2. Check slot times
   **Expected Result:**

- Times displayed correctly
- Timezone conversion handled
- No time mismatch errors

### TC-SLOTS-040: Slot Generation - Daylight Saving Time

**Priority:** Low  
**Type:** Edge Case  
**Preconditions:** Admin user logged in  
**Steps:**

1. Generate slots during DST transition
2. Check slot times
   **Expected Result:**

- Times handled correctly
- No time shift errors
- Slots generated correctly

### TC-SLOTS-041: Slot Booking - Slot Time Accuracy

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** Slot exists  
**Steps:**

1. Book slot
2. Check appointment start and end times
   **Expected Result:**

- Appointment `startAt` matches slot start time
- Appointment `endAt` matches slot end time
- Duration: 40 minutes
- Times accurate

### TC-SLOTS-042: Slot Generation - Overlapping Slots Prevention

**Priority:** Medium  
**Type:** Business Logic  
**Preconditions:** Admin user logged in  
**Steps:**

1. Generate slots
2. Check for overlapping slots
   **Expected Result:**

- No overlapping slots created
- Slots properly spaced
- Each slot has unique time

### TC-SLOTS-043: Slot - Appointment Relationship

**Priority:** Medium  
**Type:** Database  
**Preconditions:** Slot booked  
**Steps:**

1. Check slot-appointment relationship
2. Verify one-to-many relationship
   **Expected Result:**

- Multiple appointments can reference same slot (if business logic allows)
- Or one appointment per slot (if business logic restricts)
- Relationship correctly defined in schema

### TC-SLOTS-044: Slot Unbooking - Appointment Cancellation

**Priority:** High  
**Type:** Business Logic  
**Preconditions:** Appointment with slot cancelled  
**Steps:**

1. Cancel appointment with slot
2. Check slot status
   **Expected Result:**

- Slot unbooked (`isBooked: false`)
- Slot available for booking
- Status updated correctly

### TC-SLOTS-045: Slot Unbooking - Appointment Status Change

**Priority:** High  
**Type:** Business Logic  
**Preconditions:** Appointment status changed  
**Steps:**

1. Change appointment status from PENDING to CONFIRMED
2. Attempt to change slot
   **Expected Result:**

- Slot change blocked if status is CONFIRMED
- Error message displayed
- Slot remains booked
