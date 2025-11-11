// category.js
document.addEventListener("DOMContentLoaded", () => {
    console.log("[category.js] loaded");

    // Переключатель темы (кроме кнопки из rscripts.js — не конфликтует)
    const themeBtn = document.getElementById("changeColorBtn");
    themeBtn?.addEventListener("click", () => {
        document.body.classList.toggle("dark-theme");
    });

    // Фильтры
    const priceSelect = document.getElementById("priceFilter");
    const productList = document.getElementById("productList");
    const pagination = document.querySelector(".pagination");
    if (!priceSelect || !productList) return;

    // Массив для хранения всех товаров (с обеих страниц)
    let allProducts = [];
    let currentPageProducts = [];

    // Объект для хранения активных фильтров
    const activeFilters = {
        brand: new Set(),
        category: new Set(),
        color: new Set(),
        price: 'all'
    };

    // Функция загрузки товаров с текущей страницы
    const loadCurrentPageProducts = () => {
        const cards = Array.from(productList.querySelectorAll("li.card"));
        currentPageProducts = cards.map(card => ({
            element: card.cloneNode(true),
            price: Number(card.dataset.price || "0"),
            brand: card.dataset.brand || "",
            category: card.dataset.category || "",
            colors: (card.dataset.color || "").split(" "),
            isOriginal: true
        }));
        allProducts = [...currentPageProducts];
    };

    // Функция загрузки товаров со второй страницы
    const loadOtherPageProducts = async () => {
        const currentPage = window.location.pathname;
        const isPage1 = currentPage.includes('category.html') && !currentPage.includes('category-page2');
        const otherPageUrl = isPage1 ? 'category-page2.html' : 'category.html';

        try {
            const response = await fetch(otherPageUrl);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const otherCards = doc.querySelectorAll('#productList li.card');

            otherCards.forEach(card => {
                allProducts.push({
                    element: card.cloneNode(true),
                    price: Number(card.dataset.price || "0"),
                    brand: card.dataset.brand || "",
                    category: card.dataset.category || "",
                    colors: (card.dataset.color || "").split(" "),
                    isOriginal: false
                });
            });

            console.log(`Загружено товаров: ${allProducts.length} (текущая: ${currentPageProducts.length}, другая: ${otherCards.length})`);
        } catch (error) {
            console.error('Ошибка загрузки товаров с другой страницы:', error);
        }
    };

    // Функция проверки соответствия товара фильтрам
    const matchesFilters = (product) => {
        // Проверка цены
        const priceMatch = activeFilters.price === "all" ? true :
            activeFilters.price === "cheap" ? product.price <= 30000 :
            activeFilters.price === "medium" ? product.price >= 30000 && product.price <= 45000 :
            activeFilters.price === "expensive" ? product.price > 45000 : true;

        // Проверка бренда
        const brandMatch = activeFilters.brand.size === 0 || activeFilters.brand.has(product.brand);

        // Проверка категории
        const categoryMatch = activeFilters.category.size === 0 || activeFilters.category.has(product.category);

        // Проверка цвета (товар подходит, если хотя бы один его цвет выбран)
        const colorMatch = activeFilters.color.size === 0 || 
            product.colors.some(color => activeFilters.color.has(color));

        return priceMatch && brandMatch && categoryMatch && colorMatch;
    };

    // Функция проверки активности фильтров
    const hasActiveFilters = () => {
        return activeFilters.brand.size > 0 || 
               activeFilters.category.size > 0 || 
               activeFilters.color.size > 0 || 
               activeFilters.price !== 'all';
    };

    // Функция применения всех фильтров
    const applyFilters = () => {
        // Если фильтры активны, показываем товары со всех страниц
        if (hasActiveFilters()) {
            // Скрываем пагинацию
            if (pagination) pagination.style.display = 'none';

            // Очищаем список
            productList.innerHTML = '';

            // Фильтруем и добавляем подходящие товары
            const filteredProducts = allProducts.filter(matchesFilters);
            filteredProducts.forEach(product => {
                const clonedCard = product.element.cloneNode(true);
                productList.appendChild(clonedCard);
            });

            console.log(`Показано товаров: ${filteredProducts.length} из ${allProducts.length}`);
        } else {
            // Если фильтры не активны, показываем только товары текущей страницы
            if (pagination) pagination.style.display = 'flex';

            productList.innerHTML = '';
            currentPageProducts.forEach(product => {
                const clonedCard = product.element.cloneNode(true);
                productList.appendChild(clonedCard);
            });

            console.log(`Показаны оригинальные товары страницы: ${currentPageProducts.length}`);
        }

        // Обновляем lazy loading для изображений
        productList.querySelectorAll(".card__media img").forEach((img) => {
            img.removeAttribute("style");
            img.loading = "lazy";
            img.decoding = "async";
        });
    };

    // Обработчик фильтра по цене
    priceSelect.addEventListener("change", () => {
        activeFilters.price = priceSelect.value;
        applyFilters();
    });

    // Обработчики чекбоксов фильтров
    document.querySelectorAll('.filters input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const filterType = checkbox.dataset.filter;
            const value = checkbox.value;

            if (!filterType || !value) return;

            if (checkbox.checked) {
                activeFilters[filterType].add(value);
            } else {
                activeFilters[filterType].delete(value);
            }

            applyFilters();
        });
    });

    // Инициализация: загружаем товары
    const init = async () => {
        loadCurrentPageProducts();
        await loadOtherPageProducts();
        applyFilters();
    };

    init();
});

// Клик по "В корзину" (делегирование событий)
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;
    e.preventDefault();
    
    const card = btn.closest('.card');
    const title = card?.querySelector('.card__title')?.textContent?.trim() || 'Товар';
    const priceText = card?.querySelector('.card__price')?.textContent?.trim() || '0';
    const price = parseInt(priceText.replace(/[^\d]/g, '')) || 25000;
    const image = card?.querySelector('.card__media img')?.src || 'Assets/sneaker21.jpeg';
    
    // Создаем объект товара
    const product = {
        id: `product-${Date.now()}-${Math.random()}`,
        title: title,
        description: 'Качественная обувь из каталога',
        price: price,
        image: image
    };
    
    // Добавляем в корзину
    if (addToCart(product)) {
        showToast(`«${title}» добавлен в корзину`, 'success');
    } else {
        showToast('Ошибка при добавлении в корзину', 'error');
    }

});
