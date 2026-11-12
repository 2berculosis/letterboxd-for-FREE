(function () {
  if (document.getElementById("lb-kp-btn")) return;

  const h1 = document.querySelector("h1.headline-1, .film-header-lockup h1");
  if (!h1) return;

  // Название и год (для запасного варианта — поиска)
  const nameEl = h1.querySelector(".name") || h1;
  const originalEl = document.querySelector(".originalname, .originaltitle");
  const title = (originalEl ? originalEl.textContent : nameEl.textContent)
    .trim()
    .replace(/\s+/g, " ");
  const yearEl = document.querySelector(".releasedate a");
  const year = yearEl ? yearEl.textContent.trim() : "";

  // ID фильма на IMDb и TMDB из ссылок внизу страницы
  const imdbLink = document.querySelector('a[href*="imdb.com/title/"]');
  const tmdbLink = document.querySelector('a[href*="themoviedb.org/"]');
  const imdb = imdbLink ? (imdbLink.href.match(/tt\d+/) || [])[0] : null;
  const tmdbMatch = tmdbLink
    ? tmdbLink.href.match(/themoviedb\.org\/(movie|tv)\/(\d+)/)
    : null;
  const tmdb = tmdbMatch ? { type: tmdbMatch[1], id: tmdbMatch[2] } : null;

  const searchUrl =
    "https://www.kinopoisk.ru/index.php?kp_query=" +
    encodeURIComponent((title + " " + year).trim()) +
    "&lb_kp=1";

  const a = document.createElement("a");
  a.id = "lb-kp-btn";
  a.className = "lb-kp-btn";
  a.href = searchUrl;
  a.textContent = "Watch for free";

  a.addEventListener("click", function (e) {
    e.preventDefault();
    a.textContent = "Ищу…";
    browser.runtime
      .sendMessage({ imdb: imdb, tmdb: tmdb, searchUrl: searchUrl })
      .then(function () {
        a.textContent = "Watch for free";
      })
      .catch(function () {
        a.textContent = "Watch for free";
        window.open(searchUrl, "_blank");
      });
  });

  const sidebar = document.querySelector(".sidebar");
  if (sidebar) sidebar.prepend(a);
  else h1.parentElement.appendChild(a);
})();
