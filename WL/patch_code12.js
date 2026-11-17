// ===================================================================
// Fonds etendus (2026-11-18) : trophees par competition, bibliotheque elargie, point du jour varie
// A coller en FIN de fichier (les fonctions declarees plus bas remplacent les precedentes)
// ===================================================================
const PV_TR = [
  [/ligue des champions|champions league|\bldc\b|finale de la ligue des champions/, ['tr_ldc']],
  [/ligue europa|europa league|conference league/, ['tr_europa']],
  [/ballon d.or|golden ball|the best fifa/, ['tr_ballon']],
  [/premier league/, ['tr_epl']],
  [/liga\b|la liga|clasico|supercoupe d.espagne/, ['tr_liga']],
  [/ceinture|champion du monde de boxe|unification|wbc|wba|ibf|wbo/, ['tr_boxe']],
  [/nobel|prix litteraire|goncourt|booker|prix de la paix/, ['tr_nobel']],
  [/coupe du monde|mondial|eliminatoires du mondial|mondial 20|fifa world/, ['tr_mondial']],
  [/grand prix|podium|champion du monde de f1|formule 1/, ['tr_f1']]
];
const PV_RULES2 = [
  [/stade de l.amitie|stade mathieu|kerekou|stade de cotonou/, ['benin_stade']],
  [/bio guera|bio guerra|nikki|borgou|statue equestre|rond.point/, ['benin_bioguera']],
  [/place des martyrs|martyrs/, ['benin_martyrs']],
  [/cathedrale|eglise|messe|catholique/, ['benin_cathedrale']],
  [/nokoue|lagune/, ['benin_nokoue']],
  [/vodoun|vaudou|ouidah|zangbeto|tradition/, ['benin_vodoun']],
  [/tata somba|natitingou|atacora/, ['benin_tata']],
  [/pendjari|parc national|faune|elephant/, ['benin_pendjari2']],
  [/chutes|cascade|kota/, ['benin_kota']],
  [/parakou/, ['benin_parakou']],
  [/port de cotonou|port autonome|conteneur/, ['benin_port']],
  [/zangbeto|masque/, ['benin_zangbeto']],
  [/nairobi|kenya/, ['af_nairobi']],
  [/kigali|rwanda/, ['af_kigali']],
  [/addis|ethiopie/, ['af_addis']],
  [/casablanca|maroc|rabat/, ['af_casa']],
  [/caire|egypte|pyramide|egyptien/, ['af_caire']],
  [/cape town|le cap|afrique du sud/, ['af_cap']],
  [/\blome\b|\btogo\b/, ['af_lome']],
  [/libreville|gabon/, ['af_libreville']],
  [/sahara|desert|sahel/, ['af_sahara']],
  [/savane|safari|elephant|faune/, ['af_savane']],
  [/union africaine|\bua\b|cedeao|uemoa|sommet africain/, ['af_ua']],
  [/dakar|senegal|renaissance africaine|\bjoj\b|jeux olympiques de la jeunesse/, ['af_dakar2']],
  [/barca|barcelone|camp nou/, ['sp_campnou']],
  [/wembley|premier league|angleterre|manchester|liverpool|arsenal|chelsea/, ['sp_wembley']],
  [/trophee|coupe du monde|champions league cup|titre/, ['sp_trophee']],
  [/gardien|penalty/, ['sp_gardien']],
  [/attaquant|dribble|but marque|buteur/, ['sp_dribble']],
  [/\bgolf\b/, ['sp_golf']],
  [/natation|nageur|piscine/, ['sp_natation']],
  [/gymnastique|gymnaste/, ['sp_gym']],
  [/volley/, ['sp_volley']],
  [/handball/, ['sp_hand']],
  [/surf\b/, ['sp_surf']],
  [/esport|e-sport|gaming tournoi/, ['sp_esport']],
  [/supporters en liesse|celebration|fete du titre/, ['sp_foule']],
  [/bourse|actions|marches financiers|wall street/, ['ec_bourse']],
  [/banque|bceao|bad\b|fmi|banque mondiale/, ['ec_banque']],
  [/\beuro\b|euros/, ['ec_euro']],
  [/\bor\b|lingot|matieres premieres/, ['ec_or']],
  [/petrole|pétrole|opep|baril|oil/, ['ec_petrole']],
  [/solaire|energie solaire|panneaux/, ['ec_solaire']],
  [/eolien|eoliennes|energie renouvelable/, ['ec_eolien']],
  [/conteneurs|cargo|port\b|exportation|importation/, ['ec_conteneur']],
  [/usine|industrie|fabrication/, ['ec_usine']],
  [/chantier|construction|batiment|infrastructure/, ['ec_chantier']],
  [/route|autoroute|pont\b/, ['ec_route']],
  [/electricite|coupure de courant|delestage/, ['ec_pylone']],
  [/robot|humanoide/, ['te_robot']],
  [/satellite|spacex|starlink|nasa|fusee|espace/, ['te_satellite']],
  [/jeu video|jeux video|playstation|xbox|nintendo|gta/, ['te_manette']],
  [/ordinateur|pc portable|logiciel|windows/, ['te_laptop']],
  [/hopital|chu\b|clinique|urgences/, ['sa_hopital']],
  [/medicament|pharmacie|pilule|antibiotique/, ['sa_pilules']],
  [/alimentation|fruits|legumes|nutrition|regime/, ['sa_fruits']],
  [/paludisme|moustique|moustiquaire|dengue/, ['sa_moustiquaire']],
  [/\byeux\b|vue\b|ophtalmo|lunettes/, ['sa_yeux']],
  [/yoga|etirement|meditation|bien-etre/, ['sa_yoga']],
  [/\bdj\b|boite de nuit|soiree|clubbing/, ['cu_dj']],
  [/guitar|rock|groupe de musique/, ['cu_guitare']],
  [/tam-tam|djembe|percussion|rythme/, ['cu_tam']],
  [/danse|danseur|ballet|choregraphie|coupe decale/, ['cu_danse']],
  [/festival|fete de la musique|concert en plein air/, ['cu_festival']],
  [/livre\b|roman|auteur|ecrivain|bibliotheque|prix litteraire|goncourt/, ['cu_livre']],
  [/musee|exposition|galerie|peinture|artiste peintre/, ['cu_musee']],
  [/gospel|chorale|culte|eglise evangelique/, ['cu_gospel']],
  [/mariage|noces|dot\b|couple/, ['cu_mariage']],
  [/union europeenne|parlement europeen|bruxelles|\bue\b/, ['mo_ue']],
  [/kremlin|moscou|poutine|russie/, ['mo_kremlin']],
  [/paris\b|macron|elysee|france\b/, ['mo_eiffel']],
  [/londres|royaume-uni|britannique|starmer/, ['mo_bigben']],
  [/new york|statue de la liberte/, ['mo_liberty']],
  [/inondation|crue|pluies diluviennes|sinistres/, ['mo_inondation']],
  [/seisme|tremblement de terre|decombres/, ['mo_seisme']],
  [/ouragan|cyclone|tempete|typhon/, ['mo_ouragan']],
  [/tribunal|justice|proces|jugement|condamne|cour supreme|criet|cour constitutionnelle/, ['mo_tribunal']],
  [/pape|vatican|rome\b/, ['mo_pape']],
  [/mecque|hajj|pelerinage|ramadan|musulman|mosquee/, ['mo_mecque']],
  [/chine\b|pekin|shanghai|xi jinping/, ['mo_chine']],
  [/\binde\b|new delhi|mumbai/, ['mo_inde']],
  [/bresil|rio de janeiro|lula/, ['mo_bresil']],
  [/japon|tokyo/, ['mo_japon']],
  [/\biran\b|teheran/, ['mo_iran']],
  [/ukraine|kiev|kyiv|zelensky/, ['mo_ukraine']],
  [/diplome|remise des diplomes|licence|master|doctorat/, ['so_diplome']],
  [/eglise|culte|priere|pasteur|foi\b/, ['so_eglise']],
  [/commercante|marchande|vendeuse|petit commerce/, ['so_marchande']],
  [/street food|cuisine|plat|recette|gastronomie|restaurant|akassa|pate/, ['so_streetfood']],
  [/embouteillage|trafic|bouchon|circulation dense/, ['so_embouteillage']],
  [/puits|forage|acces a l.eau|eau potable/, ['so_puits']],
  [/bateau|navire|ferry|croisiere|naufrage/, ['so_bateau']],
  [/pont\b|viaduc/, ['so_pont']],
  [/nuit|ville la nuit|eclairage/, ['so_nuit_ville']],
  [/noel|fetes de fin d.annee|reveillon|nouvel an|cadeaux/, ['so_noel']],
  [/football de rue|jeunes talents|centre de formation|academie/, ['so_football_rue']],
  [/missebo|marche de cotonou|commerce/, ['benin_missebo']],
  [/pagne|wax|tissu|couturier|agbada/, ['benin_agbada']],
  [/bamako|\bmali\b/, ['af_bamako']],
  [/judo|riner|tatami/, ['sp_judo']],
  [/cacao|cafe\b|coton|agriculteur|recolte/, ['ec_cacao']],
  [/startup|jeune pousse|levee de fonds|entrepreneur/, ['ec_startup']],
  [/developpeur|code\b|programmation|logiciel/, ['te_code']],
  [/cybersecurite|piratage|hacker|mot de passe|fuite de donnees/, ['te_cadenas']],
  [/intelligence artificielle|\bia\b|chatgpt|openai|algorithme/, ['te_ia']],
  [/projecteur|spectacle|scene|one man show/, ['cu_projecteur']],
  [/wax|pagne|tissu|couture/, ['cu_wax']],
  [/sneakers|baskets|streetwear|chaussures/, ['cu_sneakers']],
  [/bureau de vote|electeurs|urne|scrutin|campagne electorale/, ['mo_vote']],
  [/ecoliers|rentree scolaire|eleves|enseignant|instituteur/, ['so_ecoliers']],
  [/transport|gare routiere|bus\b|taxi/, ['so_bus']],
  [/logement|immobilier|loyer|quartier|maison/, ['so_logement']],
  [/mannequin|top model|egerie|campagne de mode|shooting/, ['cu_mannequin']],
  [/defile|fashion week|haute couture|createur de mode|styliste/, ['cu_defile']]
];
const PV_BYCAT2 = { benin: ["benin_agbada", "benin_amazone", "benin_cathedrale", "benin_drapeau", "benin_ganvie", "benin_kota", "benin_marche", "benin_martyrs", "benin_missebo", "benin_nokoue", "benin_parakou", "benin_pendjari2", "benin_plage", "benin_port", "benin_porte", "benin_tata", "benin_vodoun", "benin_zangbeto", "benin_zem", "benin_zem2"], afrique: ["af_addis", "af_bamako", "af_caire", "af_cap", "af_casa", "af_dakar2", "af_kigali", "af_libreville", "af_lome", "af_nairobi", "af_sahara", "af_savane", "af_ua", "abidjan", "dakar"], monde: ["mo_bigben", "mo_bresil", "mo_chine", "mo_eiffel", "mo_inde", "mo_inondation", "mo_iran", "mo_japon", "mo_kremlin", "mo_liberty", "mo_mecque", "mo_ouragan", "mo_pape", "mo_seisme", "mo_tribunal", "mo_ue", "mo_ukraine", "mo_vote", "monde_terre", "monde_onu"], politique: ["mo_tribunal", "mo_ue", "mo_vote", "monde_onu", "politique", "vote"], finance: ["ec_banque", "ec_bourse", "ec_cacao", "ec_chantier", "ec_conteneur", "ec_eolien", "ec_euro", "ec_or", "ec_petrole", "ec_pylone", "ec_route", "ec_solaire", "ec_startup", "ec_usine", "finance"], crypto: ["crypto"], tech: ["te_cadenas", "te_code", "te_ia", "te_laptop", "te_manette", "te_robot", "te_satellite", "tech_data", "tech_phone", "telecom"], sante: ["sa_fruits", "sa_hopital", "sa_moustiquaire", "sa_pilules", "sa_yeux", "sa_yoga", "sante"], sport: ["benin_stade", "foot_bernabeu", "foot_fans1", "foot_fans2", "sp_campnou", "sp_dribble", "sp_foule", "sp_gardien", "sp_trophee", "sp_wembley"], autresport: ["sp_esport", "sp_golf", "sp_gym", "sp_hand", "sp_judo", "sp_natation", "sp_surf", "sp_volley", "athle", "cyclisme", "boxe", "tennis", "basket", "rugby", "motogp", "f1"], culture: ["cu_danse", "cu_defile", "cu_dj", "cu_festival", "cu_gospel", "cu_guitare", "cu_livre", "cu_mannequin", "cu_mariage", "cu_musee", "cu_projecteur", "cu_sneakers", "cu_tam", "cu_wax", "culture_concert", "culture_mode", "cinema"], actu: ["so_bateau", "so_bus", "so_diplome", "so_ecoliers", "so_eglise", "so_embouteillage", "so_football_rue", "so_logement", "so_marchande", "so_noel", "so_nuit_ville", "so_pont", "so_puits", "so_streetfood"] };
const PV_JJ2 = { foot: ["benin_stade", "foot_bernabeu", "foot_fans1", "foot_fans2", "sp_campnou", "sp_dribble", "sp_foule", "sp_gardien", "sp_trophee", "sp_wembley"], sport: ["sp_esport", "sp_golf", "sp_gym", "sp_hand", "sp_judo", "sp_natation", "sp_surf", "sp_volley", "athle", "cyclisme", "boxe", "tennis", "basket", "rugby", "motogp", "f1"], sante: ["sa_fruits", "sa_hopital", "sa_moustiquaire", "sa_pilules", "sa_yeux", "sa_yoga", "sante"], economie: ["ec_banque", "ec_bourse", "ec_cacao", "ec_chantier", "ec_conteneur", "ec_eolien", "ec_euro", "ec_or", "ec_petrole", "ec_pylone", "ec_route", "ec_solaire", "ec_startup", "ec_usine", "finance", "crypto"], tech: ["te_cadenas", "te_code", "te_ia", "te_laptop", "te_manette", "te_robot", "te_satellite", "tech_data", "tech_phone", "telecom"], culture: ["cu_danse", "cu_defile", "cu_dj", "cu_festival", "cu_gospel", "cu_guitare", "cu_livre", "cu_mannequin", "cu_mariage", "cu_musee", "cu_projecteur", "cu_sneakers", "cu_tam", "cu_wax", "culture_concert", "culture_mode", "cinema"], sciences: ["monde_terre", "te_satellite", "te_robot", "te_ia", "tech_data", "sa_pilules", "sa_hopital"], benin: ["benin_agbada", "benin_amazone", "benin_cathedrale", "benin_drapeau", "benin_ganvie", "benin_kota", "benin_marche", "benin_martyrs", "benin_missebo", "benin_nokoue", "benin_parakou", "benin_pendjari2", "benin_plage", "benin_port", "benin_porte", "benin_tata", "benin_vodoun", "benin_zangbeto", "benin_zem", "benin_zem2"], beninfoot: ["benin_stade", "foot_fans1", "foot_fans2", "sp_foule", "sp_dribble"], monde: ["mo_bigben", "mo_bresil", "mo_chine", "mo_eiffel", "mo_inde", "mo_inondation", "mo_iran", "mo_japon", "mo_kremlin", "mo_liberty", "mo_mecque", "mo_ouragan", "mo_pape", "mo_seisme", "mo_tribunal", "mo_ue", "mo_ukraine", "mo_vote", "monde_terre", "monde_onu"], societe: ["so_bateau", "so_bus", "so_diplome", "so_ecoliers", "so_eglise", "so_embouteillage", "so_football_rue", "so_logement", "so_marchande", "so_noel", "so_nuit_ville", "so_pont", "so_puits", "so_streetfood"], afrique: ["af_addis", "af_bamako", "af_caire", "af_cap", "af_casa", "af_dakar2", "af_kigali", "af_libreville", "af_lome", "af_nairobi", "af_sahara", "af_savane", "af_ua", "abidjan", "dakar"] };
function pvBgKey_(cat, text) {
  const t = radNorm_(text), seed = String(text).length;
  if (/nobel/.test(t)) return 'tr_nobel';
  if (cat === 'sport' || cat === 'autresport' || cat === 'culture') for (let i = 0; i < PV_TR.length; i++) if (PV_TR[i][0].test(t)) return pvPick_(PV_TR[i][1], seed);
  const foot = [];
  for (let i = 0; i < PV_RULES.length; i++) {
    if (PV_RULES[i][1][0] === 'foot_fans1') { foot.push(PV_RULES[i]); continue; }
    if (PV_RULES[i][0].test(t)) return pvPick_(PV_RULES[i][1], seed);
  }
  for (let i = 0; i < PV_RULES2.length; i++) if (PV_RULES2[i][0].test(t)) return pvPick_(PV_RULES2[i][1], seed);
  for (let i = 0; i < foot.length; i++) if (foot[i][0].test(t)) return pvPick_(PV_BYCAT2.sport, seed);
  const l = PV_BYCAT2[cat] || PV_BYCAT[cat];
  return l && l.length ? pvPick_(l, seed) : '';
}
function jjPosterFor_(r) {
  const key = jjKey_(String(r[4]));
  if (!key || !JJ_LAST || JJ_LAST.key !== key) return '';
  const word = { foot: 'FOOT', sport: 'SPORT', sante: 'SANTÉ', economie: 'ÉCONOMIE', tech: 'TECH', culture: 'CULTURE', sciences: 'SCIENCES', benin: 'BÉNIN', beninfoot: 'BÉNINOIS', monde: 'MONDE', societe: 'SOCIÉTÉ', afrique: 'AFRIQUE' }[key] || 'ACTU';
  const pts = JJ_LAST.titles.slice(0, 3).map(function (x) { return cut_(noDash_(x), 90); });
  while (pts.length < 3) pts.push('Retrouve le détail dans le post');
  const list = PV_JJ2[key] || PV_JJ[key] || [];
  const seed = Number(Utilities.formatDate(new Date(), TZ, 'D')) * 7 + Number(Utilities.formatDate(new Date(), TZ, 'H'));
  const bg = list.length ? pvBg_(pvPick_(list, seed)) : null;
  return posterV2_({ mode: 'D', urgent: false, tag: 'LE POINT DU JOUR', head: 'LE POINT ' + word, list: pts, photo: bg ? bg.blob : null, credit: bg ? bg.credit : '', foot: pvFoot_() });
}
