# Money Manager - Cross-Platform Web & Mobile Application

## Overview
Money Manager is a comprehensive financial tracking application built with .NET Core backend and React Native (Expo) frontend, supporting Android, iOS, and Web platforms.

## Features

### 1. Authentication
- Google OAuth 2.0 authentication
- JWT-based session management
- Automatic user profile creation with default settings
- Profile photo display with initials fallback

### 2. Dashboard (Page 1)
- **Total Amount Display**: Large, prominent display of total portfolio value
- **Asset Breakdown**: Configurable view in Grid, Tiles, or Table format
- **Entity Details**: Shows:
  - Entity name (uppercase)
  - Amount
  - Percentage of total
  - Investment type (Invested/Liquid)
  - Risk category (Low/Moderate/High)
- **Customizable Display**: Toggle visibility of different data points
- **Real-time Updates**: Automatically reflects changes from other pages

### 3. Entities Management (Page 2)
- **List View**: All entities with amount and percentage
- **Add Entity**: Create new entities with:
  - Name
  - Amount
  - Investment type
  - Risk category
- **Edit Entity**: Modify existing entity details
- **Delete Entity**: Remove entities with confirmation
- **Beautiful Card Layout**: Color-coded by risk and investment type

### 4. Charts & Analytics (Page 3)
- **Monthly Tracking Bar Chart**:
  - Add new monthly entries with plus icon
  - Visual bar chart showing last 6 months
  - Interactive data table below chart
  - Edit/delete previous months' data
- **Asset Distribution Pie Chart**:
  - Shows percentage distribution of all entities
  - Color-coded visualization
  - Percentage displayed to 2 decimal places
- **Risk Distribution Pie Chart**:
  - Categorizes portfolio by risk level
  - Sum of amounts per risk category
  - Visual percentage breakdown

### 5. Settings (Page 4)
- **User Profile**: Display with photo or initials
- **Dashboard View Configuration**:
  - Grid view
  - Tiles view
  - Table view
- **Display Toggles**:
  - Show/hide amount
  - Show/hide percentage
  - Show/hide entity name
  - Show/hide investment type
- **Theme Selection**: Light/Dark mode
- **Color Scheme**: Dashboard color customization
- **Logout**: Secure session termination

### 6. Bottom Navigation
- Fixed bottom navigation bar with proper height
- Icons with labels fully visible
- Smooth transitions between pages
- Active state highlighting

## Technology Stack

### Backend
- **Framework**: .NET Core 8.0
- **Authentication**: JWT Bearer tokens, Google OAuth
- **Database**: SQL Server with Entity Framework Core
- **API**: RESTful API with Swagger documentation
- **Architecture**: Service layer pattern with dependency injection

### Frontend
- **Framework**: React Native (Expo)
- **Navigation**: React Navigation with bottom tabs
- **Charts**: react-native-chart-kit
- **State Management**: React Hooks
- **Storage**: AsyncStorage for local data
- **UI Components**: Custom components with React Native Paper

## Project Structure

```
MoneyManager/
├── Backend/
│   ├── Controllers/
│   │   ├── AuthController.cs
│   │   ├── DashboardController.cs
│   │   ├── EntitiesController.cs
│   │   ├── ChartsController.cs
│   │   └── SettingsController.cs
│   ├── Services/
│   │   ├── AuthService.cs
│   │   ├── DashboardService.cs
│   │   ├── EntityService.cs
│   │   ├── ChartService.cs
│   │   └── SettingsService.cs
│   ├── Models/
│   │   ├── User.cs
│   │   ├── Entity.cs
│   │   ├── MonthlyEntry.cs
│   │   └── UserSettings.cs
│   ├── DTOs/
│   │   ├── AuthDtos.cs
│   │   ├── EntityDtos.cs
│   │   ├── DashboardDtos.cs
│   │   ├── ChartDtos.cs
│   │   └── SettingsDtos.cs
│   ├── Data/
│   │   └── ApplicationDbContext.cs
│   └── Program.cs
├── Frontend/
│   ├── src/
│   │   ├── screens/
│   │   │   ├── LoginScreen.js
│   │   │   ├── DashboardScreen.js
│   │   │   ├── EntitiesScreen.js
│   │   │   ├── ChartsScreen.js
│   │   │   └── SettingsScreen.js
│   │   ├── navigation/
│   │   │   └── MainTabNavigator.js
│   │   ├── services/
│   │   │   └── api.js
│   │   └── utils/
│   │       ├── storage.js
│   │       └── theme.js
│   └── App.js
├── Documentation/
└── Prompts/
```

## Setup Instructions

### Backend Setup

1. **Prerequisites**:
   - .NET 8.0 SDK
   - SQL Server (LocalDB or Express)
   - Visual Studio 2022 or VS Code

2. **Configuration**:
   ```bash
   cd Backend
   ```

3. **Update appsettings.json**:
   - Set your database connection string
   - Configure JWT secret key
   - Add Google OAuth credentials

4. **Database Migration**:
   ```bash
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```

5. **Run the API**:
   ```bash
   dotnet restore
   dotnet run
   ```
   API will be available at `https://localhost:5001`

### Frontend Setup

1. **Prerequisites**:
   - Node.js 18+ and npm
   - Expo CLI
   - Android Studio (for Android) or Xcode (for iOS)

2. **Installation**:
   ```bash
   cd Frontend
   npm install
   ```

3. **Configuration**:
   - Update `src/services/api.js` with your backend API URL
   - Configure Google OAuth client IDs in `app.json`

4. **Run the App**:
   ```bash
   # For web
   npm run web

   # For Android
   npm run android

   # For iOS
   npm run ios
   ```

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs
6. Copy client IDs to:
   - Backend: `appsettings.json`
   - Frontend: `app.json` and `LoginScreen.js`

## API Endpoints

### Authentication
- `POST /api/auth/google-login` - Login with Google
- `GET /api/auth/verify` - Verify JWT token

### Dashboard
- `GET /api/dashboard` - Get dashboard data

### Entities
- `GET /api/entities` - Get all entities
- `GET /api/entities/{id}` - Get entity by ID
- `POST /api/entities` - Create new entity
- `PUT /api/entities/{id}` - Update entity
- `DELETE /api/entities/{id}` - Delete entity

### Charts
- `GET /api/charts` - Get all chart data
- `GET /api/charts/monthly` - Get monthly entries
- `POST /api/charts/monthly` - Create monthly entry
- `PUT /api/charts/monthly/{id}` - Update monthly entry
- `DELETE /api/charts/monthly/{id}` - Delete monthly entry

### Settings
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update user settings

## Database Schema

### Users Table
- Id (PK)
- Email (Unique)
- Name
- ProfilePhotoUrl
- GoogleId (Unique)
- CreatedAt
- LastLoginAt

### Entities Table
- Id (PK)
- UserId (FK)
- Name
- Amount
- InvestmentType
- RiskCategory
- CreatedAt
- UpdatedAt

### MonthlyEntries Table
- Id (PK)
- UserId (FK)
- MonthName
- Amount
- Year
- Month
- CreatedAt
- UpdatedAt

### UserSettings Table
- Id (PK)
- UserId (FK)
- DashboardViewType
- Theme
- ShowAmount
- ShowPercentage
- ShowEntityName
- ShowInvestmentType
- DashboardColorScheme
- CreatedAt
- UpdatedAt

## Features Implementation Details

### Real-time Data Synchronization
- All pages refresh data when focused
- Changes in entities automatically update dashboard
- Percentages recalculated on every data change

### Responsive Design
- Adapts to different screen sizes
- Touch-optimized for mobile
- Mouse-friendly for web
- Platform-specific styling

### Data Validation
- Amount must be numeric
- Required field validation
- Duplicate prevention
- Error handling with user feedback

### Security
- JWT-based authentication
- Secure password storage (Google OAuth)
- Authorization checks on all endpoints
- CORS configuration for cross-origin requests

## Color Scheme
- **Primary**: Purple (#6200EE)
- **Secondary**: Teal (#03DAC6)
- **Success**: Green (#4CAF50)
- **Warning**: Amber (#FFC107)
- **Error**: Red (#B00020)
- **Chart Colors**: Vibrant palette for visual clarity

## User Experience
- Smooth animations and transitions
- Loading indicators for async operations
- Success/error toast messages
- Confirmation dialogs for destructive actions
- Pull-to-refresh functionality
- Empty state messaging

## Performance Optimization
- Lazy loading of data
- Efficient re-rendering with React hooks
- Database indexing on frequently queried fields
- API response caching where appropriate

## Future Enhancements
- Export data to PDF/Excel
- Budget goals and alerts
- Multi-currency support
- Transaction history
- Recurring entries
- Data backup and restore
- Biometric authentication
- Push notifications
- Social sharing features

## Troubleshooting

### Common Issues

1. **API Connection Failed**:
   - Check backend is running
   - Verify API URL in frontend configuration
   - Check CORS settings

2. **Google Login Not Working**:
   - Verify OAuth credentials
   - Check redirect URIs
   - Ensure Google+ API is enabled

3. **Database Errors**:
   - Run migrations
   - Check connection string
   - Verify SQL Server is running

4. **Charts Not Displaying**:
   - Ensure data exists
   - Check chart library installation
   - Verify chart dimensions

## Support
For issues and questions, please refer to the project documentation or contact the development team.

## License
© 2024 Money Manager. All rights reserved.
