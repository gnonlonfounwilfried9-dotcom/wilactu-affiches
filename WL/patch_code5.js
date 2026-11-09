(function(){
const m = monaco.editor.getModels().find(x => x.uri.path.indexOf('.js') > 0);
let t = m.getValue();
const log = [];
function repRe(name, re, fn){ if (!re.test(t)) { log.push('MISS ' + name); return; } t = t.replace(re, fn); log.push('ok ' + name); }
repRe('posterSlides', /function posterSlides_\(cfg\) \{[\s\S]*?\n\}\n/, function(){ return String.raw`const POSTER_TPL = '1GZ77SjxkdC9MW7Ol3RCzdin_sNLZI0OhCZnkzLwa8eI';
function posterSlides_(cfg) {
  const copy = DriveApp.getFileById(POSTER_TPL).makeCopy('affiche temporaire');
  const id = copy.getId();
  try {
    const pres = SlidesApp.openById(id);
    const slide = pres.getSlides()[0];
    slide.getPageElements().forEach(function (e) { e.remove(); });
    const W = pres.getPageWidth(), H = pres.getPageHeight();
    const k = W / 1080;
    const bgBlob = UrlFetchApp.fetch(cfg.bg).getBlob();
    slide.insertImage(bgBlob, 0, 0, W, H);
    function tb(x, y, w, h, text, size, color, font) {
      const s = slide.insertTextBox(text, x * k, y * k, w * k, h * k);
      s.setContentAlignment(SlidesApp.ContentAlignment.TOP);
      const tr = s.getText();
      tr.getTextStyle().setFontFamily(font).setFontSize(size * k).setBold(true).setForegroundColor(color);
      tr.getParagraphStyle().setLineSpacing(92);
      return s;
    }
    const head = String(cfg.head || '').toUpperCase().replace(/\s+/g, ' ').trim();
    const n = head.length;
    const size = n <= 32 ? 120 : (n <= 55 ? 104 : (n <= 80 ? 88 : (n <= 110 ? 74 : (n <= 150 ? 62 : 52))));
    tb(56, 120, 968, 90, cfg.label || '', 62, cfg.accent || '#ffd23f', 'Oswald');
    tb(56, 225, 968, 720, head, size, '#FFFFFF', 'Oswald');
    if (cfg.support) tb(56, 985, 968, 190, cut_(String(cfg.support), 190), 38, '#E6EDFB', 'Roboto');
    if (cfg.foot) tb(56, 1180, 968, 60, String(cfg.foot).slice(0, 90), 30, cfg.accent || '#ffd23f', 'Roboto');
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
`; });
let syntax = 'ok';
try { new Function(t); } catch (e) { syntax = 'SYNTAX ' + e.message; }
if (syntax === 'ok') { m.pushEditOperations([], [{range: m.getFullModelRange(), text: t}], function(){return null;}); }
return log.join(' | ') + ' || ' + syntax + ' || len ' + t.length;
})()
