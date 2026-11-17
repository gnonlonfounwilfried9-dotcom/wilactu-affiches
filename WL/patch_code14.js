// ===================================================================
// Radar : plafond par sujet (qualifications), requetes de veille elargies (2026-11-18)
// ===================================================================
RAD_FASTQ.push(['Cyber Africa Forum Cotonou', 'benin'], ['Binance Blockchain Week', 'crypto'], ['débat présidentielle France', 'politique'], ['sommet Chine Russie États-Unis', 'monde'], ['Trump Xi Jinping Poutine', 'monde'],
  ['CAN 2027 qualification', 'sport'], ['Coupe du monde 2026 football', 'sport'], ['Ligue des champions', 'sport'], ['Ballon d\'Or', 'sport'], ['Maroc Algérie Égypte football', 'sport'],
  ['Mali Burkina Niger AES', 'afrique'], ['Ukraine Russie', 'monde'], ['Gaza Israël', 'monde'], ['intelligence artificielle OpenAI OR Google OR Nvidia', 'tech'], ['Grammy OR Oscars OR Netflix', 'culture'], ['épidémie OMS', 'sante'], ['Cameroun OR Togo OR Gabon OR Tchad gouvernement', 'afrique'], ['Afrique sommet économie', 'finance']);
const RAD_TOPIC_COUNTRY = /(senegal|benin|maroc|algerie|egypte|nigeria|ghana|cameroun|cote d.ivoire|mali|burkina|tunisie|rd congo|congo|gabon|guinee|togo|afrique du sud|cap.vert|mozambique|ethiopie|niger|tchad|zambie|ouganda|kenya|tanzanie|angola)/;
function radTopicKey_(title) {
  const t = radNorm_(title);
  if (/qualifi/.test(t) && /\bcan\b|coupe d.afrique|mondial|coupe du monde|eliminatoires/.test(t)) { const c = RAD_TOPIC_COUNTRY.exec(t); return 'qualif|' + (c ? c[1] : 'x'); }
  return '';
}
function radTopicSeen_(title) {
  const k = radTopicKey_(title);
  if (!k) return false;
  try { const m = JSON.parse(props_().getProperty('RAD_TOPICS') || '{}'); return !!m[k] && Date.now() - m[k] < 24 * 3600000; } catch (e) { return false; }
}
function radTopicMark_(title) {
  const k = radTopicKey_(title);
  if (!k) return;
  try {
    const p = props_(), m = JSON.parse(p.getProperty('RAD_TOPICS') || '{}'), now = Date.now();
    Object.keys(m).forEach(function (x) { if (now - m[x] > 48 * 3600000) delete m[x]; });
    m[k] = now; p.setProperty('RAD_TOPICS', JSON.stringify(m));
  } catch (e) {}
}
