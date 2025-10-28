$(document).ready(function () {
    console.log("jQuery is ready!");

    const $input = $("#searchInput");
    const $suggestions = $("#suggestions");
    const $cards = $(".cards-for-index .card, .popular-shoes .card");


    const productNames = $cards
        .map(function () {
            return $(this).find("p, h3").first().text().trim();
        })
        .get();


    $input.on("keyup", function () {
        const query = $(this).val().toLowerCase();


        $cards.each(function () {
            const text = $(this).text().toLowerCase();
            $(this).toggle(text.includes(query));
        });


        if (query.length > 0) {
            const filtered = productNames.filter((name) =>
                name.toLowerCase().includes(query)
            );
            renderSuggestions(filtered);
        } else {
            $suggestions.hide().empty();
        }


        highlightMatches(query);
    });


    function renderSuggestions(list) {
        $suggestions.empty().show();
        list.slice(0, 5).forEach((item) => {
            $("<li>")
                .text(item)
                .appendTo($suggestions)
                .on("click", function () {
                    $input.val(item);
                    $suggestions.hide();
                    $input.trigger("keyup");
                });
        });
    }


    function highlightMatches(keyword) {
        $cards.each(function () {
            const $texts = $(this).find("p, h3");
            $texts.each(function () {
                const text = $(this).text();
                if (keyword.length === 0) {
                    $(this).html(text);
                } else {
                    const regex = new RegExp(`(${keyword})`, "gi");
                    $(this).html(text.replace(regex, "<span class='highlight'>$1</span>"));
                }
            });
        });
    }


    $(document).on("click", function (e) {
        if (!$(e.target).closest(".search-bar").length) {
            $suggestions.hide();
        }
    });
});
