(function(){
const m = monaco.editor.getModels()[0];
let t = m.getValue();
const log = [];
function rep(name, find, to){ const c = t.split(find).length - 1; if (c < 1) { log.push('MISS ' + name); return; } t = t.split(find).join(to); log.push('ok ' + name); }
function repRe(name, re, fn){ if (!re.test(t)) { log.push('MISS ' + name); return; } t = t.replace(re, fn); log.push('ok ' + name); }

// Facebook : envoi direct de l'image enregistree dans Drive
rep('fb drive', "function postFacebook_(message, visuel) {", String.raw`function postFacebook_(message, visuel) {
  const dm = /drive\.google\.com\/thumbnail\?id=([A-Za-z0-9_-]+)/.exec(String(visuel || ''));
  if (dm) {
    try {
      const blob = DriveApp.getFileById(dm[1]).getBlob();
      const rd = UrlFetchApp.fetch('https://graph.facebook.com/' + FB_PAGE_ID + '/photos', {
        method: 'post', muteHttpExceptions: true,
        payload: { source: blob, caption: message, published: 'true', access_token: fbPageToken_() }
      });
      const jd = JSON.parse(rd.getContentText());
      const idd = jd.post_id || jd.id;
      if (idd) return idd;
    } catch (e) {}
  }`);

repRe('brkPoster', /function brkPoster_\(cat, urgent, title, srcs\) \{[\s\S]*?\n\}\n/, function(){ return String.raw`function brkPoster_(cat, urgent, title, srcs, desc) {
  const stat = urgent ? BRK_RAW + 'BRK-rouge-' + cat + '.png' : BRK_POSTERS[cat];
  try {
    const word = { sport: 'FOOTBALL', autresport: 'SPORT', sante: 'SANTÉ', benin: 'BÉNIN', finance: 'ÉCONOMIE', monde: 'MONDE', politique: 'POLITIQUE', afrique: 'AFRIQUE', actu: 'ACTU', crypto: 'CRYPTO', tech: 'NUMÉRIQUE' }[cat] || 'ACTU';
    const bg = BRK_RAW + (urgent ? 'BG-rouge-' + cat : 'BG-' + (cat === 'sport' ? 'foot' : cat)) + '.png';
    const url = posterSlides_({ bg: bg, label: (urgent ? 'URGENT  ' : '') + word, accent: urgent ? '#ffd400' : (POSTER_ACC[cat] || '#ffd23f'), head: title, support: desc || '', foot: 'Sources : ' + srcs.slice(0, 3).join(', ') });
    return url || stat;
  } catch (e) {
    try { alert_('Affiche : repli sur le modèle fixe', String(e.message).slice(0, 300)); } catch (e2) {}
    return stat;
  }
}
`; });
rep('brkPoster call', "const poster = brkPoster_(s.cat, s.urgent, s.main.title, srcNames);", "const poster = brkPoster_(s.cat, s.urgent, s.main.title, srcNames, chapoOf_(s.main));");

t = t + String.raw`

// ===================================================================
// Affiches avec le titre de l'info (Google Slides), ajoute le 2026-11-09
// ===================================================================
const POSTER_ACC = { sport: '#b7f542', autresport: '#fff3b0', sante: '#99f6e4', benin: '#fcd116', finance: '#8ec5ff', monde: '#8ec5ff', politique: '#d8ccff', afrique: '#ffd29a', actu: '#e2e8f0', crypto: '#ffc266', tech: '#a5f3fc' };
function hexRgb_(h) { const n = parseInt(String(h).replace('#', ''), 16); return { red: ((n >> 16) & 255) / 255, green: ((n >> 8) & 255) / 255, blue: (n & 255) / 255 }; }
function slidesApi_(method, url, payload) {
  const opt = { method: method, muteHttpExceptions: true, headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() } };
  if (payload) { opt.contentType = 'application/json'; opt.payload = JSON.stringify(payload); }
  const res = UrlFetchApp.fetch(url, opt);
  if (res.getResponseCode() >= 300) throw new Error('Slides ' + res.getResponseCode() + ' : ' + res.getContentText().slice(0, 250));
  return JSON.parse(res.getContentText());
}
function slideText_(reqs, oid, page, x, y, w, h, text, size, color, font, anchor) {
  reqs.push({ createShape: { objectId: oid, shapeType: 'TEXT_BOX', elementProperties: { pageObjectId: page, size: { width: { magnitude: w, unit: 'PT' }, height: { magnitude: h, unit: 'PT' } }, transform: { scaleX: 1, scaleY: 1, translateX: x, translateY: y, unit: 'PT' } } } });
  reqs.push({ insertText: { objectId: oid, insertionIndex: 0, text: text } });
  reqs.push({ updateTextStyle: { objectId: oid, textRange: { type: 'ALL' }, style: { fontFamily: font, fontSize: { magnitude: size, unit: 'PT' }, bold: true, foregroundColor: { opaqueColor: { rgbColor: hexRgb_(color) } } }, fields: 'fontFamily,fontSize,bold,foregroundColor' } });
  reqs.push({ updateParagraphStyle: { objectId: oid, textRange: { type: 'ALL' }, style: { lineSpacing: 92, alignment: 'START' }, fields: 'lineSpacing,alignment' } });
  reqs.push({ updateShapeProperties: { objectId: oid, shapeProperties: { contentAlignment: anchor || 'TOP' }, fields: 'contentAlignment' } });
}
function posterFolder_() {
  const it = DriveApp.getFoldersByName('WILACTU affiches');
  return it.hasNext() ? it.next() : DriveApp.createFolder('WILACTU affiches');
}
// cfg : bg (url), label, accent, head, support, foot. Renvoie l'adresse de l'image enregistree dans Drive.
function posterSlides_(cfg) {
  const pres = slidesApi_('post', 'https://slides.googleapis.com/v1/presentations', { title: 'WILACTU affiche', pageSize: { width: { magnitude: 1080, unit: 'PT' }, height: { magnitude: 1350, unit: 'PT' } } });
  const id = pres.presentationId, page = pres.slides[0].objectId;
  try {
    const reqs = [];
    (pres.slides[0].pageElements || []).forEach(function (e) { reqs.push({ deleteObject: { objectId: e.objectId } }); });
    reqs.push({ createImage: { objectId: 'bg1', url: cfg.bg, elementProperties: { pageObjectId: page, size: { width: { magnitude: 1080, unit: 'PT' }, height: { magnitude: 1350, unit: 'PT' } }, transform: { scaleX: 1, scaleY: 1, translateX: 0, translateY: 0, unit: 'PT' } } } });
    const head = String(cfg.head || '').toUpperCase().replace(/\s+/g, ' ').trim();
    const n = head.length;
    const size = n <= 32 ? 120 : (n <= 55 ? 104 : (n <= 80 ? 88 : (n <= 110 ? 74 : (n <= 150 ? 62 : 52))));
    slideText_(reqs, 'lab1', page, 56, 120, 968, 90, cfg.label || '', 62, cfg.accent || '#ffd23f', 'Oswald', 'TOP');
    slideText_(reqs, 'head1', page, 56, 225, 968, 720, head, size, '#FFFFFF', 'Oswald', 'TOP');
    if (cfg.support) {
      const sup = cut_(String(cfg.support), 190);
      slideText_(reqs, 'sup1', page, 56, 985, 968, 190, sup, 38, '#E6EDFB', 'Roboto', 'TOP');
    }
    if (cfg.foot) slideText_(reqs, 'foot1', page, 56, 1180, 968, 60, String(cfg.foot).slice(0, 90), 30, cfg.accent || '#ffd23f', 'Roboto', 'TOP');
    slidesApi_('post', 'https://slides.googleapis.com/v1/presentations/' + id + ':batchUpdate', { requests: reqs });
    const th = slidesApi_('get', 'https://slides.googleapis.com/v1/presentations/' + id + '/pages/' + page + '/thumbnail?thumbnailProperties.mimeType=PNG&thumbnailProperties.thumbnailSize=LARGE');
    const png = UrlFetchApp.fetch(th.contentUrl).getBlob().setName('affiche-' + Utilities.formatDate(new Date(), TZ, 'yyyyMMdd-HHmmss') + '.png');
    const file = posterFolder_().createFile(png);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return 'https://drive.google.com/thumbnail?id=' + file.getId() + '&sz=w1080';
  } finally {
    try { DriveApp.getFileById(id).setTrashed(true); } catch (e) {}
  }
}
// Ne sert qu'a declarer les droits Slides et Drive au script (jamais appelee).
function scopeHint_() { SlidesApp.getActivePresentation(); DriveApp.getRootFolder(); }

function testPoster() {
  const u = posterSlides_({ bg: BRK_RAW + 'BG-rouge-politique.png', label: 'URGENT  POLITIQUE', accent: '#ffd400', head: 'Teddy Riner candidat à la présidentielle de 2027', support: 'Le judoka a annoncé sa candidature dans une vidéo publiée lundi sur son compte X.', foot: 'Sources : Le Dauphiné Libéré, TF1 Info, RMC Sport' });
  const u2 = posterSlides_({ bg: BRK_RAW + 'BG-benin.png', label: 'BÉNIN', accent: '#fcd116', head: 'Dette extérieure du Bénin : ce que contient le rapport de la Banque mondiale sur dix ans', support: 'Le document détaille les emprunts contractés par l\'État béninois.', foot: 'Sources : Banouto, La Nation, 24 Heures au Bénin' });
  alert_('Test des affiches avec titre', 'Affiche 1 : ' + u + '\nAffiche 2 : ' + u2);
}
`;

let syntax = 'ok';
try { new Function(t); } catch (e) { syntax = 'SYNTAX ' + e.message; }
if (syntax === 'ok') { m.pushEditOperations([], [{range: m.getFullModelRange(), text: t}], function(){return null;}); }
return log.join(' | ') + ' || ' + syntax + ' || len ' + t.length;
})()
