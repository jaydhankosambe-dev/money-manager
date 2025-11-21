# Money Manager - Deployment Guide

This guide will help you deploy your Money Manager application to free hosting services so you can access it from anywhere.

## 🌐 Deployment Architecture

- **Frontend**: Netlify (Free tier)
- **Backend**: Render.com (Free tier)
- **Database**: Azure SQL Database (Free tier) or ElephantSQL (PostgreSQL)

## 📋 Prerequisites

Before deploying, you need:
1. GitHub account (for code repository)
2. Netlify account (free - https://www.netlify.com)
3. Render.com account (free - https://render.com)
4. Azure account (free tier) OR ElephantSQL account (free tier)

---

## 🚀 Step-by-Step Deployment

### STEP 1: Prepare Your Repository

#### 1.1 Initialize Git Repository
```powershell
cd C:\MoneyManager
git init
git add .
git commit -m "Initial commit for deployment"
```

#### 1.2 Create GitHub Repository
1. Go to https://github.com/new
2. Create a new repository named "money-manager"
3. DO NOT initialize with README (we already have code)
4. Copy the repository URL

#### 1.3 Push to GitHub
```powershell
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git branch -M main
git push -u origin main
```

---

### STEP 2: Deploy Database

#### Option A: Azure SQL Database (Recommended - stays SQL Server)

1. **Create Azure Account**
   - Go to https://azure.microsoft.com/free
   - Sign up for free tier (no credit card for 12 months free services)

2. **Create SQL Database**
   - In Azure Portal, click "Create a resource"
   - Search for "SQL Database"
   - Click "Create"
   - Fill in:
     - Resource Group: Create new "MoneyManagerRG"
     - Database Name: "MoneyManagerDb"
     - Server: Create new
       - Server name: moneymanager[yourname]
       - Location: Choose nearest region
       - Authentication: SQL authentication
       - Username: `sqladmin`
       - Password: Create strong password
     - Compute + Storage: Click "Configure database"
       - Select "Basic" tier (free/cheap option)
   - Click "Review + Create"

3. **Configure Firewall**
   - Go to your SQL Server (not database)
   - Click "Networking" under Security
   - Set "Allow Azure services and resources to access this server" to YES
   - Add your current IP address
   - Add rule: 0.0.0.0 - 255.255.255.255 (allows all - for testing only)
   - Click Save

4. **Get Connection String**
   - Go to your database
   - Click "Connection strings"
   - Copy the ADO.NET connection string
   - Replace `{your_password}` with your actual password
   - Save this for later

5. **Migrate Your Data**
   ```powershell
   # Export your current database
   cd C:\MoneyManager\Backend
   sqlcmd -S localhost,1433 -U sa -P "MoneyManager@2024" -d MoneyManagerDb -Q "SELECT * FROM Users" -o users_backup.txt
   sqlcmd -S localhost,1433 -U sa -P "MoneyManager@2024" -d MoneyManagerDb -Q "SELECT * FROM UserSettings" -o settings_backup.txt
   sqlcmd -S localhost,1433 -U sa -P "MoneyManager@2024" -d MoneyManagerDb -Q "SELECT * FROM Assets" -o assets_backup.txt
   sqlcmd -S localhost,1433 -U sa -P "MoneyManager@2024" -d MoneyManagerDb -Q "SELECT * FROM MonthlyEntries" -o entries_backup.txt
   ```

   Then use Azure Data Studio or SSMS to:
   - Connect to your Azure SQL database
   - Run the migration scripts from Backend/Migrations
   - Import your backup data

#### Option B: ElephantSQL (PostgreSQL - Easier but requires code changes)

1. Go to https://www.elephantsql.com
2. Sign up for free "Tiny Turtle" plan
3. Create new instance
4. Copy the connection string
5. You'll need to modify backend to use PostgreSQL (requires NuGet package changes)

---

### STEP 3: Deploy Backend API (Render.com)

1. **Sign Up for Render**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select "money-manager" repository

3. **Configure Service**
   - Name: `money-manager-api`
   - Region: Choose nearest
   - Branch: `main`
   - Root Directory: `Backend`
   - Runtime: `.NET`
   - Build Command: `dotnet restore && dotnet publish -c Release -o out`
   - Start Command: `dotnet out/MoneyManager.API.dll`
   - Instance Type: Free

4. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable"
   
   Add these variables:
   ```
   ASPNETCORE_ENVIRONMENT=Production
   ConnectionStrings__DefaultConnection=YOUR_AZURE_SQL_CONNECTION_STRING
   JwtSettings__SecretKey=YourSuperSecretKeyForJWTTokenGeneration12345!
   JwtSettings__Issuer=MoneyManagerAPI
   JwtSettings__Audience=MoneyManagerClient
   JwtSettings__ExpirationInMinutes=1440
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy your service URL (e.g., `https://money-manager-api.onrender.com`)

6. **Test API**
   - Open: `https://YOUR-SERVICE-URL.onrender.com/api/auth/health`
   - Should return 200 OK

---

### STEP 4: Deploy Frontend (Netlify)

1. **Update API URL**
   - Edit `Frontend/src/services/api.js`
   - Change `API_URL` to your Render backend URL:
     ```javascript
     const API_URL = 'https://money-manager-api.onrender.com/api';
     ```
   - Commit and push changes

2. **Build Frontend for Web**
   ```powershell
   cd C:\MoneyManager\Frontend
   npx expo export:web
   ```

3. **Sign Up for Netlify**
   - Go to https://www.netlify.com
   - Sign up with GitHub

4. **Deploy Site**
   
   **Option A: Drag and Drop (Easiest)**
   - Go to https://app.netlify.com/drop
   - Drag the `Frontend/web-build` folder
   - Your site is live!

   **Option B: Connect to GitHub (Recommended)**
   - Click "New site from Git"
   - Choose GitHub
   - Select "money-manager" repository
   - Configure:
     - Base directory: `Frontend`
     - Build command: `npx expo export:web`
     - Publish directory: `web-build`
   - Click "Deploy site"

5. **Configure Site**
   - Click "Site settings"
   - Change site name to something memorable
   - Copy your site URL (e.g., `https://money-manager-app.netlify.app`)

6. **Add Redirects for SPA**
   Create `Frontend/public/_redirects`:
   ```
   /*    /index.html   200
   ```

---

### STEP 5: Test Your Deployed Application

1. **Open Your App**
   - Navigate to your Netlify URL
   - Example: `https://money-manager-app.netlify.app`

2. **Test Login**
   - Try logging in with: `myuser123` / `MyPass@123`
   - Verify you can access the dashboard

3. **Test Features**
   - Navigate between screens
   - Add/edit assets
   - Check charts and tracker
   - Test logout
   - Test forgot password

---

## 🔧 Troubleshooting

### Backend Issues

**Problem**: Backend won't start on Render
- Check build logs in Render dashboard
- Verify all environment variables are set correctly
- Ensure database connection string is correct

**Problem**: API returns 500 errors
- Check Render logs: Click "Logs" tab
- Verify database migrations ran successfully
- Check connection string format

### Frontend Issues

**Problem**: Can't connect to backend
- Verify API_URL in `api.js` matches your Render URL
- Check browser console for CORS errors
- Verify backend is running (visit backend URL)

**Problem**: White screen on Netlify
- Check Netlify deploy logs
- Verify `_redirects` file exists
- Clear cache and redeploy

### Database Issues

**Problem**: Can't connect to Azure SQL
- Verify firewall rules allow your IP
- Check connection string format
- Ensure username/password are correct

---

## 💰 Cost Information

All services used are **100% FREE** with the following limits:

- **Render.com Free Tier**:
  - 750 hours/month (enough for one always-on service)
  - Sleeps after 15 minutes of inactivity (first request takes ~30 seconds)
  - 100 GB bandwidth/month

- **Netlify Free Tier**:
  - 100 GB bandwidth/month
  - Unlimited sites
  - Automatic HTTPS

- **Azure SQL Free Tier**:
  - 250 GB storage
  - 5 DTUs (Database Transaction Units)
  - Perfect for small applications

---

## 🔐 Security Recommendations

1. **Change JWT Secret Key**
   - Generate a new strong secret key
   - Update in Render environment variables

2. **Restrict Database Access**
   - Don't use 0.0.0.0-255.255.255.255 firewall rule in production
   - Only allow Render's IP addresses

3. **Environment Variables**
   - Never commit `.env` files to GitHub
   - Always use environment variables for secrets

4. **HTTPS Only**
   - Both Netlify and Render provide free HTTPS
   - Never use HTTP in production

---

## 📱 Access Your App

Once deployed:
- **Web App**: `https://your-site-name.netlify.app`
- **API**: `https://money-manager-api.onrender.com`
- **Access from anywhere**: Open the Netlify URL on any device with internet

---

## 🔄 Updating Your App

After making changes locally:

```powershell
# 1. Commit changes
git add .
git commit -m "Your update message"
git push origin main

# 2. Both Render and Netlify will auto-deploy
# Wait 2-5 minutes for deployment to complete
```

---

## 📧 Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Review logs in Render and Netlify dashboards
3. Verify all environment variables are set correctly
4. Ensure database connection is working

---

## 🎉 Next Steps

After successful deployment:
1. Share the Netlify URL with anyone who needs access
2. Bookmark the URL for easy access
3. Consider setting up a custom domain (available on Netlify free tier)
4. Set up monitoring to track uptime

Your Money Manager app is now live and accessible from anywhere in the world! 🌍
