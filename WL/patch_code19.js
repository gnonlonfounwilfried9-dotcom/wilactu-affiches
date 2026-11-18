// ---- X (Twitter) : publication miroir des posts Facebook
// Cles a coller dans les proprietes du script : TW_API_KEY, TW_API_SECRET, TW_ACCESS_TOKEN, TW_ACCESS_SECRET
function twPct_(s) { return encodeURIComponent(s).replace(/[!'()*]/g, function (c) { return '%' + c.charCodeAt(0).toString(16).toUpperCase(); }); }
function twAuth_(method, url) {
  const p = props_(), ck = p.getProperty('TW_API_KEY'), cs = p.getProperty('TW_API_SECRET'), at = p.getProperty('TW_ACCESS_TOKEN'), as = p.getProperty('TW_ACCESS_SECRET');
  if (!ck || !cs || !at || !as) return null;
  const o = { oauth_consumer_key: ck, oauth_nonce: Utilities.getUuid().replace(/-/g, ''), oauth_signature_method: 'HMAC-SHA1', oauth_timestamp: String(Math.floor(Date.now() / 1000)), oauth_token: at, oauth_version: '1.0' };
  const base = method.toUpperCase() + '&' + twPct_(url) + '&' + twPct_(Object.keys(o).sort().map(function (k) { return twPct_(k) + '=' + twPct_(o[k]); }).join('&'));
  o.oauth_signature = Utilities.base64Encode(Utilities.computeHmacSha1Signature(base, twPct_(cs) + '&' + twPct_(as)));
  return 'OAuth ' + Object.keys(o).sort().map(function (k) { return twPct_(k) + '="' + twPct_(o[k]) + '"'; }).join(', ');
}
function twText_(texte) {
  const paras = String(texte).split(/\n\n+/).map(function (x) { return x.trim(); }).filter(function (x) { return x && !/^(ALERTE|URGENT)\b/.test(x) && !/^Sources :/.test(x) && !/^#/.test(x); });
  if (!paras.length) return '';
  const hook = paras[0], q = paras.length > 2 ? paras[paras.length - 1] : '';
  let t = (q && (hook + ' ' + q).length <= 236) ? hook + ' ' + q : hook;
  if (t.length > 236) t = t.slice(0, 233).replace(/\s+\S*$/, '') + '...';
  return t + '\n\n#WILACTU';
}
function postTwitter_(texte, visuel) {
  if (!props_().getProperty('TW_API_KEY')) return null;
  let mediaId = null;
  if (/^https?:\/\//.test(String(visuel || '').trim())) {
    try {
      const blob = UrlFetchApp.fetch(String(visuel).trim(), { muteHttpExceptions: true }).getBlob();
      const url = 'https://upload.twitter.com/1.1/media/upload.json';
      const r = UrlFetchApp.fetch(url, { method: 'post', muteHttpExceptions: true, headers: { Authorization: twAuth_('POST', url) }, payload: { media: blob } });
      if (r.getResponseCode() === 200) mediaId = JSON.parse(r.getContentText()).media_id_string;
    } catch (e) {}
  }
  const body = { text: twText_(texte) };
  if (!body.text) return null;
  if (mediaId) body.media = { media_ids: [mediaId] };
  const u = 'https://api.twitter.com/2/tweets';
  const res = UrlFetchApp.fetch(u, { method: 'post', contentType: 'application/json', muteHttpExceptions: true, headers: { Authorization: twAuth_('POST', u) }, payload: JSON.stringify(body) });
  if (res.getResponseCode() >= 300) throw new Error('X : ' + res.getContentText().slice(0, 200));
  return JSON.parse(res.getContentText()).data.id;
}
