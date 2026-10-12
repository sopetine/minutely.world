// Shared form helpers for login + checkout: inline errors, button busy
// state, and the service-timeout alert. No network calls anywhere.
(function () {
  'use strict';

  function setError(form, id, msg) {
    const input = document.getElementById(id);
    const slot = form.querySelector('[data-error-for="' + id + '"]');
    if (input) input.classList.toggle('is-invalid', !!msg);
    if (input) input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (slot) slot.textContent = msg || '';
  }

  function clearErrorOnInput(form) {
    form.querySelectorAll('input').forEach((input) => {
      input.addEventListener('input', () => setError(form, input.id, ''));
    });
  }

  function setBusy(btn, busy, label) {
    const labelEl = btn.querySelector('[data-btn-label]');
    btn.disabled = busy;
    btn.classList.toggle('is-busy', busy);
    if (label && labelEl) labelEl.textContent = label;
  }

  function requestId() {
    const hex = '0123456789abcdef';
    let id = 'req_';
    for (let i = 0; i < 20; i++) id += hex[Math.floor(Math.random() * 16)];
    return id;
  }

  function showTimeout(alertEl, opts) {
    const now = new Date();
    const ts = now.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    alertEl.innerHTML =
      '<span class="material-symbols-outlined form-alert-icon" aria-hidden="true">cloud_off</span>' +
      '<div class="form-alert-body">' +
        '<strong>' + opts.title + '</strong>' +
        '<p>' + opts.body + '</p>' +
        '<code>' + opts.code + ' · ' + requestId() + ' · ' + ts + '</code>' +
      '</div>';
    alertEl.hidden = false;
  }

  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  window.AuthUI = { setError, clearErrorOnInput, setBusy, showTimeout, isEmail, wait };
})();
