// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Initialize all components
    initNavigation();
    initCarousel();
    initFilters();
    initScrollEffects();
    initContactForm();
    initResumeControls();
    initBackToTop();
    initSmoothScrolling();
    initAnimations();
    
    console.log('Personal website initialized successfully');
});

// ===== NAVIGATION SYSTEM =====
function initNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('nav-open');
            }
        });
    }
    
    // Navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            showSection(targetSection);
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Close mobile menu
            if (navToggle && navMenu) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('nav-open');
            }
        });
    });
    
    // Button navigation
    const navButtons = document.querySelectorAll('[data-section]');
    navButtons.forEach(button => {
        if (!button.classList.contains('nav-link')) {
            button.addEventListener('click', function() {
                const targetSection = this.getAttribute('data-section');
                showSection(targetSection);
                
                // Update active nav link
                navLinks.forEach(l => l.classList.remove('active'));
                const correspondingNavLink = document.querySelector(`.nav-link[data-section="${targetSection}"]`);
                if (correspondingNavLink) {
                    correspondingNavLink.classList.add('active');
                }
            });
        }
    });
    
    // Show section function
    function showSection(sectionName) {
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Trigger animations for the active section
            triggerSectionAnimations(targetSection);
        }
    }
    
    // Scroll effects for navigation
    let lastScrollY = 0;
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 80) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
    });
}

// ===== CAROUSEL FUNCTIONALITY =====
function initCarousel() {
    const carousel = document.getElementById('hero-carousel');
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.querySelectorAll('.carousel-dot');
    const prevBtn = carousel.querySelector('.carousel-btn-prev');
    const nextBtn = carousel.querySelector('.carousel-btn-next');
    
    let currentSlide = 0;
    let autoplayInterval;
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentSlide = index;
    }
    
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }
    
    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }
    
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            nextSlide();
            stopAutoplay();
            setTimeout(startAutoplay, 3000); // Restart autoplay after 3 seconds
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            prevSlide();
            stopAutoplay();
            setTimeout(startAutoplay, 3000);
        });
    }
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showSlide(index);
            stopAutoplay();
            setTimeout(startAutoplay, 3000);
        });
    });
    
    // Pause on hover
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    
    // Touch/swipe support
    let startX = 0;
    let endX = 0;
    
    carousel.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        stopAutoplay();
    });
    
    carousel.addEventListener('touchmove', function(e) {
        endX = e.touches[0].clientX;
    });
    
    carousel.addEventListener('touchend', function() {
        const threshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        
        setTimeout(startAutoplay, 3000);
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (document.getElementById('home').classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                stopAutoplay();
                setTimeout(startAutoplay, 3000);
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                stopAutoplay();
                setTimeout(startAutoplay, 3000);
            }
        }
    });
    
    // Start autoplay
    startAutoplay();
}

// ===== FILTER FUNCTIONALITY =====
function initFilters() {
    // Project filters
    initProjectFilters();
    
    // Writing filters
    initWritingFilters();
}

function initProjectFilters() {
    const filterTags = document.querySelectorAll('#projects .filter-tag');
    const projectCards = document.querySelectorAll('.projects-container .project-card');
    const searchInput = document.getElementById('project-search');
    
    let currentFilter = 'all';
    let currentSearch = '';
    
    function filterProjects() {
        projectCards.forEach(card => {
            const categories = card.getAttribute('data-categories') || '';
            const title = card.querySelector('.project-title').textContent.toLowerCase();
            const description = card.querySelector('.project-description').textContent.toLowerCase();
            
            const matchesFilter = currentFilter === 'all' || categories.includes(currentFilter);
            const matchesSearch = currentSearch === '' || 
                title.includes(currentSearch) || 
                description.includes(currentSearch);
            
            if (matchesFilter && matchesSearch) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.3s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Show no results message if needed
        const visibleCards = Array.from(projectCards).filter(card => card.style.display !== 'none');
        showNoResults('projects', visibleCards.length === 0);
    }
    
    // Filter tag clicks
    filterTags.forEach(tag => {
        tag.addEventListener('click', function() {
            filterTags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.getAttribute('data-filter');
            filterProjects();
        });
    });
    
    // Search input
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            currentSearch = this.value.toLowerCase();
            filterProjects();
        }, 300));
    }
}

function initWritingFilters() {
    const filterTags = document.querySelectorAll('#writing .filter-tag');
    const writingItems = document.querySelectorAll('.writing-list .writing-item');
    
    let currentFilter = 'all';
    
    function filterWriting() {
        writingItems.forEach(item => {
            const category = item.getAttribute('data-category') || '';
            
            const matchesFilter = currentFilter === 'all' || category === currentFilter;
            
            if (matchesFilter) {
                item.style.display = 'grid';
                item.style.animation = 'fadeInUp 0.3s ease forwards';
            } else {
                item.style.display = 'none';
            }
        });
        
        // Show no results message if needed
        const visibleItems = Array.from(writingItems).filter(item => item.style.display !== 'none');
        showNoResults('writing', visibleItems.length === 0);
    }
    
    filterTags.forEach(tag => {
        tag.addEventListener('click', function() {
            filterTags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.getAttribute('data-filter');
            filterWriting();
        });
    });
}

function showNoResults(section, show) {
    let noResultsEl = document.getElementById(`${section}-no-results`);
    
    if (show && !noResultsEl) {
        noResultsEl = document.createElement('div');
        noResultsEl.id = `${section}-no-results`;
        noResultsEl.className = 'no-results';
        noResultsEl.innerHTML = `
            <div class="no-results-content">
                <i data-lucide="search-x"></i>
                <h3>No results found</h3>
                <p>Try adjusting your filters or search terms.</p>
                <button class="btn btn-secondary clear-filters">Clear all filters</button>
            </div>
        `;
        
        const container = section === 'projects' ? 
            document.querySelector('.projects-container') : 
            document.querySelector('.writing-list');
        
        if (container) {
            container.appendChild(noResultsEl);
            
            // Clear filters button
            const clearBtn = noResultsEl.querySelector('.clear-filters');
            clearBtn.addEventListener('click', function() {
                // Reset filters
                const filterTags = document.querySelectorAll(`#${section} .filter-tag`);
                filterTags.forEach(tag => tag.classList.remove('active'));
                filterTags[0].classList.add('active');
                
                // Reset search
                const searchInput = document.getElementById(`${section}-search`);
                if (searchInput) searchInput.value = '';
                
                // Re-trigger filtering
                if (section === 'projects') {
                    initProjectFilters();
                } else {
                    initWritingFilters();
                }
            });
        }
        
        // Re-initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    } else if (!show && noResultsEl) {
        noResultsEl.remove();
    }
}

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.project-card, .writing-card, .timeline-item, .skill-bar, .contact-item'
    );
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Skill bar animations
    const skillBars = document.querySelectorAll('.skill-bar');
    const skillObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillFill = entry.target.querySelector('.skill-fill');
                if (skillFill) {
                    const width = skillFill.style.width;
                    skillFill.style.width = '0%';
                    setTimeout(() => {
                        skillFill.style.width = width;
                    }, 200);
                }
            }
        });
    }, observerOptions);
    
    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// ===== CONTACT FORM =====
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        // Show loading state
        btnText.classList.add('hidden');
        btnLoading.classList.remove('hidden');
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual form handling)
        setTimeout(() => {
            // Show success message
            showToast('Message sent successfully!', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Reset button state
            btnText.classList.remove('hidden');
            btnLoading.classList.add('hidden');
            submitBtn.disabled = false;
        }, 2000);
    });
    
    // Form validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Required field check
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Show/hide error
    showFieldError(field, isValid ? '' : errorMessage);
    
    return isValid;
}

function showFieldError(field, message) {
    // Remove existing error
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    field.classList.remove('error');
    
    if (message) {
        field.classList.add('error');
        
        const errorEl = document.createElement('span');
        errorEl.className = 'field-error';
        errorEl.textContent = message;
        field.parentNode.appendChild(errorEl);
    }
}

// ===== RESUME CONTROLS =====
function initResumeControls() {
    const langButtons = document.querySelectorAll('.lang-btn');
    const resumeContents = document.querySelectorAll('.resume-content');
    const viewResumeBtn = document.getElementById('view-resume');
    const downloadResumeBtn = document.getElementById('download-resume');
    
    // Language toggle
    langButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            
            langButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            resumeContents.forEach(content => {
                content.classList.add('hidden');
            });
            
            const targetContent = document.getElementById(`resume-${lang}`);
            if (targetContent) {
                targetContent.classList.remove('hidden');
            }
        });
    });
    
    // Resume actions
    if (viewResumeBtn) {
        viewResumeBtn.addEventListener('click', function() {
            // In a real implementation, this would open a PDF viewer
            showToast('PDF viewer would open here', 'info');
        });
    }
    
    if (downloadResumeBtn) {
        downloadResumeBtn.addEventListener('click', function() {
            const activeLang = document.querySelector('.lang-btn.active').getAttribute('data-lang');
            const filename = activeLang === 'cn' ? 'Joe_Yaochen_Resume_CN.pdf' : 'Joe_Yaochen_Resume.pdf';
            
            // In a real implementation, this would trigger a file download
            showToast(`Downloading ${filename}...`, 'success');
            
            // Simulate download
            const link = document.createElement('a');
            link.href = '#'; // Replace with actual PDF URL
            link.download = filename;
            // link.click(); // Uncomment when you have actual PDF files
        });
    }
}

// ===== BACK TO TOP BUTTON =====
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;
    
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

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    // Smooth scrolling for anchor links
    document.addEventListener('click', function(e) {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const target = document.querySelector(e.target.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
}

// ===== ANIMATIONS =====
function initAnimations() {
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeInLeft {
            from {
                opacity: 0;
                transform: translateX(-30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes fadeInRight {
            from {
                opacity: 0;
                transform: translateX(30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .animate-in {
            animation: fadeInUp 0.6s ease forwards;
        }
        
        .timeline-item:nth-child(odd) .animate-in {
            animation: fadeInLeft 0.6s ease forwards;
        }
        
        .timeline-item:nth-child(even) .animate-in {
            animation: fadeInRight 0.6s ease forwards;
        }
        
        .field-error {
            color: #e74c3c;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            display: block;
        }
        
        .form-group input.error,
        .form-group textarea.error {
            border-color: #e74c3c;
        }
        
        .no-results {
            grid-column: 1 / -1;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 300px;
            text-align: center;
            color: var(--color-text-light);
        }
        
        .no-results-content i {
            width: 48px;
            height: 48px;
            margin-bottom: 1rem;
            color: var(--color-text-lighter);
        }
        
        .no-results-content h3 {
            margin-bottom: 0.5rem;
            color: var(--color-text);
        }
        
        .no-results-content p {
            margin-bottom: 1.5rem;
        }
    `;
    document.head.appendChild(style);
}

function triggerSectionAnimations(section) {
    const animateElements = section.querySelectorAll(
        '.project-card, .writing-card, .timeline-item, .skill-bar'
    );
    
    animateElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('animate-in');
        }, index * 100);
    });
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    const toastMessage = toast.querySelector('.toast-message');
    const toastIcon = toast.querySelector('.toast-icon');
    
    // Update content
    toastMessage.textContent = message;
    
    // Update icon based on type
    const iconName = type === 'success' ? 'check-circle' : 
                    type === 'error' ? 'x-circle' : 
                    type === 'info' ? 'info' : 'check-circle';
    
    toastIcon.setAttribute('data-lucide', iconName);
    
    // Update colors
    toast.className = 'toast visible';
    if (type === 'error') {
        toast.style.backgroundColor = '#e74c3c';
    } else if (type === 'info') {
        toast.style.backgroundColor = '#3498db';
    } else {
        toast.style.backgroundColor = 'var(--color-secondary)';
    }
    
    // Re-initialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('visible');
    }, 3000);
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
document.addEventListener('keydown', function(e) {
    // Skip to main content
    if (e.key === 'Tab' && e.shiftKey === false) {
        const focusedElement = document.activeElement;
        if (focusedElement.tagName === 'BODY') {
            const firstFocusable = document.querySelector('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                firstFocusable.focus();
                e.preventDefault();
            }
        }
    }
    
    // Escape key to close mobile menu
    if (e.key === 'Escape') {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        if (navToggle && navMenu && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
    }
});

// ===== PERFORMANCE OPTIMIZATIONS =====
// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Preload critical resources
function preloadResources() {
    const criticalImages = [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', function() {
    initLazyLoading();
    preloadResources();
});

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send this to an error tracking service
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    // In production, you might want to send this to an error tracking service
});

// ===== ANALYTICS (PLACEHOLDER) =====
function trackEvent(category, action, label) {
    // Placeholder for analytics tracking
    console.log('Analytics event:', { category, action, label });
    
    // Example: Google Analytics 4
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', action, {
    //         event_category: category,
    //         event_label: label
    //     });
    // }
}

// Track navigation clicks
document.addEventListener('click', function(e) {
    if (e.target.matches('.nav-link')) {
        trackEvent('Navigation', 'click', e.target.textContent);
    }
    
    if (e.target.matches('.project-link')) {
        trackEvent('Project', 'link_click', e.target.closest('.project-card').querySelector('.project-title').textContent);
    }
    
    if (e.target.matches('#download-resume')) {
        trackEvent('Resume', 'download', 'PDF');
    }
});

// ===== SERVICE WORKER REGISTRATION (OPTIONAL) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}
