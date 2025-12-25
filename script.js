// Form validation and submission handling
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('textbookForm');
    const successMessage = document.getElementById('successMessage');
    const booksContainer = document.getElementById('booksContainer');
    const addBookBtn = document.getElementById('addBookBtn');

    let bookCounter = 0;

    // ISBN Scanner functionality
    initializeScanner();

    // Add first book entry on load
    addBookEntry();

    // Add book button handler
    addBookBtn.addEventListener('click', function() {
        addBookEntry();
    });

    // Function to add a new book entry
    function addBookEntry() {
        bookCounter++;
        const bookId = bookCounter;

        const bookEntry = document.createElement('div');
        bookEntry.className = 'book-entry';
        bookEntry.setAttribute('data-book-id', bookId);
        bookEntry.innerHTML = `
            <div class="book-entry-header">
                <h3>Book ${bookId}</h3>
                ${bookId > 1 ? '<button type="button" class="remove-book-btn" data-book-id="' + bookId + '">&times; Remove</button>' : ''}
            </div>

            <div class="form-group">
                <label for="isbn-${bookId}">ISBN Number *</label>
                <div class="isbn-input-wrapper">
                    <input
                        type="text"
                        id="isbn-${bookId}"
                        name="isbn-${bookId}"
                        class="isbn-input"
                        required
                        placeholder="Enter 10 or 13 digit ISBN"
                        pattern="[0-9\\-]{10,17}"
                        data-book-id="${bookId}"
                    >
                    <button type="button" class="scan-btn" data-book-id="${bookId}" title="Scan barcode">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <path d="M9 3v18M15 3v18"/>
                        </svg>
                        Scan
                    </button>
                </div>
                <span class="error-message" id="isbnError-${bookId}"></span>
                <small class="help-text">ISBN can be found on the back cover or copyright page</small>
            </div>

            <div class="form-group">
                <label for="bookTitle-${bookId}">Book Title (Optional)</label>
                <input
                    type="text"
                    id="bookTitle-${bookId}"
                    name="bookTitle-${bookId}"
                    class="book-title-input"
                    placeholder="Enter book title if known"
                >
            </div>

            <div class="form-group">
                <label for="bookCondition-${bookId}">Book Condition *</label>
                <select id="bookCondition-${bookId}" name="bookCondition-${bookId}" class="book-condition-select" required>
                    <option value="">Select condition</option>
                    <option value="like-new">Like New - No markings, pristine condition</option>
                    <option value="good">Good - Minor wear, minimal markings</option>
                    <option value="acceptable">Acceptable - Moderate wear, some markings</option>
                    <option value="poor">Poor - Heavy wear, extensive markings</option>
                </select>
                <span class="error-message" id="conditionError-${bookId}"></span>
            </div>

            <div class="form-group">
                <label for="additionalNotes-${bookId}">Additional Notes (Optional)</label>
                <textarea
                    id="additionalNotes-${bookId}"
                    name="additionalNotes-${bookId}"
                    class="book-notes-textarea"
                    rows="4"
                    placeholder="Any additional information about the book..."
                ></textarea>
            </div>
        `;

        booksContainer.appendChild(bookEntry);

        // Add ISBN formatting for this book's ISBN input
        const isbnInput = bookEntry.querySelector(`#isbn-${bookId}`);
        isbnInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^\d-]/g, '');
            e.target.value = value;
        });

        // Add scan button click handler - FIX: Set window.activeScannerBookId
        const scanBtn = bookEntry.querySelector('.scan-btn');
        scanBtn.addEventListener('click', function() {
            const bookId = this.getAttribute('data-book-id');
            // FIX: Store in window object so scanner callback can access it
            window.activeScannerBookId = bookId;
            document.getElementById('scannerModal').style.display = 'flex';
            startScanner();
        });

        // Add remove button handler if it exists
        const removeBtn = bookEntry.querySelector('.remove-book-btn');
        if (removeBtn) {
            removeBtn.addEventListener('click', function() {
                const bookId = this.getAttribute('data-book-id');
                const entry = document.querySelector(`.book-entry[data-book-id="${bookId}"]`);
                entry.remove();
                renumberBooks();
            });
        }
    }

    // Function to renumber books after removal
    function renumberBooks() {
        const bookEntries = booksContainer.querySelectorAll('.book-entry');
        bookEntries.forEach((entry, index) => {
            const newNumber = index + 1;
            const header = entry.querySelector('.book-entry-header h3');
            if (header) {
                header.textContent = `Book ${newNumber}`;
            }
        });
    }

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

    // ISBN formatting is now handled in addBookEntry function

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

        // Validate all books
        const bookEntries = document.querySelectorAll('.book-entry');
        bookEntries.forEach(entry => {
            const bookId = entry.getAttribute('data-book-id');

            // Validate ISBN
            const isbnInput = entry.querySelector(`#isbn-${bookId}`);
            if (isbnInput) {
                const isbn = isbnInput.value.trim();
                if (!validateISBN(isbn)) {
                    showError(`isbnError-${bookId}`, 'Please enter a valid 10 or 13 digit ISBN');
                    isValid = false;
                }
            }

            // Validate condition
            const conditionSelect = entry.querySelector(`#bookCondition-${bookId}`);
            if (conditionSelect) {
                const condition = conditionSelect.value;
                if (!condition) {
                    showError(`conditionError-${bookId}`, 'Please select the book condition');
                    isValid = false;
                }
            }
        });

        return isValid;
    }

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Get form data
        const books = [];
        const bookEntries = document.querySelectorAll('.book-entry');
        bookEntries.forEach(entry => {
            const bookId = entry.getAttribute('data-book-id');
            books.push({
                isbn: document.getElementById(`isbn-${bookId}`).value.trim(),
                title: document.getElementById(`bookTitle-${bookId}`).value.trim(),
                condition: document.getElementById(`bookCondition-${bookId}`).value,
                notes: document.getElementById(`additionalNotes-${bookId}`).value.trim()
            });
        });

        const formData = {
            fullName: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value,
            books: books,
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

// ISBN Scanner functionality
// Make scanner control variables global so they can be accessed from addBookEntry
let isScanning = false;

function initializeScanner() {
    const scannerModal = document.getElementById('scannerModal');
    const closeScanner = document.getElementById('closeScanner');
    const scannerStatus = document.getElementById('scannerStatus');

    // Close scanner modal
    closeScanner.addEventListener('click', function() {
        stopScanner();
        scannerModal.style.display = 'none';
    });

    // Close modal when clicking outside
    scannerModal.addEventListener('click', function(e) {
        if (e.target === scannerModal) {
            stopScanner();
            scannerModal.style.display = 'none';
        }
    });

    // Make startScanner available globally
    window.startScanner = startScanner;
    window.stopScanner = stopScanner;

    function startScanner() {
        if (isScanning) return;

        scannerStatus.textContent = 'Initializing camera...';
        isScanning = true;

        // Check if Quagga is loaded
        if (typeof Quagga === 'undefined') {
            scannerStatus.textContent = 'Scanner library not loaded. Please refresh the page.';
            isScanning = false;
            return;
        }

        Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: document.querySelector('#interactive'),
                constraints: {
                    width: { min: 640 },
                    height: { min: 480 },
                    facingMode: "environment",
                    aspectRatio: { min: 1, max: 2 }
                },
            },
            locator: {
                patchSize: "medium",
                halfSample: true
            },
            numOfWorkers: 2,
            decoder: {
                readers: [
                    "ean_reader",
                    "ean_8_reader",
                    "code_128_reader",
                    "code_39_reader"
                ]
            },
            locate: true
        }, function(err) {
            if (err) {
                console.error('Scanner initialization error:', err);
                scannerStatus.textContent = 'Camera access denied or not available. Please check permissions.';
                isScanning = false;
                return;
            }
            scannerStatus.textContent = 'Scanner ready - position barcode in view';
            Quagga.start();
        });

        // Handle detected barcodes
        Quagga.onDetected(function(result) {
            if (result && result.codeResult && result.codeResult.code) {
                const code = result.codeResult.code;

                // Validate that it's a valid ISBN length
                if (code.length === 10 || code.length === 13) {
                    // FIX: Use window.activeScannerBookId to route to correct book entry
                    const bookId = window.activeScannerBookId || '1'; // Fallback to book 1
                    const isbnInput = document.getElementById(`isbn-${bookId}`);

                    if (isbnInput) {
                        // Populate the ISBN field
                        isbnInput.value = code;

                        // Trigger input event to format the value
                        isbnInput.dispatchEvent(new Event('input', { bubbles: true }));

                        // Show success status
                        scannerStatus.textContent = 'ISBN detected: ' + code;

                        // Close scanner after a short delay
                        setTimeout(function() {
                            stopScanner();
                            scannerModal.style.display = 'none';
                        }, 1000);
                    }
                }
            }
        });
    }

    function stopScanner() {
        if (isScanning && typeof Quagga !== 'undefined') {
            Quagga.stop();
            isScanning = false;
        }
    }
}
