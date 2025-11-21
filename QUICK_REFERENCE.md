# 🚀 Money Manager - Quick Reference Card

## ⚡ Start in 5 Minutes

### 1. Start Backend (Terminal 1)
```powershell
cd C:\MoneyManager\Backend
dotnet restore
dotnet ef database update
dotnet run
```
✅ Backend running at: `https://localhost:5001`

### 2. Start Frontend (Terminal 2)
```powershell
cd C:\MoneyManager\Frontend
npm install
npm run web
```
✅ Frontend running at: `http://localhost:19006`

### 3. Configure Google OAuth
Edit `Backend/appsettings.json` and `Frontend/src/screens/LoginScreen.js` with your Google Client IDs

---

## 📱 Features at a Glance

| Feature | Location | What It Does |
|---------|----------|--------------|
| 🔐 **Login** | Login Screen | Google OAuth authentication |
| 💰 **Total Amount** | Dashboard | Shows sum of all entities |
| 📊 **Asset Breakdown** | Dashboard | Grid/Tiles/Table views |
| 💼 **Entities** | Entities Page | Add/Edit/Delete financial entities |
| 📈 **Bar Chart** | Charts Page | Monthly money tracking |
| 🥧 **Pie Charts** | Charts Page | Asset & risk distribution |
| ⚙️ **Settings** | Settings Page | Preferences & configuration |
| 🧭 **Navigation** | Bottom Bar | Switch between pages |

---

## 🎯 4 Main Pages

### 1️⃣ Dashboard
- **Total**: Large display at top
- **View**: Grid, Tiles, or Table
- **Shows**: Name, Amount, %, Type
- **Updates**: Automatically from changes

### 2️⃣ Entities
- **List**: All financial entities
- **Add**: + button with form
- **Edit**: Pencil icon per entity
- **Delete**: Trash icon with confirm

### 3️⃣ Charts
- **Bar**: Monthly tracking + data table
- **Pie 1**: Asset distribution
- **Pie 2**: Risk distribution
- **Add**: + icon for new month

### 4️⃣ Settings
- **Profile**: Photo, name, email
- **View**: Grid/Tiles/Table selector
- **Display**: Toggle what shows
- **Theme**: Light/Dark mode

---

## 🔗 API Endpoints

```
Auth:
  POST /api/auth/google-login

Dashboard:
  GET  /api/dashboard

Entities:
  GET    /api/entities
  POST   /api/entities
  PUT    /api/entities/{id}
  DELETE /api/entities/{id}

Charts:
  GET    /api/charts
  POST   /api/charts/monthly
  PUT    /api/charts/monthly/{id}
  DELETE /api/charts/monthly/{id}

Settings:
  GET /api/settings
  PUT /api/settings
```

---

## 🎨 Color Scheme

| Purpose | Color | Hex |
|---------|-------|-----|
| Primary | Purple | #6200EE |
| Secondary | Teal | #03DAC6 |
| Success | Green | #4CAF50 |
| Warning | Amber | #FFC107 |
| Error | Red | #B00020 |
| Low Risk | Green | #4CAF50 |
| Moderate Risk | Yellow | #FFC107 |
| High Risk | Red | #F44336 |

---

## 📁 Key Files

### Backend
```
Program.cs                    - Entry point
appsettings.json             - Configuration
Controllers/                  - API endpoints
Services/                     - Business logic
Models/                      - Database entities
Data/ApplicationDbContext.cs - EF Core setup
```

### Frontend
```
App.js                       - Root component
src/screens/                 - App screens
src/navigation/              - Tab navigator
src/services/api.js          - API calls
src/utils/theme.js           - Colors & styles
```

### Documentation
```
SETUP_GUIDE.md              - Setup instructions
README.md                   - Project overview
PROJECT_SUMMARY.md          - Complete summary
IMPLEMENTATION_CHECKLIST.md - All features list
```

---

## 🛠️ Common Commands

### Backend
```powershell
# Run server
dotnet run

# Watch mode (auto-reload)
dotnet watch run

# Update database
dotnet ef database update

# Create migration
dotnet ef migrations add MigrationName
```

### Frontend
```powershell
# Start dev server
npm start

# Run on web
npm run web

# Clear cache
expo start -c

# Install package
npm install package-name
```

---

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check SQL Server running, verify connection string |
| Frontend errors | Delete `node_modules`, run `npm install` |
| Can't connect to API | Check backend is running, verify API_URL |
| Google login fails | Verify Client IDs are correct in all locations |
| Charts not showing | Add data first, clear cache with `expo start -c` |
| Bottom nav cut off | Check height in `MainTabNavigator.js` |

---

## ✅ Test Checklist

- [ ] Backend starts at port 5001
- [ ] Frontend starts at port 19006
- [ ] Can login with Google
- [ ] Dashboard shows total
- [ ] Can add entity
- [ ] Can edit entity
- [ ] Can delete entity
- [ ] Charts display correctly
- [ ] Settings persist
- [ ] Bottom nav fully visible

---

## 📊 Database Tables

```
Users
  ↓
  ├─→ Entities (many)
  ├─→ MonthlyEntries (many)
  └─→ UserSettings (one)
```

---

## 🎯 Data Flow

```
Add Entity (Page 2)
    ↓
API saves to database
    ↓
Dashboard (Page 1) auto-updates
    ↓
Charts (Page 3) auto-updates
    ↓
All percentages recalculated
```

---

## 💡 Pro Tips

1. **Development**: Use `dotnet watch run` for backend auto-reload
2. **Debugging**: Check Swagger at `https://localhost:5001/swagger`
3. **Mobile Testing**: Use your computer's IP in API_URL
4. **Database**: Use SQL Server Management Studio to view data
5. **API Testing**: Use Swagger UI or Postman

---

## 🚀 Deploy Checklist

### Backend
- [ ] Update connection string for production
- [ ] Set secure JWT secret key
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Set up logging
- [ ] Deploy to Azure/AWS/IIS

### Frontend
- [ ] Update API_URL to production
- [ ] Build for production
- [ ] Test on all platforms
- [ ] Submit to app stores
- [ ] Deploy web to Netlify/Vercel

---

## 📞 Quick Help

| Need Help With | See Document |
|----------------|--------------|
| Setup | SETUP_GUIDE.md |
| Features | Documentation/README.md |
| Development | DEVELOPER_GUIDE.md |
| Requirements | APPLICATION_PROMPT.md |
| File Structure | FILE_STRUCTURE.md |
| All Features | IMPLEMENTATION_CHECKLIST.md |

---

## 🎉 You're Ready!

**Project is 100% complete and ready to use!**

Start the backend, start the frontend, and begin tracking your finances! 💰📊

---

**Quick Start**: Follow SETUP_GUIDE.md → Configure Google OAuth → Run and enjoy! ✨
