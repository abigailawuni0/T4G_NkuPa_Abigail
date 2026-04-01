// Hero Slideshow Implementation
class HeroSlideshow {
    constructor() {
        this.heroElement = document.getElementById('heroSlideshow');
        this.images = JSON.parse(this.heroElement.getAttribute('data-images'));
        this.currentIndex = 0;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 4000; // 4 seconds between slides

        this.layerA = this.heroElement.querySelector('.hero-bg-a');
        this.layerB = this.heroElement.querySelector('.hero-bg-b');
        this.activeLayer = 'a';
        
        this.init();
    }

    init() {
        this.setupDots();
        this.setBackgroundImage(this.currentIndex);
        this.attachEventListeners();
        this.startAutoPlay();
    }

    setupDots() {
        const dotsContainer = this.heroElement.querySelector('.hero-dots');
        dotsContainer.innerHTML = ''; // Clear existing dots
        
        this.images.forEach((image, index) => {
            const dot = document.createElement('div');
            dot.className = 'hero-dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }

    setBackgroundImage(index) {
        this.currentIndex = (index + this.images.length) % this.images.length;
        const imagePath = this.images[this.currentIndex];

        const nextLayer = this.activeLayer === 'a' ? this.layerB : this.layerA;
        const currentLayer = this.activeLayer === 'a' ? this.layerA : this.layerB;

        nextLayer.style.backgroundImage = `url('${imagePath}')`;
        nextLayer.classList.add('active');
        currentLayer.classList.remove('active');

        this.activeLayer = this.activeLayer === 'a' ? 'b' : 'a';

        this.updateDots();
    }

    updateDots() {
        const dots = this.heroElement.querySelectorAll('.hero-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    nextSlide() {
        this.setBackgroundImage(this.currentIndex + 1);
        this.resetAutoPlay();
    }

    prevSlide() {
        this.setBackgroundImage(this.currentIndex - 1);
        this.resetAutoPlay();
    }

    goToSlide(index) {
        this.setBackgroundImage(index);
        this.resetAutoPlay();
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }

    resetAutoPlay() {
        clearInterval(this.autoPlayInterval);
        this.startAutoPlay();
    }

    attachEventListeners() {
        const leftArrow = this.heroElement.querySelector('.hero-arrow-left');
        const rightArrow = this.heroElement.querySelector('.hero-arrow-right');

        leftArrow.addEventListener('click', () => this.prevSlide());
        rightArrow.addEventListener('click', () => this.nextSlide());

        // Pause autoplay on hover
        this.heroElement.addEventListener('mouseenter', () => {
            clearInterval(this.autoPlayInterval);
        });

        // Resume autoplay on mouse leave
        this.heroElement.addEventListener('mouseleave', () => {
            this.startAutoPlay();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
    }
}

// Initialize slideshow when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded fired');
    new HeroSlideshow();
    initSmoothScroll();
    initFormValidation();
    initInteractiveEffects();
    console.log('About to call initProductSearch');
    initProductSearch();
    console.log('initProductSearch completed');
});

// Product Search Functionality
function initProductSearch() {
    console.log('initProductSearch called');
    const searchInput = document.getElementById('product-search');
    const productsGrid = document.querySelector('.products-grid');

    console.log('searchInput found:', !!searchInput);
    console.log('productsGrid found:', !!productsGrid);

    if (searchInput && productsGrid) {
        console.log('Search elements found, initializing...');
        // Store original products for filtering
        const productCards = Array.from(productsGrid.querySelectorAll('.product-card'));
        console.log('Found product cards:', productCards.length);

        // Create no results message element
        let noResultsMsg = productsGrid.querySelector('.no-results');
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results';
            noResultsMsg.textContent = 'No products found matching your search.';
            noResultsMsg.style.display = 'none';
            productsGrid.appendChild(noResultsMsg);
        }

        // Get results count element
        const resultsCount = document.getElementById('search-results-count');

        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();

            // Show/hide clear button based on input
            const clearBtn = document.getElementById('clear-search');
            if (clearBtn) {
                clearBtn.style.display = searchTerm ? 'block' : 'none';
            }

            // Clear any previous results message
            if (resultsCount) {
                resultsCount.textContent = '';
            }
            noResultsMsg.style.display = 'none';

            // Ensure all products are visible (no filtering while typing)
            productCards.forEach(card => {
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            });
        });

        // Add clear search functionality
        const clearBtn = document.getElementById('clear-search');
        if (clearBtn) {
            clearBtn.addEventListener('click', function() {
                searchInput.value = '';
                searchInput.dispatchEvent(new Event('input'));
                searchInput.focus();
            });
        }

        // Add search button functionality
        const searchBtn = document.getElementById('search-btn');
        console.log('searchBtn found:', !!searchBtn);
        if (searchBtn) {
            searchBtn.addEventListener('click', function() {
                console.log('Search button clicked!');
                const searchTerm = searchInput.value.toLowerCase().trim();
                console.log('Search term:', searchTerm);

                if (searchTerm === '') {
                    console.log('Empty search term, focusing input');
                    searchInput.focus();
                    return;
                }

                // First, show all products (remove filtering)
                productCards.forEach(card => {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                });
                noResultsMsg.style.display = 'none';
                if (resultsCount) resultsCount.textContent = '';

                // Find the first matching product
                const matchingProduct = productCards.find(card => {
                    const title = card.querySelector('h3').textContent.toLowerCase();
                    const description = card.querySelector('p').textContent.toLowerCase();
                    const matches = title.includes(searchTerm) || description.includes(searchTerm);
                    console.log(`Checking product: "${title}" - matches: ${matches}`);
                    return matches;
                });

                console.log('Matching product found:', !!matchingProduct);

                if (matchingProduct) {
                    console.log('Attempting to scroll to product');
                    // Get the position of the matching product
                    const rect = matchingProduct.getBoundingClientRect();
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    const targetY = rect.top + scrollTop - 100; // Scroll to 100px above the product

                    console.log('Scrolling to Y position:', targetY);

                    // Smooth scroll to the product
                    window.scrollTo({
                        top: targetY,
                        behavior: 'smooth'
                    });

                    // Add a temporary highlight effect
                    matchingProduct.style.border = '3px solid #D4AF37';
                    matchingProduct.style.transform = 'scale(1.05)';
                    setTimeout(() => {
                        matchingProduct.style.border = '';
                        matchingProduct.style.transform = '';
                    }, 3000);

                    // Update results message
                    if (resultsCount) {
                        resultsCount.textContent = `Found and scrolled to product matching "${searchTerm}"`;
                    }
                } else {
                    console.log('No matching product found');
                    // No matching product found
                    if (resultsCount) {
                        resultsCount.textContent = `No products found matching "${searchTerm}"`;
                    }
                    noResultsMsg.style.display = 'block';
                }
            });
        }
    }
}

// Smooth Scroll Navigation
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('nav a[href^="#"], nav a[href*=".html#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Handle same-page anchors
            if (href.includes('#') && !href.startsWith('pages/') && !href.startsWith('../')) {
                e.preventDefault();
                const targetId = href.split('#')[1];
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Form Validation and Submission
function initFormValidation() {
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form fields
            const nameField = contactForm.querySelector('input[type="text"]');
            const emailField = contactForm.querySelector('input[type="email"]');
            const messageField = contactForm.querySelector('textarea');

            // Validate required fields
            let isValid = true;
            let errors = [];

            // Clear previous error styling
            [nameField, emailField, messageField].forEach(field => {
                field.style.borderColor = '';
            });

            // Check name
            if (!nameField.value.trim()) {
                isValid = false;
                errors.push('Name is required');
                nameField.style.borderColor = '#ff4444';
            }

            // Check email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailField.value.trim()) {
                isValid = false;
                errors.push('Email is required');
                emailField.style.borderColor = '#ff4444';
            } else if (!emailRegex.test(emailField.value.trim())) {
                isValid = false;
                errors.push('Please enter a valid email address');
                emailField.style.borderColor = '#ff4444';
            }

            // Check message
            if (!messageField.value.trim()) {
                isValid = false;
                errors.push('Message is required');
                messageField.style.borderColor = '#ff4444';
            }

            if (!isValid) {
                // Show validation errors
                alert('Please fix the following errors:\n' + errors.join('\n'));
                return;
            }

            // Form is valid - show success message
            alert('Thank you for your message! We will get back to you soon.');

            // Reset form
            contactForm.reset();

            // Clear error styling
            [nameField, emailField, messageField].forEach(field => {
                field.style.borderColor = '';
            });
        });
    }
}

// Interactive Effects
function initInteractiveEffects() {
    // Add hover effects to product cards
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = '0 12px 25px rgba(0,0,0,0.15)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });

        // Add click effect
        card.addEventListener('click', function() {
            this.style.transform = 'translateY(-2px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // Add interactive effects to buttons
    const buttons = document.querySelectorAll('button, .btn');

    buttons.forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });

        button.addEventListener('mouseup', function() {
            this.style.transform = '';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    // Add focus effects for accessibility
    const formInputs = document.querySelectorAll('input, textarea');

    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.borderColor = '#D4AF37';
            this.style.boxShadow = '0 0 5px rgba(212, 175, 55, 0.3)';
        });

        input.addEventListener('blur', function() {
            this.style.borderColor = '';
            this.style.boxShadow = '';
        });
    });
}
