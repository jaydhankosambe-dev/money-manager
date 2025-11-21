# Google OAuth Setup Guide for Money Manager

## Current Status
✅ Frontend configured with Google OAuth
✅ Backend API ready for Google authentication
✅ Login state persistence implemented (stays logged in)

## Google Cloud Console Setup

### Step 1: Create/Select Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown (top-left)
3. Click "New Project" or select existing project
4. Name: "Money Manager" (or your preferred name)
5. Click "Create"

### Step 2: Enable Google+ API
1. In the left sidebar, go to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click on it and click "Enable"

### Step 3: Create OAuth 2.0 Credentials

#### For Web (Current Setup)
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application"
4. Name: "Money Manager Web"
5. **Authorized JavaScript origins:**
   - `http://localhost:19006`
   - `http://localhost:19000`
   - Add your production domain when deploying
6. **Authorized redirect URIs:**
   - `http://localhost:19006`
   - `http://localhost:19000`
   - Add your production domain when deploying
7. Click "Create"
8. **Copy the Client ID** - You'll need this!

#### For iOS (Future)
1. Create another OAuth client ID
2. Select "iOS"
3. Bundle ID: `com.moneymanager.app` (from app.json)
4. Copy the iOS Client ID

#### For Android (Future)
1. Create another OAuth client ID
2. Select "Android"
3. Package name: `com.moneymanager.app` (from app.json)
4. Get SHA-1 certificate fingerprint:
   ```bash
   keytool -keystore ~/.android/debug.keystore -list -v
   ```
5. Copy the Android Client ID

### Step 4: Configure OAuth Consent Screen
1. Go to "APIs & Services" > "OAuth consent screen"
2. Select "External" (or "Internal" if G Suite)
3. Fill in:
   - App name: "Money Manager"
   - User support email: Your email
   - Developer contact email: Your email
4. Add scopes:
   - `userinfo.email`
   - `userinfo.profile`
5. Add test users if in testing mode
6. Click "Save and Continue"

### Step 5: Update LoginScreen.js
1. Open: `src/screens/LoginScreen.js`
2. Find line with `webClientId:`
3. Replace the Client ID with your **Web Client ID** from Step 3
4. Example:
   ```javascript
   webClientId: 'YOUR_ACTUAL_CLIENT_ID_HERE.apps.googleusercontent.com',
   ```

## Testing the Login

### On Web Browser
1. Start the backend: `cd Backend && dotnet run`
2. Start the frontend: `cd Frontend && npm start`
3. Press 'w' to open in web browser
4. Click "Sign in with Google"
5. Select your Google account
6. First time: Backend creates your user account automatically
7. You're redirected to Dashboard
8. Close browser and reopen - you stay logged in!

### On Mobile (Future)
1. Update iOS and Android Client IDs in LoginScreen.js
2. Use Expo Go app to scan QR code
3. Sign in with Google
4. Stay logged in across app restarts

## Current Configuration

### File: `src/screens/LoginScreen.js`
```javascript
const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
  webClientId: 'YOUR_WEB_CLIENT_ID_HERE.apps.googleusercontent.com',
  iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
  androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
});
```

### How Login Persistence Works
1. User clicks "Sign in with Google"
2. Google OAuth popup appears
3. User selects account and authorizes
4. Backend receives Google ID token
5. Backend verifies token with Google
6. Backend creates user if new, or finds existing user
7. Backend returns JWT token
8. Frontend saves token in AsyncStorage
9. Frontend saves user info in AsyncStorage
10. User is redirected to Dashboard
11. On next app open: Token is checked, user stays logged in!

### Logout
- Available in Settings screen
- Clears token and user data
- Redirects to Login screen

## Troubleshooting

### Error: "invalid_client"
- Wrong Client ID in LoginScreen.js
- Client ID doesn't match OAuth consent screen
- Forgot to enable Google+ API

### Error: "redirect_uri_mismatch"
- Add the redirect URI to Google Console
- Make sure it matches exactly (with/without trailing slash)

### Error: "access_blocked"
- Add email to test users in OAuth consent screen
- App needs to be verified for production

### Backend Error: Token verification failed
- Backend can't reach Google servers
- Invalid ID token
- Check backend logs for details

## Security Notes

### Development
- Using localhost URIs is fine
- Test with limited users

### Production
1. Use HTTPS only
2. Add production domain to authorized origins
3. Complete OAuth consent screen verification
4. Use environment variables for Client IDs
5. Enable rate limiting on backend
6. Use proper CORS configuration

## Client ID Location
Your Web Client ID is configured in:
- `src/screens/LoginScreen.js` (line ~27)

Current value: `1039148167986-2lnr01b2hv0r3j88r8biqvpd7dbmtrkg.apps.googleusercontent.com`

**⚠️ Replace this with your actual Client ID from Google Cloud Console!**
