# 💰 Money Manager

A full-stack cross-platform financial tracking application for Android, iOS, and Web.

## 📱 Features

- **Google OAuth Authentication** - Secure login with Google account
- **Dashboard** - View total assets with customizable Grid/Tiles/Table views
- **Entity Management** - Add, edit, and delete financial entities (stocks, mutual funds, FD, savings, etc.)
- **Visual Analytics** - Bar charts for monthly tracking and pie charts for asset/risk distribution
- **Customizable Settings** - Theme, display options, and view preferences
- **Real-time Sync** - All pages update automatically when data changes
- **Cross-Platform** - Works on Android, iOS, and Web

## 🏗️ Tech Stack

### Backend
- .NET Core 8.0
- Entity Framework Core
- SQL Server
- JWT Authentication
- Google OAuth 2.0

### Frontend
- React Native (Expo)
- React Navigation
- React Native Chart Kit
- AsyncStorage
- Axios

## 📁 Project Structure

```
MoneyManager/
├── Backend/              # .NET Core API
│   ├── Controllers/      # API endpoints
│   ├── Services/         # Business logic
│   ├── Models/           # Database entities
│   ├── DTOs/             # Data transfer objects
│   └── Data/             # Database context
├── Frontend/             # React Native app
│   ├── src/
│   │   ├── screens/      # App screens
│   │   ├── navigation/   # Navigation setup
│   │   ├── services/     # API integration
│   │   └── utils/        # Utilities & theme
│   └── App.js            # Entry point
├── Documentation/        # Comprehensive docs
└── Prompts/             # Requirements spec
```

## 🚀 Quick Start

### Prerequisites
- .NET 8.0 SDK
- Node.js 18+
- SQL Server (LocalDB or Express)
- Expo CLI

### Backend Setup
```bash
cd Backend
dotnet restore
dotnet ef database update
dotnet run
```
API runs at: `https://localhost:5001`

### Frontend Setup
```bash
cd Frontend
npm install
npm run web    # For web
npm run android # For Android
npm run ios     # For iOS
```

### Google OAuth Setup
1. Create project at https://console.cloud.google.com/
2. Enable Google+ API
3. Create OAuth credentials
4. Update client IDs in:
   - `Backend/appsettings.json`
   - `Frontend/app.json`
   - `Frontend/src/screens/LoginScreen.js`

See **[SETUP_GUIDE.md](SETUP_GUIDE.md)** for detailed instructions.

## 📚 Documentation

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete setup instructions
- **[Documentation/README.md](Documentation/README.md)** - Full documentation
- **[Documentation/DEVELOPER_GUIDE.md](Documentation/DEVELOPER_GUIDE.md)** - Development guide
- **[Prompts/APPLICATION_PROMPT.md](Prompts/APPLICATION_PROMPT.md)** - Requirements & specifications

## 🌐 Deployment

Deploy your Money Manager app to the cloud and access it from anywhere - **100% FREE**!

### Quick Start
1. Run `.\deploy-setup.ps1` to prepare your project
2. Follow **[QUICK_DEPLOY.md](QUICK_DEPLOY.md)** for fast deployment (~20 mins)
3. Access your app from anywhere with the public URL

### Documentation
- **[DEPLOY_README.md](DEPLOY_README.md)** - Deployment overview and getting started
- **[QUICK_DEPLOY.md](QUICK_DEPLOY.md)** - ⚡ Fast deployment guide (20 minutes)
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - 📖 Comprehensive deployment documentation
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Step-by-step checklist

### Hosting Services (All Free)
- **Frontend**: Netlify (100 GB bandwidth/month)
- **Backend**: Render.com (750 hours/month)
- **Database**: Azure SQL (250 GB storage) or keep local for testing

### What You Get
✅ Access from anywhere (phone, tablet, computer)
✅ Automatic HTTPS/SSL security
✅ Professional public URL
✅ Auto-deployment on code changes
✅ $0.00 cost - completely free!

## 🎯 Key Features Detail

### Dashboard
- Total amount in large, bold display
- Asset breakdown in Grid, Tiles, or Table format
- Shows entity name, amount, percentage, investment type
- Configurable display options

### Entities Management
- Beautiful card layout
- Add/Edit/Delete entities
- Investment type: Invested or Liquid
- Risk category: Low, Moderate, or High
- Uppercase entity names
- Color-coded badges

### Charts & Analytics
- **Monthly Bar Chart**: Track money over months with editable data table
- **Asset Pie Chart**: Portfolio distribution by entity
- **Risk Pie Chart**: Portfolio distribution by risk level
- All percentages to 2 decimal places

### Settings
- User profile with photo/initials
- View type selection (Grid/Tiles/Table)
- Display toggles for dashboard elements
- Theme selection (Light/Dark)
- Color scheme configuration

## 🔐 Security

- JWT-based authentication
- Secure Google OAuth 2.0
- HTTPS for API communication
- Input validation and sanitization
- SQL injection prevention

## 📱 Platform Support

- ✅ Web (responsive design)
- ✅ Android (native app)
- ✅ iOS (native app)

## 🎨 Design Highlights

- Clean, modern interface
- Smooth animations
- Color-coded risk categories
- Responsive layouts
- Touch-optimized controls
- Fully visible bottom navigation

## 🔄 Data Flow

All pages sync automatically:
1. Add entity on Entities page
2. Dashboard updates total and breakdown
3. Charts update with new data
4. Settings apply across all pages

## 📊 API Endpoints

- `/api/auth/google-login` - Google OAuth login
- `/api/dashboard` - Get dashboard data
- `/api/entities` - CRUD operations for entities
- `/api/charts` - Chart data and monthly entries
- `/api/settings` - User preferences

Full API documentation at: `https://localhost:5001/swagger`

## 🛠️ Development

### Backend
```bash
dotnet watch run  # Auto-reload on changes
dotnet ef migrations add MigrationName
dotnet ef database update
```

### Frontend
```bash
expo start -c     # Clear cache
npm install <package>
```

## 🐛 Troubleshooting

See **[SETUP_GUIDE.md](SETUP_GUIDE.md#troubleshooting)** for common issues and solutions.

## 📦 Dependencies

### Backend
- Microsoft.AspNetCore.Authentication.JwtBearer
- Microsoft.EntityFrameworkCore.SqlServer
- Google.Apis.Auth
- Swashbuckle.AspNetCore (Swagger)

### Frontend
- expo
- react-navigation
- react-native-chart-kit
- axios
- @react-native-async-storage/async-storage

## 🚢 Production Deployment

### Recommended Stack
- **Backend API**: Render.com (.NET hosting)
- **Frontend Web**: Netlify (static hosting)
- **Database**: Azure SQL Database or PostgreSQL
- **All FREE tiers available**

### Alternative Options
- Backend: Azure App Service, AWS Elastic Beanstalk, Railway
- Frontend: Vercel, GitHub Pages, Cloudflare Pages
- Mobile: Expo build service → App Stores

See **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** for complete instructions.

## 📝 License

© 2024 Money Manager. All rights reserved.

## 👨‍💻 Developer

Built as a comprehensive financial tracking solution with professional code structure and modern best practices.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 📧 Support

For issues and questions, refer to the documentation or create an issue in the repository.

---

**Start tracking your wealth today!** 💰📈
