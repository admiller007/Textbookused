# Troubleshooting Firebase Integration

## Issue: Form submissions not saving to Firebase

If your form isn't saving to Firebase, follow these steps:

### Step 1: Check Browser Console

1. Open your deployed site: https://textbookused.vercel.app
2. Press F12 to open Developer Tools
3. Go to the **Console** tab
4. Try submitting the form
5. Look for error messages

#### Common Error Messages:

**Error: "Firebase: Firebase App named '[DEFAULT]' already exists"**
- This means Firebase is initializing twice
- Should be fixed in latest version

**Error: "Missing or insufficient permissions"**
- **CAUSE**: Firestore security rules are blocking writes
- **FIX**: Update security rules (see Step 2)

**Error: "FirebaseError: [code=permission-denied]"**
- **CAUSE**: Firestore database doesn't exist OR rules are wrong
- **FIX**: Create database (see Step 2) and configure rules (see Step 3)

**Warning: "Firebase not configured. Saving to localStorage instead."**
- **CAUSE**: `firebase-config.js` isn't loading
- **FIX**: Check Network tab to see if file loads

### Step 2: Create Firestore Database (CRITICAL!)

**This is the most common issue!** You MUST create the Firestore database:

1. Go to [Firebase Console](https://console.firebase.google.com/project/usedtextbooks-c699d)
2. Click **"Firestore Database"** in the left sidebar (under "Build")
3. Click **"Create database"**
4. Choose **"Start in production mode"**
5. Select a location (e.g., `us-central1` for US)
6. Click **"Enable"**
7. Wait for database to be created (takes 30-60 seconds)

### Step 3: Configure Security Rules

After creating the database:

1. In Firestore, click the **"Rules"** tab
2. Replace the content with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to create textbook submissions
    match /textbook_submissions/{document=**} {
      allow create: if true;
      allow read, update, delete: if false;
    }
  }
}
```

3. Click **"Publish"**
4. You should see "Rules published successfully"

### Step 4: Test Again

1. Go back to your site: https://textbookused.vercel.app
2. Open browser console (F12)
3. Fill out the form
4. Click Submit
5. Check console for:
   - ✅ "Submission saved with ID: [some-id]"
   - ❌ Any error messages

### Step 5: Verify in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/project/usedtextbooks-c699d)
2. Click **"Firestore Database"**
3. Look for **"textbook_submissions"** collection
4. Click on it to see your submissions

## Detailed Diagnostics

### Check 1: Is Firebase SDK Loading?

Open browser console and type:
```javascript
typeof firebase
```

Expected output: `"object"`

If you get `"undefined"`, the Firebase SDK isn't loading.

### Check 2: Is Firebase Initialized?

Open browser console and type:
```javascript
firebase.apps.length
```

Expected output: `1` (or higher)

If you get `0`, Firebase isn't initialized.

### Check 3: Is Firestore Connected?

Open browser console and type:
```javascript
typeof db
```

Expected output: `"object"`

If you get `"undefined"`, Firestore isn't initialized.

### Check 4: Test Firestore Write

Open browser console and paste:
```javascript
db.collection('textbook_submissions').add({
    test: 'Hello from console',
    timestamp: new Date().toISOString()
}).then(doc => {
    console.log('✅ Test write successful! Document ID:', doc.id);
}).catch(error => {
    console.error('❌ Test write failed:', error.code, error.message);
});
```

Expected output: `✅ Test write successful! Document ID: [some-id]`

If you get permission-denied or other errors, see the fixes above.

## Still Not Working?

### Option A: Check Network Tab

1. Open Developer Tools (F12)
2. Go to **Network** tab
3. Refresh the page
4. Look for:
   - `firebase-app-compat.js` - Should load successfully (200 status)
   - `firebase-firestore-compat.js` - Should load successfully (200 status)
   - `firebase-config.js` - Should load successfully (200 status)

If any of these show 404, there's a file loading issue.

### Option B: Check Firestore Settings

1. Go to [Firebase Console](https://console.firebase.google.com/project/usedtextbooks-c699d)
2. Click **Project Settings** (gear icon)
3. Scroll to "Your apps"
4. Verify the Web app is registered
5. Check that the config matches what's in `firebase-config.js`

### Option C: Check Browser Compatibility

- **Chrome/Edge**: Fully supported ✅
- **Firefox**: Fully supported ✅
- **Safari**: Fully supported ✅
- **IE11**: NOT supported ❌

## Common Issues and Solutions

### Issue: "CORS policy" error
**Solution**: This shouldn't happen with Firebase, but if it does:
1. Check that you're using HTTPS (not HTTP)
2. Verify your domain is whitelisted in Firebase Console → Authentication → Settings → Authorized domains

### Issue: Submissions appear in localStorage but not Firebase
**Solution**: This means Firebase isn't configured correctly. Check Steps 1-3 above.

### Issue: "quota exceeded" error
**Solution**: You've hit the free tier limit. Check Firebase Console → Usage tab.

### Issue: Form works locally but not on Vercel
**Solution**:
1. Clear your browser cache
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Check that firebase-config.js is deployed to Vercel

## Quick Test Script

Paste this into your browser console on the deployed site:

```javascript
console.log('=== Firebase Diagnostics ===');
console.log('1. Firebase loaded:', typeof firebase !== 'undefined');
console.log('2. Firebase apps:', firebase?.apps?.length || 0);
console.log('3. Firestore (db) available:', typeof db !== 'undefined');
console.log('4. Project ID:', firebase?.apps?.[0]?.options?.projectId);

if (typeof db !== 'undefined') {
    console.log('5. Testing Firestore write...');
    db.collection('test').add({ timestamp: new Date() })
        .then(() => console.log('✅ Firestore write test: SUCCESS'))
        .catch(err => console.error('❌ Firestore write test: FAILED -', err.message));
} else {
    console.log('5. ❌ Cannot test Firestore - db is not defined');
}
```

## Need More Help?

1. **Firebase Docs**: https://firebase.google.com/docs/firestore
2. **Firebase Support**: https://firebase.google.com/support
3. **Check the files**:
   - [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
   - [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
   - [VERCEL_ENV_SETUP.md](VERCEL_ENV_SETUP.md)

---

**Most Common Fix**: Create the Firestore database in Step 2 above! 90% of issues come from forgetting this step.
