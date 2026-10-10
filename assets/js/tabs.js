(function () {
  'use strict';

  const rail = document.querySelector('.walkthrough__rail');
  if (!rail) return;

  const buttons = rail.querySelectorAll('.walkthrough__step');
  const panels = document.querySelectorAll('.walkthrough__panel');

  function activate(name) {
    buttons.forEach((b) => b.setAttribute('aria-current', b.dataset.tab === name ? 'true' : 'false'));
    panels.forEach((p) => {
      const match = p.dataset.panel === name;
      p.hidden = !match;
    });
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => activate(btn.dataset.tab));
  });
})();
