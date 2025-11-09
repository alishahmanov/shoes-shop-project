

(function clockInit() {
    const el = document.getElementById("datetime");
    if (!el) return;

    function update() {
        const now = new Date();
        const options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        };
        el.textContent = now.toLocaleString("ru-RU", options);
    }

    update();
    setInterval(update, 1000);
})();
