(function(){
const m = monaco.editor.getModels()[0];
let t = m.getValue();
const log = [];
function rep(name, find, to){ const c = t.split(find).length - 1; if (c < 1) { log.push('MISS ' + name); return; } t = t.split(find).join(to); log.push('ok ' + name); }
function repRe(name, re, fn){ if (!re.test(t)) { log.push('MISS ' + name); return; } t = t.replace(re, fn); log.push('ok ' + name); }

// ---- nouveaux flux : fils Google Actualites (sujets les plus couverts) et sports
repRe('feeds2', /(\{ src: 'Google Actualités Cotonou'[^\n]*\})\n\];/, function(a, b){ return b + `,
  { src: 'Google Actualités', url: 'https://news.google.com/rss?hl=fr&gl=FR&ceid=FR:fr', cat: 'actu', lang: 'fr', gn: true },
  { src: 'Google Actualités', url: 'https://news.google.com/rss/headlines/section/topic/WORLD?hl=fr&gl=FR&ceid=FR:fr', cat: 'monde', lang: 'fr', gn: true },
  { src: 'Google Actualités', url: 'https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=fr&gl=FR&ceid=FR:fr', cat: 'finance', lang: 'fr', gn: true },
  { src: 'Google Actualités', url: 'https://news.google.com/rss/headlines/section/topic/SPORTS?hl=fr&gl=FR&ceid=FR:fr', cat: 'sport', lang: 'fr', gn: true },
  { src: 'Google Actualités', url: 'https://news.google.com/rss/headlines/section/topic/HEALTH?hl=fr&gl=FR&ceid=FR:fr', cat: 'sante', lang: 'fr', gn: true },
  { src: 'Google Actualités', url: 'https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=fr&gl=FR&ceid=FR:fr', cat: 'tech', lang: 'fr', gn: true },
  { src: 'Google Actualités', url: 'https://news.google.com/rss?hl=fr&gl=BJ&ceid=BJ:fr', cat: 'benin', lang: 'fr', gn: true },
  { src: 'Google Actualités', url: 'https://news.google.com/rss/headlines/section/topic/SPORTS?hl=fr&gl=BJ&ceid=BJ:fr', cat: 'sport', lang: 'fr', gn: true },
  { src: 'Google Actualités', url: 'https://news.google.com/rss/headlines/section/topic/WORLD?hl=fr&gl=BJ&ceid=BJ:fr', cat: 'monde', lang: 'fr', gn: true },
  { src: 'Google Actualités', url: 'https://news.google.com/rss/search?q=Formule+1+when:1d&hl=fr&gl=FR&ceid=FR:fr', cat: 'autresport', lang: 'fr', gn: true },
  { src: 'Google Actualités', url: 'https://news.google.com/rss/search?q=MotoGP+when:1d&hl=fr&gl=FR&ceid=FR:fr', cat: 'autresport', lang: 'fr', gn: true },
  { src: 'Google Actualités', url: 'https://news.google.com/rss/search?q=boxe+when:2d&hl=fr&gl=FR&ceid=FR:fr', cat: 'autresport', lang: 'fr', gn: true },
  { src: 'Google Actualités', url: 'https://news.google.com/rss/search?q=rugby+when:1d&hl=fr&gl=FR&ceid=FR:fr', cat: 'autresport', lang: 'fr', gn: true },
  { src: 'Google Actualités', url: 'https://news.google.com/rss/search?q=Liga+when:1d&hl=fr&gl=FR&ceid=FR:fr', cat: 'sport', lang: 'fr', gn: true },
  { src: 'Google Actualités', url: 'https://news.google.com/rss/search?q=pr%C3%A9sidentielle+candidat+when:1d&hl=fr&gl=FR&ceid=FR:fr', cat: 'politique', lang: 'fr', gn: true },
  { src: 'Google Actualités', url: 'https://news.google.com/rss/search?q=footballeur+b%C3%A9ninois+when:3d&hl=fr&gl=BJ&ceid=BJ:fr', cat: 'benin', lang: 'fr', gn: true }
];`; });

// ---- correction du francais et de la mise en page
repRe('noDashBlock', /function noDashBlock_\(s\) \{[\s\S]*?\n\}\n/, function(){ return String.raw`function noDashBlock_(s) {
  const raw = frClean_(String(s));
  return raw.split('\n').map(function (l) { return noDash_(l); }).join('\n').replace(/\n{3,}/g, '\n\n').trim();
}
`; });
repRe('catOf2', /function catOf_\(ent, fallback\) \{[\s\S]*?\n\}\n/, function(){ return `function catOf_(ent, fallback) { return fallback; }
`; });

t = t + String.raw`

// ===================================================================
// Version 2 des alertes (9 nov 2026) : sujets les plus couverts, texte structure, urgence stricte
// ===================================================================
function frClean_(s) {
  let t = String(s).replace(/[‘’ʼ]/g, "'");
  t = t.replace(/aujourd hui/gi, "aujourd'hui");
  t = t.replace(/(^|[\s(«"])([ldnscjLDNSCJ]|[Qq]u|[Jj]usqu|[Ll]orsqu|[Pp]uisqu|[Qq]uelqu) (?=[A-Za-zÀ-ÿ])/g, function (mm, a, b) { return a + b + "'"; });
  t = t.replace(/\b([Qq]u'est|[Qq]u est) ce\b/g, "qu'est-ce");
  t = t.replace(/\b(crois|penses|pensez|veux|voulez|peux|pouvez|vas|allez|as|avez|es|êtes|connais|connaissez|savais|imagines|imaginez|vois|voyez|dis|dites|fais|faites|trouves|trouvez|aimerais|aimeriez|préfères|préférez|souhaites|souhaitez|attends|attendez|iras|irez|serais|seriez|seras|serez|ferais|feriez|vivrais|choisirais|choisirait|choisis|choisissez) (tu|vous|il|elle|on)\b/gi, function (mm, a, b) { return a + '-' + b; });
  t = t.replace(/\b(est|peut|doit|devrait|faut|va|fait|dit|sera|serait|pourra|pourrait) (il|elle|on)\b/gi, function (mm, a, b) { return a + '-' + b; });
  t = t.replace(/\b(a|ont) (il|elle|on|ils|elles)\b/gi, function (mm, a, b) { return a + '-t-' + b; });
  return t;
}

// Garantit des paragraphes aeres : si le texte est d'un seul bloc, on le decoupe par phrases.
function fmtPost_(s) {
  let t = String(s).trim().replace(/\n{3,}/g, '\n\n');
  if (t.indexOf('\n\n') >= 0) return t;
  const parts = t.replace(/\n/g, ' ').split(/(?<=[.!?])\s+/).filter(Boolean);
  if (parts.length < 3) return t;
  const out = [parts[0]];
  let cur = [];
  for (let i = 1; i < parts.length - 1; i++) {
    cur.push(parts[i]);
    if (cur.length === 2) { out.push(cur.join(' ')); cur = []; }
  }
  if (cur.length) out.push(cur.join(' '));
  out.push(parts[parts.length - 1]);
  return out.join('\n\n');
}

// Assemble la reponse de Gemini en blocs separes par une ligne vide.
function gemBlocks_(g) {
  if (!g) return '';
  const parts = String(g).split(/\n\s*-{3,}\s*\n/).map(function (x) { return x.trim(); }).filter(Boolean);
  const body = parts.length >= 3 ? parts.join('\n\n') : fmtPost_(g);
  return noDashBlock_(body);
}

const BRK_STOP = ['dans', 'avec', 'pour', 'sans', 'sous', 'vers', 'chez', 'plus', 'tout', 'tous', 'cette', 'leur', 'leurs', 'entre', 'apres', 'avant', 'comme', 'mais', 'ainsi', 'sont', 'elle', 'elles', 'nous', 'vous', 'etre', 'avoir', 'fait', 'faire', 'dont', 'alors', 'encore', 'aussi', 'quand', 'contre', 'selon', 'depuis', 'pendant', 'what', 'with', 'from', 'that', 'this', 'have', 'will', 'after', 'over', 'into', 'their', 'about', 'more', 'been', 'says', 'said', 'video', 'direct', 'live'];
function brkTokens_(title) {
  return noAcc_(String(title)).toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(function (w) { return w.length >= 4 && BRK_STOP.indexOf(w) < 0; });
}
function brkCluster_(items) {
  const clusters = [], idx = {};
  items.forEach(function (it) {
    const toks = it.tok;
    const cnt = {};
    toks.forEach(function (w) { (idx[w] || []).forEach(function (ci) { cnt[ci] = (cnt[ci] || 0) + 1; }); });
    let best = -1, bestC = 0;
    Object.keys(cnt).forEach(function (ci) {
      const c = cnt[ci], rl = clusters[ci].rep.length;
      if (c >= 3 && c / Math.min(toks.length, rl) >= 0.5 && c > bestC) { best = Number(ci); bestC = c; }
    });
    if (best >= 0) { clusters[best].items.push(it); }
    else {
      clusters.push({ rep: toks, items: [it] });
      const ci = clusters.length - 1;
      toks.forEach(function (w) { (idx[w] = idx[w] || []).push(ci); });
    }
  });
  return clusters;
}
const BRK_BENIN = /(benin|bénin|cotonou|parakou|porto novo|porto-novo|calavi|ouidah|abomey|bohicon|natitingou|lokossa|wadagni|béninois|beninois|écureuils|ecureuils)/i;
const BRK_JUNK = /(horoscope|loto\b|euromillions|jeu concours|bon plan|soldes|promo\b|code promo|sudoku|mots fléchés|météo|meteo)/i;

function brkText_(cat, main, group, urgent) {
  const names = [main.src];
  group.forEach(function (g) { if (names.indexOf(g.src) < 0) names.push(g.src); });
  const srcs = srcList_(names);
  const label = urgent ? 'URGENT ' + BRK_LABELS[cat].replace('ALERTE ', '') : BRK_LABELS[cat];
  const title = noDash_(main.title);
  const chapo = chapoOf_(main);
  const ext = [main].concat(group).filter(function (x, i, a) { return a.findIndex(function (y) { return y.src === x.src; }) === i; }).slice(0, 5)
    .map(function (x) { return x.title + '. ' + String(x.desc || '').slice(0, 450); }).join(' | ');
  const prompt = "Tu es le rédacteur en chef de la Page Facebook WILACTU, une page d'actualité qui couvre le Bénin, l'Afrique, le monde, l'économie, la politique, le sport, la santé et le numérique. Écris un post Facebook en français, en tutoyant le lecteur, sur l'information ci dessous. Structure OBLIGATOIRE en 4 blocs séparés chacun par une ligne contenant seulement trois tirets (---). "
    + "Bloc 1 : une accroche forte d'une seule phrase (18 mots maximum) qui donne envie de lire, sans recopier le titre. "
    + "Bloc 2 : le fait principal et son contexte en 3 ou 4 phrases courtes, avec les noms, chiffres et lieux présents dans les extraits. "
    + "Bloc 3 : 2 phrases sur ce que cela change ou pourquoi c'est important pour les lecteurs, en citant le Bénin ou l'Afrique de l'Ouest seulement si les extraits le justifient. "
    + "Bloc 4 : une question précise qui pousse à donner son avis. "
    + "Règles : aucun emoji, aucun tiret long, conserve toutes les apostrophes (l'Ordre, d'Olechky) et les traits d'union des verbes (crois-tu, penses-tu), n'invente aucun fait absent des extraits, ne cite pas les sources, 90 à 150 mots au total, ne laisse jamais une phrase inachevée. Information : " + ext;
  const g = gemini_(prompt);
  const body = gemBlocks_(g);
  if (body && gjOk_(body)) return label + '\n\n' + body + '\n\nSources : ' + srcs + '.\n\n#WILACTU ' + BRK_TAGS[cat];
  const extra = group.filter(function (x) { return x.desc && x.src !== main.src; }).slice(0, 2).map(function (x) { return 'Selon ' + x.src + ' : ' + cut_(noDash_(String(x.desc)), 220); });
  return label + '\n\n' + title + '\n\n' + (chapo && chapo !== title ? chapo + '\n\n' : '') + (extra.length ? extra.join('\n\n') + '\n\n' : '') + 'Sources : ' + srcs + '.\n\n' + brkAsk_(cat) + '\n\n#WILACTU ' + BRK_TAGS[cat];
}

// Affiche d'une alerte (statique pour l'instant, remplacee plus tard par une affiche avec le titre).
function brkPoster_(cat, urgent, title, srcs) {
  return urgent ? BRK_RAW + 'BRK-rouge-' + cat + '.png' : BRK_POSTERS[cat];
}
`;

repRe('runBreaking', /function runBreaking_\(dry, wide\) \{[\s\S]*?\n\}\n/, function(){ return String.raw`function runBreaking_(dry, wide) {
  const p = props_();
  if (p.getProperty('BRK_ENABLED') === 'false') { if (dry) alert_('Test alerte actu', 'Les alertes sont suspendues (BRK_ENABLED = false).'); return; }
  const now = new Date();
  const hh = Number(Utilities.formatDate(now, TZ, 'H'));
  if (!dry && (hh < 6 || hh >= 23)) return;
  const log = JSON.parse(p.getProperty('BRK_LOG') || '[]').filter(function (x) { return now - x < 24 * 3600000; });
  const seen = JSON.parse(p.getProperty('BRK_SEEN2') || '[]').filter(function (x) { return now - x.t < 36 * 3600000; });
  const lastCats = JSON.parse(p.getProperty('BRK_CATS') || '[]');
  const max = Number(p.getProperty('BRK_MAX') || 8), gap = Number(p.getProperty('BRK_GAP') || 25);

  const reqs = BRK_FEEDS.map(function (f) { return { url: f.url, muteHttpExceptions: true, followRedirects: true, headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WILACTU)' } }; });
  let resps = [];
  try { resps = UrlFetchApp.fetchAll(reqs); } catch (e) {}
  let items = [], feedsOk = 0;
  BRK_FEEDS.forEach(function (f, k) { try { if (!resps[k]) return; items = items.concat(feedItems_(f, resps[k])); feedsOk++; } catch (e) {} });
  const winH = wide || 8;
  const recent = items.filter(function (i) { return i.title && now - i.date < winH * 3600000 && now - i.date > -600000 && !BRK_JUNK.test(i.title); });
  recent.forEach(function (i) { annotate_(i); i.tok = brkTokens_(i.title); });
  recent.sort(function (a, b) { return b.date - a.date; });
  const clusters = brkCluster_(recent);

  const severeEv = ['zzdeath', 'zzterror', 'zzwar', 'zzcoup', 'zzdisaster'];
  const cands = [];
  clusters.forEach(function (c) {
    const srcNames = c.items.map(function (x) { return x.src; }).filter(function (s, k, a) { return a.indexOf(s) === k; });
    const n = srcNames.length;
    const text = c.items.map(function (x) { return x.title; }).join(' ');
    const ben = BRK_BENIN.test(text);
    if (n < (ben ? 2 : 3)) return;
    const fr = c.items.filter(function (x) { return x.lang === 'fr' && (x.desc || x.cat); }).sort(function (a, b) { return (b.desc ? 1 : 0) - (a.desc ? 1 : 0) || a.date - b.date; })[0];
    if (!fr && !p.getProperty('GEMINI_API_KEY')) return;
    const hasDesc = c.items.some(function (x) { return String(x.desc || '').length > 60; });
    if (!hasDesc && !ben && n < 4) return;
    const votes = {};
    c.items.forEach(function (x) { votes[x.cat] = (votes[x.cat] || 0) + 1; });
    let cat = fr ? fr.cat : c.items[0].cat, topN = 0;
    Object.keys(votes).forEach(function (k) { if (votes[k] > topN) { topN = votes[k]; cat = k; } });
    if (ben) cat = 'benin';
    const newest = Math.max.apply(null, c.items.map(function (x) { return x.date.getTime(); }));
    const age = (now.getTime() - newest) / 3600000;
    let score = n * (1 + 1 / (1 + age));
    if (ben) score *= 2.2;
    score *= Math.pow(0.7, lastCats.filter(function (x) { return x === cat; }).length);
    const main = fr || c.items[0];
    if (seen.some(function (x) { return jjSame_(x.k, main.title); })) return;
    const evs = []; c.items.forEach(function (x) { (x.ev || []).forEach(function (e) { if (evs.indexOf(e) < 0) evs.push(e); }); });
    const severe = evs.some(function (e) { return severeEv.indexOf(e) >= 0; });
    const urgent = (n >= 8 && severe) || n >= 14;
    cands.push({ c: c, n: n, cat: cat, score: score, main: main, group: c.items.filter(function (x) { return x !== main; }), urgent: urgent, ben: ben });
  });
  cands.sort(function (a, b) { return b.score - a.score; });

  let report = 'Flux lus : ' + feedsOk + ' sur ' + BRK_FEEDS.length + '. Articles des ' + winH + ' dernières heures : ' + recent.length + '. Sujets repérés : ' + clusters.length + '. Sujets couverts par plusieurs médias : ' + cands.length + '.\n\n';
  cands.slice(0, 12).forEach(function (x) { report += '- [' + x.cat + (x.urgent ? ', URGENT' : '') + '] ' + x.n + ' médias : ' + x.main.title + '\n'; });
  if (!cands.length) { if (dry) alert_('Test alerte actu', 'Aucun sujet confirmé pour le moment.\n\n' + report); return; }

  const s = cands[0];
  const text = brkText_(s.cat, s.main, s.group, s.urgent);
  const srcNames = [s.main.src].concat(s.group.map(function (g) { return g.src; })).filter(function (x, k, a) { return a.indexOf(x) === k; });
  const poster = brkPoster_(s.cat, s.urgent, s.main.title, srcNames);
  const links = [s.main.link].concat(s.group.map(function (g) { return g.link; })).slice(0, 3).join(' ');
  if (dry) { alert_('Test alerte actu : voici le post qui serait publié', report + '\nPOST PRÉPARÉ :\n\n' + text + '\n\nAffiche : ' + poster + '\nSources : ' + links); return; }
  if (log.length >= max) return;
  if (log.length && !s.urgent && now - log[log.length - 1] < gap * 60000) return;

  const sh = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  const tt = new Date(now.getTime() + Number(p.getProperty('BRK_DELAY') || 10) * 60000);
  const id = 'BRK-' + Utilities.formatDate(now, TZ, 'yyyyMMdd-HHmm');
  const row = [id, Utilities.formatDate(tt, TZ, 'yyyy-MM-dd'), Utilities.formatDate(tt, TZ, 'HH:mm'), 'Facebook', 'Alerte actu', s.main.title, '', text, '', poster, links, 'Alerte', 'À valider', 'Mail envoyé le ' + stamp_(now)];
  const rg = sh.getRange(sh.getLastRow() + 1, 1, 1, row.length);
  rg.setNumberFormat('@');
  rg.setValues([row]);
  sendApproval_(row, tt);
  log.push(now.getTime());
  seen.push({ t: now.getTime(), k: s.main.title });
  lastCats.push(s.cat);
  p.setProperty('BRK_LOG', JSON.stringify(log));
  p.setProperty('BRK_SEEN2', JSON.stringify(seen.slice(-60)));
  p.setProperty('BRK_CATS', JSON.stringify(lastCats.slice(-4)));
}
`; });

// ---- le point du jour : texte structure
repRe('jjText', /function jjText_\(key, noSave\) \{[\s\S]*?\n\}\n/, function(){ return String.raw`function jjText_(key, noSave) {
  const items = jjCollect_(key);
  const pk = jjPick_(key, items);
  const out = pk.out;
  if (out.length < 2) return '';
  const d = new Date();
  const day = Math.floor(d.getTime() / 86400000);
  const hooks = JJ_HOOKS[key], asks = JJ_ASK[key];
  const srcs = out.map(function (x) { return x.src; }).filter(function (s, k, a) { return a.indexOf(s) === k; });
  const srcTxt = srcs.length > 1 ? srcs.slice(0, -1).join(', ') + ' et ' + srcs[srcs.length - 1] : srcs[0];
  const ext = out.map(function (x, i) { return (i + 1) + ') ' + x.title + '. ' + String(x.desc || '').slice(0, 420); }).join(' | ');
  const prompt = "Tu es le rédacteur en chef de la Page Facebook WILACTU, une page d'actualité. Écris en français, en tutoyant le lecteur, un post Facebook intitulé Le point du jour sur le thème « " + key + " », à partir des informations ci dessous. Structure OBLIGATOIRE en blocs séparés chacun par une ligne contenant seulement trois tirets (---). "
    + "Bloc 1 : une accroche forte et émotionnelle de 18 mots maximum (jamais le titre Le point du jour). "
    + "Ensuite un bloc par information : une phrase d'ouverture qui frappe, puis 2 phrases concrètes avec les noms, chiffres et lieux des extraits. "
    + "Avant dernier bloc : 2 phrases sur ce que cela change pour les lecteurs. "
    + "Dernier bloc : une question précise qui pousse à donner son avis. "
    + "Règles : aucun emoji, aucun tiret long, conserve les apostrophes (l'Ordre, d'Olechky) et les traits d'union des verbes (crois-tu, penses-tu), n'invente rien d'absent des extraits, ne cite pas les sources, 140 à 220 mots au total, ne laisse jamais une phrase inachevée. Informations : " + ext;
  const gj = gemini_(prompt);
  const gb = gemBlocks_(gj);
  const body = out.map(function (x, i) { return (i + 1) + '. ' + x.title + (x.desc && x.desc !== x.title ? '\n' + x.desc : ''); }).join('\n\n');
  const text = (gb && gjOk_(gb)) ? gb + '\n\nSources : ' + srcTxt + '.\n\n#WILACTU ' + JJ_TAG[key]
    : hooks[day % hooks.length] + '\n\n' + body + '\n\nSources : ' + srcTxt + '.\n\n' + asks[day % asks.length] + '\n\n#WILACTU ' + JJ_TAG[key];
  if (!noSave) {
    const seen = pk.seen;
    out.forEach(function (x) { seen.push({ t: d.getTime(), k: x.title }); });
    props_().setProperty('JJ_SEEN', JSON.stringify(seen.slice(-120)));
  }
  return text;
}
`; });

// ---- le point du jour : plus d'items, fenetres et sports varies
rep('jj window', "now - i.date < 30 * 3600000", "now - i.date < ((typeof JJ_WIN !== 'undefined' && JJ_WIN[key]) || 30) * 3600000");

t = t + String.raw`

const JJ_WIN = { foot: 36, sport: 36, beninfoot: 72, benin: 36 };
JJ_N.foot = 4; JJ_N.sport = 4; JJ_N.benin = 4;
JJ_FEEDS.sport = JJ_FEEDS.sport.concat([
  { src: 'Google Actualités', url: 'https://news.google.com/rss/search?q=Formule+1+when:1d&hl=fr&gl=FR&ceid=FR:fr', lang: 'fr', gn: true },
  { src: 'Google Actualités', url: 'https://news.google.com/rss/search?q=MotoGP+when:1d&hl=fr&gl=FR&ceid=FR:fr', lang: 'fr', gn: true },
  { src: 'Google Actualités', url: 'https://news.google.com/rss/search?q=boxe+when:2d&hl=fr&gl=FR&ceid=FR:fr', lang: 'fr', gn: true },
  { src: 'Google Actualités', url: 'https://news.google.com/rss/search?q=rugby+when:1d&hl=fr&gl=FR&ceid=FR:fr', lang: 'fr', gn: true }
]);
JJ_FEEDS.foot = JJ_FEEDS.foot.concat([
  { src: 'Google Actualités', url: 'https://news.google.com/rss/search?q=Liga+when:1d&hl=fr&gl=FR&ceid=FR:fr', lang: 'fr', gn: true },
  { src: 'Google Actualités', url: 'https://news.google.com/rss/headlines/section/topic/SPORTS?hl=fr&gl=FR&ceid=FR:fr', lang: 'fr', gn: true }
]);
JJ_FEEDS.beninfoot = [
  { src: 'Google Actualités', url: 'https://news.google.com/rss/search?q=footballeur+b%C3%A9ninois+when:3d&hl=fr&gl=BJ&ceid=BJ:fr', lang: 'fr', gn: true },
  { src: 'Google Actualités', url: 'https://news.google.com/rss/search?q=B%C3%A9nin+football+when:3d&hl=fr&gl=BJ&ceid=BJ:fr', lang: 'fr', gn: true },
  { src: 'Google Actualités', url: 'https://news.google.com/rss/search?q=%C3%89cureuils+when:3d&hl=fr&gl=BJ&ceid=BJ:fr', lang: 'fr', gn: true },
  { src: 'Matin Libre', url: 'https://matinlibre.com/feed', lang: 'fr' },
  { src: 'La Nouvelle Tribune', url: 'https://lanouvelletribune.info/feed', lang: 'fr' }
];
JJ_FEEDS.benin = JJ_FEEDS.benin.concat([
  { src: 'Google Actualités', url: 'https://news.google.com/rss?hl=fr&gl=BJ&ceid=BJ:fr', lang: 'fr', gn: true }
]);
JJ_MAP['Le point des Béninois'] = 'beninfoot';
JJ_TAG.beninfoot = '#Béninois';
JJ_N.beninfoot = 4;
JJ_HOOKS.beninfoot = ['Ils portent les couleurs du Bénin partout dans le monde : voici où en sont nos joueurs.', 'Écureuils et Béninois des clubs étrangers : le point sur leurs performances.', 'Nos joueurs sont à l\'honneur : buts, matchs et retours à suivre.'];
JJ_ASK.beninfoot = ['Quel joueur béninois mérite le plus de lumière en ce moment ? Dis-le en commentaire.', 'Qui sera le héros des Écureuils à la prochaine fenêtre internationale ? Donne ton pronostic.'];
JJ_FILTER.beninfoot = { inc: /(benin|beninois|ecureuils)/, exc: /(\bcasino\b|loto)/ };
JJ_FILTER.benin = { inc: /(benin|cotonou|beninois|parakou|porto novo|calavi|ouidah|abomey|bohicon|talon|wadagni|nigeria|togo|cote d ivoire|burkina|niger|mali|senegal|ghana|afrique)/ };
`;

let syntax = 'ok';
try { new Function(t); } catch (e) { syntax = 'SYNTAX ' + e.message; }
if (syntax === 'ok') { m.pushEditOperations([], [{range: m.getFullModelRange(), text: t}], function(){return null;}); }
return log.join(' | ') + ' || ' + syntax + ' || len ' + t.length;
})()
