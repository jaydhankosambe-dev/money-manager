# Logout Functionality Test Guide

## Overview
This guide will help you thoroughly test the logout functionality in the Money Manager app.

## Test Environment Setup

1. **Start Backend Server:**
   ```bash
   cd Backend
   dotnet run
   ```
   - Verify it's running on http://localhost:5000

2. **Start Frontend:**
   ```bash
   cd Frontend  
   npm start
   ```
   - Choose your preferred platform (web/mobile simulator)

## Test Scenarios

### Scenario 1: Settings Screen Logout (Primary Method)

**Steps:**
1. Login with valid credentials (username/password)
2. Navigate to **Settings** tab (last tab in bottom navigation)
3. **Scroll down** to the bottom of the settings page
4. Look for the **red logout button** with a log-out icon
5. Tap the logout button
6. Confirm "Logout" in the alert dialog

**Expected Result:**
- Alert appears asking "Are you sure you want to logout?"
- After confirming, user is immediately redirected to login screen
- Login screen shows username and password fields
- Console shows logout success messages

### Scenario 2: Sidebar Logout (Desktop Only)

**Steps (Desktop/Web only):**
1. Login and access the app on desktop/web
2. Look at the left sidebar
3. At the bottom of the sidebar, find the logout option
4. Click the logout button
5. Confirm logout in the dialog

**Expected Result:**
- Same as Scenario 1

## Debug Console Messages

Open Developer Tools (F12) and watch for these console messages:

### Successful Logout Flow:
```
🔵 Logout button pressed - showing confirmation dialog
✅ User confirmed logout - calling logout function
🚪 Starting logout process...
📱 Current auth state: {user: {...}, isAuthenticated: true, loading: false}
🗑️ AsyncStorage authentication data cleared
✅ Verification - Token exists: false User data exists: false
🔄 State updated: user=null, isAuthenticated=false, loading=false
🔑 Refresh key updated: 0 -> 1
✅ User logged out successfully - App should now show LoginScreen
🎉 Logout completed successfully - should redirect to login
🧭 AppNavigator render - isAuthenticated: false, loading: false, refreshKey: 1
🧭 Navigator key: unauthenticated-1
🧭 Will show: LoginScreen (unauthenticated)
📱 Rendering LoginScreen
```

## Troubleshooting

### Issue: Logout button not visible
**Solution:** 
- Scroll down in Settings screen - button is at the bottom
- On desktop, check sidebar for logout option

### Issue: Logout button doesn't respond
**Causes:**
- JavaScript errors (check console)
- Network issues (backend not running)
- TouchableOpacity not properly configured

**Debug Steps:**
1. Open Developer Tools console
2. Click logout button
3. Look for console messages starting with 🔵
4. If no messages appear, there's a touch event issue

### Issue: Logout succeeds but doesn't redirect
**Causes:**
- Navigation state not updating properly
- App.js authentication routing logic issue

**Debug Steps:**
1. Check console for 🧭 AppNavigator messages
2. Verify `isAuthenticated` changes to `false`
3. Check if LoginScreen is being rendered

### Issue: Login screen doesn't show username/password fields
**Solution:**
- Check LoginScreen.js for proper form elements
- Verify TextInput components are rendered
- Check if any styling is hiding the fields

## Expected Login Screen Elements

The login screen should have:
- Username input field (minimum 4 characters)
- Password input field (with show/hide toggle)
- Login button
- Clear button
- Register button (opens registration modal)

## Manual Verification Steps

1. **Complete Logout Test:**
   - Login → Settings → Logout → Confirm → Back to Login

2. **Re-login Test:**
   - After logout, enter credentials and login again
   - Verify you're back to the main app

3. **Data Persistence Test:**
   - Login → Add some data → Logout → Login again
   - Verify data is still there (logout should only clear auth, not data)

## Common Issues & Solutions

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| No logout button | Not scrolled down | Scroll to bottom of Settings |
| Button doesn't work | JavaScript error | Check console for errors |
| Doesn't redirect | Navigation issue | Check App.js authentication logic |
| Blank login screen | Component error | Check LoginScreen.js for errors |

## Success Criteria

✅ Logout button is visible and clickable
✅ Confirmation dialog appears
✅ User is redirected to login screen immediately after confirming
✅ Login screen shows username and password fields
✅ User can login again successfully
✅ No console errors during the process
✅ AsyncStorage is properly cleared (auth data only)

## Notes

- The logout process should be immediate (no loading states)
- Only authentication data is cleared, user data persists
- Console messages help track the entire logout flow
- Both mobile and desktop interfaces have logout options