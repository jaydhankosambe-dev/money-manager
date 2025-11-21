-- Add IsActive column to Entities table
ALTER TABLE Entities ADD IsActive BIT NOT NULL DEFAULT 1;

-- Add IsActive column to MonthlyEntries table  
ALTER TABLE MonthlyEntries ADD IsActive BIT NOT NULL DEFAULT 1;

-- Update existing records to set IsActive = 1
UPDATE Entities SET IsActive = 1;
UPDATE MonthlyEntries SET IsActive = 1;
