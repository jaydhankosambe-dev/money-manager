-- Fix the User table constraints for new authentication columns
USE MoneyManagerDb;
SET QUOTED_IDENTIFIER ON;

-- Drop the existing index first
DROP INDEX IF EXISTS IX_Users_Username ON Users;

-- Make Username, PasswordHash, and PhoneNumber NOT NULL with proper constraints
-- First, update any existing empty values
UPDATE Users SET Username = 'user' + CAST(Id AS NVARCHAR) WHERE Username = '' OR Username IS NULL;
UPDATE Users SET PasswordHash = 'temp' WHERE PasswordHash = '' OR PasswordHash IS NULL;
UPDATE Users SET PhoneNumber = '0000000000' WHERE PhoneNumber = '' OR PhoneNumber IS NULL;

-- Now alter the columns to be NOT NULL
ALTER TABLE Users ALTER COLUMN Username NVARCHAR(50) NOT NULL;
ALTER TABLE Users ALTER COLUMN PasswordHash NVARCHAR(256) NOT NULL;
ALTER TABLE Users ALTER COLUMN PhoneNumber NVARCHAR(20) NOT NULL;

-- Recreate the unique index
CREATE UNIQUE INDEX IX_Users_Username ON Users(Username);

-- Verify the table structure
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE, COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Users'
ORDER BY ORDINAL_POSITION;

PRINT 'User table constraints updated successfully';