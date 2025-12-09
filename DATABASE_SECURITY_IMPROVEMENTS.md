# Database Security Improvements

This document outlines the database security enhancements implemented to address foreign key constraints, unique constraints, indexes, and race condition prevention.

## Issues Fixed

### 1. Missing Foreign Key Constraints with Appropriate onDelete Actions

**Issue:** Orphaned records if parent is deleted.

**Location:** `prisma/schema.prisma`

**Risk:** Data integrity issues, orphaned records

**Solution:**

- Added appropriate `onDelete` actions to all foreign key relationships
- Used `Cascade` for child records that should be deleted with parent
- Used `SetNull` for optional relationships that should be cleared
- Used `Restrict` for critical relationships that should prevent deletion

**Changes Made:**

#### Cascade Delete (Child records deleted with parent):

- `PatientDetials.userId` → `onDelete: Cascade` (Delete patients when user is deleted)
- `Recall.patientId` → `onDelete: Cascade` (Delete recalls when patient is deleted)
- `Recall.appointmentId` → `onDelete: Cascade` (Delete recall when appointment is deleted)
- `File.patientId` → `onDelete: Cascade` (Delete files when patient is deleted)
- `Slot.adminId` → `onDelete: Cascade` (Delete slots when admin is deleted)
- `DoctorDayOff.adminId` → `onDelete: Cascade` (Delete day offs when admin is deleted)
- `Appointment.userId` → `onDelete: Cascade` (Delete appointments when user is deleted)
- `Appointment.patientId` → `onDelete: Cascade` (Delete appointments when patient is deleted)
- `DoctorFormSession.patientId` → `onDelete: Cascade`
- `DoctorFormSession.adminId` → `onDelete: Cascade`
- `DoctorFormSession.appointmentId` → `onDelete: Cascade`
- `RecallEntry.recallId` → Already had `onDelete: Cascade`
- `DoctorNotes.appointmentId` → Already had `onDelete: Cascade`
- `MealEntry.doctorNotesId` → Already had `onDelete: Cascade`
- `FoodFrequencyItem.doctorNotesId` → Already had `onDelete: Cascade`
- `HealthCondition.doctorNotesId` → Already had `onDelete: Cascade`
- `QuestionnaireAnswer.doctorNotesId` → Already had `onDelete: Cascade`
- `DoctorNoteAttachment.doctorNotesId` → Already had `onDelete: Cascade`
- `Reminder.appointmentId` → Already had `onDelete: Cascade`
- `MessageLog.appointmentId` → Already had `onDelete: Cascade`

#### SetNull (Optional relationships cleared):

- `Appointment.slotId` → `onDelete: SetNull` (Clear slot reference if slot is deleted, but keep appointment)

#### Restrict (Prevent deletion if referenced):

- `Appointment.doctorId` → `onDelete: Restrict` (Prevent admin deletion if they have appointments)

### 2. Missing Unique Constraints for Critical Combinations

**Issue:** Race conditions can create duplicates (e.g., multiple pending appointments for same slot).

**Location:** `prisma/schema.prisma`

**Risk:** Data inconsistency, race conditions

**Solution:**

- Added partial unique constraint to prevent multiple PENDING appointments per slot
- Constraint enforced at database level via PostgreSQL partial unique index
- Prevents race conditions where multiple users try to book the same slot

**Implementation:**

- Created migration file: `prisma/migrations/add_partial_unique_constraint.sql`
- Partial unique index: `Appointment_slotId_status_key`
- Only applies when `status = 'PENDING'` and `slotId IS NOT NULL`
- Allows multiple appointments per slot if they have different statuses

**Note:** Prisma doesn't support partial unique constraints directly, so this is implemented via raw SQL migration.

### 3. Missing Indexes on Frequently Queried Fields

**Issue:** Slow queries under load.

**Location:** `prisma/schema.prisma`

**Risk:** Performance degradation, slow response times

**Solution:**

- Added indexes on frequently queried fields
- Added composite indexes for common query patterns

**Indexes Added:**

#### Appointment Model:

- `@@index([bookingProgress])` - Frequently queried for booking flow
- `@@index([status, bookingProgress])` - Common query pattern: PENDING appointments by progress
- `@@index([slotId, status])` - Prevents multiple PENDING appointments per slot (also used for queries)

**Existing Indexes (Already Present):**

- `@@index([startAt])` - Query appointments by date
- `@@index([doctorId, startAt])` - Query doctor appointments
- `@@index([patientId, startAt])` - Query patient appointments
- `@@index([status, startAt])` - Query appointments by status and date
- `@@index([isArchived])` - Filter archived records

### 4. Race Condition Prevention

**Issue:** Multiple pending appointments can be created for the same slot.

**Solution:**

- Partial unique constraint prevents multiple PENDING appointments per slot
- Database-level enforcement prevents race conditions
- Combined with application-level transaction locking for double protection

**Race Condition Protection:**

1. **Database Level:** Partial unique constraint prevents duplicate PENDING appointments
2. **Application Level:** Transaction locking with `SELECT FOR UPDATE` (already implemented)
3. **Index Level:** Composite index `[slotId, status]` supports efficient constraint checking

## Migration Instructions

### Step 1: Apply Schema Changes

```bash
npx prisma migrate dev --name add_database_security_constraints
```

### Step 2: Apply Partial Unique Constraint

```bash
# Run the SQL migration manually or via Prisma migrate
psql $DATABASE_URL -f prisma/migrations/add_partial_unique_constraint.sql
```

Or add to a Prisma migration:

```sql
-- In the generated migration file, add:
CREATE UNIQUE INDEX IF NOT EXISTS "Appointment_slotId_status_key"
ON "Appointment" ("slotId", "status")
WHERE "slotId" IS NOT NULL AND "status" = 'PENDING';
```

## Files Modified

1. `prisma/schema.prisma` - Added onDelete actions, indexes, and comments
2. `prisma/migrations/add_partial_unique_constraint.sql` - Partial unique constraint migration

## Testing

### Test Foreign Key Constraints

1. Delete a user with patients
2. Verify patients are cascade deleted
3. Test all cascade relationships

### Test Unique Constraints

1. Try to create two PENDING appointments for the same slot
2. Verify second creation fails with unique constraint violation
3. Verify CANCELLED and CONFIRMED appointments can coexist for same slot

### Test Indexes

1. Query appointments by bookingProgress
2. Query PENDING appointments by progress
3. Verify queries use indexes (check EXPLAIN ANALYZE)

### Test Race Conditions

1. Simulate concurrent appointment creation for same slot
2. Verify only one succeeds
3. Verify database constraint prevents duplicates

## Best Practices

1. **Always use onDelete actions** - Prevents orphaned records
2. **Use Cascade for child records** - Maintains referential integrity
3. **Use Restrict for critical relationships** - Prevents accidental data loss
4. **Add indexes for frequently queried fields** - Improves query performance
5. **Use partial unique constraints** - Prevents race conditions at database level
6. **Combine database and application-level protection** - Defense in depth

## Performance Impact

### Indexes Added:

- `bookingProgress` index: Improves queries filtering by booking progress
- `[status, bookingProgress]` composite index: Optimizes common query pattern
- `[slotId, status]` composite index: Supports unique constraint and queries

### Expected Improvements:

- Faster queries for booking progress filtering
- Faster queries for PENDING appointments by progress
- Database-level race condition prevention
- Better query planning for appointment queries

## Monitoring

Monitor the following:

- Foreign key constraint violations (should be rare)
- Unique constraint violations (indicates race condition attempts)
- Query performance for appointment queries
- Index usage statistics

## Future Enhancements

- Add database-level check constraints for business rules
- Add triggers for audit logging
- Add materialized views for complex queries
- Add full-text search indexes for patient names
- Add GIN indexes for JSONB fields (already noted in schema comments)
