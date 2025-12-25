# Deployment Checklist

Quick checklist to get your textbook app deployed with Firebase integration.

## ✅ Pre-Deployment (Do These First)

### 1. Set Up Firebase Firestore Database
- [ ] Go to [Firebase Console](https://console.firebase.google.com/project/usedtextbooks-c699d)
- [ ] Click "Firestore Database" in the left sidebar
- [ ] Click "Create database"
- [ ] Choose "Start in production mode"
- [ ] Select location (e.g., `us-central` if in US)
- [ ] Click "Enable"

### 2. Configure Firestore Security Rules
- [ ] In Firestore, go to the "Rules" tab
- [ ] Paste this configuration:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /textbook_submissions/{document=**} {
      allow create: if true;
      allow read, update, delete: if false;
    }
  }
}
```
- [ ] Click "Publish"

### 3. Configure Vercel Environment Variables
- [ ] Go to [Vercel Dashboard](https://vercel.com/dashboard)
- [ ] Select your project (`Textbookused`)
- [ ] Go to **Settings** → **Environment Variables**
- [ ] Add these variables (see [VERCEL_ENV_SETUP.md](VERCEL_ENV_SETUP.md) for values):
  - [ ] `FIREBASE_API_KEY`
  - [ ] `FIREBASE_AUTH_DOMAIN`
  - [ ] `FIREBASE_PROJECT_ID`
  - [ ] `FIREBASE_STORAGE_BUCKET`
  - [ ] `FIREBASE_MESSAGING_SENDER_ID`
  - [ ] `FIREBASE_APP_ID`
  - [ ] `FIREBASE_MEASUREMENT_ID`
- [ ] For each variable, select: Production, Preview, and Development
- [ ] Click "Save" for each

## 🚀 Deployment

### 4. Merge Pull Request
- [ ] Go to [GitHub PR](https://github.com/admiller007/Textbookused/pulls)
- [ ] Review the changes
- [ ] Merge the `firebase-integration` branch to `master`

### 5. Vercel Auto-Deploy
Vercel will automatically:
- [ ] Detect the merge to master
- [ ] Run `npm install`
- [ ] Run `npm run build` (generates firebase-config.js from env vars)
- [ ] Deploy your app

Watch the deployment at: [Vercel Dashboard](https://vercel.com/dashboard)

## ✅ Post-Deployment (Verify Everything Works)

### 6. Test the Deployed App
- [ ] Visit your deployed URL (check Vercel dashboard for URL)
- [ ] Fill out the form with test data
- [ ] Click "Submit Request"
- [ ] Verify success message appears

### 7. Verify Firebase Integration
- [ ] Go to [Firebase Console](https://console.firebase.google.com/project/usedtextbooks-c699d)
- [ ] Navigate to Firestore Database
- [ ] Look for `textbook_submissions` collection
- [ ] Verify your test submission appears

### 8. Test Admin Dashboard
- [ ] Visit `https://your-domain.vercel.app/admin.html`
- [ ] Verify submissions display correctly
- [ ] Test CSV export functionality
- [ ] Check statistics (Total, Today, This Week)

### 9. Test Barcode Scanner (HTTPS Required)
- [ ] Open app on mobile device
- [ ] Click the scan button next to ISBN field
- [ ] Grant camera permissions
- [ ] Scan a textbook barcode
- [ ] Verify ISBN populates correctly

### 10. Test Auto-Population
- [ ] Enter a valid ISBN (e.g., `9780134685991`)
- [ ] Wait 500ms
- [ ] Verify book title and author auto-populate
- [ ] Note: Not all ISBNs have data in Google Books API

## 📝 Optional Enhancements

### Security
- [ ] Set up reCAPTCHA to prevent spam
- [ ] Add rate limiting
- [ ] Review and tighten Firestore security rules

### Features
- [ ] Set up email notifications via Cloud Functions
- [ ] Enable Firebase Analytics
- [ ] Add authentication for admin dashboard
- [ ] Implement photo upload for book condition

### Monitoring
- [ ] Set up Firebase usage alerts
- [ ] Enable Vercel analytics
- [ ] Monitor error logs in Vercel dashboard

## 🐛 Troubleshooting

### Issue: "Firebase not configured" in browser console
**Solution**: Check that Vercel environment variables are set correctly and redeploy.

### Issue: Firestore permission denied
**Solution**: Verify security rules allow `create: if true` for textbook_submissions.

### Issue: Build fails on Vercel
**Solution**:
1. Check deployment logs in Vercel
2. Verify all environment variables are set
3. Ensure `package.json` and `build-firebase-config.js` are in the repo

### Issue: Admin dashboard shows no submissions
**Solution**:
1. Check browser console for errors
2. Verify Firestore database is created
3. Test submitting a form first
4. Check Firestore security rules allow reads (for admin, consider adding authentication)

## 📚 Documentation

- [FIREBASE_SETUP.md](FIREBASE_SETUP.md) - Detailed Firebase setup guide
- [VERCEL_ENV_SETUP.md](VERCEL_ENV_SETUP.md) - Environment variables setup
- [README.md](README.md) - General project documentation

## 🎉 Success Indicators

You'll know everything is working when:
- ✅ Form submissions appear in Firebase Console
- ✅ Admin dashboard displays submissions
- ✅ CSV export works
- ✅ No errors in browser console
- ✅ Barcode scanner works on HTTPS
- ✅ Auto-population fetches book details

---

**Estimated Time**: 15-20 minutes for complete setup

**Next Steps After Deployment**:
1. Test thoroughly with real textbook submissions
2. Share the URL with your team/users
3. Monitor Firebase usage in console
4. Consider adding the optional enhancements above

Good luck with your deployment! 🚀
