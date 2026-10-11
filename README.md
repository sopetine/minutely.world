# Minutely — Landing Page Prototype (v3)

Static, visual-only prototype of a fictional Mac app: auto-records Teams/Zoom
calls, transcribes with speaker diarization, summarizes, and lets you search and
ask questions over your meeting catalog (RAG), with prompt presets and local-LLM
support.

This is a portfolio / demand-validation artifact. No backend, no database, no
real auth, no real payment processing. Login and Payment pages are UI-only
mockups with zero network calls.

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
- `login.html` — Mock login (any email/password works, no validation). Heading: "Welcome back"
- `payment.html` — Mock payment. Use `4242 4242 4242 4242` for success, `4000 0000 0000 0002` for declined. Pass `?tier=personal|pro|team&amount=N` in the URL to preselect a plan
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
v3/
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
    │   ├── login.js      # mock auth state machine
    │   └── payment.js    # mock payment state machine
    └── img/
        ├── logo.svg
        └── favicon.svg
```

All icons on the site come from the Material Symbols web font — there are no
screenshot mocks or icon sprite files in `img/`.

## Premium touches

- **Smooth scroll** (Lenis, 1.15s duration with custom easing)
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
