// Premium cursor: one calm dot that tracks the pointer exactly, morphs into a
// soft lens over interactive elements and a caret over text fields, and fades
// away when the mouse rests. Touch and reduced-motion users keep the native one.
(function () {
  'use strict';

  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isCoarse || reduceMotion) return;

  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  cursor.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cursor);
  document.body.classList.add('has-custom-cursor');

  const linkSel = 'a, button, [role="button"], select, label, summary, [data-magnetic], [data-cursor-hover]';
  const textSel = 'input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]), textarea, [contenteditable="true"]';
  const selectableSel = '.app-summary';
  let idleTimer;

  function setState(target) {
    const el = target && target.closest ? target : null;
    cursor.classList.toggle('is-text', !!(el && el.closest(textSel)));
    cursor.classList.toggle('is-link', !!(el && !el.closest(textSel) && el.closest(linkSel)));
    cursor.classList.toggle('is-select', !!(el && !el.closest(linkSel) && el.closest(selectableSel)));
  }

  window.addEventListener('pointermove', (e) => {
    cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    cursor.classList.add('is-visible');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => cursor.classList.remove('is-visible'), 3000);
  }, { passive: true });

  window.addEventListener('pointerover', (e) => setState(e.target));
  window.addEventListener('pointerdown', () => cursor.classList.add('is-down'));
  window.addEventListener('pointerup', () => cursor.classList.remove('is-down'));
  document.addEventListener('mouseleave', () => cursor.classList.remove('is-visible'));
})();
