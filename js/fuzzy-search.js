(function () {
  var input = document.getElementById('search-input');
  if (!input) return;
  var resultsList = document.getElementById('search-results');
  var postsData = null;
  var fuse = null;
  var activeIndex = -1;

  function loadPosts() {
    if (postsData) return Promise.resolve(postsData);
    return fetch('/index.json')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        postsData = data;
        fuse = new Fuse(data, {
          keys: [
            { name: 'title', weight: 2 },
            { name: 'description', weight: 1.5 },
            { name: 'tags', weight: 1 },
            { name: 'content', weight: 0.5 }
          ],
          threshold: 0.4,
          ignoreLocation: true,
          minMatchCharLength: 2
        });
        return postsData;
      });
  }

  function renderResults(results) {
    activeIndex = -1;
    if (!input.value.trim()) {
      resultsList.innerHTML = '';
      resultsList.style.display = 'none';
      return;
    }
    if (results.length === 0) {
      resultsList.innerHTML = '<li class="search__empty">Sin resultados</li>';
      resultsList.style.display = 'block';
      return;
    }
    var html = '';
    for (var i = 0; i < results.length && i < 15; i++) {
      var p = results[i].item;
      var tags = '';
      if (p.tags && p.tags.length) {
        tags = '<span class="search__tags">' + p.tags.map(function (t) { return '#' + t; }).join(' ') + '</span>';
      }
      html += '<li class="search__item" data-index="' + i + '">' +
        '<a href="' + p.url + '">' +
        '<span class="search__title">' + p.title + '</span>' +
        tags +
        '</a></li>';
    }
    resultsList.innerHTML = html;
    resultsList.style.display = 'block';
  }

  function navigate(direction) {
    var items = resultsList.querySelectorAll('.search__item');
    if (!items.length) return;
    items.forEach(function (el) { el.classList.remove('search__item--active'); });
    activeIndex += direction;
    if (activeIndex < 0) activeIndex = items.length - 1;
    if (activeIndex >= items.length) activeIndex = 0;
    items[activeIndex].classList.add('search__item--active');
    items[activeIndex].scrollIntoView({ block: 'nearest' });
  }

  function selectActive() {
    var items = resultsList.querySelectorAll('.search__item');
    if (activeIndex >= 0 && activeIndex < items.length) {
      var link = items[activeIndex].querySelector('a');
      if (link) link.click();
    }
  }

  input.addEventListener('focus', function () {
    loadPosts();
  });

  input.addEventListener('input', function () {
    if (!fuse) return;
    var query = input.value.trim();
    if (!query) {
      renderResults([]);
      return;
    }
    var results = fuse.search(query);
    renderResults(results);
  });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      navigate(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      navigate(-1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      selectActive();
    } else if (e.key === 'Escape') {
      input.value = '';
      renderResults([]);
      input.blur();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && document.activeElement !== input) {
      e.preventDefault();
      input.focus();
    }
  });
})();
