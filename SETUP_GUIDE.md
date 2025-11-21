# Money Manager - Quick Start Guide

## 🚀 Getting Started

This guide will help you get the Money Manager application up and running in under 30 minutes.

---

## Prerequisites Installation

### 1. Backend Requirements

#### Install .NET 8.0 SDK
- Download from: https://dotnet.microsoft.com/download/dotnet/8.0
- Verify installation:
  ```bash
  dotnet --version
  ```
  Should show: `8.0.x`

#### Install SQL Server
Choose one:
- **SQL Server Express** (Recommended for development): https://www.microsoft.com/sql-server/sql-server-downloads
- **SQL Server LocalDB** (Lightweight): Included with Visual Studio
- **Docker SQL Server**:
  ```bash
  docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourPassword123!" -p 1433:1433 -d mcr.microsoft.com/mssql/server:2022-latest
  ```

#### Install Visual Studio Code (Optional)
- Download from: https://code.visualstudio.com/
- Install C# extension

### 2. Frontend Requirements

#### Install Node.js
- Download from: https://nodejs.org/ (LTS version)
- Verify installation:
  ```bash
  node --version
  npm --version
  ```

#### Install Expo CLI
```bash
npm install -g expo-cli
```

#### Install Mobile Development Tools (Optional)

**For Android:**
- Download Android Studio: https://developer.android.com/studio
- Install Android SDK and emulator

**For iOS (Mac only):**
- Install Xcode from App Store
- Install Xcode Command Line Tools:
  ```bash
  xcode-select --install
  ```

---

## Project Setup

### Step 1: Navigate to Project Directory

```bash
cd C:\MoneyManager
```

### Step 2: Backend Setup

#### 1. Navigate to Backend
```bash
cd Backend
```

#### 2. Install Dependencies
```bash
dotnet restore
```

#### 3. Update Configuration
Open `appsettings.json` and update:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=MoneyManagerDb;Trusted_Connection=True;MultipleActiveResultSets=true"
  },
  "JwtSettings": {
    "SecretKey": "YourSuperSecretKeyForJWTTokenGeneration12345!",
    "Issuer": "MoneyManagerAPI",
    "Audience": "MoneyManagerClient",
    "ExpirationInMinutes": 1440
  },
  "Google": {
    "ClientId": "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
    "ClientSecret": "YOUR_GOOGLE_CLIENT_SECRET"
  }
}
```

#### 4. Create Database
```bash
dotnet ef database update
```

If you don't have EF tools installed:
```bash
dotnet tool install --global dotnet-ef
```

#### 5. Run Backend
```bash
dotnet run
```

Backend will start at: `https://localhost:5001`

Test it: Open browser to `https://localhost:5001/swagger`

### Step 3: Frontend Setup

#### 1. Open New Terminal and Navigate to Frontend
```bash
cd C:\MoneyManager\Frontend
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Update API Configuration
Open `src/services/api.js` and update the API_URL:

```javascript
const API_URL = 'https://localhost:5001/api'; // For local development
```

For mobile testing, use your computer's IP:
```javascript
const API_URL = 'http://192.168.1.XXX:5001/api'; // Replace with your IP
```

To find your IP:
- Windows: `ipconfig` (look for IPv4 Address)
- Mac/Linux: `ifconfig` or `ip addr`

#### 4. Start Frontend

**For Web:**
```bash
npm run web
```
Opens at: `http://localhost:19006`

**For Android:**
```bash
npm run android
```
Requires Android emulator or physical device

**For iOS (Mac only):**
```bash
npm run ios
```
Requires iOS simulator or physical device

---

## Google OAuth Setup

### 1. Create Google Cloud Project

1. Go to https://console.cloud.google.com/
2. Click "New Project"
3. Name it "Money Manager"
4. Click "Create"

### 2. Enable Google+ API

1. Go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click and enable it

### 3. Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Configure OAuth consent screen:
   - User Type: External
   - App name: Money Manager
   - User support email: Your email
   - Developer contact: Your email
   - Save and Continue

4. Create OAuth Client IDs for each platform:

**Web Application:**
- Name: Money Manager Web
- Authorized JavaScript origins:
  - `http://localhost:19006`
  - `http://localhost:19000`
- Authorized redirect URIs:
  - `http://localhost:19006`
- Save and copy Client ID

**Android:**
- Name: Money Manager Android
- Package name: `com.moneymanager.app`
- Get SHA-1 fingerprint:
  ```bash
  keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
  ```
- Save and copy Client ID

**iOS:**
- Name: Money Manager iOS
- Bundle ID: `com.moneymanager.app`
- Save and copy Client ID

### 4. Update Application with Client IDs

**Backend** (`appsettings.json`):
```json
"Google": {
  "ClientId": "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com",
  "ClientSecret": "YOUR_CLIENT_SECRET"
}
```

**Frontend** (`app.json`):
```json
"extra": {
  "googleClientId": "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com"
}
```

**Frontend** (`src/screens/LoginScreen.js`):
```javascript
const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
  clientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
  iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
  androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
  webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
});
```

---

## Testing the Application

### 1. Start Backend
```bash
cd C:\MoneyManager\Backend
dotnet run
```

### 2. Start Frontend
```bash
cd C:\MoneyManager\Frontend
npm run web
```

### 3. Test Login
1. Open `http://localhost:19006` in browser
2. Click "Sign in with Google"
3. Login with your Google account
4. You should be redirected to Dashboard

### 4. Test Features

**Dashboard:**
- Verify total amount shows (will be ₹0 initially)
- Check user profile photo/initials in top-left

**Entities:**
- Click "Entities" tab
- Tap "+" button
- Add an entity:
  - Name: STOCKS
  - Amount: 50000
  - Investment Type: Invested
  - Risk Category: High
- Verify it appears in list
- Add more entities for testing

**Charts:**
- Click "Charts" tab
- Add monthly entry with "+" icon
- Verify bar chart appears
- Check pie charts show your entities

**Settings:**
- Click "Settings" tab
- Try changing Dashboard View Type
- Toggle display options
- Go back to Dashboard to see changes

---

## Troubleshooting

### Backend Issues

**Error: Unable to connect to database**
- Check SQL Server is running
- Verify connection string in `appsettings.json`
- Try:
  ```bash
  dotnet ef database update
  ```

**Error: Port 5001 already in use**
- Change port in `launchSettings.json` under `Properties` folder
- Or kill the process:
  ```bash
  # Windows
  netstat -ano | findstr :5001
  taskkill /PID <process_id> /F
  
  # Mac/Linux
  lsof -ti:5001 | xargs kill
  ```

**Swagger not loading**
- Ensure you're using HTTPS: `https://localhost:5001/swagger`
- Accept the self-signed certificate in browser

### Frontend Issues

**Error: Unable to resolve module**
- Delete `node_modules` and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

**Error: Cannot connect to API**
- Check backend is running
- Verify API_URL in `src/services/api.js`
- For mobile, use your computer's IP address
- Disable firewall or allow port 5001

**Google Login not working**
- Verify Client IDs are correct
- Check OAuth consent screen is configured
- Ensure redirect URIs are added
- Try different browser or incognito mode

**Charts not displaying**
- Check if data exists (add entities first)
- Verify `react-native-chart-kit` and `react-native-svg` are installed
- Clear cache: `expo start -c`

**Bottom navigation cut off**
- Check `tabBarStyle` height in `MainTabNavigator.js`
- Adjust `paddingBottom` for your device

### Common Commands

**Clear Expo cache:**
```bash
expo start -c
```

**Restart backend:**
```bash
# Windows
Ctrl+C (in terminal)
dotnet run

# Mac/Linux
Cmd+C (in terminal)
dotnet run
```

**Reset database:**
```bash
dotnet ef database drop
dotnet ef database update
```

**Check backend logs:**
Look in the terminal where backend is running

**Check frontend logs:**
- Web: Browser console (F12)
- Mobile: Expo DevTools or React Native Debugger

---

## Development Tips

### Hot Reload
- Backend: Use `dotnet watch run` for auto-reload
- Frontend: Changes auto-reload (shake device for dev menu on mobile)

### Debugging
- Backend: Use Visual Studio or VS Code debugger
- Frontend: Use Chrome DevTools (web) or React Native Debugger (mobile)

### API Testing
- Use Swagger UI: `https://localhost:5001/swagger`
- Or use Postman/Insomnia for API testing

### Database Management
- Use SQL Server Management Studio (SSMS)
- Or Azure Data Studio (cross-platform)
- Or VS Code SQL Server extension

---

## Next Steps

### After Basic Setup
1. Customize theme colors in `src/utils/theme.js`
2. Add more entity types as needed
3. Configure production environment
4. Set up CI/CD pipeline

### For Production Deployment
1. **Backend:**
   - Deploy to Azure App Service, AWS, or IIS
   - Use production database (Azure SQL, AWS RDS)
   - Enable HTTPS
   - Configure CORS properly
   - Set up monitoring and logging

2. **Frontend:**
   - Build for production: `expo build`
   - Deploy web version to Netlify/Vercel
   - Submit mobile apps to stores:
     - Google Play Store (Android)
     - Apple App Store (iOS)

---

## Support Resources

### Documentation
- `/Documentation/README.md` - Full documentation
- `/Documentation/DEVELOPER_GUIDE.md` - Development guide
- `/Prompts/APPLICATION_PROMPT.md` - Requirements specification

### External Resources
- [.NET Documentation](https://docs.microsoft.com/dotnet/)
- [React Native Docs](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Entity Framework Core](https://docs.microsoft.com/ef/core/)

### Community Help
- Stack Overflow
- React Native Community
- .NET Community

---

## Congratulations! 🎉

You now have Money Manager running locally. Start adding your entities and tracking your finances!

**Quick Test Checklist:**
- [ ] Backend running on port 5001
- [ ] Frontend running on port 19006
- [ ] Google login works
- [ ] Can add/edit/delete entities
- [ ] Dashboard updates automatically
- [ ] Charts display correctly
- [ ] Settings persist
- [ ] Bottom navigation visible

Happy tracking! 💰📊
