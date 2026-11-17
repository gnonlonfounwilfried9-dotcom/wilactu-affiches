// ===================================================================
// Affiches v2 (2026-11-17) : modeles A (photo plein cadre), B (photo + panneau), C (sans visage), D (Le point du jour)
// Photo de la personnalite via Wikipedia / Wikimedia Commons, pas de ligne Sources, heure d'emission en pied.
// ===================================================================
const PV_RAW = 'https://raw.githubusercontent.com/gnonlonfounwilfried9-dotcom/wilactu-affiches/main/';
const PV_UA = { 'User-Agent': 'WILACTU/1.0 (page d actualite; contact via la page Facebook)' };

function wikiPhoto_(name) {
  const langs = ['fr', 'en'];
  for (let i = 0; i < langs.length; i++) {
    try {
      const u = 'https://' + langs[i] + '.wikipedia.org/w/api.php?action=query&prop=pageimages|pageprops|description&piprop=thumbnail|name&pithumbsize=1100&redirects=1&format=json&titles=' + encodeURIComponent(name);
      const j = JSON.parse(UrlFetchApp.fetch(u, { muteHttpExceptions: true, headers: PV_UA }).getContentText());
      const pages = j.query && j.query.pages ? j.query.pages : {};
      const p = pages[Object.keys(pages)[0]];
      if (!p || p.missing !== undefined || !p.thumbnail) continue;
      if (p.pageprops && p.pageprops.disambiguation !== undefined) continue;
      const th = p.thumbnail;
      if (th.width > th.height * 1.35) continue;
      const blob = UrlFetchApp.fetch(th.source, { muteHttpExceptions: true, headers: PV_UA }).getBlob();
      let credit = 'Photo : Wikimedia Commons';
      try {
        if (p.pageimage) {
          const cu = 'https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=extmetadata&format=json&titles=' + encodeURIComponent('File:' + p.pageimage);
          const cj = JSON.parse(UrlFetchApp.fetch(cu, { muteHttpExceptions: true, headers: PV_UA }).getContentText());
          const cp = cj.query.pages[Object.keys(cj.query.pages)[0]];
          const md = cp.imageinfo[0].extmetadata || {};
          const art = String((md.Artist && md.Artist.value) || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
          const lic = String((md.LicenseShortName && md.LicenseShortName.value) || '').trim();
          if (art || lic) credit = 'Photo : ' + (art ? art.slice(0, 34) : 'Wikimedia Commons') + (lic ? ' / ' + lic : '');
        }
      } catch (e2) {}
      return { blob: blob, credit: credit, title: p.title };
    } catch (e) {}
  }
  return null;
}

// Titre, sous-titre, personnalite, chiffre cle et etiquette de l'affiche, ecrits par Gemini.
function posterFieldsV2_(title, desc, ext) {
  let head = cut_(noDash_(title), 66), sub = '', person = '', big = '', kick = '';
  const g = gemini_("À partir de l'information ci dessous, écris le contenu d'une affiche d'actualité professionnelle. Format exact, une ligne par champ : TITRE: titre percutant de 62 caractères maximum, avec la ponctuation française correcte (apostrophes, guillemets français, deux points), sans point final. SOUSTITRE: une phrase de 100 caractères maximum qui apporte le fait clé (nom, chiffre ou lieu). PERSONNE: nom complet, tel qu'il s'écrit sur Wikipédia, de la personnalité au centre de l'information (sportif, artiste, responsable politique, chef d'entreprise), seulement si elle est assez célèbre pour avoir une page Wikipédia, sinon NON. CHIFFRE: un chiffre ou un résultat fort de 7 caractères maximum tiré de l'information (par exemple 5 Go, 1-0, 6,3 Md$), sinon NON. ETIQUETTE: libellé de contexte de 26 caractères maximum, sinon NON. Règles : français correct avec tous les accents et toutes les apostrophes, aucun emoji, aucun tiret long, rien d'inventé hors des extraits. Information : " + ext);
  if (g) {
    const f = function (k) { const x = new RegExp(k + '\\s*:\\s*(.+)', 'i').exec(g); return x ? x[1].trim().replace(/^"|"$/g, '') : ''; };
    const t1 = f('TITRE'); if (t1.length >= 12 && t1.length <= 80) head = noDash_(t1).replace(/[.]$/, '');
    const s1 = f('SOUSTITRE'); if (s1.length >= 20 && s1.length <= 140) sub = noDash_(s1);
    const p1 = f('PERSONNE'); if (p1 && !/^non/i.test(p1) && p1.split(' ').length >= 2 && p1.length <= 40) person = p1;
    const b1 = f('CHIFFRE'); if (b1 && !/^non/i.test(b1) && b1.length <= 9) big = b1;
    const k1 = f('ETIQUETTE'); if (k1 && !/^non/i.test(k1) && k1.length <= 30) kick = noDash_(k1);
  }
  return { head: head, sub: sub, person: person, big: big, kick: kick };
}

function posterV2_(cfg) {
  const copy = DriveApp.getFileById(POSTER_TPL).makeCopy('affiche temporaire');
  const id = copy.getId();
  try {
    const pres = SlidesApp.openById(id);
    const slide = pres.getSlides()[0];
    slide.getPageElements().forEach(function (e) { e.remove(); });
    const W = pres.getPageWidth(), H = pres.getPageHeight(), k = W / 1080;
    slide.getBackground().setSolidFill('#0a1a3a');
    const mode = cfg.mode;
    if (mode === 'A' || mode === 'B') {
      const img = slide.insertImage(cfg.photo);
      const w0 = img.getWidth(), h0 = img.getHeight();
      const regionH = (mode === 'B' ? 800 : 1350) * k;
      const sc = Math.max(W / w0, regionH / h0);
      img.setWidth(w0 * sc); img.setHeight(h0 * sc);
      img.setLeft((W - w0 * sc) / 2); img.setTop(0);
      slide.insertImage(UrlFetchApp.fetch(PV_RAW + (mode === 'A' ? 'P-ovA.png' : 'P-ovB.png')).getBlob(), 0, 0, W, H);
    } else {
      slide.insertImage(UrlFetchApp.fetch(PV_RAW + 'P-bgC.jpg').getBlob(), 0, 0, W, H);
    }
    const tb = function (x, y, w, h, text, size, color, font, anchor, align) {
      const s = slide.insertTextBox(text, x * k, y * k, w * k, h * k);
      s.setContentAlignment(anchor === 'BOTTOM' ? SlidesApp.ContentAlignment.BOTTOM : (anchor === 'MIDDLE' ? SlidesApp.ContentAlignment.MIDDLE : SlidesApp.ContentAlignment.TOP));
      s.getText().getTextStyle().setFontFamily(font).setFontSize(size * k).setBold(font === 'Oswald').setForegroundColor(color);
      if (align === 'END') s.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.END);
      if (align === 'CENTER') s.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
      return s;
    };
    const fit = function (text, w, boxH, sizes) {
      const n = text.length;
      for (let i = 0; i < sizes.length; i++) {
        const cpl = Math.floor(w / (0.6 * sizes[i]));
        if (Math.ceil(n / cpl * 1.1) * sizes[i] * 1.08 <= boxH) return sizes[i];
      }
      return sizes[sizes.length - 1];
    };
    // etiquette de rubrique
    const tagTxt = String(cfg.tag || '');
    const tw = 44 + tagTxt.length * 19;
    const rect = slide.insertShape(SlidesApp.ShapeType.RECTANGLE, 64 * k, 64 * k, tw * k, 54 * k);
    rect.getFill().setSolidFill(cfg.urgent ? '#d7263d' : '#ffd23f'); rect.getBorder().setTransparent();
    tb(64, 64, tw, 54, tagTxt, 30, cfg.urgent ? '#ffffff' : '#0a1a3a', 'Oswald', 'MIDDLE', 'CENTER');
    // logo
    const lg = tb(560, 58, 456, 60, 'WILACTU', 40, '#ffffff', 'Oswald', 'MIDDLE', 'END');
    lg.getText().getRange(3, 7).getTextStyle().setForegroundColor('#ffd23f');
    const head = String(cfg.head || '').toUpperCase().replace(/\s+/g, ' ').trim();
    const sub = String(cfg.sub || '').replace(/\s+/g, ' ').trim();
    if (mode === 'A') {
      tb(64, 700, 952, 420, head, fit(head, 936, 420, [112, 100, 92, 84, 76, 68, 60]), '#FFFFFF', 'Oswald', 'BOTTOM');
      if (sub) tb(64, 1128, 900, 130, sub, 34, '#e8eefc', 'Roboto', 'TOP');
    } else if (mode === 'B') {
      tb(64, 840, 952, 290, head, fit(head, 936, 290, [84, 76, 68, 62, 56]), '#FFFFFF', 'Oswald', 'TOP');
      if (sub) tb(64, 1130, 940, 110, sub, 32, '#d7e1f7', 'Roboto', 'TOP');
    } else if (mode === 'C') {
      if (cfg.big) {
        const bs = cfg.big.length <= 4 ? 330 : (cfg.big.length <= 6 ? 250 : 190);
        tb(56, 170, 1000, 480, cfg.big, bs, '#ffd23f', 'Oswald', 'MIDDLE');
        if (cfg.kick) tb(64, 676, 940, 56, String(cfg.kick).toUpperCase(), 32, '#9fb4e6', 'Oswald', 'TOP');
        tb(64, 740, 952, 320, head, fit(head, 936, 320, [86, 78, 70, 62, 56]), '#FFFFFF', 'Oswald', 'TOP');
        if (sub) tb(64, 1066, 900, 150, sub, 34, '#d7e1f7', 'Roboto', 'TOP');
      } else {
        tb(64, 200, 952, 640, head, fit(head, 936, 640, [124, 112, 100, 92, 84, 76]), '#FFFFFF', 'Oswald', 'MIDDLE');
        if (sub) tb(64, 880, 900, 220, sub, 38, '#d7e1f7', 'Roboto', 'TOP');
      }
    } else if (mode === 'D') {
      tb(64, 190, 952, 330, head, fit(head, 936, 330, [124, 112, 100, 92, 84]), '#FFFFFF', 'Oswald', 'MIDDLE');
      (cfg.list || []).slice(0, 3).forEach(function (p, i) {
        const cy = 600 + i * 205;
        const c = slide.insertShape(SlidesApp.ShapeType.ELLIPSE, 64 * k, (cy + 10) * k, 58 * k, 58 * k);
        c.getFill().setSolidFill('#ffd23f'); c.getBorder().setTransparent();
        tb(64, cy + 10, 58, 58, String(i + 1), 34, '#0a1a3a', 'Oswald', 'MIDDLE', 'CENTER');
        const ptxt = String(p).replace(/\s+/g, ' ').trim();
        tb(144, cy, 872, 190, ptxt, ptxt.length <= 60 ? 40 : 34, '#FFFFFF', 'Roboto', 'TOP');
      });
    }
    // credit photo, pied de page
    if (cfg.credit && (mode === 'A' || mode === 'B')) tb(420, mode === 'A' ? 1228 : 1222, 596, 26, cfg.credit, 16, '#9fb0d6', 'Roboto', 'TOP', 'END');
    tb(64, 1276, 400, 56, 'WILACTU', 24, '#ffd23f', 'Oswald', 'MIDDLE');
    tb(380, 1276, 636, 56, String(cfg.foot || ''), 24, '#ffd23f', 'Oswald', 'MIDDLE', 'END');
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

function pvFoot_() { return frDate_() + ' · ' + Utilities.formatDate(new Date(), TZ, "HH'H'mm"); }

// Affiche d'une alerte : photo de la personnalite si elle est nommee, sinon modele typographique.
function brkPoster_(cat, urgent, title, srcs, desc, main, group) {
  const stat = urgent ? BRK_RAW + 'BRK-rouge-' + cat + '.png' : BRK_POSTERS[cat];
  try {
    const word = { sport: 'FOOTBALL', autresport: 'SPORT', sante: 'SANTÉ', benin: 'BÉNIN', finance: 'ÉCONOMIE', monde: 'MONDE', politique: 'POLITIQUE', afrique: 'AFRIQUE', actu: 'ACTU', crypto: 'CRYPTO', tech: 'NUMÉRIQUE' }[cat] || 'ACTU';
    const ext = [main].concat(group || []).filter(function (x, i, a) { return a.findIndex(function (y) { return y.src === x.src; }) === i; }).slice(0, 5)
      .map(function (x) { return x.title + '. ' + String(x.desc || '').slice(0, 400); }).join(' | ');
    const f = posterFieldsV2_(title, desc, ext);
    let photo = null;
    if (f.person) {
      const last = f.person.split(' ').pop().toLowerCase();
      if ((String(title) + ' ' + String(desc || '') + ' ' + ext).toLowerCase().indexOf(last) >= 0) photo = wikiPhoto_(f.person);
    }
    const mode = photo ? (f.head.length <= 58 ? 'A' : 'B') : 'C';
    return posterV2_({ mode: mode, urgent: urgent, tag: (urgent ? 'URGENT · ' : '') + word, head: f.head, sub: f.sub, big: f.big, kick: f.kick, photo: photo ? photo.blob : null, credit: photo ? photo.credit : '', foot: pvFoot_() }) || stat;
  } catch (e) {
    try { props_().setProperty('POSTER_LAST_ERROR', String(e.message).slice(0, 300)); } catch (e2) {}
    return stat;
  }
}

// Affiche "Le point du jour" : mot de la rubrique et trois titres numerotes.
function jjPosterFor_(r) {
  const key = jjKey_(String(r[4]));
  if (!key || !JJ_LAST || JJ_LAST.key !== key) return '';
  const word = { foot: 'FOOT', sport: 'SPORT', sante: 'SANTÉ', economie: 'ÉCONOMIE', tech: 'TECH', culture: 'CULTURE', sciences: 'SCIENCES', benin: 'BÉNIN', beninfoot: 'BÉNINOIS' }[key];
  const pts = JJ_LAST.titles.slice(0, 3).map(function (x) { return cut_(noDash_(x), 90); });
  while (pts.length < 3) pts.push('Retrouve le détail dans le post');
  return posterV2_({ mode: 'D', urgent: false, tag: 'LE POINT DU JOUR', head: 'LE POINT ' + word, list: pts, foot: pvFoot_() });
}

// Test : un modele de chaque type avec de vraies photos.
function testPoster2() {
  const a = wikiPhoto_('Robert Pattinson'), b = wikiPhoto_('Carlos Alcaraz');
  const u1 = a ? posterV2_({ mode: 'A', tag: 'CINÉMA', head: 'Robert Pattinson est le nouveau James Bond', sub: "Amazon MGM l'a annoncé ce lundi. Denis Villeneuve réalisera le film.", photo: a.blob, credit: a.credit, foot: pvFoot_() }) : 'photo A introuvable';
  const u2 = b ? posterV2_({ mode: 'B', tag: 'TENNIS', head: "Alcaraz lance son tournoi : Tiafoe n'a rien pu faire", sub: "L'Espagnol s'impose pour son entrée aux ATP Finals de Turin et vise le seul titre qui lui manque.", photo: b.blob, credit: b.credit, foot: pvFoot_() }) : 'photo B introuvable';
  const u3 = posterV2_({ mode: 'C', tag: 'BÉNIN', head: 'MTN offre 5 Go à certains abonnés', sub: 'Plusieurs abonnés disent avoir reçu le bonus sur leur ligne. Vérifie ton solde avant de le dire à tes proches.', big: '5 Go', kick: 'Offre MTN Bénin', foot: pvFoot_() });
  const u4 = posterV2_({ mode: 'D', tag: 'LE POINT DU JOUR', head: 'LE POINT BÉNIN', list: ['Les Écureuils battent la Centrafrique 1-0 en éliminatoires de la CAN', 'Le permis de conduire devient obligatoire pour les deux roues', 'Alerte aux oiseaux granivores dans la commune de Matéri'], foot: pvFoot_() });
  alert_('Test affiches v2', 'A : ' + u1 + '\nB : ' + u2 + '\nC : ' + u3 + '\nD : ' + u4 + '\nErreur : ' + (props_().getProperty('POSTER_LAST_ERROR') || 'aucune'));
}
