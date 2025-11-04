// category.js
document.addEventListener("DOMContentLoaded", () => {
    console.log("[category.js] loaded");

    // Переключатель темы (кроме кнопки из rscripts.js — не конфликтует)
    const themeBtn = document.getElementById("changeColorBtn");
    themeBtn?.addEventListener("click", () => {
        document.body.classList.toggle("dark-theme");
    });

    // Фильтр по цене
    const select = document.getElementById("priceFilter");
    const list = document.getElementById("productList");
    if (!select || !list) return;

    const inRange = (val, opt) =>
        opt === "cheap" ? val <= 300 :
            opt === "medium" ? val >= 300 && val <= 450 :
                opt === "expensive" ? val > 450 : true;

    const applyFilter = () => {
        const option = select.value;
        list.querySelectorAll("li.card").forEach((li) => {
            const price = Number(li.dataset.price || "0");
            li.hidden = !inRange(price, option);
        });
    };

    select.addEventListener("change", applyFilter);
    applyFilter();

    // Чистим возможные инлайновые размеры картинок
    list.querySelectorAll(".card__media img").forEach((img) => {
        img.removeAttribute("style");
        img.loading = "lazy";
        img.decoding = "async";
    });
});
