# 📁 Money Manager - Complete File Structure

## Project Directory Tree

```
C:\MoneyManager\
│
├── 📄 README.md                          # Project overview and quick start
├── 📄 PROJECT_SUMMARY.md                 # Complete project summary
├── 📄 SETUP_GUIDE.md                     # Detailed setup instructions
├── 📄 .gitignore                         # Git ignore patterns
│
├── 📁 Backend\                           # .NET Core API (25 files)
│   ├── 📄 Program.cs                     # Application entry point & configuration
│   ├── 📄 MoneyManager.API.csproj        # Project file with dependencies
│   ├── 📄 appsettings.json               # Configuration (DB, JWT, Google OAuth)
│   │
│   ├── 📁 Controllers\                   # API Endpoints (5 files)
│   │   ├── 📄 AuthController.cs          # Login, token verification
│   │   ├── 📄 DashboardController.cs     # Dashboard data
│   │   ├── 📄 EntitiesController.cs      # Entity CRUD operations
│   │   ├── 📄 ChartsController.cs        # Chart data, monthly entries
│   │   └── 📄 SettingsController.cs      # User settings management
│   │
│   ├── 📁 Services\                      # Business Logic (10 files)
│   │   ├── 📄 IAuthService.cs            # Auth service interface
│   │   ├── 📄 AuthService.cs             # Google OAuth, JWT generation
│   │   ├── 📄 IEntityService.cs          # Entity service interface
│   │   ├── 📄 EntityService.cs           # Entity operations, percentage calc
│   │   ├── 📄 IDashboardService.cs       # Dashboard service interface
│   │   ├── 📄 DashboardService.cs        # Dashboard data aggregation
│   │   ├── 📄 IChartService.cs           # Chart service interface
│   │   ├── 📄 ChartService.cs            # Chart data, color generation
│   │   ├── 📄 ISettingsService.cs        # Settings service interface
│   │   └── 📄 SettingsService.cs         # User preferences management
│   │
│   ├── 📁 Models\                        # Database Entities (4 files)
│   │   ├── 📄 User.cs                    # User model (email, name, photo, etc.)
│   │   ├── 📄 Entity.cs                  # Financial entity (name, amount, type)
│   │   ├── 📄 MonthlyEntry.cs            # Monthly tracking data
│   │   └── 📄 UserSettings.cs            # User preferences (view, theme, etc.)
│   │
│   ├── 📁 DTOs\                          # Data Transfer Objects (5 files)
│   │   ├── 📄 AuthDtos.cs                # Login request/response
│   │   ├── 📄 EntityDtos.cs              # Entity DTOs for API
│   │   ├── 📄 DashboardDtos.cs           # Dashboard response structure
│   │   ├── 📄 ChartDtos.cs               # Chart data structures
│   │   └── 📄 SettingsDtos.cs            # Settings request/response
│   │
│   └── 📁 Data\                          # Database Context (1 file)
│       └── 📄 ApplicationDbContext.cs    # EF Core configuration, relationships
│
├── 📁 Frontend\                          # React Native App (15+ files)
│   ├── 📄 App.js                         # Root component, navigation setup
│   ├── 📄 package.json                   # Node dependencies
│   ├── 📄 app.json                       # Expo configuration
│   ├── 📄 babel.config.js                # Babel configuration
│   │
│   ├── 📁 src\
│   │   │
│   │   ├── 📁 screens\                   # App Screens (5 files)
│   │   │   ├── 📄 LoginScreen.js         # Google OAuth login UI
│   │   │   ├── 📄 DashboardScreen.js     # Total amount, asset breakdown (Grid/Tiles/Table)
│   │   │   ├── 📄 EntitiesScreen.js      # Entity list, add/edit/delete
│   │   │   ├── 📄 ChartsScreen.js        # Bar chart, pie charts, data table
│   │   │   └── 📄 SettingsScreen.js      # User profile, preferences
│   │   │
│   │   ├── 📁 navigation\                # Navigation Setup (1 file)
│   │   │   └── 📄 MainTabNavigator.js    # Bottom tab navigation configuration
│   │   │
│   │   ├── 📁 services\                  # API Integration (1 file)
│   │   │   └── 📄 api.js                 # Axios setup, all API calls
│   │   │
│   │   └── 📁 utils\                     # Utilities (2 files)
│   │       ├── 📄 storage.js             # AsyncStorage helpers (token, user)
│   │       └── 📄 theme.js               # Colors, sizes, fonts
│   │
│   └── 📁 assets\                        # Images, icons (create as needed)
│       ├── 🖼️ icon.png                   # App icon
│       ├── 🖼️ splash.png                 # Splash screen
│       └── 🖼️ favicon.png                # Web favicon
│
├── 📁 Documentation\                     # Comprehensive Docs (2 files)
│   ├── 📄 README.md                      # Complete feature documentation
│   │                                       - Features overview
│   │                                       - Setup instructions
│   │                                       - API endpoints reference
│   │                                       - Database schema
│   │                                       - Troubleshooting guide
│   │
│   └── 📄 DEVELOPER_GUIDE.md             # Development guide
│                                           - Environment setup
│                                           - Code style guide
│                                           - Architecture details
│                                           - Testing approaches
│                                           - Deployment instructions
│
└── 📁 Prompts\                           # Specifications (1 file)
    └── 📄 APPLICATION_PROMPT.md          # Complete requirements document
                                            - All features detailed
                                            - Page-by-page specifications
                                            - Technical requirements
                                            - Acceptance criteria
```

---

## 📊 File Count by Type

### Backend (C#)
- Controllers: **5 files**
- Services: **10 files** (5 interfaces + 5 implementations)
- Models: **4 files**
- DTOs: **5 files**
- Data: **1 file**
- Configuration: **2 files**
- **Total Backend: 27 files**

### Frontend (JavaScript/React Native)
- Screens: **5 files**
- Navigation: **1 file**
- Services: **1 file**
- Utils: **2 files**
- Configuration: **3 files**
- Root: **1 file**
- **Total Frontend: 13 files**

### Documentation
- **5 comprehensive documents**
- **50+ pages of documentation**

### **Grand Total: 45+ files created**

---

## 🎯 Key Files to Start With

### For Running the App:
1. `SETUP_GUIDE.md` - Follow this first
2. `Backend/appsettings.json` - Configure DB & Google OAuth
3. `Frontend/src/services/api.js` - Set API URL
4. `Backend/Program.cs` - Start backend server
5. `Frontend/App.js` - Start frontend app

### For Understanding the Code:
1. `PROJECT_SUMMARY.md` - Complete overview
2. `Documentation/README.md` - Feature details
3. `Documentation/DEVELOPER_GUIDE.md` - Code architecture
4. `Prompts/APPLICATION_PROMPT.md` - Requirements

### For Development:
1. `Backend/Controllers/*` - API endpoints
2. `Backend/Services/*` - Business logic
3. `Frontend/src/screens/*` - UI components
4. `Frontend/src/services/api.js` - API integration

---

## 📱 App Flow (Navigation)

```
App.js
  │
  ├─ Login Screen (Not authenticated)
  │
  └─ Main Tab Navigator (Authenticated)
      │
      ├─ Tab 1: Dashboard Screen
      │   └─ Shows: Total amount, asset breakdown
      │
      ├─ Tab 2: Entities Screen
      │   └─ Shows: Entity list, add/edit/delete
      │
      ├─ Tab 3: Charts Screen
      │   └─ Shows: Bar chart, 2 pie charts, data table
      │
      └─ Tab 4: Settings Screen
          └─ Shows: Profile, preferences, logout
```

---

## 🗄️ Database Schema

```
Users
├── Id (PK)
├── Email (Unique)
├── Name
├── ProfilePhotoUrl
├── GoogleId (Unique)
├── CreatedAt
└── LastLoginAt
    │
    ├── Has Many: Entities (UserId FK)
    │   ├── Id (PK)
    │   ├── UserId (FK)
    │   ├── Name
    │   ├── Amount
    │   ├── InvestmentType
    │   ├── RiskCategory
    │   ├── CreatedAt
    │   └── UpdatedAt
    │
    ├── Has Many: MonthlyEntries (UserId FK)
    │   ├── Id (PK)
    │   ├── UserId (FK)
    │   ├── MonthName
    │   ├── Amount
    │   ├── Year
    │   ├── Month
    │   ├── CreatedAt
    │   └── UpdatedAt
    │
    └── Has One: UserSettings (UserId FK)
        ├── Id (PK)
        ├── UserId (FK)
        ├── DashboardViewType
        ├── Theme
        ├── ShowAmount
        ├── ShowPercentage
        ├── ShowEntityName
        ├── ShowInvestmentType
        ├── DashboardColorScheme
        ├── CreatedAt
        └── UpdatedAt
```

---

## 🔗 API Endpoints Reference

### Authentication
```
POST   /api/auth/google-login    # Login with Google
GET    /api/auth/verify           # Verify JWT token
```

### Dashboard
```
GET    /api/dashboard             # Get dashboard data
```

### Entities
```
GET    /api/entities              # Get all entities
GET    /api/entities/{id}         # Get entity by ID
POST   /api/entities              # Create entity
PUT    /api/entities/{id}         # Update entity
DELETE /api/entities/{id}         # Delete entity
```

### Charts
```
GET    /api/charts                # Get all chart data
GET    /api/charts/monthly        # Get monthly entries
POST   /api/charts/monthly        # Create monthly entry
PUT    /api/charts/monthly/{id}   # Update monthly entry
DELETE /api/charts/monthly/{id}   # Delete monthly entry
```

### Settings
```
GET    /api/settings              # Get user settings
PUT    /api/settings              # Update settings
```

---

## 🎨 Component Hierarchy

### Dashboard Screen
```
DashboardScreen
├── Header
│   ├── Title
│   └── User Profile Photo/Initials
├── Total Amount Card
└── Asset Breakdown Section
    ├── Grid View (2 columns)
    ├── Tiles View (full width cards)
    └── Table View (tabular format)
```

### Entities Screen
```
EntitiesScreen
├── Header with Add Button
├── Entity List (FlatList)
│   └── Entity Card
│       ├── Name (uppercase)
│       ├── Amount
│       ├── Percentage
│       ├── Type Badge
│       ├── Risk Badge
│       └── Action Buttons (Edit/Delete)
└── Modal (Add/Edit Form)
    ├── Name Input
    ├── Amount Input
    ├── Investment Type Selector
    ├── Risk Category Selector
    └── Submit Button
```

### Charts Screen
```
ChartsScreen
├── Header
├── Monthly Tracking Section
│   ├── Add Button
│   ├── Bar Chart
│   └── Data Table
│       └── Table Row (Month, Amount, Edit, Delete)
├── Asset Distribution Section
│   └── Pie Chart with Legend
└── Risk Distribution Section
    └── Pie Chart with Legend
```

### Settings Screen
```
SettingsScreen
├── Header
├── Profile Section
│   ├── Photo/Initials
│   ├── Name
│   └── Email
├── Dashboard Display Section
│   └── View Type Buttons (Grid/Tiles/Table)
├── Display Options Section
│   ├── Show Amount Toggle
│   ├── Show Percentage Toggle
│   ├── Show Entity Name Toggle
│   └── Show Investment Type Toggle
├── Theme Section
│   └── Light/Dark Buttons
├── Color Scheme Section
│   └── Color Buttons
└── Logout Button
```

---

## 📦 Dependencies Summary

### Backend NuGet Packages
```xml
<PackageReference Include="Google.Apis.Auth" Version="1.64.0" />
<PackageReference Include="Microsoft.AspNetCore.Authentication.Google" Version="8.0.0" />
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="8.0.0" />
<PackageReference Include="Microsoft.EntityFrameworkCore" Version="8.0.0" />
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="8.0.0" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="8.0.0" />
<PackageReference Include="Swashbuckle.AspNetCore" Version="6.5.0" />
<PackageReference Include="System.IdentityModel.Tokens.Jwt" Version="7.0.0" />
```

### Frontend NPM Packages
```json
"expo": "~50.0.0"
"react": "18.2.0"
"react-native": "0.73.0"
"@react-navigation/native": "^6.1.9"
"@react-navigation/bottom-tabs": "^6.5.11"
"react-native-chart-kit": "^6.12.0"
"axios": "^1.6.0"
"expo-auth-session": "~5.4.0"
"@react-native-async-storage/async-storage": "1.21.0"
```

---

## 🚀 Quick Commands Reference

### Backend Commands
```powershell
cd C:\MoneyManager\Backend

# Restore packages
dotnet restore

# Run migrations
dotnet ef database update

# Start server
dotnet run

# Watch mode (auto-reload)
dotnet watch run

# Build for production
dotnet publish -c Release
```

### Frontend Commands
```powershell
cd C:\MoneyManager\Frontend

# Install dependencies
npm install

# Start development server
npm start

# Run on web
npm run web

# Run on Android
npm run android

# Run on iOS
npm run ios

# Clear cache
expo start -c
```

---

## 📚 Documentation Reading Order

1. **Start Here**: `PROJECT_SUMMARY.md` - Overview of everything created
2. **Setup**: `SETUP_GUIDE.md` - Step-by-step setup instructions
3. **Features**: `Documentation/README.md` - All features explained
4. **Development**: `Documentation/DEVELOPER_GUIDE.md` - For developers
5. **Requirements**: `Prompts/APPLICATION_PROMPT.md` - Original specifications

---

## ✅ Verification Checklist

Use this to verify your setup:

```
Backend:
[ ] dotnet restore completes successfully
[ ] Database migrations run without errors
[ ] Backend starts on https://localhost:5001
[ ] Swagger UI loads at /swagger

Frontend:
[ ] npm install completes successfully
[ ] No package errors
[ ] App starts on http://localhost:19006
[ ] Google OAuth is configured

Features:
[ ] Login with Google works
[ ] Dashboard shows total amount
[ ] Can add/edit/delete entities
[ ] Charts render properly
[ ] Settings persist
[ ] Bottom navigation fully visible
```

---

This structure provides a complete, professional Money Manager application ready for development, testing, and deployment! 🚀
