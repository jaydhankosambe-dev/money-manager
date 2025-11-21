-- Insert test user with Entity Framework schema for PostgreSQL
-- Run this AFTER the database migrations have been applied
-- Password: MyPass@123 (hashed with SHA256)

INSERT INTO "Users" ("Username", "PasswordHash", "Email", "PhoneNumber", "Name", "ProfilePhotoUrl", "GoogleId", "CreatedAt", "LastLoginAt")
VALUES 
('myuser123', 'sgSmVby0FmX17CMwQS/djakRJfaRW9P36QXX5EUwf40=', 'myuser@test.com', '1234567890', 'Test User', NULL, NULL, NOW(), NULL);

-- Verify the user was created
SELECT "Id", "Username", "Email", "Name", "PhoneNumber", "CreatedAt" FROM "Users";
