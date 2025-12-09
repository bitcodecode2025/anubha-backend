# Database Test Cases

## 1. Database Connection

### TC-DB-001: Database Connection - Valid Connection String

**Priority:** High  
**Type:** Configuration  
**Preconditions:** Application startup  
**Steps:**

1. Start application with valid DATABASE_URL
2. Check database connection
   **Expected Result:**

- Database connects successfully
- Connection pool created
- Prisma client initialized
- Application starts normally

### TC-DB-002: Database Connection - Invalid Connection String

**Priority:** High  
**Type:** Error Handling  
**Preconditions:** Invalid DATABASE_URL  
**Steps:**

1. Start application with invalid DATABASE_URL
2. Check error handling
   **Expected Result:**

- Connection fails
- Error logged
- Application fails to start
- Error message clear

### TC-DB-003: Database Connection - Connection Pool

**Priority:** Medium  
**Type:** Performance  
**Preconditions:** Application running  
**Steps:**

1. Make multiple concurrent database requests
2. Check connection pool handling
   **Expected Result:**

- Connection pool manages requests
- No connection errors
- Performance acceptable
- Pool size appropriate

### TC-DB-004: Database Connection - Connection Timeout

**Priority:** Medium  
**Type:** Error Handling  
**Preconditions:** Database unavailable  
**Steps:**

1. Attempt database operation
2. Database timeout occurs
   **Expected Result:**

- Timeout handled gracefully
- Error logged
- User notified
- Application continues (if possible)

## 2. Database Schema

### TC-DB-005: Schema Validation - Prisma Schema

**Priority:** High  
**Type:** Configuration  
**Preconditions:** Schema file exists  
**Steps:**

1. Validate Prisma schema
2. Check schema correctness
   **Expected Result:**

- Schema valid
- No syntax errors
- Relationships correct
- Types defined properly

### TC-DB-006: Schema Migration - Apply Migration

**Priority:** High  
**Type:** Database  
**Preconditions:** Migration file exists  
**Steps:**

1. Apply database migration
2. Check migration success
   **Expected Result:**

- Migration applied successfully
- Tables created/updated
- Data preserved (if applicable)
- No errors

### TC-DB-007: Schema Migration - Rollback Migration

**Priority:** Medium  
**Type:** Database  
**Preconditions:** Migration applied  
**Steps:**

1. Rollback migration
2. Check rollback success
   **Expected Result:**

- Migration rolled back successfully
- Schema reverted
- Data handled correctly
- No errors

### TC-DB-008: Schema Relationships - One-to-Many

**Priority:** High  
**Type:** Database  
**Preconditions:** Related models exist  
**Steps:**

1. Check one-to-many relationships
2. Verify relationship integrity
   **Expected Result:**

- Relationships defined correctly
- Foreign keys set properly
- Cascade rules working
- Data integrity maintained

### TC-DB-009: Schema Relationships - Many-to-Many

**Priority:** Medium  
**Type:** Database  
**Preconditions:** Many-to-many models exist  
**Steps:**

1. Check many-to-many relationships
2. Verify relationship integrity
   **Expected Result:**

- Relationships defined correctly
- Junction table created
- Data integrity maintained

### TC-DB-010: Schema Indexes - Performance Indexes

**Priority:** Medium  
**Type:** Performance  
**Preconditions:** Indexes defined  
**Steps:**

1. Check database indexes
2. Verify index usage
   **Expected Result:**

- Indexes created correctly
- Queries use indexes
- Performance improved
- Indexes on frequently queried fields

## 3. Database Operations

### TC-DB-011: Create Operation - User Creation

**Priority:** High  
**Type:** Database  
**Preconditions:** Valid user data  
**Steps:**

1. Create user record
2. Verify creation
   **Expected Result:**

- User created successfully
- Record stored in database
- ID generated
- Timestamps set correctly

### TC-DB-012: Create Operation - Patient Creation

**Priority:** High  
**Type:** Database  
**Preconditions:** Valid patient data  
**Steps:**

1. Create patient record
2. Verify creation
   **Expected Result:**

- Patient created successfully
- Record stored in database
- Foreign key to user set
- Data integrity maintained

### TC-DB-013: Create Operation - Appointment Creation

**Priority:** High  
**Type:** Database  
**Preconditions:** Valid appointment data  
**Steps:**

1. Create appointment record
2. Verify creation
   **Expected Result:**

- Appointment created successfully
- Record stored in database
- Foreign keys set correctly
- Relationships maintained

### TC-DB-014: Read Operation - Query Single Record

**Priority:** High  
**Type:** Database  
**Preconditions:** Record exists  
**Steps:**

1. Query single record by ID
2. Verify data returned
   **Expected Result:**

- Record returned correctly
- All fields populated
- Relationships loaded (if included)
- Query efficient

### TC-DB-015: Read Operation - Query Multiple Records

**Priority:** High  
**Type:** Database  
**Preconditions:** Multiple records exist  
**Steps:**

1. Query multiple records
2. Verify results
   **Expected Result:**

- Records returned correctly
- Pagination working (if applicable)
- Filters working
- Query efficient

### TC-DB-016: Update Operation - Update Record

**Priority:** High  
**Type:** Database  
**Preconditions:** Record exists  
**Steps:**

1. Update record fields
2. Verify update
   **Expected Result:**

- Record updated successfully
- Changes saved to database
- Timestamps updated
- Data integrity maintained

### TC-DB-017: Delete Operation - Delete Record

**Priority:** High  
**Type:** Database  
**Preconditions:** Record exists  
**Steps:**

1. Delete record
2. Verify deletion
   **Expected Result:**

- Record deleted successfully
- Record removed from database
- Cascade rules applied (if applicable)
- Data integrity maintained

### TC-DB-018: Delete Operation - Cascade Delete

**Priority:** Medium  
**Type:** Database  
**Preconditions:** Parent record with children exists  
**Steps:**

1. Delete parent record
2. Check child records
   **Expected Result:**

- Parent deleted successfully
- Children deleted (if cascade)
- Or children orphaned (if restrict)
- Cascade rules working correctly

## 4. Database Transactions

### TC-DB-019: Transaction - Atomic Operations

**Priority:** High  
**Type:** Database  
**Preconditions:** Multiple related operations  
**Steps:**

1. Execute multiple operations in transaction
2. Check atomicity
   **Expected Result:**

- All operations succeed or fail together
- No partial updates
- Data consistency maintained
- Transaction working correctly

### TC-DB-020: Transaction - Rollback on Error

**Priority:** High  
**Type:** Database  
**Preconditions:** Transaction with error  
**Steps:**

1. Execute transaction with error
2. Check rollback
   **Expected Result:**

- Transaction rolled back
- No partial changes
- Data integrity maintained
- Error handled gracefully

### TC-DB-021: Transaction - Concurrent Transactions

**Priority:** Medium  
**Type:** Database  
**Preconditions:** Multiple concurrent transactions  
**Steps:**

1. Execute concurrent transactions
2. Check isolation
   **Expected Result:**

- Transactions isolated correctly
- No deadlocks
- Data consistency maintained
- Performance acceptable

## 5. Database Constraints

### TC-DB-022: Constraint - Unique Constraint

**Priority:** High  
**Type:** Database  
**Preconditions:** Unique constraint defined  
**Steps:**

1. Attempt to create duplicate record
2. Check constraint enforcement
   **Expected Result:**

- Constraint enforced
- Duplicate rejected
- Error message clear
- Data integrity maintained

### TC-DB-023: Constraint - Foreign Key Constraint

**Priority:** High  
**Type:** Database  
**Preconditions:** Foreign key constraint defined  
**Steps:**

1. Attempt to create record with invalid foreign key
2. Check constraint enforcement
   **Expected Result:**

- Constraint enforced
- Invalid reference rejected
- Error message clear
- Data integrity maintained

### TC-DB-024: Constraint - Not Null Constraint

**Priority:** High  
**Type:** Database  
**Preconditions:** Not null constraint defined  
**Steps:**

1. Attempt to create record with null required field
2. Check constraint enforcement
   **Expected Result:**

- Constraint enforced
- Null value rejected
- Error message clear
- Data integrity maintained

### TC-DB-025: Constraint - Check Constraint

**Priority:** Medium  
**Type:** Database  
**Preconditions:** Check constraint defined  
**Steps:**

1. Attempt to create record violating check constraint
2. Check constraint enforcement
   **Expected Result:**

- Constraint enforced
- Invalid value rejected
- Error message clear
- Data integrity maintained

## 6. Database Performance

### TC-DB-026: Performance - Query Optimization

**Priority:** Medium  
**Type:** Performance  
**Preconditions:** Large dataset  
**Steps:**

1. Execute query on large dataset
2. Check query performance
   **Expected Result:**

- Query executes efficiently
- Indexes used
- Response time acceptable
- No performance issues

### TC-DB-027: Performance - N+1 Query Problem

**Priority:** Medium  
**Type:** Performance  
**Preconditions:** Related records  
**Steps:**

1. Query records with relationships
2. Check query count
   **Expected Result:**

- Queries optimized
- No N+1 problem
- Relationships loaded efficiently
- Performance good

### TC-DB-028: Performance - Database Indexes

**Priority:** Medium  
**Type:** Performance  
**Preconditions:** Indexes defined  
**Steps:**

1. Execute query on indexed field
2. Check index usage
   **Expected Result:**

- Index used in query
- Query performance improved
- Index effective
- Performance acceptable

## 7. Database Backup & Recovery

### TC-DB-029: Backup - Database Backup

**Priority:** Medium  
**Type:** Maintenance  
**Preconditions:** Database configured  
**Steps:**

1. Create database backup
2. Verify backup
   **Expected Result:**

- Backup created successfully
- Backup file valid
- Backup includes all data
- Backup can be restored

### TC-DB-030: Recovery - Database Restore

**Priority:** Medium  
**Type:** Maintenance  
**Preconditions:** Backup file exists  
**Steps:**

1. Restore database from backup
2. Verify restore
   **Expected Result:**

- Database restored successfully
- All data restored
- Data integrity maintained
- Application works correctly

## 8. Database Data Integrity

### TC-DB-031: Data Integrity - Referential Integrity

**Priority:** High  
**Type:** Database  
**Preconditions:** Related records exist  
**Steps:**

1. Check referential integrity
2. Verify relationships
   **Expected Result:**

- All foreign keys valid
- No orphaned records
- Relationships consistent
- Data integrity maintained

### TC-DB-032: Data Integrity - Data Validation

**Priority:** High  
**Type:** Database  
**Preconditions:** Data in database  
**Steps:**

1. Check data validation
2. Verify data quality
   **Expected Result:**

- Data validated correctly
- Invalid data rejected
- Data quality maintained
- Constraints enforced

### TC-DB-033: Data Integrity - Enum Values

**Priority:** Medium  
**Type:** Database  
**Preconditions:** Enum fields exist  
**Steps:**

1. Check enum values
2. Verify enum constraints
   **Expected Result:**

- Only valid enum values stored
- Invalid values rejected
- Enum constraints enforced
- Data integrity maintained

## 9. Edge Cases

### TC-DB-034: Edge Case - Large Dataset

**Priority:** Low  
**Type:** Performance  
**Preconditions:** Very large dataset  
**Steps:**

1. Query very large dataset
2. Check performance
   **Expected Result:**

- Query handles large dataset
- Pagination working
- Performance acceptable
- No timeout errors

### TC-DB-035: Edge Case - Concurrent Updates

**Priority:** Medium  
**Type:** Database  
**Preconditions:** Same record updated concurrently  
**Steps:**

1. Update same record concurrently
2. Check final state
   **Expected Result:**

- Last update wins (or optimistic locking)
- No data corruption
- Data consistency maintained
- No errors

### TC-DB-036: Edge Case - Special Characters

**Priority:** Low  
**Type:** Database  
**Preconditions:** Data with special characters  
**Steps:**

1. Store data with special characters
2. Retrieve data
   **Expected Result:**

- Special characters stored correctly
- Characters preserved
- Encoding handled correctly
- No data loss
