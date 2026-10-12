// Summary preview: renders a real Minutely summary with the app's own
// pipeline (marked v4.3.0 + the post-processing passes from
// RightPanelView.renderedPage), then adds expand/collapse and Copy.
(function () {
  'use strict';

  const win = document.querySelector('[data-summary-window]');
  if (!win || !window.marked) return;
  const content = win.querySelector('.app-summary');
  const body = win.querySelector('.summary-body');
  const toggle = win.querySelector('.summary-toggle');
  const toggleLabel = toggle.querySelector('[data-toggle-label]');
  const copyBtn = win.querySelector('.summary-copy');
  const copyLabel = copyBtn.querySelector('[data-copy-label]');
  const COLLAPSED = window.matchMedia('(max-width: 720px)').matches ? 420 : 460;
  let markdown = '';

  // ---- Same passes as the app (main.swift, renderedPage <script>) ----

  // Content-proportional column widths + drag-to-resize handles.
  function sizeTables(selector) {
    const MIN = 12, MAX = 55;
    const clamp = (v) => Math.min(MAX, Math.max(MIN, v));
    function measureAndApply(tbl) {
      const old = tbl.querySelector('colgroup'); if (old) old.remove();
      tbl.querySelectorAll('.col-resizer').forEach((h) => h.remove());
      const rows = Array.from(tbl.querySelectorAll('tr'));
      if (!rows.length) return;
      let ncols = 0;
      rows.forEach((r) => { ncols = Math.max(ncols, r.cells.length); });
      if (ncols < 2) return;
      const weights = new Array(ncols).fill(0);
      rows.forEach((r, ri) => {
        Array.from(r.cells).forEach((cell, ci) => {
          const len = (cell.textContent || '').trim().length;
          weights[ci] = Math.max(weights[ci], ri === 0 ? len * 1.5 : len);
        });
      });
      const total = weights.reduce((a, b) => a + b, 0) || 1;
      let pcts = weights.map((w) => clamp(w / total * 100));
      const sum = pcts.reduce((a, b) => a + b, 0);
      pcts = pcts.map((p) => p / sum * 100);
      const cg = document.createElement('colgroup');
      pcts.forEach((p) => {
        const col = document.createElement('col');
        col.style.width = p.toFixed(1) + '%';
        cg.appendChild(col);
      });
      tbl.prepend(cg);
      Array.from(tbl.querySelectorAll('th')).slice(0, -1).forEach((th, i) => {
        const handle = document.createElement('div');
        handle.className = 'col-resizer';
        th.appendChild(handle);
        handle.addEventListener('mousedown', (e) => {
          e.preventDefault();
          const cols = cg.querySelectorAll('col');
          const tblW = tbl.offsetWidth || 1;
          const startX = e.clientX;
          const startI = parseFloat(cols[i].style.width);
          const startJ = parseFloat(cols[i + 1].style.width);
          handle.classList.add('dragging');
          function onMove(ev) {
            const dx = (ev.clientX - startX) / tblW * 100;
            cols[i].style.width = Math.min(MAX, Math.max(MIN, startI + dx)).toFixed(1) + '%';
            cols[i + 1].style.width = Math.min(MAX, Math.max(MIN, startJ - dx)).toFixed(1) + '%';
          }
          function onUp() {
            handle.classList.remove('dragging');
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            tbl.dataset.userResized = '1';
          }
          document.addEventListener('mousemove', onMove);
          document.addEventListener('mouseup', onUp);
        });
      });
    }
    content.querySelectorAll(selector).forEach(measureAndApply);
  }

  // @mention chips (single-word fallback; no code/pre).
  function tagMentions() {
    const re = /@(?:[A-Za-z][A-Za-z0-9_.]*)/g;
    const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        for (let p = n.parentNode; p; p = p.parentNode) {
          if (p.tagName === 'CODE' || p.tagName === 'PRE') return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = []; let n;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach((node) => {
      if (!re.test(node.textContent)) return;
      re.lastIndex = 0;
      const frag = document.createElement('span');
      frag.textContent = node.textContent;
      frag.innerHTML = frag.innerHTML.replace(re, '<span class="mention">$&</span>');
      node.parentNode.replaceChild(frag, node);
    });
  }

  // Phones: let wide tables scroll inside the panel instead of squashing.
  function wrapTables() {
    content.querySelectorAll('table').forEach((t) => {
      const w = document.createElement('div');
      w.className = 'summary-table-scroll';
      t.parentNode.insertBefore(w, t);
      w.appendChild(t);
    });
  }

  function render(md) {
    markdown = md;
    window.marked.use({ gfm: true, breaks: false });
    content.innerHTML = window.marked.parse(md);
    wrapTables();
    sizeTables('table');
    tagMentions();
    if (window.ResizeObserver) {
      let raf = null;
      new ResizeObserver(() => {
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          sizeTables('table:not([data-user-resized])');
          if (win.classList.contains('is-expanded')) body.style.height = content.offsetHeight + 'px';
        });
      }).observe(content);
    }
  }

  // ---- Expand / collapse ----
  function refreshScroll() {
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    else window.dispatchEvent(new Event('resize'));
  }

  toggle.addEventListener('click', () => {
    const expanding = !win.classList.contains('is-expanded');
    body.style.height = (expanding ? content.offsetHeight : COLLAPSED) + 'px';
    win.classList.toggle('is-expanded', expanding);
    toggle.setAttribute('aria-expanded', expanding ? 'true' : 'false');
    toggleLabel.textContent = expanding ? 'Collapse' : 'Show full summary';
    if (!expanding) {
      const top = win.getBoundingClientRect().top + window.scrollY - 90;
      if (window.__lenis) window.__lenis.scrollTo(top, { duration: 0.9 });
      else window.scrollTo({ top, behavior: 'smooth' });
    }
    setTimeout(refreshScroll, 750);
  });
  body.style.height = COLLAPSED + 'px';

  // ---- Copy: rich text (as rendered) + markdown as plain text ----
  copyBtn.addEventListener('click', async () => {
    const clone = content.cloneNode(true);
    clone.querySelectorAll('.col-resizer, colgroup').forEach((el) => el.remove());
    const html = '<meta charset="utf-8">' + clone.innerHTML;
    try {
      if (window.ClipboardItem && navigator.clipboard && navigator.clipboard.write) {
        await navigator.clipboard.write([new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([markdown], { type: 'text/plain' })
        })]);
      } else {
        await navigator.clipboard.writeText(markdown);
      }
      copyBtn.classList.add('is-copied');
      copyLabel.textContent = 'Copied';
    } catch (e) {
      // Async clipboard blocked: copy the selected panel the way ⌘C would
      // (rich text, like copying from the app's summary view).
      const range = document.createRange();
      range.selectNodeContents(content);
      const sel = window.getSelection();
      sel.removeAllRanges(); sel.addRange(range);
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (err) {}
      if (ok) {
        sel.removeAllRanges();
        copyBtn.classList.add('is-copied');
        copyLabel.textContent = 'Copied';
      } else {
        copyLabel.textContent = 'Press ⌘C';
      }
    }
    setTimeout(() => { copyBtn.classList.remove('is-copied'); copyLabel.textContent = 'Copy'; }, 1600);
  });

  fetch(win.dataset.summarySrc)
    .then((r) => r.text())
    .then(render)
    .catch(() => { win.hidden = true; });
})();
