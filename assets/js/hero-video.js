// Hero overview video: muted loop that only plays while on screen.
// "Play with sound" restarts it unmuted with native controls.
(function () {
  'use strict';

  const fig = document.querySelector('[data-hero-video]');
  if (!fig) return;
  const video = fig.querySelector('video');
  const btn = fig.querySelector('[data-hero-video-sound]');
  const label = fig.querySelector('[data-hero-video-label]');

  // <source media> isn't honoured by every browser, so pick the file here.
  // preload="none" means nothing has been fetched yet.
  if (video.dataset.srcMobile && window.matchMedia('(max-width: 720px)').matches) {
    video.src = video.dataset.srcMobile;
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = !!(navigator.connection && navigator.connection.saveData);
  const autoplay = !reduceMotion && !saveData;

  let inView = false;
  let soundMode = false;

  function play() {
    video.preload = 'auto';
    const p = video.play();
    if (p && p.catch) p.catch(() => fig.classList.add('is-idle')); // e.g. iOS Low Power Mode
  }

  function sync() {
    if (soundMode) return;
    if (autoplay && inView && !document.hidden) play();
    else video.pause();
  }

  if (!autoplay) {
    fig.classList.add('is-idle');
    label.textContent = 'Play';
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

  btn.addEventListener('click', () => {
    soundMode = true;
    fig.classList.add('is-sound');
    fig.classList.remove('is-idle');
    video.loop = false;
    video.muted = false;
    video.controls = true;
    video.currentTime = 0;
    play();
  });

  video.addEventListener('ended', () => {
    if (!soundMode) return;
    soundMode = false;
    fig.classList.remove('is-sound');
    video.controls = false;
    video.muted = true;
    video.loop = true;
    if (!autoplay) fig.classList.add('is-idle');
    sync();
  });
})();
