-- ============================================
-- Database Migration: Rename Entities to Assets
-- ============================================
-- Run this script AFTER making all backend code changes
-- Connect to your MoneyManagerDb database first

USE MoneyManagerDb;
GO

-- Step 1: Check current table name
PRINT 'Current tables:';
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE';
GO

-- Step 2: Rename the table
PRINT 'Renaming Entities table to Assets...';
EXEC sp_rename 'Entities', 'Assets';
GO

-- Step 3: Verify the rename
PRINT 'Verifying rename...';
IF OBJECT_ID('Assets', 'U') IS NOT NULL
    PRINT '✓ Table successfully renamed to Assets'
ELSE
    PRINT '✗ ERROR: Assets table not found!'
GO

-- Step 4: Check data
PRINT 'Checking data in Assets table:';
SELECT COUNT(*) AS TotalAssets FROM Assets;
GO

-- Step 5: Display sample data
PRINT 'Sample data from Assets table:';
SELECT TOP 5 
    Id, 
    Name, 
    Amount, 
    TargetAmount,
    InvestmentType, 
    RiskCategory 
FROM Assets
ORDER BY Id;
GO

-- Step 6: Check for any foreign key references (if applicable)
PRINT 'Checking foreign key constraints:';
SELECT 
    OBJECT_NAME(f.parent_object_id) AS TableName,
    COL_NAME(fc.parent_object_id, fc.parent_column_id) AS ColumnName,
    OBJECT_NAME (f.referenced_object_id) AS ReferenceTableName,
    COL_NAME(fc.referenced_object_id, fc.referenced_column_id) AS ReferenceColumnName,
    f.name AS ForeignKeyName
FROM sys.foreign_keys AS f
INNER JOIN sys.foreign_key_columns AS fc 
    ON f.OBJECT_ID = fc.constraint_object_id
WHERE OBJECT_NAME(f.referenced_object_id) = 'Assets';
GO

PRINT '';
PRINT '============================================';
PRINT 'Migration Complete!';
PRINT '============================================';
PRINT 'Next steps:';
PRINT '1. Verify the Assets table has all expected data';
PRINT '2. Start the backend server';
PRINT '3. Test API endpoints (/api/assets)';
PRINT '4. Test the frontend application';
PRINT '';
