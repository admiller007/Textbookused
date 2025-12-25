#!/usr/bin/env node

// This script generates firebase-config.js from environment variables
// It runs automatically on Vercel during deployment

const fs = require('fs');
const path = require('path');

// Check if we're in a build environment (Vercel)
const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

if (isProduction) {
    // Read environment variables
    const config = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID
    };

    // Check if all required env vars are present
    const missingVars = Object.entries(config)
        .filter(([key, value]) => !value && key !== 'measurementId') // measurementId is optional
        .map(([key]) => key);

    if (missingVars.length > 0) {
        console.error('❌ Missing required environment variables:', missingVars.join(', '));
        console.error('Please set these in your Vercel project settings.');
        process.exit(1);
    }

    // Generate the config file
    const configContent = `// Firebase Configuration
// Auto-generated from environment variables during build

const firebaseConfig = ${JSON.stringify(config, null, 4)};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Export for use in other files
window.db = db;
`;

    // Write the config file
    const configPath = path.join(__dirname, 'firebase-config.js');
    fs.writeFileSync(configPath, configContent);

    console.log('✅ firebase-config.js generated successfully from environment variables');
} else {
    console.log('ℹ️  Not in production build - skipping firebase-config.js generation');
    console.log('   For local development, copy firebase-config.template.js to firebase-config.js');
}
