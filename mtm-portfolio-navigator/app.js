(function () {
  'use strict';

  const data = window.MTM_CONTENT;
  const params = new URLSearchParams(window.location.search);
  const initialLang = params.get('lang') === 'nl' ? 'nl' : 'en';
  const initialMode = params.get('mode');
  const initialExample = ['fragmented', 'anchored'].includes(params.get('example')) ? params.get('example') : null;

  const state = {
    lang: initialLang,
    view: initialMode === 'status-case' ? 'case' : 'intro',
    step: 0,
    answers: {},
    results: null,
    example: null,
    caseId: initialMode === 'status-case' ? 'status' : null,
    returnView: 'intro',
    caseChoice: null,
    caseChecked: false,
    plan: null
  };

  const appView = document.getElementById('app-view');

  function t(key) {
    return data.copy[state.lang][key] || data.copy.en[key] || key;
  }

  function l(value) {
    if (value === undefined || value === null) return '';
    if (typeof value === 'string') return value;
    return value[state.lang] || value.en || '';
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function setLanguage(nextLang) {
    state.lang = nextLang === 'nl' ? 'nl' : 'en';
    document.documentElement.lang = state.lang;
    document.querySelectorAll('[data-lang]').forEach((button) => {
      const active = button.dataset.lang === state.lang;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    const url = new URL(window.location.href);
    if (state.lang === 'nl') url.searchParams.set('lang', 'nl');
    else url.searchParams.delete('lang');
    history.replaceState(null, '', url.pathname + url.search + url.hash);
    renderStaticCopy();
    renderEvidence();
    renderMethod();
    renderApp();
  }

  function renderStaticCopy() {
    document.querySelectorAll('[data-copy]').forEach((node) => {
      const value = t(node.dataset.copy);
      if (value) node.textContent = value;
    });
    document.querySelectorAll('[data-copy="back"], [data-copy="resources"]').forEach((node) => {
      node.setAttribute('href', state.lang === 'nl' ? '../mtm-resources/?lang=nl' : '../mtm-resources/');
    });
    document.querySelectorAll('[data-copy="teachingCasesButton"]').forEach((node) => {
      node.setAttribute('href', state.lang === 'nl' ? '../mtm-resources/?lang=nl#educators' : '../mtm-resources/#educators');
    });
    document.querySelectorAll('[data-aria-copy]').forEach((node) => {
      const value = t(node.dataset.ariaCopy);
      if (value) node.setAttribute('aria-label', value);
    });
  }

  function statusLabel(status) {
    const labels = {
      published: t('evidencePublished'),
      accepted: t('evidenceAccepted'),
      rr: t('evidenceRR'),
      review: t('evidenceReview'),
      theory: t('evidenceTheory')
    };
    return labels[status] || status;
  }

  function renderEvidence() {
    const grid = document.getElementById('evidence-grid');
    grid.innerHTML = data.evidence.map((item) => `
      <article class="evidence-card">
        <span class="evidence-status status-${item.status}">${escapeHtml(statusLabel(item.status))}</span>
        <h3>${escapeHtml(l(item.title))}</h3>
        <p class="evidence-citation">${escapeHtml(item.citation)}</p>
        <p>${escapeHtml(l(item.finding))}</p>
        <a href="${escapeHtml(item.url)}" ${item.url.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>${escapeHtml(t('researchBehind'))} <span aria-hidden="true">→</span></a>
      </article>
    `).join('');
  }

  function renderMethod() {
    document.getElementById('method-content').innerHTML = `
      <p>${escapeHtml(t('methodBody1'))}</p>
      <p>${escapeHtml(t('methodBody2'))}</p>
      <p>${escapeHtml(t('methodBody3'))}</p>
      <p>${escapeHtml(t('methodBody4'))}</p>
      <p class="method-note">${escapeHtml(t('methodVersion'))}</p>
    `;
  }

  function renderApp() {
    if (state.view === 'intro') renderIntro();
    if (state.view === 'assessment') renderStep();
    if (state.view === 'results') renderResults();
    if (state.view === 'case') renderCase();
  }

  function renderIntro() {
    appView.innerHTML = `
      <div class="intro-grid">
        <div class="intro-main">
          <p class="app-kicker">${escapeHtml(t('introKicker'))}</p>
          <h2>${escapeHtml(t('introTitle'))}</h2>
          <p class="app-lead">${escapeHtml(t('introBody'))}</p>
          <div class="intro-points">
            ${[
              ['01', t('introPoint1Title'), t('introPoint1Body')],
              ['02', t('introPoint2Title'), t('introPoint2Body')],
              ['03', t('introPoint3Title'), t('introPoint3Body')],
              ['04', t('introPoint4Title'), t('introPoint4Body')]
            ].map((point) => `
              <div class="intro-point">
                <span>${point[0]}</span>
                <div><h3>${escapeHtml(point[1])}</h3><p>${escapeHtml(point[2])}</p></div>
              </div>
            `).join('')}
          </div>
          <button type="button" class="button button-primary button-large" id="begin-assessment">${escapeHtml(t('begin'))}</button>
        </div>
        <aside class="example-panel">
          <p class="small-label">${escapeHtml(t('tryExample'))}</p>
          <button type="button" class="example-button" data-preset="fragmented">
            <span class="example-icon example-fragmented" aria-hidden="true"></span>
            <span><strong>${escapeHtml(t('exampleFragmented'))}</strong><small>${escapeHtml(l(data.cases.fragmented.meta))}</small></span>
            <span aria-hidden="true">→</span>
          </button>
          <button type="button" class="example-button" data-preset="anchored">
            <span class="example-icon example-anchored" aria-hidden="true"></span>
            <span><strong>${escapeHtml(t('exampleAnchored'))}</strong><small>${escapeHtml(l(data.cases.anchored.meta))}</small></span>
            <span aria-hidden="true">→</span>
          </button>
        </aside>
      </div>
    `;

    document.getElementById('begin-assessment').addEventListener('click', startAssessment);
    appView.querySelectorAll('[data-preset]').forEach((button) => {
      button.addEventListener('click', () => loadPreset(button.dataset.preset));
    });
    appView.querySelectorAll('[data-case]').forEach((button) => {
      button.addEventListener('click', () => openCase(button.dataset.case, 'intro'));
    });
  }

  function startAssessment() {
    state.answers = {};
    state.results = null;
    state.example = null;
    state.step = 0;
    state.view = 'assessment';
    renderApp();
    focusApp();
  }

  function loadPreset(name) {
    state.answers = Object.assign({}, data.presets[name]);
    state.example = name;
    state.results = calculateResults(state.answers);
    state.view = 'results';
    renderApp();
    focusApp();
  }

  function progressMarkup() {
    return `
      <div class="stepper" role="list" aria-label="${escapeHtml(t('ariaProgress'))}">
        ${data.steps.map((step, index) => `
          <div class="stepper-item ${index === state.step ? 'is-current' : ''} ${index < state.step ? 'is-complete' : ''}" role="listitem" ${index === state.step ? 'aria-current="step"' : ''}>
            <span>${index + 1}</span>
            <small>${escapeHtml(l(step.title))}</small>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderStep() {
    const step = data.steps[state.step];
    appView.innerHTML = `
      ${progressMarkup()}
      <div class="assessment-head">
        <p class="app-kicker">${escapeHtml(t('step'))} ${state.step + 1} ${escapeHtml(t('of'))} ${data.steps.length}</p>
        <h2>${escapeHtml(l(step.title))}</h2>
        <p>${escapeHtml(l(step.intro))}</p>
      </div>
      <form id="step-form" novalidate>
        <div class="question-list">
          ${step.questions.map((question, questionIndex) => renderQuestion(question, questionIndex)).join('')}
        </div>
        <div class="validation-message" id="validation-message" role="alert" hidden>${escapeHtml(t('missing'))}</div>
        <div class="form-actions">
          ${state.step > 0 ? `<button type="button" class="button button-secondary" id="step-back">${escapeHtml(t('previous'))}</button>` : '<span></span>'}
          <button type="submit" class="button button-primary">${escapeHtml(state.step === data.steps.length - 1 ? t('showResults') : t('next'))}</button>
        </div>
      </form>
    `;

    const form = document.getElementById('step-form');
    form.addEventListener('change', (event) => {
      if (!event.target.matches('input[type="radio"]')) return;
      state.answers[event.target.name] = Number(event.target.value);
      form.querySelectorAll(`input[name="${event.target.name}"]`).forEach((input) => {
        input.closest('.option-card').classList.toggle('is-selected', input.checked);
      });
      document.getElementById('validation-message').hidden = true;
    });
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const unanswered = step.questions.filter((question) => state.answers[question.id] === undefined);
      if (unanswered.length) {
        const message = document.getElementById('validation-message');
        message.hidden = false;
        const first = form.querySelector(`input[name="${unanswered[0].id}"]`);
        if (first) first.focus();
        return;
      }
      if (state.step < data.steps.length - 1) {
        state.step += 1;
        renderApp();
        focusApp();
      } else {
        state.results = calculateResults(state.answers);
        state.view = 'results';
        renderApp();
        focusApp();
      }
    });
    const back = document.getElementById('step-back');
    if (back) back.addEventListener('click', () => {
      state.step -= 1;
      renderApp();
      focusApp();
    });
  }

  function renderQuestion(question, questionIndex) {
    return `
      <fieldset class="question-card">
        <legend><span>${String(questionIndex + 1).padStart(2, '0')}</span>${escapeHtml(l(question.prompt))}</legend>
        <div class="option-grid option-count-${question.options.length}">
          ${question.options.map((option, optionIndex) => {
            const checked = state.answers[question.id] === option.value;
            return `
              <label class="option-card ${checked ? 'is-selected' : ''}">
                <input type="radio" name="${escapeHtml(question.id)}" value="${option.value}" ${checked ? 'checked' : ''}>
                <span class="option-marker" aria-hidden="true">${String.fromCharCode(65 + optionIndex)}</span>
                <span>${escapeHtml(option[state.lang] || option.en)}</span>
              </label>
            `;
          }).join('')}
        </div>
        <details class="question-note">
          <summary>${escapeHtml(t('whyAsk'))}</summary>
          <p>${escapeHtml(l(question.note))}</p>
        </details>
      </fieldset>
    `;
  }

  function calculateResults(answers) {
    const levels = {
      fragmentation: answers.switching >= 3 || (answers.switching >= 1 && answers.protectedTime >= 4)
        ? 2
        : (answers.switching >= 1 || answers.protectedTime >= 2 || answers.allocation >= 4 ? 1 : 0),
      roleFriction: answers.roleConflict >= 2 && (answers.roleSeparation >= 2 || answers.priorityControl >= 2)
        ? 2
        : (answers.roleConflict >= 2 || answers.roleSeparation >= 2 || answers.priorityControl >= 2 ? 1 : 0),
      attentionConfiguration: answers.relationalExclusivity >= 2 && answers.expertiseDistance >= 2
        ? 2
        : (answers.relationalExclusivity >= 2 || answers.expertiseDistance >= 2 ? 1 : 0),
      leverage: answers.roleSynergy >= 4 ? 2 : (answers.roleSynergy >= 2 ? 1 : 0),
      transition: answers.statusShift >= 3 || (answers.fluidity >= 3 && answers.familiarity >= 2)
        ? 2
        : (answers.statusShift >= 1 || answers.fluidity >= 2 || answers.familiarity >= 2 ? 1 : 0)
    };

    const candidates = [];
    if (answers.switching >= 3 || (answers.switching >= 1 && answers.protectedTime >= 4)) {
      candidates.push({key: 'fragmentation', level: levels.fragmentation, order: 0});
    }
    if (answers.roleConflict >= 2 && (answers.roleSeparation >= 2 || answers.priorityControl >= 2)) {
      candidates.push({key: 'roles', level: levels.roleFriction, order: 1});
    }
    if (answers.expertiseDistance >= 2 && answers.relationalExclusivity >= 2) {
      candidates.push({key: 'attention', level: levels.attentionConfiguration, order: 2});
    }
    if (answers.orgKnowhow >= 2) {
      candidates.push({key: 'tenure', level: answers.orgKnowhow >= 4 ? 2 : 1, order: 3});
    }
    if (answers.fluidity >= 3) {
      candidates.push({key: 'fluidity', level: answers.fluidity >= 4 ? 2 : 1, order: 4});
    }
    if (answers.statusShift >= 3) {
      candidates.push({key: 'status', level: answers.statusShift >= 4 ? 2 : 1, order: 5});
    }

    const activated = candidates
      .sort((a, b) => b.level - a.level || a.order - b.order)
      .map((item) => item.key);
    const priorities = activated.slice(0, 4);

    return {
      levels,
      priorities,
      activated,
      strength: levels.leverage === 2 ? 'leverage' : null
    };
  }

  function signalBand(level, key) {
    if (key === 'leverage') {
      if (level === 0) return {label: t('resourceNone'), className: 'light'};
      if (level === 1) return {label: t('resourcePossible'), className: 'noticeable'};
      return {label: t('resourceStrong'), className: 'positive'};
    }
    if (key === 'transition') {
      if (level === 0) return {label: t('transitionNone'), className: 'light'};
      if (level === 1) return {label: t('transitionPresent'), className: 'noticeable'};
      return {label: t('transitionMultiple'), className: 'strong'};
    }
    if (level === 0) return {label: t('signalLight'), className: 'light'};
    if (level === 1) return {label: t('signalNoticeable'), className: 'noticeable'};
    return {label: t('signalStrong'), className: 'strong'};
  }

  function signalExplanation(key) {
    const a = state.answers;
    const explanations = {
      en: {
        fragmentation: `Moves between teams: ${selectedLabel('switching')}; longer focus blocks: ${selectedLabel('protectedTime')}.`,
        roleFriction: `Differences between team roles: ${selectedLabel('roleSeparation')}; competing demands: ${selectedLabel('roleConflict')}.`,
        attentionConfiguration: `Colleagues who appear in one team: ${selectedLabel('relationalExclusivity')}; different fields and working methods: ${selectedLabel('expertiseDistance')}.`,
        leverage: `Work in one team helps another: ${selectedLabel('roleSynergy')}; say over priorities: ${selectedLabel('priorityControl')}.`,
        transition: `Your influence after returning: ${selectedLabel('statusShift')}; teams changing over time: ${selectedLabel('fluidity')}.`
      },
      nl: {
        fragmentation: `Wisselingen tussen teams: ${selectedLabel('switching')}; langere focusblokken: ${selectedLabel('protectedTime')}.`,
        roleFriction: `Verschillen tussen teamrollen: ${selectedLabel('roleSeparation')}; botsende eisen: ${selectedLabel('roleConflict')}.`,
        attentionConfiguration: `Collega's die in één team voorkomen: ${selectedLabel('relationalExclusivity')}; verschillende vakgebieden en werkwijzen: ${selectedLabel('expertiseDistance')}.`,
        leverage: `Werk in het ene team helpt het andere: ${selectedLabel('roleSynergy')}; zeggenschap over prioriteiten: ${selectedLabel('priorityControl')}.`,
        transition: `Uw invloed na terugkeer: ${selectedLabel('statusShift')}; teams die in de tijd veranderen: ${selectedLabel('fluidity')}.`
      }
    };
    return explanations[state.lang][key] || String(a[key] || '');
  }

  function renderResults() {
    if (!state.results) state.results = calculateResults(state.answers);
    const {levels, priorities, activated, strength} = state.results;
    const additionalPatterns = activated.filter((key) => !priorities.includes(key));
    const signalOrder = ['fragmentation', 'roleFriction', 'attentionConfiguration', 'leverage', 'transition'];
    const primaryCase = priorities.length ? data.recommendations[priorities[0]].case : 'anchored';

    appView.innerHTML = `
      <div class="results-head">
        <div>
          <p class="app-kicker">${escapeHtml(state.example ? t('resultsForExample') : t('resultsKicker'))}</p>
          <h2>${escapeHtml(t('resultsTitle'))}</h2>
          <p>${escapeHtml(t('resultsIntro'))}</p>
        </div>
        <div class="results-actions no-print">
          <button type="button" class="button button-secondary" id="print-results">${escapeHtml(t('printResult'))}</button>
          <button type="button" class="text-button" id="reset-results">${escapeHtml(t('restart'))}</button>
        </div>
      </div>
      ${state.example ? `<div class="example-notice">${escapeHtml(t('exampleNotice'))}</div>` : ''}

      <div class="results-overview">
        <section class="portfolio-panel">
          <div class="panel-heading"><span>01</span><h3>${escapeHtml(t('portfolioMap'))}</h3></div>
          <div class="portfolio-visual" role="img" aria-label="${escapeHtml(t('portfolioMapNote'))}">
            ${portfolioCircles()}
          </div>
          <p class="panel-note">${escapeHtml(t('portfolioMapNote'))}</p>
          <dl class="portfolio-facts">
            ${factMarkup('teamCount')}
            ${factMarkup('allocation')}
            ${factMarkup('tenure')}
            ${factMarkup('orgKnowhow')}
          </dl>
        </section>

        <section class="signals-panel">
          <div class="panel-heading"><span>02</span><h3>${escapeHtml(t('signals'))}</h3></div>
          <div class="signal-list">
            ${signalOrder.map((key) => {
              const band = signalBand(levels[key], key);
              return `
                <div class="signal-row">
                  <div class="signal-label"><strong>${escapeHtml(l(data.signals[key]))}</strong><span class="signal-band ${band.className}">${escapeHtml(band.label)}</span></div>
                  <p>${escapeHtml(signalExplanation(key))}</p>
                </div>
              `;
            }).join('')}
          </div>
        </section>
      </div>

      <section class="priority-section">
        <div class="section-title-row">
          <div><p class="app-kicker">03</p><h3>${escapeHtml(t('prioritiesTitle'))}</h3><p>${escapeHtml(t('prioritiesIntro'))}</p></div>
        </div>
        ${priorities.length ? `<div class="priority-list">${priorities.map((key, index) => recommendationMarkup(key, index + 1)).join('')}</div>` : `<div class="no-priority">${escapeHtml(t('noPriority'))}</div>`}
        ${additionalPatterns.length ? `
          <details class="additional-priorities">
            <summary>${escapeHtml(t('additionalPatterns'))} (${additionalPatterns.length})</summary>
            <p>${escapeHtml(t('additionalPatternsIntro'))}</p>
            <div class="priority-list">${additionalPatterns.map((key) => recommendationMarkup(key, '+')).join('')}</div>
          </details>
        ` : ''}
      </section>

      ${strength ? `
        <section class="strength-section">
          <p class="small-label">${escapeHtml(t('strengthTitle'))}</p>
          ${recommendationMarkup(strength, '+', true)}
        </section>
      ` : ''}

      <section class="scenario-preview no-print">
        <div>
          <p class="app-kicker">04 · ${escapeHtml(t('caseLab'))}</p>
          <h3>${escapeHtml(l(data.cases[primaryCase].title))}</h3>
          <p>${escapeHtml(t('caseIntro'))}</p>
        </div>
        <button type="button" class="button button-secondary" id="open-result-case" data-case="${primaryCase}">${escapeHtml(t('caseRead'))}</button>
      </section>

      ${actionBuilderMarkup(activated, strength)}
      <div id="plan-output">${state.plan ? actionPlanMarkup(state.plan) : ''}</div>
    `;

    document.getElementById('print-results').addEventListener('click', () => window.print());
    document.getElementById('reset-results').addEventListener('click', resetAll);
    document.getElementById('open-result-case').addEventListener('click', (event) => openCase(event.currentTarget.dataset.case, 'results'));
    const actionForm = document.getElementById('action-form');
    if (actionForm) actionForm.addEventListener('submit', handleActionPlan);
  }

  function factMarkup(questionId) {
    const question = findQuestion(questionId);
    return `<div><dt>${escapeHtml(l(question.prompt))}</dt><dd>${escapeHtml(selectedLabel(questionId))}</dd></div>`;
  }

  function portfolioCircles() {
    const count = Math.min(6, Number(state.answers.teamCount) + 2);
    let rawWeights;
    if (state.answers.allocation === 0) {
      rawWeights = [58].concat(Array(count - 1).fill(42 / Math.max(1, count - 1)));
    } else if (state.answers.allocation === 2) {
      rawWeights = count === 2
        ? [60, 40]
        : [40, 25].concat(Array(count - 2).fill(35 / (count - 2)));
    } else {
      rawWeights = Array(count).fill(100 / count);
    }
    const weights = normalizePercentages(rawWeights);
    return weights.map((weight, index) => {
      const size = Math.max(54, Math.min(128, 42 + weight * 1.35));
      return `<div class="team-orbit team-${index + 1}" style="--team-size:${size}px"><span>${state.lang === 'nl' ? 'Team' : 'Team'} ${String.fromCharCode(65 + index)}</span><small>≈${weight}%</small></div>`;
    }).join('');
  }

  function normalizePercentages(values) {
    const total = values.reduce((sum, value) => sum + value, 0);
    const exact = values.map((value) => (value / total) * 100);
    const normalized = exact.map(Math.floor);
    let remainder = 100 - normalized.reduce((sum, value) => sum + value, 0);
    const byFraction = exact
      .map((value, index) => ({index, fraction: value - Math.floor(value)}))
      .sort((a, b) => b.fraction - a.fraction || a.index - b.index);
    for (let index = 0; index < remainder; index += 1) {
      normalized[byFraction[index].index] += 1;
    }
    return normalized;
  }

  function findQuestion(id) {
    for (const step of data.steps) {
      const question = step.questions.find((item) => item.id === id);
      if (question) return question;
    }
    return null;
  }

  function selectedLabel(id) {
    const question = findQuestion(id);
    if (!question) return '';
    const option = question.options.find((item) => item.value === state.answers[id]);
    return option ? (option[state.lang] || option.en) : t('chooseOption');
  }

  function triggerIds(key) {
    const mapping = {
      fragmentation: ['switching', 'protectedTime', 'allocation'],
      roles: ['roleSeparation', 'roleConflict', 'priorityControl'],
      attention: ['relationalExclusivity', 'expertiseDistance'],
      tenure: ['orgKnowhow', 'tenure', 'teamCount'],
      fluidity: ['fluidity', 'familiarity'],
      status: ['statusShift', 'fluidity'],
      leverage: ['roleSynergy', 'priorityControl']
    };
    return mapping[key] || [];
  }

  function recommendationMarkup(key, rank, compact) {
    const rec = data.recommendations[key];
    const evidence = rec.evidence.map((id) => data.evidence.find((item) => item.id === id)).filter(Boolean);
    const triggers = triggerIds(key).map((id) => `<li><strong>${escapeHtml(l(findQuestion(id).prompt))}</strong><span>${escapeHtml(selectedLabel(id))}</span></li>`).join('');
    return `
      <article class="priority-card ${compact ? 'is-compact' : ''}">
        <div class="priority-rank">${rank}</div>
        <div class="priority-body">
          <h4>${escapeHtml(l(rec.title))}</h4>
          <p class="priority-summary">${escapeHtml(l(rec.summary))}</p>
          ${compact ? '' : `
            <details class="trigger-panel">
              <summary>${escapeHtml(t('activatedBy'))}</summary>
              <ul>${triggers}</ul>
            </details>
            <div class="action-grid">
              <div><span>${escapeHtml(t('youCanTry'))}</span><p>${escapeHtml(l(rec.individual))}</p></div>
              <div><span>${escapeHtml(t('leadersCanTry'))}</span><p>${escapeHtml(l(rec.leader))}</p></div>
              <div><span>${escapeHtml(t('twoWeek'))}</span><p>${escapeHtml(l(rec.experiment))}</p></div>
              <div><span>${escapeHtml(t('discuss'))}</span><p>${escapeHtml(l(rec.discuss))}</p></div>
            </div>
          `}
          <div class="research-links">
            ${evidence.map((item) => `
              <a href="${escapeHtml(item.url)}" ${item.url.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>
                <span class="evidence-status status-${item.status}">${escapeHtml(statusLabel(item.status))}</span>
                <strong>${escapeHtml(l(item.title))}</strong>
              </a>
            `).join('')}
          </div>
        </div>
      </article>
    `;
  }

  function actionBuilderMarkup(priorities, strength) {
    const options = priorities.length ? priorities.slice() : [];
    if (strength && !options.includes(strength)) options.push(strength);
    if (!options.length) options.push('leverage');
    const reviewDate = new Date();
    reviewDate.setDate(reviewDate.getDate() + 14);
    const dateValue = localDateValue(reviewDate);
    return `
      <section class="action-builder no-print">
        <div class="section-title-row"><div><p class="app-kicker">05</p><h3>${escapeHtml(t('actionTitle'))}</h3><p>${escapeHtml(t('actionIntro'))}</p></div></div>
        <form id="action-form">
          <label>${escapeHtml(t('actionPriority'))}
            <select name="priority">
              ${options.map((key) => `<option value="${key}">${escapeHtml(l(data.recommendations[key].title))}</option>`).join('')}
            </select>
          </label>
          <label>${escapeHtml(t('actionOwner'))}
            <input type="text" name="owner" placeholder="${escapeHtml(t('actionOwnerPlaceholder'))}" required>
          </label>
          <label>${escapeHtml(t('actionMeasure'))}
            <input type="text" name="measure" placeholder="${escapeHtml(t('actionMeasurePlaceholder'))}" required>
          </label>
          <label>${escapeHtml(t('actionDate'))}
            <input type="date" name="date" value="${dateValue}" required>
          </label>
          <button type="submit" class="button button-primary">${escapeHtml(t('generatePlan'))}</button>
        </form>
      </section>
    `;
  }

  function localDateValue(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function handleActionPlan(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    state.plan = {
      priority: formData.get('priority'),
      owner: formData.get('owner'),
      measure: formData.get('measure'),
      date: formData.get('date')
    };
    document.getElementById('plan-output').innerHTML = actionPlanMarkup(state.plan);
    document.getElementById('plan-output').scrollIntoView({behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start'});
  }

  function actionPlanMarkup(plan) {
    const rec = data.recommendations[plan.priority];
    return `
      <section class="generated-plan" aria-label="${escapeHtml(t('planTitle'))}">
        <div class="plan-head"><div><p>${escapeHtml(t('planCreated'))}</p><h3>${escapeHtml(t('planTitle'))}</h3></div><span>${escapeHtml(t('fundingKicker'))}</span></div>
        <dl>
          <div><dt>${escapeHtml(t('planPriority'))}</dt><dd>${escapeHtml(l(rec.title))}</dd></div>
          <div><dt>${escapeHtml(t('planPeople'))}</dt><dd>${escapeHtml(plan.owner)}</dd></div>
          <div><dt>${escapeHtml(t('planObservation'))}</dt><dd>${escapeHtml(plan.measure)}</dd></div>
          <div><dt>${escapeHtml(t('planReview'))}</dt><dd>${escapeHtml(plan.date)}</dd></div>
        </dl>
        <div class="plan-experiment"><strong>${escapeHtml(t('twoWeek'))}</strong><p>${escapeHtml(l(rec.experiment))}</p></div>
        <p class="plan-prompt">${escapeHtml(t('planPrompt'))}</p>
        <button type="button" class="button button-secondary no-print" onclick="window.print()">${escapeHtml(t('printResult'))}</button>
      </section>
    `;
  }

  function openCase(caseId, returnView) {
    state.caseId = caseId;
    state.returnView = returnView || state.view;
    state.caseChoice = null;
    state.caseChecked = false;
    state.view = 'case';
    renderApp();
    focusApp();
  }

  function renderCase() {
    const item = data.cases[state.caseId] || data.cases.status;
    const paragraphs = item.paragraphs[state.lang] || item.paragraphs.en;
    const discussionQuestions = item.questions[state.lang] || item.questions.en;
    const selected = state.caseChoice;
    const checked = state.caseChecked;

    appView.innerHTML = `
      <article class="case-view ${state.caseId === 'status' ? 'case-status' : ''}">
        <div class="case-head">
          <div>
            <p class="app-kicker">${escapeHtml(t('caseLab'))}</p>
            <h2>${escapeHtml(l(item.title))}</h2>
            <p>${escapeHtml(l(item.meta))}</p>
          </div>
          <button type="button" class="text-button no-print" id="case-back">← ${escapeHtml(t('caseBack'))}</button>
        </div>
        <div class="case-body">
          <div class="case-reading">
            ${paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}
            ${state.caseId === 'status' ? `<div class="case-evidence-note"><strong>${escapeHtml(t('caseEvidence'))}</strong><p>${escapeHtml(t('caseUnderReview'))}</p></div>` : ''}
          </div>
          <aside class="decision-panel">
            <p class="small-label">${escapeHtml(t('caseQuestion'))}</p>
            <h3>${escapeHtml(l(item.question))}</h3>
            <div class="case-options">
              ${item.options.map((option) => {
                const isSelected = selected === option.id;
                let resultClass = '';
                if (checked && isSelected) resultClass = option.id === item.correct ? 'is-correct' : 'is-incorrect';
                return `
                  <label class="case-option ${isSelected ? 'is-selected' : ''} ${resultClass}">
                    <input type="radio" name="case-choice" value="${option.id}" ${isSelected ? 'checked' : ''}>
                    <span>${escapeHtml(option[state.lang] || option.en)}</span>
                  </label>
                `;
              }).join('')}
            </div>
            <button type="button" class="button button-primary" id="check-case" ${selected ? '' : 'disabled'}>${escapeHtml(t('reveal'))}</button>
            ${checked && selected ? `<div class="case-feedback ${selected === item.correct ? 'correct' : 'incorrect'}" role="status" tabindex="-1">${escapeHtml(item.feedback[state.lang][selected])}</div>` : ''}
          </aside>
        </div>
        <section class="discussion-panel">
          <p class="small-label">${escapeHtml(t('caseQuestions'))}</p>
          <ol>${discussionQuestions.map((question) => `<li>${escapeHtml(question)}</li>`).join('')}</ol>
        </section>
        <div class="case-actions no-print">
          ${state.caseId === 'status' ? `<a class="button button-secondary" href="../assets/downloads/mtm-status-reentry-mini-case.pdf" download>${escapeHtml(t('caseDownload'))}</a>` : ''}
          <button type="button" class="button button-primary" id="case-return">${escapeHtml(t('caseBack'))}</button>
        </div>
      </article>
    `;

    document.getElementById('case-back').addEventListener('click', closeCase);
    document.getElementById('case-return').addEventListener('click', closeCase);
    appView.querySelectorAll('input[name="case-choice"]').forEach((input) => {
      input.addEventListener('change', () => {
        state.caseChoice = input.value;
        state.caseChecked = false;
        appView.querySelectorAll('.case-option').forEach((label) => {
          label.classList.toggle('is-selected', label.contains(input));
          label.classList.remove('is-correct', 'is-incorrect');
        });
        appView.querySelector('.case-feedback')?.remove();
        document.getElementById('check-case').disabled = false;
      });
    });
    document.getElementById('check-case').addEventListener('click', () => {
      if (!state.caseChoice) return;
      state.caseChecked = true;
      const selectedInput = appView.querySelector(`input[name="case-choice"][value="${state.caseChoice}"]`);
      const selectedLabel = selectedInput?.closest('.case-option');
      const isCorrect = state.caseChoice === item.correct;
      if (selectedLabel) selectedLabel.classList.add(isCorrect ? 'is-correct' : 'is-incorrect');
      appView.querySelector('.case-feedback')?.remove();
      const feedback = document.createElement('div');
      feedback.className = `case-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
      feedback.setAttribute('role', 'status');
      feedback.setAttribute('tabindex', '-1');
      feedback.textContent = item.feedback[state.lang][state.caseChoice];
      document.getElementById('check-case').insertAdjacentElement('afterend', feedback);
      feedback.focus();
    });
  }

  function closeCase() {
    state.view = state.returnView === 'results' && state.results ? 'results' : 'intro';
    state.caseId = null;
    renderApp();
    focusApp();
  }

  function resetAll() {
    state.answers = {};
    state.results = null;
    state.example = null;
    state.plan = null;
    state.step = 0;
    state.view = 'intro';
    renderApp();
    focusApp();
  }

  function focusApp() {
    const heading = appView.querySelector('h2');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({preventScroll: true});
    }
    document.getElementById('navigator').scrollIntoView({behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start'});
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  document.querySelectorAll('[data-lang]').forEach((button) => {
    button.addEventListener('click', () => setLanguage(button.dataset.lang));
  });
  document.getElementById('hero-start').addEventListener('click', startAssessment);
  document.querySelectorAll('.hero [data-case]').forEach((button) => {
    button.addEventListener('click', () => openCase(button.dataset.case, 'intro'));
  });

  if (initialExample && state.view !== 'case') {
    state.answers = Object.assign({}, data.presets[initialExample]);
    state.example = initialExample;
    state.results = calculateResults(state.answers);
    state.view = 'results';
  }

  renderStaticCopy();
  renderEvidence();
  renderMethod();
  renderApp();
  setLanguage(initialLang);
}());
