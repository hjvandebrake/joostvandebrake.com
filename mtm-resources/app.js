(() => {
  "use strict";

  const copy = window.MTM_RESOURCE_COPY || { en: {}, nl: {} };
  const buttons = Array.from(document.querySelectorAll("[data-lang]"));
  const copyNodes = Array.from(document.querySelectorAll("[data-copy]"));
  const navigatorLink = document.querySelector(".navigator-link");

  copyNodes.forEach((node) => {
    node.dataset.en = node.textContent;
  });

  function languageFromUrl() {
    return new URLSearchParams(window.location.search).get("lang") === "nl" ? "nl" : "en";
  }

  function setLanguage(language, updateUrl) {
    const lang = language === "nl" ? "nl" : "en";
    const strings = copy[lang] || {};
    document.documentElement.lang = lang;

    copyNodes.forEach((node) => {
      const key = node.dataset.copy;
      if (lang === "en") {
        node.textContent = node.dataset.en;
      } else if (Object.prototype.hasOwnProperty.call(strings, key)) {
        node.textContent = strings[key];
      }
    });

    buttons.forEach((button) => {
      const isActive = button.dataset.lang === lang;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    if (navigatorLink) {
      navigatorLink.href = lang === "nl" ? "../mtm-portfolio-navigator/?lang=nl" : "../mtm-portfolio-navigator/";
    }

    if (updateUrl) {
      const url = new URL(window.location.href);
      if (lang === "nl") url.searchParams.set("lang", "nl");
      else url.searchParams.delete("lang");
      window.history.replaceState({}, "", url);
    }
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.lang, true));
  });

  setLanguage(languageFromUrl(), false);
})();
