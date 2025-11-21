-- Insert a test user directly into the database
USE MoneyManagerDb;
SET QUOTED_IDENTIFIER ON;

-- First, let's see current users
SELECT * FROM Users;

-- Insert test user with hashed password
-- Password: Demo@123 (SHA256 hash)
INSERT INTO Users (Email, Name, Username, PasswordHash, PhoneNumber, CreatedAt)
VALUES (
    'demo@test.com', 
    'Demo User', 
    'demo123', 
    'nqKdHQ3O3jLOBBAOJYO4TZDDmyFTrASm1rD7r4FjB3c=', -- This is SHA256 hash of "Demo@123"
    '9876543210', 
    GETUTCDATE()
);

-- Show the inserted user
SELECT Id, Username, Email, Name, PhoneNumber, CreatedAt FROM Users WHERE Username = 'demo123';