(function(){
const m = monaco.editor.getModels()[0];
let t = m.getValue();
const log = [];
function rep(name, find, to){ const c = t.split(find).length - 1; if (c < 1) { log.push('MISS ' + name); return; } t = t.split(find).join(to); log.push('ok ' + name); }

// annotate_ seulement pour les sujets retenus (gain de temps)
rep('no annotate all', "recent.forEach(function (i) { annotate_(i); i.tok = brkTokens_(i.title); });", "recent.forEach(function (i) { i.tok = brkTokens_(i.title); });");
rep('annotate in cluster', "const evs = []; c.items.forEach(function (x) { (x.ev || []).forEach(function (e) { if (evs.indexOf(e) < 0) evs.push(e); }); });", "const evs = []; c.items.forEach(function (x) { annotate_(x); (x.ev || []).forEach(function (e) { if (evs.indexOf(e) < 0) evs.push(e); }); });");
rep('urgent rule', "const urgent = (n >= 8 && severe) || n >= 14;", "const urgent = (n >= 8 && severe) || n >= 30;");

// chronometre dans le rapport de test
rep('timer start', "const reqs = BRK_FEEDS.map(function (f) { return { url: f.url, muteHttpExceptions: true, followRedirects: true, headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WILACTU)' } }; });\n  let resps = [];\n  try { resps = UrlFetchApp.fetchAll(reqs); } catch (e) {}\n  let items = [], feedsOk = 0;",
  "const T0 = new Date().getTime();\n  const reqs = BRK_FEEDS.map(function (f) { return { url: f.url, muteHttpExceptions: true, followRedirects: true, headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WILACTU)' } }; });\n  let resps = [];\n  try { resps = UrlFetchApp.fetchAll(reqs); } catch (e) {}\n  const T1 = new Date().getTime();\n  let items = [], feedsOk = 0;");
rep('timer parse', "const winH = wide || 8;", "const T2 = new Date().getTime();\n  const winH = wide || 8;");
rep('timer cluster', "const clusters = brkCluster_(recent);", "const clusters = brkCluster_(recent);\n  const T3 = new Date().getTime();");
rep('timer report', "let report = 'Flux lus : '", "let report = 'Durées : téléchargement ' + Math.round((T1 - T0) / 1000) + ' s, lecture ' + Math.round((T2 - T1) / 1000) + ' s, regroupement ' + Math.round((T3 - T2) / 1000) + ' s.\\n'; report += 'Flux lus : '");

// consignes de redaction : accents, chiffres, nouvel essai si le texte est sans accents
rep('prompt accents', "Règles : aucun emoji, aucun tiret long, conserve toutes les apostrophes (l'Ordre, d'Olechky) et les traits d'union des verbes (crois-tu, penses-tu), n'invente aucun fait absent des extraits, ne cite pas les sources, 90 à 150 mots au total, ne laisse jamais une phrase inachevée. Information : \" + ext;",
  "Règles : écris en français correct avec TOUS les accents (é, è, ê, à, ù, ç, ô), aucun emoji, aucun tiret long, conserve toutes les apostrophes (l'Ordre, d'Olechky) et les traits d'union des verbes (crois-tu, penses-tu), écris les nombres et les années en chiffres (2027, 9 novembre, 800 civils), n'invente aucun fait absent des extraits, ne cite pas les sources, 90 à 150 mots au total, ne laisse jamais une phrase inachevée. Information : \" + ext;");
rep('prompt accents jj', "Règles : aucun emoji, aucun tiret long, conserve les apostrophes (l'Ordre, d'Olechky) et les traits d'union des verbes (crois-tu, penses-tu), n'invente rien d'absent des extraits, ne cite pas les sources, 140 à 220 mots au total, ne laisse jamais une phrase inachevée. Informations : \" + ext;",
  "Règles : écris en français correct avec TOUS les accents (é, è, ê, à, ù, ç, ô), aucun emoji, aucun tiret long, conserve les apostrophes (l'Ordre, d'Olechky) et les traits d'union des verbes (crois-tu, penses-tu), écris les nombres et les années en chiffres, n'invente rien d'absent des extraits, ne cite pas les sources, 140 à 220 mots au total, ne laisse jamais une phrase inachevée. Informations : \" + ext;");
rep('gjOk accents', "return x.length > 300 && /[.?!]$/.test(x);", "const acc = (x.match(/[éèêàùçôîïâû]/g) || []).length;\n  return x.length > 300 && /[.?!]$/.test(x) && acc >= x.length / 120;");
// deux essais pour obtenir un texte valide
rep('gemini retry', "const models = ['gemini-flash-lite-latest'];\n  for (let i = 0; i < models.length; i++) {", "const models = ['gemini-flash-lite-latest', 'gemini-flash-lite-latest'];\n  for (let i = 0; i < models.length; i++) {");
rep('gemini accept', "if (txt && String(txt).trim()) return txt;", "if (txt && String(txt).trim() && (String(txt).match(/[éèêàùçôîïâû]/g) || []).length >= String(txt).length / 200) return txt;");

let syntax = 'ok';
try { new Function(t); } catch (e) { syntax = 'SYNTAX ' + e.message; }
if (syntax === 'ok') { m.pushEditOperations([], [{range: m.getFullModelRange(), text: t}], function(){return null;}); }
return log.join(' | ') + ' || ' + syntax + ' || len ' + t.length;
})()
