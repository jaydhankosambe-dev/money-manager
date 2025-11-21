# Money Manager Application

## Overview
Money Manager is a comprehensive financial management application built with React Native (Expo) for the frontend and .NET 7 Web API for the backend. The application helps users track their assets, investments, and financial goals with detailed analytics and reporting.

## Technology Stack

### Frontend
- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Tab Navigator, Stack Navigator)
- **State Management**: React Context API (Theme, Sidebar)
- **UI Components**: Custom components with React Native StyleSheet
- **Charts**: react-native-chart-kit, react-native-svg
- **Storage**: @react-native-async-storage/async-storage
- **HTTP Client**: Axios

### Backend
- **Framework**: .NET 7 Web API
- **Database**: SQL Server (LocalDB & Docker Container)
- **ORM**: Entity Framework Core

## Application Structure

### Frontend Architecture
```
src/
├── components/
│   ├── ErrorBoundary.js       # Error handling wrapper
│   └── Sidebar.js              # Desktop navigation sidebar
├── contexts/
│   └── SidebarContext.js       # Global sidebar state management
├── context/
│   └── ThemeContext.js         # Theme provider (light/dark mode)
├── navigation/
│   └── MainTabNavigator.js     # Bottom tab navigation
├── screens/
│   ├── DashboardScreen.js      # Main dashboard with financial summary
│   ├── EntitiesScreen.js       # Asset management (renamed from Entities to Assets)
│   ├── TrackerScreen.js        # Monthly financial tracking
│   ├── ChartsScreen.js         # Visual analytics with charts
│   └── SettingsScreen.js       # User preferences and theme settings
├── services/
│   └── api.js                  # API client with axios
└── utils/
    ├── storage.js              # AsyncStorage helpers
    └── useAppTheme.js          # Theme hook
```

### Key Features

#### 1. Dashboard
- Total asset amount display with Indian currency formatting (e.g., 11,22,33,000)
- Six financial panels with color-coded amounts:
  - Total Amount (primary color)
  - Invested (green)
  - Liquid (blue)
  - Low Risk (light green)
  - Moderate Risk (orange)
  - High Risk (red)
- Percentage distribution calculations
- Refresh functionality

#### 2. Assets Management
- Multiple view modes: Grid, Tiles, Panel (configurable in Settings)
- CRUD operations: Create, Read, Update, Delete
- Asset properties:
  - Name (displayed as user entered)
  - Amount (with Indian currency formatting)
  - Investment Type (Invested/Liquid)
  - Risk Category (Low/Moderate/High)
- Search and sort functionality
- Percentage calculations

#### 3. Monthly Tracker
- Add monthly financial entries
- Month/Year selection with dropdowns
- Bar chart visualization
- Edit and delete entries
- Monthly trends display

#### 4. Charts & Analytics
- Investment Type Distribution (Doughnut Chart)
- Risk Category Distribution (Doughnut Chart)
- Individual Asset Distribution (Doughnut Chart)
- Custom legend with percentages
- Color-coded visualization

#### 5. Settings
- Theme switcher (Light/Dark mode)
- Dashboard view mode selection (Grid/Tiles/Panel)
- User profile display
- Persistent settings storage

#### 6. Sidebar Navigation (Desktop)
- Collapsible/Expandable functionality
- State persists across page navigation
- Stored in AsyncStorage
- Only toggles via arrow button
- Page icons maintain collapse state

## UI/UX Specifications

### Header Styling
All page headers maintain consistent styling:
- `paddingTop: 21px`
- `paddingBottom: 35px`
- `alignItems: flex-start` (for baseline alignment)
- Border bottom line for visual separation

### Currency Formatting
Indian numbering system (lakhs/crores):
- Example: 12345678 → 1,23,45,678
- Format: Two commas after last three digits

### Color Scheme
**Light Theme:**
- Primary: #007AFF
- Background: #FFFFFF
- Surface: #F8F9FA
- Text: #000000

**Dark Theme:**
- Primary: #0A84FF
- Background: #1C1C1E
- Surface: #2C2C2E
- Text: #FFFFFF

### Chart Colors
- Chart colors: #FF6384, #36A2EB, #FFCE56, #4BC0C0, #9966FF, #FF9F40
- Risk Low: #4CAF50
- Risk Moderate: #FF9800
- Risk High: #F44336

## API Endpoints

### Dashboard
- `GET /api/dashboard` - Get dashboard summary

### Assets
- `GET /api/assets` - Get all assets
- `GET /api/assets/{id}` - Get asset by ID
- `POST /api/assets` - Create new asset
- `PUT /api/assets/{id}` - Update asset
- `DELETE /api/assets/{id}` - Delete asset

### Charts
- `GET /api/charts` - Get chart data
- `POST /api/charts/monthly` - Create monthly entry
- `PUT /api/charts/monthly/{id}` - Update monthly entry
- `DELETE /api/charts/monthly/{id}` - Delete monthly entry

### Settings
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update user settings

## Database Configuration

### LocalDB
Connection String: `(localdb)\\MSSQLLocalDB`
Database: `MoneyManagerDB`

### Docker Container
Host: `localhost,1433`
User: `sa`
Password: `MoneyManager@2024`
Database: `MoneyManagerDb`

### Tables
1. **Entities** - Stores asset information
2. **MonthlyEntries** - Monthly tracking data
3. **UserSettings** - User preferences
4. **Users** - User accounts

## Setup Instructions

### Backend Setup
1. Navigate to Backend directory: `cd C:\MoneyManager\Backend`
2. Restore dependencies: `dotnet restore`
3. Build project: `dotnet build`
4. Run migrations: `dotnet ef database update`
5. Start server: `dotnet run`
6. Server runs on: `http://localhost:5000`

### Frontend Setup
1. Navigate to Frontend directory: `cd C:\MoneyManager\Frontend`
2. Install dependencies: `npm install`
3. Start Expo: `npm start`
4. App runs on: `http://localhost:8081`

### Required Dependencies
Frontend:
```json
{
  "@react-navigation/native": "latest",
  "@react-navigation/bottom-tabs": "latest",
  "@react-navigation/native-stack": "latest",
  "@react-native-async-storage/async-storage": "latest",
  "axios": "latest",
  "react-native-chart-kit": "latest",
  "react-native-svg": "latest",
  "expo": "latest"
}
```

## Recent Changes & Improvements

### Performance Optimizations
1. Removed all debug console.log statements
2. Implemented parallel API calls with Promise.all
3. Optimized re-renders with useMemo hooks
4. Removed unused code and comments
5. Cleaned up redundant useEffect dependencies

### UI/UX Improvements
1. Standardized header heights across all screens
2. Implemented persistent sidebar collapse state
3. Added Indian currency formatting throughout
4. Color-coded dashboard panels for better visualization
5. Aligned all page headers with sidebar header

### Code Quality
1. Removed commented-out code
2. Cleaned up console logs (kept only error logs)
3. Improved component structure
4. Better separation of concerns
5. Consistent naming conventions (Entities → Assets)

## Development Notes

### Responsive Design
- Desktop mode: Width > 768px (shows sidebar)
- Mobile mode: Width ≤ 768px (bottom tabs)

### State Management
- Theme: React Context (ThemeContext)
- Sidebar: React Context (SidebarContext)
- Settings: AsyncStorage + API
- Assets/Data: Component state with API sync

### Error Handling
- ErrorBoundary wrapper for crash prevention
- Try-catch blocks for all API calls
- User-friendly error messages via Alert
- Console.error for debugging errors only

## Future Enhancements
- User authentication and authorization
- Multiple user accounts
- Data export (PDF, Excel)
- Budget planning features
- Financial goal tracking
- Investment recommendations
- Notification system

## Version Information
- Frontend: React Native with Expo
- Backend: .NET 7
- Database: SQL Server
- Last Updated: November 2025

## License
Proprietary - All rights reserved
