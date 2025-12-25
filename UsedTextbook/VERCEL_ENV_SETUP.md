# Vercel Environment Variables Setup

This guide shows you how to securely configure Firebase credentials using Vercel environment variables instead of committing them to your repository.

## Why Use Environment Variables?

✅ **Security**: Credentials aren't exposed in your public GitHub repo
✅ **Flexibility**: Easy to update without code changes
✅ **Best Practice**: Industry-standard approach for sensitive data

## Setup Instructions

### Step 1: Get Your Firebase Credentials

Your Firebase credentials are:
- API Key: `AIzaSyDnbnLRLf0-UsAQ1LauaXcwp3qx7Uuc3EQ`
- Auth Domain: `usedtextbooks-c699d.firebaseapp.com`
- Project ID: `usedtextbooks-c699d`
- Storage Bucket: `usedtextbooks-c699d.firebasestorage.app`
- Messaging Sender ID: `1033841321466`
- App ID: `1:1033841321466:web:3a749675c60ac8155cf043`
- Measurement ID: `G-JCMSRQRN4L`

### Step 2: Add Environment Variables in Vercel

1. **Go to your Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your project (`Textbookused`)

2. **Navigate to Environment Variables**
   - Click on **Settings** tab
   - Click on **Environment Variables** in the left sidebar

3. **Add Each Variable**

   Add the following environment variables one by one:

   | Name | Value |
   |------|-------|
   | `FIREBASE_API_KEY` | `AIzaSyDnbnLRLf0-UsAQ1LauaXcwp3qx7Uuc3EQ` |
   | `FIREBASE_AUTH_DOMAIN` | `usedtextbooks-c699d.firebaseapp.com` |
   | `FIREBASE_PROJECT_ID` | `usedtextbooks-c699d` |
   | `FIREBASE_STORAGE_BUCKET` | `usedtextbooks-c699d.firebasestorage.app` |
   | `FIREBASE_MESSAGING_SENDER_ID` | `1033841321466` |
   | `FIREBASE_APP_ID` | `1:1033841321466:web:3a749675c60ac8155cf043` |
   | `FIREBASE_MEASUREMENT_ID` | `G-JCMSRQRN4L` |

4. **Select Environments**
   - For each variable, select: **Production**, **Preview**, and **Development**
   - This ensures the variables work in all environments

5. **Save**
   - Click "Save" for each variable

### Step 3: Redeploy (Automatic)

Once you merge your PR, Vercel will:
1. Pull the latest code
2. Run `npm install`
3. Run `npm run build` (which generates `firebase-config.js` from env vars)
4. Deploy your app with the Firebase config

No manual redeployment needed!

### Step 4: Verify

After deployment:
1. Visit your deployed site
2. Open browser DevTools (F12)
3. Go to Console tab
4. Submit a test form
5. Check for success message
6. Verify in Firebase Console that the submission appears

## Local Development Setup

For local development, you have two options:

### Option A: Copy Template (Recommended)

```bash
cd UsedTextbook
cp firebase-config.template.js firebase-config.js
```

Then edit `firebase-config.js` with your actual credentials. This file is gitignored so it won't be committed.

### Option B: Use .env File (Alternative)

Create a `.env` file in the root:

```env
FIREBASE_API_KEY=AIzaSyDnbnLRLf0-UsAQ1LauaXcwp3qx7Uuc3EQ
FIREBASE_AUTH_DOMAIN=usedtextbooks-c699d.firebaseapp.com
FIREBASE_PROJECT_ID=usedtextbooks-c699d
FIREBASE_STORAGE_BUCKET=usedtextbooks-c699d.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=1033841321466
FIREBASE_APP_ID=1:1033841321466:web:3a749675c60ac8155cf043
FIREBASE_MEASUREMENT_ID=G-JCMSRQRN4L
```

Then run `npm run build` before testing locally.

## How It Works

1. **On Vercel**: The `build-firebase-config.js` script runs during deployment
2. **Reads env vars**: It reads the Firebase credentials from Vercel environment variables
3. **Generates config**: Creates `firebase-config.js` with the actual values
4. **Serves app**: The generated file is included in the deployed app

## Troubleshooting

### Build fails with "Missing required environment variables"

**Solution**: Double-check that all environment variables are set in Vercel dashboard.

### Firebase not connecting after deployment

**Solution**:
1. Check browser console for errors
2. Verify Firestore database is created and enabled
3. Verify security rules are configured
4. Check that all environment variables are correct

### Working locally but not on Vercel

**Solution**:
1. Make sure you've added env vars to Vercel
2. Try redeploying: `Settings` → `Deployments` → Click `...` → `Redeploy`
3. Check deployment logs for errors

## Security Notes

✅ **Safe to expose client-side**: Firebase API keys are designed to work in browsers
✅ **Protected by Firestore rules**: Security is enforced by database rules, not API keys
✅ **Not in git**: Credentials never appear in your repository
✅ **Easy rotation**: Update env vars in Vercel without code changes

## Alternative: Firebase Public Config

**Note**: Firebase API keys are actually safe to expose publicly because:
1. They identify your Firebase project
2. Security is enforced by Firestore security rules
3. You can restrict API key usage in Firebase Console → Project Settings → API Keys

However, using environment variables is still best practice for flexibility and control.

## Need Help?

- **Vercel Docs**: [Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables)
- **Firebase Docs**: [Web Setup Guide](https://firebase.google.com/docs/web/setup)

---

Once configured, your Firebase credentials will be securely managed and automatically injected at build time! 🔐
