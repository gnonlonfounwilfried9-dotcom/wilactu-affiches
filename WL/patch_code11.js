// ===================================================================
// Fonds thematiques (2026-11-18) : photo de la personnalite, sinon image du sujet, sinon modele typographique
// ===================================================================
let PV_META = null;
function pvMeta_() {
  if (PV_META) return PV_META;
  try { PV_META = JSON.parse(UrlFetchApp.fetch(PV_RAW + 'BG2.json').getContentText()); } catch (e) { PV_META = {}; }
  return PV_META;
}
function pvPick_(list, seed) { return list[Math.abs(seed) % list.length]; }
const PV_RULES = [
  [/mtn|moov|celtiis|forfait|operateur|gigas?\b|reseau mobile|arcep/, ['telecom']],
  [/mobile money|momo|paiement mobile|smartphone|whatsapp|reseaux sociaux/, ['tech_phone']],
  [/bitcoin|crypto|ethereum|binance|stablecoin|blockchain/, ['crypto']],
  [/franc cfa|fcfa|bceao|inflation|banque|budget|impot|carburant/, ['finance']],
  [/formule 1|\bf1\b|grand prix|verstappen|hamilton|ferrari|mclaren|red bull/, ['f1']],
  [/motogp|marquez|bagnaia|ducati|moto2/, ['motogp']],
  [/boxe|boxeur|doumbe|jake paul/, ['boxe']],
  [/tennis|\batp\b|\bwta\b|alcaraz|djokovic|sinner|roland garros|wimbledon/, ['tennis']],
  [/rugby|xv de france|springboks|top 14/, ['rugby']],
  [/basket|\bnba\b|afrobasket/, ['basket']],
  [/athletisme|marathon|sprint|relais/, ['athle']],
  [/cyclisme|tour de france|pogacar|vuelta|giro/, ['cyclisme']],
  [/real madrid|bernabeu|clasico/, ['foot_bernabeu']],
  [/ecureuils|guepards|\bcan\b|afcon|eliminatoires|supporters|ligue des champions|football|mercato|ballon d'or|ligue 1|premier league/, ['foot_fans1', 'foot_fans2', 'foot_bernabeu']],
  [/amazone/, ['benin_amazone']],
  [/ouidah|non.retour|esclav|patrimoine/, ['benin_porte']],
  [/ganvie|nokoue|pirogue|\bpeche\b|\blac\b/, ['benin_ganvie']],
  [/dantokpa|\bmarche\b|commercant/, ['benin_marche']],
  [/\bzem\b|zemidjan|\bmoto\b|permis de conduire|code de la route|circulation|accident/, ['benin_zem', 'benin_zem2', 'benin_marche']],
  [/\bplage\b|littoral/, ['benin_plage']],
  [/\bsante\b|hopital|vaccin|paludisme|\boms\b|maladie|epidemie|medecin/, ['sante']],
  [/election|\bvote\b|scrutin|presidentielle|legislative/, ['vote']],
  [/assemblee|parlement|depute|constitution/, ['politique']],
  [/\bonu\b|diplomatie|guerre|conflit|\botan\b|ukraine|gaza|israel|\biran\b|russie/, ['monde_onu']],
  [/\becole\b|\bbac\b|bepc|universite|etudiant|bourse|examen|concours/, ['ecole']],
  [/concert|musique|album|chanteur|chanteuse|afrobeats|festival/, ['culture_concert']],
  [/\bmode\b|defile|fashion|couture/, ['culture_mode']],
  [/\bfilm\b|cinema|\bserie\b|acteur|actrice|netflix|james bond/, ['cinema']],
  [/\bavion\b|compagnie aerienne|aeroport/, ['avion']],
  [/electricite|\bsbee\b|coupure|energie|petrole|\bgaz\b/, ['energie']],
  [/intelligence artificielle|\bia\b|cyber|donnees|numerique|serveur|cloud|nvidia|openai/, ['tech_data']]
];
const PV_BYCAT = { benin: ['benin_amazone', 'benin_ganvie', 'benin_marche', 'benin_porte', 'benin_plage', 'benin_zem'], afrique: ['abidjan', 'dakar'], monde: ['monde_terre', 'monde_onu'], politique: ['politique', 'vote'], finance: ['finance'], crypto: ['crypto'], tech: ['tech_data', 'tech_phone'], sante: ['sante'], sport: ['foot_fans1', 'foot_fans2', 'foot_bernabeu'], autresport: ['athle', 'cyclisme', 'boxe'] };
const PV_JJ = { foot: ['foot_fans1', 'foot_fans2', 'foot_bernabeu'], sport: ['athle', 'cyclisme', 'tennis', 'basket', 'rugby'], sante: ['sante'], economie: ['finance', 'crypto'], tech: ['tech_data', 'tech_phone', 'telecom'], culture: ['culture_concert', 'cinema', 'culture_mode'], sciences: ['monde_terre', 'tech_data'], benin: ['benin_amazone', 'benin_porte', 'benin_ganvie', 'benin_marche', 'benin_plage', 'benin_zem', 'benin_drapeau'], beninfoot: ['foot_fans1', 'foot_fans2'] };

function pvBgKey_(cat, text) {
  const t = radNorm_(text), seed = String(text).length;
  for (let i = 0; i < PV_RULES.length; i++) if (PV_RULES[i][0].test(t)) return pvPick_(PV_RULES[i][1], seed);
  const l = PV_BYCAT[cat];
  return l ? pvPick_(l, seed) : '';
}
function pvBg_(key) {
  if (!key) return null;
  try {
    const r = UrlFetchApp.fetch(PV_RAW + 'BG2-' + key + '.jpg', { muteHttpExceptions: true });
    if (r.getResponseCode() !== 200) return null;
    return { blob: r.getBlob(), credit: pvMeta_()[key] || '' };
  } catch (e) { return null; }
}

function brkPoster_(cat, urgent, title, srcs, desc, main, group) {
  const stat = urgent ? BRK_RAW + 'BRK-rouge-' + cat + '.png' : BRK_POSTERS[cat];
  try {
    const word = { sport: 'FOOTBALL', autresport: 'SPORT', sante: 'SANTÉ', benin: 'BÉNIN', finance: 'ÉCONOMIE', monde: 'MONDE', politique: 'POLITIQUE', afrique: 'AFRIQUE', actu: 'ACTU', crypto: 'CRYPTO', tech: 'NUMÉRIQUE' }[cat] || 'ACTU';
    const ext = [main].concat(group || []).filter(function (x, i, a) { return a.findIndex(function (y) { return y.src === x.src; }) === i; }).slice(0, 5)
      .map(function (x) { return x.title + '. ' + String(x.desc || '').slice(0, 400); }).join(' | ');
    const f = posterFieldsV2_(title, desc, ext);
    let photo = null, credit = '', mode = 'C';
    if (f.person) {
      const last = f.person.split(' ').pop().toLowerCase();
      if ((String(title) + ' ' + String(desc || '') + ' ' + ext).toLowerCase().indexOf(last) >= 0) {
        const w = wikiPhoto_(f.person);
        if (w) { photo = w.blob; credit = w.credit; mode = f.head.length <= 58 ? 'A' : 'B'; }
      }
    }
    if (!photo && !f.big) {
      const bg = pvBg_(pvBgKey_(cat, String(title) + ' ' + ext));
      if (bg) { photo = bg.blob; credit = bg.credit; mode = 'A'; }
    }
    return posterV2_({ mode: mode, urgent: urgent, tag: (urgent ? 'URGENT · ' : '') + word, head: f.head, sub: f.sub, big: f.big, kick: f.kick, photo: photo, credit: credit, foot: pvFoot_() }) || stat;
  } catch (e) {
    try { props_().setProperty('POSTER_LAST_ERROR', String(e.message).slice(0, 300)); } catch (e2) {}
    return stat;
  }
}

function jjPosterFor_(r) {
  const key = jjKey_(String(r[4]));
  if (!key || !JJ_LAST || JJ_LAST.key !== key) return '';
  const word = { foot: 'FOOT', sport: 'SPORT', sante: 'SANTÉ', economie: 'ÉCONOMIE', tech: 'TECH', culture: 'CULTURE', sciences: 'SCIENCES', benin: 'BÉNIN', beninfoot: 'BÉNINOIS' }[key];
  const pts = JJ_LAST.titles.slice(0, 3).map(function (x) { return cut_(noDash_(x), 90); });
  while (pts.length < 3) pts.push('Retrouve le détail dans le post');
  const list = PV_JJ[key] || [];
  const seed = Number(Utilities.formatDate(new Date(), TZ, 'D')) + Number(Utilities.formatDate(new Date(), TZ, 'H'));
  const bg = list.length ? pvBg_(pvPick_(list, seed)) : null;
  return posterV2_({ mode: 'D', urgent: false, tag: 'LE POINT DU JOUR', head: 'LE POINT ' + word, list: pts, photo: bg ? bg.blob : null, credit: bg ? bg.credit : '', foot: pvFoot_() });
}

function testPoster3() {
  const t = [
    ['benin', false, "Le permis de conduire devient obligatoire pour les deux roues au Bénin", "Les zémidjans et conducteurs de deux roues devront présenter un permis."],
    ['sport', false, "Formule 1 : Hamilton prend la pole position à Abu Dhabi", "Le Britannique partira premier dimanche."],
    ['crypto', false, "Le bitcoin dépasse un nouveau record", "Le cours a franchi un nouveau seuil cette semaine."]
  ].map(function (a) {
    const m = { title: a[2], desc: a[3], src: 'test' };
    return brkPoster_(a[0], a[1], a[2], [], a[3], m, []);
  });
  const jj = (function () { JJ_LAST = { key: 'benin', titles: ['Les Écureuils battent la Centrafrique 1-0', 'Le permis devient obligatoire pour les deux roues', 'Alerte aux oiseaux granivores à Matéri'], srcs: '' }; return jjPosterFor_([0, 0, 0, 0, 'Le point Bénin']); })();
  alert_('Test affiches v3', 'Bénin : ' + t[0] + '\nF1 : ' + t[1] + '\nBitcoin : ' + t[2] + '\nPoint Bénin : ' + jj + '\nErreur : ' + (props_().getProperty('POSTER_LAST_ERROR') || 'aucune'));
}
