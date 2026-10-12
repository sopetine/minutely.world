(function () {
  'use strict';

  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isCoarse || reduceMotion) return;

  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  document.body.appendChild(ring);
  document.body.appendChild(dot);
  document.body.classList.add('has-custom-cursor');

  let targetX = -100, targetY = -100;
  let curX = -100, curY = -100;

  function tick() {
    curX += (targetX - curX) * 0.32;
    curY += (targetY - curY) * 0.32;
    ring.style.transform = `translate3d(${curX.toFixed(1)}px, ${curY.toFixed(1)}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  window.addEventListener('pointermove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
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

  document.addEventListener('mouseleave', () => { ring.style.opacity = dot.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { ring.style.opacity = dot.style.opacity = '1'; });
})();
