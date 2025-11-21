# Money Manager - Automated Deployment Setup Script
# This script prepares your project for deployment

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Money Manager Deployment Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = "C:\MoneyManager"
Set-Location $projectRoot

# Step 1: Check if Git is installed
Write-Host "Step 1: Checking Git installation..." -ForegroundColor Yellow
try {
    $gitVersion = git --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Git is installed: $gitVersion" -ForegroundColor Green
    } else {
        throw "Git not found"
    }
} catch {
    Write-Host "✗ Git is not installed. Please install Git from https://git-scm.com/download/win" -ForegroundColor Red
    exit 1
}

# Step 2: Initialize Git repository
Write-Host "`nStep 2: Initializing Git repository..." -ForegroundColor Yellow
if (Test-Path ".git") {
    Write-Host "✓ Git repository already initialized" -ForegroundColor Green
} else {
    git init
    Write-Host "✓ Git repository initialized" -ForegroundColor Green
}

# Step 3: Create/verify .gitignore
Write-Host "`nStep 3: Verifying .gitignore..." -ForegroundColor Yellow
if (Test-Path ".gitignore") {
    Write-Host "✓ .gitignore exists" -ForegroundColor Green
} else {
    Write-Host "✗ .gitignore not found - please check repository" -ForegroundColor Red
}

# Step 4: Check frontend dependencies
Write-Host "`nStep 4: Checking frontend dependencies..." -ForegroundColor Yellow
Set-Location "$projectRoot\Frontend"
if (Test-Path "node_modules") {
    Write-Host "✓ Node modules already installed" -ForegroundColor Green
} else {
    Write-Host "Installing npm packages (this may take a few minutes)..." -ForegroundColor Cyan
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Dependencies installed successfully" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
}

# Step 5: Build frontend for web
Write-Host "`nStep 5: Building frontend for web deployment..." -ForegroundColor Yellow
Write-Host "This will take 2-3 minutes..." -ForegroundColor Cyan
npx expo export:web
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Frontend built successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Frontend build failed" -ForegroundColor Red
    exit 1
}

# Step 6: Create production backend build
Write-Host "`nStep 6: Building backend for production..." -ForegroundColor Yellow
Set-Location "$projectRoot\Backend"
dotnet publish -c Release -o out
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Backend built successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Backend build failed" -ForegroundColor Red
    exit 1
}

# Step 7: Prepare Git commit
Write-Host "`nStep 7: Preparing Git commit..." -ForegroundColor Yellow
Set-Location $projectRoot
git add .
git status --short

# Summary
Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "Setup Complete! ✓" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Create GitHub repository at: https://github.com/new" -ForegroundColor White
Write-Host "   - Repository name: money-manager" -ForegroundColor White
Write-Host "   - Leave 'Initialize with README' unchecked" -ForegroundColor White
Write-Host ""
Write-Host "2. Run these commands:" -ForegroundColor White
Write-Host "   git commit -m 'Initial deployment'" -ForegroundColor Cyan
Write-Host "   git remote add origin https://github.com/YOUR-USERNAME/money-manager.git" -ForegroundColor Cyan
Write-Host "   git branch -M main" -ForegroundColor Cyan
Write-Host "   git push -u origin main" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Follow QUICK_DEPLOY.md for hosting setup" -ForegroundColor White
Write-Host ""
$fileCount = (git status --short | Measure-Object -Line).Lines
Write-Host "Files ready to commit: $fileCount files" -ForegroundColor Green
Write-Host ""
Write-Host "For detailed deployment guide, see: DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan
