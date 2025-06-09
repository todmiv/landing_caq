// НОК Строительство - JavaScript функциональность

document.addEventListener('DOMContentLoaded', function() {
    // Плавная прокрутка для навигации
    initSmoothScrolling();
    
    // Анимации при скролле
    initScrollAnimations();
    
    // Валидация формы
    initFormValidation();
    
    // Маска для телефона
    initPhoneMask();
    
    // Счетчики статистики
    initCounters();
    
    // Автоматическое скрытие уведомлений
    initAlertAutoHide();
});

// Плавная прокрутка
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header-section').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Анимации при скролле
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll');
                
                // Запуск счетчиков при появлении секции статистики
                if (entry.target.classList.contains('hero-stats')) {
                    startCounters();
                }
            }
        });
    }, observerOptions);
    
    // Наблюдаем за элементами для анимации
    const animatedElements = document.querySelectorAll(
        '.feature-card, .benefit-card, .pricing-card, .testimonial-card, .process-step, .hero-stats'
    );
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Валидация формы
function initFormValidation() {
    const form = document.querySelector('.needs-validation');
    
    if (form) {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            form.classList.add('was-validated');
        });
        
        // Валидация полей в реальном времени
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    validateField(this);
                }
            });
        });
    }
}

// Валидация отдельного поля
function validateField(field) {
    const isValid = field.checkValidity();
    
    field.classList.remove('is-valid', 'is-invalid');
    
    if (field.value.trim() !== '') {
        field.classList.add(isValid ? 'is-valid' : 'is-invalid');
    }
    
    // Специальная валидация для телефона
    if (field.type === 'tel') {
        const phoneRegex = /^[\+]?[7|8]?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
        if (field.value && !phoneRegex.test(field.value.replace(/\D/g, ''))) {
            field.classList.add('is-invalid');
            field.classList.remove('is-valid');
        }
    }
}

// Маска для телефона
function initPhoneMask() {
    const phoneInput = document.querySelector('input[type="tel"]');
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.startsWith('8')) {
                value = '7' + value.slice(1);
            }
            
            if (value.startsWith('7')) {
                value = value.slice(0, 11);
                const formatted = value.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 ($2) $3-$4-$5');
                e.target.value = formatted;
            } else if (value.length > 0) {
                value = value.slice(0, 10);
                const formatted = value.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '($1) $2-$3-$4');
                e.target.value = formatted;
            }
        });
        
        phoneInput.addEventListener('keydown', function(e) {
            // Разрешаем удаление и навигацию
            if ([8, 9, 27, 13, 37, 38, 39, 40, 46].includes(e.keyCode)) {
                return;
            }
            
            // Разрешаем только цифры
            if ((e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
    }
}

// Счетчики статистики
function initCounters() {
    window.countersStarted = false;
}

function startCounters() {
    if (window.countersStarted) return;
    window.countersStarted = true;
    
    const counters = [
        { element: document.querySelector('.hero-stats .stat-item:nth-child(1) h3'), target: 1500, suffix: '+' },
        { element: document.querySelector('.hero-stats .stat-item:nth-child(2) h3'), target: 98, suffix: '%' },
        { element: document.querySelector('.hero-stats .stat-item:nth-child(3) h3'), target: 5, suffix: ' лет' }
    ];
    
    counters.forEach(counter => {
        if (counter.element) {
            animateCounter(counter.element, 0, counter.target, counter.suffix, 2000);
        }
    });
}

function animateCounter(element, start, end, suffix, duration) {
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * easeOutQuart(progress));
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

function easeOutQuart(t) {
    return 1 - (--t) * t * t * t;
}

// Автоматическое скрытие уведомлений
function initAlertAutoHide() {
    const alerts = document.querySelectorAll('.alert');
    
    alerts.forEach(alert => {
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });
}

// Изменение стиля навигации при скролле
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header-section');
    const scrolled = window.scrollY > 50;
    
    if (scrolled) {
        header.style.background = 'rgba(31, 41, 55, 0.98)';
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(31, 41, 55, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Подсветка активного пункта меню
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === currentSection) {
            link.classList.add('active');
        }
    });
});

// Дополнительные анимации для строительных элементов
function initConstructionAnimations() {
    const constructionIcons = document.querySelectorAll('.construction-icon, .safety-icon, .design-icon');
    
    constructionIcons.forEach((icon, index) => {
        icon.style.animationDelay = `${index * 0.5}s`;
        
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(10deg)';
            this.style.color = '#f97316';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
            this.style.color = '#f97316';
        });
    });
}

// Инициализация дополнительных анимаций
setTimeout(initConstructionAnimations, 1000);

// Обработка формы консультации
document.addEventListener('submit', function(e) {
    if (e.target.classList.contains('needs-validation')) {
        const submitButton = e.target.querySelector('button[type="submit"]');
        
        if (submitButton) {
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Отправляем...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                submitButton.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Отправить заявку';
                submitButton.disabled = false;
            }, 3000);
        }
    }
});

// Lazy loading для изображений
if ('IntersectionObserver' in window) {
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
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}
