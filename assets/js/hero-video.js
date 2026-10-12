// Hero overview video: always-muted loop that only plays while on screen.
(function () {
  'use strict';

  const fig = document.querySelector('[data-hero-video]');
  if (!fig) return;
  const video = fig.querySelector('video');

  // <source media> isn't honoured by every browser, so pick the file here.
  // preload="none" means nothing has been fetched yet.
  if (video.dataset.srcMobile && window.matchMedia('(max-width: 720px)').matches) {
    video.src = video.dataset.srcMobile;
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = !!(navigator.connection && navigator.connection.saveData);
  const autoplay = !reduceMotion && !saveData;

  video.muted = true;
  let inView = false;

  function play() {
    video.preload = 'auto';
    const p = video.play();
    if (p && p.catch) p.catch(() => {}); // e.g. iOS Low Power Mode — poster stays
  }

  function sync() {
    if (autoplay && inView && !document.hidden) play();
    else video.pause();
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      inView = entries[0].isIntersecting;
      sync();
    }, { threshold: 0.25 }).observe(video);
  } else {
    inView = true;
    sync();
  }

  document.addEventListener('visibilitychange', sync);
})();
