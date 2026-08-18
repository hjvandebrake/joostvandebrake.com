"use strict";

const GRADING_API =
  "https://teamwork-practice-exam.compatibel.chatgpt.site/api/grade-open";
const STORAGE_KEY = "teamwork-practice-exam-2026-v3";
const { MC_BLOCKS, OPEN_QUESTIONS, OPEN_ANSWER_LIMIT } = window.EXAM_DATA;
const ALL_MC_QUESTIONS = MC_BLOCKS.flatMap((block) => block.questions);
const TOTAL_OPEN_PARTS = OPEN_QUESTIONS.reduce(
  (total, question) => total + question.parts.length,
  0,
);

let mcAnswers = {};
let openAnswers = emptyOpenAnswers();
let completed = false;

const exam = document.getElementById("exam");
const mcRoot = document.getElementById("mc-root");
const openRoot = document.getElementById("open-root");
const results = document.getElementById("results");
const submitButton = document.getElementById("submit-button");
const clearButton = document.getElementById("clear-button");
const formMessage = document.getElementById("form-message");

restoreAnswers();
renderQuestions();
updateProgress();

exam.addEventListener("submit", submitExam);
clearButton.addEventListener("click", clearAttempt);

function emptyOpenAnswers() {
  return Object.fromEntries(
    OPEN_QUESTIONS.flatMap((question) =>
      question.parts.map((_, index) => [`${question.number}-${index}`, ""]),
    ),
  );
}

function restoreAnswers() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    const parsed = JSON.parse(saved);
    if (parsed.mcAnswers && typeof parsed.mcAnswers === "object") {
      mcAnswers = parsed.mcAnswers;
    }
    if (parsed.openAnswers && typeof parsed.openAnswers === "object") {
      openAnswers = { ...emptyOpenAnswers(), ...parsed.openAnswers };
    }
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

function saveAnswers() {
  if (completed) return;
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ mcAnswers, openAnswers }),
  );
}

function renderQuestions() {
  mcRoot.innerHTML = MC_BLOCKS.map(
    (block) => `
      <section class="question-block">
        <h3>${escapeHtml(block.heading)}</h3>
        ${block.questions.map(renderMcQuestion).join("")}
      </section>`,
  ).join("");

  openRoot.innerHTML = OPEN_QUESTIONS.map(renderOpenQuestion).join("");

  mcRoot.querySelectorAll("input[data-mc]").forEach((input) => {
    input.addEventListener("change", () => {
      mcAnswers[input.dataset.question] = input.value;
      hideMessage();
      saveAnswers();
      updateProgress();
    });
  });

  openRoot.querySelectorAll("textarea[data-open]").forEach((textarea) => {
    textarea.addEventListener("input", () => {
      const key = `${textarea.dataset.question}-${textarea.dataset.part}`;
      openAnswers[key] = textarea.value;
      updateCharacterCount(textarea);
      hideMessage();
      saveAnswers();
      updateProgress();
    });
    updateCharacterCount(textarea);
  });
}

function renderMcQuestion(question) {
  return `
    <fieldset class="mc-question">
      <legend><span class="question-number">${question.number}</span>${escapeHtml(question.stem)}</legend>
      <div class="options">
        ${question.options
          .map((option) => {
            const value = option.slice(0, 1);
            const checked = mcAnswers[question.number] === value ? " checked" : "";
            return `
              <label class="option">
                <input type="radio" data-mc data-question="${question.number}" name="question-${question.number}" value="${value}"${checked}>
                <span>${escapeHtml(option)}</span>
              </label>`;
          })
          .join("")}
      </div>
    </fieldset>`;
}

function renderOpenQuestion(question) {
  const limitPerPart = Math.floor(OPEN_ANSWER_LIMIT / question.parts.length);
  return `
    <article class="open-question">
      <div class="open-question-heading">
        <span class="question-number">${question.number}</span>
        <div>
          <p class="question-kicker">Open question ${question.number}</p>
          <h3>${escapeHtml(question.heading)}</h3>
        </div>
      </div>
      <div class="scenario">
        <span>Scenario</span>
        <p>${escapeHtml(question.scenario)}</p>
      </div>
      <div class="part-answer-list">
        ${question.parts
          .map((part, index) => {
            const key = `${question.number}-${index}`;
            const letter = String.fromCharCode(65 + index);
            const answer = openAnswers[key] || "";
            return `
              <div class="part-answer">
                <p class="part-prompt"><strong>Part ${letter}</strong> ${escapeHtml(part.replace(/^[A-C]\.\s*/, ""))}</p>
                <label class="answer-label" for="open-${question.number}-${index}">Your answer to part ${letter}</label>
                <textarea id="open-${question.number}-${index}" data-open data-question="${question.number}" data-part="${index}" maxlength="${limitPerPart}" rows="${question.parts.length === 2 ? 7 : 6}" aria-describedby="counter-${question.number}-${index}" placeholder="Answer part ${letter} here.">${escapeHtml(answer)}</textarea>
                <p class="character-count" id="counter-${question.number}-${index}">${answer.length.toLocaleString("en-GB")} / ${limitPerPart.toLocaleString("en-GB")} characters</p>
              </div>`;
          })
          .join("")}
      </div>
    </article>`;
}

function updateCharacterCount(textarea) {
  const counter = document.getElementById(
    `counter-${textarea.dataset.question}-${textarea.dataset.part}`,
  );
  const maximum = Number(textarea.maxLength);
  counter.textContent = `${textarea.value.length.toLocaleString("en-GB")} / ${maximum.toLocaleString("en-GB")} characters`;
  counter.classList.toggle("near-limit", textarea.value.length > maximum * 0.9);
}

function updateProgress() {
  const answeredMc = ALL_MC_QUESTIONS.filter(
    (question) => mcAnswers[question.number],
  ).length;
  const answeredOpen = OPEN_QUESTIONS.reduce(
    (total, question) =>
      total +
      question.parts.filter(
        (_, index) =>
          (openAnswers[`${question.number}-${index}`] || "").trim().length >= 20,
      ).length,
    0,
  );
  const completion = Math.round(
    ((answeredMc + answeredOpen) / (20 + TOTAL_OPEN_PARTS)) * 100,
  );
  document.getElementById("mc-progress").textContent = `${answeredMc} of 20 answered`;
  document.getElementById("open-progress").textContent = `${answeredOpen} of ${TOTAL_OPEN_PARTS} parts answered`;
  document.getElementById("completion").textContent = `${completion}% complete`;
}

async function submitExam(event) {
  event.preventDefault();
  hideMessage();

  const missingMc = ALL_MC_QUESTIONS.filter(
    (question) => !mcAnswers[question.number],
  ).map((question) => question.number);
  const shortOpen = OPEN_QUESTIONS.flatMap((question) =>
    question.parts.flatMap((_, index) =>
      (openAnswers[`${question.number}-${index}`] || "").trim().length < 20
        ? [`${question.number}${String.fromCharCode(65 + index)}`]
        : [],
    ),
  );

  if (missingMc.length || shortOpen.length) {
    const messages = [];
    if (missingMc.length) {
      messages.push(
        `answer multiple-choice question${missingMc.length === 1 ? "" : "s"} ${missingMc.join(", ")}`,
      );
    }
    if (shortOpen.length) {
      messages.push(
        `write at least 20 characters for open-question part${shortOpen.length === 1 ? "" : "s"} ${shortOpen.join(", ")}`,
      );
    }
    showMessage(`Before submitting, please ${messages.join(" and ")}.`);
    document.getElementById("submission").scrollIntoView({ behavior: "smooth" });
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Grading open answers…";

  try {
    const response = await fetch(GRADING_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        answers: OPEN_QUESTIONS.map((question) => ({
          questionNumber: question.number,
          parts: question.parts.map((_, index) =>
            openAnswers[`${question.number}-${index}`].trim(),
          ),
        })),
      }),
    });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(
        payload.error || "Automated feedback is temporarily unavailable.",
      );
    }

    const mcScore = ALL_MC_QUESTIONS.reduce(
      (score, question) =>
        score + (mcAnswers[question.number] === question.answer ? 2 : 0),
      0,
    );
    const totalScore = mcScore + payload.totalScore;
    renderResults({
      mcScore,
      openScore: payload.totalScore,
      totalScore,
      grade: totalScore / 10,
      openFeedback: payload.questions,
    });
    completed = true;
    window.localStorage.removeItem(STORAGE_KEY);
    setLocked(true);
    submitButton.disabled = false;
    submitButton.type = "button";
    submitButton.textContent = "Edit answers and resubmit";
    submitButton.onclick = reviseAttempt;
    results.hidden = false;
    results.focus();
    results.scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    showMessage(
      `${error.message || "Automated feedback is temporarily unavailable."} Your answers remain saved in this browser, so you can try again.`,
    );
    submitButton.disabled = false;
    submitButton.textContent = "Submit and view feedback";
  }
}

function renderResults(result) {
  results.innerHTML = `
    <div class="wrap">
      <div class="results-heading">
        <div><p class="eye">Your results</p><h2 id="results-title">Practice exam feedback</h2></div>
        <div class="grade-badge" aria-label="Grade ${result.grade.toFixed(1)} out of 10"><span>Grade</span><strong>${result.grade.toFixed(1)}</strong></div>
      </div>
      <div class="score-grid">
        <div class="score-card"><span>Multiple choice</span><strong>${result.mcScore} / 40</strong></div>
        <div class="score-card"><span>Open questions</span><strong>${formatScore(result.openScore)} / 60</strong></div>
        <div class="score-card total-card"><span>Total</span><strong>${formatScore(result.totalScore)} / 100</strong></div>
      </div>
      <p class="feedback-note">This is formative feedback. Open answers are marked against the practice rubric by AI and may differ slightly from a lecturer's judgement.</p>
      <details class="result-details">
        <summary>Review all multiple-choice answers</summary>
        <div class="mc-review-list">${ALL_MC_QUESTIONS.map(renderMcReview).join("")}</div>
      </details>
      <div class="open-feedback-list">${result.openFeedback.map(renderOpenFeedback).join("")}</div>
      <div class="results-actions">
        <button class="button primary-button" type="button" id="revise-results">Edit answers and resubmit</button>
        <button class="button secondary-button" type="button" id="reset-results">Start a new attempt</button>
      </div>
    </div>`;
  document.getElementById("revise-results").addEventListener("click", reviseAttempt);
  document.getElementById("reset-results").addEventListener("click", clearAttempt);
}

function renderMcReview(question) {
  const chosen = mcAnswers[question.number];
  const correct = chosen === question.answer;
  const chosenOption =
    question.options.find((option) => option.startsWith(`${chosen}.`)) || chosen;
  const correctOption =
    question.options.find((option) => option.startsWith(`${question.answer}.`)) ||
    question.answer;
  return `
    <article class="mc-review ${correct ? "correct" : "incorrect"}">
      <div class="review-title"><span>${correct ? "Correct" : "Incorrect"}</span><strong>Question ${question.number}</strong></div>
      <p>${escapeHtml(question.stem)}</p>
      <div class="submitted-answer">
        <span>Your answer</span>
        <p>${escapeHtml(chosenOption)}</p>
      </div>
      <p class="answer-line">Correct answer: <strong>${escapeHtml(correctOption)}</strong></p>
      <p class="rationale">Why ${question.answer} is correct: ${escapeHtml(question.rationale)}</p>
    </article>`;
}

function renderOpenFeedback(feedback) {
  const question = OPEN_QUESTIONS.find(
    (item) => item.number === feedback.questionNumber,
  );
  const fullCredit = feedback.totalScore === 15;
  const improvementPanel = fullCredit
    ? `<div class="full-credit-note"><h4>Full credit</h4><p>This answer met all rubric requirements. No improvement is required for full marks.</p></div>`
    : `<div><h4>What to improve</h4><ul>${feedback.improvements.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>`;
  const submittedAnswers = question.parts
    .map((part, index) => {
      const letter = String.fromCharCode(65 + index);
      const answer = openAnswers[`${question.number}-${index}`] || "";
      return `
        <div class="submitted-part">
          <p class="submitted-part-label"><strong>Part ${letter}</strong> ${escapeHtml(part.replace(/^[A-C]\.\s*/, ""))}</p>
          <p class="submitted-part-text">${escapeHtml(answer)}</p>
        </div>`;
    })
    .join("");

  return `
    <article class="open-feedback">
      <div class="feedback-title">
        <div><p class="question-kicker">Open question ${feedback.questionNumber}</p><h3>${escapeHtml(question.heading)}</h3></div>
        <strong>${formatScore(feedback.totalScore)} / 15</strong>
      </div>
      <div class="submitted-open-answers">
        <h4>Your submitted answer</h4>
        ${submittedAnswers}
      </div>
      <div class="criteria-grid">
        ${feedback.criterionScores.map((criterion) => `<div class="criterion"><span>${escapeHtml(criterion.label)}</span><strong>${formatScore(criterion.score)} / ${criterion.maxScore}</strong></div>`).join("")}
      </div>
      <div class="feedback-columns">
        <div><h4>What you did well</h4><ul>${feedback.strengths.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>
        ${improvementPanel}
      </div>
      <div class="why-box"><h4>Why this score</h4><p>${escapeHtml(feedback.explanation)}</p></div>
      <details class="model-answer"><summary>View a simple model answer</summary><p>${escapeHtml(feedback.modelAnswer)}</p></details>
    </article>`;
}

function reviseAttempt() {
  completed = false;
  results.hidden = true;
  setLocked(false);
  submitButton.type = "submit";
  submitButton.textContent = "Submit and view feedback";
  submitButton.onclick = null;
  saveAnswers();
  document.getElementById("exam").scrollIntoView({ behavior: "smooth" });
}

function clearAttempt() {
  if (!window.confirm("Clear all answers and start a new attempt?")) return;
  mcAnswers = {};
  openAnswers = emptyOpenAnswers();
  completed = false;
  window.localStorage.removeItem(STORAGE_KEY);
  hideMessage();
  results.hidden = true;
  submitButton.type = "submit";
  submitButton.textContent = "Submit and view feedback";
  submitButton.onclick = null;
  renderQuestions();
  setLocked(false);
  updateProgress();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setLocked(locked) {
  exam.querySelectorAll("input, textarea").forEach((control) => {
    control.disabled = locked;
  });
}

function showMessage(message) {
  formMessage.textContent = message;
  formMessage.hidden = false;
}

function hideMessage() {
  formMessage.hidden = true;
  formMessage.textContent = "";
}

function formatScore(score) {
  return Number.isInteger(score) ? String(score) : score.toFixed(1);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
