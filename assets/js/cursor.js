(function () {
  'use strict';

  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isCoarse || reduceMotion) return;

  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.appendChild(ring);
  document.body.classList.add('has-custom-cursor');

  let targetX = -100, targetY = -100;
  let curX = -100, curY = -100;
  let raf;

  function tick() {
    curX += (targetX - curX) * 0.32;
    curY += (targetY - curY) * 0.32;
    ring.style.transform = `translate3d(${curX.toFixed(1)}px, ${curY.toFixed(1)}px, 0) translate(-50%, -50%)`;
    raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);

  window.addEventListener('pointermove', (e) => {
    targetX = e.pageX;
    targetY = e.pageY;
  }, { passive: true });

  const hoverSel = 'a, button, [role="button"], input, textarea, select, label, summary, [data-magnetic], [data-cursor-hover]';
  function isHoverTarget(el) {
    if (!el || !el.closest) return false;
    return !!el.closest(hoverSel);
  }

  window.addEventListener('pointerover', (e) => {
    if (isHoverTarget(e.target)) ring.classList.add('is-hover');
  });
  window.addEventListener('pointerout', (e) => {
    if (isHoverTarget(e.target)) ring.classList.remove('is-hover');
  });

  document.addEventListener('mouseleave', () => { ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { ring.style.opacity = '1'; });
})();
