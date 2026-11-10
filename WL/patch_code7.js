(function(){
const m = monaco.editor.getModels().find(x => x.uri.path.indexOf('.js') > 0);
let t = m.getValue();
const log = [];
function rep(name, find, to){ const c = t.split(find).length - 1; if (c < 1) { log.push('MISS ' + name); return; } t = t.split(find).join(to); log.push('ok ' + name); }

rep('breaking', "function breaking_() { runBreaking_(false); }", "function breaking_() {\n  try { radarRun_(false); } catch (e) { try { props_().setProperty('RADAR_LAST_ERROR', String(e.message).slice(0, 300)); } catch (e2) {} }\n  runBreaking_(false);\n}");

if (t.indexOf('function radarRun_') < 0) {
t = t + String.raw`

// ===================================================================
// Radar WILACTU (2026-11-10) : veille rapide hors presse (recherche Google en direct, tendances,
// publications relayees sur les reseaux), recoupee par au moins deux sources, puis redaction chaleureuse.
// ===================================================================
const RAD_REST = ['afrique', 'sport', 'monde', 'autresport', 'politique', 'tech', 'culture', 'sante', 'finance'];
const RAD_TOPICS = {
  benin: "le Bénin : ce dont parlent les Béninois en ce moment sur Facebook, WhatsApp, TikTok et dans la presse locale (offres et bonus des opérateurs MTN, Moov Africa et Celtiis, prix et carburant, électricité et eau, transport et circulation, école et examens, justice, santé, sport, musique et célébrités, annonces du gouvernement)",
  afrique: "l'Afrique de l'Ouest et l'Afrique en général (Côte d'Ivoire, Sénégal, Togo, Nigeria, Ghana, Niger, Mali, Burkina Faso, Cameroun, Congo) : politique, économie, sport, société, culture et événements marquants, y compris les Jeux Olympiques de la Jeunesse à Dakar",
  crypto: "les cryptomonnaies et les plateformes (Binance, MEXC, Bybit, OKX, Coinbase, Kraken) : retraits ou dépôts suspendus, maintenance, piratage, nouveaux listings, retrait de pays, régulation, mouvements de prix très forts, projets en vue en Afrique",
  sport: "le football : Béninois et Africains dans les clubs européens, sélections africaines, transferts, Ligue des champions, grands championnats, résultats et événements qui font réagir, blessures et polémiques",
  autresport: "le sport hors football : Formule 1, MotoGP, boxe, rugby, basket, athlétisme, tennis, Jeux Olympiques de la Jeunesse de Dakar",
  monde: "le monde : guerres et diplomatie, grandes catastrophes, élections, décisions des puissances (États-Unis, France, Russie, Ukraine, Chine, Corée), événements majeurs du jour",
  politique: "la politique au Bénin, en Afrique de l'Ouest et dans le monde : élections, déclarations, lois, nominations, crises",
  tech: "le numérique et la technologie : intelligence artificielle, réseaux sociaux, WhatsApp, smartphones, mobile money, internet et réseaux télécoms en Afrique",
  culture: "la mode, la musique, le cinéma, les célébrités et les tendances virales, surtout africaines et afro-descendantes",
  sante: "la santé : alertes sanitaires, épidémies, médicaments, découvertes utiles, conseils pour le public en Afrique",
  finance: "l'économie et la finance : prix, monnaies, FCFA, banques, mobile money, entreprises, grands accords, matières premières"
};
const RAD_CATS = ['benin', 'afrique', 'monde', 'politique', 'finance', 'crypto', 'tech', 'sport', 'autresport', 'sante', 'actu'];
const RAD_NAMES = { 'lanation.bj': 'La Nation', 'banouto.bj': 'Banouto', '24haubenin.info': '24 Heures au Bénin', 'matinlibre.com': 'Matin Libre', 'lanouvelletribune.info': 'La Nouvelle Tribune', 'beninwebtv.com': 'Benin Web TV', 'binance.com': 'Binance', 'mexc.com': 'MEXC', 'facebook.com': 'Facebook', 'x.com': 'X', 'twitter.com': 'X', 'rfi.fr': 'RFI', 'france24.com': 'France 24', 'lemonde.fr': 'Le Monde', 'bbc.com': 'BBC', 'aljazeera.com': 'Al Jazeera', 'lequipe.fr': "L'Équipe", 'rmcsport.bfmtv.com': 'RMC Sport', 'coindesk.com': 'CoinDesk', 'cointelegraph.com': 'Cointelegraph', 'jeuneafrique.com': 'Jeune Afrique', 'tiktok.com': 'TikTok', 'youtube.com': 'YouTube', 'instagram.com': 'Instagram', 'reuters.com': 'Reuters', 'afp.com': 'AFP', 'africanews.com': 'Africanews', 'eurosport.fr': 'Eurosport', 'footmercato.net': 'Foot Mercato' };
const RAD_OFFICIAL = /(binance|mexc|bybit|okx|coinbase|kraken)\.(com|io)|\.gouv\.|gouv\.bj|mtn\.bj|moov-africa\.bj|celtiis\.bj|fifa\.com|cafonline\.com|uefa\.com|fia\.com|olympics\.com|who\.int/i;

function radName_(d) {
  d = String(d || '').toLowerCase().replace(/^www\./, '');
  if (RAD_NAMES[d]) return RAD_NAMES[d];
  const k = Object.keys(RAD_NAMES).filter(function (x) { return d.slice(-x.length) === x; })[0];
  return k ? RAD_NAMES[k] : d;
}

function radTrends_() {
  const geos = { BJ: 'Bénin', CI: "Côte d'Ivoire", SN: 'Sénégal', TG: 'Togo', NG: 'Nigeria', GH: 'Ghana', FR: 'France' };
  const codes = Object.keys(geos);
  const reqs = codes.map(function (g) { return { url: 'https://trends.google.com/trending/rss?geo=' + g, muteHttpExceptions: true, headers: { 'User-Agent': 'Mozilla/5.0' } }; });
  let rs = [];
  try { rs = UrlFetchApp.fetchAll(reqs); } catch (e) { return ''; }
  const ns = XmlService.getNamespace('ht', 'https://trends.google.com/trending/rss');
  const out = [];
  rs.forEach(function (r, i) {
    try {
      if (r.getResponseCode() !== 200) return;
      const items = XmlService.parse(r.getContentText()).getRootElement().getChild('channel').getChildren('item');
      const lst = items.slice(0, 8).map(function (it) { return it.getChildText('title') + ' (' + (it.getChildText('approx_traffic', ns) || '') + ')'; });
      if (lst.length) out.push(geos[codes[i]] + ' : ' + lst.join(', '));
    } catch (e) {}
  });
  return out.join(' | ');
}

function radPrompt_(topic, trends) {
  const now = new Date();
  const when = Utilities.formatDate(now, TZ, 'yyyy-MM-dd') + ' à ' + Utilities.formatDate(now, TZ, 'HH:mm') + ' (heure de Cotonou)';
  return "Nous sommes le " + when + ". Tu es le veilleur de la page d'actualité WILACTU. Avec la recherche Google, repère les informations les plus chaudes des 12 dernières heures sur : " + RAD_TOPICS[topic] + ". "
    + "Regarde aussi ce qui circule sur Facebook, X, TikTok, YouTube et sur les pages officielles, pas seulement dans la presse : une information qui revient dans plusieurs publications mérite d'être retenue, même si les journaux ne l'ont pas encore reprise. "
    + (trends ? "Recherches Google en vogue en ce moment, pour t'aider à repérer ce que les gens cherchent : " + trends + ". " : "")
    + "Retiens au maximum 3 informations, uniquement si elles sont confirmées par au moins deux sources différentes ou par un communiqué officiel. Écarte les rumeurs isolées, les arnaques, les publicités, les vidéos truquées, les polémiques sans fait et tout ce qui date de plus de 24 heures. "
    + "Pour chaque information, écris un bloc, et sépare les blocs par une ligne contenant seulement ###. Format exact d'un bloc, une ligne par champ : "
    + "TITRE: titre factuel de 90 caractères maximum. "
    + "CAT: une valeur parmi " + RAD_CATS.join(', ') + " (sport veut dire football). "
    + "URGENCE: un nombre de 1 à 5 (5 = événement majeur que tout le monde doit savoir maintenant, 3 = intéressant aujourd'hui, 1 = secondaire). "
    + "FAITS: 4 à 6 faits précis avec noms, chiffres, lieux et heures, séparés par ' ; '. "
    + "POURQUOI: une phrase sur ce qui fait réagir les gens. "
    + "Écris en français avec tous les accents. Si rien ne mérite d'être publié, réponds exactement RIEN.";
}

function radAsk_(topics, trends) {
  const key = props_().getProperty('GEMINI_API_KEY');
  if (!key) return [];
  const reqs = topics.map(function (tp) {
    return { url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent', method: 'post', contentType: 'application/json', muteHttpExceptions: true, headers: { 'x-goog-api-key': key },
      payload: JSON.stringify({ contents: [{ parts: [{ text: radPrompt_(tp, trends) }] }], tools: [{ google_search: {} }], generationConfig: { temperature: 0.2, maxOutputTokens: 2200 } }) };
  });
  let rs = [];
  try { rs = UrlFetchApp.fetchAll(reqs); } catch (e) { return []; }
  return rs.map(function (r, i) {
    const o = { topic: topics[i], code: 0, text: '', chunks: [], supports: [] };
    try {
      o.code = r.getResponseCode();
      const j = JSON.parse(r.getContentText());
      const c = j.candidates && j.candidates[0];
      if (!c) { o.err = String(r.getContentText()).slice(0, 200); return o; }
      o.text = (c.content.parts || []).map(function (x) { return x.text || ''; }).join('');
      const gm = c.groundingMetadata || {};
      o.chunks = gm.groundingChunks || [];
      o.supports = gm.groundingSupports || [];
    } catch (e) { o.err = String(e.message).slice(0, 200); }
    return o;
  });
}

// Decoupe la reponse en informations, avec les sites qui appuient chacune (indices en octets UTF-8).
function radBlocks_(o) {
  const text = o.text || '';
  if (!text || /^\s*RIEN\s*\.?\s*$/i.test(text)) return [];
  const bo = [];
  let b = 0;
  for (let i = 0; i < text.length; i++) {
    bo[i] = b;
    const c = text.charCodeAt(i);
    if (c < 0x80) b += 1; else if (c < 0x800) b += 2; else if (c >= 0xD800 && c <= 0xDBFF) { b += 4; bo[i + 1] = b; i++; } else b += 3;
  }
  bo[text.length] = b;
  const cuts = [];
  const re = /(^|\n)[ \t]*###[ \t]*(?=\n|$)/g;
  let mm, last = 0;
  while ((mm = re.exec(text)) !== null) { cuts.push([last, mm.index]); last = mm.index + mm[0].length; }
  cuts.push([last, text.length]);
  const res = [];
  cuts.forEach(function (cut) {
    const blk = text.slice(cut[0], cut[1]);
    const g = function (k) { const x = new RegExp('^\\W*' + k + '\\s*:\\s*(.+)$', 'im').exec(blk); return x ? x[1].trim() : ''; };
    const title = g('TITRE'), faits = g('FAITS');
    if (!title || !faits) return;
    const s0 = bo[Math.min(cut[0], text.length)], e0 = bo[Math.min(cut[1], text.length)];
    const doms = [];
    o.supports.forEach(function (sp) {
      const sg = sp.segment || {};
      const a = sg.startIndex || 0, z = sg.endIndex || 0;
      if (z > s0 && a < e0) (sp.groundingChunkIndices || []).forEach(function (ix) {
        const ch = o.chunks[ix];
        const d = ch && ch.web && ch.web.title ? String(ch.web.title).toLowerCase().replace(/^www\./, '') : '';
        if (d && doms.indexOf(d) < 0) doms.push(d);
      });
    });
    let cat = g('CAT').toLowerCase().replace(/[^a-z]/g, '');
    if (RAD_CATS.indexOf(cat) < 0) cat = RAD_CATS.indexOf(o.topic) >= 0 ? o.topic : 'actu';
    const urg = Math.max(1, Math.min(5, parseInt(g('URGENCE'), 10) || 3));
    res.push({ title: noDash_(title.replace(/^"|"$/g, '')), cat: cat, urg: urg, facts: noDash_(faits), why: noDash_(g('POURQUOI')), doms: doms, topic: o.topic });
  });
  return res;
}

function radCollect_(topics) {
  const trends = radTrends_();
  const asks = radAsk_(topics, trends);
  const all = [], dbg = [];
  asks.forEach(function (o) {
    const bl = radBlocks_(o);
    dbg.push(o.topic + ' : HTTP ' + o.code + ', ' + o.chunks.length + ' sources web, ' + bl.length + ' infos' + (o.err ? ', erreur ' + o.err : ''));
    bl.forEach(function (x) { all.push(x); });
  });
  return { items: all, dbg: dbg, trends: trends };
}

function radPick_(items, seen, lastCats) {
  const ok = [];
  items.forEach(function (x) {
    const official = x.doms.some(function (d) { return RAD_OFFICIAL.test(d); });
    x.nDom = x.doms.length;
    x.official = official;
    x.reject = '';
    if (x.nDom < 2 && !(official && x.nDom >= 1)) x.reject = 'moins de deux sources';
    else if (x.urg < 3) x.reject = 'urgence faible';
    else if (seen.some(function (s) { return jjSame_(s.k, x.title); })) x.reject = 'déjà publié';
    if (!x.reject) {
      let sc = x.urg * 10 + Math.min(x.nDom, 6);
      if (x.cat === 'benin') sc += 8; else if (x.cat === 'afrique') sc += 4;
      sc *= Math.pow(0.8, lastCats.filter(function (c) { return c === x.cat; }).length);
      x.score = sc;
      ok.push(x);
    }
  });
  ok.sort(function (a, b) { return b.score - a.score; });
  // supprime les doublons entre sujets proches
  const out = [];
  ok.forEach(function (x) { if (!out.some(function (y) { return jjSame_(y.title, x.title); })) out.push(x); });
  return out;
}

function radTopics_() {
  const hh = Number(Utilities.formatDate(new Date(), TZ, 'H')) + Number(Utilities.formatDate(new Date(), TZ, 'd')) * 3;
  const r = [];
  for (let i = 0; i < 2; i++) r.push(RAD_REST[(hh * 2 + i) % RAD_REST.length]);
  return ['benin', 'crypto'].concat(r).filter(function (x, i, a) { return a.indexOf(x) === i; });
}

function radItemToStory_(x) {
  const names = x.doms.map(radName_).filter(function (n, i, a) { return a.indexOf(n) === i; });
  const main = { title: x.title, desc: x.facts + (x.why ? ' Pourquoi ça fait réagir : ' + x.why : ''), src: names[0] || 'Veille WILACTU' };
  const group = names.slice(1).map(function (n) { return { title: x.title, desc: '', src: n }; });
  return { main: main, group: group, names: names, urgent: x.urg >= 5, cat: x.cat };
}

function radarRun_(dry) {
  const p = props_();
  if (p.getProperty('BRK_ENABLED') === 'false') return;
  const now = new Date();
  const hh = Number(Utilities.formatDate(now, TZ, 'H'));
  if (!dry && (hh < 6 || hh >= 23)) return;
  const log = JSON.parse(p.getProperty('BRK_LOG') || '[]').filter(function (x) { return now - x < 24 * 3600000; });
  const seen = JSON.parse(p.getProperty('BRK_SEEN2') || '[]').filter(function (x) { return now - x.t < 36 * 3600000; });
  const lastCats = JSON.parse(p.getProperty('BRK_CATS') || '[]');
  const max = Number(p.getProperty('BRK_MAX') || 8), gap = Number(p.getProperty('BRK_GAP') || 25);
  const col = radCollect_(dry ? ['benin', 'crypto', 'afrique', 'sport'] : radTopics_());
  const picks = radPick_(col.items, seen, lastCats);
  let rep = 'Veille : ' + col.dbg.join(' || ') + '\n\nTendances Google : ' + col.trends + '\n\nInformations repérées : ' + col.items.length + '\n';
  col.items.forEach(function (x) { rep += '- [' + x.cat + ', urgence ' + x.urg + ', ' + x.nDom + ' sources : ' + x.doms.join(', ') + '] ' + x.title + (x.reject ? '  => ECARTÉE (' + x.reject + ')' : '  => OK') + '\n'; });
  if (!picks.length) { if (dry) alert_('Test radar', rep + '\nAucune information retenue.'); return; }
  const s = radItemToStory_(picks[0]);
  const text = brkText_(s.cat, s.main, s.group, s.urgent);
  const poster = brkPoster_(s.cat, s.urgent, s.main.title, s.names, s.main.desc, s.main, s.group);
  if (dry) { alert_('Test radar', rep + '\n\nPOST PRÉPARÉ :\n\n' + text + '\n\nAffiche : ' + poster); return; }
  if (log.length >= max) return;
  if (log.length && !s.urgent && now - log[log.length - 1] < gap * 60000) return;
  const sh = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  const tt = new Date(now.getTime() + Number(p.getProperty('BRK_DELAY') || 10) * 60000);
  const id = 'BRK-' + Utilities.formatDate(now, TZ, 'yyyyMMdd-HHmm') + 'r';
  const links = s.names.join(', ');
  const row = [id, Utilities.formatDate(tt, TZ, 'yyyy-MM-dd'), Utilities.formatDate(tt, TZ, 'HH:mm'), 'Facebook', 'Alerte actu', s.main.title, '', text, '', poster, links, 'Alerte', 'À valider', 'Mail envoyé le ' + stamp_(now) + ' (veille rapide)'];
  const rg = sh.getRange(sh.getLastRow() + 1, 1, 1, row.length);
  rg.setNumberFormat('@');
  rg.setValues([row]);
  sendApproval_(row, tt);
  log.push(now.getTime());
  seen.push({ t: now.getTime(), k: s.main.title });
  lastCats.push(s.cat);
  p.setProperty('BRK_LOG', JSON.stringify(log));
  p.setProperty('BRK_SEEN2', JSON.stringify(seen));
  p.setProperty('BRK_CATS', JSON.stringify(lastCats.slice(-6)));
}

function testRadar() { radarRun_(true); }
function setupRadar() { props_().setProperty('BRK_MAX', '12'); }

// Redaction chaleureuse des alertes (remplace la version precedente, la derniere definition l'emporte).
function brkText_(cat, main, group, urgent) {
  const names = [main.src];
  group.forEach(function (g) { if (names.indexOf(g.src) < 0) names.push(g.src); });
  const srcs = srcList_(names);
  const label = urgent ? 'URGENT ' + BRK_LABELS[cat].replace('ALERTE ', '') : BRK_LABELS[cat];
  const title = noDash_(main.title);
  const chapo = chapoOf_(main);
  const ext = [main].concat(group).filter(function (x, i, a) { return a.findIndex(function (y) { return y.src === x.src; }) === i; }).slice(0, 5)
    .map(function (x) { return x.title + '. ' + String(x.desc || '').slice(0, 600); }).join(' | ');
  const prompt = "Tu écris pour la page Facebook WILACTU, une page d'actualité qui parle comme un ami bien informé : chaleureuse, directe, proche des gens du Bénin et d'Afrique de l'Ouest, jamais institutionnelle. Français simple du quotidien, tutoiement. "
    + "Écris le post sur l'information ci dessous en 4 blocs séparés chacun par une ligne contenant seulement trois tirets (---). "
    + "Bloc 1 : une accroche d'une phrase (16 mots maximum) dans les mots de tous les jours, avec le fait le plus fort ou ce qui touche directement le lecteur, jamais un titre de journal. "
    + "Bloc 2 : ce qui s'est passé en 3 à 5 phrases courtes, en commençant par le fait : qui, quoi, combien, où, quand, avec tous les noms, chiffres et lieux des extraits. "
    + "Bloc 3 : commence par « Concrètement, » puis explique ce que cela change pour le lecteur au Bénin ou en Afrique de l'Ouest, avec un conseil utile ou une précaution quand c'est pertinent (2 phrases). Si les extraits ne permettent pas de répondre, dis simplement ce qu'on ignore encore ou ce qu'on attend (confirmation officielle, détails). "
    + "Bloc 4 : une question courte et personnelle qui invite à raconter son expérience ou donner son avis, par exemple « Tu l'as reçu toi aussi ? » ou « Ça te rassure ou ça t'inquiète ? », jamais une question générale du genre « Penses-tu que... ». "
    + "Interdits : le ton de communiqué ou d'éditorial (marque un tournant, souligne, interroge, redéfinit, enjeux, paysage, bouscule, illustre, relance le débat, force est de constater, il convient de), les superlatifs vides, les généralités. Chaque phrase doit apporter une information ou une aide concrète. "
    + "Règles : français correct avec TOUS les accents (é, è, ê, à, ù, ç, ô), aucun emoji, aucun tiret long, conserve toutes les apostrophes (l'Ordre, d'Olechky) et les traits d'union des verbes (crois-tu, as-tu), écris les nombres et les années en chiffres, n'invente aucun fait absent des extraits, ne cite pas les sources, 90 à 140 mots au total, ne laisse jamais une phrase inachevée. Information : " + ext;
  const g = gemini_(prompt);
  const body = gemBlocks_(g);
  if (body && gjOk_(body)) return label + '\n\n' + body + '\n\nSources : ' + srcs + '.\n\n#WILACTU ' + BRK_TAGS[cat];
  const extra = group.filter(function (x) { return x.desc && x.src !== main.src; }).slice(0, 2).map(function (x) { return 'Selon ' + x.src + ' : ' + cut_(noDash_(String(x.desc)), 220); });
  return label + '\n\n' + title + '\n\n' + (chapo && chapo !== title ? chapo + '\n\n' : '') + (extra.length ? extra.join('\n\n') + '\n\n' : '') + 'Sources : ' + srcs + '.\n\n' + brkAsk_(cat) + '\n\n#WILACTU ' + BRK_TAGS[cat];
}
`;
log.push('ok radar module');
} else { log.push('radar deja present'); }

let syntax = 'ok';
try { new Function(t); } catch (e) { syntax = 'SYNTAX ' + e.message; }
if (syntax === 'ok') { m.pushEditOperations([], [{range: m.getFullModelRange(), text: t}], function(){return null;}); }
return log.join(' | ') + ' || ' + syntax + ' || len ' + t.length;
})()
