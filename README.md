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

## Configure the Firebase Console

Configure the Firebase email template action URL to redirect to your Xams application:

1. Navigate to **Authentication → Templates** in the Firebase console
2. Select an email template and click **Edit Template**
3. Click **Customize action URL**
4. Set the URL to your application's action handler (e.g., `https://localhost:3000/__/auth/action`)

This URL handles email verification, password reset, and other Firebase authentication actions.

## Google Provider Setup

To configure Google as an authentication provider and enable custom domain redirects:

1. **Go to Google Cloud Console**
   - Open the Google Cloud Console and select your project linked to your Firebase app.

2. **Navigate to OAuth 2.0 Credentials**
   - In the left sidebar, click on "APIs & Services," then choose "Credentials."
   - Under "OAuth 2.0 Client IDs," find the web client associated with your Firebase project and click the pencil/edit icon.

3. **Add Your Redirect URL (Required for Custom Domains)**
   - The default redirect URL for Firebase Authentication will look like:
     ```
     https://YOUR_PROJECT_ID.firebaseapp.com/__/auth/handler
     ```
   - **For custom domains** (required when using Google authentication with your own domain), add your Xams ASP.NET project URL:
     ```
     https://YOUR_CUSTOM_DOMAIN/__/auth/handler
     ```
     The `/__/auth/handler` endpoint is automatically provided by the Xams framework when you configure Firebase authentication with `app.AddFirebaseAuthProxy()`. This implements [Option 3 from Firebase's redirect best practices](https://firebase.google.com/docs/auth/web/redirect-best-practices) - proxying the auth handler through your application backend. This configuration is essential for Google OAuth to properly redirect users back to your custom domain after authentication.
   - For local development, use:
     ```
     https://localhost:PORT/__/auth/handler
     ```
   - Replace `YOUR_PROJECT_ID` with your Firebase project ID, `YOUR_CUSTOM_DOMAIN` with your production domain hosting the Xams API, and `PORT` with your local development port.

4. **Add the Redirect URL to Authorized Redirect URIs**
   - In the OAuth client settings, scroll to the "Authorized redirect URIs" section.
   - Click "Add URI" and paste in your Firebase project's handler URL(s).
   - Add both your production and localhost URLs for development convenience.

5. **Save Changes**
   - After adding your URLs, click "Save" at the bottom of the OAuth client configuration page.

6. **Use Your Redirect URL in Code (Optional)**
   - In most setups, Firebase Authentication manages the redirect internally, so you don't need to specify it in your frontend code.
   - If you are configuring the `authDomain` in your Firebase initialization, match it to your custom domain if used.
