// Debug mode - set to true to see console logs
const DEBUG_MODE = false;

// Debug logging function
function debugLog(message, data = null) {
    if (DEBUG_MODE) {
        if (data) {
            console.log(`[Panorama Debug] ${message}`, data);
        } else {
            console.log(`[Panorama Debug] ${message}`);
        }
    }
}

// Sidebar toggle functions
function openSidebar() {
    try {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.classList.add('active');
            document.body.style.overflow = 'hidden';
            debugLog('Sidebar opened successfully');
        } else {
            debugLog('Sidebar element not found');
        }
    } catch (error) {
        console.error('Error opening sidebar:', error);
    }
}

function closeSidebar() {
    try {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.classList.remove('active');
            document.body.style.overflow = '';
            debugLog('Sidebar closed successfully');
        } else {
            debugLog('Sidebar element not found');
        }
    } catch (error) {
        console.error('Error closing sidebar:', error);
    }
}

// Close sidebar when clicking outside
window.addEventListener('click', function(e) {
    try {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar && sidebar.classList.contains('active')) {
            if (!sidebar.contains(e.target) && !e.target.classList.contains('menu-btn')) {
                closeSidebar();
            }
        }
    } catch (error) {
        console.error('Error in sidebar click handler:', error);
    }
});

// Close sidebar on escape key
document.addEventListener('keydown', function(e) {
    try {
        if (e.key === 'Escape') {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar && sidebar.classList.contains('active')) {
                closeSidebar();
            }
        }
    } catch (error) {
        console.error('Error in escape key handler:', error);
    }
});

// Activate bottom navigation links
function activateBottomNav() {
    try {
        const navLinks = document.querySelectorAll('.bottom-nav .nav-link');
        const currentPath = window.location.pathname;
        
        debugLog('Current path:', currentPath);
        debugLog('Found nav links:', navLinks.length);
        
        navLinks.forEach(function(link, index) {
            // Remove existing active class
            link.classList.remove('active');
            
            try {
                // Check if current path matches link href
                const linkPath = new URL(link.href).pathname;
                debugLog(`Link ${index} path:`, linkPath);
                
                if (linkPath === currentPath || 
                    (currentPath === '/' && linkPath === '/') ||
                    (currentPath !== '/' && linkPath !== '/' && currentPath.includes(linkPath))) {
                    link.classList.add('active');
                    debugLog(`Activated link ${index}:`, linkPath);
                }
            } catch (urlError) {
                debugLog(`Error parsing URL for link ${index}:`, urlError);
                // Fallback: check if href contains current path
                if (link.href && link.href.includes(currentPath)) {
                    link.classList.add('active');
                    debugLog(`Fallback activated link ${index}`);
                }
            }
        });
    } catch (error) {
        console.error('Error activating bottom navigation:', error);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    try {
        debugLog('DOM loaded, initializing...');
        
        // Activate bottom navigation
        activateBottomNav();
        
        // Add event listeners for menu buttons
        const menuButtons = document.querySelectorAll('.menu-btn');
        debugLog('Found menu buttons:', menuButtons.length);
        
        menuButtons.forEach(function(button, index) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                debugLog(`Menu button ${index} clicked`);
                openSidebar();
            });
        });
        
        // Add event listener for close button
        const closeButton = document.querySelector('.sidebar .close-btn');
        if (closeButton) {
            closeButton.addEventListener('click', function(e) {
                e.preventDefault();
                debugLog('Close button clicked');
                closeSidebar();
            });
        } else {
            debugLog('Close button not found');
        }
        
        // Initialize all tooltips
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });

        // Initialize all popovers
        var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
            return new bootstrap.Popover(popoverTriggerEl);
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Add fade-in animation to cards on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observe all cards
        document.querySelectorAll('.card').forEach(card => {
            observer.observe(card);
        });

        // Form validation
        const forms = document.querySelectorAll('.needs-validation');
        forms.forEach(form => {
            form.addEventListener('submit', function(event) {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            });
        });

        // Auto-hide alerts after 5 seconds
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(alert => {
            setTimeout(() => {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }, 5000);
        });

        // Back to top button
        const backToTopBtn = document.createElement('button');
        backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTopBtn.className = 'btn btn-main position-fixed';
        backToTopBtn.style.cssText = 'bottom: 20px; right: 20px; z-index: 1000; border-radius: 50%; width: 50px; height: 50px; display: none;';
        document.body.appendChild(backToTopBtn);

        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });

        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Mobile menu toggle
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        
        if (navbarToggler && navbarCollapse) {
            navbarToggler.addEventListener('click', function() {
                navbarCollapse.classList.toggle('show');
            });

            // Close mobile menu when clicking on a link
            const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    if (navbarCollapse.classList.contains('show')) {
                        navbarCollapse.classList.remove('show');
                    }
                });
            });
        }

        // Lazy loading for images
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

        // Counter animation
        function animateCounter(element, target, duration = 2000) {
            let start = 0;
            const increment = target / (duration / 16);
            
            function updateCounter() {
                start += increment;
                if (start < target) {
                    element.textContent = Math.floor(start);
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = target;
                }
            }
            
            updateCounter();
        }

        // Animate counters when they come into view
        const counters = document.querySelectorAll('[data-counter]');
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.counter);
                    animateCounter(counter, target);
                    counterObserver.unobserve(counter);
                }
            });
        });

        counters.forEach(counter => counterObserver.observe(counter));

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                const searchableElements = document.querySelectorAll('[data-search]');
                
                searchableElements.forEach(element => {
                    const text = element.textContent.toLowerCase();
                    if (text.includes(searchTerm)) {
                        element.style.display = '';
                    } else {
                        element.style.display = 'none';
                    }
                });
            });
        }

        // Filter functionality
        const filterButtons = document.querySelectorAll('[data-filter]');
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.dataset.filter;
                const items = document.querySelectorAll('[data-category]');
                
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                items.forEach(item => {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });

        // Modal functionality
        const modalTriggers = document.querySelectorAll('[data-modal]');
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                const modalId = this.dataset.modal;
                const modal = document.getElementById(modalId);
                if (modal) {
                    const bsModal = new bootstrap.Modal(modal);
                    bsModal.show();
                }
            });
        });

        // Form submission with AJAX
        const ajaxForms = document.querySelectorAll('[data-ajax]');
        ajaxForms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formData = new FormData(this);
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                // Show loading state
                submitBtn.innerHTML = '<span class="spinner"></span> جاري الإرسال...';
                submitBtn.disabled = true;
                
                fetch(this.action, {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        showAlert('تم الإرسال بنجاح!', 'success');
                        this.reset();
                    } else {
                        showAlert('حدث خطأ في الإرسال', 'danger');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    showAlert('حدث خطأ في الإرسال', 'danger');
                })
                .finally(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                });
            });
        });

        // Alert function
        function showAlert(message, type = 'info') {
            const alertDiv = document.createElement('div');
            alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
            alertDiv.innerHTML = `
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            
            const container = document.querySelector('.container');
            if (container) {
                container.insertBefore(alertDiv, container.firstChild);
            }
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                const bsAlert = new bootstrap.Alert(alertDiv);
                bsAlert.close();
            }, 5000);
        }

        // Theme switcher
        const themeSwitcher = document.getElementById('themeSwitcher');
        if (themeSwitcher) {
            themeSwitcher.addEventListener('change', function() {
                const theme = this.value;
                document.body.setAttribute('data-theme', theme);
                localStorage.setItem('theme', theme);
            });
            
            // Load saved theme
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                document.body.setAttribute('data-theme', savedTheme);
                themeSwitcher.value = savedTheme;
            }
        }

        // Language switcher
        const langSwitcher = document.getElementById('langSwitcher');
        if (langSwitcher) {
            langSwitcher.addEventListener('change', function() {
                const lang = this.value;
                document.documentElement.lang = lang;
                document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
                localStorage.setItem('language', lang);
            });
            
            // Load saved language
            const savedLang = localStorage.getItem('language');
            if (savedLang) {
                document.documentElement.lang = savedLang;
                document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
                langSwitcher.value = savedLang;
            }
        }

        // Print functionality
        const printBtn = document.querySelector('.print-btn');
        if (printBtn) {
            printBtn.addEventListener('click', function() {
                window.print();
            });
        }

        // Share functionality
        const shareBtn = document.querySelector('.share-btn');
        if (shareBtn && navigator.share) {
            shareBtn.addEventListener('click', function() {
                navigator.share({
                    title: document.title,
                    url: window.location.href
                });
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            // Ctrl/Cmd + K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.focus();
                }
            }
            
            // Escape to close modals
            if (e.key === 'Escape') {
                const openModals = document.querySelectorAll('.modal.show');
                openModals.forEach(modal => {
                    const bsModal = bootstrap.Modal.getInstance(modal);
                    if (bsModal) {
                        bsModal.hide();
                    }
                });
            }
        });

        // Performance monitoring
        if ('performance' in window) {
            window.addEventListener('load', function() {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                console.log(`Page load time: ${loadTime}ms`);
            });
        }

        // Error handling
        window.addEventListener('error', function(e) {
            console.error('JavaScript error:', e.error);
            // You can send error reports to your server here
        });

        // Service Worker registration (for PWA features)
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('ServiceWorker registration successful');
                })
                .catch(function(err) {
                    console.log('ServiceWorker registration failed');
                });
        }

        debugLog('Initialization completed');
        
    } catch (error) {
        console.error('Error initializing JavaScript:', error);
    }
});

// Handle page visibility changes (for mobile apps)
document.addEventListener('visibilitychange', function() {
    try {
        if (document.hidden) {
            // Close sidebar when page becomes hidden
            debugLog('Page hidden, closing sidebar');
            closeSidebar();
        }
    } catch (error) {
        console.error('Error in visibility change handler:', error);
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    try {
        // Close sidebar on large screens (desktop)
        if (window.innerWidth >= 992) {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar && sidebar.classList.contains('active')) {
                debugLog('Window resized to desktop, closing sidebar');
                closeSidebar();
            }
        }
    } catch (error) {
        console.error('Error in resize handler:', error);
    }
});

// Utility functions
const Utils = {
    // Debounce function
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle: function(func, limit) {
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
    },

    // Format date
    formatDate: function(date) {
        return new Intl.DateTimeFormat('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    },

    // Format currency
    formatCurrency: function(amount) {
        return new Intl.NumberFormat('ar-EG', {
            style: 'currency',
            currency: 'EGP'
        }).format(amount);
    },

    // Validate email
    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Validate phone
    validatePhone: function(phone) {
        const re = /^(\+20|0)?1[0125][0-9]{8}$/;
        return re.test(phone);
    }
};

// Custom JavaScript for Panorama Radiology Center

// Global variables
let services = [];
let doctors = [];
let blogPosts = [];
let bookings = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    setupEventListeners();
});

// Load data from backend
async function loadData() {
    try {
        // Load services
        const servicesResponse = await fetch('/api/services');
        services = await servicesResponse.json();
        
        // Load doctors
        const doctorsResponse = await fetch('/api/doctors');
        doctors = await doctorsResponse.json();
        
        // Load blog posts
        const blogResponse = await fetch('/api/blog');
        blogPosts = await blogResponse.json();
        
        // Render data
        renderServices();
        renderDoctors();
        renderBlogPosts();
        
    } catch (error) {
        console.error('Error loading data:', error);
        // Load sample data if API is not available
        loadSampleData();
    }
}

// Load sample data for development
function loadSampleData() {
    services = [
        {
            id: 1,
            name: "أشعة رنين مغناطيسي",
            description: "فحص الرنين المغناطيسي للدماغ والعمود الفقري والمفاصل",
            price: "800",
            image: "assets/images/services/mri.jpg",
            category: "أشعة متقدمة"
        },
        {
            id: 2,
            name: "أشعة مقطعية",
            description: "فحص الأشعة المقطعية للصدر والبطن والحوض",
            price: "600",
            image: "assets/images/services/ct.jpg",
            category: "أشعة متقدمة"
        },
        {
            id: 3,
            name: "أشعة سينية",
            description: "أشعة سينية للصدر والعظام والمفاصل",
            price: "150",
            image: "assets/images/services/xray.jpg",
            category: "أشعة أساسية"
        }
    ];
    
    doctors = [
        {
            id: 1,
            name: "د. أحمد محمد",
            specialization: "أخصائي أشعة تشخيصية",
            qualification: "دكتوراه في الأشعة التشخيصية",
            experience: "15 سنة",
            image: "assets/images/doctors/doctor1.jpg",
            bio: "خبرة 15 سنة في مجال الأشعة التشخيصية"
        },
        {
            id: 2,
            name: "د. فاطمة علي",
            specialization: "أخصائية أشعة نساء",
            qualification: "ماجستير في الأشعة النسائية",
            experience: "10 سنوات",
            image: "assets/images/doctors/doctor2.jpg",
            bio: "متخصصة في أشعة النساء والتوليد"
        }
    ];
    
    blogPosts = [
        {
            id: 1,
            title: "أهمية الفحص الدوري بالأشعة",
            content: "الفحص الدوري بالأشعة يساعد في الكشف المبكر عن الأمراض...",
            author: "د. أحمد محمد",
            created_at: "2024-01-15",
            image: "assets/images/blog/blog1.jpg"
        },
        {
            id: 2,
            title: "متى تحتاج لأشعة رنين مغناطيسي؟",
            content: "الرنين المغناطيسي ضروري في حالات معينة...",
            author: "د. فاطمة علي",
            created_at: "2024-01-10",
            image: "assets/images/blog/blog2.jpg"
        }
    ];
    
    renderServices();
    renderDoctors();
    renderBlogPosts();
}

// Render services on homepage
function renderServices() {
    const container = document.getElementById('services-container');
    if (!container) return;
    
    const servicesToShow = services.slice(0, 6); // Show only 6 services on homepage
    
    container.innerHTML = servicesToShow.map(service => `
        <div class="col-lg-4 col-md-6">
            <div class="card service-card h-100">
                <img src="${service.image || 'assets/images/services/default.jpg'}" 
                     class="card-img-top" alt="${service.name}" 
                     style="height: 200px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">${service.name}</h5>
                    <p class="card-text">${service.description}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="text-main fw-bold">${service.price} جنيه</span>
                        <a href="service-detail.html?id=${service.id}" class="btn btn-outline-main">المزيد</a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Render doctors on homepage
function renderDoctors() {
    const container = document.getElementById('doctors-container');
    if (!container) return;
    
    const doctorsToShow = doctors.slice(0, 4); // Show only 4 doctors on homepage
    
    container.innerHTML = doctorsToShow.map(doctor => `
        <div class="col-lg-3 col-md-6">
            <div class="card doctor-card h-100">
                <img src="${doctor.image || 'assets/images/doctors/default.jpg'}" 
                     class="card-img-top" alt="${doctor.name}" 
                     style="height: 250px; object-fit: cover;">
                <div class="card-body text-center">
                    <h5 class="card-title">${doctor.name}</h5>
                    <p class="card-text text-muted">${doctor.specialization}</p>
                    <p class="card-text small">${doctor.experience} خبرة</p>
                    <a href="doctor-detail.html?id=${doctor.id}" class="btn btn-outline-main">عرض الملف</a>
                </div>
            </div>
        </div>
    `).join('');
}

// Render blog posts on homepage
function renderBlogPosts() {
    const container = document.getElementById('blog-container');
    if (!container) return;
    
    const postsToShow = blogPosts.slice(0, 3); // Show only 3 posts on homepage
    
    container.innerHTML = postsToShow.map(post => `
        <div class="col-lg-4 col-md-6">
            <div class="card blog-card h-100">
                <img src="${post.image || 'assets/images/blog/default.jpg'}" 
                     class="card-img-top" alt="${post.title}" 
                     style="height: 200px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">${post.title}</h5>
                    <p class="card-text">${post.content.substring(0, 100)}...</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">${post.author}</small>
                        <a href="blog-detail.html?id=${post.id}" class="btn btn-outline-main">قراءة المزيد</a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Setup event listeners
function setupEventListeners() {
    // Booking form submission
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }
    
    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
}

// Handle booking form submission
async function handleBookingSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const bookingData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        service_id: formData.get('service'),
        doctor_id: formData.get('doctor'),
        appointment_date: formData.get('appointment_date'),
        appointment_time: formData.get('appointment_time'),
        notes: formData.get('notes')
    };
    
    try {
        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData)
        });
        
        if (response.ok) {
            showAlert('تم إرسال طلب الحجز بنجاح! سنتواصل معك قريباً.', 'success');
            event.target.reset();
        } else {
            showAlert('حدث خطأ في إرسال طلب الحجز. يرجى المحاولة مرة أخرى.', 'danger');
        }
    } catch (error) {
        console.error('Error submitting booking:', error);
        showAlert('حدث خطأ في إرسال طلب الحجز. يرجى المحاولة مرة أخرى.', 'danger');
    }
}

// Handle contact form submission
async function handleContactSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contactData)
        });
        
        if (response.ok) {
            showAlert('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.', 'success');
            event.target.reset();
        } else {
            showAlert('حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى.', 'danger');
        }
    } catch (error) {
        console.error('Error submitting contact:', error);
        showAlert('حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى.', 'danger');
    }
}

// Handle search
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('services.html')) {
        filterServices(searchTerm);
    } else if (currentPage.includes('blog.html')) {
        filterBlogPosts(searchTerm);
    }
}

// Filter services
function filterServices(searchTerm) {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const description = card.querySelector('.card-text').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.closest('.col-lg-4').style.display = 'block';
        } else {
            card.closest('.col-lg-4').style.display = 'none';
        }
    });
}

// Filter blog posts
function filterBlogPosts(searchTerm) {
    const blogCards = document.querySelectorAll('.blog-card');
    
    blogCards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const content = card.querySelector('.card-text').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || content.includes(searchTerm)) {
            card.closest('.col-lg-4').style.display = 'block';
        } else {
            card.closest('.col-lg-4').style.display = 'none';
        }
    });
}

// Show alert message
function showAlert(message, type = 'info') {
    const alertContainer = document.createElement('div');
    alertContainer.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertContainer.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertContainer.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertContainer);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertContainer.parentNode) {
            alertContainer.remove();
        }
    }, 5000);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('ar-EG', {
        style: 'currency',
        currency: 'EGP'
    }).format(price);
}

// Smooth scroll to element
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Mobile menu toggle
function toggleMobileMenu() {
    const navbar = document.getElementById('mainNavbar');
    if (navbar) {
        navbar.classList.toggle('show');
    }
}

// Initialize tooltips
function initTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Initialize popovers
function initPopovers() {
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
}

// Export functions for use in other files
window.PanoramaApp = {
    loadData,
    renderServices,
    renderDoctors,
    renderBlogPosts,
    showAlert,
    formatDate,
    formatPrice,
    smoothScrollTo,
    toggleMobileMenu,
    initTooltips,
    initPopovers
}; 