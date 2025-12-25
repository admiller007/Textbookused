# Used Textbook Submission Form

A simple, responsive web application for collecting used textbook submissions from sellers. This form allows users to submit their contact information, ISBN numbers, and book details for textbook buyback services.

## Features

- **Modern UI Design**: Clean, professional interface with smooth animations
- **ISBN Barcode Scanner**: Scan textbook barcodes directly from your device camera
- **Auto-populate Book Details**: Automatically fetches book title and author from ISBN using Google Books API
- **Form Validation**: Client-side validation for all required fields
- **Firebase Integration**: Secure cloud storage with Firestore database
- **Fallback Storage**: Automatic localStorage backup if Firebase is unavailable
- **Admin Dashboard**: View and export all submissions via [admin.html](admin.html)
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

## Form Fields

### Required Fields
- **Full Name**: User's complete name
- **Email Address**: Valid email for contact
- **Phone Number**: 10-digit phone number (auto-formatted)
- **ISBN Number**: 10 or 13 digit ISBN with validation
- **Book Condition**: Dropdown selection (Like New, Good, Acceptable, Poor)

### Optional Fields
- **Book Title**: Title of the textbook
- **Additional Notes**: Any extra information about the book

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server or backend required for basic functionality

### Installation

1. Clone or download this repository
2. Open `index.html` in your web browser
3. That's it! The form is ready to use

### Deployment Options

#### Option 1: Deploy to Vercel (Recommended) ⚡

This project is configured for seamless Vercel deployment.

**Quick Deploy:**

1. **Install Vercel CLI** (optional, for command-line deployment):
   ```bash
   npm install -g vercel
   ```

2. **Deploy via Vercel Dashboard** (easiest method):
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your Git repository
   - Vercel will automatically detect the configuration
   - Click "Deploy"

3. **Deploy via CLI**:
   ```bash
   vercel
   ```
   Follow the prompts to deploy your site.

**What's Included:**
- ✅ `vercel.json` - Configuration for routing and security headers
- ✅ `.vercelignore` - Excludes unnecessary files from deployment
- ✅ Security headers (XSS protection, content type sniffing prevention)
- ✅ Optimized caching for static assets

**Custom Domain:**
After deployment, you can add a custom domain in your Vercel dashboard under "Settings" → "Domains".

#### Option 2: Other Static Hosting Services
Deploy to any static hosting service:
- **GitHub Pages**: Free hosting directly from your repository
- **Netlify**: Drag and drop deployment
- **AWS S3**: Static website hosting

#### Option 3: Firebase Setup (Already Configured!)

Your Firebase is already set up and ready to use! Submissions will be automatically saved to Firebase Firestore.

**What's Already Done:**
- ✅ Firebase project created (`usedtextbooks-c699d`)
- ✅ Firestore integration added to the app
- ✅ Admin dashboard available at [admin.html](admin.html)
- ✅ Secure environment variable setup for Vercel

**Next Steps:**
0. **Configure Vercel Environment Variables** (See [VERCEL_ENV_SETUP.md](VERCEL_ENV_SETUP.md)):
   - Add Firebase credentials as environment variables in Vercel Dashboard
   - This keeps your credentials secure and out of the repository
1. **Set up Firestore Database**:
   - Go to [Firebase Console](https://console.firebase.google.com/project/usedtextbooks-c699d)
   - Click "Firestore Database" in the left sidebar
   - Click "Create database"
   - Choose "Start in production mode"
   - Select your preferred location
   - Click "Enable"

2. **Configure Security Rules**:
   - In Firestore, go to the "Rules" tab
   - Paste this configuration:
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
   - Click "Publish"

3. **Test it out**:
   - Submit a test textbook through the form
   - Check Firebase Console → Firestore Database to see your data
   - Open [admin.html](admin.html) to view all submissions

For detailed setup instructions, see [FIREBASE_SETUP.md](FIREBASE_SETUP.md)

#### Option 4: Alternative Backend Integration
If you want to use a different backend:

1. **Modify `script.js`** - Replace the setTimeout simulation with an actual API call:
```javascript
// Replace this section in script.js
fetch('YOUR_API_ENDPOINT', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
})
.then(response => response.json())
.then(data => {
    // Show success message
    form.style.display = 'none';
    successMessage.style.display = 'block';
})
.catch(error => {
    console.error('Error:', error);
    alert('There was an error submitting your form. Please try again.');
});
```

2. **Backend Options**:
   - **Node.js/Express**: Simple REST API
   - **Python/Flask**: Lightweight backend
   - **PHP**: Traditional server-side processing
   - **Firebase**: Serverless database
   - **Google Forms**: No-code solution
   - **Formspree/Netlify Forms**: Form handling services

## File Structure

```
UsedTextbook/
├── index.html              # Main submission form
├── admin.html              # Admin dashboard to view submissions
├── styles.css              # All styling and design
├── script.js               # Form logic, validation, and submission
├── firebase-config.js      # Firebase configuration (configured with your credentials)
├── FIREBASE_SETUP.md       # Detailed Firebase setup guide
├── README.md               # This file
├── vercel.json             # Vercel deployment configuration
├── .vercelignore           # Files to exclude from Vercel deployment
└── .gitignore              # Git ignore rules
```

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Testing the Form

1. Open `index.html` in your browser
2. Fill out the form with test data
3. Submit the form
4. Check browser console (`F12`) to see submission data
5. Use `viewSubmissions()` in console to see all stored submissions

### Test Data
- **Name**: John Doe
- **Email**: john.doe@example.com
- **Phone**: (555) 123-4567
- **ISBN**: 978-0-13-110362-7 (valid ISBN-13)
- **Condition**: Select any option

## Customization

### Change Colors
Edit `styles.css` and modify the gradient colors:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Modify Form Fields
Edit `index.html` to add/remove fields as needed.

### Update Validation Rules
Edit `script.js` validation functions to change requirements.

## Security Considerations

⚠️ **Important**: This is a client-side only application. For production use:

1. **Add server-side validation** - Never trust client-side validation alone
2. **Implement CAPTCHA** - Prevent spam submissions (Google reCAPTCHA, hCaptcha)
3. **Use HTTPS** - Encrypt data in transit
4. **Sanitize inputs** - Prevent XSS attacks on your backend
5. **Rate limiting** - Prevent abuse
6. **Data privacy** - Comply with GDPR/CCPA if applicable

## Viewing Submissions

### Option 1: Admin Dashboard (Recommended)
- Open [admin.html](admin.html) in your browser
- View all submissions with statistics
- Export data to CSV

### Option 2: Firebase Console
- Go to [Firebase Console](https://console.firebase.google.com/project/usedtextbooks-c699d) → Firestore Database
- Browse the `textbook_submissions` collection

### Option 3: Browser Console
- Open browser DevTools (F12)
- Type `viewSubmissions()` in the console

## Future Enhancements

- [ ] Email notifications on new submissions
- [ ] Photo upload for book condition
- [ ] Multiple book submissions in one form
- [ ] Price estimation based on ISBN and condition
- [ ] Advanced search/filtering in admin panel
- [ ] Export to Excel/PDF
- [ ] SMS notifications
- [ ] Integration with textbook buyback APIs

## Support

For issues or questions, please open an issue in the repository.

## License

This project is open source and available for personal and commercial use.
