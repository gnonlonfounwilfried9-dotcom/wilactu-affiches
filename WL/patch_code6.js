(function(){
const m = monaco.editor.getModels().find(x => x.uri.path.indexOf('.js') > 0);
let t = m.getValue();
const log = [];
function rep(name, find, to){ const c = t.split(find).length - 1; if (c < 1) { log.push('MISS ' + name); return; } t = t.split(find).join(to); log.push('ok ' + name); }
function repRe(name, re, fn){ if (!re.test(t)) { log.push('MISS ' + name); return; } t = t.replace(re, fn); log.push('ok ' + name); }

repRe('posterSlides', /function posterSlides_\(cfg\) \{[\s\S]*?\n\}\n/, function(){ return String.raw`function posterSlides_(cfg) {
  const copy = DriveApp.getFileById(POSTER_TPL).makeCopy('affiche temporaire');
  const id = copy.getId();
  try {
    const pres = SlidesApp.openById(id);
    const slide = pres.getSlides()[0];
    slide.getPageElements().forEach(function (e) { e.remove(); });
    const W = pres.getPageWidth(), H = pres.getPageHeight();
    const k = W / 1080;
    slide.insertImage(UrlFetchApp.fetch(cfg.bg).getBlob(), 0, 0, W, H);
    function tb(x, y, w, h, text, size, color, font, anchor) {
      const s = slide.insertTextBox(text, x * k, y * k, w * k, h * k);
      s.setContentAlignment(anchor === 'MIDDLE' ? SlidesApp.ContentAlignment.MIDDLE : SlidesApp.ContentAlignment.TOP);
      s.getText().getTextStyle().setFontFamily(font).setFontSize(size * k).setBold(true).setForegroundColor(color);
      return s;
    }
    const head = String(cfg.head || '').toUpperCase().replace(/\s+/g, ' ').trim();
    const n = head.length;
    let size = 48;
    [124, 112, 100, 92, 84, 76, 68, 60, 54, 48].some(function (sz) {
      const cpl = Math.floor(936 / (0.6 * sz));
      const lines = Math.ceil(n / cpl * 1.12);
      if (lines * sz * 1.12 <= 560) { size = sz; return true; }
      return false;
    });
    tb(72, 112, 760, 54, cfg.tag || '', 38, cfg.accent || '#ffd23f', 'Oswald', 'MIDDLE');
    tb(72, 205, 936, 560, head, size, '#FFFFFF', 'Oswald', 'MIDDLE');
    const pts = (cfg.points || []).slice(0, 3);
    for (let i = 0; i < pts.length; i++) {
      const p = String(pts[i]).replace(/\s+/g, ' ').trim();
      tb(176, 812 + i * 96, 812, 92, p.length > 86 ? cut_(p, 86) : p, p.length <= 46 ? 38 : 32, '#FFFFFF', 'Roboto', 'MIDDLE');
    }
    if (cfg.srcs) tb(262, 1136, 730, 52, String(cfg.srcs).slice(0, 80), 26, '#FFFFFF', 'Roboto', 'MIDDLE');
    pres.saveAndClose();
    const res = UrlFetchApp.fetch('https://docs.google.com/presentation/d/' + id + '/export/png', { headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() }, muteHttpExceptions: true });
    if (res.getResponseCode() !== 200) throw new Error('Export ' + res.getResponseCode());
    const png = res.getBlob().setName('affiche-' + Utilities.formatDate(new Date(), TZ, 'yyyyMMdd-HHmmss') + '.png');
    const file = posterFolder_().createFile(png);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return 'https://drive.google.com/thumbnail?id=' + file.getId() + '&sz=w1080';
  } finally {
    try { copy.setTrashed(true); } catch (e) {}
  }
}

// Titre court et 3 faits pour l'affiche, ecrits par Gemini a partir des extraits (repli : phrases du resume).
function posterFields_(title, desc, ext, nSrc) {
  let head = noDash_(title), pts = [];
  const g = gemini_("À partir de l'information ci dessous, écris le contenu d'une affiche d'actualité. Format exact, une ligne chacune : TITRE: un titre percutant de 70 caractères maximum, sans guillemets. POINT1: un fait précis (nom, chiffre ou lieu) de 75 caractères maximum. POINT2: un autre fait précis de 75 caractères maximum. POINT3: ce que cela change ou la suite attendue, 75 caractères maximum. Règles : français correct avec tous les accents, aucun emoji, aucun tiret long, pas de point final, rien d'inventé hors des extraits. Information : " + ext);
  if (g) {
    const mt = /TITRE\s*:\s*(.+)/i.exec(g);
    if (mt && mt[1].trim().length >= 12 && mt[1].trim().length <= 95) head = noDash_(mt[1].trim().replace(/^"|"$/g, ''));
    [1, 2, 3].forEach(function (i) {
      const mp = new RegExp('POINT' + i + '\\s*:\\s*(.+)', 'i').exec(g);
      if (mp && mp[1].trim().length >= 10) pts.push(noDash_(mp[1].trim().replace(/[.]$/, '')));
    });
  }
  if (pts.length < 3) {
    const ss = String(desc || '').replace(/\s+/g, ' ').split(/(?<=[.!?])\s+/).filter(function (s) { return s.length >= 25 && s.length <= 120; });
    ss.forEach(function (s) { if (pts.length < 2) pts.push(noDash_(s.replace(/[.]$/, ''))); });
    if (pts.length < 3) pts.push('Information reprise par ' + nSrc + ' médias');
    if (pts.length < 3) pts.push('Donne ton avis en commentaire');
  }
  return { head: head, points: pts.slice(0, 3) };
}
`; });

repRe('brkPoster', /function brkPoster_\(cat, urgent, title, srcs, desc\) \{[\s\S]*?\n\}\n/, function(){ return String.raw`function brkPoster_(cat, urgent, title, srcs, desc, main, group) {
  const stat = urgent ? BRK_RAW + 'BRK-rouge-' + cat + '.png' : BRK_POSTERS[cat];
  try {
    const word = { sport: 'FOOTBALL', autresport: 'SPORT', sante: 'SANTÉ', benin: 'BÉNIN', finance: 'ÉCONOMIE', monde: 'MONDE', politique: 'POLITIQUE', afrique: 'AFRIQUE', actu: 'ACTU', crypto: 'CRYPTO', tech: 'NUMÉRIQUE' }[cat] || 'ACTU';
    const bg = BRK_RAW + (urgent ? 'BG-rouge-' + cat : 'BG-' + (cat === 'sport' ? 'foot' : cat)) + '.png';
    const ext = [main].concat(group || []).filter(function (x, i, a) { return a.findIndex(function (y) { return y.src === x.src; }) === i; }).slice(0, 5)
      .map(function (x) { return x.title + '. ' + String(x.desc || '').slice(0, 400); }).join(' | ');
    const f = posterFields_(title, desc, ext, srcs.length);
    const url = posterSlides_({ bg: bg, tag: (urgent ? 'URGENT  ' : '') + word, accent: urgent ? '#ffd400' : (POSTER_ACC[cat] || '#ffd23f'), head: f.head, points: f.points, srcs: srcs.slice(0, 3).join(', ') });
    return url || stat;
  } catch (e) {
    try { props_().setProperty('POSTER_LAST_ERROR', String(e.message).slice(0, 300)); } catch (e2) {}
    return stat;
  }
}

// Affiche "Le point du jour" : mot de la rubrique en grand et les trois titres du jour dans la carte.
let JJ_LAST = null;
function jjPosterFor_(r) {
  const key = jjKey_(String(r[4]));
  if (!key || !JJ_LAST || JJ_LAST.key !== key) return '';
  const word = { foot: 'FOOT', sport: 'SPORT', sante: 'SANTÉ', economie: 'ÉCONOMIE', tech: 'TECH', culture: 'CULTURE', sciences: 'SCIENCES', benin: 'BÉNIN', beninfoot: 'BÉNINOIS' }[key];
  const acc = { foot: '#b7f542', sport: '#fff3b0', sante: '#99f6e4', economie: '#8ec5ff', tech: '#a5f3fc', culture: '#f5d0fe', sciences: '#c7d2fe', benin: '#fcd116', beninfoot: '#b7f542' }[key];
  const pts = JJ_LAST.titles.slice(0, 3).map(function (x) { return cut_(x, 86); });
  while (pts.length < 3) pts.push('Retrouve le détail dans le post');
  return posterSlides_({ bg: BRK_RAW + 'BGJ-' + key + '.png', tag: 'LE POINT DU JOUR', accent: acc, head: 'LE POINT ' + word, points: pts, srcs: JJ_LAST.srcs });
}
`; });

rep('brkPoster call', "const poster = brkPoster_(s.cat, s.urgent, s.main.title, srcNames, chapoOf_(s.main));", "const poster = brkPoster_(s.cat, s.urgent, s.main.title, srcNames, chapoOf_(s.main), s.main, s.group);");
rep('jj last', "  if (!noSave) {\n    const seen = pk.seen;", "  JJ_LAST = { key: key, titles: out.map(function (x) { return x.title; }), srcs: srcTxt.replace(' et ', ', ') };\n  if (!noSave) {\n    const seen = pk.seen;");
rep('tick poster', "if (g) { sh.getRange(line, C.TEXTE + 1).setValue(g); r[C.TEXTE] = g; }", "if (g) { sh.getRange(line, C.TEXTE + 1).setValue(g); r[C.TEXTE] = g; try { const pu = jjPosterFor_(r); if (pu) { sh.getRange(line, C.VISUEL + 1).setValue(pu); r[C.VISUEL] = pu; } } catch (e) {} }");

repRe('testPoster', /function testPoster\(\) \{[\s\S]*?\n\}\n/, function(){ return String.raw`function testPoster() {
  const u = posterSlides_({ bg: BRK_RAW + 'BG-rouge-politique.png', tag: 'URGENT  POLITIQUE', accent: '#ffd400', head: 'Teddy Riner candidat à la présidentielle de 2027', points: ['Annonce faite dans une vidéo publiée lundi sur son compte X', 'Il doit réunir 500 parrainages d\'élus pour se présenter', 'Information reprise par 52 médias'], srcs: 'Le Dauphiné Libéré, TF1 Info, RMC Sport' });
  const u2 = posterSlides_({ bg: BRK_RAW + 'BG-foot.png', tag: 'FOOTBALL', accent: '#b7f542', head: '"Le Real Madrid est la meilleure équipe d\'Europe" : la déclaration paradoxale de Cucurella qui "regarde peu de football"', points: ['Marc Cucurella parle dans une interview à la radio Cope', 'Il dit regarder peu de football mais juge le Real au dessus', 'Des propos qui font réagir en Espagne'], srcs: 'RMC Sport, Eurosport, Foot Mercato' });
  const u3 = posterSlides_({ bg: BRK_RAW + 'BGJ-benin.png', tag: 'LE POINT DU JOUR', accent: '#fcd116', head: 'LE POINT BÉNIN', points: ['Procès Houndégnon : la Cour de répression rouvre le dossier', 'Alerte aux oiseaux granivores dans la commune de Matéri', 'Permis de conduire obligatoire pour les deux et trois roues'], srcs: 'La Nouvelle Tribune, Matin Libre' });
  alert_('Test des affiches avec titre', 'Affiche 1 : ' + u + '\nAffiche 2 : ' + u2 + '\nAffiche 3 : ' + u3);
}
`; });

let syntax = 'ok';
try { new Function(t); } catch (e) { syntax = 'SYNTAX ' + e.message; }
if (syntax === 'ok') { m.pushEditOperations([], [{range: m.getFullModelRange(), text: t}], function(){return null;}); }
return log.join(' | ') + ' || ' + syntax + ' || len ' + t.length;
})()
