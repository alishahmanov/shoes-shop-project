
function updateDateTime() {
    const now = new Date();

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    };

    const formattedDate = now.toLocaleString("ru-RU", options);
    const datetimeElement = document.getElementById("datetime");

    if (datetimeElement) {
        datetimeElement.textContent = formattedDate;
    }
}


let autoUpdateInterval = setInterval(updateDateTime, 1000);
updateDateTime();




const showTimeBtn = document.getElementById("showTimeBtn");
const datetimeElement = document.getElementById("datetime");
let showTimeTimeout; // для отмены старого таймера

if (showTimeBtn) {
    showTimeBtn.addEventListener("click", () => {
        const currentTime = new Date().toLocaleTimeString("ru-RU");
        datetimeElement.textContent = "Текущее время: " + currentTime;


        showTimeBtn.style.transform = "scale(0.95)";
        setTimeout(() => (showTimeBtn.style.transform = "scale(1)"), 150);


        clearInterval(autoUpdateInterval);
        clearTimeout(showTimeTimeout);
        showTimeTimeout = setTimeout(() => {
            autoUpdateInterval = setInterval(updateDateTime, 1000);
            updateDateTime();
        }, 5000);
    });
}

// --- Keyboard navigation in catalog.html ---
document.addEventListener("DOMContentLoaded", () => {
    const catalogCards = document.querySelectorAll(
        ".cards-for-index .card, .popular-shoes .card"
    );
    if (!catalogCards.length) return;

    let currentIndex = 0;


    catalogCards[currentIndex].classList.add("highlight");

    document.addEventListener("keydown", (e) => {
        if (!catalogCards.length) return;

        const prevCard = catalogCards[currentIndex];

        switch (e.key) {
            case "ArrowRight":
            case "ArrowDown":
                currentIndex = (currentIndex + 1) % catalogCards.length;
                break;

            case "ArrowLeft":
            case "ArrowUp":
                currentIndex =
                    (currentIndex - 1 + catalogCards.length) % catalogCards.length;
                break;

            case "Enter":
                // нажимаем кнопку внутри текущей карточки
                const btn = catalogCards[currentIndex].querySelector("button, .btn");
                if (btn) btn.click();
                break;

            default:
                return;
        }


        prevCard.classList.remove("highlight");
        catalogCards[currentIndex].classList.add("highlight");


        catalogCards[currentIndex].scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
        });
    });
});



