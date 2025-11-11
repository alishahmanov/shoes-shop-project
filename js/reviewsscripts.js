(function () {
    document.addEventListener('click', function (e) {
        var a = e.target.closest('a[href^="#"]');
        if (!a) return;
        var t = document.querySelector(a.getAttribute('href'));
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });

    var grid = document.getElementById('reviewsGrid');
    var showMoreBtn = document.getElementById('showMoreReviews');

    function revealHidden(count) {
        var hidden = grid.querySelectorAll('.d-none');
        var n = Math.min(count, hidden.length);
        for (var i = 0; i < n; i++) hidden[i].classList.remove('d-none');
        if (grid.querySelectorAll('.d-none').length === 0) showMoreBtn.style.display = 'none';
    }

    showMoreBtn.addEventListener('click', function(){ revealHidden(3); });
    revealHidden(3);

    var form = document.getElementById('addReviewForm');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = document.getElementById('revName').value.trim();
        var rating = parseInt(document.getElementById('revRating').value, 10);
        var text = document.getElementById('revText').value.trim();
        if (!name || !text) return;

        var col = document.createElement('div');
        col.className = 'col-12 col-md-6 col-lg-4';
        col.setAttribute('data-rating', String(rating));
        var today = new Date();
        var meta = name + ' • ' + today.toLocaleDateString('ru-RU');

        col.innerHTML =
            '<div class="review-card">' +
            '<div class="review-head">' +
            '<img class="avatar" src="../Assets/avatr.png" alt="'+ name +'" />' +
            '<div>' +
            '<div class="stars" aria-label="'+ rating +' из 5">' + '★★★★★'.slice(0, rating) + '☆☆☆☆☆'.slice(0, 5 - rating) + '</div>' +
            '<div class="review-meta">' + meta + '</div>' +
            '</div>' +
            '</div>' +
            '<p class="review-text"></p>' +
            '</div>';

        col.querySelector('.review-text').textContent = text;
        grid.insertBefore(col, grid.firstElementChild);
        form.reset();
    });
})();
