# Patient Management Test Cases

## 1. Patient Creation

### TC-PATIENT-001: Create Patient - Complete Valid Data

**Priority:** High  
**Type:** Functional  
**Preconditions:** User logged in, plan selected  
**Steps:**

1. Navigate to `/book/user-details`
2. Fill all required fields:
   - Personal Info: Full Name, Mobile, Email, Date of Birth, Gender, Address
   - Measurements: Height, Weight, BMI (auto-calculated)
   - Medical: Medical History, Medications, Allergies
   - Lifestyle: Activity Level, Sleep Quality, Food Preference
3. Review and submit
   **Expected Result:**

- Patient created successfully
- Patient ID returned
- Appointment created with `bookingProgress: "USER_DETAILS"`
- Redirected to `/book/recall`
- Patient data saved in database
- Patient linked to user account

### TC-PATIENT-002: Create Patient - Missing Required Fields

**Priority:** High  
**Type:** Validation  
**Preconditions:** User logged in  
**Steps:**

1. Navigate to `/book/user-details`
2. Leave required fields empty (e.g., Full Name)
3. Attempt to proceed
   **Expected Result:**

- Validation error displayed
- Cannot proceed to next step
- Error message: "Please fill the required field: Full Name"
- Patient not created

### TC-PATIENT-003: Create Patient - Invalid Email Format

**Priority:** High  
**Type:** Validation  
**Preconditions:** User logged in  
**Steps:**

1. Enter invalid email format (e.g., `invalid-email`)
2. Attempt to proceed
   **Expected Result:**

- Validation error displayed
- Error message about invalid email format
- Patient not created

### TC-PATIENT-004: Create Patient - Invalid Phone Number

**Priority:** High  
**Type:** Validation  
**Preconditions:** User logged in  
**Steps:**

1. Enter invalid phone number (less than 10 digits)
2. Attempt to proceed
   **Expected Result:**

- Validation error displayed
- Error message about invalid phone number
- Patient not created

### TC-PATIENT-005: Create Patient - Invalid Date of Birth

**Priority:** Medium  
**Type:** Validation  
**Preconditions:** User logged in  
**Steps:**

1. Enter future date of birth
2. Attempt to proceed
   **Expected Result:**

- Validation error displayed
- Error message: "Date of birth cannot be in the future"
- Patient not created

### TC-PATIENT-006: Create Patient - BMI Auto-Calculation

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** User logged in  
**Steps:**

1. Enter Height: `170` cm, Weight: `70` kg
2. Check BMI field
   **Expected Result:**

- BMI calculated automatically: `24.22`
- BMI displayed correctly
- Age calculated from date of birth

### TC-PATIENT-007: Create Patient - Rate Limiting

**Priority:** High  
**Type:** Security  
**Preconditions:** User logged in  
**Steps:**

1. Create 5 patients within 1 minute
2. Attempt to create 6th patient
   **Expected Result:**

- 6th request blocked
- Rate limit error: "Too many patient submissions. Please wait a moment."
- HTTP 429 status code

### TC-PATIENT-008: Create Patient - Field Size Validation

**Priority:** Medium  
**Type:** Security  
**Preconditions:** User logged in  
**Steps:**

1. Enter very large text in notes field (>100KB)
2. Attempt to submit
   **Expected Result:**

- Validation error displayed
- Error message: "Field exceeds maximum size"
- Patient not created
- HTTP 400 status code

## 2. Patient List

### TC-PATIENT-009: List My Patients - Authenticated User

**Priority:** High  
**Type:** Functional  
**Preconditions:** User logged in, has patients  
**Steps:**

1. Navigate to profile or patient list page
2. View patient list
   **Expected Result:**

- All patients belonging to user displayed
- Patient details shown: Name, Age, Gender, Created Date
- Patients sorted by creation date (newest first)

### TC-PATIENT-010: List My Patients - No Patients

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** User logged in, no patients created  
**Steps:**

1. Navigate to patient list page
   **Expected Result:**

- Empty state displayed
- Message: "No patients found. Create your first patient."
- Create patient button visible

### TC-PATIENT-011: List My Patients - Unauthenticated

**Priority:** High  
**Type:** Security  
**Preconditions:** User not logged in  
**Steps:**

1. Make GET request to `/api/patients/me`
   **Expected Result:**

- Status 401 Unauthorized
- Redirected to login page (frontend)

### TC-PATIENT-012: Get Patient by ID - Valid ID

**Priority:** High  
**Type:** Functional  
**Preconditions:** User logged in, patient exists  
**Steps:**

1. Navigate to patient details page
2. View patient with valid ID
   **Expected Result:**

- Patient details displayed
- All patient information shown
- Associated appointments visible
- Files/attachments visible

### TC-PATIENT-013: Get Patient by ID - Invalid ID

**Priority:** Medium  
**Type:** Error Handling  
**Preconditions:** User logged in  
**Steps:**

1. Navigate to patient details with invalid ID
   **Expected Result:**

- Error message: "Patient not found"
- Status 404 Not Found
- Redirected to patient list or home page

### TC-PATIENT-014: Get Patient by ID - Other User's Patient

**Priority:** High  
**Type:** Security  
**Preconditions:** User logged in, patient belongs to another user  
**Steps:**

1. Attempt to access patient ID belonging to another user
   **Expected Result:**

- Access denied
- Error message: "Patient not found" (for security, don't reveal existence)
- Status 404 Not Found

## 3. Admin Patient Management

### TC-PATIENT-015: Admin List All Patients - Admin User

**Priority:** High  
**Type:** Functional  
**Preconditions:** Admin user logged in  
**Steps:**

1. Navigate to admin patient list
2. View all patients
   **Expected Result:**

- All patients from all users displayed
- Pagination working
- Filters available (by user, date, etc.)
- Patient details visible

### TC-PATIENT-016: Admin List All Patients - Non-Admin User

**Priority:** High  
**Type:** Security  
**Preconditions:** Regular user logged in  
**Steps:**

1. Attempt to access `/api/patients/` (admin endpoint)
   **Expected Result:**

- Access denied
- Status 403 Forbidden
- Error message: "Admin access required"

### TC-PATIENT-017: Admin Get Patient by ID - Valid ID

**Priority:** High  
**Type:** Functional  
**Preconditions:** Admin user logged in  
**Steps:**

1. Navigate to admin patient details
2. View patient with valid ID
   **Expected Result:**

- Patient details displayed
- Owner information visible
- All associated data visible
- Can edit patient details

### TC-PATIENT-018: Admin Update Patient - Valid Data

**Priority:** High  
**Type:** Functional  
**Preconditions:** Admin user logged in, patient exists  
**Steps:**

1. Navigate to patient edit page
2. Update patient information
3. Save changes
   **Expected Result:**

- Patient updated successfully
- Changes saved to database
- Success message displayed
- Updated data visible

### TC-PATIENT-019: Admin Update Patient - Invalid Data

**Priority:** Medium  
**Type:** Validation  
**Preconditions:** Admin user logged in  
**Steps:**

1. Attempt to update patient with invalid data (e.g., invalid email)
2. Save changes
   **Expected Result:**

- Validation error displayed
- Patient not updated
- Error message shown

### TC-PATIENT-020: Admin Update Patient - Field Size Validation

**Priority:** Medium  
**Type:** Security  
**Preconditions:** Admin user logged in  
**Steps:**

1. Attempt to update patient with very large field (>10KB)
2. Save changes
   **Expected Result:**

- Validation error displayed
- Field size limit error
- Patient not updated

## 4. Patient Files

### TC-PATIENT-021: Link Files to Patient - Valid Files

**Priority:** High  
**Type:** Functional  
**Preconditions:** User logged in, patient exists, files uploaded  
**Steps:**

1. Navigate to patient details
2. Upload files or link existing files
3. Save
   **Expected Result:**

- Files linked successfully
- Files visible in patient details
- File metadata stored
- Files accessible for download

### TC-PATIENT-022: Link Files to Patient - Invalid File IDs

**Priority:** Medium  
**Type:** Error Handling  
**Preconditions:** User logged in, patient exists  
**Steps:**

1. Attempt to link non-existent file IDs
2. Save
   **Expected Result:**

- Error message: "One or more files not found"
- Patient not updated
- No partial updates

### TC-PATIENT-023: Delete Patient File - Valid File

**Priority:** High  
**Type:** Functional  
**Preconditions:** User logged in, patient has files  
**Steps:**

1. Navigate to patient files
2. Delete a file
3. Confirm deletion
   **Expected Result:**

- File deleted successfully
- File removed from patient
- File removed from storage (Cloudinary)
- Success message displayed

### TC-PATIENT-024: Delete Patient File - Other User's File

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

## 5. Patient Recall

### TC-PATIENT-025: Create Recall - Valid Data

**Priority:** High  
**Type:** Functional  
**Preconditions:** User logged in, patient exists, appointment created  
**Steps:**

1. Navigate to `/book/recall`
2. Fill recall form with meal entries
3. Upload files (optional)
4. Submit recall
   **Expected Result:**

- Recall created successfully
- Recall linked to appointment
- Appointment `bookingProgress` updated to `"RECALL"`
- Redirected to `/book/slot`
- Recall entries saved in database

### TC-PATIENT-026: Create Recall - Missing Required Fields

**Priority:** High  
**Type:** Validation  
**Preconditions:** User logged in, patient exists  
**Steps:**

1. Attempt to submit recall without meal entries
2. Submit form
   **Expected Result:**

- Validation error displayed
- Recall not created
- Error message shown

### TC-PATIENT-027: Create Recall - Multiple Meal Entries

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** User logged in, patient exists  
**Steps:**

1. Add multiple meal entries (breakfast, lunch, dinner)
2. Fill details for each meal
3. Submit recall
   **Expected Result:**

- All meal entries saved
- Entries displayed correctly
- Recall data structured properly

### TC-PATIENT-028: Create Recall - File Upload

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** User logged in, patient exists  
**Steps:**

1. Upload files with recall form
2. Submit recall
   **Expected Result:**

- Files uploaded successfully
- Files linked to recall
- Files accessible in recall details

### TC-PATIENT-029: Create Recall - Rate Limiting

**Priority:** Medium  
**Type:** Security  
**Preconditions:** User logged in  
**Steps:**

1. Create 5 recalls within 1 minute
2. Attempt to create 6th recall
   **Expected Result:**

- Rate limit error displayed
- HTTP 429 status code
- Recall not created

### TC-PATIENT-030: Get Recall - Valid Recall ID

**Priority:** High  
**Type:** Functional  
**Preconditions:** User logged in, recall exists  
**Steps:**

1. Navigate to recall details
2. View recall with valid ID
   **Expected Result:**

- Recall details displayed
- All meal entries shown
- Files visible
- Recall data formatted correctly

### TC-PATIENT-031: Get Recall - Invalid Recall ID

**Priority:** Medium  
**Type:** Error Handling  
**Preconditions:** User logged in  
**Steps:**

1. Attempt to access recall with invalid ID
   **Expected Result:**

- Error message: "Recall not found"
- Status 404 Not Found

### TC-PATIENT-032: Get Recall - Other User's Recall

**Priority:** High  
**Type:** Security  
**Preconditions:** User logged in, recall belongs to another user  
**Steps:**

1. Attempt to access recall belonging to another user
   **Expected Result:**

- Access denied
- Error message: "Recall not found"
- Status 404 Not Found

### TC-PATIENT-033: Delete Recall Entry - Valid Entry

**Priority:** High  
**Type:** Functional  
**Preconditions:** User logged in, recall has entries  
**Steps:**

1. Navigate to recall details
2. Delete a recall entry
3. Confirm deletion
   **Expected Result:**

- Entry deleted successfully
- Entry removed from recall
- Recall updated in database
- Success message displayed

### TC-PATIENT-034: Delete Recall Entry - Invalid Entry ID

**Priority:** Medium  
**Type:** Error Handling  
**Preconditions:** User logged in, recall exists  
**Steps:**

1. Attempt to delete non-existent entry ID
   **Expected Result:**

- Error message: "Entry not found"
- Status 404 Not Found
- No changes made

## 6. Edge Cases

### TC-PATIENT-035: Create Patient - Concurrent Requests

**Priority:** Low  
**Type:** Edge Case  
**Preconditions:** User logged in  
**Steps:**

1. Submit patient creation form twice simultaneously
   **Expected Result:**

- Only one patient created
- Second request handled gracefully
- No duplicate patients

### TC-PATIENT-036: Patient Deletion Race Condition

**Priority:** Medium  
**Type:** Edge Case  
**Preconditions:** User logged in, patient exists  
**Steps:**

1. Start creating appointment with patient
2. Delete patient in another session
3. Complete appointment creation
   **Expected Result:**

- Appointment creation fails if patient deleted
- Error message: "Patient not found"
- Transaction ensures atomicity

### TC-PATIENT-037: Patient with Special Characters

**Priority:** Low  
**Type:** Edge Case  
**Preconditions:** User logged in  
**Steps:**

1. Create patient with special characters in name: `John O'Brien-Smith`
2. Save patient
   **Expected Result:**

- Patient created successfully
- Special characters preserved
- Data displayed correctly

### TC-PATIENT-038: Patient with Very Long Name

**Priority:** Low  
**Type:** Edge Case  
**Preconditions:** User logged in  
**Steps:**

1. Create patient with name > 255 characters
2. Attempt to save
   **Expected Result:**

- Validation error displayed
- Error message about field length
- Patient not created

### TC-PATIENT-039: Patient Age Calculation - Leap Year

**Priority:** Low  
**Type:** Edge Case  
**Preconditions:** User logged in  
**Steps:**

1. Create patient with DOB: February 29, 2000
2. Check age calculation
   **Expected Result:**

- Age calculated correctly
- Handles leap year properly
- No calculation errors

### TC-PATIENT-040: Patient Data Persistence

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** User logged in  
**Steps:**

1. Create patient
2. Logout and login again
3. View patient list
   **Expected Result:**

- Patient data persisted
- Patient visible in list
- All patient details intact
