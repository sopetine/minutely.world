(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  // Benefits shown in the 3 black bars (each ≤ ~16 chars).
  const SCRIPT_BARS = [
    'No bots. Local.',
    'Whisper on M1',
    'Local. Private.',
    'Press record.',
    'Runs offline.',
    'Yours. Forever.',
    'One price.',
    'No cloud.',
    'Search every call.',
    'Built for Mac.'
  ];

  // Impact stats shown in the circle — first line is the number (big), second
  // line is the label (small, uppercase). All measure real outcomes.
  const SCRIPT_CIRCLE = [
    { number: '4h',   label: 'saved/wk' },
    { number: '0',    label: 'bots' },
    { number: '0',    label: 'cloud' },
    { number: '4s',   label: 'summary' },
    { number: '1',    label: 'payment' },
    { number: '98%',  label: 'accurate' }
  ];

  // Find all targets
  const barTargets = Array.from(document.querySelectorAll('.hero-logo-bars .typewriter-text'));
  const numberEl = document.querySelector('.hero-logo-circle-text .typewriter-number');
  const labelEl = document.querySelector('.hero-logo-circle-text .typewriter-label');

  if (!barTargets.length && !numberEl) return;

  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function createChar(ch) {
    const s = document.createElement('span');
    s.className = 'typewriter-char';
    s.textContent = ch === ' ' ? '\u00A0' : ch;
    return s;
  }

  function createCursor() {
    const c = document.createElement('span');
    c.className = 'typewriter-cursor';
    return c;
  }

  async function typePhrase(el, text, withCursor) {
    el.classList.remove('is-fading');
    el.innerHTML = '';
    let cursor = null;
    if (withCursor) {
      cursor = createCursor();
      el.appendChild(cursor);
    }
    for (let i = 0; i < text.length; i++) {
      const ch = createChar(text[i]);
      if (cursor) el.insertBefore(ch, cursor);
      else el.appendChild(ch);

      let delay = rand(70, 150);
      if ('.,—!?'.includes(text[i])) delay += rand(180, 280);
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  async function fadeOut(el) {
    el.classList.add('is-fading');
    await new Promise((r) => setTimeout(r, 600));
  }

  async function runBar(el, index) {
    // Stagger start so the 3 lines begin in sequence, not in unison.
    await new Promise((r) => setTimeout(r, index * 1600));
    while (true) {
      const phrase = SCRIPT_BARS[Math.floor(Math.random() * SCRIPT_BARS.length)];
      await typePhrase(el, phrase, true);
      await new Promise((r) => setTimeout(r, 1600));
      await fadeOut(el);
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  async function runCircle(numberEl, labelEl, index) {
    await new Promise((r) => setTimeout(r, index * 1600));
    while (true) {
      const stat = SCRIPT_CIRCLE[Math.floor(Math.random() * SCRIPT_CIRCLE.length)];
      // Type the big number first (with cursor), then the small label (no cursor).
      await typePhrase(numberEl, stat.number, true);
      await typePhrase(labelEl, stat.label, false);
      await new Promise((r) => setTimeout(r, 1600));
      await fadeOut(numberEl);
      await fadeOut(labelEl);
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  // Circle starts at index 0 (immediately). Bars stagger after.
  if (numberEl && labelEl) {
    runCircle(numberEl, labelEl, 0);
  }
  barTargets.forEach((bar, i) => runBar(bar, i + 1));
})();
