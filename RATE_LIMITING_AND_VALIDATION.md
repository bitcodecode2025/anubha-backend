# Rate Limiting and Field Size Validation

This document describes the comprehensive rate limiting and field-level size validation system implemented to prevent DoS attacks and ensure data integrity.

## Overview

The system implements:

1. **Rate Limiting** - Prevents DoS attacks by limiting request frequency
2. **Field-Level Size Validation** - Prevents large payload attacks by validating individual field sizes

## Rate Limiting

### Rate Limiters

#### 1. OTP Limiter (`otpLimiter`)

- **Window**: 5 minutes
- **Max Requests**: 5 per window
- **Applied To**: OTP send/verify endpoints
- **Purpose**: Prevent OTP spam and abuse

#### 2. Patient Limiter (`patientLimiter`)

- **Window**: 1 minute
- **Max Requests**: 5 per minute
- **Applied To**: Patient form submissions, recall creation
- **Purpose**: Prevent form spam

#### 3. Payment Limiter (`paymentLimiter`)

- **Window**: 1 minute
- **Max Requests**: 10 per minute
- **Applied To**: Payment order creation
- **Purpose**: Prevent payment abuse

#### 4. Payment Verify Limiter (`paymentVerifyLimiter`)

- **Window**: 1 minute
- **Max Requests**: 5 per minute
- **Applied To**: Payment verification
- **Purpose**: Very strict - most critical endpoint

#### 5. Appointment Create Limiter (`appointmentCreateLimiter`)

- **Window**: 1 minute
- **Max Requests**: 10 per minute
- **Applied To**: Appointment creation
- **Purpose**: Prevent appointment spam

#### 6. Appointment Update Limiter (`appointmentUpdateLimiter`)

- **Window**: 1 minute
- **Max Requests**: 20 per minute
- **Applied To**: Appointment updates (slot selection, progress)
- **Purpose**: Moderate rate limiting for updates

#### 7. File Upload Limiter (`fileUploadLimiter`)

- **Window**: 1 minute
- **Max Requests**: 10 per minute
- **Applied To**: File upload endpoints
- **Purpose**: Prevent resource-intensive upload spam

#### 8. Admin Limiter (`adminLimiter`)

- **Window**: 1 minute
- **Max Requests**: 30 per minute
- **Applied To**: All admin endpoints
- **Purpose**: Moderate rate limiting for admin operations

#### 9. General Limiter (`generalLimiter`)

- **Window**: 15 minutes
- **Max Requests**: 100 per 15 minutes
- **Applied To**: All endpoints (base rate limit)
- **Purpose**: Catch-all rate limiting for all endpoints

### Rate Limiting Strategy

1. **Layered Approach**: General limiter applied to all routes, specific limiters for critical endpoints
2. **IP-Based**: Rate limiting is based on IP address
3. **Standard Headers**: Returns standard rate limit headers (`X-RateLimit-*`)
4. **No Skip on Success**: All requests are counted, even successful ones

### Applied Endpoints

#### Payment Endpoints

- ✅ `/api/payment/order` - `paymentLimiter` + `generalLimiter`
- ✅ `/api/payment/verify` - `paymentVerifyLimiter` + `generalLimiter`
- ✅ `/api/payment/existing-order/:id` - `paymentLimiter` + `generalLimiter`
- ✅ `/api/payment/plan-price` - `generalLimiter`

#### Appointment Endpoints

- ✅ `/api/appointments/create` - `appointmentCreateLimiter` + `generalLimiter`
- ✅ `/api/appointments/:id/slot` - `appointmentUpdateLimiter` + `generalLimiter`
- ✅ `/api/appointments/:id/progress` - `appointmentUpdateLimiter` + `generalLimiter`
- ✅ All GET endpoints - `generalLimiter`

#### Patient Endpoints

- ✅ `/api/patients/` (POST) - `patientLimiter` + `generalLimiter`
- ✅ `/api/patients/recall` (POST) - `patientLimiter` + `generalLimiter`
- ✅ All other endpoints - `generalLimiter`

#### Upload Endpoints

- ✅ `/api/upload/image` - `fileUploadLimiter` + `generalLimiter`

#### Admin Endpoints

- ✅ All admin routes - `adminLimiter` + `generalLimiter`

#### Auth Endpoints

- ✅ OTP endpoints - `otpLimiter` + `generalLimiter`
- ✅ Other auth endpoints - `generalLimiter`

## Field-Level Size Validation

### Validation Rules

#### String Fields

- **Max Size**: 10KB per field
- **Purpose**: Prevent large string payloads

#### Text Fields (Notes, Descriptions, etc.)

- **Max Size**: 100KB per field
- **Detected By**: Field names containing `notes`, `description`, `content`, `message`, `text`, `body`, `comment`
- **Purpose**: Allow larger text fields while still preventing abuse

#### Array Fields

- **Max Length**: 100 items per array
- **Max Item Size**: 10KB per array item
- **Purpose**: Prevent large array payloads

#### Object Nesting

- **Max Depth**: 10 levels
- **Purpose**: Prevent deeply nested object attacks

### Validation Features

1. **Recursive Validation**: Validates nested objects and arrays
2. **UTF-8 Aware**: Uses `Buffer.byteLength` for accurate size calculation
3. **Path Tracking**: Error messages include full field path (e.g., `user.profile.bio`)
4. **Multiple Errors**: Returns up to 10 validation errors per request

### Applied Endpoints

Field size validation is applied to all POST, PUT, and PATCH endpoints that accept JSON bodies:

- ✅ `/api/payment/order`
- ✅ `/api/payment/verify`
- ✅ `/api/appointments/create`
- ✅ `/api/appointments/:id/slot`
- ✅ `/api/appointments/:id/progress`
- ✅ `/api/patients/` (POST)
- ✅ `/api/patients/recall` (POST)
- ✅ `/api/patients/:id` (PATCH - admin)
- ✅ `/api/admin/appointments/:id/status` (PATCH)
- ✅ `/api/admin/doctor-session` (POST)
- ✅ `/api/admin/doctor-session/:id/value` (PATCH)
- ✅ `/api/admin/doctor-session/save` (POST)
- ✅ `/api/admin/doctor-notes` (POST/PATCH)
- ✅ `/api/slots/admin/generate` (POST)
- ✅ `/api/slots/admin/day-off` (POST)

## Error Responses

### Rate Limiting Error

```json
{
  "success": false,
  "message": "Too many payment requests. Please wait a moment before trying again."
}
```

**HTTP Status**: 429 Too Many Requests

**Headers**:

- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests in window
- `X-RateLimit-Reset`: Time when limit resets (Unix timestamp)

### Field Size Validation Error

```json
{
  "success": false,
  "message": "Request contains fields that exceed size limits",
  "errors": [
    "Field \"notes\" exceeds maximum size of 102400 bytes (got 150000 bytes). Text fields are limited to 102400 bytes.",
    "Field \"items[5]\" exceeds maximum item size of 10240 bytes (got 15000 bytes)"
  ]
}
```

**HTTP Status**: 400 Bad Request

## Configuration

### Customizing Rate Limits

Edit `src/middleware/rateLimit.ts`:

```typescript
export const paymentLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Adjust this value
  // ...
});
```

### Customizing Field Size Limits

Edit `src/middleware/fieldSizeValidator.ts`:

```typescript
const DEFAULT_CONFIG: FieldSizeConfig = {
  maxStringLength: 10 * 1024, // Adjust this
  maxTextLength: 100 * 1024, // Adjust this
  maxArrayLength: 100, // Adjust this
  maxItemLength: 10 * 1024, // Adjust this
  maxNestedDepth: 10, // Adjust this
};
```

## Security Benefits

1. **DoS Protection**: Rate limiting prevents overwhelming the server
2. **Resource Protection**: Field size validation prevents memory exhaustion
3. **Abuse Prevention**: Limits prevent automated abuse and spam
4. **Cost Control**: Prevents excessive API usage and resource consumption
5. **Data Integrity**: Field size limits ensure data fits within database constraints

## Monitoring

### Rate Limit Headers

All rate-limited endpoints return standard headers:

- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset time

### Logging

Rate limit violations are logged automatically by `express-rate-limit`.

Field size validation errors are logged with:

- Request path
- Request method
- First 5 validation errors

## Best Practices

1. **Monitor Rate Limit Violations**: Track 429 responses to identify abuse
2. **Adjust Limits Based on Usage**: Monitor legitimate usage patterns
3. **Whitelist Trusted IPs**: Consider whitelisting for internal services
4. **Custom Error Messages**: Provide helpful messages to legitimate users
5. **Gradual Backoff**: Consider implementing exponential backoff for repeated violations

## Testing

### Test Rate Limiting

```bash
# Send multiple requests quickly to test rate limiting
for i in {1..20}; do
  curl -X POST http://localhost:4000/api/payment/verify \
    -H "Content-Type: application/json" \
    -d '{"orderId":"test","paymentId":"test","signature":"test"}'
done
```

### Test Field Size Validation

```bash
# Send request with large field
curl -X POST http://localhost:4000/api/appointments/create \
  -H "Content-Type: application/json" \
  -d "{\"notes\":\"$(python -c 'print("x" * 200000)')\"}"
```

## Future Enhancements

- [ ] User-based rate limiting (not just IP-based)
- [ ] Redis-backed rate limiting for distributed systems
- [ ] Dynamic rate limit adjustment based on server load
- [ ] Rate limit bypass for authenticated admin users
- [ ] More granular field size limits per endpoint
- [ ] Rate limit metrics and monitoring dashboard
