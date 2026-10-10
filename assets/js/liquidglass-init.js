import { LiquidGlass } from 'https://cdn.jsdelivr.net/npm/@ybouane/liquidglass/dist/index.js';

function supportsLiquidGlass() {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl') || c.getContext('experimental-webgl');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const c2 = c.getContext('2d');
    return !!gl && !!c2 && typeof svg.createSVGPoint === 'function';
  } catch (e) { return false; }
}

async function initGlassNav() {
  if (!supportsLiquidGlass()) {
    document.body.classList.add('no-webgl-fallback');
    return;
  }
  const root = document.querySelector('.glass-nav-root');
  const glassEl = document.querySelector('.glass-nav');
  if (!root || !glassEl) return;
  try {
    const config = JSON.parse(glassEl.dataset.config || '{}');
    await LiquidGlass.init({
      root,
      glassElements: [glassEl],
      defaults: {
        cornerRadius: 9999,
        blurAmount: 0.5,
        refraction: 0.4,
        chromAberration: 0.02,
        edgeHighlight: 0.12,
        specular: 0.1,
        fresnel: 0.85,
        distortion: 0,
        opacity: 0.85,
        saturation: 0.05,
        tintStrength: 0.06,
        brightness: 0.06,
        shadowOpacity: 0.2,
        shadowSpread: 18,
        shadowOffsetY: 6,
        floating: false,
        button: false,
        bevelMode: 0
      }
    });
  } catch (err) {
    console.warn('[minutely-v2] LiquidGlass init failed, CSS fallback:', err);
    document.body.classList.add('no-webgl-fallback');
  }
}

initGlassNav();
