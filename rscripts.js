// ========== Смена случайного фона (из category.html) ==========
const colorBtn = document.getElementById("changeColorBtn");
if (colorBtn) {
  const colors = [
    "#f4f5f6",
    "#ffe4e1",
    "#e6f7ff",
    "#e8ffe8",
    "#fffbe6",
    "#f0e6ff",
  ];
  colorBtn.addEventListener("click", () => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.backgroundColor = randomColor;
  });
}

// ========== Popup из services.html ==========
const popup = document.getElementById("popup");
const openBtns = document.querySelectorAll(".contact__actions .btn");
const closeBtn = document.querySelector(".close-btn");

if (popup && openBtns && closeBtn) {
  openBtns.forEach((btn) =>
    btn.addEventListener("click", () => (popup.style.display = "flex"))
  );
  closeBtn.addEventListener("click", () => (popup.style.display = "none"));
  window.addEventListener("click", (e) => {
    if (e.target === popup) popup.style.display = "none";
  });
}

// ========== Тема День/Ночь ==========
const themeToggle = document.createElement("button");
themeToggle.className = "nav-btn";
// Append toggle to navbar actions if present
// Append to header actions on all pages (support both .navbar-actions and .site-navbar-actions)
const navActions = document.querySelector('.navbar-actions') || document.querySelector('.site-navbar-actions');
navActions?.appendChild(themeToggle);

// Apply theme by name ('light' or 'dark')
function applyTheme(name) {
  if (name === "dark") {
    document.body.classList.add("dark-theme");
    themeToggle.textContent = "День"; // show action to switch to day
    themeToggle.setAttribute('aria-pressed', 'true');
    themeToggle.setAttribute('aria-label', 'Переключить на светлую тему');
  } else {
    document.body.classList.remove("dark-theme");
    themeToggle.textContent = "Ночь"; // show action to switch to night
    themeToggle.setAttribute('aria-pressed', 'false');
    themeToggle.setAttribute('aria-label', 'Переключить на темную тему');
  }
}

// Load saved preference or system preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  applyTheme(savedTheme);
} else {
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark ? 'dark' : 'light');
}

// Toggle handler: update DOM and persist
themeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark-theme');
  const newTheme = isDark ? 'dark' : 'light';
  applyTheme(newTheme); // update label/aria
  try {
    localStorage.setItem('theme', newTheme);
  } catch (err) {
    console.warn('Could not save theme preference', err);
  }
});

// ========== Манипуляция атрибутами: Галерея ==========
const gallery = document.querySelector(".portfolio__gallery");
if (gallery) {
  const showMore = document.createElement("button");
  showMore.textContent = "Показать больше";
  showMore.className = "btn";
  gallery.after(showMore);

  showMore.addEventListener("click", () => {
    const extra = document.createElement("img");
    extra.src = "Assets/sneaker19.jpeg";
    extra.alt = "Пример работы #4";
    extra.style.animation = "fadeInDown 0.5s";
    gallery.appendChild(extra);
    showMore.disabled = true;
  });
}

// ========== Анимация: масштаб кнопок при клике ==========
document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.style.transform = "scale(1.1)";
    setTimeout(() => (btn.style.transform = "scale(1)"), 200);
  });
});

// --- Switch Statement: фильтр по цене ---
document.addEventListener("DOMContentLoaded", () => {
  const priceFilter = document.getElementById("priceFilter");
  const productCards = document.querySelectorAll(".card");

  if (!priceFilter || !productCards.length) return;

  priceFilter.addEventListener("change", () => {
    const selected = priceFilter.value;

    productCards.forEach((card) => {
      const priceText = card.querySelector(".price").textContent;
      const price = parseInt(priceText.replace(/\D/g, ""));
      let show = true;

      switch (selected) {
        case "cheap":
          show = price < 300;
          break;
        case "medium":
          show = price >= 300 && price <= 450;
          break;
        case "expensive":
          show = price > 450;
          break;
        default:
          show = true;
      }
      card.style.display = show ? "block" : "none";
      if (show) {
        card.style.opacity = "0";
        setTimeout(() => (card.style.opacity = "1"), 50);
      }
    });
  });
});

// ========== jQuery Functions ==========
$(document).ready(function(){
  console.log("jQuery is ready!");
  
  // Task 7: Notification System
  function showToast(message, type = 'success') {
    // Ensure container exists and is positioned correctly
    let container = $('#toast-container');
    if (container.length === 0) {
      container = $('<div id="toast-container" style="position: fixed !important; top: 20px !important; right: 20px !important; z-index: 999999 !important; display: flex !important; flex-direction: column !important; gap: 12px !important; max-width: 380px !important;"></div>');
      $('body').append(container);
    }
    
    const toast = $(`
      <div class="toast toast-${type}" style="position: relative !important; display: block !important;">
        <div class="toast-content">
          <span class="toast-message">${message}</span>
          <button class="toast-close">&times;</button>
        </div>
      </div>
    `);
    
    container.append(toast);
    
    // Show toast with enhanced animation
    toast.css('display', 'block').addClass('toast-show');
    
    // Auto remove after 3 seconds with exit animation
    setTimeout(() => {
      toast.addClass('toast-hide').removeClass('toast-show');
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 3000);
    
    // Manual close button with animation
    toast.find('.toast-close').on('click', function() {
      toast.addClass('toast-hide fade-out').removeClass('toast-show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    });
    
    // Click to dismiss
    toast.on('click', function() {
      toast.addClass('toast-hide fade-out').removeClass('toast-show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    });
  }
  
  // Add to cart functionality with notifications
  $('.card .btn').on('click', function(e) {
    e.preventDefault();
    const productName = $(this).closest('.card').find('.card__title').text();
    showToast(`Товар "${productName}" добавлен в корзину!`, 'success');
  });
  
  // Form submission notification (for services page)
  $('#contactForm').on('submit', function(e) {
    e.preventDefault();
    showToast('Форма успешно отправлена! Мы свяжемся с вами в ближайшее время.', 'info');
    this.reset();
  });
  
  // Task 8: Copy to Clipboard functionality
  $('.copy-btn').on('click', function() {
    const textToCopy = $(this).data('text');
    const button = $(this);
    const originalIcon = button.text();
    
    // Use the modern Clipboard API
    navigator.clipboard.writeText(textToCopy).then(() => {
      // Change text to checkmark
      button.text('✓ Скопировано');
      button.addClass('copied');
      button.attr('title', 'Скопировано!');
      
      // Show tooltip
      showToast('Скопировано в буфер обмена!', 'success');
      
      // Restore original text after 2 seconds
      setTimeout(() => {
        button.text(originalIcon);
        button.removeClass('copied');
        button.attr('title', button.attr('data-original-title') || 'Копировать');
      }, 2000);
    }).catch(err => {
      // Fallback for older browsers
      const textarea = $('<textarea>');
      textarea.val(textToCopy);
      $('body').append(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
      
      button.text('✓ Скопировано');
      button.addClass('copied');
      showToast('Скопировано в буфер обмена!', 'success');
      
      setTimeout(() => {
        button.text(originalIcon);
        button.removeClass('copied');
      }, 2000);
    });
  });
  
  // Task 9: Image Lazy Loading
  function lazyLoadImages() {
    const images = $('.lazy-image');
    const windowHeight = $(window).height();
    const scrollTop = $(window).scrollTop();
    
    images.each(function() {
      const image = $(this);
      const imageTop = image.offset().top;
      
      // Check if image is in viewport (with 100px buffer for smoother loading)
      if (imageTop < scrollTop + windowHeight + 100 && !image.hasClass('loaded')) {
        const dataSrc = image.attr('data-src');
        
        if (dataSrc) {
          // Create new image to preload
          const newImg = new Image();
          newImg.onload = function() {
            // Once loaded, replace src and add loaded class
            image.attr('src', dataSrc);
            image.addClass('loaded');
            image.fadeIn(500); // Smooth fade-in effect
          };
          newImg.src = dataSrc;
        }
      }
    });
  }
  
  // Initial check and bind scroll event
  lazyLoadImages();
  $(window).on('scroll', lazyLoadImages);
  $(window).on('resize', lazyLoadImages);
});
