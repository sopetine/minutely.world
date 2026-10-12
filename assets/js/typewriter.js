(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  // Benefits shown in the 3 black bars. Keep each ≤ 14 chars so it fits the
  // bar at every logo width (font-size is in cqw, see home.css).
  const SCRIPT_BARS = [
    'No bots.',
    'Runs offline.',
    'Local. Private.',
    'Press nothing.',
    'Auto-records.',
    'Whisper on Mac',
    'Speaker names.',
    'Ask any call.',
    'Search it all.',
    'One price.',
    'Yours forever.',
    'No cloud.',
    'No banners.',
    'Teams. Zoom.',
    'Google Meet.',
    'Any video file',
    'Local LLMs.',
    'Your own key.',
    'Free updates.',
    'Action items.',
    'Synced replay.',
    'Built for Mac.',
    'Zero upkeep.',
    'Notes, done.'
  ];

  // Impact stats shown in the circle — number (big) + label (small, uppercase).
  const SCRIPT_CIRCLE = [
    { number: '4h',   label: 'saved/wk' },
    { number: '0',    label: 'bots' },
    { number: '0',    label: 'uploads' },
    { number: '4s',   label: 'summary' },
    { number: '1×',   label: 'payment' },
    { number: '98%',  label: 'accurate' },
    { number: '100%', label: 'on-device' },
    { number: '99',   label: 'languages' },
    { number: '$0',   label: 'per minute' },
    { number: '∞',    label: 'meetings' }
  ];

  // Shuffled deck shared by all slots: a slot never draws a phrase that is
  // already on screen in another slot, and the deck only repeats once spent.
  function makeDeck(items) {
    let pile = [];
    const showing = new Set();
    return {
      draw(prev) {
        if (!pile.length) {
          pile = items.slice();
          for (let i = pile.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pile[i], pile[j]] = [pile[j], pile[i]];
          }
        }
        let idx = pile.findIndex((x) => !showing.has(x) && x !== prev);
        if (idx < 0) idx = 0;
        const item = pile.splice(idx, 1)[0];
        showing.add(item);
        return item;
      },
      release(item) { showing.delete(item); }
    };
  }
  const barDeck = makeDeck(SCRIPT_BARS);
  const circleDeck = makeDeck(SCRIPT_CIRCLE);

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

  // Safety net: if a phrase still overflows its bar (odd font fallback),
  // step the font down until it fits.
  function fitToBar(el) {
    const bar = el.parentElement;
    let size = parseFloat(getComputedStyle(el).fontSize);
    while (el.scrollWidth > bar.clientWidth * 0.9 && size > 7) {
      size -= 0.5;
      el.style.fontSize = size + 'px';
    }
  }

  async function fadeOut(el) {
    el.classList.add('is-fading');
    await new Promise((r) => setTimeout(r, 600));
  }

  async function runBar(el, index) {
    // Stagger start so the 3 lines begin in sequence, not in unison.
    await new Promise((r) => setTimeout(r, index * 1600));
    let phrase = null;
    while (true) {
      phrase = barDeck.draw(phrase);
      el.style.fontSize = '';
      await typePhrase(el, phrase, true);
      fitToBar(el);
      await new Promise((r) => setTimeout(r, 1600));
      await fadeOut(el);
      barDeck.release(phrase);
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  async function runCircle(numberEl, labelEl, index) {
    await new Promise((r) => setTimeout(r, index * 1600));
    let stat = null;
    while (true) {
      stat = circleDeck.draw(stat);
      // Type the big number first (with cursor), then the small label (no cursor).
      await typePhrase(numberEl, stat.number, true);
      await typePhrase(labelEl, stat.label, false);
      await new Promise((r) => setTimeout(r, 1600));
      await fadeOut(numberEl);
      await fadeOut(labelEl);
      circleDeck.release(stat);
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  // Circle starts at index 0 (immediately). Bars stagger after.
  if (numberEl && labelEl) {
    runCircle(numberEl, labelEl, 0);
  }
  barTargets.forEach((bar, i) => runBar(bar, i + 1));
})();
