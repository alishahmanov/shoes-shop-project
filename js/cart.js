

// Получаем корзину из localStorage
function getCart() {
  try {
    const cart = localStorage.getItem('shoppingCart');
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Ошибка при чтении корзины:', error);
    return [];
  }
}

// Сохраняем корзину в localStorage
function saveCart(cart) {
  try {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    updateCartCount();
  } catch (error) {
    console.error('Ошибка при сохранении корзины:', error);
  }
}

// Обновляем счетчик товаров в корзине
function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountElement = document.getElementById('cart-count');
  if (cartCountElement) {
    cartCountElement.textContent = totalItems;
  }
}

// Рендерим товары корзины
function renderCart() {
  const cart = getCart();
  const cartItemsContainer = document.getElementById('cart-items');
  const cartEmpty = document.getElementById('cart-empty');
  const cartSummary = document.getElementById('cart-summary');

  if (cart.length === 0) {
    // Очищаем товары, но оставляем cart-empty
    const items = cartItemsContainer.querySelectorAll('.cart-item');
    items.forEach(item => item.remove());
    
    cartEmpty.style.display = 'block';
    cartSummary.style.display = 'none';
    return;
  }

  cartEmpty.style.display = 'none';
  cartSummary.style.display = 'block';

  // Удаляем старые товары (но не cart-empty)
  const oldItems = cartItemsContainer.querySelectorAll('.cart-item');
  oldItems.forEach(item => item.remove());

  // Создаем HTML для каждого товара
  const itemsHTML = cart.map((item, index) => `
    <div class="cart-item" data-index="${index}">
      <div class="cart-item-image">
        <img src="${item.image || 'Assets/sneaker21.jpeg'}" alt="${item.title}" loading="lazy">
      </div>
      <div class="cart-item-info">
        <h3 class="cart-item-title">${item.title}</h3>
        <p class="cart-item-description">${item.description || 'Качественная обувь'}</p>
        <div class="cart-item-price">${formatPrice(item.price)} ₸</div>
        <div class="cart-item-controls">
          <div class="cart-item-quantity">
            <button class="qty-decrease" data-index="${index}" aria-label="Уменьшить количество">−</button>
            <span>${item.quantity}</span>
            <button class="qty-increase" data-index="${index}" aria-label="Увеличить количество">+</button>
          </div>
        </div>
      </div>
      <div class="cart-item-remove">
        <div class="cart-item-total">${formatPrice(item.price * item.quantity)} ₸</div>
        <button class="btn-remove" data-index="${index}">Удалить</button>
      </div>
    </div>
  `).join('');

  // Вставляем товары после cart-empty
  cartEmpty.insertAdjacentHTML('afterend', itemsHTML);

  // Обновляем итоги
  updateSummary(cart);

  // Добавляем обработчики событий
  attachEventListeners();
}

// Форматируем цену (добавляем пробелы)
function formatPrice(price) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// Обновляем итоги заказа
function updateSummary(cart) {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = subtotal >= 50000 ? 0 : 2000;
  const total = subtotal + shippingCost;

  document.getElementById('summary-count').textContent = totalItems;
  document.getElementById('summary-subtotal').textContent = formatPrice(subtotal) + ' ₸';
  document.getElementById('summary-shipping').textContent = shippingCost === 0 ? 'Бесплатно' : formatPrice(shippingCost) + ' ₸';
  document.getElementById('summary-total').textContent = formatPrice(total) + ' ₸';
}

// Увеличение количества товара
function increaseQuantity(index) {
  const cart = getCart();
  if (cart[index]) {
    cart[index].quantity += 1;
    saveCart(cart);
    renderCart();
    showToast(`Количество увеличено: ${cart[index].title}`, 'success');
  }
}

// Уменьшение количества товара
function decreaseQuantity(index) {
  const cart = getCart();
  if (cart[index]) {
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
      saveCart(cart);
      renderCart();
      showToast(`Количество уменьшено: ${cart[index].title}`, 'success');
    } else {
      removeItem(index);
    }
  }
}

// Удаление товара из корзины
function removeItem(index) {
  const cart = getCart();
  if (cart[index]) {
    const itemTitle = cart[index].title;
    
    // Подтверждение удаления
    if (!confirm(`Удалить "${itemTitle}" из корзины?`)) {
      return;
    }
    
    // Удаляем товар из данных
    cart.splice(index, 1);
    saveCart(cart);
    
    // Сразу перерисовываем всю корзину
    renderCart();
    showToast(`«${itemTitle}» удален из корзины`, 'info');
  }
}

// Очистка корзины
function clearCart() {
  const cart = getCart();
  if (cart.length === 0) {
    showToast('Корзина уже пуста', 'info');
    return;
  }
  
  if (confirm(`Вы уверены, что хотите удалить все товары (${cart.length} шт.) из корзины?`)) {
    localStorage.removeItem('shoppingCart');
    updateCartCount();
    renderCart();
    showToast('Корзина очищена ✓', 'success');
  }
}

// Оформление заказа
function checkout() {
  const cart = getCart();
  if (cart.length === 0) {
    showToast('Корзина пуста!', 'error');
    return;
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Здесь можно добавить реальную обработку заказа
  showToast(`Заказ на ${totalItems} товаров на сумму ${formatPrice(total)} ₸ оформлен! 🎉`, 'success', 10000);
  
  // Очищаем корзину после "оформления"
  setTimeout(() => {
    localStorage.removeItem('shoppingCart');
    updateCartCount();
    renderCart();
  }, 2000);
}

// Подключаем обработчики событий
function attachEventListeners() {
  // Увеличение количества
  document.querySelectorAll('.qty-increase').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      increaseQuantity(index);
    });
  });

  // Уменьшение количества
  document.querySelectorAll('.qty-decrease').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      decreaseQuantity(index);
    });
  });

  // Удаление товара
  document.querySelectorAll('.btn-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      removeItem(index);
    });
  });
}

// Инициализация корзины при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  renderCart();

  // Обработчик для кнопки "Оформить заказ"
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', checkout);
  }

  // Обработчик для кнопки "Очистить корзину"
  const clearCartBtn = document.getElementById('clear-cart-btn');
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', clearCart);
  }
});
