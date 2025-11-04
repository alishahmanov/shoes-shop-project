// ---------- Lazy images ----------
(function lazyImages() {
    const imgs = document.querySelectorAll('img.lazy-image[data-src]');
    const onIntersect = (entries, obs) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const img = e.target;
                img.src = img.dataset.src;
                img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
                obs.unobserve(img);
            }
        });
    };
    const io = 'IntersectionObserver' in window
        ? new IntersectionObserver(onIntersect, { rootMargin: '200px' })
        : null;

    imgs.forEach(img => (io ? io.observe(img) : (img.src = img.dataset.src)));
})();

// ---------- Toasts (минимальная реализация) ----------
function ensureToastContainer() {
    let c = document.getElementById('toast-container');
    if (!c) {
        c = document.createElement('div');
        c.id = 'toast-container';
        document.body.appendChild(c);
    }
    return c;
}
function showToast(msg, type = 'info') {
    const container = ensureToastContainer();
    const t = document.createElement('div');
    t.className = `toast toast-${type} toast-show`;
    t.innerHTML = `
    <div class="toast-content">
      <div class="toast-message">${msg}</div>
      <button class="toast-close" aria-label="Закрыть">×</button>
    </div>`;
    container.appendChild(t);

    const close = () => {
        t.classList.remove('toast-show');
        t.classList.add('toast-hide');
        setTimeout(() => t.remove(), 250);
    };
    t.querySelector('.toast-close').addEventListener('click', close);
    setTimeout(close, 3000);
}

// Клик по “Купить/В корзину”
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-to-cart');
    if (!btn) return;
    e.preventDefault();
    const card = btn.closest('.card');
    const title = card?.querySelector('h3, p')?.textContent?.trim() || 'Товар';
    showToast(`«${title}» добавлен в корзину`, 'success');
});

// ---------- Accessible Search (ARIA) ----------
(function catalogSearch() {
    const input = document.getElementById('searchInput');
    const list  = document.getElementById('suggestions');
    const clear = document.getElementById('clearSearch');
    if (!input || !list) return;

    const items = [...document.querySelectorAll('.cards-for-index .card p')].map(p => p.textContent.trim());
    const render = (arr) => {
        list.innerHTML = '';
        arr.slice(0, 6).forEach((text, i) => {
            const li = document.createElement('li');
            li.id = `sugg-${i}`;
            li.role = 'option';
            li.tabIndex = -1;
            li.textContent = text;
            li.addEventListener('mousedown', () => {
                input.value = text;
                filterCards(text);
                toggleList(false);
            });
            list.appendChild(li);
        });
    };
    const toggleList = (open) => {
        input.setAttribute('aria-expanded', String(open));
        list.style.display = open ? 'block' : 'none';
    };
    const filterCards = (q) => {
        const qn = q.trim().toLowerCase();
        document.querySelectorAll('.cards-for-index .card').forEach(card => {
            const title = card.querySelector('p')?.textContent.toLowerCase() || '';
            card.style.display = title.includes(qn) ? '' : 'none';
        });
    };

    input.addEventListener('input', () => {
        const q = input.value.trim().toLowerCase();
        if (!q) { render([]); toggleList(false); filterCards(''); return; }
        const matched = items.filter(x => x.toLowerCase().includes(q));
        render(matched);
        toggleList(matched.length > 0);
        filterCards(input.value);
    });

    input.addEventListener('keydown', (e) => {
        const opts = [...list.querySelectorAll('[role="option"]')];
        const idx  = opts.findIndex(el => el === document.activeElement);
        if (e.key === 'ArrowDown') { e.preventDefault(); (opts[idx + 1] || opts[0])?.focus(); }
        if (e.key === 'ArrowUp')   { e.preventDefault(); (opts[idx - 1] || opts.at(-1))?.focus(); }
        if (e.key === 'Escape')    { toggleList(false); list.innerHTML = ''; }
        if (e.key === 'Enter' && document.activeElement?.role === 'option') {
            e.preventDefault();
            input.value = document.activeElement.textContent;
            filterCards(input.value);
            toggleList(false);
        }
    });

    clear?.addEventListener('click', () => {
        input.value = '';
        filterCards('');
        toggleList(false);
        list.innerHTML = '';
        input.focus();
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-bar')) { toggleList(false); }
    });
})();
