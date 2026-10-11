import Lenis from 'https://cdn.jsdelivr.net/npm/lenis@1.1.18/+esm';
import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';
import { ScrollTrigger } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger.js';

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenis = null;
if (!reduceMotion) {
  const wrapperEl = document.getElementById('lenis-wrapper');
  const contentEl = document.getElementById('lenis-content');
  lenis = new Lenis({
    wrapper: wrapperEl,
    content: contentEl,
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.4,
    lerp: 0.09
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
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
        lenis.scrollTo(target, { offset: -68, duration: 1.2 });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

function init() {
  setupSpotlights();
  setup3DTilt();
  setupNavScroll();
  setupProgressBar();
  setupAnchorLinks();
  setupScrollReveal();
  immediateReveal();

  window.addEventListener('load', () => ScrollTrigger.refresh());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
