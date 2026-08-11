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

const PUBS = [
  {title:'More than just a number: Different conceptualizations of multiple team membership and their relationships with emotional exhaustion and turnover', auth:'Van de Brake, H. J., Van der Vegt, G. S., and Essens, P.', venue:'Journal of Applied Psychology, 109(5), 714 to 729', year:'2024', doi:'10.1037/apl0001168'},
  {title:'Can I leave my hat on? A cross-level study of multiple team membership role separation', auth:'Van de Brake, H. J., and Berger, S.', venue:'Personnel Psychology', year:'2023', doi:'10.1111/peps.12495'},
  {title:'Resource leverage, resource depletion: A multilevel perspective on multiple team membership', auth:'Berger, S., Van de Brake, H. J., and Bruch, H.', venue:'Journal of Applied Psychology', year:'2022', doi:'10.1037/apl0000889'},
  {title:'Benefits and disadvantages of individuals’ multiple team membership: The moderating role of organizational tenure', auth:'Van de Brake, H. J., Walter, F., Rink, F. A., Essens, P., and Van der Vegt, G. S.', venue:'Journal of Management Studies', year:'2020', doi:'10.1111/joms.12539'},
  {title:'The dynamic relationship between multiple team membership and individual job performance in knowledge-intensive work', auth:'Van de Brake, H. J., Walter, F., Rink, F. A., Essens, P., and Van der Vegt, G. S.', venue:'Journal of Organizational Behavior', year:'2018', doi:'10.1002/job.2260'},
  {title:'Crossover of emotional exhaustion in collaboration networks: The roles of hindrance stressors and organisational tenure', auth:'Wörtler, B., Van de Brake, H. J., and Van der Vegt, G. S.', venue:'Work and Stress', year:'2025', doi:'10.1080/02678373.2025.2551498'},
];

const WIP = [
  {title:'Multiple and fluid team membership, integrative framework',
   summary:'An overarching framework that integrates multiple team membership and fluid team membership, tested with 5,704 employees in 82 firms.',
   nl:{title:'Multiple en fluid team membership, geïntegreerd kader',
       summary:'Een overkoepelend kader dat multiple team membership en fluid team membership samenbrengt, getoetst onder 5.704 medewerkers in 82 organisaties.'}},
  {title:'Remote work configurations and psychological safety',
   summary:'How unit-level remote work intensity erodes psychological safety and performance, particularly when in-office schedules are uncoordinated.',
   nl:{title:'Remote-werkconfiguraties en psychologische veiligheid',
       summary:'Hoe de intensiteit van remote werk op afdelingsniveau psychologische veiligheid en prestaties ondermijnt, vooral wanneer kantoorroosters niet op elkaar aansluiten.'}},
  {title:'MTM, job crafting, and creativity',
   summary:'Multiple team membership enhances both radical and incremental creativity for employees with high growth-need strength, by triggering promotion-oriented job crafting.',
   nl:{title:'MTM, job crafting en creativiteit',
       summary:'Multiple team membership vergroot zowel radicale als incrementele creativiteit voor werknemers met een sterke behoefte aan groei, doordat het promotiegericht job crafting in gang zet.'}},
  {title:'Hybrid work and the social context of others',
   summary:'The individual effects of hybrid work depend not only on a person’s own work-from-home intensity but also on the work-from-home intensity of others in their social context.',
   nl:{title:'Hybride werk en de sociale context van anderen',
       summary:'De individuele effecten van hybride werk hangen niet alleen af van iemands eigen thuiswerkintensiteit, maar ook van de thuiswerkintensiteit van anderen in zijn of haar sociale context.'}},
  {title:'MTM through a social identity and status lens',
   summary:'A conceptual review arguing that the conflicting outcomes of multiple team membership are best explained by the psychosocial reality of juggling distinct identities and status hierarchies.',
   nl:{title:'MTM door een sociale-identiteits- en statusbril',
       summary:'Een conceptueel overzicht waarin wordt betoogd dat de tegenstrijdige uitkomsten van multiple team membership het beste te verklaren zijn vanuit de psychosociale realiteit van het jongleren met verschillende identiteiten en statushiërarchieën.'}},
];

const GRANTS = [
  {tag:'NWO Veni', year:'2022', amount:'€280,000',
   title:'The consequences of working in multiple teams at the same time',
   body:'Individual NWO Veni grant from the Dutch Research Council under the Talent Programme. The project investigates how employees experience and perform under multiple simultaneous team memberships, and how organisations can design work to make these arrangements sustainable.',
   nl:{title:'De gevolgen van het tegelijkertijd werken in meerdere teams',
       body:'Individuele NWO Veni-subsidie van de Nederlandse Organisatie voor Wetenschappelijk Onderzoek, binnen het Talentprogramma. Het project onderzoekt hoe medewerkers het gelijktijdig lidmaatschap van meerdere teams ervaren en hoe ze daarbij presteren, en hoe organisaties hun werk zo kunnen inrichten dat deze werkvormen op de lange termijn houdbaar blijven.'}},
  {tag:'ZonMw', year:'2020', amount:'€200,000',
   title:'COVID-19 impact on hospital staff well-being',
   body:'Main applicant and principal investigator with Maxim Laurijssen, Peter Essens, and Gerben van der Vegt. The project tracked the well-being of hospital staff during the pandemic and informed leadership training at a large Dutch general hospital.',
   nl:{title:'Impact van COVID-19 op het welzijn van ziekenhuispersoneel',
       body:'Hoofdaanvrager en projectleider, samen met Maxim Laurijssen, Peter Essens en Gerben van der Vegt. Het project volgde het welzijn van ziekenhuispersoneel tijdens de pandemie en vormde de basis voor leiderschapstraining in een groot Nederlands algemeen ziekenhuis.'}},
  {tag:'Fulbright', year:'2016', amount:'€3,000',
   title:'Visiting Scholar at Duke Network Analysis Center',
   body:'Exchange scholarship from the Netherlands America Commission for Educational Exchange, supporting collaborative research with Jonathon Cummings at Duke University.',
   nl:{title:'Gastonderzoeker bij het Duke Network Analysis Center',
       body:'Uitwisselingsbeurs van de Nederlands-Amerikaanse Commissie voor Educatieve Uitwisseling, ter ondersteuning van onderzoek met Jonathon Cummings aan Duke University.'}},
];

const AWARDS = [
  {year:'2025', name:'Academy of Management Conference Best Paper Award', body:'OB Division, Academy of Management annual meeting.',
   nl:{body:'OB Division, jaarlijkse conferentie van de Academy of Management.'}},
  {year:'2024 and 2025', name:'Academy of Management Best Reviewer Award', body:'Awarded for sustained, high-quality peer review at the annual meeting of the Academy of Management.',
   nl:{year:'2024 en 2025', body:'Toegekend voor langdurige, kwalitatief hoogwaardige peer review op de jaarlijkse conferentie van de Academy of Management.'}},
  {year:'2022', name:'Early Career Research Award', body:'Faculty of Economics and Business Research Institute, University of Groningen.',
   nl:{body:'FEB Research Institute, Rijksuniversiteit Groningen.'}},
  {year:'2020', name:'Best Dissertation Award, runner-up', body:'FEB Research Institute, University of Groningen.',
   nl:{name:'Best Dissertation Award, tweede plaats', body:'FEB Research Institute, Rijksuniversiteit Groningen.'}},
  {year:'2019', name:'Journal of Organizational Behavior Best Paper Award, runner-up', body:'For the 2018 paper on multiple team membership and individual job performance.',
   nl:{name:'Journal of Organizational Behavior Best Paper Award, tweede plaats', body:'Voor het artikel uit 2018 over multiple team membership en individuele werkprestatie.'}},
  {year:'2017', name:'Best Paper Proceedings', body:'Academy of Management annual meeting.',
   nl:{body:'Jaarlijkse conferentie van de Academy of Management.'}},
  {year:'2014', name:'Master’s Thesis Award', body:'Dutch Sociological Association.',
   nl:{name:'Scriptieprijs Master', body:'Nederlandse Sociologische Vereniging.'}},
];

const TEACHING = [
  {role:'Course Coordinator', code:'EBB110A05', title:'Teamwork, Theories, Design, and Dynamics',
   programme:'BSc Business Administration, University of Groningen', since:'2022 to present',
   body:'An in-depth introduction to work teams for future management professionals. The course covers classic and contemporary theories of team composition, design, and process, alongside the challenges of modern team arrangements such as multiple team membership, virtual collaboration, and hybrid work.',
   link:'https://ocasys.rug.nl/2025-2026/catalog/course/EBB110A05',
   nl:{role:'Coördinator',
       programme:'BSc Bedrijfskunde, Rijksuniversiteit Groningen', since:'2022 tot heden',
       body:'Een diepgaande inleiding in werkteams voor toekomstige managementprofessionals. Het vak behandelt klassieke en hedendaagse theorieën over teamsamenstelling, ontwerp en processen, naast de uitdagingen van moderne teamarrangementen zoals multiple team membership, virtuele samenwerking en hybride werk.'}},
  {role:'Course Coordinator', title:'Executive HR Programma Duurzame Inzetbaarheid',
   programme:'University of Groningen Business School', since:'2025 to present',
   body:'Executive programme for HR professionals on sustainable employability, covering stress, motivation, collaboration, performance, and absenteeism.',
   link:'https://www.rug.nl/business-school/executive-programmas/hr-programma-duurzame-inzetbaarheid/',
   nl:{role:'Coördinator',
       programme:'University of Groningen Business School', since:'2025 tot heden',
       body:'Executive programma voor HR-professionals over duurzame inzetbaarheid, met aandacht voor stress, motivatie, samenwerking, prestaties en verzuim.'}},
  {role:'Lecturer', title:'Organizational Behavior and Change Management',
   programme:'UGBS Executive Master of Finance and Control', since:'2023 to present',
   body:'Senior executive education on how leadership, motivation, and team dynamics shape organisational change. Targeted at finance and control professionals taking on broader management roles.',
   nl:{role:'Docent',
       programme:'UGBS Executive Master of Finance and Control', since:'2023 tot heden',
       body:'Executive onderwijs over hoe leiderschap, motivatie en teamdynamiek organisatieverandering vormgeven. Gericht op finance- en controlprofessionals die bredere managementrollen op zich nemen.'}},
  {role:'Tutor', title:'Gedrag in Organisaties',
   programme:'BSc Business Administration, University of Groningen', since:'2025 to present',
   body:'Tutorials for three groups on the foundations of organisational behaviour.',
   nl:{role:'Werkgroepdocent',
       programme:'BSc Bedrijfskunde, Rijksuniversiteit Groningen', since:'2025 tot heden',
       body:'Werkcolleges voor drie groepen over de fundamenten van organisatiegedrag.'}},
  {role:'Lecturer', title:'FEBRI Publishing Workshop for PhD Students',
   programme:'FEB Research Institute', since:'2022 to present',
   body:'Annual workshop that trains FEB PhD students on the practical craft of getting published in management and applied-psychology outlets.',
   nl:{role:'Docent',
       programme:'FEB Research Institute', since:'2022 tot heden',
       body:'Jaarlijkse workshop waarin promovendi van de FEB worden getraind in de praktijk van publiceren in management- en applied-psychologietijdschriften.'}},
];

const OFFERINGS = [
  {h:'Diagnose what is going on',
   body:'I run rigorous employee surveys and big-data analyses to identify the root causes of engagement, burnout, turnover, and team performance issues. Findings are translated into a clear narrative for HR, project controllers, and top management.',
   nl:{h:'Diagnose stellen',
       body:'Ik voer rigoureuze medewerkersonderzoeken en big-data-analyses uit om de oorzaken van problemen rond betrokkenheid, burn-out, verloop en teamprestaties bloot te leggen. De bevindingen vertaal ik naar een helder verhaal voor HR, projectcontrollers en de directie.'}},
  {h:'Design and evaluate interventions',
   body:'I help organisations design experiments, pilots, and longitudinal studies that test whether new ways of working actually move the needle, before they are rolled out at scale.',
   nl:{h:'Interventies ontwerpen en evalueren',
       body:'Ik help organisaties bij het opzetten van experimenten, pilots en longitudinale studies die toetsen of nieuwe manieren van werken daadwerkelijk verschil maken, voordat ze breed worden uitgerold.'}},
  {h:'Train and coach leaders',
   body:'I translate research findings into actionable workshops for team leaders, department heads, and HR professionals. The sessions are practical, grounded in evidence, and tailored to the work people actually do.',
   nl:{h:'Leidinggevenden trainen en coachen',
       body:'Ik vertaal onderzoeksbevindingen naar concrete workshops voor teamleiders, afdelingshoofden en HR-professionals. De sessies zijn praktisch, evidence-based en afgestemd op het werk dat mensen daadwerkelijk doen.'}},
];

const ORGS = [
  {org:'TNO', window:'2017 to present', kind:'Long-term research partnership',
   body:'An eight-year partnership with the Netherlands Organisation for Applied Scientific Research. Annual workforce engagement survey of more than 4,000 knowledge workers, plus targeted studies on burnout, turnover, and team familiarity. Eight training sessions for approximately 60 team and department leaders since 2022, focused on translating findings into changes in work design.',
   nl:{window:'2017 tot heden', kind:'Langlopende onderzoekssamenwerking',
       body:'Een achtjarige samenwerking met TNO. Jaarlijks medewerkersonderzoek onder meer dan 4.000 kenniswerkers, naast gerichte studies over burn-out, verloop en team familiarity. Sinds 2022 acht trainingssessies voor ongeveer 60 team- en afdelingshoofden, gericht op het vertalen van bevindingen naar aanpassingen in werkontwerp.'}},
  {org:'Amphia Ziekenhuis Breda', window:'2017, 2021', kind:'Engagement survey and Covid-19 leader training',
   body:'A 2017 staff engagement survey at Amphia, followed by leader training during the pandemic. Between May and July 2021 I trained 17 leaders on how to support their subordinates through the acute phase of Covid-19.',
   meta:'ZonMw-funded follow-up',
   nl:{kind:'Medewerkersonderzoek en leiderschapstraining tijdens corona',
       body:'Een medewerkersonderzoek bij Amphia in 2017, gevolgd door leiderschapstraining tijdens de pandemie. Tussen mei en juli 2021 trainde ik 17 leidinggevenden in het ondersteunen van hun medewerkers tijdens de acute fase van Covid-19.',
       meta:'Vervolgproject met ZonMw-financiering'}},
  {org:'Gemeente Assen', kind:'Engagement and team research',
   body:'Applied engagement research for the municipality, with follow-up meetings to translate findings into HR and management actions.',
   nl:{kind:'Onderzoek naar betrokkenheid en teamfunctioneren',
       body:'Toegepast onderzoek naar betrokkenheid voor de gemeente, met vervolgsessies om de bevindingen te vertalen naar HR- en managementacties.'}},
  {org:'GGZ Nederland', kind:'Research and practice translation',
   body:'Applied work with the umbrella organisation for Dutch mental health care, on workforce well-being and team functioning.',
   nl:{kind:'Onderzoek en vertaling naar de praktijk',
       body:'Toegepast werk met de koepelorganisatie van de Nederlandse GGZ, gericht op welzijn van medewerkers en teamfunctioneren.'}},
  {org:'Ministry of Social Affairs and Employment, and Ministry of Defence', kind:'Invited research talks',
   body:'Invited presentations at Dutch ministries, including a Wetenschapsdag on multiple team membership at the Ministry of Social Affairs and Employment and a network symposium on networks and social capital at the Ministry of Defence.',
   nl:{org:'Ministerie van Sociale Zaken en Werkgelegenheid, en Ministerie van Defensie',
       kind:'Lezingen op uitnodiging',
       body:'Presentaties op uitnodiging bij Nederlandse ministeries, waaronder een Wetenschapsdag over multiple team membership bij het Ministerie van Sociale Zaken en Werkgelegenheid en een netwerksymposium over netwerken en sociaal kapitaal bij het Ministerie van Defensie.'}},
];

const HIGHLIGHTS = [
  {label:'Research Director', value:'Organizational Behaviour programme', sub:'Faculty of Economics and Business, University of Groningen',
   nl:{label:'Onderzoeksdirecteur', value:'Programma Organisatiegedrag', sub:'Faculteit Economie en Bedrijfskunde, Rijksuniversiteit Groningen'}},
  {label:'Applied research', value:'10+ years', sub:'Research institutes, hospitals, infrastructure, ministries',
   nl:{label:'Toegepast onderzoek', value:'10+ jaar', sub:'Onderzoeksinstituten, ziekenhuizen, infrastructuur, ministeries'}},
  {label:'Editorial role', value:'Associate Editor', sub:'Group and Organization Management',
   nl:{label:'Redactiefunctie'}},
  {label:'NWO Veni laureate', value:'2022', sub:'Multiple team membership',
   nl:{label:'NWO Veni-laureaat', sub:'Multiple team membership'}},
];

const QUICK_FACTS = [
  {l:'Position', v:'Associate Professor', s:'FEB, University of Groningen',
   nl:{l:'Functie', v:'Universitair hoofddocent', s:'FEB, Rijksuniversiteit Groningen'}},
  {l:'Research Director', v:'Organizational Behaviour programme', s:'FEB, University of Groningen',
   nl:{l:'Onderzoeksdirecteur', v:'Programma Organisatiegedrag', s:'FEB, Rijksuniversiteit Groningen'}},
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
  return `<div class="pub-item"><div><p class="pub-title">${p.title}</p><p class="pub-auth">${p.auth}</p><p class="pub-venue">${p.venue}, ${p.year}</p></div>${p.doi?`<a class="pub-doi" href="https://doi.org/${p.doi}" target="_blank" rel="noopener">doi:${p.doi}</a>`:''}</div>`;
}

const pages = {
  home(){
    const topPubs = PUBS.slice(0, 3);
    document.getElementById('pg-home').innerHTML = `
    <section class="hero">
      <div class="hero-wrap">
        <div class="hero-content">
          <p class="eye">${T('Teams · Collaboration · Hybrid work · Modern workplace', 'Teams · Samenwerking · Hybride werk · Moderne werkplek')}</p>
          <h1 class="h1">Joost van de Brake</h1>
          <p class="hero-tagline">${T(
            'Research and teaching on modern teamwork.',
            'Onderzoek en onderwijs over modern teamwerk.'
          )}</p>
          <p class="lead">${T(
            'I study how people work together within and across teams, and translate that work into education, executive teaching, and partnerships with organisations. Particular focus on multiple team membership, hybrid work, and the stress and strain of modern team arrangements.',
            'Ik bestudeer hoe mensen samenwerken binnen en tussen teams, en vertaal dat werk naar onderwijs, executive opleidingen en samenwerkingen met organisaties. Specifiek gericht op multiple team membership, hybride werk en de stress en spanning van moderne teamarrangementen.'
          )}</p>
          <div class="hero-btns">
            <a class="btn btn-red" href="${U('/research/')}">${T('Research', 'Onderzoek')}</a>
            <a class="btn btn-ghost" href="${U('/teaching/')}">${T('Teaching', 'Onderwijs')}</a>
            <a class="btn btn-ghost" href="${U('/practice/')}">${T('Working with organisations', 'Samenwerking met de praktijk')}</a>
          </div>
        </div>
        <div class="portrait"><picture><source srcset="/portrait-staff.webp" type="image/webp"><img src="/portrait-staff.png" alt="${T('Portrait of Joost van de Brake', 'Portret van Joost van de Brake')}" width="420" height="560" loading="eager" fetchpriority="high"></picture></div>
      </div>
    </section>

    <section class="highlights" aria-label="${T('Highlights', 'Hoogtepunten')}">
      <div class="highlights-grid">
        ${HIGHLIGHTS.map(h=>`<div class="hl-item"><p class="label">${L(h,'label')}</p><p class="value">${L(h,'value')}</p><p class="sub">${L(h,'sub')}</p></div>`).join('')}
      </div>
    </section>

    <section class="sec">
      <div class="wrap">
        <div class="sec-head">
          <div>
            <p class="eye">${T('Applied work', 'Toegepast werk')}</p>
            <h2 class="h2">${T('Working with organisations', 'Samenwerking met de praktijk')}</h2>
          </div>
          <a class="btn btn-ghost btn-sm" href="${U('/practice/')}">${T('How I work →', 'Hoe ik werk →')}</a>
        </div>
        <p class="lead" style="margin-bottom:24px;max-width:680px">${T(
          'Partnerships and applied projects, grounded in research and based on years of work with organisations.',
          'Samenwerkingen en toegepaste projecten, op wetenschappelijke basis en met jarenlange ervaring binnen organisaties.'
        )}</p>
        <div class="home-offers">
          ${OFFERINGS.map(o=>`<div class="off"><h3>${L(o,'h')}</h3><p>${L(o,'body')}</p></div>`).join('')}
        </div>
      </div>
    </section>

    <section class="sec alt">
      <div class="wrap">
        <div class="sec-head">
          <div>
            <p class="eye">${T('Selected publications', 'Geselecteerde publicaties')}</p>
            <h2 class="h2">${T('Recent publications', 'Recente publicaties')}</h2>
          </div>
          <a class="btn btn-ghost btn-sm" href="${U('/research/')}">${T('All publications →', 'Alle publicaties →')}</a>
        </div>
        <div class="featured-pubs">
          ${topPubs.map(p=>`<article class="fp"><p class="venue">${p.venue.split(',')[0]}</p><p class="title">${p.title}</p><p class="auth">${p.auth}</p>${p.doi?`<a class="doi-link" href="https://doi.org/${p.doi}" target="_blank" rel="noopener">doi:${p.doi} →</a>`:''}</article>`).join('')}
        </div>
      </div>
    </section>

    <section class="sec">
      <div class="wrap">
        <div class="sec-head"><div><p class="eye">${T('Explore', 'Verken de site')}</p><h2 class="h2">${T('Five ways in', 'Vijf ingangen')}</h2></div></div>
        <div class="aud-grid">
          <a class="aud-card" href="${U('/research/')}">
            <h3>${T('Research', 'Onderzoek')}</h3>
            <p>${T(
              'Full publication record, current work in progress, grants, awards, and editorial roles. Publications on multiple team membership and the stress and strain of modern teamwork.',
              'Volledig publicatieoverzicht, lopend werk, subsidies, prijzen en redactionele rollen. Publicaties over multiple team membership en de stress en spanning van modern teamwerk.'
            )}</p>
            <span class="aud-card-cue">${T('See research →', 'Bekijk onderzoek →')}</span>
          </a>
          <a class="aud-card" href="${U('/teaching/')}">
            <h3>${T('Teaching', 'Onderwijs')}</h3>
            <p>${T(
              'BSc, MSc, and executive courses on teams and organisational behaviour. PhD supervision on modern team arrangements. Invited talks at universities and ministries.',
              'BSc-, MSc- en executive vakken over teams en organisatiegedrag. Begeleiding van promovendi op het terrein van moderne teamarrangementen. Lezingen op uitnodiging bij universiteiten en ministeries.'
            )}</p>
            <span class="aud-card-cue">${T('See teaching →', 'Bekijk onderwijs →')}</span>
          </a>
          <a class="aud-card" href="${U('/practice/')}">
            <h3>${T('Working with organisations', 'Samenwerking met de praktijk')}</h3>
            <p>${T(
              'How I work with HR teams, leadership, and project controllers on team and collaboration challenges. Partnerships with research institutes, hospitals, infrastructure companies, ministries, and others.',
              'Hoe ik samenwerk met HR-teams, leidinggevenden en projectcontrollers aan team- en samenwerkingsvraagstukken. Samenwerkingen met onderzoeksinstituten, ziekenhuizen, infrastructuurbedrijven, ministeries en anderen.'
            )}</p>
            <span class="aud-card-cue">${T('How I work with companies →', 'Hoe ik met organisaties werk →')}</span>
          </a>
          <a class="aud-card" href="${U('/mtm-resources/')}">
            <h3>${T('Multiple team membership resources', 'Materiaal over werken in meerdere teams')}</h3>
            <p>${T(
              'The dedicated MTM page combines the Portfolio Navigator with two classroom cases and separate instructor guides.',
              'De aparte MTM-pagina combineert de Portfolio Navigator met twee onderwijscases en aparte docentenhandleidingen.'
            )}</p>
            <span class="aud-card-cue">${T('Open the MTM resources →', 'Open het MTM-materiaal →')}</span>
          </a>
          <a class="aud-card" href="${U('/resources/')}">
            <h3>${T('Resources', 'Materiaal')}</h3>
            <p>${T(
              'Download slides and practical materials from recent talks and teaching sessions.',
              'Download slides en praktisch materiaal van recente lezingen en onderwijssessies.'
            )}</p>
            <span class="aud-card-cue">${T('View resources &rarr;', 'Bekijk materiaal &rarr;')}</span>
          </a>
        </div>
      </div>
    </section>

`;
  },

  research(){
    document.getElementById('pg-research').innerHTML = `
    <div class="pg-hd has-figure"><div class="wrap">
      <div class="pg-hd-text"><p class="eye">${T('Research', 'Onderzoek')}</p><h1>${T('Teams, networks, and the modern shape of work', 'Teams, netwerken en de moderne vormgeving van werk')}</h1><p>${T(
      'My research investigates how people work together within and across teams in modern organisations.',
      'Mijn onderzoek bestudeert hoe mensen samenwerken binnen en tussen teams in moderne organisaties.'
    )}</p></div>
      <figure class="pg-hd-figure">
        <img src="/assets/illustrations/research.webp" width="800" height="600"
             alt="${T('Joost van de Brake at a desk, annotating a manuscript beside notebooks, printed charts, a network diagram, and a stack of organisational behaviour books.', 'Joost van de Brake aan zijn bureau, met aantekeningen in een manuscript, naast notitieboeken, uitgeprinte grafieken, een netwerkdiagram en een stapel boeken over organisatiegedrag.')}"
             loading="eager" decoding="async">
      </figure>
    </div></div>

    <section class="sec">
      <div class="wrap">
        <div class="block">
          <h2 class="block-h">${T('About my research', 'Over mijn onderzoek')}</h2>
          <p>${T(
            'Two threads run through my work. The first is the now-common arrangement of <strong>multiple team membership</strong>, in which employees contribute to several project teams at once, and the stress and strain it can produce for individuals and teams. The second is the <strong>temporal and network context</strong> of collaboration that decides whether teamwork holds up under hybrid work, turnover, and disruption.',
            'Twee thema\'s lopen door mijn werk. Het eerste is het inmiddels veelvoorkomende verschijnsel van <strong>multiple team membership</strong>, waarbij medewerkers tegelijkertijd bijdragen aan meerdere projectteams, en de stress en spanning die dit kan opleveren voor individuen en teams. Het tweede is de <strong>temporele en netwerkcontext</strong> van samenwerking, die bepaalt of teamwerk standhoudt onder hybride werk, verloop en verstoring.'
          )}</p>

          <p>${T(
            'A central line of work develops the theory and empirics of multiple team membership. Two papers in the <em>Journal of Applied Psychology</em> set out the core findings: the 2024 paper shows that <a href="https://doi.org/10.1037/apl0001168" target="_blank" rel="noopener">how multiple team membership is conceptualised and measured</a> shapes its relationship with emotional exhaustion and turnover, and the 2022 paper with Stefan Berger and Heike Bruch frames the underlying mechanism as a multilevel trade-off between <a href="https://doi.org/10.1037/apl0000889" target="_blank" rel="noopener">resource leverage and resource depletion</a>. A paper in <em>Personnel Psychology</em> with Berger shows that <a href="https://doi.org/10.1111/peps.12495" target="_blank" rel="noopener">the cost rises when work roles across teams differ rather than overlap</a>. A study in the <em>Journal of Management Studies</em> documents how <a href="https://doi.org/10.1111/joms.12539" target="_blank" rel="noopener">performance effects depend on employees’ organisational tenure</a>. Earlier longitudinal evidence in the <em>Journal of Organizational Behavior</em> established that the <a href="https://doi.org/10.1002/job.2260" target="_blank" rel="noopener">link between multiple team membership and individual job performance is dynamic</a>, evolving as employees move between teams.',
            'Een centrale onderzoekslijn ontwikkelt de theorie en empirie van multiple team membership. Twee artikelen in het <em>Journal of Applied Psychology</em> zetten de kern uiteen: het artikel uit 2024 laat zien dat <a href="https://doi.org/10.1037/apl0001168" target="_blank" rel="noopener">de manier waarop multiple team membership wordt geconceptualiseerd en gemeten</a> bepaalt hoe het samenhangt met emotionele uitputting en verloop, en het artikel uit 2022 met Stefan Berger en Heike Bruch beschrijft het onderliggende mechanisme als een meerlaagse afweging tussen <a href="https://doi.org/10.1037/apl0000889" target="_blank" rel="noopener">resource leverage en resource depletion</a>. Een artikel in <em>Personnel Psychology</em> met Berger laat zien dat <a href="https://doi.org/10.1111/peps.12495" target="_blank" rel="noopener">de kosten oplopen wanneer de werkrollen tussen teams van elkaar verschillen in plaats van overeenkomen</a>. Onderzoek in het <em>Journal of Management Studies</em> documenteert hoe <a href="https://doi.org/10.1111/joms.12539" target="_blank" rel="noopener">prestatie-effecten afhangen van de diensttijd van medewerkers in hun organisatie</a>. Eerder longitudinaal onderzoek in het <em>Journal of Organizational Behavior</em> toonde aan dat de <a href="https://doi.org/10.1002/job.2260" target="_blank" rel="noopener">relatie tussen multiple team membership en individuele werkprestatie dynamisch is</a> en zich ontwikkelt naarmate medewerkers tussen teams bewegen.'
          )}</p>

          <p>${T(
            'A second strand examines the temporal and network context of teamwork. Ongoing projects ask when hybrid work-from-home arrangements help or harm individuals and teams, how unit-level remote-work configurations affect psychological safety, coordination, and performance, and how stress and strain such as emotional exhaustion travel through everyday collaboration networks. Across both strands the agenda is the same: to take modern team arrangements seriously, and to translate what the evidence shows into the design of work.',
            'Een tweede onderzoekslijn richt zich op de temporele en netwerkcontext van teamwerk. Lopende projecten onderzoeken wanneer hybride thuiswerkarrangementen individuen en teams helpen of schaden, hoe remote-werkconfiguraties op afdelingsniveau de psychologische veiligheid, coördinatie en prestaties beïnvloeden, en hoe stress en spanning zoals emotionele uitputting zich verspreiden via dagelijkse samenwerkingsnetwerken. Over beide onderzoekslijnen heen blijft de agenda hetzelfde: moderne teamarrangementen serieus nemen en de evidence vertalen naar de inrichting van werk.'
          )}</p>
        </div>

        <div class="block">
          <h2 class="block-h">${T('Selected publications', 'Geselecteerde publicaties')}</h2>
          <div class="pub-list">${PUBS.map(publication).join('')}</div>
          <p style="font-size:0.82rem;color:var(--ink-600);font-style:italic;margin-top:14px">${T(
            'A curated selection of peer-reviewed work. The full list, including books and chapters, is on <a href="https://research.rug.nl/en/persons/joost-van-de-brake/publications/" target="_blank" rel="noopener" style="color:var(--red)">Pure</a> and <a href="https://scholar.google.com/citations?user=TFGPoCAAAAAJ" target="_blank" rel="noopener" style="color:var(--red)">Google Scholar</a>.',
            'Een geselecteerde lijst van peer-reviewed publicaties. De volledige lijst, inclusief boeken en hoofdstukken, staat op <a href="https://research.rug.nl/en/persons/joost-van-de-brake/publications/" target="_blank" rel="noopener" style="color:var(--red)">Pure</a> en <a href="https://scholar.google.com/citations?user=TFGPoCAAAAAJ" target="_blank" rel="noopener" style="color:var(--red)">Google Scholar</a>.'
          )}</p>
        </div>

        <div class="block">
          <h2 class="block-h">${T('Grants', 'Onderzoekssubsidies')}</h2>
          <div class="card-grid">
            ${GRANTS.map(g=>`<div class="card"><span class="card-tag">${g.tag}, ${g.year}</span><h3>${L(g,'title')}</h3><p>${L(g,'body')}</p><div class="meta"><span>${g.amount}</span></div></div>`).join('')}
          </div>
        </div>

        <div class="block">
          <h2 class="block-h">${T('Current work in progress', 'Lopend werk')}</h2>
          <ul>
            ${WIP.map(w=>`<li><p class="li-h">${L(w,'title')}</p><p class="li-body">${L(w,'summary')}</p></li>`).join('')}
          </ul>
          <p style="font-size:0.92rem;color:var(--ink-700);line-height:1.7;margin-top:18px">${T(
            'If you are working on related questions and would like to explore a collaboration, please <a href="mailto:h.j.van.de.brake@rug.nl" style="color:var(--red)">send me an email</a>.',
            'Werkt u aan verwante vragen en wilt u een samenwerking verkennen? Stuur me dan <a href="mailto:h.j.van.de.brake@rug.nl" style="color:var(--red)">een mailtje</a>.'
          )}</p>
        </div>

        <div class="block">
          <h2 class="block-h">${T('Editorial and service', 'Redactie en bestuurlijke rollen')}</h2>
          <ul>
            <li><p class="li-h">${T('Associate Editor, Group and Organization Management', 'Associate Editor, Group and Organization Management')}</p><p class="li-body">${T('I review and shepherd submissions on teams, multiple team membership, and modern work arrangements.', 'Ik beoordeel en begeleid manuscripten over teams, multiple team membership en moderne werkarrangementen.')}</p></li>
            <li><p class="li-h">${T('Interview panel member, NWO Veni', 'Lid commissie NWO Veni')}</p><p class="li-body">${T('Served on the Veni interview panel of the Dutch Research Council in the Social Sciences and Humanities domain, panel <em>Economics and Business Administration</em>, evaluating proposals from early-career researchers.', 'Lid van de interviewcommissie van NWO Veni in het domein Sociale en Geesteswetenschappen, panel <em>Economie en Bedrijfskunde</em>, voor het beoordelen van voorstellen van early-career onderzoekers.')}</p></li>
            <li><p class="li-h">${T('Academy of Management, Making Connections Committee', 'Academy of Management, Making Connections Committee')}</p><p class="li-body">${T('Active in the OB Division of the Academy of Management. Ten consecutive years of presenting, organising professional development workshops, and acting as a discussant at the annual research symposium on multiple team membership.', 'Actief in de OB Division van de Academy of Management. Tien opeenvolgende jaren actief met presentaties, het organiseren van professional development workshops en als discussant op het jaarlijkse onderzoekssymposium over multiple team membership.')}</p></li>
            <li><p class="li-h">${T('Institutional Review Board, FEB, University of Groningen', 'Institutional Review Board, FEB, Rijksuniversiteit Groningen')}</p><p class="li-body">${T('Reviewing research-ethics applications for the Faculty of Economics and Business.', 'Beoordelen van aanvragen rond onderzoeksethiek voor de Faculteit Economie en Bedrijfskunde.')}</p></li>
            <li><p class="li-h">${T('FEB Research Institute (FEBRI)', 'FEB Research Institute (FEBRI)')}</p><p class="li-body">${T('FEBRI Fellow, reviewer and discussant at the annual FEBRI conference, lecturer at the FEBRI publishing workshop for PhD students.', 'FEBRI Fellow, reviewer en discussant op de jaarlijkse FEBRI-conferentie, en docent in de FEBRI-publicatieworkshop voor promovendi.')}</p></li>
            <li><p class="li-h">${T('Ad-hoc reviewing', 'Ad-hoc reviews')}</p><p class="li-body">${T('Academy of Management Journal, Organization Science, Management Science, and others.', 'Academy of Management Journal, Organization Science, Management Science en andere tijdschriften.')}</p></li>
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
      <div class="pg-hd-text"><p class="eye">${T('Teaching', 'Onderwijs')}</p><h1>${T('Research-driven teaching on teams, leadership, and modern work', 'Onderzoeksgedreven onderwijs over teams, leiderschap en modern werk')}</h1><p>${T(
      'I teach management students, business administration students, and senior executives about the challenges of modern work arrangements: team dynamics, multiple team membership, hybrid work, and sustainable employability. The approach bridges academic theory and practical application, and I actively involve students in my own research projects.',
      'Ik geef onderwijs aan studenten Management en Bedrijfskunde en aan senior leidinggevenden over de uitdagingen van moderne werkarrangementen: teamdynamiek, multiple team membership, hybride werk en duurzame inzetbaarheid. Mijn aanpak verbindt academische theorie met praktische toepassing, en ik betrek studenten actief bij mijn eigen onderzoeksprojecten.'
    )}</p></div>
      <figure class="pg-hd-figure">
        <img src="/assets/illustrations/teaching.webp" width="800" height="600"
             alt="${T('Joost van de Brake teaching a full lecture hall, with a network diagram and charts on the screen behind him.', 'Joost van de Brake geeft college in een volle collegezaal, met een netwerkdiagram en grafieken op het scherm achter hem.')}"
             loading="eager" decoding="async">
      </figure>
    </div></div>

    <section class="sec">
      <div class="wrap">
        <div class="block">
          <h2 class="block-h">${T('Approach', 'Aanpak')}</h2>
          <p>${T(
            'Students learn best when they can apply theory to real problems, and when the people teaching them have skin in the research game. My BSc, MSc, and executive teaching all draw on case material from organisations I work with, including applied research institutes, hospitals, energy and infrastructure companies, municipalities, public-sector agencies, and banks.',
            'Studenten leren het meest wanneer ze theorie toepassen op echte vraagstukken en wanneer hun docenten zelf actief onderzoek doen. Mijn onderwijs op BSc-, MSc- en executive niveau gebruikt casuïstiek van organisaties waarmee ik samenwerk, waaronder toegepaste onderzoeksinstituten, ziekenhuizen, energie- en infrastructuurbedrijven, gemeenten, publieke instanties en banken.'
          )}</p>
          <p>${T(
            'In 2020 I completed the University Teaching Qualification (UTQ / BKO).',
            'In 2020 heb ik de Basiskwalificatie Onderwijs (BKO) behaald.'
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
          <h2 class="block-h">${T('PhD supervision', 'Begeleiding promovendi')}</h2>
          <p>${T(
            'I supervise PhD candidates as daily supervisor on questions related to modern team arrangements, including multiple team membership, hybrid and remote work, and employee well-being. Across my career I have also supervised approximately 150 BSc and MSc theses, almost all of them on practical questions from organisations such as applied research institutes, energy and infrastructure companies, municipalities, public-sector agencies, and banks.',
            'Ik begeleid promovendi als dagelijks begeleider op vraagstukken rond moderne teamarrangementen, waaronder multiple team membership, hybride en remote werk, en welzijn van medewerkers. In de loop van mijn carrière heb ik daarnaast ongeveer 150 BSc- en MSc-scripties begeleid, vrijwel altijd over praktische vraagstukken bij organisaties zoals toegepaste onderzoeksinstituten, energie- en infrastructuurbedrijven, gemeenten, publieke instanties en banken.'
          )}</p>
          <p>${T(
            'I am open to supervising new PhD candidates working on related topics. If that sounds like you, please <a href="mailto:h.j.van.de.brake@rug.nl" style="color:var(--red)">get in touch</a>.',
            'Ik sta open voor het begeleiden van nieuwe promovendi die aan verwante onderwerpen werken. Klinkt dat als jou? <a href="mailto:h.j.van.de.brake@rug.nl" style="color:var(--red)">Neem contact op</a>.'
          )}</p>
        </div>

        <div class="block">
          <h2 class="block-h">${T('Invited talks and seminars', 'Lezingen en seminars op uitnodiging')}</h2>
          <p>${T(
            'My work has been the topic of invited talks at universities and ministries in the Netherlands and abroad. Recent academic venues include Rotterdam School of Management, the University of Amsterdam, the University of Tilburg, and the University of Giessen. I have also given invited presentations at Dutch ministries. Earlier in my career I gave a seminar at the Duke Network Analysis Center as part of my Fulbright stay.',
            'Mijn werk is onderwerp geweest van lezingen op uitnodiging bij universiteiten en ministeries in Nederland en daarbuiten. Recente academische gelegenheden zijn onderzoeksseminars aan Rotterdam School of Management, de Universiteit van Amsterdam, Tilburg University en de Universiteit van Gießen. Daarnaast heb ik presentaties gegeven op uitnodiging bij Nederlandse ministeries. Eerder in mijn loopbaan gaf ik een seminar aan het Duke Network Analysis Center tijdens mijn Fulbright-verblijf.'
          )}</p>
          <p>${T(
            'Between 2022 and 2025 I organised the research seminar series for the Department of HRM and Organizational Behavior, hosting roughly eight visiting speakers per year.',
            'Tussen 2022 en 2025 organiseerde ik de onderzoeksseminarreeks van de afdeling HRM and Organizational Behavior, met ongeveer acht gastsprekers per jaar.'
          )}</p>
          <p>${T(
            'If you would like me to speak at an event, please <a href="mailto:h.j.van.de.brake@rug.nl" style="color:var(--red)">send me an email</a>.',
            'Wilt u dat ik een lezing geef op een evenement? Stuur me dan <a href="mailto:h.j.van.de.brake@rug.nl" style="color:var(--red)">een mailtje</a>.'
          )}</p>
        </div>
      </div>
    </section>`;
  },

  practice(){
    document.getElementById('pg-practice').innerHTML = `
    <div class="pg-hd has-figure"><div class="wrap">
      <div class="pg-hd-text"><p class="eye">${T('Working with organisations', 'Samenwerking met de praktijk')}</p><h1>${T('Evidence-based help with team and collaboration challenges', 'Evidence-based ondersteuning bij vraagstukken rond teams en samenwerking')}</h1><p>${T(
      'I work with HR teams, leadership, and project controllers in organisations that want to take their team and people questions seriously, and act on what the evidence actually shows. Past partners include applied research institutes, hospitals, energy and infrastructure companies, national healthcare bodies, municipalities, and ministries. I am open to new partnerships.',
      'Ik werk samen met HR-teams, leidinggevenden en projectcontrollers in organisaties die hun team- en mensvraagstukken serieus willen aanpakken en willen handelen op basis van wat de evidence laat zien. Eerdere partners zijn onder andere toegepaste onderzoeksinstituten, ziekenhuizen, energie- en infrastructuurbedrijven, landelijke zorgkoepels, gemeenten en ministeries. Ik sta open voor nieuwe samenwerkingen.'
    )}</p></div>
      <figure class="pg-hd-figure">
        <img src="/assets/illustrations/practice.webp" width="800" height="600"
             alt="${T('Joost van de Brake in discussion with five colleagues around a table covered in printed charts and network diagrams.', 'Joost van de Brake in gesprek met vijf collega’s rond een tafel vol uitgeprinte grafieken en netwerkdiagrammen.')}"
             loading="eager" decoding="async">
      </figure>
    </div></div>

    <section class="sec">
      <div class="wrap">
        <div class="block">
          <h2 class="block-h">${T('How I add value', 'Wat ik te bieden heb')}</h2>
          <div class="off-grid">
            ${OFFERINGS.map(o=>`<div class="off"><h3>${L(o,'h')}</h3><p>${L(o,'body')}</p></div>`).join('')}
          </div>
        </div>

        <div class="block">
          <h2 class="block-h">${T('How I work', 'Hoe ik werk')}</h2>
          <p>${T(
            'I treat applied projects as scientific work, not consultancy. That means I use validated instruments, design studies that can be repeated, and report findings honestly, including what does not work. Most projects combine survey data with administrative records (engagement, turnover, absenteeism, performance), and many run as longitudinal partnerships rather than one-off snapshots.',
            'Ik behandel toegepaste projecten als wetenschappelijk werk, niet als consultancy. Dat betekent dat ik gevalideerde instrumenten gebruik, studies opzet die herhaalbaar zijn, en eerlijk rapporteer over de bevindingen, ook over wat niet werkt. De meeste projecten combineren enquêtegegevens met administratieve data (betrokkenheid, verloop, verzuim, prestaties), en lopen vaak als langlopende samenwerkingen in plaats van eenmalige momentopnames.'
          )}</p>
          <p>${T(
            'Where it helps, I bring PhD students or postdocs into the project, which keeps costs proportionate and the research close to the latest theory. Every project ends with a written report and a working session with the people who have to act on the findings.',
            'Waar het helpt, betrek ik promovendi of postdocs bij het project. Dat houdt de kosten beheersbaar en het onderzoek dicht bij de meest recente inzichten. Elk project eindigt met een geschreven rapport en een werksessie met de mensen die met de bevindingen aan de slag moeten.'
          )}</p>
        </div>

        <div class="block">
          <h2 class="block-h">${T('Selected partnerships and projects', 'Geselecteerde samenwerkingen en projecten')}</h2>
          <div class="proj-grid">
            ${ORGS.map(o=>{
              const org = L(o,'org');
              const window = L(o,'window');
              const kind = L(o,'kind');
              const body = L(o,'body');
              const meta = L(o,'meta');
              return `<div class="proj"><p class="proj-org">${org}</p>${window?`<p class="proj-window">${window} · ${kind}</p>`:`<p class="proj-window">${kind}</p>`}<p class="proj-body">${body}</p>${meta?`<p class="proj-meta">${meta}</p>`:''}</div>`;
            }).join('')}
          </div>
        </div>

        <div class="block">
          <h2 class="block-h">${T('Media and public engagement', 'Media en maatschappelijke betrokkenheid')}</h2>
          <p>${T(
            'I am regularly approached by Dutch national media on multiple team membership, hybrid work, and workplace well-being. Coverage and interviews have appeared in Dutch national newspapers, news sites, and business podcasts. I also speak at industry symposia and at events organised by Dutch ministries.',
            'Ik word regelmatig benaderd door Nederlandse landelijke media over multiple team membership, hybride werk en welzijn op het werk. Berichtgeving en interviews verschenen onder andere in landelijke kranten, nieuwssites en businesspodcasts. Ik spreek ook op sectorbijeenkomsten en op bijeenkomsten van Nederlandse ministeries.'
          )}</p>
        </div>
      </div>
    </section>

    <section class="cta-strip">
      <div class="wrap">
        <div>
          <h2>${T('Open to new partnerships', 'Open voor nieuwe samenwerkingen')}</h2>
          <p>${T(
            'Get in touch if your organisation is wrestling with team design, hybrid work, multiple team memberships, engagement, or burnout. The first conversation is free, and I will tell you honestly if there is no good fit.',
            'Neem contact op als uw organisatie worstelt met teamontwerp, hybride werk, multiple team memberships, betrokkenheid of burn-out. Het eerste gesprek is vrijblijvend en ik zeg het eerlijk wanneer ik niet de juiste persoon ben.'
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
      'Find practical tools and teaching materials based on my research. Employees, team leaders, HR professionals, and project managers can use the tools to examine how work is organised across teams. Educators can use the cases and instructor guides in class. This page also includes selected slides and practice notes from talks and applied projects.',
      'Hier vindt u praktische tools en onderwijsmateriaal op basis van mijn onderzoek. Medewerkers, teamleiders, HR-professionals en projectmanagers kunnen de tools gebruiken om te bekijken hoe werk over teams is georganiseerd. Docenten kunnen de cases en handleidingen in hun onderwijs gebruiken. De pagina bevat ook geselecteerde slides en praktijknotities uit lezingen en toegepaste projecten.'
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
                'The MTM Portfolio Navigator helps users map how one working week is divided across teams and choose a small change to test. One classroom case compares two employees who belong to the same number of teams but experience very different workweeks. The other asks how a team leader should use someone’s outside experience after that person returns to the regular team. Both cases include separate instructor guides.',
                'De MTM Portfolio Navigator helpt gebruikers in kaart te brengen hoe één werkweek over teams is verdeeld en een kleine verandering te kiezen om uit te proberen. De ene onderwijscase vergelijkt twee medewerkers die in evenveel teams werken maar heel verschillende werkweken ervaren. De andere vraagt hoe een teamleider iemands externe ervaring kan benutten nadat die persoon terugkeert naar het vaste team. Beide cases hebben een aparte docentenhandleiding.'
              )}</p>
              <p class="meta"><span>${T('INTERACTIVE TOOL', 'INTERACTIEVE TOOL')}</span><span>${T('TWO CASES', 'TWEE CASES')}</span><span>${T('INSTRUCTOR GUIDES', 'DOCENTENHANDLEIDINGEN')}</span><span>${T('SUPPORTED BY NWO', 'ONDERSTEUND DOOR NWO')}</span></p>
              <a class="btn btn-red" href="${U('/mtm-resources/')}">${T('Explore the MTM tools and cases', 'Bekijk de MTM-tool en cases')}</a>
            </div>
            <div class="card resource-card">
              <span class="card-tag">PowerPoint</span>
              <h3>Zorgvisie 2026: Duurzame Inzetbaarheid</h3>
              <p>${T(
                'Presentation deck for the Zorgvisie 2026 session on sustainable employability in healthcare.',
                'Presentatiedeck voor de Zorgvisie 2026-sessie over duurzame inzetbaarheid in de zorg.'
              )}</p>
              <p class="meta"><span>PPTX</span><span>3.4 MB</span></p>
              <a class="btn btn-red" href="/assets/downloads/zorgvisie-2026-duurzame-inzetbaarheid.pptx" download>${T('Download PowerPoint', 'Download PowerPoint')}</a>
            </div>
            <div class="card resource-card">
              <span class="card-tag teal">PDF</span>
              <h3>Praktijkmemo Duurzame Inzetbaarheid - Zorgvisie 2026</h3>
              <p>${T(
                'Practice memo for the Zorgvisie 2026 session on sustainable employability in healthcare.',
                'Praktijkmemo voor de Zorgvisie 2026-sessie over duurzame inzetbaarheid in de zorg.'
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
              'The fastest way to reach me is by email. I read messages within a working day, and I am happy to take a first call to understand what you are working on, whether you are a prospective collaborator, an organisation interested in a project, a PhD candidate, or a journalist.',
              'De snelste manier om me te bereiken is per e-mail. Ik lees berichten binnen een werkdag en ben graag bereid een eerste gesprek te voeren om te begrijpen waaraan u werkt, of u nu een potentiële samenwerkingspartner bent, een organisatie met een projectvraag, een promovendus of een journalist.'
            )}</p>
            <div style="display:flex;gap:10px;flex-wrap:wrap">
              <a class="btn btn-red" href="mailto:h.j.van.de.brake@rug.nl">${T('Email me', 'Mail me')}</a>
              <a class="btn btn-ghost" href="https://www.rug.nl/staff/h.j.van.de.brake/" target="_blank" rel="noopener">${T('UG profile →', 'RUG-profiel →')}</a>
            </div>
          </div>
          <div class="ci-grid">
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
setLang(langFromUrl(), false);

