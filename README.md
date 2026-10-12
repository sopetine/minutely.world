# Minutely — Landing Page Prototype (v6)

Static, visual-only prototype of a fictional Mac app: auto-records Teams/Zoom
calls, transcribes with speaker diarization, summarizes, and lets you search and
ask questions over your meeting catalog (RAG), with prompt presets and local-LLM
support.

This is a portfolio / demand-validation artifact. No backend, no database, no
real auth, no real payment processing. Login and Payment pages are UI-only
mockups with zero network calls.

v6 changes (over v5):

- **Summary preview** under the hero video: a real Minutely summary
  (`assets/summary/sample.summary.md`) rendered with the app's own pipeline —
  the same marked v4.3.0 build (`assets/js/marked.min.js`, extracted from the
  app), the app's summary CSS ported 1:1 and scoped under `.app-summary`
  (`assets/css/summary.css`, incl. the saved typography overrides and accent
  `#0568a1`), and the same table-sizing and @mention passes
  (`assets/js/summary-preview.js`). Collapsed by default with "Show full
  summary"; text is selectable, and Copy puts rich text + plain text on the
  clipboard like ⌘C in the app.
- New, larger hero video (3:2, 1296×864, shown up to 1200px wide) in a softer
  frame: no black backing, hairline ring, and the logo's red/blue
  chromatic-aberration fringe.
- Premium cursor: a single dot that tracks the pointer exactly, morphs into a
  soft brand lens over links/buttons and a caret over text, fades when idle.
- Polish: tighter display type, eyebrow dots, hairline card highlights and
  calmer hovers, gradient icon tiles, gradient dividers, button sheen, popular
  plan glow. No structural changes.

v5 changes (over v4):

- New hero video (always muted, no sound button), 12px corners, an
  Apple-style scroll "settle" effect, and full-bleed width on phones.
- Smoother scrolling: Lenis now runs on the window, driven once per frame by
  the GSAP ticker (v4 ran it twice per frame inside a clipped wrapper div).
  Touch devices keep native momentum scrolling.
- Hero logo: 24 bar phrases + 10 circle stats drawn from a shared shuffled
  deck (never two identical lines on screen); text is sized in `cqw` so it
  fits the logo at every width.
- Higher-contrast cursor (white ring + dot with `mix-blend-mode: difference`).
- Hero CTA and microcopy removed; header "Buy for Mac" is the single CTA.
- Tighter vertical spacing across all sections.
- "Overview" nav link; "Most popular" tag no longer clipped.
- Checkout: plan switcher, card validation (Luhn, expiry, CVC), then an
  account step that ends in a licensing-service timeout message.
- Sign in: ends in an authentication-service timeout message.
- No "demo" wording anywhere in the UI.

v4 added the 30-second product overview video to the hero.

v3 is a premium refresh of the `minutely/` prototype one directory up: tighter,
more consistent copy across all 8 pages; a typography fix for the Instrument
Serif accent words (they were sitting visually undersized next to Inter at
matched font-size); a calmer single-color hero mark instead of the old
red/blue chromatic-aberration split; and a cleanup pass (a broken `init.js`,
inconsistent `theme-color` and contact-email domains, and this README's own
description brought back in line with what's actually built).

## Stack

- **Plain HTML, CSS, vanilla JS** — no framework, no build step
- **Lenis** — premium smooth-scroll
- **GSAP + ScrollTrigger** — industry-standard scroll animations
- **Material Symbols** (Google Fonts) — icon system
- **Inter** + **Instrument Serif** + **JetBrains Mono** (Google Fonts) — premium type stack

## Pages

- `index.html` — Home: hero, 3 value props, Before/During/After walkthrough, 6-feature grid, 4-tier pricing, FAQ, footer
- `changelog.html` — Version history (v0.1 → v1.4)
- `docs.html` — Documentation: getting started, features, privacy, supported platforms, pricing & licensing, shortcuts, troubleshooting
- `login.html` — Mock sign-in. Validates email/password format, shows a spinner for ~9.5 s, then a "504 · auth-eu-west-1" timeout alert with a random request ID. Nothing is sent or stored.
- `payment.html` — Mock checkout. Plan switcher (`?tier=personal|pro|team` preselects and is kept in sync). Card form validates like a real one (any Luhn-valid number, e.g. `4242 4242 4242 4242`, future expiry, 3-digit CVC). Next comes a "One last step" account form, which ends after ~8.5 s in a "504 · lic-eu-west-1" licensing timeout ("your card has not been charged"). Nothing is sent or stored.
- `404.html`, `privacy.html`, `terms.html` — Legal/error pages

## Run locally

ES module imports are blocked on `file://`, so use a static server:

```bash
npx serve .
# or
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy

Drag-and-drop the folder onto Vercel or Netlify — no build step required.

The only external requests at runtime are Google Fonts (Inter, Instrument Serif,
JetBrains Mono, Material Symbols).

Login and Payment are 100% client-side state machines; no `fetch`,
`XMLHttpRequest`, or third-party SDK calls.

## File layout

```
v6/
├── index.html
├── login.html
├── payment.html
├── changelog.html
├── docs.html
├── README.md
├── 404.html, privacy.html, terms.html, robots.txt, sitemap.xml
└── assets/
    ├── css/
    │   ├── tokens.css      # design tokens (color, spacing, radius, type, easings, mesh gradients, shadows)
    │   ├── base.css        # resets, typography, layout, buttons, cursor, view-transitions
    │   ├── animations.css  # reveal primitives, staggers, text-reveal, page-enter
    │   ├── home.css        # hero, value-props, walkthrough, features, pricing, FAQ, footer, changelog, docs
    │   └── auth.css        # login + payment page styles
    ├── js/
    │   ├── init.js       # viewport --vw/--vh custom properties
    │   ├── scroll.js     # Lenis + ScrollTrigger + reveals (master orchestrator)
    │   ├── magnetic.js   # magnetic button hover effect
    │   ├── cursor.js     # Apple-style custom cursor
    │   ├── typewriter.js # hero logo bars/circle typewriter effect
    │   ├── hero-video.js # hero video: in-view muted autoplay
    │   ├── auth-ui.js    # shared form helpers: inline errors, busy button, timeout alert
    │   ├── login.js      # mock sign-in flow
    │   └── payment.js    # mock checkout: plan switcher, card validation, account step
    ├── img/
    │   ├── logo.svg
    │   └── favicon.svg
    └── video/
        ├── hero-864.mp4      # desktop, 1296×864 H.264 30 fps, ~8.9 MB, faststart, no audio
        ├── hero-480.mp4      # mobile (≤720px), 720×480, ~2.7 MB, no audio
        └── hero-poster.webp  # poster / LCP image (preloaded)
```

All icons on the site come from the Material Symbols web font — there are no
screenshot mocks or icon sprite files in `img/`.

## Hero video

The overview clip is committed to the repo and served same-origin by Vercel
(no external video host). Behaviour:

- `preload="none"` + poster image, so nothing downloads until the video is
  25% on screen; it pauses when scrolled away or the tab is hidden.
- Mobile (≤720px) gets the 480p file; `hero-video.js` swaps `src` before
  anything loads (`<source media>` isn't honoured everywhere).
- Always muted + `playsinline` so iOS allows autoplay; the files carry no
  audio track.
- No autoplay with `prefers-reduced-motion` or Data Saver — poster only.
- Scroll effect: `scroll.js` tweens `--expand` 0 → 1 on the figure; CSS maps it
  to `scale` (and, on phones, the corner radius down to 0 for a full-bleed finish).

Re-encode from the master (`~/Movies/OBS/(Oct 12, Mon) 15:29 - [Teams Meeting].mp4`,
1296×864 @ 60 fps) with two-pass x264, 30 fps, `-an -movflags +faststart`:
1296×864 @ 2.2 Mb/s and 720×480 @ 650 kb/s. Poster: frame at 4 s, WebP q80 via `cwebp`.

## Premium touches

- **Smooth scroll** (Lenis on the window, lerp 0.1, wheel only)
- **Scroll-triggered reveals** on every section (degrades gracefully if JS fails)
- **Staggered children animations** on grids
- **Word-by-word text reveal** on hero headings (preserves `<em>` styling + gradient)
- **3D mouse tilt** on hero mockup and featured cards (when used)
- **Mouse-following spotlights** on every card
- **Magnetic buttons** that pull toward your cursor
- **Custom cursor** (Apple-style, with hover state) — disabled on touch devices
- **Smooth FAQ accordion** with rotating + → × icon
- **Scroll progress bar** at the top
- **Nav background appears on scroll**
- **Mesh gradient hero** with multiple radial gradients
- **Page transitions** via CSS View Transitions API
- **Subtle noise texture** on key surfaces
- **Gradient italic accent text** in every section header, re-baselined so Instrument Serif sits level with the surrounding Inter

## Browser support

- **Lenis**: evergreen Chromium, Firefox, Safari 15+
- **View Transitions API**: optional enhancement, falls back silently
- **ScrollTrigger**: evergreen browsers

All animations respect `prefers-reduced-motion: reduce` and gracefully degrade.

## Notes for future development

This is a prototype. Real implementation would need:
- A real backend for auth, payment processing, and meeting data sync
- Native macOS audio capture (requires a real macOS app, not a web page)
- Speaker diarization pipeline (Whisper + pyannote)
- On-device LLM orchestration (llama.cpp, MLX, etc.)
