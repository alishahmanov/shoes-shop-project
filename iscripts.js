const headers = document.querySelectorAll(".accordion-header");

headers.forEach(header => {
    header.addEventListener("click", () => {
        const openItem = document.querySelector(".accordion-content.show");
        const content = header.nextElementSibling;

        if (openItem && openItem !== content) {
            openItem.classList.remove("show");
            openItem.previousElementSibling.classList.remove("active");
        }

        content.classList.toggle("show");
        header.classList.toggle("active");
    });
});

document.getElementById("requestForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const message = document.getElementById("formMessage");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9+\-\s]{8,15}$/;

    if (name === "") {
        message.textContent = "Пожалуйста, введите ваше имя.";
        message.className = "mt-2 text-danger";
        return;
    }
    if (!emailPattern.test(email)) {
        message.textContent = "Введите корректный адрес электронной почты.";
        message.className = "mt-2 text-danger";
        return;
    }
    if (!phonePattern.test(phone)) {
        message.textContent = "Введите корректный номер телефона (8–15 символов).";
        message.className = "mt-2 text-danger";
        return;
    }

    message.textContent = "Заявка успешно отправлена!";
    message.className = "mt-2 text-success";

    this.reset();
});

// 1. Objects and Methods

const product = {
    name: "Custom Sneakers",
    basePrice: 29900,
    price: 29900,
    available: true,
    colors: ["white", "black", "red"],
    sizes: [38, 39, 40, 41, 42, 43],

    getInfo() {
        const priceStr = this.price.toLocaleString("ru-KZ");
        const availStr = this.available ? "Да" : "Нет";
        return `Товар: <b>${this.name}</b> • Цена: <b>${priceStr} ₸</b> • В наличии: <b>${availStr}</b>`;
    },

    applyDiscount(rate = 0.10) {

        const safeRate = Math.min(Math.max(rate, 0), 0.9);
        this.price = Math.round(this.basePrice * (1 - safeRate));
    },

    toggleAvailability() {
        this.available = !this.available;
    }
};


function renderProductInfo() {
    const box = document.getElementById("productInfo");
    if (!box) return;
    box.innerHTML = product.getInfo();
}

function wireProductControls() {
    const btnDiscount = document.getElementById("btnDiscount");
    const btnToggle = document.getElementById("btnToggleAvail");

    if (btnDiscount) {
        btnDiscount.addEventListener("click", () => {
            product.applyDiscount(0.10);  // -10%
            renderProductInfo();
        });
    }

    if (btnToggle) {
        btnToggle.addEventListener("click", () => {
            product.toggleAvailability();
            renderProductInfo();
        });
    }
}

renderProductInfo();
wireProductControls();

/* Array */

const benefits = [
    "Быстрое изготовление.",
    "Контролируем качество на каждом этапе.",
    "Создаём заметные и яркие модели.",
    "Обувь уникальна и отражает дух команды.",
    "Профессиональные «дышащие» материалы.",
    "Износостойкость, выдерживает постоянные стирки.",
    "Комфорт: не жмёт и не натирает."
];

const list = document.getElementById("benefitsList");
if (list) {
    for (let i = 0; i < benefits.length; i++) {
        const li = document.createElement("li");
        li.textContent = benefits[i];
        list.appendChild(li);
    }
}


// 3. Higher-Order Functions
const shoes = ["Бутсы", "Боксерки", "Борцовки", "Баскетбольные", "Волейбольные", "Беговые"];

const longNames = shoes
    .filter(item => item.length > 4)
    .map(item => item.toUpperCase());

const filtered = document.getElementById("filtered");
if (filtered) {
    let text = "";
    longNames.forEach((name, index) => {
        text += (index > 0 ? ", " : "") + name;
    });
    filtered.textContent = "Модели кроссовок: " + text;
}


// 4. Play Sounds

document.addEventListener("DOMContentLoaded", () => {
    const soundButton = document.getElementById("playSound");
    if (soundButton) {
        const sound = new Audio("Assets/click.mp3");
        soundButton.addEventListener("click", () => {
            sound.play();
        });
    }
});


// 5. Animations
const animCards = document.querySelectorAll(".anim-card");
animCards.forEach(card => {
    card.addEventListener("mouseover", () => {
        card.style.transform = "scale(1.05)";
        card.style.transition = "transform 0.3s ease";
    });
    card.addEventListener("mouseout", () => {
        card.style.transform = "scale(1)";
    });
});
