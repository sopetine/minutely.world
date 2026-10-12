import Lenis from 'https://cdn.jsdelivr.net/npm/lenis@1.1.18/+esm';
import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';
import { ScrollTrigger } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger.js';

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenis = null;
if (!reduceMotion) {
  // Window-level smooth scroll (wheel only — touch keeps native momentum).
  // Driven by the gsap ticker alone so lenis.raf runs exactly once per frame.
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}
window.__lenis = lenis;

function setupSpotlights() {
  const cards = document.querySelectorAll('.spotlight');
  cards.forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });
}

function setup3DTilt() {
  if (reduceMotion) return;
  const cards = document.querySelectorAll('[data-tilt]');
  cards.forEach((card) => {
    const intensity = parseFloat(card.dataset.tiltIntensity || '6');
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rx = (0.5 - y) * intensity;
      const ry = (x - 0.5) * intensity;
      card.style.setProperty('--rx', rx + 'deg');
      card.style.setProperty('--ry', ry + 'deg');
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
}

function setupNavScroll() {
  const nav = document.querySelector('.top-nav');
  if (!nav) return;
  ScrollTrigger.create({
    start: 0,
    end: 99999,
    onUpdate: (self) => {
      if (self.scroll() > 8) nav.classList.add('is-scrolled');
      else nav.classList.remove('is-scrolled');
    }
  });
}

function setupProgressBar() {
  if (reduceMotion) return;
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);
  ScrollTrigger.create({
    start: 0,
    end: 99999,
    onUpdate: (self) => { bar.style.width = (self.progress * 100).toFixed(2) + '%'; }
  });
}

function setupAnchorLinks() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(id === '#hero' ? 0 : target, { offset: -68, duration: 1.2 });
      } else {
        if (id === '#hero') window.scrollTo({ top: 0, behavior: 'smooth' });
        else target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* For below-the-fold elements: add .reveal class when they enter the viewport.
   The CSS animation runs from there. If JS fails, the class is never added
   but the element is still visible at its computed state. */
function setupScrollReveal() {
  if (!('IntersectionObserver' in window)) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
  document.querySelectorAll('[data-reveal-scroll]').forEach((el) => obs.observe(el));
}

/* Add the .reveal class to above-the-fold elements so their animation runs. */
function immediateReveal() {
  document.querySelectorAll('[data-reveal]:not([data-reveal-scroll])').forEach((el) => {
    el.classList.add('reveal');
  });
}

/* Hero video settles from slightly inset to full size as it scrolls up
   to the viewport centre (Apple-style). CSS vars keep the styling in CSS. */
function setupHeroVideoExpand() {
  if (reduceMotion) return;
  const fig = document.querySelector('[data-hero-video]');
  if (!fig) return;
  fig.classList.add('is-expandable');
  gsap.fromTo(fig, { '--expand': 0 }, {
    '--expand': 1,
    ease: 'none',
    scrollTrigger: { trigger: fig, start: 'top 95%', end: 'center 55%', scrub: 0.6 }
  });
}

function init() {
  setupSpotlights();
  setup3DTilt();
  setupNavScroll();
  setupProgressBar();
  setupAnchorLinks();
  setupHeroVideoExpand();
  setupScrollReveal();
  immediateReveal();

  window.addEventListener('load', () => ScrollTrigger.refresh());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
