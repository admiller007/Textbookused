// Form validation and submission handling
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('textbookForm');
    const successMessage = document.getElementById('successMessage');
    const booksContainer = document.getElementById('booksContainer');
    const addBookBtn = document.getElementById('addBookBtn');

    let bookCounter = 0;
    let activeScannerBookId = null;
    const fetchTimeouts = {};

    // ISBN Scanner functionality
    initializeScanner();

    // Add first book on load
    addBookEntry();

    // Add book button handler
    addBookBtn.addEventListener('click', function() {
        addBookEntry();
    });

    // Fetch book details from Google Books API
    async function fetchBookDetails(isbn, bookId) {
        const bookTitleInput = document.getElementById(`bookTitle-${bookId}`);
        const bookAuthorInput = document.getElementById(`bookAuthor-${bookId}`);

        try {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
            const data = await response.json();

            if (data.items && data.items.length > 0) {
                const book = data.items[0].volumeInfo;

                // Auto-populate title
                if (book.title && !bookTitleInput.value) {
                    bookTitleInput.value = book.title;
                    // Add a subtle animation
                    bookTitleInput.style.backgroundColor = '#f0fdf4';
                    setTimeout(() => {
                        bookTitleInput.style.backgroundColor = '';
                    }, 1000);
                }

                // Auto-populate author(s)
                if (book.authors && book.authors.length > 0 && !bookAuthorInput.value) {
                    bookAuthorInput.value = book.authors.join(', ');
                    // Add a subtle animation
                    bookAuthorInput.style.backgroundColor = '#f0fdf4';
                    setTimeout(() => {
                        bookAuthorInput.style.backgroundColor = '';
                    }, 1000);
                }
            }
        } catch (error) {
            console.error('Error fetching book details:', error);
            // Silently fail - don't show error to user
        }
    }

    // Function to create a new book entry
    function addBookEntry() {
        bookCounter++;
        const bookId = bookCounter;

        const bookEntry = document.createElement('div');
        bookEntry.className = 'book-entry';
        bookEntry.dataset.bookId = bookId;

        bookEntry.innerHTML = `
            <div class="book-entry-header">
                <h3 class="book-entry-title">Book ${bookId}</h3>
                ${bookCounter > 1 ? `
                <button type="button" class="remove-book-btn" data-book-id="${bookId}" title="Remove book">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
                ` : ''}
            </div>

            <div class="form-group">
                <label for="isbn-${bookId}">ISBN Number</label>
                <div class="isbn-input-wrapper">
                    <input
                        type="text"
                        id="isbn-${bookId}"
                        name="isbn"
                        class="isbn-input"
                        data-book-id="${bookId}"
                        required
                        placeholder="Enter ISBN or scan barcode"
                        pattern="[0-9\\-]{10,17}"
                    >
                    <button type="button" class="scan-btn" data-book-id="${bookId}" title="Scan barcode">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                            <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/>
                            <rect x="9" y="9" width="6" height="6"/>
                        </svg>
                    </button>
                </div>
                <span class="error-message" id="isbnError-${bookId}"></span>
            </div>

            <div class="form-group">
                <label for="bookTitle-${bookId}">Book Title <span class="optional">(Optional)</span></label>
                <input
                    type="text"
                    id="bookTitle-${bookId}"
                    name="bookTitle"
                    class="book-title-input"
                    data-book-id="${bookId}"
                    placeholder="Introduction to Psychology"
                >
            </div>

            <div class="form-group">
                <label for="bookAuthor-${bookId}">Author <span class="optional">(Optional)</span></label>
                <input
                    type="text"
                    id="bookAuthor-${bookId}"
                    name="bookAuthor"
                    class="book-author-input"
                    data-book-id="${bookId}"
                    placeholder="Jane Smith"
                >
            </div>

            <div class="form-group">
                <label for="bookCondition-${bookId}">Condition</label>
                <select id="bookCondition-${bookId}" name="bookCondition" class="book-condition-select" data-book-id="${bookId}" required>
                    <option value="">Select condition</option>
                    <option value="like-new">Like New</option>
                    <option value="good">Good</option>
                    <option value="acceptable">Acceptable</option>
                    <option value="poor">Poor</option>
                </select>
                <span class="error-message" id="conditionError-${bookId}"></span>
            </div>

            <div class="form-group">
                <label for="additionalNotes-${bookId}">Additional Notes <span class="optional">(Optional)</span></label>
                <textarea
                    id="additionalNotes-${bookId}"
                    name="additionalNotes"
                    class="book-notes-textarea"
                    data-book-id="${bookId}"
                    rows="4"
                    placeholder="Any additional details about your book..."
                ></textarea>
            </div>
        `;

        booksContainer.appendChild(bookEntry);

        // Add event listeners for this book entry
        const isbnInput = bookEntry.querySelector('.isbn-input');
        const scanBtn = bookEntry.querySelector('.scan-btn');
        const removeBtn = bookEntry.querySelector('.remove-book-btn');

        // ISBN formatting
        isbnInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^\d-]/g, '');
            e.target.value = value;
        });

        // Auto-populate book details when ISBN is entered
        isbnInput.addEventListener('input', function(e) {
            const isbn = e.target.value.replace(/[^\d]/g, '');

            // Clear previous timeout for this book
            if (fetchTimeouts[bookId]) {
                clearTimeout(fetchTimeouts[bookId]);
            }

            // Only fetch if we have a complete ISBN (10 or 13 digits)
            if (isbn.length === 10 || isbn.length === 13) {
                // Debounce API call by 500ms
                fetchTimeouts[bookId] = setTimeout(() => {
                    fetchBookDetails(isbn, bookId);
                }, 500);
            }
        });

        // Scan button
        scanBtn.addEventListener('click', function() {
            activeScannerBookId = bookId;
            openScanner();
        });

        // Remove button
        if (removeBtn) {
            removeBtn.addEventListener('click', function() {
                removeBookEntry(bookId);
            });
        }

        // Renumber all book entries
        renumberBooks();
    }

    // Function to remove a book entry
    function removeBookEntry(bookId) {
        const bookEntry = booksContainer.querySelector(`[data-book-id="${bookId}"]`);
        if (bookEntry) {
            bookEntry.remove();
            renumberBooks();
            // Clear timeout for this book
            if (fetchTimeouts[bookId]) {
                clearTimeout(fetchTimeouts[bookId]);
                delete fetchTimeouts[bookId];
            }
        }
    }

    // Function to renumber book entries
    function renumberBooks() {
        const bookEntries = booksContainer.querySelectorAll('.book-entry');
        bookEntries.forEach((entry, index) => {
            const title = entry.querySelector('.book-entry-title');
            if (title) {
                title.textContent = `Book ${index + 1}`;
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
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    // Hide error message
    function hideError(elementId) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
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

        // Validate each book
        const bookEntries = booksContainer.querySelectorAll('.book-entry');
        bookEntries.forEach(entry => {
            const bookId = entry.dataset.bookId;

            // Validate ISBN
            const isbn = document.getElementById(`isbn-${bookId}`).value.trim();
            if (!validateISBN(isbn)) {
                showError(`isbnError-${bookId}`, 'Please enter a valid 10 or 13 digit ISBN');
                isValid = false;
            }

            // Validate condition
            const condition = document.getElementById(`bookCondition-${bookId}`).value;
            if (!condition) {
                showError(`conditionError-${bookId}`, 'Please select the book condition');
                isValid = false;
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

        // Get contact information
        const contactInfo = {
            fullName: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value
        };

        // Get all books data
        const books = [];
        const bookEntries = booksContainer.querySelectorAll('.book-entry');
        bookEntries.forEach(entry => {
            const bookId = entry.dataset.bookId;
            books.push({
                isbn: document.getElementById(`isbn-${bookId}`).value.trim(),
                bookTitle: document.getElementById(`bookTitle-${bookId}`).value.trim(),
                bookAuthor: document.getElementById(`bookAuthor-${bookId}`).value.trim(),
                bookCondition: document.getElementById(`bookCondition-${bookId}`).value,
                additionalNotes: document.getElementById(`additionalNotes-${bookId}`).value.trim()
            });
        });

        // Create submission data
        const formData = {
            ...contactInfo,
            books: books,
            submittedAt: new Date().toISOString()
        };

        // Show loading state
        const submitBtn = form.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Submitting...';

        // Submit to Firebase
        submitToFirebase(formData)
            .then(() => {
                // Hide form and show success message
                form.style.display = 'none';
                successMessage.style.display = 'block';

                // Reset button state
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
                submitBtn.textContent = 'Submit Request';
            })
            .catch((error) => {
                console.error('Submission error:', error);

                // Show error to user
                alert('There was an error submitting your textbook. Please try again or contact support.');

                // Reset button state
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
                submitBtn.textContent = 'Submit Request';
            });
    });

    // Submit data to Firebase
    async function submitToFirebase(formData) {
        // Check if Firebase is initialized
        if (typeof db === 'undefined') {
            console.warn('Firebase not configured. Saving to localStorage instead.');
            // Fallback to localStorage if Firebase is not configured
            const submissions = JSON.parse(localStorage.getItem('textbookSubmissions') || '[]');
            submissions.push(formData);
            localStorage.setItem('textbookSubmissions', JSON.stringify(submissions));
            return Promise.resolve();
        }

        try {
            // Add server timestamp
            const dataToSubmit = {
                ...formData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            // Add document to Firestore
            const docRef = await db.collection('textbook_submissions').add(dataToSubmit);
            console.log('Submission saved with ID:', docRef.id);

            // Also save to localStorage as backup
            const submissions = JSON.parse(localStorage.getItem('textbookSubmissions') || '[]');
            submissions.push({ ...formData, firestoreId: docRef.id });
            localStorage.setItem('textbookSubmissions', JSON.stringify(submissions));

            return docRef;
        } catch (error) {
            console.error('Firebase submission error:', error);
            throw error;
        }
    }
});

// Reset form function
function resetForm() {
    const form = document.getElementById('textbookForm');
    const successMessage = document.getElementById('successMessage');
    const booksContainer = document.getElementById('booksContainer');

    // Clear the books container
    booksContainer.innerHTML = '';

    // Reset the form
    form.reset();
    form.style.display = 'flex';
    successMessage.style.display = 'none';

    // Clear any error messages
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => {
        error.textContent = '';
        error.classList.remove('show');
    });

    // Reset book counter and add first book
    document.dispatchEvent(new Event('DOMContentLoaded'));

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
function initializeScanner() {
    const scannerModal = document.getElementById('scannerModal');
    const closeScanner = document.getElementById('closeScanner');
    const scannerStatus = document.getElementById('scannerStatus');

    let isScanning = false;
    let currentBookId = null;

    // Make openScanner globally accessible
    window.openScanner = function() {
        scannerModal.style.display = 'flex';
        startScanner();
    };

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
                    // Find the active scanner book input
                    const activeBookEntry = document.querySelector(`[data-book-id="${window.activeScannerBookId || 1}"]`);
                    if (activeBookEntry) {
                        const isbnInput = activeBookEntry.querySelector('.isbn-input');
                        if (isbnInput) {
                            // Populate the ISBN field
                            isbnInput.value = code;

                            // Trigger input event to format the value and fetch book details
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
