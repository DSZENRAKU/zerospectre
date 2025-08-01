/**
 * Zerospectre - Cybersecurity Company Website
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease',
        once: true,
        offset: 100
    });

    // Mobile Menu Toggle
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburgerBtn && mobileMenu) {
        // Handle both click and touch events for better mobile experience
        ['click', 'touchend'].forEach(eventType => {
            hamburgerBtn.addEventListener(eventType, function(e) {
                if (eventType === 'touchend') {
                    e.preventDefault(); // Prevent default touch behavior
                }
                this.classList.toggle('active');
                mobileMenu.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });
        });
    }

    // Close mobile menu when clicking or touching outside
    ['click', 'touchend'].forEach(eventType => {
        document.addEventListener(eventType, function(event) {
            if (mobileMenu && hamburgerBtn && 
                !mobileMenu.contains(event.target) && 
                !hamburgerBtn.contains(event.target) && 
                mobileMenu.classList.contains('active')) {
                
                if (eventType === 'touchend') {
                    event.preventDefault(); // Prevent default touch behavior
                }
                
                mobileMenu.classList.remove('active');
                hamburgerBtn.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Back to Top Button
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Cookie Consent
    const cookieConsent = document.getElementById('cookieConsent');
    const cookieAccept = document.getElementById('cookieAccept');
    const cookieDecline = document.getElementById('cookieDecline');

    if (cookieConsent && cookieAccept && cookieDecline) {
        // Check if user has already made a choice
        if (!localStorage.getItem('cookieConsent')) {
            // Show the cookie consent banner after a short delay
            setTimeout(function() {
                cookieConsent.style.display = 'block';
            }, 2000);
        }

        cookieAccept.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieConsent.style.display = 'none';
        });

        cookieDecline.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'declined');
            cookieConsent.style.display = 'none';
        });
    }

    // Testimonial Slider
    initTestimonialSlider();

    // FAQ Accordion
    initFaqAccordion();

    // Filter functionality for Case Studies and Blog
    initFilters();

    // Form validation
    initFormValidation();

    // Particle background effect for hero section
    initParticleBackground();

    // Contact form handling for Netlify
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            // Let Netlify handle the form submission naturally
            // Only add client-side validation and UI feedback
            
            // Validate required fields
            let isValid = true;
            // Only validate the new minimal fields
            const nameField = contactForm.querySelector('#name');
            const emailField = contactForm.querySelector('#email');
            const phoneField = contactForm.querySelector('#phone');
            const serviceTypeField = contactForm.querySelector('#serviceType');
            const messageField = contactForm.querySelector('#message');

            // Helper for error
            function setError(field, msg) {
                isValid = false;
                field.classList.add('error');
                let errorMsg = field.parentNode.querySelector('.error-message');
                if (!errorMsg) {
                    errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    field.parentNode.appendChild(errorMsg);
                }
                errorMsg.textContent = msg;
            }
            function clearError(field) {
                field.classList.remove('error');
                const errorMsg = field.parentNode.querySelector('.error-message');
                if (errorMsg) errorMsg.remove();
            }

            // Name
            if (!nameField.value.trim()) setError(nameField, 'Name is required'); else clearError(nameField);
            // Email
            if (!emailField.value.trim()) setError(emailField, 'Email is required');
            else {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value.trim())) setError(emailField, 'Please enter a valid email address');
                else clearError(emailField);
            }
            // Phone
            if (!phoneField.value.trim()) setError(phoneField, 'Contact number is required');
            else {
                const phoneRegex = /^[\+]?[0-9\-\s\(\)]{7,20}$/;
                if (!phoneRegex.test(phoneField.value.trim())) setError(phoneField, 'Please enter a valid phone number');
                else clearError(phoneField);
            }
            // Service of Interest
            if (!serviceTypeField.value.trim()) setError(serviceTypeField, 'Please select a service'); else clearError(serviceTypeField);
            // Message
            if (!messageField.value.trim()) setError(messageField, 'Message is required'); else clearError(messageField);

            if (!isValid) {
                event.preventDefault();
                // Scroll to first error
                const firstError = contactForm.querySelector('.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }

            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            // Prevent default form submission and handle it manually
            event.preventDefault();
            
            // Prepare form data for Netlify
            const formData = new FormData(contactForm);
            formData.set('form-name', 'contact');

            // Submit to Netlify
            fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            })
            .then(response => {
                if (response.ok) {
                    showThankYouPopup();
                    contactForm.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .catch(error => {
                console.error('Form submission error:', error);
                // Show a more user-friendly error message
                const errorPopup = document.createElement('div');
                errorPopup.className = 'thank-you-popup';
                errorPopup.innerHTML = `
                    <div class="thank-you-content">
                        <div class="thank-you-icon" style="color: var(--color-danger);">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <h3>Submission Error</h3>
                        <p>There was a problem submitting your form. Please try again or contact us directly at support@zerospectre.com</p>
                        <div class="popup-actions">
                            <button class="btn-primary close-popup">Close</button>
                            <a href="mailto:support@zerospectre.com" class="btn-secondary">Email Us</a>
                        </div>
                    </div>
                `;
                document.body.appendChild(errorPopup);
                setTimeout(() => errorPopup.classList.add('active'), 10);
                
                // Close functionality
                errorPopup.querySelector('.close-popup').onclick = () => {
                    errorPopup.classList.remove('active');
                    setTimeout(() => document.body.removeChild(errorPopup), 300);
                };
                errorPopup.onclick = e => {
                    if (e.target === errorPopup) {
                        errorPopup.classList.remove('active');
                        setTimeout(() => document.body.removeChild(errorPopup), 300);
                    }
                };
            })
            .finally(() => {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
        });
    }
});

/**
 * Initialize testimonial slider functionality
 */
function initTestimonialSlider() {
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');

    if (testimonialSlides.length > 0 && prevBtn && nextBtn) {
        let currentSlide = 0;

        // Hide all slides except the first one
        testimonialSlides.forEach((slide, index) => {
            if (index !== 0) {
                slide.style.display = 'none';
            }
        });

        // Function to show a specific slide
        function showSlide(index) {
            // Hide all slides
            testimonialSlides.forEach(slide => {
                slide.style.display = 'none';
            });

            // Show the selected slide
            testimonialSlides[index].style.display = 'block';
        }

        // Event listeners for navigation buttons
        nextBtn.addEventListener('click', function() {
            currentSlide = (currentSlide + 1) % testimonialSlides.length;
            showSlide(currentSlide);
        });

        prevBtn.addEventListener('click', function() {
            currentSlide = (currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length;
            showSlide(currentSlide);
        });

        // Auto-advance slides every 5 seconds
        setInterval(function() {
            currentSlide = (currentSlide + 1) % testimonialSlides.length;
            showSlide(currentSlide);
        }, 5000);
    }
}

/**
 * Initialize FAQ accordion functionality
 */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            if (question) {
                question.addEventListener('click', function() {
                    // Toggle active class on the clicked item
                    item.classList.toggle('active');
                    
                    // Close other items
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item && otherItem.classList.contains('active')) {
                            otherItem.classList.remove('active');
                        }
                    });
                });
            }
        });
    }
}

/**
 * Initialize filter functionality for Case Studies and Blog
 */
function initFilters() {
    // Case Studies filters
    const caseStudyFilters = document.querySelectorAll('.case-studies-filter .filter-btn');
    const caseStudyItems = document.querySelectorAll('.case-study-card');

    if (caseStudyFilters.length > 0 && caseStudyItems.length > 0) {
        caseStudyFilters.forEach(filter => {
            filter.addEventListener('click', function() {
                // Remove active class from all filters
                caseStudyFilters.forEach(f => f.classList.remove('active'));
                
                // Add active class to clicked filter
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                // Show/hide case study items based on filter
                caseStudyItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // Blog filters
    const blogFilters = document.querySelectorAll('.blog-filter .filter-btn');
    const blogItems = document.querySelectorAll('.article-card');

    if (blogFilters.length > 0 && blogItems.length > 0) {
        blogFilters.forEach(filter => {
            filter.addEventListener('click', function() {
                // Remove active class from all filters
                blogFilters.forEach(f => f.classList.remove('active'));
                
                // Add active class to clicked filter
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                // Show/hide blog items based on filter
                blogItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
}

/**
 * Initialize form validation
 */
function initFormValidation() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Remove error class on input
        const formInputs = contactForm.querySelectorAll('input, textarea, select');
        formInputs.forEach(input => {
            input.addEventListener('input', function() {
                this.classList.remove('error');
                const errorMsg = this.parentNode.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.remove();
                }
            });
            
            // Add blur validation for better UX
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    }
}

/**
 * Validate individual form field
 */
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Remove existing error
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation
    if (fieldName === 'phone' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
        if (!phoneRegex.test(cleanPhone)) {
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    return true;
}

/**
 * Show error message for a field
 */
function showFieldError(field, message) {
    field.classList.add('error');
    const errorMsg = document.createElement('div');
    errorMsg.className = 'error-message';
    errorMsg.textContent = message;
    field.parentNode.appendChild(errorMsg);
}

// Popup function
function showThankYouPopup() {
    const popup = document.createElement('div');
    popup.className = 'thank-you-popup';
    popup.innerHTML = `
        <div class="thank-you-content">
            <div class="thank-you-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>Message Sent Successfully!</h3>
            <p>Thank you for contacting Zerospectre. Our cybersecurity experts will review your inquiry and get back to you within 24 business hours.</p>
            <div class="response-info">
                <div class="info-item">
                    <i class="fas fa-clock"></i>
                    <span>Response Time: Within 24 hours</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-envelope"></i>
                    <span>Confirmation email sent</span>
                </div>
            </div>
            <div class="popup-actions">
                <button class="btn-primary close-popup">Close</button>
                <a href="services.html" class="btn-secondary">Explore Services</a>
            </div>
        </div>
    `;
    document.body.appendChild(popup);
    
    // Add active class after a small delay for smooth animation
    setTimeout(() => popup.classList.add('active'), 10);
    
    // Close button functionality
    popup.querySelector('.close-popup').onclick = () => {
        popup.classList.remove('active');
        setTimeout(() => document.body.removeChild(popup), 300);
    };
    
    // Close on background click
    popup.onclick = e => {
        if (e.target === popup) {
            popup.classList.remove('active');
            setTimeout(() => document.body.removeChild(popup), 300);
        }
    };
    
    // Close on escape key
    document.addEventListener('keydown', function closeOnEscape(e) {
        if (e.key === 'Escape') {
            popup.classList.remove('active');
            setTimeout(() => document.body.removeChild(popup), 300);
            document.removeEventListener('keydown', closeOnEscape);
        }
    });
}

/**
 * Initialize particle background effect for hero section
 */
function initParticleBackground() {
    const heroSection = document.querySelector('.hero');
    
    if (heroSection) {
        // Create canvas element
        const canvas = document.createElement('canvas');
        canvas.className = 'particle-canvas';
        heroSection.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        let particles = [];
        
        // Set canvas size
        function resizeCanvas() {
            canvas.width = heroSection.offsetWidth;
            canvas.height = heroSection.offsetHeight;
        }
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Particle class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.color = `rgba(0, 255, 240, ${Math.random() * 0.5})`;
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                // Wrap around edges
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }
            
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Create particles
        function initParticles() {
            particles = [];
            const particleCount = Math.min(Math.floor(canvas.width * canvas.height / 10000), 100);
            
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }
        
        // Draw particles and connections
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                
                // Draw connections between particles
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 255, 240, ${0.1 * (1 - distance / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            
            requestAnimationFrame(animate);
        }
        
        initParticles();
        animate();
    }
}