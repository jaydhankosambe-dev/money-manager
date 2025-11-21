-- Reset database and let Entity Framework migrations create the correct schema
-- Run this in Neon SQL Editor BEFORE redeploying

-- Drop existing tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS "MonthlyEntries" CASCADE;
DROP TABLE IF EXISTS "Assets" CASCADE;
DROP TABLE IF EXISTS "UserSettings" CASCADE;
DROP TABLE IF EXISTS "Users" CASCADE;

-- Drop migration history table so EF can recreate schema
DROP TABLE IF EXISTS "__EFMigrationsHistory" CASCADE;

-- Tables will be created automatically by Entity Framework migrations on next deployment
