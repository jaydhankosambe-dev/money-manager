-- Check and clean up data to ensure proper user isolation
USE MoneyManagerDb;
SET QUOTED_IDENTIFIER ON;

-- Show current users
PRINT 'Current Users:';
SELECT Id, Username, Email, Name FROM Users;

-- Show assets by user
PRINT 'Assets by User:';
SELECT UserId, COUNT(*) as AssetCount, SUM(Amount) as TotalAmount FROM Assets GROUP BY UserId;

-- Show monthly entries by user
PRINT 'Monthly Entries by User:';
SELECT UserId, COUNT(*) as EntryCount FROM MonthlyEntries GROUP BY UserId;

-- Show user settings by user
PRINT 'User Settings by User:';
SELECT UserId, DashboardViewType, Theme FROM UserSettings;

-- Clean up: Make sure all data has proper UserId associations
-- Update any assets with UserId = 0 or NULL to belong to user 1 (the test user)
UPDATE Assets SET UserId = 1 WHERE UserId = 0 OR UserId IS NULL;

-- Update any monthly entries with UserId = 0 or NULL to belong to user 1
UPDATE MonthlyEntries SET UserId = 1 WHERE UserId = 0 OR UserId IS NULL;

-- Update any user settings with UserId = 0 or NULL to belong to user 1
UPDATE UserSettings SET UserId = 1 WHERE UserId = 0 OR UserId IS NULL;

PRINT 'Data cleanup completed';

-- Show final data distribution
SELECT 'Assets' as TableName, UserId, COUNT(*) as RecordCount FROM Assets GROUP BY UserId
UNION ALL
SELECT 'MonthlyEntries' as TableName, UserId, COUNT(*) as RecordCount FROM MonthlyEntries GROUP BY UserId
UNION ALL
SELECT 'UserSettings' as TableName, UserId, COUNT(*) as RecordCount FROM UserSettings GROUP BY UserId
ORDER BY TableName, UserId;