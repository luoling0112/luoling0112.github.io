let siteLanguage = "en";
const englishContent = new WeakMap();

function readPreference(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function savePreference(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Both controls still work when the browser disables local storage.
  }
}

function syncThemeToggle() {
  const isDark = document.body.classList.contains("dark-mode");
  document.querySelectorAll(".toggle-dark").forEach((toggle) => {
    toggle.textContent = siteLanguage === "zh"
      ? (isDark ? "浅色" : "深色")
      : (isDark ? "Light" : "Dark");
    toggle.setAttribute("aria-label", siteLanguage === "zh" ? "切换明暗主题" : "Toggle color theme");
    toggle.setAttribute("aria-pressed", isDark ? "true" : "false");
  });
}

function toggleDark() {
  document.body.classList.toggle("dark-mode");
  savePreference("dark-mode", String(document.body.classList.contains("dark-mode")));
  syncThemeToggle();
}

function syncAbstractButtons() {
  document.querySelectorAll(".abs-btn").forEach((button) => {
    const expanded = getComputedStyle(button.nextElementSibling).display !== "none";
    button.textContent = siteLanguage === "zh"
      ? (expanded ? "收起摘要" : "摘要")
      : (expanded ? "Hide Abstract" : "Abstract");
    button.setAttribute("aria-expanded", String(expanded));
  });
}

function setLanguage(language) {
  siteLanguage = language === "zh" ? "zh" : "en";
  document.documentElement.lang = siteLanguage === "zh" ? "zh-CN" : "en";

  // data-zh contains author-written translations, including deliberate inline markup.
  // Cache English from the current source so switching back preserves the owner's edits.
  document.querySelectorAll("[data-zh]").forEach((element) => {
    const attribute = element.dataset.translateAttribute;
    if (!englishContent.has(element)) {
      englishContent.set(element, attribute ? element.getAttribute(attribute) : element.innerHTML);
    }
    const content = siteLanguage === "zh" ? element.dataset.zh : englishContent.get(element);
    if (attribute) {
      element.setAttribute(attribute, content);
    } else {
      element.innerHTML = content;
    }
  });

  document.querySelectorAll(".toggle-language").forEach((button) => {
    button.textContent = siteLanguage === "zh" ? "English" : "中文";
    button.setAttribute("aria-label", siteLanguage === "zh" ? "Switch to English" : "Switch to Chinese");
  });
  syncThemeToggle();
  syncAbstractButtons();
}

function toggleLanguage() {
  setLanguage(siteLanguage === "zh" ? "en" : "zh");
  savePreference("site-language", siteLanguage);
}

window.addEventListener("DOMContentLoaded", () => {
  if (readPreference("dark-mode") === "true") {
    document.body.classList.add("dark-mode");
  }

  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".navbar .right a").forEach((anchor) => {
    if (anchor.getAttribute("href") === path) {
      anchor.classList.add("active");
      anchor.setAttribute("aria-current", "page");
    }
  });

  const requestedLanguage = new URLSearchParams(location.search).get("lang");
  const language = ["en", "zh"].includes(requestedLanguage)
    ? requestedLanguage
    : readPreference("site-language");
  setLanguage(language);
  if (["en", "zh"].includes(requestedLanguage)) {
    savePreference("site-language", siteLanguage);
  }
});

function toggleAbstract(button) {
  const abstract = button.nextElementSibling;
  const isHidden = abstract.style.display === "none" || abstract.style.display === "";

  abstract.style.display = isHidden ? "block" : "none";
  syncAbstractButtons();
}
