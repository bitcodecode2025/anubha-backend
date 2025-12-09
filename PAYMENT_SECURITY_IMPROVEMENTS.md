# Payment Security Improvements

This document outlines the security enhancements implemented for Razorpay payment processing, including webhook signature verification, payment.captured event processing, and race condition handling.

## Overview

The payment system has been enhanced with:

1. **Webhook Signature Verification** - Validates that webhooks are authentic and from Razorpay
2. **Payment Captured Event Processing** - Handles payment.captured events from Razorpay webhooks
3. **Race Condition Handling** - Prevents duplicate payment processing using database transactions and row-level locking
4. **Idempotency Checks** - Ensures webhook events are processed only once

## Changes Made

### 1. Raw Body Middleware (`src/middleware/rawBody.ts`)

**Updated to:**

- Preserve raw body as string for webhook signature verification
- Parse JSON body for normal request handling
- Ensure webhook signature verification has access to unmodified raw body

### 2. Webhook Handler (`src/modules/payment/payment.controller.ts`)

**New Implementation:**

- **Signature Verification**: Uses HMAC-SHA256 to verify webhook signatures
- **Event Processing**: Processes `payment.captured` events
- **Idempotency**: Uses `WebhookEvent` table to track processed events
- **Race Condition Protection**: Uses database transactions with row-level locking (`FOR UPDATE`)
- **Error Handling**: Graceful handling of duplicate events and race conditions

**Key Features:**

- Validates webhook signature using `RAZORPAY_WEBHOOK_SECRET`
- Extracts payment details from webhook payload
- Updates appointment status to CONFIRMED
- Marks slot as booked
- Sends WhatsApp notifications (non-blocking)

### 3. Payment Verification Handler (`verifyPaymentHandler`)

**Enhanced with:**

- **Row-Level Locking**: Uses `SELECT FOR UPDATE` to lock appointment rows
- **Transaction Isolation**: Uses `ReadCommitted` isolation level
- **Idempotency Checks**: Prevents duplicate confirmations
- **Slot Locking**: Locks slot rows before updating to prevent concurrent bookings

## Environment Variables

Add the following environment variable to your `.env` file:

```env
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_from_razorpay_dashboard
```

**How to get your webhook secret:**

1. Log in to Razorpay Dashboard
2. Go to Settings → Webhooks
3. Create or select your webhook endpoint
4. Copy the webhook secret

## Webhook Endpoint

The webhook endpoint is configured at:

```
POST /api/payment/webhook
```

**Required Headers:**

- `X-Razorpay-Signature`: Webhook signature from Razorpay

**Webhook Events Processed:**

- `payment.captured`: Confirms payment and updates appointment status

## Race Condition Handling

### Database Transactions

- All payment confirmations use database transactions
- Transaction timeout: 10 seconds
- Isolation level: `ReadCommitted`

### Row-Level Locking

- Uses `SELECT FOR UPDATE` to lock appointment and slot rows
- Prevents concurrent updates from webhook and verifyPaymentHandler
- Ensures only one process can update payment status at a time

### Idempotency

- Webhook events are stored in `WebhookEvent` table before processing
- Duplicate events are detected and skipped
- Payment verification checks appointment status before updating

## Security Features

1. **Signature Verification**

   - Validates webhook authenticity using HMAC-SHA256
   - Uses timing-safe comparison to prevent timing attacks
   - Requires `RAZORPAY_WEBHOOK_SECRET` environment variable

2. **Idempotency**

   - Webhook events are tracked in database
   - Duplicate events are rejected
   - Payment verification checks status before updating

3. **Race Condition Prevention**
   - Database transactions ensure atomicity
   - Row-level locking prevents concurrent updates
   - Status checks before updates

## Testing

### Test Webhook Signature Verification

1. Send a test webhook from Razorpay Dashboard
2. Verify signature is validated correctly
3. Check logs for signature verification status

### Test Race Conditions

1. Send webhook and verifyPaymentHandler simultaneously
2. Verify only one process updates appointment status
3. Check that duplicate events are handled gracefully

### Test Idempotency

1. Send same webhook event twice
2. Verify second event is rejected
3. Check `WebhookEvent` table for event tracking

## Error Handling

- **Invalid Signature**: Returns 400 error, webhook is rejected
- **Missing Webhook Secret**: Returns 500 error, requires configuration
- **Appointment Not Found**: Logs warning, returns success (idempotency)
- **Already Confirmed**: Returns success, skips processing
- **Transaction Timeout**: Returns 500 error, allows Razorpay retry

## Monitoring

Monitor the following logs:

- `[WEBHOOK]` - Webhook processing logs
- `[PAYMENT]` - Payment verification logs
- `[PAYMENT SUCCESS]` - Successful payment confirmations
- `[PAYMENT VERIFICATION]` - Payment signature verification

## Best Practices

1. **Always verify webhook signatures** - Never process webhooks without signature verification
2. **Use idempotency** - Track processed events to prevent duplicates
3. **Handle race conditions** - Use transactions and row-level locking
4. **Log everything** - Maintain detailed logs for debugging
5. **Return success quickly** - Acknowledge webhooks immediately, process asynchronously if needed

## Future Enhancements

- Add webhook event retry mechanism
- Implement webhook event replay for failed events
- Add webhook event monitoring dashboard
- Implement webhook event rate limiting
