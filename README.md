# minutely.world

Static site for [minutely.world](https://minutely.world). Hosted on [Vercel](https://vercel.com),
auto-deployed from the `main` branch of this repo.

## Local preview

No build step. Open `index.html` directly, or run a quick local server:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Editing

- `index.html` — homepage
- `404.html`, `login.html`, `payment.html`, `privacy.html`, `terms.html`, `changelog.html` — other pages
- `assets/css/` — design tokens + component styles
- `assets/js/` — `theme.js`, `tabs.js`, `scroll-reveal.js`, `liquidglass-init.js`
- `assets/img/` — favicon, hero art, OG card

Push to `main` → Vercel rebuilds and redeploys automatically.

## Deployment

Vercel project: <https://vercel.com/sopetine-2870/~/domains/minutely.world>
DNS: managed in Namecheap → see Vercel → Domains → `minutely.world` for the required records.
