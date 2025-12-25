// Firebase Configuration
//
// Note: These credentials are safe to expose client-side.
// Security is enforced by Firestore security rules, not by hiding the API key.
// For best practices with environment variables, see VERCEL_ENV_SETUP.md

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

console.log('Firebase initialized with project:', firebaseConfig.projectId);
