// "Under the hood" diagram: one data model, two layouts (wide / phone).
// Hover, tap or focus a node to trace its links; the mode toggle shows the
// one optional path out of the Mac.
(function () {
  const fig = document.querySelector('[data-arch]');
  if (!fig) return;
  const host = fig.querySelector('.arch-canvas');
  const caption = fig.querySelector('[data-arch-caption]');
  const defaultCaption = caption.textContent;
  const NS = 'http://www.w3.org/2000/svg';

  const NODES = [
    { id: 'detector', icon: 'radar', label: 'Meeting detector', sub: 'Teams · Zoom · Meet', cap: 'Notices the call window the moment you join, and when you leave.' },
    { id: 'capture', icon: 'mic', label: 'Capture', sub: 'screen + audio', cap: 'Records screen and system audio on your Mac — nothing joins the call.' },
    { id: 'library', icon: 'folder', label: 'Local library', sub: 'recordings on disk', cap: 'Every recording, transcript and summary is a file on your own disk.' },
    { id: 'whisper', icon: 'subtitles', label: 'Whisper', sub: 'speech to text', cap: 'Whisper turns audio into text on Apple Silicon. Free, no per-minute fees.' },
    { id: 'speakers', icon: 'record_voice_over', label: 'Speaker ID', sub: 'who said what', cap: 'Tells voices apart from the audio alone, so every line has a speaker.' },
    { id: 'player', icon: 'play_circle', label: 'Synced player', sub: 'video + transcript', cap: 'Replays the meeting with the transcript scrolling along. Click a line to jump.' },
    { id: 'search', icon: 'manage_search', label: 'Search & Ask', sub: 'every past meeting', cap: 'Searches every word, or answers a plain-English question with the moment it happened.' },
    { id: 'names', icon: 'badge', label: 'Names & roles', sub: 'your speaker registry', cap: 'Name a speaker once and give them a role — every future summary knows them.' },
    { id: 'summary', icon: 'auto_awesome', label: 'Summary engine', sub: 'your prompt + context', cap: 'Builds the summary from the transcript, names, roles, your prompt and your context.' },
    { id: 'llm', icon: 'memory', label: 'Local model', sub: 'Ollama / LM Studio', cap: 'Writes the summary fully offline on your Mac.' },
    { id: 'provider', icon: 'key', label: 'Your AI provider', sub: 'optional · your key', cap: 'Optional. Only transcript text is sent, with your own key — audio never leaves.', outside: true }
  ];

  // Per layout: node size, node top-left positions, the "Your Mac" frame,
  // and orthogonal edge routes computed from node geometry.
  function box(L, id) {
    const [x, y] = L.pos[id];
    return { x, y, r: x + L.w, b: y + L.h, cx: x + L.w / 2, cy: y + L.h / 2 };
  }
  const right = (a, b) => [[a.r, a.cy], [b.x, b.cy]];
  const down = (a, b) => [[a.cx, a.b], [b.cx, b.y]];

  const LAYOUTS = {
    wide: {
      w: 176, h: 64, view: [1180, 470], mac: [8, 24, 888, 438],
      pos: {
        detector: [28, 56], capture: [252, 56], library: [476, 56], whisper: [700, 56],
        player: [252, 206], search: [476, 206], speakers: [700, 206],
        llm: [252, 330], names: [476, 330], summary: [700, 330],
        provider: [990, 330]
      },
      edges(B) {
        const libMid = (B.library.b + B.player.y) / 2, below = B.summary.b + 34;
        return [
          ['detector', 'capture', right(B.detector, B.capture), 'main'],
          ['capture', 'library', right(B.capture, B.library), 'main'],
          ['library', 'whisper', right(B.library, B.whisper), 'main'],
          ['whisper', 'speakers', down(B.whisper, B.speakers), 'main'],
          ['speakers', 'summary', down(B.speakers, B.summary), 'main'],
          ['library', 'player', [[B.library.x + 44, B.library.b], [B.library.x + 44, libMid], [B.player.cx, libMid], [B.player.cx, B.player.y]], ''],
          ['library', 'search', [[B.search.cx + 30, B.library.b], [B.search.cx + 30, B.search.y]], ''],
          ['names', 'summary', right(B.names, B.summary), ''],
          ['summary', 'llm', [[B.summary.cx, B.summary.b], [B.summary.cx, below], [B.llm.cx, below], [B.llm.cx, B.llm.b]], 'local'],
          ['summary', 'provider', right(B.summary, B.provider), 'byok']
        ];
      }
    },
    narrow: {
      w: 160, h: 60, view: [380, 770], mac: [4, 16, 372, 640],
      pos: {
        detector: [12, 40], capture: [12, 140], library: [12, 240], whisper: [12, 340],
        speakers: [12, 440], summary: [12, 560],
        player: [208, 240], search: [208, 340], names: [208, 440], llm: [208, 560],
        provider: [12, 690]
      },
      edges(B) {
        const gutter = (B.library.r + B.search.x) / 2, mid = (B.names.b + B.summary.y) / 2;
        return [
          ['detector', 'capture', down(B.detector, B.capture), 'main'],
          ['capture', 'library', down(B.capture, B.library), 'main'],
          ['library', 'whisper', down(B.library, B.whisper), 'main'],
          ['whisper', 'speakers', down(B.whisper, B.speakers), 'main'],
          ['speakers', 'summary', down(B.speakers, B.summary), 'main'],
          ['library', 'player', [[B.library.r, B.library.y + 20], [B.player.x, B.library.y + 20]], ''],
          ['library', 'search', [[B.library.r, B.library.y + 44], [gutter, B.library.y + 44], [gutter, B.search.cy], [B.search.x, B.search.cy]], ''],
          ['names', 'summary', [[B.names.cx, B.names.b], [B.names.cx, mid], [B.summary.r - 36, mid], [B.summary.r - 36, B.summary.y]], ''],
          ['summary', 'llm', right(B.summary, B.llm), 'local'],
          ['summary', 'provider', down(B.summary, B.provider), 'byok']
        ];
      }
    }
  };

  function el(name, attrs, parent) {
    const n = document.createElementNS(NS, name);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  let svg, current;
  function render(kind) {
    current = kind;
    const L = LAYOUTS[kind];
    host.textContent = '';
    svg = el('svg', { viewBox: '0 0 ' + L.view.join(' '), class: 'arch-svg', role: 'img', 'aria-labelledby': 'arch-title' });
    el('title', { id: 'arch-title' }, svg).textContent = 'Minutely architecture: everything runs inside your Mac; the only optional path out is transcript text to your own AI provider.';
    const defs = el('defs', {}, svg);
    const marker = el('marker', { id: 'arch-arrow', viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' }, defs);
    el('path', { d: 'M0,1 L9,5 L0,9 z', class: 'arch-arrowhead' }, marker);

    const [mx, my, mw, mh] = L.mac;
    el('rect', { x: mx, y: my, width: mw, height: mh, rx: 22, class: 'arch-mac' }, svg);
    const tag = el('text', { x: mx + 18, y: my + 2, class: 'arch-mac-label' }, svg);
    tag.textContent = 'YOUR MAC';

    const B = {};
    NODES.forEach((n) => { B[n.id] = box(L, n.id); });
    const edges = L.edges(B);
    const edgeLayer = el('g', { class: 'arch-edges' }, svg);
    edges.forEach(([from, to, pts, kindCls]) => {
      const d = 'M' + pts.map((p) => p.join(',')).join(' L');
      el('path', { d, class: 'arch-edge' + (kindCls ? ' arch-edge-' + kindCls : ''), 'data-from': from, 'data-to': to, 'marker-end': 'url(#arch-arrow)' }, edgeLayer);
    });
    // Label for the only edge that can leave the Mac.
    const out = edges.find((e) => e[3] === 'byok')[2];
    const macRight = L.mac[0] + L.mac[2];
    const lx = kind === 'wide' ? (macRight + out[1][0]) / 2 : out[0][0] + 10;
    const ly = kind === 'wide' ? out[0][1] - 10 : out[0][1] + 20;
    const lbl = el('text', { x: lx, y: ly, class: 'arch-edge-label', 'text-anchor': kind === 'wide' ? 'middle' : 'start' }, svg);
    lbl.textContent = 'text only';

    const nodeLayer = el('g', { class: 'arch-nodes' }, svg);
    NODES.forEach((n) => {
      const [x, y] = L.pos[n.id];
      const g = el('g', { class: 'arch-node' + (n.outside ? ' arch-node-out' : ''), 'data-id': n.id, tabindex: 0, role: 'button', 'aria-label': n.label + ' — ' + n.cap, transform: 'translate(' + x + ',' + y + ')' }, nodeLayer);
      const mid = L.h / 2;
      el('rect', { width: L.w, height: L.h, rx: 14, class: 'arch-node-box' }, g);
      el('text', { x: 14, y: mid + 7, class: 'arch-node-icon' }, g).textContent = n.icon;
      el('text', { x: 44, y: mid - 3, class: 'arch-node-label' }, g).textContent = n.label;
      el('text', { x: 44, y: mid + 13, class: 'arch-node-sub' }, g).textContent = n.sub;
    });
    host.appendChild(svg);
    bind();
  }

  function focusNode(id) {
    svg.classList.toggle('is-tracing', !!id);
    svg.querySelectorAll('.arch-node').forEach((g) => g.classList.toggle('is-on', g.dataset.id === id || linked(id, g.dataset.id)));
    svg.querySelectorAll('.arch-edge').forEach((p) => p.classList.toggle('is-on', p.dataset.from === id || p.dataset.to === id));
    const n = NODES.find((x) => x.id === id);
    caption.textContent = n ? n.cap : defaultCaption;
  }
  function linked(a, b) {
    if (!a) return false;
    return !!svg.querySelector('.arch-edge[data-from="' + a + '"][data-to="' + b + '"], .arch-edge[data-from="' + b + '"][data-to="' + a + '"]');
  }

  function bind() {
    svg.querySelectorAll('.arch-node').forEach((g) => {
      const id = g.dataset.id;
      g.addEventListener('mouseenter', () => focusNode(id));
      g.addEventListener('focus', () => focusNode(id));
      g.addEventListener('click', () => {
        focusNode(id);
        if (window.mtTrack) window.mtTrack('diagram_node', { id });
      });
      g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); g.dispatchEvent(new Event('click')); } });
    });
    svg.addEventListener('mouseleave', () => focusNode(null));
    svg.addEventListener('focusout', (e) => { if (!svg.contains(e.relatedTarget)) focusNode(null); });
  }

  // Mode toggle: local model (default) vs. your own key.
  fig.querySelectorAll('[data-arch-mode]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.archMode;
      fig.dataset.mode = mode;
      fig.querySelectorAll('[data-arch-mode]').forEach((b) => b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'));
      caption.textContent = mode === 'key'
        ? 'Your own key: only the transcript text goes to the provider you chose. Audio, video and files stay put.'
        : 'Local model: the summary is written on your Mac. Nothing leaves at all.';
      if (window.mtTrack) window.mtTrack('diagram_mode', { mode });
    });
  });

  const mq = window.matchMedia('(max-width: 719px)');
  const pick = () => { const k = mq.matches ? 'narrow' : 'wide'; if (k !== current) render(k); };
  mq.addEventListener('change', pick);
  pick();
})();
