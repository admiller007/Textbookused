# Firebase Setup Guide for Used Textbook App

This guide will walk you through setting up Firebase Firestore to store textbook submissions from your app.

## Prerequisites
- A Google account
- Your textbook app files

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" (or select an existing project)
3. Enter a project name (e.g., "Used Textbooks")
4. Follow the prompts to create your project

## Step 2: Add Firebase to Your Web App

1. In the Firebase Console, click the **Web icon** (`</>`) to add a web app
2. Register your app with a nickname (e.g., "Textbook App")
3. You'll see a `firebaseConfig` object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

4. **Copy this configuration object**

## Step 3: Update Your Firebase Configuration

1. Open the `firebase-config.js` file in your project
2. Replace the placeholder `firebaseConfig` object with your actual configuration:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

3. Save the file

## Step 4: Set Up Firestore Database

1. In the Firebase Console, go to **Build** → **Firestore Database** in the left sidebar
2. Click **Create database**
3. Choose a location closest to your users (e.g., `us-central1`)
4. Select **Start in production mode** (we'll configure security rules next)
5. Click **Enable**

## Step 5: Configure Security Rules

1. In Firestore Database, click on the **Rules** tab
2. Replace the existing rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to submit textbooks
    match /textbook_submissions/{document=**} {
      allow create: if true;
      allow read, update, delete: if false;
    }
  }
}
```

3. Click **Publish**

**Important:** These rules allow anyone to create submissions but prevent public reading. This is secure for your use case where you'll view submissions through the Firebase Console.

## Step 6: Test Your Setup

1. Open your app in a web browser
2. Fill out the textbook submission form
3. Click "Submit Request"
4. Go to Firebase Console → Firestore Database → Data tab
5. You should see a new collection called `textbook_submissions` with your submitted data

## Data Structure

Each submission will be stored with the following fields:

```javascript
{
  fullName: "John Doe",
  email: "john@example.com",
  phone: "(555) 123-4567",
  isbn: "9781234567890",
  bookTitle: "Introduction to Psychology",
  bookAuthor: "Jane Smith",
  bookCondition: "like-new",
  additionalNotes: "Some notes here",
  submittedAt: "2025-01-15T10:30:00.000Z",
  createdAt: [Firebase Server Timestamp]
}
```

## Viewing Submissions

### Option 1: Firebase Console (Recommended)
1. Go to Firebase Console → Firestore Database
2. Click on the `textbook_submissions` collection
3. View, export, or query submissions

### Option 2: Export Data
1. In Firestore Database, click the three dots menu
2. Select "Export collection"
3. Choose your export format (JSON, CSV, etc.)

## Optional Enhancements

### 1. Email Notifications
Set up Cloud Functions to send you an email when a new textbook is submitted:
- Go to **Build** → **Functions**
- Follow the setup wizard
- Deploy a function that triggers on new Firestore documents

### 2. Analytics
Track form submissions:
1. Go to **Build** → **Analytics**
2. Enable Google Analytics
3. Add the Analytics SDK to your HTML

### 3. Authentication (Admin Panel)
If you want to build an admin panel to view submissions:
1. Go to **Build** → **Authentication**
2. Enable Email/Password authentication
3. Update security rules to allow authenticated reads

### 4. Backup Strategy
- Enable automatic backups in Firestore settings
- Set up scheduled exports to Cloud Storage

## Troubleshooting

### "Firebase not configured" in console
- Make sure you've updated `firebase-config.js` with your actual config
- Check that the Firebase scripts are loading before your config file
- Look for JavaScript errors in the browser console

### Submissions not appearing in Firestore
- Check the browser console for errors
- Verify your security rules allow creates
- Make sure you're connected to the internet
- Check that the Firebase SDK scripts loaded correctly

### Permission Denied Errors
- Review your Firestore security rules
- Make sure `allow create: if true` is set for textbook_submissions

## Cost Considerations

Firebase offers a generous free tier:
- **Firestore Free Tier:**
  - 50,000 document reads/day
  - 20,000 document writes/day
  - 1 GB storage

This should be more than enough for a textbook submission form. You'll only pay if you exceed these limits.

## Support

For Firebase-specific issues, check:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)
- [Stack Overflow - Firebase Tag](https://stackoverflow.com/questions/tagged/firebase)

## Security Best Practices

1. **Never commit your `firebase-config.js` with real credentials to a public repository**
2. Use environment variables for production deployments
3. Regularly review security rules
4. Monitor usage in Firebase Console
5. Set up billing alerts to avoid unexpected charges
6. Enable App Check to prevent abuse

---

**Note:** The app includes a fallback to localStorage if Firebase is not configured, so it will continue to work even during setup.
