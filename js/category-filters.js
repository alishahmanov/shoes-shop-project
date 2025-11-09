/**
 * Адаптивные фильтры для category.html
 * Управление показом/скрытием фильтров на мобильных устройствах
 */

(function() {
  'use strict';

  // Инициализация при загрузке страницы
  document.addEventListener('DOMContentLoaded', initFilters);

  function initFilters() {
    const filters = document.querySelector('.filters');
    if (!filters) return;

    // Создаем кнопку для открытия/закрытия фильтров на мобильных
    createMobileFilterToggle();
    
    // Добавляем функционал "Показать все" для групп фильтров
    addShowMoreButtons();
    
    // Делаем фильтры скрываемыми на мобильных устройствах
    makeFiltersCollapsible();
  }

  /**
   * Создает кнопку переключения фильтров для мобильных устройств
   */
  function createMobileFilterToggle() {
    // Проверяем, не создана ли уже кнопка
    if (document.querySelector('.mobile-filter-toggle')) return;
    
    const filters = document.querySelector('.filters');
    const page = document.querySelector('.page');
    
    if (!filters || !page) return;

    // Создаем кнопку
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'mobile-filter-toggle';
    toggleBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 4h16M2 10h16M2 16h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <span>Фильтры</span>
    `;
    toggleBtn.setAttribute('aria-label', 'Открыть фильтры');
    toggleBtn.setAttribute('aria-expanded', 'false');

    // Вставляем кнопку перед .page
    page.parentNode.insertBefore(toggleBtn, page);

    // Обработчик клика
    toggleBtn.addEventListener('click', () => {
      const isOpen = filters.classList.toggle('filters--open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
      toggleBtn.classList.toggle('active', isOpen);
      
      // Блокируем скролл body при открытых фильтрах
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Закрытие по клику вне фильтров
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768 && 
          !filters.contains(e.target) && 
          !toggleBtn.contains(e.target) &&
          filters.classList.contains('filters--open')) {
        filters.classList.remove('filters--open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && filters.classList.contains('filters--open')) {
        filters.classList.remove('filters--open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    // Закрытие при изменении размера экрана
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth > 768 && filters.classList.contains('filters--open')) {
          filters.classList.remove('filters--open');
          toggleBtn.setAttribute('aria-expanded', 'false');
          toggleBtn.classList.remove('active');
          document.body.style.overflow = '';
        }
      }, 250);
    });
  }

  /**
   * Делает фильтры сворачиваемыми на мобильных устройствах
   */
  function makeFiltersCollapsible() {
    const filters = document.querySelector('.filters');
    if (!filters) return;

    // Получаем все заголовки фильтров (h3)
    const headings = filters.querySelectorAll('h3');
    
    headings.forEach((heading, index) => {
      // Оборачиваем содержимое после h3 в контейнер
      const container = document.createElement('div');
      container.className = 'filter-group';
      
      // Собираем все элементы до следующего h3
      let nextElement = heading.nextElementSibling;
      const elements = [];
      
      while (nextElement && nextElement.tagName !== 'H3') {
        elements.push(nextElement);
        nextElement = nextElement.nextElementSibling;
      }
      
      // Перемещаем элементы в контейнер
      elements.forEach(el => container.appendChild(el));
      
      // Вставляем контейнер после заголовка
      heading.parentNode.insertBefore(container, heading.nextSibling);
      
      // Добавляем класс и атрибуты для доступности
      heading.classList.add('filter-heading');
      heading.setAttribute('role', 'button');
      heading.setAttribute('aria-expanded', 'true');
      heading.setAttribute('tabindex', '0');
      
      // Добавляем иконку
      const icon = document.createElement('span');
      icon.className = 'filter-icon';
      icon.innerHTML = '▼';
      heading.appendChild(icon);

      // Обработчик клика только на мобильных
      const toggleFilter = () => {
        if (window.innerWidth > 768) return; // Не сворачивать на больших экранах
        
        const isExpanded = heading.getAttribute('aria-expanded') === 'true';
        heading.setAttribute('aria-expanded', !isExpanded);
        container.classList.toggle('collapsed', isExpanded);
      };

      heading.addEventListener('click', toggleFilter);
      
      // Поддержка клавиатуры
      heading.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleFilter();
        }
      });
    });
  }

  /**
   * Добавляет функционал "Показать все" для длинных списков
   */
  function addShowMoreButtons() {
    const filters = document.querySelector('.filters');
    if (!filters) return;

    // Находим все ссылки "Показать все"
    const showMoreLinks = filters.querySelectorAll('a[href="#"]');
    
    showMoreLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Находим родительскую группу
        const group = link.closest('.filter-group') || link.parentElement;
        
        // Показываем все скрытые чекбоксы
        const hiddenLabels = group.querySelectorAll('label[style*="display: none"]');
        
        if (hiddenLabels.length > 0) {
          hiddenLabels.forEach(label => {
            label.style.display = 'flex';
          });
          link.textContent = 'Скрыть';
        } else {
          // Скрываем лишние (начиная с 6-го)
          const labels = group.querySelectorAll('label');
          labels.forEach((label, idx) => {
            if (idx >= 5) {
              label.style.display = 'none';
            }
          });
          link.textContent = 'Показать все';
        }
      });
    });
  }

})();
