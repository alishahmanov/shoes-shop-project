/* =====================================================
   mobile-nav.js - Скрипт для мобильного меню
===================================================== */

(function() {
    'use strict';
    
    // Ждем загрузки DOM
    document.addEventListener('DOMContentLoaded', function() {
        initMobileMenu();
        addResponsiveImageHandling();
        addSmoothScrolling();
        addTouchOptimizations();
    });
    
    /**
     * Инициализация мобильного меню
     */
    function initMobileMenu() {
        // Создаем кнопку гамбургер-меню
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        
        // Проверяем, не создана ли уже кнопка
        if (document.querySelector('.mobile-menu-toggle')) return;
        
        const menuToggle = document.createElement('button');
        menuToggle.className = 'mobile-menu-toggle';
        menuToggle.setAttribute('aria-label', 'Открыть меню');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.innerHTML = '<span></span><span></span><span></span>';
        
        // Создаем overlay
        const overlay = document.createElement('div');
        overlay.className = 'mobile-menu-overlay';
        
        // Добавляем элементы в DOM
        navbar.appendChild(menuToggle);
        document.body.appendChild(overlay);
        
        const navList = document.querySelector('.nav-list');
        if (!navList) return;
        
        // Обработчик клика по кнопке меню
        menuToggle.addEventListener('click', function() {
            const isActive = navList.classList.toggle('mobile-active');
            overlay.classList.toggle('active', isActive);
            menuToggle.classList.toggle('active', isActive);
            menuToggle.setAttribute('aria-expanded', isActive);
            
            // Блокируем скролл body когда меню открыто
            if (isActive) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Закрытие по клику на overlay
        overlay.addEventListener('click', function() {
            navList.classList.remove('mobile-active');
            overlay.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
        
        // Закрытие по клику на ссылку в меню
        const navLinks = navList.querySelectorAll('a');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    navList.classList.remove('mobile-active');
                    overlay.classList.remove('active');
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            });
        });
        
        // Закрытие по ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navList.classList.contains('mobile-active')) {
                navList.classList.remove('mobile-active');
                overlay.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
        
        // Обработка изменения размера окна
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (window.innerWidth > 768) {
                    navList.classList.remove('mobile-active');
                    overlay.classList.remove('active');
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            }, 250);
        });
    }
    
    /**
     * Обработка изображений для адаптивности
     */
    function addResponsiveImageHandling() {
        const images = document.querySelectorAll('img');
        
        images.forEach(function(img) {
            // Добавляем обработчик ошибок
            img.addEventListener('error', function() {
                console.warn('Failed to load image:', img.src);
                // Можно установить placeholder
                // img.src = 'Assets/placeholder.jpg';
            });
            
            // Lazy loading для изображений без класса lazy-image
            if (!img.classList.contains('lazy-image') && !img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });
    }
    
    /**
     * Плавная прокрутка к якорям
     */
    function addSmoothScrolling() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const offsetTop = target.offsetTop - 80; // Учитываем высоту хедера
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Обновляем URL без перезагрузки
                    if (history.pushState) {
                        history.pushState(null, null, href);
                    }
                }
            });
        });
    }
    
    /**
     * Touch оптимизации
     */
    function addTouchOptimizations() {
        // Добавляем класс touch для устройств с сенсорным экраном
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            document.body.classList.add('touch-device');
        }
        
        // Улучшаем клики на iOS
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            document.body.classList.add('ios-device');
            
            // Фикс для :active на iOS
            document.addEventListener('touchstart', function() {}, true);
        }
        
        // Android определение
        if (/Android/.test(navigator.userAgent)) {
            document.body.classList.add('android-device');
        }
    }
    
    /**
     * Показ/скрытие кнопки "наверх" на мобильных
     */
    function addScrollToTop() {
        // Создаем кнопку только если её еще нет
        if (document.querySelector('.scroll-to-top')) return;
        
        const scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.innerHTML = '↑';
        scrollBtn.setAttribute('aria-label', 'Наверх');
        scrollBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: #000;
            color: #fff;
            border: none;
            font-size: 24px;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, visibility 0.3s;
            z-index: 998;
        `;
        
        document.body.appendChild(scrollBtn);
        
        // Показываем кнопку при прокрутке
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollBtn.style.opacity = '1';
                scrollBtn.style.visibility = 'visible';
            } else {
                scrollBtn.style.opacity = '0';
                scrollBtn.style.visibility = 'hidden';
            }
        });
        
        // Прокрутка наверх
        scrollBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Вызываем функцию кнопки "наверх"
    if (window.innerWidth <= 768) {
        addScrollToTop();
    }
    
    /**
     * Адаптивные таблицы - делаем scrollable на мобильных
     */
    function makeTablesResponsive() {
        const tables = document.querySelectorAll('table:not(.table-responsive table)');
        
        tables.forEach(function(table) {
            const wrapper = document.createElement('div');
            wrapper.className = 'table-responsive';
            wrapper.style.overflowX = 'auto';
            wrapper.style.webkitOverflowScrolling = 'touch';
            
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        });
    }
    
    // Применяем адаптивность к таблицам
    if (window.innerWidth <= 768) {
        makeTablesResponsive();
    }
    
    /**
     * Viewport height fix для мобильных браузеров
     */
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', vh + 'px');
    }
    
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    
})();
