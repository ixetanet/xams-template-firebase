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
    "enableSmsMfa": true,
    "redirectUrls": ["http://localhost:3000/x", "https://yourdomain.com/x"]
  }
}
```
