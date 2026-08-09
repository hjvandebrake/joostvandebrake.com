(() => {
  "use strict";

  const copy = window.MTM_RESOURCE_COPY || { en: {}, nl: {} };
  const buttons = Array.from(document.querySelectorAll("[data-lang]"));
  const copyNodes = Array.from(document.querySelectorAll("[data-copy]"));
  const ariaNodes = Array.from(document.querySelectorAll("[data-aria-copy]"));
  const navigatorLinks = Array.from(document.querySelectorAll(".navigator-link"));

  copyNodes.forEach((node) => {
    node.dataset.en = node.textContent;
  });
  ariaNodes.forEach((node) => {
    node.dataset.enAria = node.getAttribute("aria-label") || "";
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

    ariaNodes.forEach((node) => {
      const key = node.dataset.ariaCopy;
      if (lang === "en") {
        node.setAttribute("aria-label", node.dataset.enAria);
      } else if (Object.prototype.hasOwnProperty.call(strings, key)) {
        node.setAttribute("aria-label", strings[key]);
      }
    });

    buttons.forEach((button) => {
      const isActive = button.dataset.lang === lang;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    navigatorLinks.forEach((link) => {
      const url = new URL(link.dataset.baseHref || link.getAttribute("href"), window.location.href);
      link.dataset.baseHref = link.dataset.baseHref || link.getAttribute("href");
      if (lang === "nl") url.searchParams.set("lang", "nl");
      else url.searchParams.delete("lang");
      link.href = url.pathname + url.search + url.hash;
    });

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
