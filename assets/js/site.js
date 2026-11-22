/* joostvandebrake.com
   Site data, page templates, language switch, and menu. Loaded by the home
   page and by every page directory. Each document says which page it is on
   <body data-page="...">. */
/* LANG HELPERS */
let lang = 'en';
function T(en, nl){ return lang === 'nl' ? nl : en; }
function L(item, field){ return (lang === 'nl' && item && item.nl && item.nl[field] !== undefined) ? item.nl[field] : item[field]; }

/* Reads ?lang=nl from the address bar. Previously the site advertised
   /?lang=nl to search engines as its Dutch page but always rendered English. */
function langFromUrl(){
  return new URLSearchParams(location.search).get('lang') === 'nl' ? 'nl' : 'en';
}

/* Carries the language over to an internal path while Dutch is active. */
function U(path){
  if (lang !== 'nl') return path;
  return path + (path.indexOf('?') === -1 ? '?' : '&') + 'lang=nl';
}

function setLang(l, updateUrl){
  lang = l;
  document.documentElement.lang = l;
  document.getElementById('lb-en').classList.toggle('on', l === 'en');
  document.getElementById('lb-nl').classList.toggle('on', l === 'nl');
  document.getElementById('lb-en').setAttribute('aria-pressed', String(l === 'en'));
  document.getElementById('lb-nl').setAttribute('aria-pressed', String(l === 'nl'));
  document.getElementById('nav-toggle-label').textContent = T('Menu', 'Menu');
  document.getElementById('skip-link').textContent = T('Skip to content', 'Ga naar de inhoud');
  document.getElementById('logo-sub').textContent = T('Associate Professor and Research Director, University of Groningen', 'Universitair hoofddocent en onderzoeksdirecteur, Rijksuniversiteit Groningen');
  document.getElementById('n-research').textContent = T('Research', 'Onderzoek');
  document.getElementById('n-teaching').textContent = T('Teaching', 'Onderwijs');
  document.getElementById('n-practice').textContent = T('Working with organisations', 'Samenwerking met de praktijk');
  document.getElementById('n-resources').textContent = T('Resources', 'Materiaal');
  document.getElementById('n-contact').textContent  = T('Contact', 'Contact');
  document.getElementById('ft-copy').textContent = T('© 2026 Joost van de Brake', '© 2026 Joost van de Brake');
  document.getElementById('ft-ug').textContent = T('UG profile', 'RUG-profiel');
  document.querySelectorAll('[data-path]').forEach(a => a.setAttribute('href', U(a.dataset.path)));
  if (updateUrl !== false) {
    const u = new URL(location.href);
    if (l === 'nl') u.searchParams.set('lang', 'nl');
    else u.searchParams.delete('lang');
    history.replaceState(history.state, '', u);
  }
  renderPage(curPage);
}

/* DATA */

/* Selected peer-reviewed record, newest first. Metadata verified against
   Crossref on 2026-11-22. `feat` marks the three shown on the home page. */
const PUBS = [
  {feat:1,
   title:'Juggling hats and ladders: A social identity and social status framework for multiple team membership',
   auth:'Van de Brake, H. J.',
   venue:'Group and Organization Management', year:'2026', doi:'10.1177/10596011261486495',
   note:'Published online 11 September 2026, open access', nl:{note:'Online gepubliceerd op 11 september 2026, open access'}},

  {feat:1,
   title:'The connectivity paradox of flexible team arrangements',
   auth:'Berger, S., Van de Brake, H. J., Bruch, H., and Van der Vegt, G. S.',
   venue:'Academy of Management Journal', year:'2026', doi:'10.5465/amj.2023.0869', video:'/video/connectivity-paradox/',
   note:'Published online 21 August 2026', nl:{note:'Online gepubliceerd op 21 augustus 2026'}},

  {title:'Crossover of emotional exhaustion in collaboration networks: The roles of hindrance stressors and organisational tenure',
   auth:'Wörtler, B., Van de Brake, H. J., and Van der Vegt, G. S.',
   venue:'Work and Stress, 40(2), 125 to 154', year:'2026', doi:'10.1080/02678373.2025.2551498'},

  {title:'More hats than hours? Examining the associations between role sequence patterns, well-being, demographics and work-related characteristics across two countries',
   auth:'Paryono, H. Y., De Vries, T. A., De Bloom, J., and Van de Brake, H. J.',
   venue:'Journal of Occupational and Organizational Psychology, 99(3), e70146', year:'2026', doi:'10.1111/joop.70146', video:'/video/more-hats/'},

  {title:'The duality of multiple roles: Examining the moderating effects of role occurrence proximity',
   auth:'Paryono, H. Y., Van de Brake, H. J., De Bloom, J., and De Vries, T. A.',
   venue:'Occupational Health Science, 10(1), 5', year:'2026', doi:'10.1007/s41542-026-00253-6'},

  {title:'When (and when not) remote work harms employee productivity: A multilevel perspective',
   auth:'Berger, S., Van de Brake, H. J., Fastje, F., and Van der Vegt, G. S.',
   venue:'Academy of Management Proceedings, 2025(1), 12164', year:'2025', doi:'10.5465/AMPROC.2025.329bp',
   note:'Best Paper Award, OB Division, Academy of Management',
   nl:{note:'Best Paper Award, OB Division, Academy of Management'}},

  {feat:1,
   title:'More than just a number: Different conceptualizations of multiple team membership and their relationships with emotional exhaustion and turnover',
   auth:'Van de Brake, H. J., Van der Vegt, G. S., and Essens, P.',
   venue:'Journal of Applied Psychology, 109(5), 714 to 729', year:'2024', doi:'10.1037/apl0001168'},

  {title:'Can I leave my hat on? A cross-level study of multiple team membership role separation',
   auth:'Van de Brake, H. J., and Berger, S.',
   venue:'Personnel Psychology, 76(1), 221 to 248', year:'2023', doi:'10.1111/peps.12495'},

  {title:'Resource leverage, resource depletion: A multilevel perspective on multiple team membership',
   auth:'Berger, S., Van de Brake, H. J., and Bruch, H.',
   venue:'Journal of Applied Psychology, 107(2), 298 to 309', year:'2022', doi:'10.1037/apl0000889'},

  {title:'Benefits and disadvantages of individuals’ multiple team membership: The moderating role of organizational tenure',
   auth:'Van de Brake, H. J., Walter, F., Rink, F. A., Essens, P., and Van der Vegt, G. S.',
   venue:'Journal of Management Studies, 57(8), 1502 to 1530', year:'2020', doi:'10.1111/joms.12539'},

  {title:'Multiple team membership and job performance: The role of employees’ information-sharing networks',
   auth:'Van de Brake, H. J., Walter, F., Rink, F. A., Essens, P., and Van der Vegt, G. S.',
   venue:'Journal of Occupational and Organizational Psychology, 93(4), 967 to 987', year:'2020', doi:'10.1111/joop.12326'},

  {title:'The impact of leader-member exchange on follower performance in light of the larger social network',
   auth:'Regts, G., Molleman, E., and Van de Brake, H. J.',
   venue:'Human Relations, 72(8), 1265 to 1291', year:'2019', doi:'10.1177/0018726718806351'},

  {title:'The dynamic relationship between multiple team membership and individual job performance in knowledge-intensive work',
   auth:'Van de Brake, H. J., Walter, F., Rink, F. A., Essens, P., and Van der Vegt, G. S.',
   venue:'Journal of Organizational Behavior, 39(9), 1219 to 1231', year:'2018', doi:'10.1002/job.2260'},

  {title:'Is multiple team membership a challenge or a hindrance for individual employees?',
   auth:'Van de Brake, H. J., Walter, F., Rink, F. A., Essens, P., and Van der Vegt, G. S.',
   venue:'Academy of Management Proceedings, 2017(1), 13366', year:'2017', doi:'10.5465/ambpp.2017.213',
   note:'Best Paper Proceedings, Academy of Management',
   nl:{note:'Best Paper Proceedings, Academy of Management'}},

  {title:'Status inconsistency in groups: How discrepancies between instrumental and expressive status result in symptoms of stress',
   auth:'Van de Brake, H. J., Grow, A., and Dijkstra, J. K.',
   venue:'Social Science Research, 64, 15 to 24', year:'2017', doi:'10.1016/j.ssresearch.2016.12.006'},
];

const GRANTS = [
  {tag:'NWO Veni', year:'2022', amount:'€280,000',
   title:'The consequences of working in multiple teams at the same time',
   body:'The Dutch Research Council (NWO) awarded me this individual Veni grant under its Talent Programme. The project examines how employees experience working in several teams at the same time and how they perform in those teams. The project also asks how organisations can design such work so that it remains sustainable.',
   nl:{title:'De gevolgen van het tegelijkertijd werken in meerdere teams',
       body:'De Nederlandse Organisatie voor Wetenschappelijk Onderzoek (NWO) kende mij deze individuele Veni-subsidie toe binnen het Talentprogramma. Het project onderzoekt hoe medewerkers het ervaren om tegelijk in meerdere teams te werken en hoe zij in die teams presteren. Daarnaast onderzoekt het project hoe organisaties dit werk zo kunnen inrichten dat het op de lange termijn houdbaar blijft.'}},
  {tag:'ZonMw', year:'2020', amount:'€200,000',
   title:'COVID-19 impact on hospital staff well-being',
   body:'I was the main applicant and principal investigator of this project, which I carried out with Maxim Laurijssen, Peter Essens, and Gerben van der Vegt. The project tracked the well-being of hospital staff during the pandemic, and its findings informed leadership training at a large Dutch general hospital.',
   nl:{title:'Impact van COVID-19 op het welzijn van ziekenhuispersoneel',
       body:'Ik was hoofdaanvrager en projectleider van dit project, dat ik samen met Maxim Laurijssen, Peter Essens en Gerben van der Vegt uitvoerde. Het project volgde het welzijn van ziekenhuispersoneel tijdens de pandemie, en de bevindingen vormden de basis voor leiderschapstraining in een groot Nederlands algemeen ziekenhuis.'}},
  {tag:'Fulbright', year:'2016', amount:'€3,000',
   title:'Visiting Scholar at Duke Network Analysis Center',
   body:'The Netherlands America Commission for Educational Exchange awarded me this exchange scholarship for joint research with Jonathon Cummings at Duke University.',
   nl:{title:'Gastonderzoeker bij het Duke Network Analysis Center',
       body:'De Nederlands-Amerikaanse Commissie voor Educatieve Uitwisseling kende mij deze uitwisselingsbeurs toe voor gezamenlijk onderzoek met Jonathon Cummings aan Duke University.'}},
];

const AWARDS = [
  {year:'2025', name:'Academy of Management Conference Best Paper Award', body:'The OB Division gave this award to our paper at the annual meeting of the Academy of Management.',
   nl:{body:'De OB Division kende deze prijs toe aan onze bijdrage aan de jaarlijkse conferentie van de Academy of Management.'}},
  {year:'2024 and 2025', name:'Academy of Management Best Reviewer Award', body:'The Academy of Management gave me this award in both years for the quality of my reviews of papers submitted to its annual meeting.',
   nl:{year:'2024 en 2025', body:'De Academy of Management kende mij deze prijs in beide jaren toe voor de kwaliteit van mijn beoordelingen van inzendingen voor haar jaarlijkse conferentie.'}},
  {year:'2022', name:'Early Career Research Award', body:'The Faculty of Economics and Business Research Institute of the University of Groningen gave me this award.',
   nl:{body:'Het FEB Research Institute van de Rijksuniversiteit Groningen kende mij deze prijs toe.'}},
  {year:'2019', name:'Journal of Organizational Behavior Best Paper Award, runner-up', body:'Our 2018 paper on multiple team membership and individual job performance was the runner-up for this award.',
   nl:{name:'Journal of Organizational Behavior Best Paper Award, tweede plaats', body:'Ons artikel uit 2018 over multiple team membership en individuele werkprestatie eindigde als tweede voor deze prijs.'}},
];

const TEACHING = [
  {role:'Course Coordinator', code:'EBB110A05', title:'Teamwork, Theories, Design, and Dynamics',
   programme:'BSc Business Administration, University of Groningen', since:'2022 to present',
   body:'This course is an introduction to work teams for future management professionals. Students learn classic and contemporary theories about how teams are composed and designed and about how team members work together. The course also covers the challenges of modern team arrangements, such as multiple team membership, virtual collaboration, and hybrid work.',
   link:'https://ocasys.rug.nl/2026-2027/catalog/course/EBB110A05',
   nl:{role:'Coördinator',
       programme:'BSc Bedrijfskunde, Rijksuniversiteit Groningen', since:'2022 tot heden',
       body:'Dit vak is een inleiding in werkteams voor toekomstige managementprofessionals. Studenten leren klassieke en hedendaagse theorieën over de samenstelling en inrichting van teams en over de manier waarop teamleden samenwerken. Daarnaast behandelt het vak de uitdagingen van moderne teamvormen, zoals multiple team membership, virtuele samenwerking en hybride werk.'}},
  {role:'Course Coordinator', title:'Executive HR Programma Duurzame Inzetbaarheid',
   programme:'University of Groningen Business School', since:'2025 to present',
   body:'This executive programme for HR professionals deals with sustainable employability and covers stress, motivation, collaboration, performance, and absenteeism.',
   link:'https://www.rug.nl/business-school/executive-programmas/hr-programma-duurzame-inzetbaarheid/',
   nl:{role:'Coördinator',
       programme:'University of Groningen Business School', since:'2025 tot heden',
       body:'Dit executive programma voor HR-professionals gaat over duurzame inzetbaarheid en behandelt stress, motivatie, samenwerking, prestaties en verzuim.'}},
  {role:'Lecturer', title:'Organizational Behavior and Change Management',
   programme:'UGBS Executive Master of Finance and Control', since:'2023 to present',
   body:'In this senior executive course, finance and control professionals who are taking on broader management roles learn how leadership shapes organisational change and how motivation and team dynamics influence that change.',
   nl:{role:'Docent',
       programme:'UGBS Executive Master of Finance and Control', since:'2023 tot heden',
       body:'In dit executive vak leren finance- en controlprofessionals die een bredere managementrol op zich nemen hoe leiderschap organisatieverandering vormgeeft en hoe motivatie en teamdynamiek die verandering beïnvloeden.'}},
  {role:'Tutor', title:'Gedrag in Organisaties',
   programme:'BSc Business Administration, University of Groningen', since:'2025 to present',
   body:'I teach tutorials for three groups on the foundations of organisational behaviour.',
   nl:{role:'Werkgroepdocent',
       programme:'BSc Bedrijfskunde, Rijksuniversiteit Groningen', since:'2025 tot heden',
       body:'Ik geef werkcolleges aan drie groepen over de grondbeginselen van organisatiegedrag.'}},
  {role:'Lecturer', title:'FEBRI Publishing Workshop for PhD Students',
   programme:'FEB Research Institute', since:'2022 to present',
   body:'In this annual workshop, FEB PhD students learn how to get their work published in management and applied psychology journals.',
   nl:{role:'Docent',
       programme:'FEB Research Institute', since:'2022 tot heden',
       body:'In deze jaarlijkse workshop leren promovendi van de FEB hoe zij hun werk gepubliceerd krijgen in tijdschriften over management en toegepaste psychologie.'}},
];

const OFFERINGS = [
  {h:'Diagnose what is going on',
   body:'I conduct employee surveys and analyse large datasets to find out what causes problems with engagement, burnout, turnover, and team performance. I then explain the findings in plain terms to HR, project controllers, and top management.',
   nl:{h:'Diagnose stellen',
       body:'Ik voer medewerkersonderzoeken uit en analyseer grote databestanden om te achterhalen wat problemen rond betrokkenheid, burn-out, verloop en teamprestaties veroorzaakt. Daarna leg ik de bevindingen in begrijpelijke taal uit aan HR, projectcontrollers en de directie.'}},
  {h:'Design and evaluate interventions',
   body:'I help organisations design experiments, pilots, and longitudinal studies that test whether a new way of working makes a difference before the organisation introduces it more widely.',
   nl:{h:'Interventies ontwerpen en evalueren',
       body:'Ik help organisaties bij het opzetten van experimenten, proefprojecten en longitudinale studies die toetsen of een nieuwe manier van werken verschil maakt voordat de organisatie die breed invoert.'}},
  {h:'Train and coach leaders',
   body:'I design workshops for team leaders, department heads, and HR professionals on the basis of research findings. I adapt each workshop to the participants’ own work so that they can apply the findings in practice.',
   nl:{h:'Leidinggevenden trainen en coachen',
       body:'Ik ontwikkel workshops voor teamleiders, afdelingshoofden en HR-professionals op basis van onderzoeksbevindingen. Ik stem elke workshop af op het werk van de deelnemers, zodat zij de bevindingen in de praktijk kunnen toepassen.'}},
];

const HIGHLIGHTS = [
  {label:'Research Director', value:'Department of HRM and Organizational Behavior', sub:'Faculty of Economics and Business, University of Groningen',
   nl:{label:'Onderzoeksdirecteur', value:'Afdeling HRM en Organisatiegedrag', sub:'Faculteit Economie en Bedrijfskunde, Rijksuniversiteit Groningen'}},
  {label:'Applied research', value:'10+ years', sub:'Research institutes, hospitals, infrastructure companies, and ministries',
   nl:{label:'Toegepast onderzoek', value:'10+ jaar', sub:'Onderzoeksinstituten, ziekenhuizen, infrastructuurbedrijven en ministeries'}},
  {label:'Editorial role', value:'Associate Editor', sub:'Group and Organization Management',
   nl:{label:'Redactiefunctie'}},
  {label:'NWO Veni laureate', value:'2022', sub:'Multiple team membership',
   nl:{label:'NWO Veni-laureaat', sub:'Multiple team membership'}},
];

/* Plain sentences for the short introduction under the home page hero. */
const ABOUT = [
  {t:'I work at the Faculty of Economics and Business of the University of Groningen, where I am Associate Professor and Research Director of the Department of HRM and Organizational Behavior.',
   nl:{t:'Ik werk aan de Faculteit Economie en Bedrijfskunde van de Rijksuniversiteit Groningen, waar ik universitair hoofddocent ben en onderzoeksdirecteur van de afdeling HRM en Organisatiegedrag.'}},
  {t:'For more than ten years I have carried out applied research with research institutes, hospitals, energy and infrastructure companies, and ministries.',
   nl:{t:'Al meer dan tien jaar doe ik toegepast onderzoek met onderzoeksinstituten, ziekenhuizen, energie- en infrastructuurbedrijven en ministeries.'}},
  {t:'I am also an associate editor of <em>Group and Organization Management</em>. In 2022 I received an NWO Veni grant for my research on multiple team membership.',
   nl:{t:'Daarnaast ben ik associate editor van <em>Group and Organization Management</em>. In 2022 ontving ik een NWO Veni-subsidie voor mijn onderzoek naar multiple team membership.'}},
  {t:'I supervise PhD candidates and Master’s theses, and in November 2026 I completed the PhD Supervision Excellence programme of the University of Groningen.',
   nl:{t:'Ik begeleid promovendi en masterscripties, en in november 2026 rondde ik het programma PhD Supervision Excellence van de Rijksuniversiteit Groningen af.'}},
];

const QUICK_FACTS = [
  {l:'Position', v:'Associate Professor', s:'FEB, University of Groningen',
   nl:{l:'Functie', v:'Universitair hoofddocent', s:'FEB, Rijksuniversiteit Groningen'}},
  {l:'Research Director', v:'Department of HRM and Organizational Behavior', s:'FEB, University of Groningen',
   nl:{l:'Onderzoeksdirecteur', v:'Afdeling HRM en Organisatiegedrag', s:'FEB, Rijksuniversiteit Groningen'}},
  {l:'PhD', v:'University of Groningen, 2019', s:'Organizational Behavior',
   nl:{l:'Promotie', v:'Rijksuniversiteit Groningen, 2019', s:'Organisatiegedrag'}},
  {l:'NWO Veni grant', v:'2022', s:'Multiple team membership',
   nl:{l:'NWO Veni-subsidie', v:'2022', s:'Multiple team membership'}},
  {l:'Working with organisations', v:'10+ years', s:'Research institutes, hospitals, ministries, and others',
   nl:{l:'Samenwerking met de praktijk', v:'10+ jaar', s:'Onder andere onderzoeksinstituten, ziekenhuizen en ministeries'}},
  {l:'Editorial role', v:'Associate Editor', s:'Group and Organization Management',
   nl:{l:'Redactiefunctie', v:'Associate Editor', s:'Group and Organization Management'}},
];

/* PAGES */

function publication(p){
  const ref = [p.venue, p.year].filter(Boolean).join(', ');
  const note = L(p, 'note');
  return `<div class="pub-item"><div><p class="pub-title">${p.title}</p><p class="pub-auth">${p.auth}</p><p class="pub-venue">${ref}</p>${note?`<p class="pub-note">${note}</p>`:''}${p.video?`<a class="pub-video" href="${p.video}" target="_blank" rel="noopener">${T('Watch the video explainer', 'Bekijk de video-uitleg (Engels)')}</a>`:''}</div>${p.doi?`<a class="pub-doi" href="https://doi.org/${p.doi}" target="_blank" rel="noopener">doi:${p.doi}</a>`:''}</div>`;
}

const pages = {
  home(){
    const topPubs = PUBS.filter(p => p.feat);
    document.getElementById('pg-home').innerHTML = `
    <section class="hero">
      <div class="wrap hero-grid">
        <div class="hero-text">
          <h1 class="h1">Joost van de Brake</h1>
          <p class="hero-tagline">${T(
            'Research and teaching on modern teamwork.',
            'Onderzoek en onderwijs over modern teamwerk.'
          )}</p>
          <p class="lead">${T(
            'I study how people work together within and across teams, and I use this research in university teaching, in executive education, and in partnerships with organisations. My research focuses in particular on multiple team membership, hybrid work, and the stress and strain of modern team arrangements.',
            'Ik bestudeer hoe mensen samenwerken binnen en tussen teams, en ik gebruik dat onderzoek in mijn universitaire onderwijs, in executive opleidingen en in samenwerkingen met organisaties. Mijn onderzoek richt zich vooral op multiple team membership, hybride werk en de stress en belasting die moderne teamvormen met zich meebrengen.'
          )}</p>
          <p class="hero-identity">${T(
            'My formal name is Hendrik J. van de Brake, and academic records also use the forms H. J. van de Brake and HJ van de Brake.',
            'Mijn formele naam is Hendrik J. van de Brake, en in academische registers worden ook de vormen H. J. van de Brake en HJ van de Brake gebruikt.'
          )}</p>
        </div>
        <img class="hero-photo" src="/portrait.jpg?v=20261122" width="500" height="749" loading="eager" fetchpriority="high" decoding="async" alt="${T('Portrait of Joost van de Brake', 'Portret van Joost van de Brake')}">
      </div>
    </section>

    <section class="about" aria-label="${T('About', 'Over mij')}">
      <div class="wrap about-grid">
        <div class="about-text">
          ${ABOUT.map(s => `<p>${L(s,'t')}</p>`).join('')}
        </div>
        <figure class="ink-fig about-fig">
          <img src="/assets/ink/hero-teams.webp?v=20261122b" width="1400" height="1129" loading="lazy" decoding="async"
               alt="${T('Ink drawing of an employee in red who walks from one team’s table to the next, past colleagues at a laptop, a whiteboard, and a pile of documents.', 'Inkttekening van een medewerker in het rood die van de tafel van het ene team naar het volgende loopt, langs collega’s bij een laptop, een whiteboard en een stapel documenten.')}">
        </figure>
      </div>
    </section>

    <section class="sec">
      <div class="wrap split">
        <div class="split-text">
          <h2 class="h2">${T('Working with organisations', 'Samenwerking met de praktijk')}</h2>
          <p class="lead">${T(
            'In partnerships and applied projects with organisations, I draw on research and on years of experience with this kind of work.',
            'In samenwerkingen en toegepaste projecten met organisaties bouw ik voort op wetenschappelijk onderzoek en op jarenlange ervaring met dit soort werk.'
          )}</p>
          <div class="offers">
            ${OFFERINGS.map(o=>`<p><strong>${L(o,'h')}.</strong> ${L(o,'body')}</p>`).join('')}
          </div>
          <p class="more"><a href="${U('/practice/')}">${T('How I work →', 'Hoe ik werk →')}</a></p>
        </div>
        <figure class="ink-fig">
          <img src="/assets/ink/practice-meeting.webp?v=20261122" width="1500" height="957" loading="lazy" decoding="async"
               alt="${T('Ink drawing of a researcher in red at a meeting table with three managers, pointing at printed survey results.', 'Inkttekening van een onderzoeker in het rood aan een vergadertafel met drie managers, die naar uitgeprinte onderzoeksresultaten wijst.')}">
        </figure>
      </div>
    </section>

    <section class="sec">
      <div class="wrap">
        <h2 class="h2">${T('Recent publications', 'Recente publicaties')}</h2>
        <ul class="pubs">
          ${topPubs.map(p=>`<li><a class="pubs-t" href="https://doi.org/${p.doi}" target="_blank" rel="noopener">${p.title}</a><p class="pubs-m">${p.auth} (${p.year}). <em>${p.venue.split(',')[0]}</em>. doi:${p.doi}${p.video?` · <a href="${p.video}" target="_blank" rel="noopener">${T('Watch the video explainer', 'Bekijk de video-uitleg (Engels)')}</a>`:''}</p></li>`).join('')}
        </ul>
        <p class="more"><a href="${U('/research/')}">${T('All publications →', 'Alle publicaties →')}</a></p>
      </div>
    </section>

    <section class="sec">
      <div class="wrap split flip">
        <figure class="ink-fig">
          <img src="/assets/ink/mtm-week.webp?v=20261122" width="1500" height="1435" loading="lazy" decoding="async"
               alt="${T('Ink drawing of a person in red at a table who plans one working week on a large sheet with a column for each day.', 'Inkttekening van een persoon in het rood aan een tafel die één werkweek plant op een groot vel met een kolom voor elke dag.')}">
        </figure>
        <div class="split-text">
          <h2 class="h2">${T('Working in several teams', 'Werken in meerdere teams')}</h2>
          <p>${T(
            'With the MTM Portfolio Navigator, you can map how one working week is divided across your teams and choose a small change to test. Two classroom cases with separate instructor guides come with the navigator. The navigator and the cases are free to use and are supported by NWO.',
            'Met de MTM Portfolio Navigator brengt u in kaart hoe één werkweek over uw teams is verdeeld en kiest u een kleine verandering om uit te proberen. Bij de navigator horen twee onderwijscases met aparte docentenhandleidingen. De navigator en de cases zijn gratis te gebruiken en worden ondersteund door NWO.'
          )}</p>
          <a class="btn" href="${U('/mtm-resources/')}">${T('Open the MTM resources', 'Bekijk het MTM-materiaal')}</a>
        </div>
      </div>
    </section>
`;
  },

  research(){
    document.getElementById('pg-research').innerHTML = `
    <div class="pg-hd has-figure"><div class="wrap">
      <div class="pg-hd-text"><p class="eye">${T('Research', 'Onderzoek')}</p><h1>${T('Teams, networks, and the organisation of modern work', 'Teams, netwerken en de organisatie van modern werk')}</h1><p>${T(
      'My research examines how people work together within and across teams in modern organisations. I study multiple team membership and flexible and hybrid work, and I ask under which conditions people can work well in these arrangements.',
      'Mijn onderzoek gaat over de manier waarop mensen in moderne organisaties samenwerken binnen en tussen teams. Ik bestudeer multiple team membership en flexibel en hybride werken, en ik onderzoek onder welke voorwaarden mensen in die werkvormen goed kunnen functioneren.'
    )}</p></div>
      <figure class="ink-fig pg-hd-figure">
        <img src="/assets/ink/research-overlap.webp?v=20261122" width="1400" height="1288"
             alt="${T('Ink drawing of a researcher in red at a desk who points with a pencil at a sheet with three overlapping circles for three teams, with dots for members, some of whom sit in two or three teams at once.', 'Inkttekening van een onderzoeker in het rood aan een bureau die met een potlood wijst op een vel met drie overlappende cirkels voor drie teams, met stippen voor leden, van wie sommigen in twee of drie teams tegelijk zitten.')}"
             loading="eager" decoding="async">
      </figure>
    </div></div>

    <section class="sec">
      <div class="wrap">
        <div class="block">
          <h2 class="block-h">${T('About my research', 'Over mijn onderzoek')}</h2>
          <p>${T(
            'In all of my work, I examine what happens when organisations spread the same people across several teams at once. I began by studying <strong>multiple team membership</strong>, in which employees contribute to several teams during the same period. I found that the consequences of multiple team membership depend far more on how this participation is organised than on how many teams someone belongs to.',
            'In al mijn werk onderzoek ik wat er gebeurt wanneer organisaties dezelfde mensen tegelijk over meerdere teams verdelen. Ik begon met onderzoek naar <strong>multiple team membership</strong>, waarbij medewerkers in dezelfde periode aan meerdere teams bijdragen. Ik ontdekte dat de gevolgen van multiple team membership veel meer afhangen van de manier waarop die deelname is georganiseerd dan van het aantal teams waarin iemand werkt.'
          )}</p>

          <p>${T(
            'In later studies, my co-authors and I replaced the simple count of teams with the factors that determine these consequences. We examined how the relationship between multiple team membership and performance develops over time and how organisational tenure changes that relationship. We also studied the role of employees’ information-sharing networks, whether employees’ roles in different teams differ or overlap, and how often people switch between teams.',
            'In latere studies vervingen mijn coauteurs en ik het simpele aantal teams door de factoren die deze gevolgen bepalen. We onderzochten hoe de relatie tussen multiple team membership en prestaties zich in de loop van de tijd ontwikkelt en hoe de diensttijd van medewerkers in de organisatie die relatie verandert. Ook onderzochten we de rol van de netwerken waarin medewerkers informatie delen, de vraag of hun rollen in verschillende teams verschillen of juist samenvallen, en hoe vaak mensen tussen teams wisselen.'
          )}</p>

          <p>${T(
            'In much of my research, I develop and test theory on multiple team membership. Two papers in the <em>Journal of Applied Psychology</em> report the core findings. The 2024 paper shows that <a href="https://doi.org/10.1037/apl0001168" target="_blank" rel="noopener">how multiple team membership is conceptualised and measured</a> shapes its relationship with emotional exhaustion and turnover. The 2022 paper with Stefan Berger and Heike Bruch describes the underlying mechanism as a multilevel trade-off between <a href="https://doi.org/10.1037/apl0000889" target="_blank" rel="noopener">resource leverage and resource depletion</a>. In a paper in <em>Personnel Psychology</em>, Berger and I show that <a href="https://doi.org/10.1111/peps.12495" target="_blank" rel="noopener">the cost of multiple team membership rises when work roles across teams differ rather than overlap</a>. A study in the <em>Journal of Management Studies</em> finds that <a href="https://doi.org/10.1111/joms.12539" target="_blank" rel="noopener">the effects of multiple team membership on performance depend on employees’ organisational tenure</a>. An earlier longitudinal study in the <em>Journal of Organizational Behavior</em> showed that the <a href="https://doi.org/10.1002/job.2260" target="_blank" rel="noopener">link between multiple team membership and individual job performance is dynamic</a> and changes as employees move between teams.',
            'In een groot deel van mijn onderzoek ontwikkel en toets ik theorie over multiple team membership. Twee artikelen in het <em>Journal of Applied Psychology</em> beschrijven de belangrijkste bevindingen. Het artikel uit 2024 laat zien dat <a href="https://doi.org/10.1037/apl0001168" target="_blank" rel="noopener">de manier waarop multiple team membership wordt opgevat en gemeten</a> bepaalt hoe het samenhangt met emotionele uitputting en verloop. Het artikel uit 2022 met Stefan Berger en Heike Bruch beschrijft het onderliggende mechanisme als een afweging op meerdere niveaus tussen <a href="https://doi.org/10.1037/apl0000889" target="_blank" rel="noopener">resource leverage en resource depletion</a>. In een artikel in <em>Personnel Psychology</em> laten Berger en ik zien dat <a href="https://doi.org/10.1111/peps.12495" target="_blank" rel="noopener">de kosten van multiple team membership oplopen wanneer de werkrollen in verschillende teams van elkaar verschillen in plaats van overeenkomen</a>. Een studie in het <em>Journal of Management Studies</em> laat zien dat <a href="https://doi.org/10.1111/joms.12539" target="_blank" rel="noopener">de effecten van multiple team membership op prestaties afhangen van de diensttijd van medewerkers in hun organisatie</a>. Een eerdere longitudinale studie in het <em>Journal of Organizational Behavior</em> toonde aan dat de <a href="https://doi.org/10.1002/job.2260" target="_blank" rel="noopener">relatie tussen multiple team membership en individuele werkprestatie dynamisch is</a> en verandert naarmate medewerkers tussen teams wisselen.'
          )}</p>

          <p>${T(
            'In my recent work, I look beyond the set of teams to which a single employee belongs. A 2026 paper in the <em>Academy of Management Journal</em> with Stefan Berger, Heike Bruch, and Gerben van der Vegt examines multiple team membership together with fluid team membership, in which employees repeatedly enter and leave teams. The paper <a href="https://doi.org/10.5465/amj.2023.0869" target="_blank" rel="noopener">tests the implications of both arrangements for social capital and performance</a>, for employees as well as for organisations. In my single-authored theory paper in <em>Group and Organization Management</em>, I explain <a href="https://doi.org/10.1177/10596011261486495" target="_blank" rel="noopener">why employees experience team memberships that look alike on paper in different ways</a>, depending on how strongly they identify with each team and on the status they hold in it. A multilevel study of remote work shows that the benefits that employees gain from working from home depend on how their colleagues’ schedules are arranged. A study in <em>Work and Stress</em> traces <a href="https://doi.org/10.1080/02678373.2025.2551498" target="_blank" rel="noopener">how emotional exhaustion spreads through collaboration networks</a>.',
            'In mijn recente werk kijk ik verder dan de teams waartoe één medewerker behoort. Een artikel uit 2026 in het <em>Academy of Management Journal</em> met Stefan Berger, Heike Bruch en Gerben van der Vegt onderzoekt multiple team membership samen met fluid team membership, waarbij medewerkers herhaaldelijk teams binnenkomen en weer verlaten. Het artikel <a href="https://doi.org/10.5465/amj.2023.0869" target="_blank" rel="noopener">toetst wat beide werkvormen betekenen voor sociaal kapitaal en prestaties</a>, zowel voor medewerkers als voor organisaties. In mijn theoretische artikel in <em>Group and Organization Management</em>, dat ik als enige auteur schreef, leg ik uit <a href="https://doi.org/10.1177/10596011261486495" target="_blank" rel="noopener">waarom medewerkers teamlidmaatschappen die op papier gelijk lijken verschillend ervaren</a>, afhankelijk van hoe sterk zij zich met elk team identificeren en welke status zij daarin hebben. Een studie op meerdere niveaus naar werken op afstand laat zien dat de voordelen die medewerkers uit thuiswerken halen afhangen van de manier waarop de roosters van hun collega’s zijn ingericht. Een studie in <em>Work and Stress</em> laat zien <a href="https://doi.org/10.1080/02678373.2025.2551498" target="_blank" rel="noopener">hoe emotionele uitputting zich via samenwerkingsnetwerken verspreidt</a>.'
          )}</p>

          <p>${T(
            'The factors examined in these studies are choices that organisations make when they design work. Whether working across several teams brings costs or benefits depends on how the work is arranged and not on how hard the individual tries. The evidence is useful in practice because it points to decisions that someone in the organisation can take.',
            'De factoren in deze studies zijn keuzes die organisaties maken wanneer zij werk inrichten. Of werken in meerdere teams kosten of voordelen oplevert, hangt af van de manier waarop het werk is ingericht en niet van de inzet van het individu. De bevindingen zijn bruikbaar in de praktijk, omdat ze wijzen op beslissingen die iemand in de organisatie kan nemen.'
          )}</p>
        </div>

        <div class="block">
          <h2 class="block-h">${T('Selected publications', 'Geselecteerde publicaties')}</h2>
          <div class="pub-list">${PUBS.map(publication).join('')}</div>
          <p style="font-size:0.82rem;color:var(--ink-600);font-style:italic;margin-top:14px">${T(
            'This list shows a selection of my peer-reviewed publications. The full list, including books and chapters, is on <a href="https://research.rug.nl/en/persons/joost-van-de-brake/publications/" target="_blank" rel="noopener">Pure</a> and <a href="https://scholar.google.com/citations?user=TFGPoCAAAAAJ" target="_blank" rel="noopener">Google Scholar</a>.',
            'Deze lijst bevat een selectie van mijn door vakgenoten beoordeelde publicaties. De volledige lijst, inclusief boeken en hoofdstukken, staat op <a href="https://research.rug.nl/en/persons/joost-van-de-brake/publications/" target="_blank" rel="noopener">Pure</a> en <a href="https://scholar.google.com/citations?user=TFGPoCAAAAAJ" target="_blank" rel="noopener">Google Scholar</a>.'
          )}</p>
        </div>

        <div class="block">
          <h2 class="block-h">${T('Grants', 'Onderzoekssubsidies')}</h2>
          <div class="card-grid">
            ${GRANTS.map(g=>`<div class="card"><span class="card-tag">${g.tag}, ${g.year}</span><h3>${L(g,'title')}</h3><p>${L(g,'body')}</p><div class="meta"><span>${g.amount}</span></div></div>`).join('')}
          </div>
        </div>

        <div class="block">
          <h2 class="block-h">${T('Leadership and service', 'Leiderschap en bestuurlijke rollen')}</h2>
          <ul>
            <li><p class="li-h">${T('Research Director, Department of HRM and Organizational Behavior', 'Onderzoeksdirecteur, afdeling HRM en Organisatiegedrag')}</p><p class="li-body">${T('Since February 2026 I have been Research Director of the Department of HRM and Organizational Behavior at the Faculty of Economics and Business, and a member of its management team. I assess doctoral proposals and allocate research time and funding. In 2026 I also served on the faculty committee that selected eleven PhD candidates.', 'Sinds februari 2026 ben ik onderzoeksdirecteur van de afdeling HRM en Organisatiegedrag van de Faculteit Economie en Bedrijfskunde en lid van het managementteam van de afdeling. Ik beoordeel promotievoorstellen en verdeel onderzoekstijd en middelen. In 2026 zat ik daarnaast in de facultaire commissie die elf promovendi selecteerde.')}</p><p class="li-body">${T('I designed and built the department’s first research dashboard, which brings together publications, expertise, doctoral projects, collaboration networks, and funding opportunities in one place so that colleagues can find each other and prepare proposals.', 'Ik ontwierp en bouwde het eerste onderzoeksdashboard van de afdeling. Het dashboard brengt publicaties, expertise, promotieprojecten, samenwerkingsnetwerken en subsidiemogelijkheden samen, zodat collega’s elkaar kunnen vinden en voorstellen kunnen voorbereiden.')}</p><p class="li-body">${T('I started a faculty-wide initiative on generative AI in research and wrote the note that put the topic on the faculty’s agenda. I also chair the working group that is turning this initiative into shared guidance. The working group starts from the view that generative AI tools should improve the quality and transparency of research rather than simply increase output.', 'Ik startte een facultair traject over generatieve AI in onderzoek en schreef de notitie die het onderwerp op de facultaire agenda zette. Ook ben ik voorzitter van de werkgroep die dit traject uitwerkt tot gedeelde richtlijnen. De werkgroep gaat ervan uit dat generatieve AI de kwaliteit en transparantie van onderzoek moet verbeteren en niet alleen de productie moet verhogen.')}</p></li>
            <li><p class="li-h">${T('Associate Editor, Group and Organization Management', 'Associate Editor, Group and Organization Management')}</p><p class="li-body">${T('I review submissions on teams, multiple team membership, and modern work arrangements and guide them through the review process.', 'Ik beoordeel manuscripten over teams, multiple team membership en moderne werkvormen en begeleid ze door het beoordelingsproces.')}</p></li>
            <li><p class="li-h">${T('Interview panel member, NWO Veni', 'Lid commissie NWO Veni')}</p><p class="li-body">${T('I was a member of the Veni interview panel <em>Economics and Business Administration</em> of the Dutch Research Council in the Social Sciences and Humanities domain, where I evaluated proposals from early-career researchers.', 'Ik was lid van de Veni-interviewcommissie <em>Economie en Bedrijfskunde</em> van NWO in het domein Sociale en Geesteswetenschappen, waarin ik voorstellen van onderzoekers aan het begin van hun loopbaan.')}</p></li>
            <li><p class="li-h">${T('Academy of Management, OB Division', 'Academy of Management, OB Division')}</p><p class="li-body">${T('I co-founded the professional development workshop <em>How to Manage Academic Collaborations</em> and have co-organised it every year since 2020. I am also a member of the Making Connections Committee, and in 2022 and 2025 I acted as discussant at the Academy’s research symposium on multiple team membership.', 'Ik ben medeoprichter van de professional development workshop <em>How to Manage Academic Collaborations</em> en organiseer die sinds 2020 elk jaar mee. Daarnaast ben ik lid van de Making Connections Committee, en in 2022 en 2025 was ik discussant op het onderzoekssymposium van de Academy over multiple team membership.')}</p></li>
            <li><p class="li-h">${T('Institutional Review Board, FEB, University of Groningen', 'Institutional Review Board, FEB, Rijksuniversiteit Groningen')}</p><p class="li-body">${T('I review research ethics applications for the Faculty of Economics and Business.', 'Ik beoordeel aanvragen voor de ethische toetsing van onderzoek binnen de Faculteit Economie en Bedrijfskunde.')}</p></li>
            <li><p class="li-h">${T('FEB Research Institute (FEBRI)', 'FEB Research Institute (FEBRI)')}</p><p class="li-body">${T('I am a FEBRI Fellow, I review submissions and act as discussant at the annual FEBRI conference, and I teach in the FEBRI publishing workshop for PhD students.', 'Ik ben FEBRI Fellow, ik beoordeel inzendingen en treed op als discussant op de jaarlijkse FEBRI-conferentie, en ik geef les in de FEBRI-publicatieworkshop voor promovendi.')}</p></li>
            <li><p class="li-h">${T('Ad-hoc reviewing', 'Ad-hoc reviews')}</p><p class="li-body">${T('I review manuscripts for the Academy of Management Journal, Organization Science, Management Science, and other journals.', 'Ik beoordeel manuscripten voor Academy of Management Journal, Organization Science, Management Science en andere tijdschriften.')}</p></li>
          </ul>
        </div>

        <div class="block">
          <h2 class="block-h">${T('Awards and recognition', 'Onderscheidingen en erkenning')}</h2>
          <div class="card-grid">
            ${AWARDS.map(a=>`<div class="card alt"><span class="card-tag teal">${L(a,'year')}</span><h3>${L(a,'name')}</h3><p>${L(a,'body')}</p></div>`).join('')}
          </div>
        </div>
      </div>
    </section>`;
  },

  teaching(){
    document.getElementById('pg-teaching').innerHTML = `
    <div class="pg-hd has-figure"><div class="wrap">
      <div class="pg-hd-text"><p class="eye">${T('Teaching', 'Onderwijs')}</p><h1>${T('Teaching on teams, leadership, and modern work', 'Onderwijs over teams, leiderschap en modern werk')}</h1><p>${T(
      'I teach management students, business administration students, and senior executives about the challenges of modern work arrangements. My courses deal with team dynamics, multiple team membership, hybrid work, and sustainable employability. In my teaching, I connect academic theory with its practical application, and I involve students in my own research projects.',
      'Ik geef onderwijs aan studenten Management en Bedrijfskunde en aan senior leidinggevenden over de uitdagingen van moderne werkvormen. Mijn vakken gaan over teamdynamiek, multiple team membership, hybride werk en duurzame inzetbaarheid. In mijn onderwijs verbind ik academische theorie met de toepassing ervan in de praktijk, en ik betrek studenten bij mijn eigen onderzoeksprojecten.'
    )}</p></div>
      <figure class="ink-fig pg-hd-figure">
        <img src="/assets/ink/teaching-teams.webp?v=20261122" width="1600" height="833"
             alt="${T('Ink drawing of a seminar on teamwork in which five students work in two small teams at separate tables, while the lecturer in red stands between them and listens.', 'Inkttekening van een werkgroep over teamwerk waarin vijf studenten in twee kleine teams aan aparte tafels werken, terwijl de docent in het rood tussen hen in staat en luistert.')}"
             loading="eager" decoding="async">
      </figure>
    </div></div>

    <section class="sec">
      <div class="wrap">
        <div class="block">
          <h2 class="block-h">${T('Approach', 'Aanpak')}</h2>
          <p>${T(
            'Students learn best when they apply theory to real problems and when their teachers do research themselves. In my BSc, MSc, and executive teaching, I use case material from organisations that I work with, including applied research institutes, hospitals, energy and infrastructure companies, municipalities, public-sector agencies, and banks.',
            'Studenten leren het meest wanneer ze theorie toepassen op echte vraagstukken en wanneer hun docenten zelf onderzoek doen. In mijn onderwijs op BSc-, MSc- en executive niveau gebruik ik casussen van organisaties waarmee ik samenwerk, waaronder toegepaste onderzoeksinstituten, ziekenhuizen, energie- en infrastructuurbedrijven, gemeenten, publieke instanties en banken.'
          )}</p>
          <p>${T(
            'In 2020 I completed the University Teaching Qualification (UTQ / BKO). In November 2026 I completed the PhD Supervision Excellence programme of the University of Groningen, which consists of an online course, three workshops, and an assessment.',
            'In 2020 heb ik de Basiskwalificatie Onderwijs (BKO) behaald. In november 2026 rondde ik het programma PhD Supervision Excellence van de Rijksuniversiteit Groningen af, dat bestaat uit een online cursus, drie workshops en een beoordeling.'
          )}</p>
        </div>

        <div class="block">
          <h2 class="block-h">${T('Current courses', 'Huidige vakken')}</h2>
          <ul>
            ${TEACHING.map(c=>{
              const role = L(c,'role');
              const programme = L(c,'programme');
              const since = L(c,'since');
              const body = L(c,'body');
              const code = c.code ? ' · ' + T('Course code', 'Vakcode') + ' ' + c.code : '';
              const link = c.link ? ' <a href="'+c.link+'" target="_blank" rel="noopener">'+T('View the official course page →', 'Bekijk de officiële vakpagina →')+'</a>' : '';
              return `<li><p class="li-h">${c.title}</p><p class="li-meta">${role} · ${programme} · ${since}${code}</p><p class="li-body">${body}${link}</p></li>`;
            }).join('')}
          </ul>
        </div>

        <div class="block">
          <h2 class="block-h">${T('PhD and thesis supervision', 'Begeleiding van promovendi en scripties')}</h2>
          <p>${T(
            'I supervise PhD candidates who study modern team arrangements. <strong>Tunahan Sari</strong> is in his third year and has three studies underway, including a multilevel field study and an experiment with AI agents. <strong>Bishal Saha</strong> started in 2026 and is developing a network theory of dynamic participation, for which he uses longitudinal data from two mental-healthcare organisations. I was co-promotor of <strong>Franzisca Fastje</strong>, who defended her PhD on remote and hybrid work in teams in September 2026 and now holds a postdoctoral fellowship at the University of Queensland. I am also co-promotor of <strong>Herman Paryono</strong>, who studies multiple roles across countries and is now a postdoctoral researcher in Groningen.',
            'Ik begeleid promovendi die moderne teamvormen onderzoeken. <strong>Tunahan Sari</strong> is derdejaars promovendus en heeft drie studies lopen, waaronder een meerlaagse veldstudie en een experiment met AI-agenten. <strong>Bishal Saha</strong>, die in 2026 begon, ontwikkelt een netwerktheorie van dynamische deelname op basis van longitudinale gegevens uit twee ggz-organisaties. Ik was copromotor van <strong>Franzisca Fastje</strong>, die in september 2026 promoveerde op onderzoek naar remote en hybride werk in teams en nu postdoc is aan de University of Queensland. Ook ben ik copromotor van <strong>Herman Paryono</strong>, die meervoudige rollen in verschillende landen onderzoekt en nu postdoc is in Groningen.'
          )}</p>
          <p>${T(
            'Earlier, Gerben van der Vegt and I jointly supervised <strong>Burkhard Wörtler</strong>’s postdoctoral project, which produced a longitudinal study of how emotional exhaustion spreads through collaboration networks. I give the researchers I supervise ownership of their own project, and I work closely with them on its concepts and methods and on their writing, so that they leave with a profile of their own.',
            'Eerder begeleidden Gerben van der Vegt en ik samen het postdocproject van <strong>Burkhard Wörtler</strong>, dat een longitudinale studie opleverde naar de manier waarop emotionele uitputting zich door samenwerkingsnetwerken verspreidt. Ik laat de onderzoekers die ik begeleid eigenaar zijn van hun eigen project en werk nauw met hen samen aan de concepten en methoden en aan het schrijven, zodat zij met een eigen profiel vertrekken.'
          )}</p>
          <p>${T(
            'Since 2015 I have supervised approximately 150 Bachelor’s and Master’s students with their theses, in the MSc Human Resource Management and earlier also in the BSc Business Administration. Almost all of these theses address practical questions brought in by organisations such as applied research institutes, energy and infrastructure companies, municipalities, public-sector agencies, and banks.',
            'Sinds 2015 heb ik ongeveer 150 bachelor- en masterstudenten bij hun scriptie begeleid, in de MSc Human Resource Management en eerder ook in de BSc Bedrijfskunde. Vrijwel al deze scripties gaan over praktische vraagstukken die organisaties aandragen, zoals toegepaste onderzoeksinstituten, energie- en infrastructuurbedrijven, gemeenten, publieke instanties en banken.'
          )}</p>
          <p>${T(
            'I am open to supervising new PhD candidates who work on related topics, and interested candidates can <a href="mailto:h.j.van.de.brake@rug.nl">contact me by email</a>.',
            'Ik sta open voor het begeleiden van nieuwe promovendi die aan verwante onderwerpen werken, en belangstellenden kunnen <a href="mailto:h.j.van.de.brake@rug.nl">per e-mail contact met mij opnemen</a>.'
          )}</p>
        </div>

        <div class="block">
          <h2 class="block-h">${T('Invited talks and seminars', 'Lezingen en seminars op uitnodiging')}</h2>
          <p>${T(
            'I have given invited talks about my work at universities and ministries in the Netherlands and abroad. Recent examples include research seminars at Rotterdam School of Management, the University of Amsterdam, Tilburg University, and the University of Giessen. I have also given invited presentations at Dutch ministries. Earlier in my career I gave a seminar at the Duke Network Analysis Center as part of my Fulbright stay.',
            'Ik heb op uitnodiging lezingen over mijn werk gegeven bij universiteiten en ministeries in Nederland en daarbuiten. Zo gaf ik recent onderzoeksseminars aan Rotterdam School of Management, de Universiteit van Amsterdam, Tilburg University en de Universiteit van Gießen. Daarnaast heb ik presentaties gegeven op uitnodiging bij Nederlandse ministeries. Eerder in mijn loopbaan gaf ik een seminar aan het Duke Network Analysis Center tijdens mijn Fulbright-verblijf.'
          )}</p>
          <p>${T(
            'Between 2022 and 2025, I organised the research seminar series for the Department of HRM and Organizational Behavior, and the series hosted roughly eight visiting speakers per year.',
            'Tussen 2022 en 2025 organiseerde ik de onderzoeksseminarreeks van de afdeling HRM en Organisatiegedrag, die per jaar ongeveer acht gastsprekers ontving.'
          )}</p>
          <p>${T(
            'If you would like me to speak at an event, please <a href="mailto:h.j.van.de.brake@rug.nl">send me an email</a>.',
            'Als u wilt dat ik een lezing geef op een bijeenkomst, kunt u mij <a href="mailto:h.j.van.de.brake@rug.nl">een e-mail sturen</a>.'
          )}</p>
        </div>
      </div>
    </section>`;
  },

  practice(){
    document.getElementById('pg-practice').innerHTML = `
    <div class="pg-hd has-figure"><div class="wrap">
      <div class="pg-hd-text"><p class="eye">${T('Working with organisations', 'Samenwerking met de praktijk')}</p><h1>${T('Applied research and training on teams and collaboration', 'Toegepast onderzoek en training over teams en samenwerking')}</h1><p>${T(
      'I work with HR teams, managers, and project controllers in organisations that want to examine questions about their teams and employees and to act on what the evidence shows. Past partners include applied research institutes, hospitals, energy and infrastructure companies, national healthcare bodies, municipalities, and ministries, and I am open to new partnerships.',
      'Ik werk samen met HR-teams, leidinggevenden en projectcontrollers in organisaties die vragen over hun teams en medewerkers willen onderzoeken en willen handelen naar wat het onderzoek laat zien. Eerdere partners zijn onder andere toegepaste onderzoeksinstituten, ziekenhuizen, energie- en infrastructuurbedrijven, landelijke zorgkoepels, gemeenten en ministeries, en ik sta open voor nieuwe samenwerkingen.'
    )}</p></div>
      <figure class="ink-fig pg-hd-figure">
        <img src="/assets/ink/org-workshop.webp?v=20261122" width="1600" height="1200"
             alt="${T('Ink drawing of a presenter in red at a flip chart with boxes and arrows, and four team leaders on chairs who take notes.', 'Inkttekening van een presentator in het rood bij een flip-over met vakjes en pijlen, en vier teamleiders op stoelen die aantekeningen maken.')}"
             loading="eager" decoding="async">
      </figure>
    </div></div>

    <section class="sec">
      <div class="wrap">
        <div class="block">
          <h2 class="block-h">${T('What I offer', 'Wat ik te bieden heb')}</h2>
          <div class="off-grid">
            ${OFFERINGS.map(o=>`<div class="off"><h3>${L(o,'h')}</h3><p>${L(o,'body')}</p></div>`).join('')}
          </div>
        </div>

        <div class="block">
          <h2 class="block-h">${T('How I work', 'Hoe ik werk')}</h2>
          <p>${T(
            'I treat applied projects as scientific work and not as consultancy. I therefore use validated instruments, design studies that can be repeated, and report all findings, including those that show what does not work. Most projects combine survey data with administrative records (engagement, turnover, absenteeism, performance), and many projects are longitudinal partnerships rather than one-off measurements.',
            'Ik behandel toegepaste projecten als wetenschappelijk werk en niet als advieswerk. Daarom gebruik ik gevalideerde instrumenten, zet ik studies op die herhaalbaar zijn en rapporteer ik alle bevindingen, ook de bevindingen die laten zien wat niet werkt. De meeste projecten combineren enquêtegegevens met administratieve gegevens (betrokkenheid, verloop, verzuim, prestaties), en veel projecten zijn langlopende samenwerkingen in plaats van eenmalige metingen.'
          )}</p>
          <p>${T(
            'I involve PhD students or postdocs in a project when their contribution helps, because their involvement keeps the costs proportionate and the research close to the latest theory. Every project ends with a written report and a working session with the people who have to act on the findings.',
            'Ik betrek promovendi of postdocs bij een project wanneer hun bijdrage helpt, omdat hun betrokkenheid de kosten beheersbaar houdt en het onderzoek laat aansluiten bij de meest recente theorie. Elk project eindigt met een geschreven rapport en een werksessie met de mensen die met de bevindingen aan de slag moeten.'
          )}</p>
        </div>

        <div class="block">
          <h2 class="block-h">${T('Organisations I have worked with', 'Organisaties waarmee ik heb samengewerkt')}</h2>
          <p>${T(
            'I have worked with many different organisations, such as TNO, Amphia Ziekenhuis Breda, the municipality of Assen, and GGZ Nederland. Please <a href="mailto:h.j.van.de.brake@rug.nl">contact me</a> if you would like to know more about these collaborations.',
            'Ik heb met veel verschillende organisaties samengewerkt, zoals TNO, Amphia Ziekenhuis Breda, de gemeente Assen en GGZ Nederland. <a href="mailto:h.j.van.de.brake@rug.nl">Neem gerust contact met me op</a> als u meer over deze samenwerkingen wilt weten.'
          )}</p>
        </div>

        <div class="block">
          <h2 class="block-h">${T('Media and public engagement', 'Media en maatschappelijke betrokkenheid')}</h2>
          <p>${T(
            'Dutch national media regularly approach me about multiple team membership, hybrid work, and well-being at work. Coverage and interviews have appeared in Dutch national newspapers, news sites, and business podcasts. I also speak at industry symposia and at events organised by Dutch ministries. In June 2026 I gave an invited talk on three success factors for sustainable employability at the Zorgvisie congress on solutions for the tight healthcare labour market.',
            'Landelijke Nederlandse media benaderen mij regelmatig over multiple team membership, hybride werk en welzijn op het werk. Berichtgeving en interviews verschenen onder andere in landelijke kranten, op nieuwssites en in zakelijke podcasts. Ik spreek ook op sectorbijeenkomsten en op bijeenkomsten van Nederlandse ministeries. In juni 2026 gaf ik op uitnodiging de presentatie <em>3 succesfactoren voor duurzame inzetbaarheid</em> op het Zorgvisie-congres over oplossingen voor de krappe arbeidsmarkt in de zorg.'
          )}</p>
        </div>
      </div>
    </section>

    <section class="cta-strip">
      <div class="wrap">
        <div>
          <h2>${T('Open to new partnerships', 'Open voor nieuwe samenwerkingen')}</h2>
          <p>${T(
            'Please contact me if your organisation has questions about team design, hybrid work, multiple team membership, engagement, or burnout. The first conversation is free, and if I am not the right person for your question, I will tell you so.',
            'Neem contact met mij op als uw organisatie vragen heeft over teamontwerp, hybride werk, multiple team membership, betrokkenheid of burn-out. Het eerste gesprek is vrijblijvend, en als ik niet de juiste persoon voor uw vraag ben, zeg ik dat.'
          )}</p>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <a class="btn btn-red" href="mailto:h.j.van.de.brake@rug.nl">${T('Email me', 'Mail me')}</a>
          <a class="btn btn-ghost" href="${U('/contact/')}">${T('More contact details →', 'Meer contactgegevens →')}</a>
        </div>
      </div>
    </section>`;
  },

  resources(){
    document.getElementById('pg-resources').innerHTML = `
    <div class="pg-hd"><div class="wrap"><p class="eye">${T('Resources', 'Materiaal')}</p><h1>${T('Tools and materials', 'Tools en materiaal')}</h1><p>${T(
      'This page brings together tools and teaching materials on teamwork and the organisation of work, as well as on the use of AI. You can use the cases in class, try the tools at work, or download the materials from recent talks.',
      'Op deze pagina staan tools en onderwijsmateriaal over teamwerk en de organisatie van werk, en over het gebruik van AI. U kunt de cases in het onderwijs gebruiken, de tools in uw werk uitproberen of materiaal uit recente lezingen downloaden.'
    )}</p></div></div>

    <section class="sec">
      <div class="wrap">
        <div class="block">
          <h2 class="block-h">${T('Available resources', 'Beschikbaar materiaal')}</h2>
          <div class="resource-list">
            <div class="card resource-card featured">
              <span class="card-tag teal">${T('Interactive tool and teaching cases', 'Interactieve tool en onderwijscases')}</span>
              <h3>${T('Multiple Team Membership Resources', 'Materiaal over werken in meerdere teams')}</h3>
              <p>${T(
                'This collection is for employees who work across several teams, the people who coordinate their work, HR professionals, and educators who teach teamwork.',
                'Deze verzameling is bedoeld voor medewerkers die in meerdere teams werken, de mensen die hun werk coördineren, HR-professionals en docenten die onderwijs geven over teamwork.'
              )}</p>
              <p>${T(
                'The MTM Portfolio Navigator helps users map how one working week is divided across teams and choose a small change to test. One classroom case compares two employees who belong to the same number of teams but experience very different workweeks. The second case asks how a team leader should use someone’s outside experience after that person returns to the regular team. Both cases include separate instructor guides.',
                'De MTM Portfolio Navigator helpt gebruikers in kaart te brengen hoe één werkweek over teams is verdeeld en een kleine verandering te kiezen om uit te proberen. De ene onderwijscase vergelijkt twee medewerkers die in evenveel teams werken maar heel verschillende werkweken ervaren. De tweede case vraagt hoe een teamleider iemands externe ervaring kan benutten nadat die persoon terugkeert naar het vaste team. Beide cases hebben een aparte docentenhandleiding.'
              )}</p>
              <p class="meta"><span>${T('INTERACTIVE TOOL', 'INTERACTIEVE TOOL')}</span><span>${T('TWO CASES', 'TWEE CASES')}</span><span>${T('INSTRUCTOR GUIDES', 'DOCENTENHANDLEIDINGEN')}</span><span>${T('SUPPORTED BY NWO', 'ONDERSTEUND DOOR NWO')}</span></p>
              <a class="btn btn-red" href="${U('/mtm-resources/')}">${T('Explore the MTM tools and cases', 'Bekijk de MTM-tool en cases')}</a>
            </div>
            <div class="card resource-card" id="learn-with-ai">
              <span class="card-tag teal">Video</span>
              <h3>Learn with AI, learn without it</h3>
              <p>${T(
                'This six-minute animated video was made for a FEB workshop for PhD candidates and research master students. The video explains how PhD candidates can use AI in research while still building the skills that a PhD is meant to teach. It sorts research tasks by two questions, namely whether the skill is core to the researcher’s development and whether the researcher can already judge the output.',
                'Deze geanimeerde video van zes minuten is gemaakt voor een FEB-workshop voor promovendi en researchmasterstudenten. De video legt uit hoe promovendi AI in hun onderzoek kunnen gebruiken en tegelijk de vaardigheden kunnen opbouwen die een promotietraject hoort te leren. De video deelt onderzoekstaken in aan de hand van twee vragen, namelijk of de vaardigheid tot de kern van de eigen ontwikkeling hoort en of de onderzoeker de uitkomst al goed kan beoordelen.'
              )}</p>
              <p class="meta"><span>${T('ENGLISH', 'ENGELSTALIG')}</span><span>6 MIN</span><span>FULL HD</span></p>
              <a class="btn btn-red" href="/video/learn-with-ai/" target="_blank" rel="noopener">${T('Watch the video', 'Bekijk de video')}</a>
            </div>
            <div class="card resource-card" id="northgrid">
              <span class="card-tag teal">${T('Teaching case', 'Onderwijscasus')}</span>
              <h3>${T('NorthGrid: can AI prepare annual accounts?', 'NorthGrid: kan AI een jaarrekening maken?')}</h3>
              <p>${T(
                'This Dutch-language case for financial and management controllers describes how the AI tool Codex worked through the year-end close of a fictional organisation. The case is meant for discussing what AI can do and what the controller still needs to assess.',
                'Deze casus voor financial en management controllers beschrijft hoe het AI-hulpmiddel Codex de jaarafsluiting van een fictieve organisatie uitwerkte. De casus is bedoeld om te bespreken wat AI kan en wat de controller nog moet beoordelen.'
              )}</p>
              <p class="meta"><span>${T('DUTCH', 'NEDERLANDSTALIG')}</span><span>${T('21 SLIDES', '21 DIA’S')}</span><span><a href="/resources/northgrid/NorthGrid_casus_2026.zip" download>${T('Package (45.6 MB)', 'Pakket (45,6 MB)')}</a></span><span><a href="/resources/northgrid/jaarverslag-2026.pdf">${T('Report (PDF)', 'Verslag (PDF)')}</a></span></p>
              <a class="btn btn-red" href="/resources/northgrid/presentatie.html">${T('Open presentation', 'Open presentatie')}</a>
            </div>
            <div class="card resource-card">
              <span class="card-tag">PowerPoint</span>
              <h3>Zorgvisie 2026: Duurzame Inzetbaarheid</h3>
              <p>${T(
                'These are the slides of my Zorgvisie 2026 session on sustainable employability in healthcare.',
                'Dit zijn de dia’s van mijn sessie op Zorgvisie 2026 over duurzame inzetbaarheid in de zorg.'
              )}</p>
              <p class="meta"><span>PPTX</span><span>3.4 MB</span></p>
              <a class="btn btn-red" href="/assets/downloads/zorgvisie-2026-duurzame-inzetbaarheid.pptx" download>${T('Download PowerPoint', 'Download PowerPoint')}</a>
            </div>
            <div class="card resource-card">
              <span class="card-tag teal">PDF</span>
              <h3>Praktijkmemo Duurzame Inzetbaarheid - Zorgvisie 2026</h3>
              <p>${T(
                'This practice memo accompanies my Zorgvisie 2026 session on sustainable employability in healthcare.',
                'Deze praktijkmemo hoort bij mijn sessie op Zorgvisie 2026 over duurzame inzetbaarheid in de zorg.'
              )}</p>
              <p class="meta"><span>PDF</span><span>324 KB</span></p>
              <a class="btn btn-red" href="/assets/downloads/praktijkmemo-duurzame-inzetbaarheid-zorgvisie-2026.pdf" download>${T('Download memo', 'Download memo')}</a>
            </div>
            <div class="card resource-card">
              <span class="card-tag">Online exam</span>
              <h3>Teamwork online practice exam</h3>
              <p>${T(
                'Practise the 2026–2027 exam format with 20 multiple-choice questions, four open questions, and automatic feedback.',
                'Oefen de tentamenvorm van 2026–2027 met 20 meerkeuzevragen, vier open vragen en automatische feedback.'
              )}</p>
              <p class="meta"><span>ONLINE</span><span>100 points</span></p>
              <a class="btn btn-red" href="/teamwork-practice-exam/?v=20260806-4">${T('Start practice exam', 'Start oefententamen')}</a>
            </div>
          </div>
          <p style="margin-top:32px;font-size:12px;color:#a3abb3"><a href="/resources/ai-research-feb/" style="color:inherit;text-decoration:none">${T('AI and research at FEB (working document)', 'AI en onderzoek bij FEB (werkdocument)')}</a></p>
        </div>
      </div>
    </section>`;
  },

  contact(){
    document.getElementById('pg-contact').innerHTML = `
    <div class="pg-hd"><div class="wrap"><p class="eye">${T('Contact', 'Contact')}</p><h1>${T('Get in touch', 'Neem contact op')}</h1></div></div>

    <section class="sec">
      <div class="wrap">
        <div class="ct-cols">
          <div>
            <p class="ct-desc">${T(
              'Email is the fastest way to reach me, and I read messages within one working day. Whether you are a prospective collaborator, an organisation interested in a project, a PhD candidate, or a journalist, I am happy to have a first call to understand what you are working on.',
              'U bereikt mij het snelst per e-mail, en ik lees berichten binnen één werkdag. Of u nu een mogelijke samenwerkingspartner bent, een organisatie met een projectvraag, een promovendus of een journalist, ik voer graag een eerste gesprek om te begrijpen waaraan u werkt.'
            )}</p>
            <div style="display:flex;gap:10px;flex-wrap:wrap">
              <a class="btn btn-red" href="mailto:h.j.van.de.brake@rug.nl">${T('Email me', 'Mail me')}</a>
              <a class="btn btn-ghost" href="https://www.rug.nl/staff/h.j.van.de.brake/" target="_blank" rel="noopener">${T('UG profile →', 'RUG-profiel →')}</a>
            </div>
          </div>
          <div class="ci-grid">
            <div class="ci"><p class="ci-l">${T('Name', 'Naam')}</p><p class="ci-v">Joost van de Brake<br>${T('My formal name is Hendrik J. van de Brake, and academic records also use the forms H. J. van de Brake and HJ van de Brake.', 'Mijn formele naam is Hendrik J. van de Brake, en in academische registers worden ook de vormen H. J. van de Brake en HJ van de Brake gebruikt.')}</p></div>
            <div class="ci"><p class="ci-l">${T('Email', 'E-mail')}</p><p class="ci-v"><a href="mailto:h.j.van.de.brake@rug.nl">h.j.van.de.brake@rug.nl</a></p></div>
            <div class="ci"><p class="ci-l">${T('Phone', 'Telefoon')}</p><p class="ci-v">+31 6 4571 4392</p></div>
            <div class="ci"><p class="ci-l">${T('Office', 'Werkadres')}</p><p class="ci-v">${T('Nettelbosje 2, 9747 AE Groningen, Netherlands', 'Nettelbosje 2, 9747 AE Groningen, Nederland')}</p></div>
            <div class="ci"><p class="ci-l">${T('Department', 'Afdeling')}</p><p class="ci-v">${T('HRM &amp; Organizational Behavior, Faculty of Economics and Business', 'HRM &amp; Organizational Behavior, Faculteit Economie en Bedrijfskunde')}</p></div>
            <div class="ci"><p class="ci-l">ORCID</p><p class="ci-v"><a href="https://orcid.org/0000-0001-5690-404X" target="_blank" rel="noopener">0000-0001-5690-404X</a></p></div>
            <div class="ci"><p class="ci-l">${T('Research portal', 'Onderzoeksportaal')}</p><p class="ci-v"><a href="https://research.rug.nl/en/persons/joost-van-de-brake/" target="_blank" rel="noopener">${T('Pure profile', 'Pure-profiel')}</a></p></div>
            <div class="ci"><p class="ci-l">Google Scholar</p><p class="ci-v"><a href="https://scholar.google.com/citations?user=TFGPoCAAAAAJ" target="_blank" rel="noopener">${T('Citations', 'Citaties')}</a></p></div>
            <div class="ci"><p class="ci-l">LinkedIn</p><p class="ci-v"><a href="https://www.linkedin.com/in/joost-van-de-brake-85620245/" target="_blank" rel="noopener">in/joost-van-de-brake</a></p></div>
          </div>
        </div>
      </div>
    </section>`;
  },
};

/* RENDERING
   Every page is a real document now. Each one declares which page it is on
   <body data-page="..."> and carries the matching #pg-... container. The hash
   router and its five hidden divs are gone. */
const curPage = document.body.dataset.page || 'home';

function renderPage(id){
  if (pages[id] && document.getElementById('pg-' + id)) pages[id]();
}

function closeMenu(){
  const ul = document.getElementById('nav-ul');
  const tg = document.getElementById('nav-toggle');
  if (ul) ul.classList.remove('open');
  if (tg) tg.setAttribute('aria-expanded', 'false');
}

document.getElementById('nav-toggle').addEventListener('click', function(){
  const open = document.getElementById('nav-ul').classList.toggle('open');
  this.setAttribute('aria-expanded', String(open));
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

document.getElementById('lb-en').addEventListener('click', () => setLang('en'));
document.getElementById('lb-nl').addEventListener('click', () => setLang('nl'));

window.addEventListener('scroll', () => {
  document.getElementById('mn').classList.toggle('scrolled', window.scrollY > 8);
});

/* INIT */
/* The AMJ video was briefly embedded at /research/#video. It now has a page
   of its own, so links shared in that window still reach it. */
if (curPage === 'research' && location.hash === '#video') location.replace('/video/connectivity-paradox/');

setLang(langFromUrl(), false);

/* The page body is rendered by this script, so a #fragment such as
   /research/#video can name an element that did not exist yet when the
   browser tried to scroll to it. */
if (location.hash) {
  const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (target) target.scrollIntoView({behavior: 'instant'});
}
