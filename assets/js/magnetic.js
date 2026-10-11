(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  if (isCoarse) return;

  const STRENGTH = 0.32;
  const RADIUS = 120;

  function attach(el) {
    const inner = el.querySelector('.magnetic-inner') || el;
    if (!inner) return;

    el.style.willChange = 'transform';

    function onMove(e) {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const dist = Math.hypot(x, y);
      const factor = Math.max(0, 1 - dist / RADIUS);
      const tx = x * STRENGTH * factor;
      const ty = y * STRENGTH * factor;
      inner.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
    }

    function onLeave() {
      inner.style.transform = 'translate3d(0, 0, 0)';
    }

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    el.addEventListener('pointerdown', onMove);
  }

  function init() {
    document.querySelectorAll('[data-magnetic]').forEach(attach);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();