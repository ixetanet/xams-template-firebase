# Setup Instructions

## Firebase Configuration

Add your Firebase configuration to appsettings.json:

```json
{
  "FirebaseConfig": {
    "apiKey": "xxxx",
    "authDomain": "xxxx.firebaseapp.com",
    "projectId": "xxxx",
    "storageBucket": "xxxx.appspot.com",
    "messagingSenderId": "xxxx",
    "appId": "1:xxxx:web:xxxx",
    "measurementId": "G-XXXX",
    "providers": ["google", "facebook", "apple", "microsoft"],
    "enableSmsMfa": true
  }
}
```

## Download Service Account Key

Generate and configure your Firebase service account private key:

1. Navigate to your Firebase project in the Firebase console
2. Open **Project settings**
3. Select the **Service accounts** tab
4. Click **Generate new private key** in the Firebase Admin SDK section
5. Confirm to download the JSON key file
6. Add the JSON file to your project (e.g., in a `keys` folder)
7. Configure the file to copy to output directory in your project settings

## Configure the Firebase Console

Configure the Firebase email template action URL to redirect to your Xams application:

1. Navigate to **Authentication → Templates** in the Firebase console
2. Select an email template and click **Edit Template**
3. Click **Customize action URL**
4. Set the URL to your application's action handler (e.g., `https://localhost:3000/__/auth/action`)

This URL handles email verification, password reset, and other Firebase authentication actions.

## OAuth Provider Setup (Google, Facebook, etc.)

**Setup Instructions**: Follow [Google Cloud Console OAuth setup](https://console.cloud.google.com/apis/credentials) to configure each provider.

**Critical for Custom Domains**: Add authorized redirect URIs:

```
https://YOUR_CUSTOM_DOMAIN/__/auth/handler  (Production)
https://localhost:PORT/__/auth/handler      (Development)
```

The `/__/auth/handler` endpoint is automatically provided by Xams (`app.AddFirebaseAuthProxy()`), implementing [Firebase's redirect best practice Option 3](https://firebase.google.com/docs/auth/web/redirect-best-practices) - proxying auth through your backend. This is **required** for custom domains with Google OAuth.

## Test Your Configuration

In Program.cs, with useAuth = true, navigate to the admin dashboard to verify Firebase authentication is working:

Example: `https://localhost:7102/xams`

You should see the Firebase login page with your configured authentication providers.
