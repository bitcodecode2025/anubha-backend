# Environment Variables Configuration

This document describes the environment variable validation system and required configuration.

## Overview

All environment variables are validated at application startup. The application will **not start** if required variables are missing or invalid. This prevents runtime failures and ensures proper configuration.

## Validation System

The validation system is located in `src/config/env.ts` and is automatically executed when the application starts.

### Features

- ✅ **Startup Validation**: All required variables are validated before the server starts
- ✅ **Format Validation**: Validates format of critical variables (e.g., Razorpay keys, database URLs)
- ✅ **Security Checks**: Validates minimum length requirements for secrets
- ✅ **Clear Error Messages**: Provides detailed error messages for missing/invalid variables
- ✅ **Warnings**: Shows warnings for optional but recommended variables

## Required Environment Variables

### Database

```env
DATABASE_URL=postgresql://user:password@host:port/database
```

- **Required**: Yes
- **Format**: PostgreSQL connection string
- **Validation**: Must start with `postgresql://` or `postgres://`

### Authentication

```env
ACCESS_TOKEN_SECRET=your-secret-key-here
```

- **Required**: Yes
- **Minimum Length**: 32 characters (warning if shorter)
- **Purpose**: JWT token signing secret

### Payment Gateway (Razorpay)

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret-key
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret
```

- **RAZORPAY_KEY_ID**: Required
  - Format: Should start with `rzp_`
  - Minimum length: 20 characters
- **RAZORPAY_KEY_SECRET**: Required
  - Minimum length: 30 characters (warning if shorter)
- **RAZORPAY_WEBHOOK_SECRET**: Optional but recommended
  - Required for webhook signature verification
  - Warning shown if not set

### File Storage (Cloudinary)

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

- **All Required**: Yes
- **Purpose**: File upload and storage

### WhatsApp Messaging (MSG91)

```env
MSG91_AUTH_KEY=your-msg91-auth-key
MSG91_INTEGRATED_NUMBER=917880293523
```

- **MSG91_AUTH_KEY**: Required
  - Minimum length: 30 characters (warning if shorter)
- **MSG91_INTEGRATED_NUMBER**: Optional
  - Default: `917880293523`
  - Purpose: WhatsApp number for messaging

### Server Configuration

```env
PORT=4000
NODE_ENV=development
```

- **PORT**: Optional (default: 4000)
  - Must be between 1 and 65535
- **NODE_ENV**: Optional (default: development)
  - Valid values: `development`, `production`, `test`

### Optional/Development Only

```env
WHATSAPP_PHONE_NUMBER_ID=optional-for-testing
META_ACCESS_TOKEN=optional-for-testing
```

- **Purpose**: Used only in development/testing
- **Required**: No

## Validation Flow

1. **Application Startup**: `src/app.ts` imports `src/config/env.ts`
2. **Automatic Validation**: `getEnvConfig()` is called automatically
3. **Error Handling**: If validation fails, application exits with clear error messages
4. **Warnings**: Non-critical issues are logged as warnings
5. **Success**: Application continues if all required variables are valid

## Example Error Output

```
==========================================
❌ ENVIRONMENT VARIABLE VALIDATION FAILED
==========================================
Missing or invalid required environment variables:
  1. DATABASE_URL is required
  2. RAZORPAY_KEY_ID is required for payment processing
  3. ACCESS_TOKEN_SECRET is required for JWT token generation
==========================================
Please check your .env file and ensure all required variables are set.
==========================================
```

## Example Warning Output

```
==========================================
⚠️  ENVIRONMENT VARIABLE WARNINGS
==========================================
  1. ACCESS_TOKEN_SECRET should be at least 32 characters long for security
  2. RAZORPAY_WEBHOOK_SECRET is not set. Webhook signature verification will be disabled.
==========================================
```

## Example Success Output

```
==========================================
✅ ENVIRONMENT VARIABLES VALIDATED
==========================================
Required variables: ✓
Warnings: None
==========================================
```

## Razorpay Configuration Validation

Razorpay configuration is validated separately at startup:

```
==========================================
🔍 Validating Razorpay Configuration...
==========================================
✅ Razorpay configuration validated successfully
  - Key ID: Set
  - Key Secret: Set
  - Webhook Secret: Set
==========================================
```

## Benefits

1. **Early Failure Detection**: Configuration issues are caught at startup, not at runtime
2. **Clear Error Messages**: Developers know exactly what's missing
3. **Security**: Validates minimum requirements for secrets
4. **Documentation**: Serves as documentation for required configuration
5. **Type Safety**: Provides TypeScript types for environment variables

## Migration Guide

If you're upgrading from the old system:

1. **No Code Changes Required**: The validation is automatic
2. **Check Your .env File**: Ensure all required variables are set
3. **Review Warnings**: Address any warnings for better security
4. **Test Startup**: Verify the application starts successfully

## Troubleshooting

### "Environment validation failed"

- Check your `.env` file exists
- Verify all required variables are set
- Check for typos in variable names
- Ensure no extra spaces or quotes around values

### "Razorpay configuration invalid"

- Verify `RAZORPAY_KEY_ID` starts with `rzp_`
- Check key lengths meet minimum requirements
- Ensure keys are from the same Razorpay account (test/live)

### "Database connection failed"

- Verify `DATABASE_URL` format is correct
- Check database server is running
- Verify credentials are correct
- Test connection with a PostgreSQL client

## Best Practices

1. **Never commit `.env` files** to version control
2. **Use strong secrets** (at least 32 characters for `ACCESS_TOKEN_SECRET`)
3. **Set `RAZORPAY_WEBHOOK_SECRET`** for production
4. **Use different keys** for development and production
5. **Rotate secrets regularly** for security
6. **Document custom variables** in your team's documentation
