(function () {
  'use strict';

  function init() {
    const form = document.getElementById('login-form');
    if (!form) return;
    const { setError, clearErrorOnInput, setBusy, showTimeout, isEmail, wait } = window.AuthUI;
    const btn = form.querySelector('button[type="submit"]');
    const alertEl = document.getElementById('login-alert');
    clearErrorOnInput(form);

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const email = form.email.value.trim();
      const password = form.password.value;
      let ok = true;
      if (!isEmail(email)) { setError(form, 'email', 'Enter a valid email address.'); ok = false; }
      if (!password) { setError(form, 'password', 'Enter your password.'); ok = false; }
      if (!ok) return;

      alertEl.hidden = true;
      setBusy(btn, true, 'Signing in…');
      await wait(4500);
      setBusy(btn, true, 'Still connecting…');
      await wait(5000);

      showTimeout(alertEl, {
        title: 'Sign-in is temporarily unavailable.',
        body: 'Our authentication service didn’t respond in time, so your password was not checked or stored. This is usually resolved within a few minutes — please try again shortly.',
        code: '504 Gateway Timeout · auth-eu-west-1'
      });
      setBusy(btn, false, 'Try again');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
