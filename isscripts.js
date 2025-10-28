$(document).ready(function () {
    $(window).on("scroll", function () {
        const scrollTop = $(window).scrollTop();
        const docHeight = $(document).height() - $(window).height();
        const scrollPercent = (scrollTop / docHeight) * 100;
        $("#scrollProgress").css("width", scrollPercent + "%");
    });
});

// Animated Counter
$(document).ready(function () {
    function animateCounter($el) {
        const target = +$el.data("target");
        let count = 0;
        const increment = Math.ceil(target / 100); // скорость анимации

        const interval = setInterval(() => {
            count += increment;
            if (count >= target) {
                count = target;
                clearInterval(interval);
            }
            $el.text(count.toLocaleString("ru-RU"));
        }, 30);
    }

    $(".counter").each(function () {
        animateCounter($(this));
    });
});



$(document).ready(function () {
    $("#requestForm").on("submit", function (e) {
        e.preventDefault();

        const $btn = $("#submitBtn");
        const originalText = $btn.html();

        $btn.html('<span class="spinner"></span> Пожалуйста, подождите…');
        $btn.prop("disabled", true);

        setTimeout(() => {
            $btn.html(originalText);
            $btn.prop("disabled", false);
            $("#formMessage").text("Заявка успешно отправлена!").removeClass().addClass("mt-2 text-success");
            $("#requestForm")[0].reset();
        }, 3000);
    });
});

