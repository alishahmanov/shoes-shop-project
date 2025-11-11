

(function clockInit() {
    const el = document.getElementById("datetime");
    if (!el) return;

    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');

        header.addEventListener('click', () => {

            accordionItems.forEach(other => {
                if (other !== item) {
                    other.classList.remove('active');
                    const otherContent = other.querySelector('.accordion-content');
                    otherContent.style.maxHeight = 0;
                }
            });
            item.classList.toggle('active');

            if (item.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = 0;
            }
        });
    });




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
