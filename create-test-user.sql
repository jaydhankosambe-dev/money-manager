-- Create test user for Money Manager
-- Password is: MyPass@123 (hashed with SHA256)

INSERT INTO "Users" ("UserId", "Username", "Email", "PasswordHash", "IsActive", "CreatedAt")
VALUES 
(gen_random_uuid(), 'myuser123', 'myuser@test.com', 'sgSmVby0FmX17CMwQS/djakRJfaRW9P36QXX5EUwf40=', true, NOW());

-- Get the UserId we just created for settings
DO $$
DECLARE
    new_user_id UUID;
BEGIN
    SELECT "UserId" INTO new_user_id FROM "Users" WHERE "Username" = 'myuser123';
    
    -- Create default settings for the user
    INSERT INTO "UserSettings" ("UserId", "Theme", "ViewType", "CreatedAt", "UpdatedAt")
    VALUES (new_user_id, 'light', 'grid', NOW(), NOW());
END $$;
