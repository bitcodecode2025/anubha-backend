# WhatsApp Notifications Test Cases

## 1. Appointment Confirmation Messages

### TC-WHATSAPP-001: Send Patient Confirmation - Payment Success

**Priority:** High  
**Type:** Functional  
**Preconditions:** Payment verified successfully, appointment confirmed  
**Steps:**

1. Complete payment verification
2. Check WhatsApp message sent
   **Expected Result:**

- WhatsApp message sent to patient
- Message includes: Appointment date, time, mode
- Message sent via MSG91 API
- Message delivery confirmed
- Success logged

### TC-WHATSAPP-002: Send Doctor Notification - Payment Success

**Priority:** High  
**Type:** Functional  
**Preconditions:** Payment verified successfully, appointment confirmed  
**Steps:**

1. Complete payment verification
2. Check WhatsApp message sent to doctor
   **Expected Result:**

- WhatsApp message sent to doctor
- Message includes: Patient name, appointment date, time, mode
- Message sent via MSG91 API
- Message delivery confirmed
- Success logged

### TC-WHATSAPP-003: Send Confirmation - Admin Manual Confirmation

**Priority:** High  
**Type:** Functional  
**Preconditions:** Admin manually confirms appointment  
**Steps:**

1. Admin updates appointment status to CONFIRMED
2. Check WhatsApp messages sent
   **Expected Result:**

- WhatsApp messages sent to both patient and doctor
- Messages include appointment details
- Messages sent successfully
- Success logged

### TC-WHATSAPP-004: Send Confirmation - Missing Phone Numbers

**Priority:** Medium  
**Type:** Error Handling  
**Preconditions:** Patient or doctor phone number missing  
**Steps:**

1. Confirm appointment with missing phone number
2. Check WhatsApp message sending
   **Expected Result:**

- Error logged for missing phone number
- Message not sent for missing number
- Other message sent successfully
- No application crash

### TC-WHATSAPP-005: Send Confirmation - Invalid Phone Number

**Priority:** Medium  
**Type:** Error Handling  
**Preconditions:** Invalid phone number format  
**Steps:**

1. Confirm appointment with invalid phone number
2. Check WhatsApp message sending
   **Expected Result:**

- Error logged for invalid phone number
- Message not sent
- Error handled gracefully
- No application crash

### TC-WHATSAPP-006: Send Confirmation - MSG91 API Failure

**Priority:** Medium  
**Type:** Error Handling  
**Preconditions:** MSG91 API unavailable  
**Steps:**

1. Confirm appointment
2. MSG91 API returns error
   **Expected Result:**

- Error logged
- Error handled gracefully
- Appointment still confirmed
- User notified of message failure
- Can retry sending message

### TC-WHATSAPP-007: Send Confirmation - MSG91 Auth Key Missing

**Priority:** High  
**Type:** Configuration  
**Preconditions:** MSG91_AUTH_KEY not configured  
**Steps:**

1. Confirm appointment
2. Check WhatsApp message sending
   **Expected Result:**

- Error logged
- Error message: "MSG91_AUTH_KEY not configured"
- Message not sent
- Application continues normally
- Error caught at startup (if validation exists)

### TC-WHATSAPP-008: Send Confirmation - Message Content Validation

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** Appointment confirmed  
**Steps:**

1. Check WhatsApp message content
2. Verify message format
   **Expected Result:**

- Message content correct
- All appointment details included
- Message formatted properly
- No sensitive data exposed

## 2. Appointment Reminder Messages

### TC-WHATSAPP-009: Send Reminder - 1 Hour Before Appointment

**Priority:** High  
**Type:** Functional  
**Preconditions:** Appointment confirmed, scheduled in 1 hour  
**Steps:**

1. Wait for reminder cron to run
2. Check reminder messages sent
   **Expected Result:**

- Reminder sent to patient 1 hour before appointment
- Reminder sent to doctor 1 hour before appointment
- Messages include: Appointment date, time, mode
- Reminder flag set (`reminderSent: true`)
- Success logged

### TC-WHATSAPP-010: Send Reminder - Cron Job Execution

**Priority:** High  
**Type:** Functional  
**Preconditions:** Cron job configured  
**Steps:**

1. Check cron job runs every minute
2. Verify cron job execution
   **Expected Result:**

- Cron job runs every minute
- Cron job checks for appointments
- Appointments in 1-hour window found
- Reminders sent correctly

### TC-WHATSAPP-011: Send Reminder - No Appointments Due

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** No appointments scheduled in 1 hour  
**Steps:**

1. Cron job runs
2. Check cron job behavior
   **Expected Result:**

- Cron job completes successfully
- No reminders sent
- No errors logged
- Cron job continues running

### TC-WHATSAPP-012: Send Reminder - Duplicate Prevention

**Priority:** High  
**Type:** Business Logic  
**Preconditions:** Appointment due for reminder  
**Steps:**

1. Cron job runs twice simultaneously
2. Check reminder sending
   **Expected Result:**

- Only one reminder sent
- Atomic update prevents duplicates
- `reminderSent` flag updated atomically
- No duplicate messages

### TC-WHATSAPP-013: Send Reminder - Already Sent

**Priority:** Medium  
**Type:** Business Logic  
**Preconditions:** Reminder already sent  
**Steps:**

1. Cron job runs for appointment with `reminderSent: true`
2. Check reminder sending
   **Expected Result:**

- Reminder not sent again
- `reminderSent` flag checked
- No duplicate reminders
- Cron job continues normally

### TC-WHATSAPP-014: Send Reminder - Multiple Appointments

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** Multiple appointments due for reminder  
**Steps:**

1. Cron job runs
2. Check all reminders sent
   **Expected Result:**

- All due appointments found
- Reminders sent for all appointments
- Each reminder sent correctly
- All `reminderSent` flags updated

### TC-WHATSAPP-015: Send Reminder - Appointment Status Check

**Priority:** High  
**Type:** Business Logic  
**Preconditions:** Appointment cancelled before reminder  
**Steps:**

1. Appointment cancelled
2. Cron job runs for cancelled appointment
   **Expected Result:**

- Reminder not sent for cancelled appointment
- Only CONFIRMED appointments get reminders
- Status checked before sending

### TC-WHATSAPP-016: Send Reminder - Time Window Accuracy

**Priority:** High  
**Type:** Functional  
**Preconditions:** Appointment scheduled  
**Steps:**

1. Check reminder timing
2. Verify 1-hour window
   **Expected Result:**

- Reminder sent exactly 1 hour before
- Time window: 59-61 minutes before appointment
- Timing accurate
- No early/late reminders

## 3. MSG91 Integration

### TC-WHATSAPP-017: MSG91 Connection Test - Valid Auth Key

**Priority:** High  
**Type:** Functional  
**Preconditions:** MSG91_AUTH_KEY configured  
**Steps:**

1. Test MSG91 connection
2. Verify connection successful
   **Expected Result:**

- Connection test successful
- Auth key validated
- API accessible
- Test message sent (if applicable)

### TC-WHATSAPP-018: MSG91 Connection Test - Invalid Auth Key

**Priority:** High  
**Type:** Error Handling  
**Preconditions:** Invalid MSG91_AUTH_KEY  
**Steps:**

1. Test MSG91 connection with invalid key
2. Check error handling
   **Expected Result:**

- Connection test fails
- Error logged
- Error message displayed
- Application handles error gracefully

### TC-WHATSAPP-019: MSG91 API Request Format

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** Sending WhatsApp message  
**Steps:**

1. Check MSG91 API request format
2. Verify request structure
   **Expected Result:**

- Request format correct
- Headers include auth key
- Payload structured correctly
- Namespace included
- Integrated number used

### TC-WHATSAPP-020: MSG91 API Response Handling

**Priority:** Medium  
**Type:** Functional  
**Preconditions:** MSG91 API responds  
**Steps:**

1. Send WhatsApp message
2. Check response handling
   **Expected Result:**

- Response parsed correctly
- Success/failure determined
- Response logged
- Error handling for failed responses

### TC-WHATSAPP-021: MSG91 Auth Key Validation - Startup

**Priority:** High  
**Type:** Configuration  
**Preconditions:** Application startup  
**Steps:**

1. Check MSG91_AUTH_KEY validation at startup
2. Verify validation
   **Expected Result:**

- Auth key validated at startup
- Application fails to start if key invalid
- Error message displayed
- Configuration errors caught early

### TC-WHATSAPP-022: MSG91 Auth Key Masking - Logging

**Priority:** Medium  
**Type:** Security  
**Preconditions:** Logging enabled  
**Steps:**

1. Check logs for auth key
2. Verify key masking
   **Expected Result:**

- Auth key masked in logs
- Only first 3 and last 3 characters shown
- Full key never logged
- Security maintained

## 4. Message Content

### TC-WHATSAPP-023: Message Content - Patient Confirmation

**Priority:** High  
**Type:** Functional  
**Preconditions:** Appointment confirmed  
**Steps:**

1. Check patient confirmation message content
2. Verify all details included
   **Expected Result:**

- Patient name included
- Appointment date included
- Appointment time included
- Appointment mode included
- Message formatted properly

### TC-WHATSAPP-024: Message Content - Doctor Notification

**Priority:** High  
**Type:** Functional  
**Preconditions:** Appointment confirmed  
**Steps:**

1. Check doctor notification message content
2. Verify all details included
   **Expected Result:**

- Patient name included
- Appointment date included
- Appointment time included
- Appointment mode included
- Message formatted properly

### TC-WHATSAPP-025: Message Content - Reminder Message

**Priority:** High  
**Type:** Functional  
**Preconditions:** Reminder sent  
**Steps:**

1. Check reminder message content
2. Verify all details included
   **Expected Result:**

- Appointment date included
- Appointment time included
- Appointment mode included
- Reminder timing clear (1 hour before)
- Message formatted properly

### TC-WHATSAPP-026: Message Content - Special Characters

**Priority:** Low  
**Type:** Edge Case  
**Preconditions:** Patient name with special characters  
**Steps:**

1. Send message with special characters in name
2. Check message content
   **Expected Result:**

- Special characters handled correctly
- Message sent successfully
- Characters displayed correctly
- No encoding issues

## 5. Error Handling

### TC-WHATSAPP-027: WhatsApp Error - Network Failure

**Priority:** Medium  
**Type:** Error Handling  
**Preconditions:** Network unavailable  
**Steps:**

1. Attempt to send WhatsApp message
2. Network failure occurs
   **Expected Result:**

- Error logged
- Error handled gracefully
- Application continues normally
- No crash
- Can retry after network restored

### TC-WHATSAPP-028: WhatsApp Error - Rate Limiting

**Priority:** Medium  
**Type:** Error Handling  
**Preconditions:** MSG91 rate limit exceeded  
**Steps:**

1. Send many messages quickly
2. Rate limit exceeded
   **Expected Result:**

- Rate limit error logged
- Error handled gracefully
- Messages queued or retried later
- No application crash

### TC-WHATSAPP-029: WhatsApp Error - Invalid Template

**Priority:** Low  
**Type:** Error Handling  
**Preconditions:** Invalid message template  
**Steps:**

1. Attempt to send message with invalid template
2. Check error handling
   **Expected Result:**

- Error logged
- Error message clear
- Message not sent
- Error handled gracefully

### TC-WHATSAPP-030: WhatsApp Error - Retry Logic

**Priority:** Low  
**Type:** Error Handling  
**Preconditions:** Temporary MSG91 API failure  
**Steps:**

1. Send message
2. API returns temporary error
3. Check retry logic
   **Expected Result:**

- Retry logic implemented (if applicable)
- Message retried after delay
- Success logged after retry
- Or error logged if retry fails

## 6. Edge Cases

### TC-WHATSAPP-031: WhatsApp - Concurrent Message Sending

**Priority:** Low  
**Type:** Edge Case  
**Preconditions:** Multiple appointments confirmed simultaneously  
**Steps:**

1. Confirm multiple appointments at once
2. Check message sending
   **Expected Result:**

- All messages sent successfully
- No conflicts
- All messages delivered
- No duplicate messages

### TC-WHATSAPP-032: WhatsApp - Message Delivery Status

**Priority:** Low  
**Type:** Functional  
**Preconditions:** Message sent  
**Steps:**

1. Check message delivery status
2. Verify status tracking
   **Expected Result:**

- Delivery status tracked (if supported)
- Status logged
- Status accessible
- Status accurate

### TC-WHATSAPP-033: WhatsApp - International Phone Numbers

**Priority:** Low  
**Type:** Edge Case  
**Preconditions:** International phone number  
**Steps:**

1. Send message to international number
2. Check message sending
   **Expected Result:**

- Phone number format validated
- Message sent successfully
- Format handled correctly
- No errors

### TC-WHATSAPP-034: WhatsApp - Message Queue (Future)

**Priority:** Low  
**Type:** Future Enhancement  
**Preconditions:** Message queue implemented  
**Steps:**

1. Send message
2. Check queue processing
   **Expected Result:**

- Message queued if API unavailable
- Queue processed when API available
- Messages sent in order
- No message loss
