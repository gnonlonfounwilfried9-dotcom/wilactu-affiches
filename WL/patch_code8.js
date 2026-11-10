(function(){
const m = monaco.editor.getModels().find(x => x.uri.path.indexOf('.js') > 0);
let t = m.getValue();
const log = [];
function rep(name, find, to){ const c = t.split(find).length - 1; if (c < 1) { log.push('MISS ' + name); return; } t = t.split(find).join(to); log.push('ok ' + name); }

// 1) retire le radar avec recherche Google (quota non disponible sur la cle gratuite) et la fonction de test
const iR = t.indexOf('// Radar WILACTU (2026-11-10)');
if (iR > 0) {
  const i0 = t.lastIndexOf('// =====', iR);
  const j = t.indexOf('// Redaction chaleureuse des alertes');
  if (i0 > 0 && j > i0) { t = t.slice(0, i0) + '@@RADAR_MODULE@@\n\n' + t.slice(j); log.push('ok cut old radar'); } else log.push('MISS cut old radar');
}
const iG = t.indexOf('function testGround()');
if (iG > 0) { t = t.slice(0, iG); log.push('ok cut testGround'); }

const MOD = String.raw`// ===================================================================
// Radar WILACTU v2 (2026-11-10) : veille rapide sans attendre la presse.
// Sources : tendances de recherche Google (Benin, Cote d'Ivoire, Senegal, Togo, Nigeria, Ghana),
// liste de veille (operateurs, villes, plateformes crypto, sport, culture) via Google Actualites,
// annonces officielles des plateformes crypto (canaux Telegram publics). Recoupement par le moteur d'alertes.
// ===================================================================
const RAD_WATCH = [
  ['MTN Bénin', 'benin'], ['Moov Africa Bénin', 'benin'], ['Celtiis Bénin', 'benin'], ['Cotonou', 'benin'], ['Parakou OR Abomey-Calavi OR Porto-Novo', 'benin'],
  ['Bénin gouvernement conseil des ministres', 'benin'], ['Bénin électricité SBEE coupure', 'benin'], ['Bénin carburant prix', 'benin'], ['Bénin examen BAC BEPC résultats', 'benin'],
  ['Bénin Assemblée nationale loi', 'benin'], ['Bénin justice CRIET procès', 'benin'], ['Bénin mobile money', 'benin'], ['Écureuils du Bénin', 'sport'], ['Béninois footballeur club', 'sport'],
  ['Binance', 'crypto'], ['MEXC', 'crypto'], ['Bybit OR OKX OR Coinbase retraits suspendus', 'crypto'], ['bitcoin cours chute OR record', 'crypto'], ['crypto piratage OR hack', 'crypto'],
  ['Côte d\'Ivoire actualité', 'afrique'], ['Sénégal actualité', 'afrique'], ['Togo actualité', 'afrique'], ['Nigeria actualité', 'afrique'], ['Ghana actualité', 'afrique'], ['Coupe d\'Afrique des nations', 'sport'],
  ['Ligue des champions', 'sport'], ['Formule 1', 'autresport'], ['MotoGP', 'autresport'], ['boxe combat', 'autresport'], ['rugby', 'autresport'],
  ['Burna Boy OR Wizkid OR Davido OR Tiwa Savage OR Fally Ipupa', 'actu'], ['mode africaine Fashion Week', 'actu'], ['Ukraine Russie', 'monde'], ['Trump', 'monde'], ['Iran OR Israël OR Gaza', 'monde'],
  ['WhatsApp nouveauté', 'tech'], ['OpenAI OR Nvidia OR Google intelligence artificielle', 'tech'], ['OMS santé Afrique alerte', 'sante']
];
const RAD_TG = [
  { src: 'Binance (annonce officielle)', url: 'https://t.me/s/binance_announcements', cat: 'crypto', lang: 'en', tg: true, off: true },
  { src: 'Bybit (annonce officielle)', url: 'https://t.me/s/bybit_announcements', cat: 'crypto', lang: 'en', tg: true, off: true },
  { src: 'OKX (annonce officielle)', url: 'https://t.me/s/OKXAnnouncements', cat: 'crypto', lang: 'en', tg: true, off: true }
];
const RAD_TG_KEY = /(suspend|halt|withdraw|hack|exploit|incident|delist|emergency|security|resum|pause|outage|compromis|stolen)/i;
const RAD_NOISE = /(météo|weather|meteorolog|gta|zeturf|tradingview|forex|loto|horoscope|résultat|score|calendrier|streaming|replay|lotto|pmu|pronostic)/i;
let RAD_TERMS = [];

function radGn_(q, cat, tag) {
  return { src: 'Google Actualités ' + tag, url: 'https://news.google.com/rss/search?q=' + encodeURIComponent(q + ' when:1d') + '&hl=fr&gl=BJ&ceid=BJ:fr', cat: cat, lang: 'fr', gn: true, rad: true };
}
RAD_WATCH.forEach(function (w) { BRK_FEEDS.push(radGn_(w[0], w[1], 'veille')); });
RAD_TG.forEach(function (f) { BRK_FEEDS.push(f); });

// Tendances de recherche : ce que les gens cherchent en ce moment dans chaque pays.
function radTrends_() {
  const geos = { BJ: 'Bénin', CI: "Côte d'Ivoire", SN: 'Sénégal', TG: 'Togo', NG: 'Nigeria', GH: 'Ghana' };
  const codes = Object.keys(geos);
  const reqs = codes.map(function (g) { return { url: 'https://trends.google.com/trending/rss?geo=' + g, muteHttpExceptions: true, headers: { 'User-Agent': 'Mozilla/5.0' } }; });
  let rs = [];
  try { rs = UrlFetchApp.fetchAll(reqs); } catch (e) { return []; }
  const ns = XmlService.getNamespace('ht', 'https://trends.google.com/trending/rss');
  const out = [];
  rs.forEach(function (r, i) {
    try {
      if (r.getResponseCode() !== 200) return;
      const items = XmlService.parse(r.getContentText()).getRootElement().getChild('channel').getChildren('item');
      let k = 0;
      items.forEach(function (it) {
        if (k >= 5) return;
        const term = String(it.getChildText('title') || '').trim();
        const tr = parseInt(String(it.getChildText('approx_traffic', ns) || '0').replace(/[^0-9]/g, ''), 10) || 0;
        if (term.length < 4 || tr < 200 || RAD_NOISE.test(term) || out.some(function (x) { return x.term.toLowerCase() === term.toLowerCase(); })) return;
        out.push({ term: term, geo: geos[codes[i]], traffic: tr });
        k++;
      });
    } catch (e) {}
  });
  return out;
}

// A appeler avant chaque passage du moteur : ajoute les flux issus des tendances du moment.
function radarPrep_() {
  for (let i = BRK_FEEDS.length - 1; i >= 0; i--) if (BRK_FEEDS[i].dyn) BRK_FEEDS.splice(i, 1);
  const ts = radTrends_();
  RAD_TERMS = ts.map(function (x) { return x.term.toLowerCase(); });
  ts.slice(0, 24).forEach(function (x) { const f = radGn_(x.term, 'actu', 'tendance ' + x.geo); f.dyn = true; BRK_FEEDS.push(f); });
  return ts;
}

function radBoost_(text) {
  const lt = String(text || '').toLowerCase();
  return RAD_TERMS.some(function (t) { return t.length >= 5 && lt.indexOf(t) >= 0; }) ? 1.6 : 1;
}
function radScore_(c, n, age, text) {
  let sc = n * (1 + 1 / (1 + age));
  if (c.items.some(function (x) { return x.off; })) sc = Math.max(sc, 14);
  return sc * radBoost_(text);
}

// Lecture des canaux Telegram publics d'annonces officielles.
function radTgItems_(f, res) {
  if (res.getResponseCode() !== 200) return [];
  const h = res.getContentText(), out = [];
  h.split('tgme_widget_message_wrap').slice(1).forEach(function (p) {
    const tm = /js-message_text[^>]*>([\s\S]*?)<\/div>/.exec(p), dt = /<time[^>]*datetime="([^"]+)"/.exec(p), lk = /tgme_widget_message_date" href="([^"]+)"/.exec(p);
    if (!tm || !dt) return;
    const first = tm[1].split(/<br\s*\/?>/i)[0];
    const full = strip_(tm[1].replace(/<br\s*\/?>/gi, ' '));
    const title = strip_(first).slice(0, 160);
    const d = new Date(dt[1]);
    if (isNaN(d.getTime()) || title.length < 12) return;
    if (!RAD_TG_KEY.test(title + ' ' + full.slice(0, 300))) return;
    out.push({ src: f.src, lang: f.lang, cat: f.cat, title: title, link: lk ? lk[1] : f.url, desc: cut_(full, 450), date: d, off: true });
  });
  return out;
}
const radFeedItemsOrig_ = feedItems_;
feedItems_ = function (f, pre) {
  if (f && f.tg) return radTgItems_(f, pre || UrlFetchApp.fetch(f.url, { muteHttpExceptions: true, headers: { 'User-Agent': 'Mozilla/5.0' } }));
  return radFeedItemsOrig_(f, pre);
};

function testRadar() {
  try {
    const ts = radarPrep_();
    props_().setProperty('RAD_LAST_TERMS', ts.map(function (x) { return x.term + ' (' + x.geo + ' ' + x.traffic + '+)'; }).join(', ').slice(0, 1500));
    runBreaking_(true);
  } catch (e) { alert_('Test radar : erreur', String(e.message) + '\n' + String(e.stack)); }
}
function setupRadar() {
  props_().setProperty('BRK_MAX', '12');
  ScriptApp.getProjectTriggers().forEach(function (tr) { if (tr.getHandlerFunction() === 'breaking_') ScriptApp.deleteTrigger(tr); });
  ScriptApp.newTrigger('breaking_').timeBased().everyMinutes(30).create();
}
`;
t = t.replace('@@RADAR_MODULE@@', function () { return MOD; });
log.push('ok module');

rep('breaking call', "try { radarRun_(false); }", "try { radarPrep_(); }");
rep('threshold', "if (n < (ben ? 2 : 3)) return;", "if (n < (c.items.some(function (x) { return x.off; }) ? 1 : ((ben || radBoost_(text) > 1) ? 2 : 3))) return;");
rep('score', "let score = n * (1 + 1 / (1 + age));", "let score = radScore_(c, n, age, text);");

m.pushEditOperations([], [{range: m.getFullModelRange(), text: t}], function(){return null;});
return log.join(' | ') + ' || len ' + t.length;
})()
