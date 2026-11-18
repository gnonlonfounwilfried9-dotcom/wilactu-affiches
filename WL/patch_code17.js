// ===================================================================
// Qualite des alertes (2026-11-18) : IA plus fiable (modeles de secours, nouvelles tentatives), rubrique Benin exacte,
// fonds toujours presents et lies au sujet (titre seul, clubs, selections, dirigeants)
// ===================================================================
const GEM_MODELS = ['gemini-flash-lite-latest', 'gemini-2.5-flash-lite', 'gemini-flash-latest', 'gemini-2.5-flash', 'gemini-2.0-flash'];
function gemCall_(prompt, withTemp, accentCheck) {
  const gk = props_().getProperty('GEMINI_API_KEY');
  if (!gk) return null;
  const t0 = Date.now();
  for (let i = 0; i < GEM_MODELS.length && Date.now() - t0 < 100000; i++) {
    for (let a = 0; a < 2; a++) {
      try {
        const body = { contents: [{ parts: [{ text: prompt }] }] };
        if (withTemp) body.generationConfig = { temperature: 0.2 };
        const res = UrlFetchApp.fetch('https://generativelanguage.googleapis.com/v1beta/models/' + GEM_MODELS[i] + ':generateContent', { method: 'post', contentType: 'application/json', muteHttpExceptions: true, headers: { 'x-goog-api-key': gk }, payload: JSON.stringify(body) });
        const code = res.getResponseCode();
        if (code === 429 || code >= 500) { Utilities.sleep(a === 0 ? 1500 : 0); if (a === 0 && code === 429) continue; break; }
        const txt = JSON.parse(res.getContentText()).candidates[0].content.parts[0].text;
        if (txt && String(txt).trim() && (!accentCheck || (String(txt).match(/[éèêàùçôîïâû]/g) || []).length >= String(txt).length / 200)) return txt;
        break;
      } catch (e) { break; }
    }
  }
  return null;
}
function gemini_(prompt) { return gemCall_(prompt, false, true); }
function radGem_(prompt) { return gemCall_(prompt, true, false); }
const BRK_OTHERC = /(s[ée]n[ée]gal|maroc|alg[ée]rie|[ée]gypte|nigeria|ghana|cameroun|c[oô]te d.ivoire|mali\b|burkina|tunisie|gabon|togo|niger\b|guin[ée]e|congo|angola|zambie|ouganda|kenya|tanzanie)/i;
function brkBenin_(c) {
  const t0 = String(c.items[0].title);
  const b = t0.search(BRK_BENIN);
  if (b < 0) return false;
  const o = t0.search(BRK_OTHERC);
  return o < 0 || b <= o;
}
function pvClub_(t, cat) {
  if (/real madrid|bernabeu|merengue/.test(t)) return 'foot_bernabeu';
  if (/barcelone|\bbarca\b|camp nou/.test(t)) return 'sp_campnou';
  if (/arsenal|chelsea|liverpool|manchester|tottenham|newcastle|premier league/.test(t)) return 'sp_wembley';
  if (/selection|double nationalite|binational|jouer pour deux pays|equipe nationale/.test(t) && (cat === 'sport' || PV_FOOT.test(t))) return pvPick_(['tm_algerie', 'tm_belgique', 'tm_cameroun', 'tm_egypte', 'tm_senegal', 'tm_maroc', 'tm_ghana', 'tm_burkina', 'tm_tunisie'], t.length);
  if (cat === 'monde' || cat === 'politique') {
    if (/chine|xi jinping|pekin/.test(t)) return 'mo_chine';
    if (/russie|poutine|kremlin|moscou/.test(t)) return 'mo_kremlin';
    if (/trump|etats-unis|washington|congres|maison blanche/.test(t)) return 'mo_liberty';
  }
  return '';
}
