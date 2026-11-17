// ===================================================================
// Regle football et liste noire d'images (2026-11-18)
// ===================================================================
const PV_BAN = { af_addis: 1, so_puits: 1, so_logement: 1, so_bus: 1, benin_tata: 1, mo_seisme: 1, mo_inondation: 1, benin_missebo: 1, so_embouteillage: 1 };
const PV_FOOT = /football|\bfoot\b|\bcan\b|\bcan 20|coupe d.afrique|coupe du monde|\bmondial\b|eliminatoires|ligue des champions|ligue 1|ligue europa|mercato|ecureuils|guepards|lions de l|lions indomptables|super eagles|black stars|equipe nationale|selection nationale|buteur|\bfifa\b|\bcaf\b|premier league|\bliga\b|serie a|bundesliga|ballon d.or|derby|gardien de but|attaquant|milieu de terrain|qualifie pour la can|qualification/;
const PV_NOTFOOT = /formule 1|\bf1\b|motogp|tennis|rugby|basket|boxe|cyclisme|athletisme|tour de france|natation/;
const PV_FPOOL = ['foot_fans1', 'foot_fans2', 'foot_stade', 'foot_ballon', 'sp_dribble', 'sp_gardien', 'sp_foule', 'sp_campnou', 'sp_wembley', 'foot_bernabeu'];
const PV_TEAMS = [
  [/c[oô]te d.ivoire|ivoirien|[ée]l[ée]phants/, 'tm_cotedivoire'],
  [/cameroun|lions indomptables/, 'tm_cameroun'],
  [/alg[ée]rie|fennecs/, 'tm_algerie'],
  [/[ée]gypte|pharaons/, 'tm_egypte'],
  [/guin[ée]e|syli/, 'tm_guinee'],
  [/belgique|diables rouges/, 'tm_belgique']
];
function pvOk_(l) { return (l || []).filter(function (k) { return !PV_BAN[k]; }); }
function pvBgKey_(cat, text) {
  const t = radNorm_(text), seed = String(text).length;
  if (/nobel/.test(t)) return 'tr_nobel';
  const head = t.slice(0, 170);
  if ((PV_FOOT.test(t) || cat === 'sport') && !PV_NOTFOOT.test(t)) {
    for (let i = 0; i < PV_TR.length; i++) { const k = PV_TR[i][1][0]; if (/^tr_(ldc|europa|ballon|epl|liga|mondial|euro|can)$/.test(k) && PV_TR[i][0].test(t)) return k; }
    let best = null, pos = 1e9;
    for (let i = 0; i < PV_TEAMS.length; i++) { const m = PV_TEAMS[i][0].exec(head); if (m && m.index < pos) { pos = m.index; best = PV_TEAMS[i][1]; } }
    if (best) return best;
    const pool = PV_FPOOL.slice(); if (/benin|ecureuils|cotonou/.test(t)) pool.push('benin_stade', 'benin_stade');
    return pvPick_(pool, seed);
  }
  if (cat === 'sport' || cat === 'autresport' || cat === 'culture') for (let i = 0; i < PV_TR.length; i++) if (PV_TR[i][0].test(t)) return PV_TR[i][1][0];
  const foot = [];
  for (let i = 0; i < PV_RULES.length; i++) {
    if (PV_RULES[i][1][0] === 'foot_fans1') { foot.push(PV_RULES[i]); continue; }
    if (PV_RULES[i][0].test(t)) return pvPick_(PV_RULES[i][1], seed);
  }
  for (let i = 0; i < PV_RULES2.length; i++) { const k = PV_RULES2[i][1][0]; if (!PV_BAN[k] && PV_RULES2[i][0].test(t)) return k; }
  const l = pvOk_(PV_BYCAT2[cat] || PV_BYCAT[cat]);
  return l.length ? pvPick_(l, seed) : '';
}
function jjPosterFor_(r) {
  const key = jjKey_(String(r[4]));
  if (!key || !JJ_LAST || JJ_LAST.key !== key) return '';
  const word = { foot: 'FOOT', sport: 'SPORT', sante: 'SANTÉ', economie: 'ÉCONOMIE', tech: 'TECH', culture: 'CULTURE', sciences: 'SCIENCES', benin: 'BÉNIN', beninfoot: 'BÉNINOIS' }[key] || 'ACTU';
  const pts = JJ_LAST.titles.slice(0, 3).map(function (x) { return cut_(noDash_(x), 90); });
  while (pts.length < 3) pts.push('Retrouve le détail dans le post');
  const list = pvOk_(PV_JJ2[key] || PV_JJ[key]);
  const seed = Number(Utilities.formatDate(new Date(), TZ, 'D')) * 7 + Number(Utilities.formatDate(new Date(), TZ, 'H'));
  const bg = list.length ? pvBg_(pvPick_(list, seed)) : null;
  return posterV2_({ mode: 'D', urgent: false, tag: 'LE POINT DU JOUR', head: 'LE POINT ' + word, list: pts, photo: bg ? bg.blob : null, credit: bg ? bg.credit : '', foot: pvFoot_() });
}
