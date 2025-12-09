# Doctor Notes Test Cases

## 1. Doctor Notes Form

### TC-DOCTOR-001: Save Doctor Notes - Complete Form

**Priority:** High  
**Type:** Functional  
**Preconditions:** Admin user logged in, appointment exists  
**Steps:**

1. Navigate to appointment details
2. Fill doctor notes form with all sections:
   - Section 1: Personal Info
   - Section 2: Food Recall (Morning Intake, Breakfast, Mid Morning, Lunch, Mid Day, Evening Snack, Dinner)
   - Section 3: Weekend Diet
   - Section 4: Questionnaire
   - Section 5: Food Frequency
   - Section 6: Health Profile
   - Section 7: Diet Prescribed
3. Upload diet chart (optional)
4. Save notes
   **Expected Result:**

- Doctor notes saved successfully
- All sections saved correctly
- Data stored in database
- Success message displayed
- Notes visible in preview

### TC-DOCTOR-002: Save Doctor Notes - Partial Form

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** Admin user logged in, appointment exists  
**Steps:**

1. Fill only some sections of doctor notes
2. Save notes
   **Expected Result:**

- Doctor notes saved successfully
- Only filled sections saved
- Empty sections not saved or saved as null
- Can update later

### TC-DOCTOR-003: Save Doctor Notes - Update Existing Notes

**Priority:** High  
**Type:** Functional  
**Preconditions:** Admin user logged in, notes already exist  
**Steps:**

1. Navigate to appointment with existing notes
2. Update notes
3. Save changes
   **Expected Result:**

- Notes updated successfully
- Changes saved to database
- Previous data overwritten
- Success message displayed

### TC-DOCTOR-004: Save Doctor Notes - Missing Appointment

**Priority:** High  
**Type:** Error Handling  
**Preconditions:** Admin user logged in  
**Steps:**

1. Attempt to save notes for non-existent appointment
   **Expected Result:**

- Error message: "Appointment not found"
- Status 404 Not Found
- Notes not saved

### TC-DOCTOR-005: Save Doctor Notes - Diet Chart Upload

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** Admin user logged in, appointment exists  
**Steps:**

1. Upload diet chart file (PDF/image)
2. Save notes
   **Expected Result:**

- Diet chart uploaded successfully
- File stored in Cloudinary
- File URL saved in notes
- File accessible in preview

### TC-DOOKTOR-006: Save Doctor Notes - Invalid File Type

**Priority:** Medium  
**Type:** Validation  
**Preconditions:** Admin user logged in, appointment exists  
**Steps:**

1. Attempt to upload invalid file type (e.g., .exe)
2. Save notes
   **Expected Result:**

- Validation error displayed
- Error message: "Invalid file type"
- File not uploaded
- Notes saved without file

### TC-DOCTOR-007: Save Doctor Notes - File Size Limit

**Priority:** Medium  
**Type:** Validation  
**Preconditions:** Admin user logged in, appointment exists  
**Steps:**

1. Attempt to upload file > 5MB
2. Save notes
   **Expected Result:**

- Validation error displayed
- Error message: "File size exceeds limit"
- File not uploaded
- Notes saved without file

### TC-DOCTOR-008: Save Doctor Notes - Field Size Validation

**Priority:** Medium  
**Type:** Security  
**Preconditions:** Admin user logged in, appointment exists  
**Steps:**

1. Attempt to save notes with very large field (>100KB)
   **Expected Result:**

- Validation error displayed
- Field size limit error
- Notes not saved

### TC-DOCTOR-009: Save Doctor Notes - Rate Limiting

**Priority:** Medium  
**Type:** Security  
**Preconditions:** Admin user logged in  
**Steps:**

1. Save notes 30 times within 1 minute
2. Attempt 31st save
   **Expected Result:**

- Rate limit error displayed
- HTTP 429 status code
- Notes not saved

## 2. Doctor Notes Preview

### TC-DOCTOR-010: View Doctor Notes - Complete Notes

**Priority:** High  
**Type:** Functional  
**Preconditions:** Doctor notes exist for appointment  
**Steps:**

1. Navigate to appointment details
2. View doctor notes preview
   **Expected Result:**

- All filled sections displayed
- Data formatted correctly
- All fields visible
- Preview matches form data

### TC-DOCTOR-011: View Doctor Notes - Section 1 (Personal Info)

**Priority:** High  
**Type:** Functional  
**Preconditions:** Doctor notes exist  
**Steps:**

1. View Section 1 in preview
2. Check all fields displayed
   **Expected Result:**

- All personal info fields displayed
- Age, gender, height, weight shown
- Number of children displayed (including 0)
- Data formatted correctly

### TC-DOCTOR-012: View Doctor Notes - Section 2 (Food Recall - Breakfast)

**Priority:** High  
**Type:** Functional  
**Preconditions:** Doctor notes with breakfast data exist  
**Steps:**

1. View Section 2 Breakfast in preview
2. Check all breakfast items displayed
   **Expected Result:**

- All breakfast items displayed: poha, upma, paratha, stuffed paratha, puri, idly, dosa, bread butter, sandwich, egg, juice, fruits, milk
- Quantities shown for each item
- Checkboxes show "Yes" if checked, "No" if unchecked
- All fields visible

### TC-DOCTOR-013: View Doctor Notes - Section 2 (Food Recall - Mid Morning)

**Priority:** High  
**Type:** Functional  
**Preconditions:** Doctor notes with mid morning data exist  
**Steps:**

1. View Section 2 Mid Morning in preview
2. Check all mid morning items displayed
   **Expected Result:**

- All mid morning items displayed: buttermilk, curd, fruit, tea/coffee, other
- Quantities shown for each item
- Checkboxes show "Yes"/"No"
- All fields visible

### TC-DOCTOR-014: View Doctor Notes - Section 2 (Food Recall - Mid Day)

**Priority:** High  
**Type:** Functional  
**Preconditions:** Doctor notes with mid day data exist  
**Steps:**

1. View Section 2 Mid Day in preview
2. Check quantities displayed
   **Expected Result:**

- Sweets, desserts, laddu, fruits quantities shown in "pieces" (not "bowls")
- Quantities displayed correctly
- All fields visible

### TC-DOCTOR-015: View Doctor Notes - Section 2 (Food Recall - Evening Snack)

**Priority:** High  
**Type:** Functional  
**Preconditions:** Doctor notes with evening snack data exist  
**Steps:**

1. View Section 2 Evening Snack in preview
2. Check quantities displayed
   **Expected Result:**

- Sandwich and dosa quantities shown in "pieces" (not "bowls")
- Other items quantities shown correctly
- All fields visible

### TC-DOCTOR-016: View Doctor Notes - Section 2 (Food Recall - Dinner)

**Priority:** High  
**Type:** Functional  
**Preconditions:** Doctor notes with dinner data exist  
**Steps:**

1. View Section 2 Dinner in preview
2. Check labels displayed
   **Expected Result:**

- No "(Mid-Day)" text in labels
- Labels clean: "Sweets", "Dessert", "Laddu", "Fruits", "Other"
- All fields visible

### TC-DOCTOR-017: View Doctor Notes - Section 3 (Weekend Diet)

**Priority:** High  
**Type:** Functional  
**Preconditions:** Doctor notes with weekend diet data exist  
**Steps:**

1. View Section 3 Weekend Diet in preview
2. Check all lists displayed
   **Expected Result:**

- Snacks list and quantities displayed
- Starter list and quantities displayed
- Main course list and quantities displayed
- Sweet item list and quantities displayed
- All fields visible

### TC-DOCTOR-018: View Doctor Notes - Section 5 (Food Frequency - Non-Veg)

**Priority:** High  
**Type:** Functional  
**Preconditions:** Doctor notes with non-veg frequency data exist  
**Steps:**

1. View Section 5 Non-Veg in preview
2. Check frequencies displayed
   **Expected Result:**

- All non-veg items displayed
- Frequency (Daily/Weekly/Monthly) shown for each item
- Quantities shown
- All fields visible

### TC-DOCTOR-019: View Doctor Notes - Section 5 (Food Frequency - Dairy)

**Priority:** High  
**Type:** Functional  
**Preconditions:** Doctor notes with dairy frequency data exist  
**Steps:**

1. View Section 5 Dairy in preview
2. Check milk frequency displayed
   **Expected Result:**

- Milk frequency (Daily/Weekly/Monthly) shown
- Quantity shown
- All fields visible

### TC-DOCTOR-020: View Doctor Notes - Section 5 (Food Frequency - Packaged/Daily Items)

**Priority:** High  
**Type:** Functional  
**Preconditions:** Doctor notes with packaged items data exist  
**Steps:**

1. View Section 5 Packaged/Daily Items in preview
2. Check all items displayed
   **Expected Result:**

- All packaged/daily items displayed
- Name, quantity, frequency shown for each
- Checkboxes show "Yes"/"No"
- All fields visible

### TC-DOCTOR-021: View Doctor Notes - Section 5 (Food Frequency - Sweeteners)

**Priority:** High  
**Type:** Functional  
**Preconditions:** Doctor notes with sweeteners data exist  
**Steps:**

1. View Section 5 Sweeteners in preview
2. Check all items displayed
   **Expected Result:**

- All sweetener items displayed
- Name, quantity, frequency shown for each
- Checkboxes show "Yes"/"No"
- All fields visible

### TC-DOCTOR-022: View Doctor Notes - Section 5 (Food Frequency - Drinks)

**Priority:** High  
**Type:** Functional  
**Preconditions:** Doctor notes with drinks data exist  
**Steps:**

1. View Section 5 Drinks in preview
2. Check all items displayed
   **Expected Result:**

- All drink items displayed
- Name, quantity, frequency shown for each
- Checkboxes show "Yes"/"No"
- All fields visible

### TC-DOCTOR-023: View Doctor Notes - Section 5 (Food Frequency - Healthy Foods)

**Priority:** High  
**Type:** Functional  
**Preconditions:** Doctor notes with healthy foods data exist  
**Steps:**

1. View Section 5 Healthy Foods in preview
2. Check all items displayed
   **Expected Result:**

- All healthy food items displayed
- Name, quantity, frequency shown for each
- Checkboxes show "Yes"/"No"
- All fields visible

### TC-DOCTOR-024: View Doctor Notes - Section 6 (Health Profile - Conditions)

**Priority:** High  
**Type:** Functional  
**Preconditions:** Doctor notes with health conditions data exist  
**Steps:**

1. View Section 6 Health Conditions in preview
2. Check all conditions displayed
   **Expected Result:**

- All health conditions displayed: High B.P, Diabetes, High Cholesterol, Obesity, Cardiac Risk, Heart Problem, Back Pain, Neck Pain, Knee Pain, Shoulder Pain, Respiratory Problem, Post-Operative, Hormonal Problem, Thyroid, PCOD, PCOS, Gynec Problem, Gastric Problem, Acidity, Constipation, Allergy, Water Retention
- Each condition shows "Yes"/"No"
- All fields visible

### TC-DOCTOR-025: View Doctor Notes - Checkbox Display Logic

**Priority:** High  
**Type:** Functional  
**Preconditions:** Doctor notes with checkboxes exist  
**Steps:**

1. View preview with checked and unchecked checkboxes
2. Check display
   **Expected Result:**

- Checked checkboxes show "Yes"
- Unchecked checkboxes show "No"
- Logic consistent across all sections
- No missing fields

### TC-DOCTOR-026: View Doctor Notes - Empty Notes

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** Appointment exists, no notes saved  
**Steps:**

1. View appointment details
2. Check doctor notes section
   **Expected Result:**

- Empty state displayed
- Message: "No doctor notes available"
- Can add notes

### TC-DOCTOR-027: View Doctor Notes - Number of Children (0)

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** Doctor notes with 0 children exist  
**Steps:**

1. View Section 1 in preview
2. Check number of children displayed
   **Expected Result:**

- Number of children shows "0" correctly
- Not displayed as empty or null
- Field visible

## 3. Doctor Notes Form Fields

### TC-DOCTOR-028: Form - Remove "(Mid-Day)" from Labels

**Priority:** High  
**Type:** UI/UX  
**Preconditions:** Admin user logged in, viewing form  
**Steps:**

1. Navigate to doctor notes form
2. Check Dinner section labels
   **Expected Result:**

- No "(Mid-Day)" text in form labels
- Labels clean: "Other", "Other Quantity"
- Section header: "Additional Items" (not "Mid-Day Items")

### TC-DOCTOR-029: Form - Add Frequency Dropdown (Non-Veg)

**Priority:** High  
**Type:** Functional  
**Preconditions:** Admin user logged in, viewing form  
**Steps:**

1. Navigate to Section 5 Non-Veg
2. Check frequency dropdown
   **Expected Result:**

- Frequency dropdown visible for each non-veg item
- Options: "Daily", "Weekly", "Monthly"
- Can select frequency
- Frequency saved correctly

### TC-DOCTOR-030: Form - Add Frequency Dropdown (Milk)

**Priority:** High  
**Type:** Functional  
**Preconditions:** Admin user logged in, viewing form  
**Steps:**

1. Navigate to Section 5 Dairy (Milk)
2. Check frequency dropdown
   **Expected Result:**

- Frequency dropdown visible for Milk
- Options: "Daily", "Weekly", "Monthly"
- Can select frequency
- Frequency saved correctly

### TC-DOCTOR-031: Form - Number of Children (Allow 0)

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** Admin user logged in, viewing form  
**Steps:**

1. Navigate to Section 1
2. Set number of children to 0
3. Save form
   **Expected Result:**

- Can set number of children to 0
- 0 saved correctly
- Preview shows 0 correctly

## 4. Doctor Session Management

### TC-DOCTOR-032: Create Doctor Session - Valid Appointment

**Priority:** High  
**Type:** Functional  
**Preconditions:** Admin user logged in, appointment exists  
**Steps:**

1. Create doctor session for appointment
2. Verify session creation
   **Expected Result:**

- Session created successfully
- Session ID returned
- Session linked to appointment
- Can add field values to session

### TC-DOCTOR-033: Get Doctor Session - Valid Session ID

**Priority:** High  
**Type:** Functional  
**Preconditions:** Doctor session exists  
**Steps:**

1. Get doctor session by ID
2. Verify session data
   **Expected Result:**

- Session data returned
- All field values included
- Status 200 OK

### TC-DOCTOR-034: Upsert Doctor Field Value - Valid Data

**Priority:** High  
**Type:** Functional  
**Preconditions:** Doctor session exists  
**Steps:**

1. Upsert field value in session
2. Verify value saved
   **Expected Result:**

- Field value saved/updated successfully
- Value stored correctly
- Can retrieve updated value

### TC-DOCTOR-035: Delete Doctor Session - Valid Session

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** Doctor session exists  
**Steps:**

1. Delete doctor session
2. Verify deletion
   **Expected Result:**

- Session deleted successfully
- Session removed from database
- Status 200 OK

### TC-DOCTOR-036: Get Doctor Field Groups - Valid Request

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** Admin user logged in  
**Steps:**

1. Get doctor field groups
2. Verify groups returned
   **Expected Result:**

- Field groups returned
- Groups structured correctly
- All sections included

### TC-DOCTOR-037: Search Doctor Fields - Valid Query

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** Admin user logged in  
**Steps:**

1. Search doctor fields with query
2. Verify results
   **Expected Result:**

- Matching fields returned
- Search working correctly
- Results relevant

## 5. Edge Cases

### TC-DOCTOR-038: Doctor Notes - Large Form Data

**Priority:** Low  
**Type:** Performance  
**Preconditions:** Admin user logged in  
**Steps:**

1. Fill form with maximum data
2. Save notes
   **Expected Result:**

- Notes saved successfully
- Performance acceptable
- No timeout errors
- All data saved

### TC-DOCTOR-039: Doctor Notes - Special Characters

**Priority:** Low  
**Type:** Edge Case  
**Preconditions:** Admin user logged in  
**Steps:**

1. Enter special characters in notes fields
2. Save notes
   **Expected Result:**

- Special characters preserved
- Data saved correctly
- Preview displays correctly

### TC-DOCTOR-040: Doctor Notes - Concurrent Updates

**Priority:** Low  
**Type:** Edge Case  
**Preconditions:** Multiple admins viewing same appointment  
**Steps:**

1. Two admins update notes simultaneously
2. Check final state
   **Expected Result:**

- Last save wins
- No data corruption
- Changes preserved
