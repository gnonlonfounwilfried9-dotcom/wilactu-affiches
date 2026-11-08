(function(){
const m = monaco.editor.getModels()[0];
let t = m.getValue();
const log = [];
function rep(name, find, to){ const i = t.indexOf(find); if (i < 0) { log.push('MISS ' + name); return; } t = t.slice(0, i) + to + t.slice(i + find.length); log.push('ok ' + name); }
function repRe(name, re, fn){ if (!re.test(t)) { log.push('MISS ' + name); return; } t = t.replace(re, fn); log.push('ok ' + name); }

// ---- affiches, libelles, hashtags des nouvelles categories
rep('poster sport', "{ crypto: BRK_RAW + 'BRK-crypto.png', sport: BRK_RAW + 'BRK-sport.png',", "{ crypto: BRK_RAW + 'BRK-crypto.png', sport: BRK_RAW + 'BRK-foot.png', autresport: BRK_RAW + 'BRK-autresport.png', sante: BRK_RAW + 'BRK-sante.png', benin: BRK_RAW + 'BRK-benin.png',");
rep('labels', "finance: 'ALERTE ÉCONOMIE',", "autresport: 'ALERTE SPORT', sante: 'ALERTE SANTÉ', benin: 'ALERTE BÉNIN', finance: 'ALERTE ÉCONOMIE',");
rep('tags', "finance: '#Économie',", "autresport: '#Sport', sante: '#Santé', benin: '#Bénin', finance: '#Économie',");

// ---- nouveaux flux d'alerte
repRe('feeds', /(\{ src: 'Le Monde Politique'[^\n]*\})\n\];/, function(a, b){ return b + `,
  { src: 'RMC Sport', url: 'https://rmcsport.bfmtv.com/rss/football', cat: 'sport', lang: 'fr' },
  { src: 'Sports.fr', url: 'https://www.sports.fr/feed', cat: 'sport', lang: 'fr' },
  { src: 'Foot Mercato', url: 'https://www.footmercato.net/flux-rss', cat: 'sport', lang: 'fr' },
  { src: 'Africa Top Sports', url: 'https://www.africatopsports.com/feed/', cat: 'sport', lang: 'fr' },
  { src: 'Sky Sports', url: 'https://www.skysports.com/rss/12040', cat: 'sport', lang: 'en' },
  { src: 'ESPN', url: 'https://www.espn.com/espn/rss/soccer/news', cat: 'sport', lang: 'en' },
  { src: 'BBC Sport Afrique', url: 'https://feeds.bbci.co.uk/sport/africa/rss.xml', cat: 'sport', lang: 'en' },
  { src: 'BBC Tennis', url: 'https://feeds.bbci.co.uk/sport/tennis/rss.xml', cat: 'autresport', lang: 'en' },
  { src: 'RMC Basket', url: 'https://rmcsport.bfmtv.com/rss/basket', cat: 'autresport', lang: 'fr' },
  { src: 'RMC Athlétisme', url: 'https://rmcsport.bfmtv.com/rss/athletisme', cat: 'autresport', lang: 'fr' },
  { src: 'RMC Tennis', url: 'https://rmcsport.bfmtv.com/rss/tennis', cat: 'autresport', lang: 'fr' },
  { src: 'Google Actualités JOJ', url: 'https://news.google.com/rss/search?q=Jeux+Olympiques+de+la+Jeunesse+Dakar+when:1d&hl=fr&gl=BJ&ceid=BJ:fr', cat: 'autresport', lang: 'fr', gn: true },
  { src: 'Le Monde Santé', url: 'https://www.lemonde.fr/sante/rss_full.xml', cat: 'sante', lang: 'fr' },
  { src: 'Franceinfo Santé', url: 'https://www.francetvinfo.fr/sante.rss', cat: 'sante', lang: 'fr' },
  { src: 'Santé Magazine', url: 'https://www.santemagazine.fr/rss', cat: 'sante', lang: 'fr' },
  { src: 'BBC Health', url: 'https://feeds.bbci.co.uk/news/health/rss.xml', cat: 'sante', lang: 'en' },
  { src: 'OMS', url: 'https://www.who.int/rss-feeds/news-english.xml', cat: 'sante', lang: 'en' },
  { src: 'La Nouvelle Tribune', url: 'https://lanouvelletribune.info/feed', cat: 'benin', lang: 'fr' },
  { src: 'Matin Libre', url: 'https://matinlibre.com/feed', cat: 'benin', lang: 'fr' },
  { src: 'Fraternité', url: 'https://www.fraternitebj.info/feed', cat: 'benin', lang: 'fr' },
  { src: 'Google Actualités Bénin', url: 'https://news.google.com/rss/search?q=B%C3%A9nin+when:1d&hl=fr&gl=BJ&ceid=BJ:fr', cat: 'benin', lang: 'fr', gn: true },
  { src: 'Google Actualités Cotonou', url: 'https://news.google.com/rss/search?q=Cotonou+when:1d&hl=fr&gl=BJ&ceid=BJ:fr', cat: 'benin', lang: 'fr', gn: true }
];`; });

// ---- evenements supplementaires
repRe('classes', /zzdeal: \[[^\]]*\]\n\};/, function(a){ return a.replace(/\n\};$/, `,
  zzretire: ['retraite', 'retire', 'retraite', 'raccroche', 'retraites'],
  zzwin: ['champion', 'championne', 'sacre', 'sacree', 'titre', 'qualifie', 'qualifiee', 'qualification', 'elimine', 'finale', 'medaille', 'medailles', 'victoire', 'triomphe'],
  zztransfer: ['transfert', 'transfere', 'recrute', 'mercato'],
  zzhealth: ['epidemie', 'epidemies', 'virus', 'vaccin', 'vaccins', 'paludisme', 'cancer', 'traitement', 'traitements', 'pandemie', 'infection', 'infections', 'decouverte', 'rappel']
};`); });

rep('entities', "'london']);", `'london',
  'oms', 'cancer', 'diabete', 'paludisme', 'covid', 'grippe', 'hopital', 'hopitaux', 'sante', 'medecin', 'medecins', 'maladie', 'maladies', 'sida', 'vih', 'tuberculose', 'medicament', 'medicaments', 'obesite', 'sommeil',
  'jeunesse', 'dakar', 'joj', 'jojs', 'olympique', 'olympiques', 'olympic', 'tennis', 'basket', 'nba', 'athletisme', 'rugby', 'boxe', 'cyclisme', 'formule', 'verstappen', 'hamilton', 'djokovic', 'alcaraz', 'sinner', 'nadal', 'lebron', 'curry', 'wembanyama', 'ufc', 'judo', 'natation', 'marathon', 'handball', 'volley', 'golf', 'medaille', 'medailles',
  'real', 'atletico', 'dortmund', 'napoli', 'inter', 'milan', 'lyon', 'monaco', 'lille', 'nice', 'tottenham', 'newcastle', 'benfica', 'ajax', 'celtic', 'galatasaray', 'ecureuil', 'equipe', 'selection',
  'benin', 'cotonou', 'parakou', 'calavi', 'ouidah', 'abomey', 'bohicon', 'natitingou', 'lokossa', 'beninois', 'beninoise', 'novo']);`);

repRe('catOf', /function catOf_\(ent, fallback\) \{[\s\S]*?\n\}\n/, function(){ return `function catOf_(ent, fallback) {
  const iC = BRK_ENTITIES.indexOf('mbappe'), iCt = BRK_ENTITIES.indexOf('senegal'), iT = BRK_ENTITIES.indexOf('openai'), iN = BRK_ENTITIES.indexOf('internet') + 1;
  const idx = ent.map(function (e) { return BRK_ENTITIES.indexOf(e); }).sort(function (a, b) { return a - b; })[0];
  if (idx === undefined) return fallback;
  if (idx < iC) return 'crypto';
  if (idx < iCt) return 'sport';
  if (['finance', 'monde', 'politique', 'afrique', 'actu', 'autresport', 'sante', 'benin'].indexOf(fallback) >= 0) return fallback;
  if (idx >= iN) return fallback;
  return idx < iT ? 'sport' : 'tech';
}
`; });

// ---- flux Google Actualites : source reelle de chaque article
rep('gn items', "out.push({ src: f.src, lang: f.lang, cat: f.cat, title: strip_(childText_(it, 'title')), link: childText_(it, 'link').trim(), desc: strip_(childText_(it, 'description')), date: d });",
`let ttl = strip_(childText_(it, 'title')), srcName = f.src, dsc = strip_(childText_(it, 'description'));
    if (f.gn) { const k = ttl.lastIndexOf(' - '); const sn = childText_(it, 'source') || (k > 0 ? ttl.slice(k + 3) : ''); if (k > 0) ttl = ttl.slice(0, k); if (sn) srcName = sn.trim(); dsc = ''; }
    out.push({ src: srcName, lang: f.lang, cat: f.cat, title: ttl, link: childText_(it, 'link').trim(), desc: dsc, date: d });`);

// ---- pas d'alerte la nuit, fenetre de doublons allongee
rep('night guard', "const now = new Date();\n  const log = JSON.parse(p.getProperty('BRK_LOG')", "const now = new Date();\n  const hh = Number(Utilities.formatDate(now, TZ, 'H'));\n  if (!dry && (hh < 6 || hh >= 23)) return;\n  const log = JSON.parse(p.getProperty('BRK_LOG')");
rep('seen window', "now - x.t < 12 * 3600000", "now - x.t < 36 * 3600000");

// ---- urgence : affiche rouge
rep('urgent', "const text = brkText_(cat, main, s.group);", `const urgentEv = ['zzdeath', 'zzterror', 'zzwar', 'zzcoup', 'zzdisaster', 'zzhack'];
  const urgent = s.srcCount >= 5 || (s.srcCount >= 3 && [s.c].concat(s.group).some(function (x) { return x.ev.some(function (e) { return urgentEv.indexOf(e) >= 0; }); }));
  let text = brkText_(cat, main, s.group);
  if (urgent) text = text.replace(BRK_LABELS[cat], 'URGENT ' + BRK_LABELS[cat].replace('ALERTE ', ''));
  const poster = urgent ? BRK_RAW + 'BRK-rouge-' + cat + '.png' : BRK_POSTERS[cat];`);
t = t.split('BRK_POSTERS[cat]').join('poster').replace("const poster = urgent ? BRK_RAW + 'BRK-rouge-' + cat + '.png' : poster;", "const poster = urgent ? BRK_RAW + 'BRK-rouge-' + cat + '.png' : BRK_POSTERS[cat];");
log.push('poster uses ok');
rep('gap', "if (log.length && now - log[log.length - 1] < gap * 60000) return;", "if (log.length && !urgent && now - log[log.length - 1] < gap * 60000) return;");

// ---- redaction riche des alertes
repRe('brkText', /function brkText_\([\s\S]*?\n\}\n/, function(){ return String.raw`const BRK_ASK = {
  crypto: ['Tu en penses quoi, opportunité ou danger ? Dis le en commentaire.', 'Cela change quoi pour toi, concrètement ? Écris ton avis.', 'Tu y crois ou pas ? Donne ton avis en commentaire.'],
  sport: ['Ton avis sur cette info ? Dis le en commentaire, on lit tout.', 'Tu avais vu venir cette nouvelle ? Raconte.', 'Qui a raison dans cette histoire ? Réponds en un mot.'],
  autresport: ['Quel exploit t\'a le plus marqué cette semaine ? Dis le en commentaire.', 'Tu suis ce sport ? Dis nous pourquoi il mérite plus de place.', 'Une performance qui donne envie de se lancer. Et toi ?'],
  sante: ['Tu connaissais cette information ? Partage la avec un proche.', 'Qu\'est ce que tu changes dans ton quotidien après avoir lu cela ? Dis le nous.', 'Connais tu quelqu\'un concerné ? Partage ce post avec lui.'],
  benin: ['Tu es au Bénin ou tu as des proches là bas ? Dis nous ce que tu en penses.', 'Cette information te concerne directement ? Réagis en commentaire.', 'Qu\'en pensent les Béninois autour de toi ? Partage ton avis.'],
  afrique: ['Cette info te concerne ou concerne ta famille ? Dis le en commentaire.', 'Qu\'est ce qui t\'a le plus surpris ici ? Écris ton avis.', 'Que faut il faire à ton avis ? Réponds en commentaire.'],
  monde: ['Que penses tu de cette situation ? Dis le en commentaire, avec respect.', 'Cela peut il toucher notre région ? Donne ton avis.', 'Ce qui se passe loin de nous nous concerne aussi. Ton avis ?'],
  politique: ['Ton avis, en toute courtoisie, en commentaire.', 'Cette décision te semble elle juste ? Écris pourquoi.', 'Qu\'est ce que cela change pour les citoyens ? Dis le nous.'],
  finance: ['Cela peut changer ton budget. Qu\'en penses tu ? Dis le en commentaire.', 'Tu avais anticipé cette évolution ? Raconte.', 'Pour toi, bonne ou mauvaise nouvelle ? Réponds en un mot.'],
  tech: ['Tu utiliserais cela dans ton quotidien ? Dis le en commentaire.', 'Cela t\'aide ou te fait peur ? Réponds en commentaire.', 'Tu en penses quoi ? Écris ton avis.'],
  actu: ['Qu\'en penses tu ? Dis le en commentaire.', 'Cette info te surprend ? Réponds en un mot.', 'Tu veux qu\'on creuse le sujet ? Écris oui en commentaire.']
};
function brkAsk_(cat) { const a = BRK_ASK[cat] || BRK_ASK.actu; return a[new Date().getMinutes() % a.length]; }
function chapoOf_(x) { return cut_(noDash_(String(x.desc || '').replace(/(L'article|Cet article|The post|Le post).{0,200}(apparu en premier sur|appeared first on).*$/i, '')), 420); }

function brkText_(cat, main, group) {
  const names = [main.src];
  group.forEach(function (g) { if (names.indexOf(g.src) < 0) names.push(g.src); });
  const srcs = names.length > 1 ? names.slice(0, -1).join(', ') + ' et ' + names[names.length - 1] : names[0];
  const title = noDash_(main.title);
  const chapo = chapoOf_(main);
  const g = gemini_('Tu es le rédacteur de la Page Facebook WILACTU, qui couvre toute l\'actualité : Bénin et Afrique, monde, économie, politique, sport, football, santé, crypto, numérique. Rédige en français un post Facebook riche sur cette information : une accroche forte sur sa propre ligne, 3 à 5 phrases de contexte clair et concret, une phrase sur ce que cela change pour les lecteurs, puis une question qui invite à commenter. Entre 90 et 150 mots. Pas d\'emoji, pas de tiret, rien d\'inventé : uniquement des faits présents dans les extraits. Commence par ' + BRK_LABELS[cat] + ' sur sa propre ligne. Termine par les sources : ' + srcs + '. Extraits : ' + [main].concat(group).map(function (x) { return x.title + '. ' + String(x.desc || '').slice(0, 400); }).join(' | '));
  if (g) return noDashBlock_(g) + '\n\n#WILACTU ' + BRK_TAGS[cat];
  const extra = group.filter(function (x) { return x.desc && x.src !== main.src; }).slice(0, 2).map(function (x) { return 'Selon ' + x.src + ' : ' + cut_(noDash_(String(x.desc).replace(/<[^>]+>/g, '')), 220); });
  const ctx = (!chapo && !extra.length && names.length > 1) ? 'L\'information est reprise par ' + srcs + '.\n\n' : '';
  return BRK_LABELS[cat] + '\n\n' + title + '\n\n' + (chapo && chapo !== title ? chapo + '\n\n' : '') + (extra.length ? extra.join('\n\n') + '\n\n' : '') + ctx + 'Sources : ' + srcs + '.\n\n' + brkAsk_(cat) + '\n\n#WILACTU ' + BRK_TAGS[cat];
}
`; });

// ---- Jour J riche : "Le point ..." (6 posts par jour, 3 en direct)
rep('genJourJ', "function genJourJ_(r) {\n  const pilier = String(r[4]);", "function genJourJ_(r) {\n  const pilier = String(r[4]);\n  const jk = jjKey_(pilier);\n  if (jk) return jjText_(jk);");
rep('autoOk', "(r[C.MODE] === 'Rédigé' || r[C.MODE] === 'Alerte'))", "(r[C.MODE] === 'Rédigé' || r[C.MODE] === 'Alerte' || r[C.MODE] === 'Jour J'))");

t = t + String.raw`

// ===================================================================
// Posts du jour riches (ajoute le 2026-11-09) : "Le point foot", "Le point sport", etc.
// ===================================================================
const JJ_FEEDS = {
  foot: [
    { src: 'RMC Sport', url: 'https://rmcsport.bfmtv.com/rss/football', lang: 'fr' },
    { src: 'Sports.fr', url: 'https://www.sports.fr/feed', lang: 'fr' },
    { src: 'Foot Mercato', url: 'https://www.footmercato.net/flux-rss', lang: 'fr' },
    { src: 'Africa Top Sports', url: 'https://www.africatopsports.com/feed/', lang: 'fr' },
    { src: 'RFI Sports', url: 'https://www.rfi.fr/fr/sports/rss', lang: 'fr' }
  ],
  sport: [
    { src: 'RFI Sports', url: 'https://www.rfi.fr/fr/sports/rss', lang: 'fr' },
    { src: 'RMC Basket', url: 'https://rmcsport.bfmtv.com/rss/basket', lang: 'fr' },
    { src: 'RMC Athlétisme', url: 'https://rmcsport.bfmtv.com/rss/athletisme', lang: 'fr' },
    { src: 'RMC Tennis', url: 'https://rmcsport.bfmtv.com/rss/tennis', lang: 'fr' },
    { src: 'Google Actualités', url: 'https://news.google.com/rss/search?q=Jeux+Olympiques+de+la+Jeunesse+Dakar+when:1d&hl=fr&gl=BJ&ceid=BJ:fr', lang: 'fr', gn: true }
  ],
  sante: [
    { src: 'Le Monde', url: 'https://www.lemonde.fr/sante/rss_full.xml', lang: 'fr' },
    { src: 'Franceinfo', url: 'https://www.francetvinfo.fr/sante.rss', lang: 'fr' },
    { src: 'Santé Magazine', url: 'https://www.santemagazine.fr/rss', lang: 'fr' }
  ],
  economie: [
    { src: 'RFI', url: 'https://www.rfi.fr/fr/economie/rss', lang: 'fr' },
    { src: 'France 24', url: 'https://www.france24.com/fr/economie/rss', lang: 'fr' },
    { src: 'Le Monde', url: 'https://www.lemonde.fr/economie/rss_full.xml', lang: 'fr' }
  ],
  tech: [
    { src: 'Numerama', url: 'https://www.numerama.com/feed/', lang: 'fr' },
    { src: 'Le Monde Pixels', url: 'https://www.lemonde.fr/pixels/rss_full.xml', lang: 'fr' },
    { src: 'Franceinfo', url: 'https://www.francetvinfo.fr/titres.rss', lang: 'fr' }
  ],
  culture: [
    { src: 'Le Monde', url: 'https://www.lemonde.fr/culture/rss_full.xml', lang: 'fr' },
    { src: 'RFI', url: 'https://www.rfi.fr/fr/culture/rss', lang: 'fr' },
    { src: 'France 24', url: 'https://www.france24.com/fr/culture/rss', lang: 'fr' }
  ],
  sciences: [
    { src: 'Le Monde', url: 'https://www.lemonde.fr/sciences/rss_full.xml', lang: 'fr' },
    { src: 'RFI', url: 'https://www.rfi.fr/fr/sciences/rss', lang: 'fr' },
    { src: 'Futura Sciences', url: 'https://www.futura-sciences.com/rss/actualites.xml', lang: 'fr' }
  ],
  benin: [
    { src: 'La Nouvelle Tribune', url: 'https://lanouvelletribune.info/feed', lang: 'fr' },
    { src: 'Matin Libre', url: 'https://matinlibre.com/feed', lang: 'fr' },
    { src: 'Fraternité', url: 'https://www.fraternitebj.info/feed', lang: 'fr' },
    { src: 'Google Actualités', url: 'https://news.google.com/rss/search?q=B%C3%A9nin+when:1d&hl=fr&gl=BJ&ceid=BJ:fr', lang: 'fr', gn: true },
    { src: 'Google Actualités', url: 'https://news.google.com/rss/search?q=Cotonou+when:1d&hl=fr&gl=BJ&ceid=BJ:fr', lang: 'fr', gn: true },
    { src: 'RFI Afrique', url: 'https://www.rfi.fr/fr/afrique/rss', lang: 'fr' },
    { src: 'France 24 Afrique', url: 'https://www.france24.com/fr/afrique/rss', lang: 'fr' }
  ]
};
const JJ_MAP = { 'Le point foot': 'foot', 'Le point sport': 'sport', 'Le point santé': 'sante', 'Le point économie': 'economie', 'Le point tech': 'tech', 'Le point culture': 'culture', 'Le point sciences': 'sciences', 'Le point Bénin': 'benin' };
const JJ_TAG = { foot: '#Football', sport: '#Sport', sante: '#Santé', economie: '#Économie', tech: '#Numérique', culture: '#Culture', sciences: '#Sciences', benin: '#Bénin' };
const JJ_N = { foot: 3, sport: 3, sante: 2, economie: 3, tech: 3, culture: 3, sciences: 2, benin: 3 };
const JJ_HOOKS = {
  foot: ['Le football ne dort jamais, et voici ce qui fait parler les supporters.', 'Résultats, polémiques, coulisses : l\'essentiel du football du moment.', 'Trois informations que tous les supporters vont commenter aujourd\'hui.', 'Si tu ne devais retenir que trois infos football, ce seraient celles là.', 'Le point foot, sans blabla et sans langue de bois.'],
  sport: ['Le sport, ce n\'est pas que le football : voici ce qui se passe ailleurs.', 'Records, médailles, exploits : le point sur les autres sports.', 'Pendant que tout le monde parle foot, d\'autres athlètes écrivent l\'histoire.', 'Les Jeux de la Jeunesse à Dakar et le sport mondial : les infos à connaître.', 'Trois histoires de sport qui méritent ton attention aujourd\'hui.'],
  sante: ['Ta santé mérite que tu t\'y intéresses avant d\'être malade. Voici le point du jour.', 'Une information santé que tu peux utiliser dès aujourd\'hui.', 'Prévenir coûte moins cher que soigner : les nouvelles santé à retenir.', 'Ce que disent les chercheurs et les médecins cette semaine.', 'Le point santé, expliqué simplement.'],
  economie: ['Ton argent, ton travail, tes achats : ce qui bouge dans l\'économie.', 'Trois informations économiques qui peuvent changer ton budget.', 'L\'économie expliquée simplement : voici les faits du moment.', 'Ce que les marchés, les entreprises et les États nous annoncent.', 'Le point économie : ce qu\'il faut savoir avant de dépenser.'],
  tech: ['Le numérique change vite. Voici ce qu\'il faut retenir aujourd\'hui.', 'Intelligence artificielle, téléphones, sécurité : le point du jour.', 'Trois nouvelles tech qui peuvent changer ton quotidien.', 'Ce que le numérique nous prépare, sans jargon.', 'Le point tech, en langage clair.'],
  culture: ['Musique, cinéma, livres : ce que la culture nous raconte aujourd\'hui.', 'La culture, c\'est ce qui nous rassemble. Voici les nouvelles du moment.', 'Trois informations culturelles à partager avec tes proches.', 'Ce qui se joue, se lit et se regarde en ce moment.', 'Le point culture du jour.'],
  sciences: ['La science avance, et voici ce qu\'elle vient de découvrir.', 'Découvertes, climat, espace : le point sciences.', 'Ce que les chercheurs viennent d\'annoncer, expliqué simplement.', 'Une découverte qui pourrait changer beaucoup de choses.', 'Le point sciences du jour.'],
  benin: ['Ce qui se passe au Bénin et dans la région, en trois informations.', 'L\'actualité du Bénin à retenir aujourd\'hui, sans superficialité.', 'Le Bénin en continu : les informations qui comptent maintenant.', 'Ce que les Béninois et leurs voisins se racontent aujourd\'hui.', 'Le point Bénin, avec les faits et les sources.']
};
const JJ_ASK = {
  foot: ['Laquelle de ces infos te fait réagir le plus ? Dis le en commentaire.', 'Ton avis sur ces nouvelles ? Réponds en commentaire.'],
  sport: ['Quel sport devrait avoir plus de place dans les médias ? Dis le nous.', 'Quel exploit t\'a le plus marqué ? Écris le en commentaire.'],
  sante: ['Quel conseil vas tu appliquer dès aujourd\'hui ? Dis le en commentaire.', 'Partage ce post avec quelqu\'un qui en a besoin.'],
  economie: ['Quelle information va changer ta façon de dépenser ? Réponds en commentaire.', 'Bonne ou mauvaise nouvelle pour toi ? Dis le nous.'],
  tech: ['Quelle nouveauté tu voudrais essayer en premier ? Écris le en commentaire.', 'Cela t\'aide ou te fait peur ? Réponds en commentaire.'],
  culture: ['Quelle information culturelle veux tu qu\'on creuse ? Dis le nous.', 'Qu\'est ce que tu vas regarder, lire ou écouter ce soir ? Raconte.'],
  sciences: ['Quelle découverte te surprend le plus ? Dis le en commentaire.', 'Tu veux qu\'on explique un de ces sujets en détail ? Écris oui.'],
  benin: ['Laquelle de ces informations te concerne le plus ? Dis le en commentaire.', 'Qu\'en pensent les gens autour de toi ? Partage ton avis.']
};
function jjKey_(pilier) {
  const ks = Object.keys(JJ_MAP);
  for (let i = 0; i < ks.length; i++) { if (pilier.indexOf(ks[i]) === 0) return JJ_MAP[ks[i]]; }
  return '';
}
function jjTokens_(s) {
  return noAcc_(String(s)).toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(function (w) { return w.length > 3; });
}
function jjSame_(a, b) {
  const A = jjTokens_(a), B = jjTokens_(b);
  if (!A.length || !B.length) return false;
  const inter = A.filter(function (w) { return B.indexOf(w) >= 0; }).length;
  return inter / Math.min(A.length, B.length) >= 0.5;
}
function jjCollect_(key) {
  const feeds = JJ_FEEDS[key];
  const reqs = feeds.map(function (f) { return { url: f.url, muteHttpExceptions: true, followRedirects: true, headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WILACTU)' } }; });
  let resps = [];
  try { resps = UrlFetchApp.fetchAll(reqs); } catch (e) {}
  const now = new Date();
  let items = [];
  feeds.forEach(function (f, k) {
    try { if (resps[k]) items = items.concat(feedItems_(f, resps[k])); } catch (e) {}
  });
  items = items.filter(function (i) { return i.title && now - i.date < 30 * 3600000 && now - i.date > -600000; });
  if (key === 'benin') {
    const re = /(benin|bénin|cotonou|parakou|porto novo|porto-novo|calavi|ouidah|abomey|bohicon|natitingou|lokossa|wadagni|talon|béninois|beninois)/i;
    const loc = items.filter(function (i) { return re.test(i.title + ' ' + i.desc); });
    const oth = items.filter(function (i) { return !re.test(i.title + ' ' + i.desc); });
    loc.sort(function (a, b) { return b.date - a.date; });
    oth.sort(function (a, b) { return b.date - a.date; });
    items = loc.concat(oth.slice(0, 6));
  } else {
    items.sort(function (a, b) { return b.date - a.date; });
  }
  return items;
}
function jjPick_(key, items) {
  const p = props_();
  const now = new Date();
  const seen = JSON.parse(p.getProperty('JJ_SEEN') || '[]').filter(function (x) { return now - x.t < 5 * 24 * 3600000; });
  const out = [];
  items.forEach(function (i) {
    if (out.length >= JJ_N[key]) return;
    const title = noDash_(i.title);
    if (seen.some(function (x) { return jjSame_(x.k, title); })) return;
    if (out.some(function (o) { return jjSame_(o.title, title); })) return;
    out.push({ title: title, desc: chapoOf_(i), src: i.src, link: i.link });
  });
  return { out: out, seen: seen };
}
function jjText_(key, noSave) {
  const items = jjCollect_(key);
  const pk = jjPick_(key, items);
  const out = pk.out;
  if (out.length < 2) return '';
  const d = new Date();
  const day = Math.floor(d.getTime() / 86400000);
  const hooks = JJ_HOOKS[key], asks = JJ_ASK[key];
  const body = out.map(function (x, i) { return (i + 1) + '. ' + x.title + (x.desc && x.desc !== x.title ? '\n' + x.desc : ''); }).join('\n\n');
  const srcs = out.map(function (x) { return x.src; }).filter(function (s, k, a) { return a.indexOf(s) === k; });
  const srcTxt = srcs.length > 1 ? srcs.slice(0, -1).join(', ') + ' et ' + srcs[srcs.length - 1] : srcs[0];
  const text = hooks[day % hooks.length] + '\n\n' + body + '\n\nSources : ' + srcTxt + '.\n\n' + asks[day % asks.length] + '\n\n#WILACTU ' + JJ_TAG[key];
  if (!noSave) {
    const seen = pk.seen;
    out.forEach(function (x) { seen.push({ t: d.getTime(), k: x.title }); });
    props_().setProperty('JJ_SEEN', JSON.stringify(seen.slice(-120)));
  }
  return text;
}
// Test : envoie par mail un exemple de chaque "Le point ..." sans rien publier.
function testJJ() {
  let msg = '';
  Object.keys(JJ_FEEDS).forEach(function (k) { msg += '===== ' + k + ' =====\n' + (jjText_(k, true) || '(aucun texte : pas assez de nouvelles)') + '\n\n'; });
  alert_('Test des posts Le point', msg);
}
`;

let syntax = 'ok';
try { new Function(t); } catch (e) { syntax = 'SYNTAX ' + e.message; }
window.__patched2 = t;
return log.join(' | ') + ' || ' + syntax + ' || len ' + t.length;
})()
