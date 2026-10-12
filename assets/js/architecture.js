// "Under the hood" diagram: one data model, two layouts (wide / phone).
// Hover, tap or focus a node to trace its links. Both summary models —
// on-device and your own key — are drawn in the same picture.
(function () {
  const fig = document.querySelector('[data-arch]');
  if (!fig) return;
  const host = fig.querySelector('.arch-canvas');
  const caption = fig.querySelector('[data-arch-caption]');
  const defaultCaption = caption.textContent;
  const NS = 'http://www.w3.org/2000/svg';

  const NODES = [
    { id: 'detector', icon: 'radar', label: 'Call detector', sub: 'Teams · Zoom · Meet', cap: 'Notices the call window the moment you join, and when you leave.' },
    { id: 'capture', icon: 'mic', label: 'Capture', sub: 'screen + audio', cap: 'Records screen and system audio on your Mac — nothing joins the call.' },
    { id: 'library', icon: 'folder', label: 'Local library', sub: 'files on your disk', cap: 'Every recording, transcript and summary is a file on your own disk.' },
    { id: 'prep', icon: 'equalizer', label: 'Audio prep', sub: 'mono · 16 kHz', cap: 'Extracts a clean mono 16 kHz track so long recordings transcribe reliably.' },
    { id: 'lang', icon: 'translate', label: 'Language', sub: 'auto-detected', cap: 'Listens to the opening of the call and locks the language, so the transcript never drifts.' },
    { id: 'whisper', icon: 'subtitles', label: 'Whisper', sub: 'speech to text', cap: 'Whisper turns speech into timestamped text on Apple Silicon. You pick the model size.' },
    { id: 'diar', icon: 'record_voice_over', label: 'Speaker ID', sub: 'diarisation', chips: ['voice activity', 'voice fingerprints', 'clustering'], cap: 'Finds who spoke when: detects speech, fingerprints each voice and clusters them into speakers.' },
    { id: 'aligned', icon: 'segment', label: 'Transcript', sub: 'speaker-aligned', cap: 'Each line gets its speaker by matching voice turns to the text by timing.' },
    { id: 'names', icon: 'badge', label: 'Names & roles', sub: 'speaker registry', cap: 'Name a speaker once and give them a role — every future summary knows them.' },
    { id: 'prompt', icon: 'edit_note', label: 'Your prompt', sub: '+ meeting context', cap: 'Your own prompt and structure, plus any context you add for this meeting.' },
    { id: 'summary', icon: 'auto_awesome', label: 'Summary engine', sub: 'builds the request', cap: 'Combines the transcript, names, roles, your prompt and context, then asks the model you chose.' },
    { id: 'llm', icon: 'memory', label: 'Local model', sub: 'Ollama · LM Studio', cap: 'Writes the summary fully offline, on your Mac.' },
    { id: 'provider', icon: 'key', label: 'Your AI provider', sub: 'optional · your key', cap: 'Optional. Only transcript text is sent, with your own key — audio never leaves.', outside: true },
    { id: 'md', icon: 'description', label: 'Summary', sub: 'decisions · owners', cap: 'A Markdown summary with decisions, owners and deadlines — copy it anywhere.' },
    { id: 'search', icon: 'manage_search', label: 'Search & Ask', sub: 'every meeting', cap: 'Search every word, or ask a follow-up question and jump to the moment.' },
    { id: 'player', icon: 'play_circle', label: 'Synced player', sub: 'video + transcript', cap: 'Replays the meeting with the transcript scrolling along. Click a line to jump.' }
  ];

  function box(L, id) {
    const [x, y] = L.pos[id];
    const n = NODES.find((m) => m.id === id);
    const w = n.outside ? L.ow : L.w;
    const h = n.chips ? L.ch : L.h;
    return { x, y, w, h, r: x + w, b: y + h, cx: x + w / 2, cy: y + L.h / 2 };
  }
  const right = (a, b) => [[a.r, a.cy], [b.x, b.cy]];
  const left = (a, b) => [[a.x, a.cy], [b.r, b.cy]];
  const down = (a, b) => [[a.cx, a.b], [b.cx, b.y]];

  const LAYOUTS = {
    wide: {
      w: 156, h: 58, ch: 112, ow: 172, view: [1124, 530], mac: [12, 24, 1100, 400],
      pos: {
        detector: [32, 56], capture: [212, 56], library: [392, 56], prep: [572, 56], lang: [752, 56], whisper: [932, 56],
        names: [212, 176], prompt: [392, 176], summary: [572, 176], aligned: [752, 176], diar: [932, 176],
        player: [32, 340], search: [212, 340], md: [392, 340], llm: [752, 340],
        provider: [924, 460]
      },
      edges(B) {
        const g1 = (B.detector.b + B.names.y) / 2;
        const gMd = 302, gModel = 318;
        return [
          ['detector', 'capture', right(B.detector, B.capture), 'main'],
          ['capture', 'library', right(B.capture, B.library), 'main'],
          ['library', 'prep', right(B.library, B.prep), 'main'],
          ['prep', 'lang', right(B.prep, B.lang), 'main'],
          ['lang', 'whisper', right(B.lang, B.whisper), 'main'],
          ['whisper', 'diar', down(B.whisper, B.diar), 'main'],
          ['diar', 'aligned', left(B.diar, B.aligned), 'main'],
          ['aligned', 'summary', left(B.aligned, B.summary), 'main'],
          ['names', 'prompt', right(B.names, B.prompt), ''],
          ['prompt', 'summary', right(B.prompt, B.summary), ''],
          ['library', 'player', [[B.library.x + 30, B.library.b], [B.library.x + 30, g1], [B.player.cx, g1], [B.player.cx, B.player.y]], ''],
          ['summary', 'md', [[B.summary.x + 30, B.summary.b], [B.summary.x + 30, gMd], [B.md.cx, gMd], [B.md.cx, B.md.y]], 'main'],
          ['md', 'search', left(B.md, B.search), ''],
          ['summary', 'llm', [[B.summary.r - 30, B.summary.b], [B.summary.r - 30, gModel], [B.llm.cx, gModel], [B.llm.cx, B.llm.y]], 'model'],
          ['summary', 'provider', [[B.summary.r - 30, B.summary.b], [B.summary.r - 30, gModel], [B.provider.cx, gModel], [B.provider.cx, B.provider.y]], 'byok']
        ];
      },
      junction: (B) => [B.summary.r - 30, 318],
      outLabel: (B) => [B.provider.cx - 10, 446, 'end']
    },
    narrow: {
      // Two-column snake so both columns fill from the top.
      w: 160, h: 56, ch: 104, ow: 166, view: [380, 816], mac: [4, 16, 372, 708],
      pos: {
        detector: [14, 40], capture: [206, 40],
        player: [14, 120], library: [206, 120],
        lang: [14, 200], prep: [206, 200],
        whisper: [14, 280], diar: [206, 280],
        names: [14, 408], aligned: [206, 408],
        prompt: [14, 488], summary: [206, 488],
        llm: [14, 572], md: [206, 572],
        search: [206, 652],
        provider: [14, 746]
      },
      edges(B) {
        const gy = (B.summary.b + B.llm.y) / 2, sx = B.summary.x + 30, gx = (B.llm.r + B.md.x) / 2;
        return [
          ['detector', 'capture', right(B.detector, B.capture), 'main'],
          ['capture', 'library', down(B.capture, B.library), 'main'],
          ['library', 'player', left(B.library, B.player), ''],
          ['library', 'prep', down(B.library, B.prep), 'main'],
          ['prep', 'lang', left(B.prep, B.lang), 'main'],
          ['lang', 'whisper', down(B.lang, B.whisper), 'main'],
          ['whisper', 'diar', right(B.whisper, B.diar), 'main'],
          ['diar', 'aligned', down(B.diar, B.aligned), 'main'],
          ['aligned', 'summary', down(B.aligned, B.summary), 'main'],
          ['names', 'prompt', down(B.names, B.prompt), ''],
          ['prompt', 'summary', right(B.prompt, B.summary), ''],
          ['summary', 'md', down(B.summary, B.md), 'main'],
          ['md', 'search', down(B.md, B.search), ''],
          ['summary', 'llm', [[sx, B.summary.b], [sx, gy], [B.llm.cx, gy], [B.llm.cx, B.llm.y]], 'model'],
          ['summary', 'provider', [[sx, B.summary.b], [sx, gy], [gx, gy], [gx, B.provider.cy], [B.provider.r, B.provider.cy]], 'byok']
        ];
      },
      junction: (B) => [(B.llm.r + B.md.x) / 2, (B.summary.b + B.llm.y) / 2],
      junctionLabel: (jx, jy) => [jx - 9, jy - 5, 'end'],
      outLabel: (B) => [B.provider.x, 736, 'start']
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
    svg = el('svg', { viewBox: '0 0 ' + L.view.join(' '), class: 'arch-svg arch-' + kind, role: 'img', 'aria-labelledby': 'arch-title' });
    el('title', { id: 'arch-title' }, svg).textContent = 'Minutely architecture: everything runs inside your Mac; the only optional path out is transcript text to your own AI provider.';
    const defs = el('defs', {}, svg);
    const marker = el('marker', { id: 'arch-arrow', viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' }, defs);
    el('path', { d: 'M0,1 L9,5 L0,9 z', class: 'arch-arrowhead' }, marker);

    const [mx, my, mw, mh] = L.mac;
    el('rect', { x: mx, y: my, width: mw, height: mh, rx: 22, class: 'arch-mac' }, svg);
    el('text', { x: mx + 18, y: my + 2, class: 'arch-mac-label' }, svg).textContent = 'YOUR MAC';

    const B = {};
    NODES.forEach((n) => { B[n.id] = box(L, n.id); });
    const edges = L.edges(B);
    const edgeLayer = el('g', { class: 'arch-edges' }, svg);
    edges.forEach(([from, to, pts, kindCls]) => {
      const d = 'M' + pts.map((p) => p.join(',')).join(' L');
      el('path', { d, class: 'arch-edge' + (kindCls ? ' arch-edge-' + kindCls : ''), 'data-from': from, 'data-to': to, 'marker-end': 'url(#arch-arrow)' }, edgeLayer);
    });

    // "either / or" junction where the two model paths split.
    const [jx, jy] = L.junction(B);
    el('circle', { cx: jx, cy: jy, r: 4.5, class: 'arch-junction' }, svg);
    const jl = L.junctionLabel ? L.junctionLabel(jx, jy) : [jx + 9, jy - 8, 'start'];
    el('text', { x: jl[0], y: jl[1], 'text-anchor': jl[2], class: 'arch-junction-label' }, svg).textContent = 'either';

    const [lx, ly, anchor] = L.outLabel(B);
    el('text', { x: lx, y: ly, class: 'arch-edge-label', 'text-anchor': anchor }, svg).textContent = 'text only · your key';

    const nodeLayer = el('g', { class: 'arch-nodes' }, svg);
    NODES.forEach((n) => {
      const b = B[n.id];
      const g = el('g', { class: 'arch-node' + (n.outside ? ' arch-node-out' : '') + (n.chips ? ' arch-node-tall' : ''), 'data-id': n.id, tabindex: 0, role: 'button', 'aria-label': n.label + ' — ' + n.cap, transform: 'translate(' + b.x + ',' + b.y + ')' }, nodeLayer);
      el('rect', { width: b.w, height: b.h, rx: 14, class: 'arch-node-box' }, g);
      const mid = L.h / 2;
      el('text', { x: 13, y: mid + 7, class: 'arch-node-icon' }, g).textContent = n.icon;
      el('text', { x: 42, y: mid - 3, class: 'arch-node-label' }, g).textContent = n.label;
      el('text', { x: 42, y: mid + 13, class: 'arch-node-sub' }, g).textContent = n.sub;
      if (n.chips) {
        n.chips.forEach((c, i) => {
          const cy = L.h + 2 + i * 16;
          el('rect', { x: 12, y: cy - 1, width: b.w - 24, height: 14, rx: 7, class: 'arch-chip' }, g);
          el('text', { x: b.w / 2, y: cy + 9.5, class: 'arch-chip-text', 'text-anchor': 'middle' }, g).textContent = (i + 1) + ' · ' + c;
        });
      }
    });
    host.appendChild(svg);
    bind();
  }

  function linked(a, b) {
    return !!svg.querySelector('.arch-edge[data-from="' + a + '"][data-to="' + b + '"], .arch-edge[data-from="' + b + '"][data-to="' + a + '"]');
  }
  function focusNode(id) {
    svg.classList.toggle('is-tracing', !!id);
    svg.querySelectorAll('.arch-node').forEach((g) => g.classList.toggle('is-on', !!id && (g.dataset.id === id || linked(id, g.dataset.id))));
    svg.querySelectorAll('.arch-edge').forEach((p) => p.classList.toggle('is-on', p.dataset.from === id || p.dataset.to === id));
    const n = NODES.find((x) => x.id === id);
    caption.textContent = n ? n.cap : defaultCaption;
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

  const mq = window.matchMedia('(max-width: 719px)');
  const pick = () => { const k = mq.matches ? 'narrow' : 'wide'; if (k !== current) render(k); };
  mq.addEventListener('change', pick);
  pick();
})();
