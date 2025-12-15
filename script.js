document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const mainNav = document.querySelector('.main-nav');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
            navToggle.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) {
                navMenu.classList.remove('active');
                if (navToggle) {
                    navToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    navToggle.classList.remove('active');
                }
            }
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (mainNav) {
            if (window.scrollY > 50) {
                mainNav.classList.add('scrolled');
            } else {
                mainNav.classList.remove('scrolled');
            }
        }
    });
    
    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    const currentTheme = localStorage.getItem('theme') || 
                         (prefersDarkScheme.matches ? 'dark' : 'light');
    
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.querySelector('.fa-moon').style.display = 'none';
        themeToggle.querySelector('.fa-sun').style.display = 'block';
    } else {
        themeToggle.querySelector('.fa-moon').style.display = 'block';
        themeToggle.querySelector('.fa-sun').style.display = 'none';
    }
    
    themeToggle.addEventListener('click', () => {
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        if (isDarkMode) {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
            themeToggle.querySelector('.fa-moon').style.display = 'block';
            themeToggle.querySelector('.fa-sun').style.display = 'none';
        } else {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
            themeToggle.querySelector('.fa-moon').style.display = 'none';
            themeToggle.querySelector('.fa-sun').style.display = 'block';
        }
    });
    
    // Back to Top Button
    const backToTop = document.getElementById('backToTop');
    
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.style.display = 'flex';
                backToTop.style.animation = 'fadeIn 0.3s ease';
            } else {
                backToTop.style.display = 'none';
            }
        });
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = document.querySelector('.main-nav').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                if (navMenu) {
                    navMenu.classList.remove('active');
                    if (navToggle) {
                        navToggle.innerHTML = '<i class="fas fa-bars"></i>';
                        navToggle.classList.remove('active');
                    }
                }
            }
        });
    });
    
    // Active navigation link highlighting
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const highlightNavLink = () => {
        let current = '';
        const navHeight = document.querySelector('.main-nav').offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= (sectionTop - navHeight - 100)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', highlightNavLink);
    
    // Fullscreen Image Modal
    const fullscreenModal = document.getElementById('fullscreenModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const modalClose = document.getElementById('modalClose');
    const modalPrev = document.getElementById('modalPrev');
    const modalNext = document.getElementById('modalNext');
    
    let currentImageIndex = 0;
    let allImages = [];
    
    // Initialize all clickable images
    function initializeImageModal() {
        allImages = Array.from(document.querySelectorAll('.clickable-image')).map(img => ({
            src: img.src,
            alt: img.alt,
            caption: getImageCaption(img)
        }));
        
        // Add event listeners to all images
        document.querySelectorAll('.clickable-image').forEach((img, index) => {
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                openFullscreenImage(index);
            });
        });
        
        // Add event listeners to overlay buttons
        document.querySelectorAll('.image-overlay, .photo-overlay').forEach((overlay, index) => {
            overlay.addEventListener('click', (e) => {
                e.stopPropagation();
                openFullscreenImage(index);
            });
        });
    }
    
    function getImageCaption(img) {
        // Try to find caption from parent elements
        const card = img.closest('.documented-card, .photo-card, .certificate-card, .image-wrapper');
        if (card) {
            const title = card.querySelector('h4, h3, .photo-caption h4');
            if (title) return title.textContent;
        }
        return img.alt || 'Image';
    }
    
    function openFullscreenImage(index) {
        currentImageIndex = index;
        const image = allImages[index];
        
        // Add loading class to modal
        fullscreenModal.classList.add('loading');
        
        // Create new image element for better loading
        const newImg = new Image();
        newImg.src = image.src;
        newImg.alt = image.alt;
        
        newImg.onload = () => {
            modalImage.src = image.src;
            modalImage.alt = image.alt;
            modalCaption.textContent = image.caption;
            
            fullscreenModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Update navigation buttons state
            updateNavButtons();
            
            // Remove loading class
            fullscreenModal.classList.remove('loading');
        };
    }
    
    function updateNavButtons() {
        modalPrev.style.display = currentImageIndex > 0 ? 'flex' : 'none';
        modalNext.style.display = currentImageIndex < allImages.length - 1 ? 'flex' : 'none';
    }
    
    function closeFullscreenImage() {
        fullscreenModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Reset image with fade effect
        modalImage.style.animation = 'imageZoomOut 0.3s ease';
        setTimeout(() => {
            modalImage.style.animation = '';
        }, 300);
    }
    
    function showNextImage() {
        if (currentImageIndex < allImages.length - 1) {
            currentImageIndex++;
            const image = allImages[currentImageIndex];
            
            // Add transition effect
            modalImage.style.opacity = '0';
            modalCaption.style.opacity = '0';
            
            setTimeout(() => {
                modalImage.src = image.src;
                modalImage.alt = image.alt;
                modalCaption.textContent = image.caption;
                
                modalImage.style.opacity = '1';
                modalCaption.style.opacity = '1';
                updateNavButtons();
            }, 300);
        }
    }
    
    function showPrevImage() {
        if (currentImageIndex > 0) {
            currentImageIndex--;
            const image = allImages[currentImageIndex];
            
            // Add transition effect
            modalImage.style.opacity = '0';
            modalCaption.style.opacity = '0';
            
            setTimeout(() => {
                modalImage.src = image.src;
                modalImage.alt = image.alt;
                modalCaption.textContent = image.caption;
                
                modalImage.style.opacity = '1';
                modalCaption.style.opacity = '1';
                updateNavButtons();
            }, 300);
        }
    }
    
    // Event listeners for modal
    modalClose.addEventListener('click', closeFullscreenImage);
    modalNext.addEventListener('click', showNextImage);
    modalPrev.addEventListener('click', showPrevImage);
    
    // Close modal when clicking outside image
    fullscreenModal.addEventListener('click', (e) => {
        if (e.target === fullscreenModal) {
            closeFullscreenImage();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (fullscreenModal.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeFullscreenImage();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            }
        }
    });
    
    // Initialize the image modal system
    initializeImageModal();
    
    // Animate skill bars when in view
    const animateSkillBars = () => {
        const skillBars = document.querySelectorAll('.skill-level');
        const skillsSection = document.querySelector('.skills-section');
        
        if (!skillsSection) return;
        
        const sectionTop = skillsSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight - 100) {
            skillBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width;
                    bar.style.transition = 'width 1.5s cubic-bezier(0.65, 0, 0.35, 1)';
                }, 300);
            });
            
            window.removeEventListener('scroll', animateSkillBars);
        }
    };
    
    window.addEventListener('scroll', animateSkillBars);
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.insight-card, .journal-card, .documented-card, .certificate-card, .photo-card, .category, .contact-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });
    
    // Ripple effect for buttons and cards
    const rippleButtons = document.querySelectorAll('.btn, .badge, .tag, .cert-tag');
    rippleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                top: ${y}px;
                left: ${x}px;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple animation styles
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes imageZoomOut {
            from { transform: scale(1); opacity: 1; }
            to { transform: scale(0.8); opacity: 0; }
        }
    `;
    document.head.appendChild(rippleStyle);
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.animation = 'fadeIn 0.6s ease';
            }
        });
    }, observerOptions);
    
    // Observe all elements for animation
    document.querySelectorAll('.insight-card, .journal-card, .skill-item, .documented-card, .certificate-card, .photo-card, .category, .personal-reflection, .tour-impact, .documented-summary, .gallery-description, .contact-item, .badge, .hero-image, .hero-text, .section-header').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Close mobile menu on resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navMenu) {
            navMenu.classList.remove('active');
            if (navToggle) {
                navToggle.innerHTML = '<i class="fas fa-bars"></i>';
                navToggle.classList.remove('active');
            }
        }
    });
    
    // Loading screen animation
    const loadingScreen = document.querySelector('.loading-screen');
    
    window.addEventListener('load', () => {
        // Fade out loading screen
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }, 1500);
        
        // Animate skill bars on initial load
        setTimeout(() => {
            animateSkillBars();
        }, 1000);
        
        // Add particles to hero section
        createParticles();
        
        // Typewriter effect for hero intro
        typeWriterEffect();
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            const rate = scrolled * -0.5;
            heroSection.style.backgroundPosition = `center ${rate}px`;
        }
    });
    
    // Create floating particles in hero section
    function createParticles() {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;
        
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 6 + 2;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const duration = Math.random() * 20 + 15;
            const delay = Math.random() * 5;
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: rgba(255, 255, 255, 0.4);
                border-radius: 50%;
                left: ${posX}%;
                top: ${posY}%;
                animation: floatParticle ${duration}s ease-in-out ${delay}s infinite;
                pointer-events: none;
                z-index: 1;
            `;
            
            heroSection.appendChild(particle);
        }
        
        const particleStyle = document.createElement('style');
        particleStyle.textContent = `
            @keyframes floatParticle {
                0%, 100% {
                    transform: translateY(0) translateX(0) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 0.5;
                }
                90% {
                    opacity: 0.5;
                }
                50% {
                    transform: translateY(-150px) translateX(100px) rotate(180deg);
                }
            }
        `;
        document.head.appendChild(particleStyle);
    }
    
    // Typewriter effect for hero intro
    function typeWriterEffect() {
        const heroIntro = document.querySelector('.hero-intro p');
        if (heroIntro) {
            const text = heroIntro.textContent;
            heroIntro.textContent = '';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    heroIntro.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 30);
                }
            };
            
            setTimeout(typeWriter, 1000);
        }
    }
    
    // Add scroll progress indicator
    function addScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.innerHTML = `
            <div class="scroll-progress-bar"></div>
        `;
        document.body.appendChild(progressBar);
        
        const progressBarFill = progressBar.querySelector('.scroll-progress-bar');
        
        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            progressBarFill.style.width = `${scrolled}%`;
        });
    }
    
    addScrollProgress();
    
    // Theme preference change listener
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.body.classList.add('dark-mode');
                themeToggle.querySelector('.fa-moon').style.display = 'none';
                themeToggle.querySelector('.fa-sun').style.display = 'block';
            } else {
                document.body.classList.remove('dark-mode');
                themeToggle.querySelector('.fa-moon').style.display = 'block';
                themeToggle.querySelector('.fa-sun').style.display = 'none';
            }
        }
    });
    
    // Add smooth hover effects for all interactive elements
    const interactiveElements = document.querySelectorAll('.btn, .nav-link, .badge, .tag, .social-link, .cert-tag, .contact-item, .insight-card, .documented-card, .photo-card, .certificate-card, .category, .journal-card');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            el.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });
});