// order.js — логика формы заказа: превью, валидация, калькулятор цены
(function () {
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

    // элементы
    const form = $("#orderForm");
    const msg = $("#formMessage");

    const model = $("#model");
    const size = $("#size");
    const qty = $("#qty");
    const color = $("#color");
    const material = $("#material");
    const insole = $("#insole");
    const extraChecks = $$(".extra-check");
    const delivery = $("#delivery");

    const priceBase = $("#priceBase");
    const priceExtras = $("#priceExtras");
    const priceDelivery = $("#priceDelivery");
    const priceTotal = $("#priceTotal");
    const qtyText = $("#qtyText");

    const previewBase = $("#previewBase");
    const previewTint = $("#previewTint");
    const previewRef = $("#previewRef");
    const referenceInput = $("#reference");
    const logoText = $("#logoText");

    // helpers
    const toNum = (v) => Number(String(v || 0).replace(/[^\d.-]/g, "")) || 0;
    const fmt = (n) => n.toString();

    function currentBasePrice() {
        const opt = model?.selectedOptions?.[0];
        return toNum(opt?.dataset?.price);
    }

    function extrasSum() {
        let sum = 0;
        sum += toNum(material?.selectedOptions?.[0]?.dataset?.extra);
        sum += toNum(insole?.selectedOptions?.[0]?.dataset?.extra);
        extraChecks.forEach((c) => (sum += c.checked ? toNum(c.dataset.extra) : 0));
        return sum;
    }

    function deliveryPrice() {
        return toNum(delivery?.selectedOptions?.[0]?.dataset?.extra);
    }

    function recalc() {
        const base = currentBasePrice();
        const extras = extrasSum();
        const del = deliveryPrice();
        const q = Math.max(1, toNum(qty?.value));

        priceBase.textContent = fmt(base);
        priceExtras.textContent = fmt(extras);
        priceDelivery.textContent = fmt(del);

        const total = (base + extras) * q + del;
        priceTotal.textContent = fmt(total);
        qtyText.textContent = q;
    }

    // превью цвета
    function updateTint() {
        const val = color?.value || "#111111";
        previewTint.style.background = val;
        previewTint.style.opacity = "0.35";
    }

    // превью референса
    function handleReference() {
        const f = referenceInput.files?.[0];
        if (!f) {
            previewRef.classList.add("d-none");
            previewRef.src = "";
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            previewRef.src = reader.result;
            previewRef.classList.remove("d-none");
        };
        reader.readAsDataURL(f);
    }

    // примитивная валидация
    function validate() {
        msg.textContent = "";
        msg.className = "mt-2";

        const name = $("#name").value.trim();
        const email = $("#email").value.trim();
        const phone = $("#phone").value.trim();
        const agree = $("#agree").checked;

        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRe = /^[0-9+\-\s]{8,15}$/;

        if (!name) return fail("Введите имя.");
        if (!emailRe.test(email)) return fail("Введите корректный email.");
        if (!phoneRe.test(phone)) return fail("Введите корректный номер (8–15 символов).");
        if (!model.value) return fail("Выберите модель.");
        if (!size.value) return fail("Укажите размер.");
        if (!agree) return fail("Нужно согласие на обработку данных.");

        return true;

        function fail(text) {
            msg.textContent = text;
            msg.classList.add("text-danger");
            return false;
        }
    }

    // отправка
    form?.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!validate()) return;

        // соберём данные (демо)
        const payload = {
            name: $("#name").value.trim(),
            phone: $("#phone").value.trim(),
            email: $("#email").value.trim(),
            model: model.value,
            size: size.value,
            qty: Math.max(1, toNum(qty.value)),
            color: color.value,
            material: material.value,
            insole: insole.value,
            logo: $("#extraLogo").checked ? (logoText.value || "YES") : "NO",
            painting: $("#extraPaint").checked ? "YES" : "NO",
            delivery: delivery.value,
            pay: $("#pay").value,
            amount: toNum(priceTotal.textContent),
        };

        // имитация успешной отправки
        msg.textContent = "Заявка успешно отправлена! Мы свяжемся с вами.";
        msg.className = "mt-2 text-success";
        form.reset();
        updateTint();
        recalc();
        previewRef.classList.add("d-none");
        previewRef.src = "";

        // если есть глобальная showToast из rscripts.js — воспользуемся
        if (typeof window.showToast === "function") {
            window.showToast("Заявка отправлена ✅", "success");
        }
        console.log("[order] payload:", payload);
    });

    // бинды
    [model, size, qty, material, insole, delivery, ...extraChecks].forEach((el) =>
        el?.addEventListener("change", recalc)
    );
    color?.addEventListener("input", updateTint);
    referenceInput?.addEventListener("change", handleReference);

    // стартовые значения
    updateTint();
    recalc();
})();
