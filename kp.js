(function () {
  const KEY = "lb_kp";
  const params = new URLSearchParams(location.search);
  if (params.get(KEY) === "1") sessionStorage.setItem(KEY, "1");
  if (sessionStorage.getItem(KEY) !== "1") return;

  const path = location.pathname;

  // Страница фильма/сериала -> меняем .ru на .film
  const m = path.match(/^\/(film|series)\/(\d+)/);
  if (m) {
    sessionStorage.removeItem(KEY);
    location.replace("https://www.kinopoisk.film/" + m[1] + "/" + m[2] + "/");
    return;
  }

  // Страница поиска -> переходим на первый результат
  const link =
    document.querySelector(
      '.search_results .most_wanted a[href^="/film/"], .search_results .most_wanted a[href^="/series/"]'
    ) ||
    document.querySelector(
      '.search_results a[href^="/film/"], .search_results a[href^="/series/"]'
    );
  if (link) {
    location.href = link.getAttribute("href");
  } else {
    sessionStorage.removeItem(KEY);
  }
})();
