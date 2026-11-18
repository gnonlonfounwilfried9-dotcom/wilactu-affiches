// ===================================================================
// Trophees et equipes etendus (2026-11-18, v15) : regex compilees avec try/catch
// ===================================================================
const PV_FTR2 = [
  ["ligue des champions|champions league|\\bldc\\b|finale de la ligue des champions", "tr_ldc"],
  ["ligue europa|europa league|conference league", "tr_europa"],
  ["ballon d.or|golden ball|the best fifa", "tr_ballon"],
  ["premier league", "tr_epl"],
  ["liga\\b|la liga|clasico|supercoupe d.espagne", "tr_liga"],
  ["ligue des champions de la caf|caf champions|champions league africa", "tr_cafcl"],
  ["coupe du monde|mondial|eliminatoires du mondial|mondial 20|fifa world", "tr_mondial"],
  ["\\bcan\\b|coupe d.afrique|afcon|can 20|african cup of nations", "tr_can"],
  ["\\beuro\\b|euro 20|henri delaunay|championnat d.europe", "tr_euro"],
  ["copa america|copa am", "tr_copaamerica"],
  ["bundesliga|bayern|dortmund", "tr_bundesliga"],
  ["coupe de la confederation|confederation cup|caf confederation", "tr_cafcc"],
  ["cosafa", "tr_cosafa"],
  ["supercoupe de l.uefa|uefa super cup", "tr_uefa_supercup"],
  ["supercoupe|super cup|supercopa|supercoppa|trophee des champions", "tr_supercoupe"]
];
const PV_OTR2 = [
  ["ceinture|champion du monde de boxe|unification|wbc|wba|ibf|wbo", "tr_boxe"],
  ["nobel|prix litteraire|goncourt|booker|prix de la paix", "tr_nobel"],
  ["grand prix|podium|champion du monde de f1|formule 1", "tr_f1"],
  ["\\boscars?\\b|academy award|cesar", "tr_oscar"],
  ["roland.garros|mousquetaires", "tr_tennis_rg"],
  ["wimbledon", "tr_tennis_wimbledon"],
  ["\\bnba\\b|larry o.brien", "tr_nba"],
  ["webb ellis|coupe du monde de rugby|rugby world cup|rugby", "tr_rugby"],
  ["cricket|icc world cup", "tr_cricket"],
  ["palme d.or|festival de cannes|\\bcannes\\b", "tr_palme"],
  ["tour de france|maillot jaune", "tr_tdf"],
  ["jeux olympiques de la jeunesse|\\bjoj\\b|youth olympic|dakar 2026", "tr_joj"],
  ["jeux olympiques|\\bjo\\b|olympi|medaille d.or|flamme olympique", "tr_olympique"],
  ["grammy", "tr_grammy"],
  ["us open", "tr_tennis_us"],
  ["ceinture|champion du monde de boxe|\\bwbc\\b|\\bwba\\b|\\bibf\\b|\\bwbo\\b|unification", "tr_ceinture_boxe"]
];
const PV_TMS2 = [
  ["s[ée]n[ée]gal|lions de la teranga|teranga", "tm_senegal"],
  ["c[oô]te d.ivoire|ivoirien|[ée]l[ée]phants", "tm_cotedivoire"],
  ["cameroun|lions indomptables|camerounais", "tm_cameroun"],
  ["maroc|lions de l.atlas|marocain", "tm_maroc"],
  ["alg[ée]rie|fennecs|alg[ée]rien", "tm_algerie"],
  ["[ée]gypte|pharaons|[ée]gyptien", "tm_egypte"],
  ["ghana|black stars|gh[ée]n[ée]en", "tm_ghana"],
  ["burkina|[ée]talons|burkinab[ée]", "tm_burkina"],
  ["tunisie|aigles de carthage|tunisien", "tm_tunisie"],
  ["guin[ée]e|syli", "tm_guinee"],
  ["belgique|diables rouges", "tm_belgique"]
];
function pvRx_(s) { try { return new RegExp(s); } catch (e) { return null; } }
function pvFirst_(list, t) { for (let i = 0; i < list.length; i++) { const r = pvRx_(list[i][0]); if (r && r.test(t)) return list[i][1]; } return ''; }
function pvBgKey_(cat, text) {
  const t = radNorm_(text), seed = String(text).length;
  if (/nobel/.test(t)) return 'tr_nobel';
  const head = t.slice(0, 170);
  if ((PV_FOOT.test(t) || cat === 'sport') && !PV_NOTFOOT.test(t)) {
    const k1 = pvFirst_(PV_FTR2, t); if (k1) return k1;
    let best = '', pos = 1e9;
    for (let i = 0; i < PV_TMS2.length; i++) { const r = pvRx_(PV_TMS2[i][0]); const m = r ? r.exec(head) : null; if (m && m.index < pos) { pos = m.index; best = PV_TMS2[i][1]; } }
    if (best) return best;
    const pool = PV_FPOOL.slice(); if (/benin|ecureuils|cotonou/.test(t)) pool.push('benin_stade', 'benin_stade');
    return pvPick_(pool, seed);
  }
  if (cat === 'sport' || cat === 'autresport' || cat === 'culture') { const k2 = pvFirst_(PV_OTR2, t) || ''; if (k2) return k2; for (let i = 0; i < PV_TR.length; i++) if (PV_TR[i][0].test(t)) return PV_TR[i][1][0]; }
  const foot = [];
  for (let i = 0; i < PV_RULES.length; i++) {
    if (PV_RULES[i][1][0] === 'foot_fans1') { foot.push(PV_RULES[i]); continue; }
    if (PV_RULES[i][0].test(t)) return pvPick_(PV_RULES[i][1], seed);
  }
  for (let i = 0; i < PV_RULES2.length; i++) { const k = PV_RULES2[i][1][0]; if (!PV_BAN[k] && PV_RULES2[i][0].test(t)) return k; }
  const l = pvOk_(PV_BYCAT2[cat] || PV_BYCAT[cat]);
  return l.length ? pvPick_(l, seed) : '';
}
