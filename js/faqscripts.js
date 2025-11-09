document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
});

(function () {
    var search = document.getElementById('faqSearch');
    var items = Array.prototype.slice.call(document.querySelectorAll('.faq'));
    var radios = Array.prototype.slice.call(document.querySelectorAll('input[name="faq-cat"]'));
    if (!items.length) return;

    function selectedCat() {
        var r = document.querySelector('input[name="faq-cat"]:checked');
        return r ? r.value : 'all';
    }

    function applyFilters() {
        var q = search ? search.value.trim().toLowerCase() : '';
        var cat = selectedCat();
        items.forEach(function (it) {
            var okCat = (cat === 'all' || it.dataset.cat === cat);
            var okText = q === '' ? true : it.textContent.toLowerCase().indexOf(q) !== -1;
            it.style.display = (okCat && okText) ? '' : 'none';
        });
    }

    if (search) search.addEventListener('input', applyFilters);
    radios.forEach(function (r) { r.addEventListener('change', applyFilters); });
    applyFilters();
})();
