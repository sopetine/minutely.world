// Resize-throttled CSS custom property for the hero logo glow position.
(function () {
  const r = window.requestAnimationFrame;
  let pending = false;
  function update() {
    pending = false;
    const w = window.innerWidth;
    const h = window.innerHeight;
    document.documentElement.style.setProperty('--vw', w + 'px');
    document.documentElement.style.setProperty('--vh', h + 'px');
  }
  window.addEventListener('resize', function () {
    if (pending) return;
    pending = true;
    r(update);
  });
  update();
})();
