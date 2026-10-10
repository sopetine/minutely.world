(function () {
  'use strict';

  const STORAGE_KEY = 'minutely-theme';
  const VALID = ['light', 'dark', 'magic-blue', 'classic-dark', 'pure-light'];

  function resolveTheme(value) {
    if (value === 'light' || value === 'dark') return value;
    if (VALID.indexOf(value) >= 0) return value;
    return null;
  }

  function applyTheme(name) {
    if (!name) return;
    document.documentElement.setAttribute('data-app-theme', name);
    try { localStorage.setItem(STORAGE_KEY, name); } catch (e) {}
    const btns = document.querySelectorAll('[data-theme-set]');
    btns.forEach((b) => b.setAttribute('aria-pressed', b.dataset.themeSet === name ? 'true' : 'false'));
  }

  function initFromStorage() {
    let stored = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (stored) return resolveTheme(stored);
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  }

  function attachSwitcher() {
    const btns = document.querySelectorAll('[data-theme-set]');
    btns.forEach((btn) => {
      btn.addEventListener('click', () => applyTheme(btn.dataset.themeSet));
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const t = initFromStorage();
    if (t) applyTheme(t);
    attachSwitcher();
  });
})();
