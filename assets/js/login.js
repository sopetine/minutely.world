(function () {
  'use strict';

  function init() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (!btn) return;
      btn.disabled = true;
      const original = btn.textContent;
      btn.textContent = 'Signing in…';

      setTimeout(function () {
        try {
          sessionStorage.setItem('minutely_mock_auth', 'true');
        } catch (err) {}
        window.location.href = 'payment.html';
      }, 600);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();