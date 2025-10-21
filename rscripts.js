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
themeToggle.textContent = " Ночь / День ";
themeToggle.className = "nav-btn";
document.querySelector(".navbar-actions")?.appendChild(themeToggle);

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
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
