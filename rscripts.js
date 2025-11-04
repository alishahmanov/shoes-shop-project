/* ===== Part 2: чистый скрипт без дублей ===== */

/* Утилита */
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

/* 1) Тема День/Ночь — с защитой от дублей кнопки */
(function themeToggleInit(){
  if (document.getElementById('themeToggle')) return;           // защита
  const navActions = document.querySelector('.navbar-actions') || document.querySelector('.site-navbar-actions');
  if (!navActions) return;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'nav-btn';
  btn.id = 'themeToggle';
  navActions.appendChild(btn);

  function applyTheme(name){
    if (name === 'dark'){
      document.body.classList.add('dark-theme');
      btn.textContent = 'День';
      btn.setAttribute('aria-pressed','true');
      btn.setAttribute('aria-label','Переключить на светлую тему');
    } else {
      document.body.classList.remove('dark-theme');
      btn.textContent = 'Ночь';
      btn.setAttribute('aria-pressed','false');
      btn.setAttribute('aria-label','Переключить на тёмную тему');
    }
  }

  const saved = localStorage.getItem('theme');
  if (saved){ applyTheme(saved); }
  else {
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  btn.addEventListener('click', ()=>{
    const isDark = document.body.classList.toggle('dark-theme');
    const t = isDark ? 'dark' : 'light';
    applyTheme(t);
    try{ localStorage.setItem('theme', t); }catch(_){}
  });
})();

/* 2) Аккордеон с aria (один открыт за раз) */
(function accordionInit(){
  const accButtons = $$('.accordion-header');
  if (!accButtons.length) return;

  accButtons.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const panelId = btn.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      const openedBtn = document.querySelector('.accordion-header[aria-expanded="true"]');
      if (openedBtn && openedBtn !== btn){
        const openedPanel = document.getElementById(openedBtn.getAttribute('aria-controls'));
        openedBtn.setAttribute('aria-expanded','false');
        openedBtn.classList.remove('active');
        if (openedPanel){ openedPanel.hidden = true; openedPanel.classList.remove('show'); }
      }

      btn.setAttribute('aria-expanded', String(!isOpen));
      btn.classList.toggle('active', !isOpen);
      if (panel){ panel.hidden = isOpen; panel.classList.toggle('show', !isOpen); }
    });
  });
})();

/* 3) Popup / Modal — доступно, без автоподключения ко всем .btn
      Используй data-open="popup" на кнопке-открывателе */
(function popupInit(){
  const popup = document.getElementById('popup');
  if (!popup) return;

  const content = popup.querySelector('.popup-content');
  const closeBtn = popup.querySelector('.close-btn');
  const openers = $$('[data-open="popup"]');           // только метки-открыватели

  let lastFocused = null;
  const getFocusable = (root) =>
      $$('a,button,input,textarea,select,[tabindex]:not([tabindex="-1"])', root)
          .filter(el => !el.disabled && el.getAttribute('aria-hidden') !== 'true');

  function openPopup(){
    lastFocused = document.activeElement;
    popup.style.display = 'flex';
    popup.setAttribute('aria-hidden','false');
    const f = getFocusable(content);
    (f[0] || content).focus();
    document.addEventListener('keydown', trap);
  }
  function closePopup(){
    popup.style.display = 'none';
    popup.setAttribute('aria-hidden','true');
    document.removeEventListener('keydown', trap);
    lastFocused && lastFocused.focus();
  }
  function trap(e){
    if (e.key === 'Escape') return closePopup();
    if (e.key !== 'Tab') return;
    const f = getFocusable(content);
    if (!f.length) return;
    const first = f[0], last = f[f.length-1];
    if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  }

  openers.forEach(b => b.addEventListener('click', openPopup));
  closeBtn?.addEventListener('click', closePopup);
  window.addEventListener('click', (e)=>{ if (e.target === popup) closePopup(); });
})();

/* 4) Тосты / уведомления (aria-live), без jQuery */
function showToast(message, type='success'){
  let container = document.getElementById('toast-container');
  if (!container){
    container = document.createElement('div');
    container.id = 'toast-container';
    container.setAttribute('role','region');
    container.setAttribute('aria-label','Уведомления');
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast-${type} toast-show`;
  toast.setAttribute('role','status');
  toast.setAttribute('aria-live','polite');
  toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-message">${message}</span>
      <button class="toast-close" aria-label="Закрыть уведомление">&times;</button>
    </div>`;
  container.appendChild(toast);

  const remove = ()=>{ toast.classList.add('toast-hide'); setTimeout(()=>toast.remove(), 300); };
  toast.querySelector('.toast-close')?.addEventListener('click', remove);
  toast.addEventListener('click', remove);
  setTimeout(remove, 3000);
}

/* 5) “Добавить в корзину” */
(function cartButtonsInit(){
  $$('.add-to-cart').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      e.preventDefault();
      const name = btn.getAttribute('data-name') || 'Товар';
      showToast(`Товар «${name}» добавлен в корзину!`, 'success');
    });
  });
})();

/* 6) Случайный фон (по id="changeColorBtn") */
(function randomBgInit(){
  const colorBtn = document.getElementById('changeColorBtn');
  if (!colorBtn) return;
  const colors = ['#f4f5f6','#ffe4e1','#e6f7ff','#e8ffe8','#fffbe6','#f0e6ff'];
  colorBtn.addEventListener('click', ()=>{
    const randomColor = colors[Math.floor(Math.random()*colors.length)];
    document.body.style.backgroundColor = randomColor;
  });
})();

/* 7) Галерея: показать больше (id="showMoreBtn") + lazy подключение */
(function showMoreInit(){
  const gallery = document.querySelector('.portfolio__gallery');
  const btn = document.getElementById('showMoreBtn');
  if (!gallery || !btn) return;

  btn.addEventListener('click', ()=>{
    const extra = document.createElement('img');
    extra.className = 'lazy-image';
    extra.alt = 'Пример работы #4';
    extra.width = 200; extra.height = 200;
    extra.src = 'Assets/placeholder.webp';
    extra.setAttribute('data-src','Assets/sneaker14.jpeg');
    gallery.appendChild(extra);
    observeLazy([extra]);
    btn.disabled = true;
  });
})();

/* 8) Лёгкий кликовый эффект (если motion не урезан) */
(function clickScaleInit(){
  const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;
  $$('.btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      btn.style.transform = 'scale(1.06)';
      setTimeout(()=> btn.style.transform = 'scale(1)', 180);
    });
  });
})();

/* 9) Фильтр по цене (₸: 299 000 → 299000) */
(function priceFilterInit(){
  const priceFilter = document.getElementById('priceFilter');
  const cards = $$('.cards-for-index .card');
  if (!priceFilter || !cards.length) return;

  priceFilter.addEventListener('change', ()=>{
    const selected = priceFilter.value;
    cards.forEach(card=>{
      const priceText = card.querySelector('.price')?.textContent || '';
      const price = parseInt(priceText.replace(/\D/g,''), 10) || 0; // в тенге
      let show = true;
      switch (selected){
        case 'cheap': show = price < 300000; break;
        case 'medium': show = price >= 300000 && price <= 450000; break;
        case 'expensive': show = price > 450000; break;
        default: show = true;
      }
      card.style.display = show ? 'block' : 'none';
      if (show){ card.style.opacity = '0'; setTimeout(()=> card.style.opacity = '1', 50); }
    });
  });
})();

/* 10) Lazy-loading для .lazy-image[data-src] */
let io;
function observeLazy(nodes){
  if (!('IntersectionObserver' in window)){
    nodes.forEach(img=>{
      const src = img.getAttribute('data-src');
      if (src) img.src = src;
      img.classList.add('loaded');
    });
    return;
  }
  if (!io){
    io = new IntersectionObserver((entries, obs)=>{
      entries.forEach(entry=>{
        if (!entry.isIntersecting) return;
        const img = entry.target;
        const dataSrc = img.getAttribute('data-src');
        if (dataSrc){
          const tmp = new Image();
          tmp.onload = ()=>{ img.src = dataSrc; img.classList.add('loaded'); };
          tmp.src = dataSrc;
        }
        obs.unobserve(img);
      });
    }, { rootMargin:'120px 0px' });
  }
  nodes.forEach(n => io.observe(n));
}
observeLazy($$('.lazy-image[data-src]'));

/* 11) Счётчики с учётом reduced motion */
(function countersInit(){
  const counters = $$('.counter');
  if (!counters.length) return;
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  function animate(el){
    const target = parseInt(el.getAttribute('data-target'),10) || 0;
    if (reduced){ el.textContent = String(target); return; }
    const duration = 800, start = performance.now(), from = 0;
    function tick(now){
      const p = Math.min(1, (now - start)/duration);
      el.textContent = String(Math.floor(from + (target-from)*p));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const io = new IntersectionObserver((entries, obs)=>{
    entries.forEach(e=>{
      if (!e.isIntersecting) return;
      animate(e.target);
      obs.unobserve(e.target);
    });
  }, { rootMargin:'120px 0px' });

  counters.forEach(c => io.observe(c));
})();

/* 12) Пример: форма подписки в модалке */
(function subscribeFormInit(){
  const form = document.getElementById('subscribeForm');
  if (!form) return;
  const email = document.getElementById('subEmail');
  const err = document.getElementById('err-sub');

  form.addEventListener('submit', (e)=>{
    err.textContent = '';
    if (!email.checkValidity()){
      e.preventDefault();
      email.setAttribute('aria-invalid','true');
      err.textContent = 'Введите корректный email';
      email.focus();
      return;
    }
    e.preventDefault();
    email.removeAttribute('aria-invalid');
    showToast('Подписка оформлена! Проверьте почту.', 'info');
    form.reset();
  });
})();
