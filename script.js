// Form validation and submission handling
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('textbookForm');
    const successMessage = document.getElementById('successMessage');

    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value.length <= 3) {
                value = `(${value}`;
            } else if (value.length <= 6) {
                value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            } else {
                value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
            }
        }
        e.target.value = value;
    });

    // ISBN formatting and validation
    const isbnInput = document.getElementById('isbn');
    isbnInput.addEventListener('input', function(e) {
        // Remove non-digits and hyphens
        let value = e.target.value.replace(/[^\d-]/g, '');
        e.target.value = value;
    });

    // Validate ISBN
    function validateISBN(isbn) {
        // Remove hyphens for validation
        const cleanISBN = isbn.replace(/-/g, '');

        // Check if it's 10 or 13 digits
        if (cleanISBN.length !== 10 && cleanISBN.length !== 13) {
            return false;
        }

        // Validate ISBN-10
        if (cleanISBN.length === 10) {
            let sum = 0;
            for (let i = 0; i < 9; i++) {
                sum += parseInt(cleanISBN.charAt(i)) * (10 - i);
            }
            const checkDigit = cleanISBN.charAt(9).toLowerCase();
            sum += checkDigit === 'x' ? 10 : parseInt(checkDigit);
            return sum % 11 === 0;
        }

        // Validate ISBN-13
        if (cleanISBN.length === 13) {
            let sum = 0;
            for (let i = 0; i < 12; i++) {
                sum += parseInt(cleanISBN.charAt(i)) * (i % 2 === 0 ? 1 : 3);
            }
            const checkDigit = (10 - (sum % 10)) % 10;
            return checkDigit === parseInt(cleanISBN.charAt(12));
        }

        return false;
    }

    // Validate email
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Validate phone
    function validatePhone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.length === 10;
    }

    // Show error message
    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    // Hide error message
    function hideError(elementId) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }

    // Clear all errors
    function clearErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(error => {
            error.textContent = '';
            error.classList.remove('show');
        });
    }

    // Validate form
    function validateForm() {
        let isValid = true;
        clearErrors();

        // Validate name
        const name = document.getElementById('fullName').value.trim();
        if (name.length < 2) {
            showError('nameError', 'Please enter your full name');
            isValid = false;
        }

        // Validate email
        const email = document.getElementById('email').value.trim();
        if (!validateEmail(email)) {
            showError('emailError', 'Please enter a valid email address');
            isValid = false;
        }

        // Validate phone
        const phone = document.getElementById('phone').value;
        if (!validatePhone(phone)) {
            showError('phoneError', 'Please enter a valid 10-digit phone number');
            isValid = false;
        }

        // Validate ISBN
        const isbn = document.getElementById('isbn').value.trim();
        if (!validateISBN(isbn)) {
            showError('isbnError', 'Please enter a valid 10 or 13 digit ISBN');
            isValid = false;
        }

        // Validate condition
        const condition = document.getElementById('bookCondition').value;
        if (!condition) {
            showError('conditionError', 'Please select the book condition');
            isValid = false;
        }

        return isValid;
    }

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Get form data
        const formData = {
            fullName: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value,
            isbn: document.getElementById('isbn').value.trim(),
            bookTitle: document.getElementById('bookTitle').value.trim(),
            bookCondition: document.getElementById('bookCondition').value,
            additionalNotes: document.getElementById('additionalNotes').value.trim(),
            submittedAt: new Date().toISOString()
        };

        // Show loading state
        const submitBtn = form.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Submitting...';

        // Simulate submission (in production, this would send to a backend)
        setTimeout(() => {
            // Log submission to console (in production, this would be sent to your server)
            console.log('Textbook Submission:', formData);

            // Store in localStorage as a simple example
            const submissions = JSON.parse(localStorage.getItem('textbookSubmissions') || '[]');
            submissions.push(formData);
            localStorage.setItem('textbookSubmissions', JSON.stringify(submissions));

            // Hide form and show success message
            form.style.display = 'none';
            successMessage.style.display = 'block';

            // Reset button state
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            submitBtn.textContent = 'Submit Textbook';
        }, 1500);
    });
});

// Reset form function
function resetForm() {
    const form = document.getElementById('textbookForm');
    const successMessage = document.getElementById('successMessage');

    form.reset();
    form.style.display = 'flex';
    successMessage.style.display = 'none';

    // Clear any error messages
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => {
        error.textContent = '';
        error.classList.remove('show');
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// View submissions (for testing - access via browser console)
function viewSubmissions() {
    const submissions = JSON.parse(localStorage.getItem('textbookSubmissions') || '[]');
    console.table(submissions);
    return submissions;
}
