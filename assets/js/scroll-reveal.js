(function () {
  'use strict';

  // Strategy: keep things simple and robust.
  // Step 1: synchronously add is-revealed to everything in viewport
  // Step 2: set up IntersectionObserver for elements below the fold
  // We do NOT add .reveal-anim upfront — only after IO is set up — so
  // the page is never hidden if JS hangs.

  function reveal(el) { el.classList.add('is-revealed'); }
  function revealGroup(g) {
    g.classList.add('is-revealed');
    Array.from(g.children).forEach((c) => c.classList.add('is-revealed'));
  }

  function init() {
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const reveals = document.querySelectorAll('[data-reveal]:not([data-stagger])');
    const groups = document.querySelectorAll('[data-stagger]');

    if (reduceMotion || !('IntersectionObserver' in window)) {
      reveals.forEach(reveal);
      groups.forEach(revealGroup);
      return;
    }

    // Step 1: reveal anything currently in viewport synchronously
    reveals.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) reveal(el);
    });
    groups.forEach((g) => {
      const rect = g.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) revealGroup(g);
    });

    // Step 2: animate the rest on scroll (use transform/opacity for perf)
    const toReveal = Array.from(reveals).filter((el) => !el.classList.contains('is-revealed'));
    const toRevealGroups = Array.from(groups).filter((g) => !g.classList.contains('is-revealed'));
    toReveal.forEach((el) => el.classList.add('reveal-anim'));
    toRevealGroups.forEach((g) => {
      g.classList.add('reveal-anim');
      Array.from(g.children).forEach((c) => c.classList.add('reveal-anim'));
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-revealed');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -80px 0px', threshold: 0.01 });

    toReveal.forEach((el) => io.observe(el));
    toRevealGroups.forEach((g) => io.observe(g));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
