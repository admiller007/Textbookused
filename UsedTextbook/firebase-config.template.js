// Firebase Configuration Template
//
// IMPORTANT: This is a template file. Do NOT commit firebase-config.js with real credentials.
//
// For local development:
// 1. Copy this file to firebase-config.js
// 2. Replace the placeholder values with your actual Firebase credentials
// 3. The .gitignore will prevent firebase-config.js from being committed
//
// For production (Vercel):
// Use environment variables in Vercel Dashboard (see FIREBASE_SETUP.md)

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Export for use in other files
window.db = db;

/*
FIRESTORE SECURITY RULES:
Go to Firestore Database > Rules tab and paste this:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to create textbook submissions
    match /textbook_submissions/{document=**} {
      allow create: if true;
      // Only allow read/update/delete with authentication (optional - add later)
      allow read, update, delete: if false;
    }
  }
}

For detailed setup instructions, see FIREBASE_SETUP.md
*/
