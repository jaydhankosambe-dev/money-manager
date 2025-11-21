# ============================================
# PowerShell Script to Rename Entity to Asset
# ============================================
# 
# IMPORTANT: Run this script AFTER stopping both backend and frontend servers
# 
# Usage: Run from C:\MoneyManager directory
# .\Rename-EntityToAsset.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Entity to Asset Renaming Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if servers are running
Write-Host "Checking if servers are running..." -ForegroundColor Yellow
$backendRunning = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
$frontendRunning = Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue

if ($backendRunning -or $frontendRunning) {
    Write-Host "ERROR: Please stop both backend and frontend servers before running this script!" -ForegroundColor Red
    exit 1
}

Write-Host "Servers are stopped. Proceeding with renaming..." -ForegroundColor Green
Write-Host ""

# ============================================
# STEP 1: BACKEND FILE RENAMES
# ============================================
Write-Host "STEP 1: Renaming Backend Files..." -ForegroundColor Cyan

# Rename Model file
if (Test-Path "Backend\Models\Entity.cs") {
    Rename-Item -Path "Backend\Models\Entity.cs" -NewName "Asset.cs"
    Write-Host "  ✓ Renamed Entity.cs to Asset.cs" -ForegroundColor Green
}

# Rename DTO file
if (Test-Path "Backend\DTOs\EntityDtos.cs") {
    Rename-Item -Path "Backend\DTOs\EntityDtos.cs" -NewName "AssetDtos.cs"
    Write-Host "  ✓ Renamed EntityDtos.cs to AssetDtos.cs" -ForegroundColor Green
}

# Rename Service files
if (Test-Path "Backend\Services\EntityService.cs") {
    Rename-Item -Path "Backend\Services\EntityService.cs" -NewName "AssetService.cs"
    Write-Host "  ✓ Renamed EntityService.cs to AssetService.cs" -ForegroundColor Green
}

if (Test-Path "Backend\Services\IEntityService.cs") {
    Rename-Item -Path "Backend\Services\IEntityService.cs" -NewName "IAssetService.cs"
    Write-Host "  ✓ Renamed IEntityService.cs to IAssetService.cs" -ForegroundColor Green
}

# Rename Controller if exists
if (Test-Path "Backend\Controllers\EntitiesController.cs") {
    Rename-Item -Path "Backend\Controllers\EntitiesController.cs" -NewName "AssetsController.cs"
    Write-Host "  ✓ Renamed EntitiesController.cs to AssetsController.cs" -ForegroundColor Green
}

Write-Host ""

# ============================================
# STEP 2: FRONTEND FILE RENAME
# ============================================
Write-Host "STEP 2: Renaming Frontend Files..." -ForegroundColor Cyan

if (Test-Path "Frontend\src\screens\EntitiesScreen.js") {
    Rename-Item -Path "Frontend\src\screens\EntitiesScreen.js" -NewName "AssetsScreen.js"
    Write-Host "  ✓ Renamed EntitiesScreen.js to AssetsScreen.js" -ForegroundColor Green
}

if (Test-Path "Frontend\src\services\api.js") {
    Write-Host "  ℹ api.js needs manual content updates" -ForegroundColor Yellow
}

Write-Host ""

# ============================================
# STEP 3: CONTENT REPLACEMENTS
# ============================================
Write-Host "STEP 3: Updating File Contents..." -ForegroundColor Cyan
Write-Host "  This requires manual updates. See IMPLEMENTATION_GUIDE.md" -ForegroundColor Yellow
Write-Host ""

# ============================================
# STEP 4: DATABASE MIGRATION
# ============================================
Write-Host "STEP 4: Database Table Rename..." -ForegroundColor Cyan
Write-Host "  Run this SQL command manually:" -ForegroundColor Yellow
Write-Host "  EXEC sp_rename 'Entities', 'Assets';" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "File Renaming Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Update file contents (class names, variables, etc.)" -ForegroundColor White
Write-Host "2. Run database migration SQL" -ForegroundColor White
Write-Host "3. Build and test the application" -ForegroundColor White
Write-Host "4. See IMPLEMENTATION_GUIDE.md for detailed instructions" -ForegroundColor White
Write-Host ""
