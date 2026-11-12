// Ищем ID Кинопоиска в Wikidata (свойство P2603) по ID IMDb или TMDB.
async function findKinopoiskId(imdb, tmdb) {
  const parts = [];
  if (imdb) parts.push('{ ?i wdt:P345 "' + imdb + '" }');
  if (tmdb) {
    const prop = tmdb.type === "tv" ? "P4983" : "P4947";
    parts.push('{ ?i wdt:P' + prop.slice(1) + ' "' + tmdb.id + '" }');
  }
  if (!parts.length) return null;

  const query =
    "SELECT ?kp WHERE { " + parts.join(" UNION ") + " ?i wdt:P2603 ?kp } LIMIT 1";
  const url =
    "https://query.wikidata.org/sparql?format=json&query=" +
    encodeURIComponent(query);

  const resp = await fetch(url, { headers: { Accept: "application/sparql-results+json" } });
  if (!resp.ok) return null;
  const data = await resp.json();
  const b = data.results.bindings[0];
  return b ? b.kp.value : null;
}

browser.runtime.onMessage.addListener(async function (msg) {
  let target = msg.searchUrl;
  try {
    const id = await findKinopoiskId(msg.imdb, msg.tmdb);
    if (id) target = "https://www.kinopoisk.film/film/" + id + "/";
  } catch (e) {
    // при ошибке откроем поиск
  }
  await browser.tabs.create({ url: target });
  return true;
});
