-- Add Username and PasswordHash columns to Users table if they don't exist
USE MoneyManagerDb;

-- Check if columns exist and add them if they don't
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'Username')
BEGIN
    ALTER TABLE Users ADD Username NVARCHAR(50) NOT NULL DEFAULT '';
    PRINT 'Added Username column to Users table';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'PasswordHash')
BEGIN
    ALTER TABLE Users ADD PasswordHash NVARCHAR(256) NOT NULL DEFAULT '';
    PRINT 'Added PasswordHash column to Users table';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'PhoneNumber')
BEGIN
    ALTER TABLE Users ADD PhoneNumber NVARCHAR(20) NOT NULL DEFAULT '';
    PRINT 'Added PhoneNumber column to Users table';
END

-- Create unique index on Username if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Users_Username')
BEGIN
    SET QUOTED_IDENTIFIER ON;
    CREATE UNIQUE INDEX IX_Users_Username ON Users(Username) WHERE Username <> '';
    PRINT 'Created unique index on Username';
END

-- Show current Users table structure
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Users'
ORDER BY ORDINAL_POSITION;