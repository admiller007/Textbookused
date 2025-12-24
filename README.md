# Used Textbook Submission Form

A simple, responsive web application for collecting used textbook submissions from sellers. This form allows users to submit their contact information, ISBN numbers, and book details for textbook buyback services.

## Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Form Validation**: Client-side validation for all required fields
- **ISBN Validation**: Validates both ISBN-10 and ISBN-13 formats
- **Auto-formatting**: Automatic phone number formatting
- **User-friendly**: Clear error messages and helpful hints
- **Modern UI**: Clean, professional design with gradient backgrounds

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

#### Option 1: Static Hosting (Simplest)
Deploy to any static hosting service:
- **GitHub Pages**: Free hosting directly from your repository
- **Netlify**: Drag and drop deployment
- **Vercel**: One-click deployment
- **AWS S3**: Static website hosting

#### Option 2: Add Backend Integration
Currently, form submissions are stored in browser localStorage. To integrate with a backend:

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
textbook-submission-form/
├── index.html          # Main HTML file with form structure
├── styles.css          # CSS styling and responsive design
├── script.js           # JavaScript for validation and form handling
└── README.md          # This file
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

## Future Enhancements

- [ ] Backend API integration
- [ ] Email notifications
- [ ] Image upload for book condition
- [ ] Multiple book submissions
- [ ] Price estimation based on ISBN
- [ ] Admin dashboard to view submissions
- [ ] Database storage
- [ ] Export submissions to CSV/Excel

## Support

For issues or questions, please open an issue in the repository.

## License

This project is open source and available for personal and commercial use.
