// Firebase Configuration
//
// SETUP INSTRUCTIONS:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project (or select existing)
// 3. Click on "Web" icon (</>) to add a web app
// 4. Register your app and copy the config object
// 5. Go to "Firestore Database" in the left sidebar
// 6. Click "Create database"
// 7. Choose "Start in production mode" (or test mode for development)
// 8. Select a location closest to your users
// 9. Replace the firebaseConfig object below with your actual config
// 10. Update the Firestore security rules (see below)

const firebaseConfig = {
    apiKey: "AIzaSyDnbnLRLf0-UsAQ1LauaXcwp3qx7Uuc3EQ",
    authDomain: "usedtextbooks-c699d.firebaseapp.com",
    projectId: "usedtextbooks-c699d",
    storageBucket: "usedtextbooks-c699d.firebasestorage.app",
    messagingSenderId: "1033841321466",
    appId: "1:1033841321466:web:3a749675c60ac8155cf043",
    measurementId: "G-JCMSRQRN4L"
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

DATA STRUCTURE:
The app will store submissions in a collection called "textbook_submissions"
Each document will contain:
{
  fullName: string,
  email: string,
  phone: string,
  isbn: string,
  bookTitle: string,
  bookAuthor: string,
  bookCondition: string,
  additionalNotes: string,
  submittedAt: timestamp,
  createdAt: timestamp (server timestamp)
}

VIEWING DATA:
1. Go to Firebase Console > Firestore Database
2. Click on "textbook_submissions" collection
3. View all submitted textbook entries
4. You can export data, set up queries, or connect to other Firebase services

OPTIONAL ENHANCEMENTS:
- Set up Firebase Authentication to protect admin views
- Add Cloud Functions to send email notifications on new submissions
- Set up Firebase Analytics to track form submissions
- Add Firebase Hosting for deployment
*/
