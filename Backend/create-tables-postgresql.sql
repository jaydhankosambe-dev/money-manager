-- PostgreSQL Database Schema for Money Manager
-- Run this script in Neon SQL Editor to manually create all tables

-- Create Users table
CREATE TABLE "Users" (
    "Id" SERIAL PRIMARY KEY,
    "Username" VARCHAR(50) NOT NULL,
    "PasswordHash" VARCHAR(256) NOT NULL,
    "Email" VARCHAR(100) NOT NULL,
    "PhoneNumber" VARCHAR(20) NOT NULL,
    "Name" VARCHAR(100) NOT NULL,
    "ProfilePhotoUrl" VARCHAR(500),
    "GoogleId" VARCHAR(200),
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "LastLoginAt" TIMESTAMP
);

-- Create UserSettings table
CREATE TABLE "UserSettings" (
    "Id" SERIAL PRIMARY KEY,
    "UserId" INTEGER NOT NULL,
    "DashboardViewType" VARCHAR(20) NOT NULL DEFAULT 'grid',
    "Theme" VARCHAR(20) NOT NULL DEFAULT 'light',
    "ShowAmount" BOOLEAN NOT NULL DEFAULT true,
    "ShowPercentage" BOOLEAN NOT NULL DEFAULT true,
    "ShowDashboardAssets" BOOLEAN NOT NULL DEFAULT true,
    "ShowInvestmentType" BOOLEAN NOT NULL DEFAULT true,
    "ShowAssetName" BOOLEAN NOT NULL DEFAULT true,
    "DashboardColorScheme" VARCHAR(20) NOT NULL DEFAULT 'default',
    "ButtonShape" VARCHAR(20) NOT NULL DEFAULT 'rounded',
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP,
    CONSTRAINT "FK_UserSettings_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users"("Id") ON DELETE CASCADE
);

-- Create Assets table
CREATE TABLE "Assets" (
    "Id" SERIAL PRIMARY KEY,
    "UserId" INTEGER NOT NULL,
    "Name" VARCHAR(100) NOT NULL,
    "Amount" DECIMAL(18,2) NOT NULL,
    "TargetAmount" DECIMAL(18,2),
    "InvestmentType" VARCHAR(50) NOT NULL,
    "RiskCategory" VARCHAR(50) NOT NULL,
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "FK_Assets_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users"("Id") ON DELETE CASCADE
);

-- Create MonthlyEntries table
CREATE TABLE "MonthlyEntries" (
    "Id" SERIAL PRIMARY KEY,
    "UserId" INTEGER NOT NULL,
    "MonthName" VARCHAR(20) NOT NULL,
    "Amount" DECIMAL(18,2) NOT NULL,
    "Year" INTEGER NOT NULL,
    "Month" INTEGER NOT NULL,
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "FK_MonthlyEntries_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users"("Id") ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX "IX_UserSettings_UserId" ON "UserSettings"("UserId");
CREATE INDEX "IX_Assets_UserId" ON "Assets"("UserId");
CREATE INDEX "IX_MonthlyEntries_UserId" ON "MonthlyEntries"("UserId");

-- Create EF Migrations History table (required by Entity Framework)
CREATE TABLE "__EFMigrationsHistory" (
    "MigrationId" VARCHAR(150) NOT NULL PRIMARY KEY,
    "ProductVersion" VARCHAR(32) NOT NULL
);

-- Insert migration history records
INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES 
('20251115095033_InitialCreate', '7.0.0'),
('20251121165156_PostgreSQLMigration', '7.0.0');

-- Insert test user
-- Password: MyPass@123 (hashed with SHA256)
INSERT INTO "Users" ("Username", "PasswordHash", "Email", "PhoneNumber", "Name", "ProfilePhotoUrl", "GoogleId", "CreatedAt", "LastLoginAt")
VALUES 
('myuser123', 'sgSmVby0FmX17CMwQS/djakRJfaRW9P36QXX5EUwf40=', 'myuser@test.com', '1234567890', 'Test User', NULL, NULL, NOW(), NULL);

-- Insert default user settings for the test user
INSERT INTO "UserSettings" ("UserId", "DashboardViewType", "Theme", "ShowAmount", "ShowPercentage", "ShowDashboardAssets", "ShowInvestmentType", "ShowAssetName", "DashboardColorScheme", "ButtonShape", "CreatedAt", "UpdatedAt")
VALUES 
(1, 'grid', 'light', true, true, true, true, true, 'default', 'rounded', NOW(), NOW());

-- Verify tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Verify test user was created
SELECT "Id", "Username", "Email", "Name", "PhoneNumber", "CreatedAt" 
FROM "Users";

-- Verify user settings were created
SELECT "Id", "UserId", "DashboardViewType", "Theme" 
FROM "UserSettings";
