# Frontend UI/UX Test Cases

## 1. Navigation & Routing

### TC-UI-001: Navigation - Home Page

**Priority:** High  
**Type:** UI/UX  
**Preconditions:** Application loaded  
**Steps:**

1. Navigate to home page (`/`)
2. Check page loads
   **Expected Result:**

- Home page loads successfully
- All sections visible
- Navigation menu working
- No errors

### TC-UI-002: Navigation - Services Page

**Priority:** High  
**Type:** UI/UX  
**Preconditions:** Application loaded  
**Steps:**

1. Navigate to `/services`
2. Check page loads
   **Expected Result:**

- Services page loads successfully
- All plan cards displayed
- Plan details visible
- Can select plan

### TC-UI-003: Navigation - Login Page

**Priority:** High  
**Type:** UI/UX  
**Preconditions:** User not logged in  
**Steps:**

1. Navigate to `/login`
2. Check page loads
   **Expected Result:**

- Login page loads successfully
- OTP input form visible
- Can enter phone number
- Can send OTP

### TC-UI-004: Navigation - Profile Page (Authenticated)

**Priority:** High  
**Type:** UI/UX  
**Preconditions:** User logged in  
**Steps:**

1. Navigate to `/profile`
2. Check page loads
   **Expected Result:**

- Profile page loads successfully
- User information displayed
- Appointments visible
- Navigation working

### TC-UI-005: Navigation - Protected Routes (Unauthenticated)

**Priority:** High  
**Type:** Security  
**Preconditions:** User not logged in  
**Steps:**

1. Attempt to access `/profile`
2. Check redirect
   **Expected Result:**

- Redirected to `/login`
- Original URL stored
- After login, redirected back
- Security maintained

### TC-UI-006: Navigation - Admin Routes (Non-Admin)

**Priority:** High  
**Type:** Security  
**Preconditions:** Regular user logged in  
**Steps:**

1. Attempt to access `/admin/appointments`
2. Check redirect
   **Expected Result:**

- Access denied
- Redirected to home page
- Error message displayed
- Security maintained

### TC-UI-007: Navigation - Back Button

**Priority:** Medium  
**Type:** UI/UX  
**Preconditions:** User in booking flow  
**Steps:**

1. Navigate through booking steps
2. Click browser back button
3. Check navigation
   **Expected Result:**

- Back button works correctly
- Previous step loaded
- Form data preserved
- No errors

## 2. Booking Flow UI

### TC-UI-008: Booking Flow - Step Indicator

**Priority:** High  
**Type:** UI/UX  
**Preconditions:** User in booking flow  
**Steps:**

1. Navigate through booking steps
2. Check step indicator
   **Expected Result:**

- Step indicator visible
- Current step highlighted
- Steps numbered correctly
- Progress clear

### TC-UI-009: Booking Flow - Form Validation Display

**Priority:** High  
**Type:** UI/UX  
**Preconditions:** User in booking form  
**Steps:**

1. Leave required field empty
2. Attempt to proceed
3. Check validation display
   **Expected Result:**

- Validation error displayed
- Error message clear
- Field highlighted
- Cannot proceed

### TC-UI-010: Booking Flow - Loading States

**Priority:** Medium  
**Type:** UI/UX  
**Preconditions:** User submitting form  
**Steps:**

1. Submit form
2. Check loading indicator
   **Expected Result:**

- Loading indicator displayed
- Button disabled during submission
- Loading state clear
- User feedback provided

### TC-UI-011: Booking Flow - Error Display

**Priority:** High  
**Type:** UI/UX  
**Preconditions:** Error occurs during booking  
**Steps:**

1. Trigger error (e.g., network error)
2. Check error display
   **Expected Result:**

- Error message displayed
- Error toast shown
- Error message helpful
- Can retry

### TC-UI-012: Booking Flow - Success Display

**Priority:** High  
**Type:** UI/UX  
**Preconditions:** Booking completed successfully  
**Steps:**

1. Complete booking
2. Check success display
   **Expected Result:**

- Success toast displayed
- Success message clear
- Redirected appropriately
- User feedback provided

## 3. Appointment Display

### TC-UI-013: Profile Page - Pending Appointments Section

**Priority:** High  
**Type:** UI/UX  
**Preconditions:** User logged in, has pending appointments  
**Steps:**

1. Navigate to `/profile`
2. View pending appointments section
   **Expected Result:**

- Pending appointments displayed
- Progress indicator shown
- "Continue Booking" button visible
- Section clearly labeled

### TC-UI-014: Profile Page - My Appointments Section

**Priority:** High  
**Type:** UI/UX  
**Preconditions:** User logged in, has confirmed appointments  
**Steps:**

1. Navigate to `/profile`
2. View "My Appointments" section
   **Expected Result:**

- Confirmed appointments displayed
- Appointment details visible
- Slot timing displayed correctly
- Section clearly labeled

### TC-UI-015: Profile Page - Section Order

**Priority:** Medium  
**Type:** UI/UX  
**Preconditions:** User logged in, has both pending and confirmed appointments  
**Steps:**

1. Navigate to `/profile`
2. Check section order
   **Expected Result:**

- "My Appointments" appears first
- "Pending Appointments" appears second
- Sections clearly separated
- Order consistent

### TC-UI-016: Appointment Card - Slot Timing Display

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

### TC-UI-017: Appointment Card - Appointment Date Display

**Priority:** Medium  
**Type:** UI/UX  
**Preconditions:** Confirmed appointment exists  
**Steps:**

1. View appointment card
2. Check appointment date display
   **Expected Result:**

- "Appointment Date" label shown
- Date formatted correctly
- Date clearly visible

### TC-UI-018: Pending Appointment Card - Progress Icon

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

### TC-UI-019: Pending Appointment Card - Continue Booking Button

**Priority:** High  
**Type:** UI/UX  
**Preconditions:** Pending appointment exists  
**Steps:**

1. View pending appointment card
2. Click "Continue Booking" button
   **Expected Result:**

- Button visible and clickable
- Click loads booking form
- Redirects to correct step
- Form data populated

## 4. Form UI

### TC-UI-020: Form - Field Labels

**Priority:** Medium  
**Type:** UI/UX  
**Preconditions:** User viewing form  
**Steps:**

1. View form fields
2. Check field labels
   **Expected Result:**

- Labels clear and descriptive
- Required fields marked
- Labels positioned correctly
- No "(Mid-Day)" text in labels

### TC-UI-021: Form - Input Validation

**Priority:** High  
**Type:** UI/UX  
**Preconditions:** User filling form  
**Steps:**

1. Enter invalid data
2. Check validation display
   **Expected Result:**

- Validation error displayed
- Error message clear
- Field highlighted
- Cannot submit invalid form

### TC-UI-022: Form - Dropdown Menus

**Priority:** Medium  
**Type:** UI/UX  
**Preconditions:** User viewing form with dropdowns  
**Steps:**

1. Open dropdown menu
2. Select option
   **Expected Result:**

- Dropdown opens correctly
- Options visible
- Selection works
- Value saved correctly

### TC-UI-023: Form - Checkboxes

**Priority:** Medium  
**Type:** UI/UX  
**Preconditions:** User viewing form with checkboxes  
**Steps:**

1. Check/uncheck checkbox
2. Check state
   **Expected Result:**

- Checkbox state changes
- State saved correctly
- Preview shows "Yes"/"No"
- UI updates correctly

### TC-UI-024: Form - File Upload

**Priority:** Medium  
**Type:** UI/UX  
**Preconditions:** User viewing form with file upload  
**Steps:**

1. Select file
2. Upload file
3. Check upload display
   **Expected Result:**

- File selected correctly
- Upload progress shown
- File name displayed
- Upload success indicated

## 5. Doctor Notes UI

### TC-UI-025: Doctor Notes Form - All Sections Visible

**Priority:** High  
**Type:** UI/UX  
**Preconditions:** Admin viewing doctor notes form  
**Steps:**

1. Navigate to doctor notes form
2. Check all sections visible
   **Expected Result:**

- All 7 sections visible
- Sections clearly separated
- Can navigate between sections
- Form organized well

### TC-UI-026: Doctor Notes Preview - All Fields Displayed

**Priority:** High  
**Type:** UI/UX  
**Preconditions:** Doctor notes exist  
**Steps:**

1. View doctor notes preview
2. Check all fields displayed
   **Expected Result:**

- All filled fields displayed
- Fields formatted correctly
- Sections clearly separated
- Preview matches form data

### TC-UI-027: Doctor Notes Preview - Checkbox Display

**Priority:** High  
**Type:** UI/UX  
**Preconditions:** Doctor notes with checkboxes exist  
**Steps:**

1. View doctor notes preview
2. Check checkbox display
   **Expected Result:**

- Checked checkboxes show "Yes"
- Unchecked checkboxes show "No"
- Display consistent
- No missing fields

### TC-UI-028: Doctor Notes Preview - Quantity Units

**Priority:** High  
**Type:** UI/UX  
**Preconditions:** Doctor notes with quantities exist  
**Steps:**

1. View doctor notes preview
2. Check quantity units
   **Expected Result:**

- Mid Day items show "pieces" (not "bowls")
- Evening Snack items show "pieces" (not "bowls")
- Units displayed correctly
- Formatting consistent

### TC-UI-029: Doctor Notes Preview - UI Separations

**Priority:** Medium  
**Type:** UI/UX  
**Preconditions:** Doctor notes exist  
**Steps:**

1. View doctor notes preview
2. Check UI separations
   **Expected Result:**

- Sections clearly separated
- Borders visible
- Spacing appropriate
- Visual hierarchy clear

## 6. Responsive Design

### TC-UI-030: Responsive Design - Mobile View

**Priority:** Medium  
**Type:** UI/UX  
**Preconditions:** Application loaded on mobile  
**Steps:**

1. View application on mobile device
2. Check layout
   **Expected Result:**

- Layout adapts to mobile
- Text readable
- Buttons accessible
- Navigation works

### TC-UI-031: Responsive Design - Tablet View

**Priority:** Low  
**Type:** UI/UX  
**Preconditions:** Application loaded on tablet  
**Steps:**

1. View application on tablet
2. Check layout
   **Expected Result:**

- Layout adapts to tablet
- Content displayed well
- Navigation works
- Forms usable

### TC-UI-032: Responsive Design - Desktop View

**Priority:** Medium  
**Type:** UI/UX  
**Preconditions:** Application loaded on desktop  
**Steps:**

1. View application on desktop
2. Check layout
   **Expected Result:**

- Layout optimized for desktop
- Content well-spaced
- Navigation accessible
- Forms easy to use

## 7. Loading & Error States

### TC-UI-033: Loading State - Page Load

**Priority:** Medium  
**Type:** UI/UX  
**Preconditions:** Slow network connection  
**Steps:**

1. Load page on slow connection
2. Check loading state
   **Expected Result:**

- Loading indicator displayed
- Skeleton screens shown (if implemented)
- User feedback provided
- Page loads eventually

### TC-UI-034: Error State - Network Error

**Priority:** High  
**Type:** UI/UX  
**Preconditions:** Network error occurs  
**Steps:**

1. Trigger network error
2. Check error display
   **Expected Result:**

- Error message displayed
- Error toast shown
- Error message helpful
- Can retry

### TC-UI-035: Error State - 404 Page

**Priority:** Medium  
**Type:** UI/UX  
**Preconditions:** Invalid route accessed  
**Steps:**

1. Navigate to invalid route
2. Check 404 page
   **Expected Result:**

- 404 page displayed
- Error message clear
- Navigation options provided
- User-friendly

### TC-UI-036: Empty State - No Appointments

**Priority:** Medium  
**Type:** UI/UX  
**Preconditions:** User has no appointments  
**Steps:**

1. View appointments list
2. Check empty state
   **Expected Result:**

- Empty state displayed
- Message clear
- Action button visible
- User-friendly

## 8. Accessibility

### TC-UI-037: Accessibility - Keyboard Navigation

**Priority:** Medium  
**Type:** Accessibility  
**Preconditions:** User using keyboard  
**Steps:**

1. Navigate using keyboard only
2. Check navigation
   **Expected Result:**

- All interactive elements accessible
- Tab order logical
- Focus visible
- Can complete tasks

### TC-UI-038: Accessibility - Screen Reader

**Priority:** Low  
**Type:** Accessibility  
**Preconditions:** Screen reader enabled  
**Steps:**

1. Navigate with screen reader
2. Check content reading
   **Expected Result:**

- Content readable
- Labels descriptive
- Structure clear
- Navigation works

### TC-UI-039: Accessibility - Color Contrast

**Priority:** Medium  
**Type:** Accessibility  
**Preconditions:** User viewing application  
**Steps:**

1. Check color contrast
2. Verify readability
   **Expected Result:**

- Text readable
- Contrast sufficient
- Colors accessible
- WCAG compliant

## 9. Performance

### TC-UI-040: Performance - Page Load Time

**Priority:** Medium  
**Type:** Performance  
**Preconditions:** Application loaded  
**Steps:**

1. Measure page load time
2. Check performance
   **Expected Result:**

- Page loads quickly (<3 seconds)
- No long delays
- Performance acceptable
- User experience good

### TC-UI-041: Performance - Image Loading

**Priority:** Low  
**Type:** Performance  
**Preconditions:** Page with images  
**Steps:**

1. Load page with images
2. Check image loading
   **Expected Result:**

- Images load efficiently
- Lazy loading working (if implemented)
- No layout shift
- Performance good

### TC-UI-042: Performance - Form Submission

**Priority:** Medium  
**Type:** Performance  
**Preconditions:** User submitting form  
**Steps:**

1. Submit form
2. Check response time
   **Expected Result:**

- Form submits quickly
- Response time acceptable
- No long delays
- User feedback provided
