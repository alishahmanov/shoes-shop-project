// services.js — popup + простая валидация формы контакта
(function () {
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

    const popup = $("#popup");
    const content = popup?.querySelector(".popup-content");
    const openBtns = $$(".js-open-popup");
    const closeBtn = popup?.querySelector(".close-btn");
    const form = $("#contactForm");
    const err = $("#cerror");

    let lastFocused = null;

    function openPopup() {
        if (!popup) return;
        lastFocused = document.activeElement;
        popup.style.display = "flex";
        popup.setAttribute("aria-hidden", "false");
        // фокус в модалке
        (content || popup).focus();
        document.addEventListener("keydown", onKey);
    }
    function closePopup() {
        if (!popup) return;
        popup.style.display = "none";
        popup.setAttribute("aria-hidden", "true");
        document.removeEventListener("keydown", onKey);
        lastFocused && lastFocused.focus();
    }
    function onKey(e) {
        if (e.key === "Escape") closePopup();
    }

    openBtns.forEach((b) => b.addEventListener("click", openPopup));
    closeBtn?.addEventListener("click", closePopup);
    window.addEventListener("click", (e) => {
        if (e.target === popup) closePopup();
    });

    // простая валидация формы
    form?.addEventListener("submit", (e) => {
        e.preventDefault();
        err.textContent = "";
        const name = $("#cname").value.trim();
        const email = $("#cemail").value.trim();
        const msg = $("#cmsg").value.trim();
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name) return fail("Введите имя.");
        if (!emailRe.test(email)) return fail("Введите корректный email.");
        if (!msg) return fail("Опишите ваш вопрос.");

        // успех
        err.textContent = "Сообщение отправлено! Мы свяжемся с вами.";
        err.style.color = "green";
        form.reset();

        if (typeof window.showToast === "function") {
            window.showToast("Запрос отправлен", "success");
        }
        setTimeout(closePopup, 800);

        function fail(text) {
            err.textContent = text;
            err.style.color = "crimson";
        }
    });
})();
