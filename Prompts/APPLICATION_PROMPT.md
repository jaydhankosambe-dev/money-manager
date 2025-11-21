# Money Manager - Application Requirements and Specifications

## Application Name
**Money Manager**

## Platform Support
- Android (Mobile App)
- iOS (Mobile App)
- Web (Browser-based)

## Purpose
A comprehensive personal finance tracking application that helps users monitor their investments, savings, and assets across different categories with visual analytics and customizable views.

---

## User Authentication

### Login Page
- **Method**: Google OAuth 2.0 authentication only
- **Features**:
  - Clean, minimalist login interface
  - "Sign in with Google" button
  - Automatic user profile creation on first login
  - User profile photo display (from Google account)
  - Fallback to name initials if no photo available
  - Profile photo/initials displayed in top-left corner on all pages after login

---

## Page 1: Dashboard

### Primary Display
- **Total Amount**:
  - Displayed at the top of the page
  - Bold, large font size (36-40px recommended)
  - Highlighted with distinct background color
  - Shows sum of all entity amounts

### Asset Breakdown Section
- **Display Components** (per entity):
  - Entity name (in UPPERCASE letters)
  - Amount (with currency symbol ₹)
  - Percentage of total portfolio
  - Investment type (Invested or Liquid)
  - ~~Risk category (Low, Moderate, High)~~ [REMOVED per requirements]

- **View Options** (Configurable in Settings):
  - **Grid View**: 2-column card layout
  - **Tiles View**: Full-width stacked cards
  - **Table View**: Traditional row/column format

- **Data Synchronization**:
  - Automatically updates when entities are added/edited/deleted on Page 2
  - Real-time percentage recalculation
  - Refresh on page focus

---

## Page 2: Entities Management

### Entity List View
- Display all entities with:
  - Entity name (UPPERCASE)
  - Amount
  - Percentage of total
  - Investment type badge
  - Risk category badge (color-coded)
- Beautiful card layout with proper spacing
- Edit and Delete icons for each entity
- Smooth animations and transitions

### Add New Entity
- **Button**: Floating action button (FAB) or top-right "+" icon
- **Required Fields**:
  - Entity name (text input)
  - Amount (numeric input)
  - Investment type (dropdown/selector: Invested, Liquid)
  - Risk category (dropdown/selector: Low, Moderate, High)
- **Actions**:
  - Submit button to save
  - Cancel button to dismiss
  - Input validation before saving

### Edit Entity
- Same fields as add entity
- Pre-populated with existing values
- Update button to save changes
- Delete option available

### Delete Entity
- Confirmation dialog before deletion
- Warning about data loss
- Cascade updates to all other pages

### Data Display
- Proper formatting with CSS styling
- Color-coded risk categories
- Investment type badges
- Responsive card design
- Empty state message when no entities exist

---

## Page 3: Charts and Analytics

### 3a. Monthly Tracking (Bar Chart)
- **Purpose**: Track total money over different months
- **Features**:
  - Vertical bar chart showing amounts per month
  - X-axis: Month names (Jan, Feb, Mar, etc.)
  - Y-axis: Amount values
  - Last 6-12 months visible
  - Horizontal scroll for more data
- **Add New Entry**:
  - Plus (+) icon button above chart
  - Modal/form to add:
    - Month name (e.g., "Jan 2024")
    - Amount
  - Validation to prevent duplicate months
- **Data Table Below Chart**:
  - Grid/table format showing:
    - Month name
    - Amount
    - Edit button (pencil icon)
    - Delete button (trash icon)
  - Sort by date (newest first)
  - Edit previous month amounts
  - Delete invalid entries with confirmation

### 3b. Asset Distribution (Pie Chart)
- **Purpose**: Visualize portfolio composition by entity
- **Data Source**: All entities from Page 2
- **Display**:
  - Pie chart with color-coded segments
  - Legend showing:
    - Entity name
    - Percentage (to 2 decimal places)
    - Color indicator
  - Interactive segments (tap to highlight)
  - Total always equals 100%

### 3c. Risk Distribution (Pie Chart)
- **Purpose**: Visualize portfolio risk breakdown
- **Calculation**: Sum of amounts grouped by risk category
- **Display**:
  - Three segments: Low, Moderate, High
  - Percentage of total for each category (2 decimal places)
  - Color coding:
    - Low: Green
    - Moderate: Yellow/Amber
    - High: Red
  - Legend with percentages

### Chart Issues Resolution
- Ensure react-native-chart-kit is properly installed
- Add react-native-svg dependency
- Verify chart dimensions are set correctly
- Check data format matches library requirements
- Add error boundaries for chart rendering
- Display "No data" message when empty

---

## Page 4: Settings

### User Profile Section
- Display user profile photo or initials
- User name
- Email address
- Logout button

### Dashboard Configuration
- **View Type Selection**:
  - Radio buttons or segmented control
  - Options: Grid, Tiles, Table
  - Preview icon for each option
  - Applies to Page 1 asset breakdown

### Display Options (Toggle Switches)
- Show/Hide Amount
- Show/Hide Percentage
- Show/Hide Entity Name
- Show/Hide Investment Type
- Each toggle affects Dashboard display immediately

### Theme Settings
- Light mode
- Dark mode
- System default (follows device preference)

### Color Scheme Configuration
- Predefined color palettes for dashboard
- Options: Default, Blue, Green, Purple, Custom
- Color preview swatches
- Applies to charts and primary UI elements

### Additional Settings
- Currency selection (future enhancement)
- Data export options (future enhancement)
- App version information

---

## Bottom Navigation Bar

### Design Requirements
- Fixed at bottom of screen
- Always visible on all 4 main pages
- Height adjustment for better visibility
- Ensure labels are fully readable (not cut off)
- Icons + text labels for each tab

### Navigation Items
1. **Dashboard** (Home icon)
2. **Entities** (Wallet icon)
3. **Charts** (Bar chart icon)
4. **Settings** (Gear icon)

### Styling
- Active tab: Primary color with icon fill
- Inactive tabs: Gray color with icon outline
- Smooth transition animations
- Proper spacing and padding
- Platform-specific adjustments (iOS/Android/Web)

### Implementation Notes
- Use React Navigation Bottom Tabs
- Minimum height: 70px (Android), 90px (iOS with safe area)
- Label font size: 12-14px
- Icon size: 24px
- Add safe area handling for iOS
- Ensure touch targets are at least 44x44 points

---

## Technical Requirements

### Backend (.NET Core)
- RESTful API architecture
- JWT authentication
- Entity Framework Core for database
- SQL Server database
- CORS enabled for cross-platform access
- Proper error handling and logging
- Input validation and sanitization
- Swagger documentation

### Frontend (React Native / Expo)
- Cross-platform compatibility (iOS, Android, Web)
- Responsive design
- Touch-optimized UI
- Pull-to-refresh functionality
- Loading states and error handling
- Offline capability (future enhancement)
- Smooth animations and transitions

### Data Persistence
- Local storage for tokens and user data
- Server-side storage for all entities and settings
- Real-time synchronization
- Data backup and recovery (future enhancement)

### Performance
- Fast page load times (< 2 seconds)
- Smooth scrolling and animations (60 FPS)
- Optimized API calls (debouncing, caching)
- Efficient chart rendering
- Memory management

### Security
- Secure authentication (Google OAuth)
- JWT token management
- HTTPS for all API calls
- Input sanitization
- SQL injection prevention
- XSS protection

---

## User Experience Requirements

### Visual Design
- Clean, modern interface
- Consistent color scheme
- Proper spacing and padding
- Clear typography hierarchy
- Color-coded categories for quick recognition
- Accessible design (WCAG 2.1 AA)

### Interactions
- Intuitive navigation
- Clear call-to-action buttons
- Confirmation dialogs for destructive actions
- Success/error feedback messages
- Form validation with helpful error messages
- Smooth page transitions

### Responsiveness
- Adapts to different screen sizes
- Portrait and landscape orientations
- Touch-friendly buttons (min 44x44 points)
- Readable text sizes (min 14px body text)
- Proper keyboard handling for inputs

---

## Data Flow

### Adding New Entity (Page 2)
1. User taps "+" button
2. Form modal opens
3. User fills in entity details
4. API validates and saves data
5. Success message displayed
6. List refreshes with new entity
7. Dashboard (Page 1) updates automatically
8. Charts (Page 3) update automatically

### Updating Dashboard View (Settings → Dashboard)
1. User changes view type in Settings
2. API saves preference
3. User navigates to Dashboard
4. Dashboard renders in selected format (Grid/Tiles/Table)
5. Preference persists across sessions

### Monthly Entry Flow (Page 3)
1. User taps "+" icon on bar chart
2. Modal opens with month and amount fields
3. User enters data and submits
4. Chart updates with new bar
5. Data table below shows new entry
6. User can edit/delete from table

---

## Error Handling

### Network Errors
- Display user-friendly error messages
- Retry mechanism for failed requests
- Offline mode indicator
- Queue actions when offline (future)

### Validation Errors
- Real-time field validation
- Clear error messages next to fields
- Prevent form submission until valid
- Highlight invalid fields

### Authentication Errors
- Auto-redirect to login on token expiration
- Clear error message for login failures
- Secure token refresh mechanism

---

## Future Enhancements
- Multiple currency support
- Budget goals and alerts
- Recurring transactions
- Transaction history timeline
- Export data (PDF, Excel)
- Data backup to cloud
- Biometric authentication
- Push notifications for updates
- Collaborative accounts (family/shared)
- Investment performance tracking
- AI-powered insights and recommendations

---

## Success Criteria
- Successful Google OAuth login
- All CRUD operations work on entities
- Charts render correctly with data
- Settings persist and apply correctly
- Bottom navigation fully visible and functional
- Responsive on all platforms (iOS, Android, Web)
- Data synchronization across pages works seamlessly
- Professional UI with smooth animations
- No crashes or critical bugs
- Fast performance (< 2s page loads)

---

## Acceptance Testing Checklist

### Authentication
- [ ] Google login works
- [ ] Profile photo displays correctly
- [ ] Initials fallback works when no photo
- [ ] Logout clears session

### Dashboard
- [ ] Total amount displays correctly
- [ ] Grid view works
- [ ] Tiles view works
- [ ] Table view works
- [ ] All entity details visible per settings
- [ ] Updates when entities change

### Entities
- [ ] Can add new entity
- [ ] Can edit existing entity
- [ ] Can delete entity with confirmation
- [ ] List displays properly formatted
- [ ] Color coding works
- [ ] Empty state shows when no entities

### Charts
- [ ] Bar chart renders with data
- [ ] Can add monthly entry
- [ ] Can edit monthly entry
- [ ] Can delete monthly entry
- [ ] Data table shows below chart
- [ ] Asset pie chart renders
- [ ] Risk pie chart renders
- [ ] Percentages show 2 decimal places

### Settings
- [ ] Profile displays correctly
- [ ] Can change view type
- [ ] Display toggles work
- [ ] Theme selection works
- [ ] Color scheme applies
- [ ] Logout works

### Navigation
- [ ] Bottom tabs fully visible
- [ ] Labels readable
- [ ] Smooth transitions
- [ ] Active state highlights correctly
- [ ] Works on all platforms

---

## Developer Notes

### Entity Name Uppercase
All entity names must be converted to uppercase before display. Handle this in:
- Backend: `entity.Name.ToUpper()` in DTOs
- Frontend: `entity.name.toUpperCase()` or CSS `text-transform: uppercase`

### Percentage Calculation
- Always calculate as: `(entityAmount / totalAmount) * 100`
- Round to 2 decimal places: `Math.Round(percentage, 2)`
- Handle division by zero (show 0% when total is 0)

### Bottom Navigation Height
- iOS: 90px (includes safe area inset)
- Android: 70px
- Web: 70px
- Adjust in TabNavigator options:
  ```javascript
  tabBarStyle: {
    height: Platform.OS === 'ios' ? 90 : 70,
    paddingBottom: Platform.OS === 'ios' ? 25 : 12,
  }
  ```

### Color Usage
Use consistent colors throughout:
- Primary actions: Blue/Purple
- Success: Green
- Warning: Amber
- Error: Red
- Low risk: Green
- Moderate risk: Yellow
- High risk: Red
- Invested: Blue
- Liquid: Teal

This document serves as the complete specification for the Money Manager application.
