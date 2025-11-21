# 📋 Money Manager Deployment Checklist

Use this checklist to track your deployment progress.

## 🔧 Prerequisites
- [ ] Git installed and working (`git --version`)
- [ ] Node.js installed (`node --version`)
- [ ] .NET SDK installed (`dotnet --version`)
- [ ] GitHub account created
- [ ] Render.com account created (sign up with GitHub)
- [ ] Netlify account created (sign up with GitHub)

## 📦 Preparation Phase

### Local Setup
- [ ] Run `.\deploy-setup.ps1` script
- [ ] Script completed successfully
- [ ] Frontend built (web-build folder exists)
- [ ] Backend compiled (no errors)
- [ ] Git repository initialized

### GitHub Setup
- [ ] Created new repository "money-manager" on GitHub
- [ ] Repository URL copied
- [ ] Committed code: `git commit -m "Initial deployment"`
- [ ] Added remote: `git remote add origin YOUR_URL`
- [ ] Pushed to GitHub: `git push -u origin main`
- [ ] Verified code appears on GitHub

## 🗄️ Database Setup (Optional - Skip for Quick Test)

### Option A: Azure SQL Database
- [ ] Created Azure free account
- [ ] Created SQL Server instance
- [ ] Created MoneyManagerDb database
- [ ] Configured firewall rules
- [ ] Copied connection string
- [ ] Tested connection from local machine
- [ ] Ran migration scripts
- [ ] Imported existing data

### Option B: Keep Local Database
- [ ] Understand data won't be accessible online
- [ ] Only testing UI and deployment process
- [ ] Plan to migrate database later

## 🖥️ Backend Deployment (Render.com)

### Setup
- [ ] Logged into Render.com
- [ ] Connected GitHub account
- [ ] Created new "Web Service"
- [ ] Selected "money-manager" repository
- [ ] Configured settings:
  - [ ] Name: money-manager-api
  - [ ] Root Directory: Backend
  - [ ] Runtime: .NET
  - [ ] Build Command: `dotnet restore && dotnet publish -c Release -o out`
  - [ ] Start Command: `dotnet out/MoneyManager.API.dll`
  - [ ] Instance Type: Free

### Environment Variables
- [ ] Added ASPNETCORE_ENVIRONMENT=Production
- [ ] Added ASPNETCORE_URLS=http://+:10000
- [ ] Added ConnectionStrings__DefaultConnection (if using cloud DB)
- [ ] Added JwtSettings__SecretKey
- [ ] Added JwtSettings__Issuer=MoneyManagerAPI
- [ ] Added JwtSettings__Audience=MoneyManagerClient

### Deployment
- [ ] Clicked "Create Web Service"
- [ ] Build started (green checkmark in logs)
- [ ] Build completed successfully
- [ ] Service is "Live" (green badge)
- [ ] Copied backend URL
- [ ] Tested: `https://YOUR-URL.onrender.com/api/auth/health`

## 🌐 Frontend Deployment (Netlify)

### Update API URL
- [ ] Opened `Frontend/src/services/api.js`
- [ ] Changed API_URL to Render backend URL
- [ ] Saved file
- [ ] Committed: `git commit -m "Update API URL"`
- [ ] Pushed: `git push`

### Netlify Deployment

#### Option A: Drag & Drop
- [ ] Went to https://app.netlify.com/drop
- [ ] Dragged `Frontend/web-build` folder
- [ ] Site deployed
- [ ] Copied site URL

#### Option B: GitHub Integration
- [ ] Logged into Netlify
- [ ] Clicked "New site from Git"
- [ ] Selected GitHub
- [ ] Chose "money-manager" repository
- [ ] Configured build settings:
  - [ ] Base directory: Frontend
  - [ ] Build command: `npm install && npx expo export:web`
  - [ ] Publish directory: web-build
- [ ] Clicked "Deploy site"
- [ ] Deployment completed
- [ ] Site is live
- [ ] Changed site name (optional)
- [ ] Copied site URL

### Post-Deployment
- [ ] Created `Frontend/public/_redirects` file
- [ ] Added content: `/*    /index.html   200`
- [ ] Committed and pushed
- [ ] Netlify auto-redeployed

## 🧪 Testing Phase

### Frontend Tests
- [ ] Opened Netlify URL in browser
- [ ] Login page loads correctly
- [ ] No console errors (press F12)
- [ ] Styles look correct
- [ ] Responsive design works on mobile

### Backend Tests
- [ ] Visited `https://YOUR-BACKEND.onrender.com`
- [ ] Returns "Healthy" or API response
- [ ] No 502/503 errors

### Feature Tests (if using cloud DB)
- [ ] Login with existing credentials works
- [ ] Dashboard loads with data
- [ ] Can navigate to Assets page
- [ ] Can navigate to Charts page
- [ ] Can navigate to Tracker page
- [ ] Can navigate to Settings page
- [ ] Can change theme
- [ ] Can logout
- [ ] Forgot password feature works

### Feature Tests (local DB only)
- [ ] Login page displays
- [ ] Signup form displays
- [ ] Forgot password modal opens
- [ ] UI is responsive
- [ ] Navigation works
- [ ] Theme changes work
- [ ] Note: Data features won't work (expected)

## 📱 Accessibility Tests

### Device Testing
- [ ] Tested on desktop browser
- [ ] Tested on tablet (or responsive mode)
- [ ] Tested on mobile phone (or responsive mode)
- [ ] Tested on different browser (Chrome, Firefox, Safari, Edge)

### Network Testing
- [ ] Tested from different WiFi network
- [ ] Tested from mobile data (4G/5G)
- [ ] Shared URL with friend/colleague to test

## 🔒 Security Checklist

- [ ] HTTPS enabled on both services (automatic)
- [ ] JWT secret key is not default value
- [ ] Database password is strong (if using cloud DB)
- [ ] Firewall rules configured correctly (if using Azure SQL)
- [ ] No sensitive data in GitHub repository
- [ ] Environment variables used for secrets (not hardcoded)

## 📝 Documentation

- [ ] Saved backend URL in safe place
- [ ] Saved frontend URL in safe place
- [ ] Documented any custom configuration
- [ ] Saved database credentials (if applicable)
- [ ] Created backup of deployment settings

## ✅ Final Verification

- [ ] App is accessible from multiple devices
- [ ] App URL is bookmarked
- [ ] GitHub repository is private or secrets removed
- [ ] Understand how to make updates (git push)
- [ ] Know where to check logs (Render/Netlify dashboards)
- [ ] Ready to share URL with users!

## 🎉 Post-Deployment

- [ ] Shared app URL with intended users
- [ ] Created user accounts if needed
- [ ] Tested from user perspective
- [ ] Set up monitoring/alerts (optional)
- [ ] Documented any issues encountered
- [ ] Planned for database migration (if using local DB)

---

## 📊 Deployment Status

**Backend URL**: ___________________________________
**Frontend URL**: ___________________________________
**Database**: Local ☐ | Azure SQL ☐ | PostgreSQL ☐
**Status**: Testing ☐ | Production ☐
**Deployed On**: ___________________________________

---

## 🆘 Common Issues & Solutions

### Backend won't start
- Check Render logs for errors
- Verify environment variables are set
- Check database connection string format

### Frontend shows white screen
- Verify _redirects file exists
- Check browser console for errors
- Verify API_URL is correct in api.js

### API requests fail (CORS)
- Verify backend CORS is configured (already done)
- Check that backend URL is correct
- Check browser network tab for errors

### Render says "Not Found"
- Verify Root Directory is set to "Backend"
- Check that build command is correct
- Review Render build logs

### Netlify build fails
- Check that Base Directory is "Frontend"
- Verify build command includes npm install
- Check Netlify build logs for errors

---

**Estimated Total Time**: 20-45 minutes depending on options chosen
**Cost**: $0.00 (completely free)
**Maintenance**: Updates via git push (auto-deploys)

Good luck with your deployment! 🚀
