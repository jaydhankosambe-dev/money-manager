# Money Manager - Quick Deployment Steps

## ⚡ Fastest Way to Deploy (Step-by-Step)

### 1️⃣ Push to GitHub (5 minutes)

```powershell
# Run this in PowerShell from C:\MoneyManager folder
cd C:\MoneyManager
git init
git add .
git commit -m "Initial deployment"

# Go to github.com/new and create repository "money-manager"
# Then run (replace USERNAME with your GitHub username):
git remote add origin https://github.com/USERNAME/money-manager.git
git branch -M main
git push -u origin main
```

### 2️⃣ Deploy Backend to Render (10 minutes)

1. **Sign up**: Go to https://render.com and sign up with GitHub
2. **New Web Service**: Click "New +" → "Web Service"
3. **Connect repo**: Select "money-manager"
4. **Settings**:
   - Name: `money-manager-api`
   - Root Directory: `Backend`
   - Runtime: `.NET`
   - Build Command: `dotnet restore && dotnet publish -c Release -o out`
   - Start Command: `dotnet out/MoneyManager.API.dll`
   - Plan: Free
5. **Environment Variables** (click Advanced):
   ```
   ASPNETCORE_ENVIRONMENT=Production
   ASPNETCORE_URLS=http://+:10000
   ```
6. **Create**: Click "Create Web Service"
7. **Wait**: 5-10 minutes for build
8. **Copy URL**: Save your backend URL (e.g., `https://money-manager-api.onrender.com`)

⚠️ **Important**: For now, we'll use your local database. See DEPLOYMENT_GUIDE.md for cloud database setup.

### 3️⃣ Update Frontend API URL (2 minutes)

Edit `Frontend/src/services/api.js`:

```javascript
const API_URL = 'https://YOUR-RENDER-URL.onrender.com/api';
```

Then commit:
```powershell
git add .
git commit -m "Update API URL for production"
git push
```

### 4️⃣ Build Frontend (3 minutes)

```powershell
cd C:\MoneyManager\Frontend
npm install
npx expo export:web
```

This creates a `web-build` folder.

### 5️⃣ Deploy to Netlify (5 minutes)

**Option A - Drag & Drop (Easiest)**:
1. Go to https://app.netlify.com/drop
2. Drag the entire `Frontend/web-build` folder
3. Done! Copy your URL

**Option B - GitHub (Better for updates)**:
1. Sign up at https://netlify.com with GitHub
2. Click "New site from Git"
3. Choose GitHub → "money-manager"
4. Settings:
   - Base directory: `Frontend`
   - Build command: `npm install && npx expo export:web`
   - Publish directory: `web-build`
5. Click "Deploy"
6. Copy your URL (e.g., `https://money-manager-xyz.netlify.app`)

### 6️⃣ Done! 🎉

Access your app at: `https://your-site.netlify.app`

---

## 🚨 Important Notes

### Database Warning
Your backend is currently configured to connect to `localhost:1433`. This won't work when deployed to Render.

**You have 2 options**:

1. **Quick Test (keeps local DB)**: 
   - Backend will fail database operations
   - You can test the UI but not data features
   - Good for testing deployment process

2. **Full Deployment (cloud DB)**:
   - Follow "STEP 2: Deploy Database" in DEPLOYMENT_GUIDE.md
   - Set connection string in Render environment variables
   - Everything works fully

### Free Tier Limitations

**Render.com Free**:
- Backend sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds
- Backend stays awake while you're using it

**Netlify Free**:
- Always fast (static files)
- No sleep issues

---

## 🔄 Updating After Changes

```powershell
git add .
git commit -m "Description of changes"
git push

# Both Render and Netlify auto-deploy in 2-5 minutes
```

---

## 🆘 Troubleshooting

### "Backend won't build on Render"
- Check Render logs for errors
- Verify `Backend` folder is in your GitHub repo
- Check that `.csproj` file exists

### "Frontend shows white screen"
- Create `Frontend/public/_redirects` file with content: `/*    /index.html   200`
- Redeploy on Netlify

### "API requests fail"
- Verify `api.js` has correct Render URL
- Check that backend is running (visit Render dashboard)
- Check browser console for CORS errors

---

## 📋 Checklist

- [ ] GitHub repository created and code pushed
- [ ] Render backend deployed and URL copied
- [ ] Frontend api.js updated with backend URL
- [ ] Frontend built with `npx expo export:web`
- [ ] Netlify site deployed
- [ ] App accessible from browser
- [ ] (Optional) Cloud database setup for full functionality

---

## 💡 Tips

1. **Custom Domain**: Add free custom domain in Netlify settings
2. **HTTPS**: Both Render and Netlify provide free SSL
3. **Monitoring**: Check Render dashboard if backend is slow
4. **Logs**: View real-time logs in Render dashboard
5. **Multiple Environments**: Create separate Render/Netlify instances for dev/prod

For detailed instructions and database setup, see **DEPLOYMENT_GUIDE.md**
