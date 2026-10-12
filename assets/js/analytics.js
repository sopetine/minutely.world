// Vercel Web Analytics (cookieless). Pageviews work on every plan; the
// mtTrack() custom events below are only recorded on Vercel Pro.
// Never sends form values. Owner opt-out: localStorage.setItem('va-disable', '1').
(function () {
  'use strict';

  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };

  // Turn query-string funnels into readable paths, since the free plan
  // reports paths only: payment.html?tier=pro -> /payment/pro.
  window.va('beforeSend', function (event) {
    try { if (localStorage.getItem('va-disable')) return null; } catch (e) {}
    const url = new URL(event.url);
    const tier = url.searchParams.get('tier');
    url.pathname = url.pathname.replace(/\.html$/, '').replace(/\/index$/, '/');
    if (url.pathname === '/payment' && tier) url.pathname = '/payment/' + tier;
    url.search = '';
    return Object.assign({}, event, { url: url.toString() });
  });

  // Load the collector only on the deployed site (it 404s locally).
  if (!/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)) {
    const s = document.createElement('script');
    s.defer = true;
    s.src = '/_vercel/insights/script.js';
    document.head.appendChild(s);
  }

  // Custom event helper — max 2 properties (Vercel Pro limit).
  window.mtTrack = function (name, data) {
    window.va('event', data ? { name: name, data: data } : { name: name });
  };
  const track = window.mtTrack;

  function sectionOf(el) {
    const sec = el.closest('section[id], header, footer');
    if (!sec) return 'page';
    return sec.id || sec.tagName.toLowerCase();
  }

  function init() {
    const page = document.body.dataset.page || 'page';

    // Clicks: buy buttons, nav, maker links, mail and outbound links.
    document.addEventListener('click', function (e) {
      const a = e.target.closest('a, button');
      if (!a) return;
      if (a.dataset.track) { track(a.dataset.track, { page: page }); return; }
      const href = a.getAttribute('href') || '';
      if (/payment\.html/.test(href)) {
        const tier = (href.match(/tier=([a-z]+)/) || [])[1] || 'pro';
        track('buy_click', { tier: tier, location: sectionOf(a) });
      } else if (a.classList.contains('top-nav-link')) {
        track('nav_click', { to: href });
      } else if (href.indexOf('mailto:') === 0) {
        track('email_click', { location: sectionOf(a) });
      } else if (/^https?:/.test(href) && a.host !== location.host) {
        track('outbound_click', { host: a.host, location: sectionOf(a) });
      } else if (a.classList.contains('summary-toggle') && a.getAttribute('aria-expanded') === 'false') {
        track('summary_expand');
      } else if (a.classList.contains('summary-copy')) {
        track('summary_copy');
      }
    }, true);

    // Waitlist: count the submit, never the address.
    document.querySelectorAll('[data-waitlist]').forEach(function (form) {
      form.addEventListener('submit', function () { track('waitlist_submit'); });
    });

    // FAQ opens.
    document.querySelectorAll('details.faq-item').forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (d.open) track('faq_open', { q: d.querySelector('summary').textContent.trim().slice(0, 60) });
      });
    });

    // Scroll depth milestones, once each.
    const marks = [25, 50, 75, 90];
    let next = 0, ticking = false;
    function onScroll() {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const pct = (window.scrollY / max) * 100;
      while (next < marks.length && pct >= marks[next]) {
        track('scroll_depth', { percent: marks[next], page: page });
        next++;
      }
      if (next >= marks.length) window.removeEventListener('scroll', schedule);
    }
    function schedule() { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }
    window.addEventListener('scroll', schedule, { passive: true });

    // First view of each landing-page section.
    if ('IntersectionObserver' in window) {
      const seen = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          track('section_view', { id: entry.target.id || entry.target.getAttribute('aria-label') });
          seen.unobserve(entry.target);
        });
      }, { threshold: 0.35 });
      document.querySelectorAll('main section').forEach(function (s) { seen.observe(s); });
    }

    // Hero video: started, half watched, watched through (it loops).
    const video = document.querySelector('.hero-video-media');
    if (video) {
      const hit = {};
      video.addEventListener('play', function () { if (!hit.play) { hit.play = 1; track('hero_video', { stage: 'play' }); } });
      video.addEventListener('timeupdate', function () {
        if (!video.duration) return;
        const p = video.currentTime / video.duration;
        if (p >= 0.5 && !hit.half) { hit.half = 1; track('hero_video', { stage: '50' }); }
        if (p >= 0.95 && !hit.done) { hit.done = 1; track('hero_video', { stage: 'complete' }); }
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
