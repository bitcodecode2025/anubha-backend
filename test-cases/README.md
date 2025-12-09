# Test Cases Documentation

This directory contains comprehensive test cases for the Nutriwell application, covering all aspects of the system including frontend, backend, database, business logic, security, and edge cases.

## Test Case Files

### 1. Authentication (`01-authentication.md`)

- User registration (OTP-based)
- User login (OTP-based)
- Session management
- Logout functionality
- Frontend authentication flow
- Edge cases and error handling

**Total Test Cases:** 30

### 2. Patient Management (`02-patient-management.md`)

- Patient creation
- Patient listing
- Patient updates (admin)
- Patient files management
- Patient recall functionality
- Edge cases

**Total Test Cases:** 40

### 3. Booking Flow (`03-booking-flow.md`)

- Plan selection
- User details step
- Recall step
- Slot selection step
- Payment step
- Resume booking flow
- Booking context management
- Edge cases

**Total Test Cases:** 44

### 4. Appointments (`04-appointments.md`)

- Appointment creation
- Appointment updates
- Appointment listing
- Appointment status management
- Frontend appointment display
- Edge cases

**Total Test Cases:** 44

### 5. Payment (`05-payment.md`)

- Payment order creation
- Payment verification
- Payment flow integration
- Payment security
- Payment UI/UX
- Edge cases

**Total Test Cases:** 40

### 6. Slots Management (`06-slots.md`)

- Slot generation (admin)
- Day-off management (admin)
- Available slots (public/user)
- Slot booking
- Admin slot management
- Edge cases

**Total Test Cases:** 45

### 7. Doctor Notes (`07-doctor-notes.md`)

- Doctor notes form
- Doctor notes preview
- Doctor notes form fields
- Doctor session management
- Edge cases

**Total Test Cases:** 40

### 8. Admin Features (`08-admin-features.md`)

- Admin authentication
- Appointment management (admin)
- Patient management (admin)
- Slot management (admin)
- Doctor notes management (admin)
- Admin dashboard
- Edge cases

**Total Test Cases:** 32

### 9. File Uploads (`09-file-uploads.md`)

- Image upload
- File linking to patient
- File deletion
- File access
- File upload security
- File storage
- Edge cases

**Total Test Cases:** 30

### 10. WhatsApp Notifications (`10-whatsapp-notifications.md`)

- Appointment confirmation messages
- Appointment reminder messages
- MSG91 integration
- Message content
- Error handling
- Edge cases

**Total Test Cases:** 34

### 11. Security (`11-security.md`)

- Authentication security
- Authorization security
- Input validation security
- Rate limiting security
- Payment security
- File upload security
- Environment variable security
- CORS security
- Session security

**Total Test Cases:** 40

### 12. Frontend UI/UX (`12-frontend-ui.md`)

- Navigation & routing
- Booking flow UI
- Appointment display
- Form UI
- Doctor notes UI
- Responsive design
- Loading & error states
- Accessibility
- Performance

**Total Test Cases:** 42

### 13. Database (`13-database.md`)

- Database connection
- Database schema
- Database operations
- Database transactions
- Database constraints
- Database performance
- Database backup & recovery
- Database data integrity
- Edge cases

**Total Test Cases:** 36

## Test Case Format

Each test case follows this structure:

```
### TC-XXX-YYY: Test Case Name
**Priority:** High/Medium/Low
**Type:** Functional/Validation/Security/Performance/UI/UX/Error Handling/Edge Case
**Preconditions:** Conditions that must be met before test execution
**Steps:**
1. Step 1
2. Step 2
3. Step 3
**Expected Result:**
- Expected outcome 1
- Expected outcome 2
- Expected outcome 3
```

## Priority Levels

- **High:** Critical functionality, security, or user-facing features
- **Medium:** Important functionality or edge cases
- **Low:** Nice-to-have features or rare edge cases

## Test Types

- **Functional:** Tests that verify functionality works as expected
- **Validation:** Tests that verify input validation and error handling
- **Security:** Tests that verify security measures and vulnerabilities
- **Performance:** Tests that verify performance and scalability
- **UI/UX:** Tests that verify user interface and user experience
- **Error Handling:** Tests that verify error handling and recovery
- **Edge Case:** Tests that verify edge cases and boundary conditions

## How to Use These Test Cases

1. **Manual Testing:** Use these test cases as a checklist for manual testing
2. **Automated Testing:** Convert these test cases into automated test scripts
3. **Test Planning:** Use these test cases to plan your testing strategy
4. **Regression Testing:** Use these test cases for regression testing after changes
5. **QA Review:** Use these test cases to ensure comprehensive coverage

## Test Coverage

These test cases cover:

✅ **Frontend:**

- All pages and routes
- Form validation and submission
- User interactions
- UI components
- Responsive design
- Error handling

✅ **Backend:**

- All API endpoints
- Authentication and authorization
- Business logic
- Data validation
- Error handling
- Security measures

✅ **Database:**

- Schema and migrations
- CRUD operations
- Transactions
- Constraints
- Performance
- Data integrity

✅ **Integration:**

- Payment gateway (Razorpay)
- WhatsApp messaging (MSG91)
- File storage (Cloudinary)
- Email/SMS services

✅ **Security:**

- Authentication and authorization
- Input validation
- Rate limiting
- SQL injection prevention
- XSS prevention
- File upload security

✅ **Edge Cases:**

- Concurrent operations
- Network failures
- Invalid inputs
- Boundary conditions
- Error scenarios

## Total Test Cases

**Grand Total: 507 Test Cases**

## Maintenance

These test cases should be updated when:

- New features are added
- Existing features are modified
- Bugs are discovered
- Requirements change
- Security vulnerabilities are found

## Notes

- Test cases are organized by feature/area for easy navigation
- Each test case is independent and can be executed standalone
- Test cases include both positive and negative scenarios
- Edge cases and error handling are thoroughly covered
- Security test cases are comprehensive

## Contributing

When adding new test cases:

1. Follow the existing format
2. Assign appropriate priority and type
3. Include clear preconditions and steps
4. Specify expected results clearly
5. Add test cases to the appropriate file
6. Update this README with the new test case count
