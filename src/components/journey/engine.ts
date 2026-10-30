/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unused-expressions */
// @ts-nocheck — canvas engine ported as-is from a JS prototype; typed wrapper lives in HeroJourney.tsx
// Scroll-driven illustrated journey map (canvas). Ported from the Claude Design artifact.
const NAVY = 'rgba(30,34,72,';
const WW = 1200;
export const CAR_COLORS = { Red: '#D4553A', Yellow: '#E7B53C', Blue: '#4F7FA8' };
const ss = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function spline(pts, step) {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(i + 2, pts.length - 1)];
    const n = Math.max(2, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / step));
    for (let j = 0; j < n; j++) {
      const t = j / n, t2 = t * t, t3 = t2 * t;
      const f = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push({ x: f(p0[0], p1[0], p2[0], p3[0]), y: f(p0[1], p1[1], p2[1], p3[1]) });
    }
  }
  const last = pts[pts.length - 1]; out.push({ x: last[0], y: last[1] });
  let L = 0; out[0].l = 0;
  for (let i = 1; i < out.length; i++) { L += Math.hypot(out[i].x - out[i - 1].x, out[i].y - out[i - 1].y); out[i].l = L; }
  return out;
}
function at(s, l) {
  let lo = 0, hi = s.length - 1;
  l = clamp(l, 0, s[hi].l);
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (s[m].l < l) lo = m; else hi = m; }
  const a = s[lo], b = s[hi], t = (l - a.l) / ((b.l - a.l) || 1);
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, ang: Math.atan2(b.y - a.y, b.x - a.x) };
}
function wobble(rng, n, amt) { const r = []; for (let i = 0; i < n; i++) r.push(1 + (rng() - 0.5) * amt); return r; }
function blob(ctx, x, y, r, w, ry) {
  const n = w.length; ctx.beginPath();
  for (let i = 0; i <= n; i++) {
    const a = i / n * Math.PI * 2, k = w[i % n];
    const px = x + Math.cos(a) * r * k, py = y + Math.sin(a) * (ry || r) * k;
    i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
  }
  ctx.closePath();
}
function makePaper(seed) {
  const N = 512, c = document.createElement('canvas'); c.width = c.height = N;
  const x = c.getContext('2d'), rng = mulberry(seed);
  for (let i = 0; i < 520; i++) {
    const px = rng() * N, py = rng() * N, r = 10 + rng() * 70, light = rng() < 0.5;
    for (const ox of [-N, 0, N]) for (const oy of [-N, 0, N]) {
      const g = x.createRadialGradient(px + ox, py + oy, 0, px + ox, py + oy, r);
      const a = 0.025 + rng() * 0.05;
      g.addColorStop(0, light ? 'rgba(255,250,235,' + a + ')' : 'rgba(40,40,20,' + a + ')');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = g; x.fillRect(px + ox - r, py + oy - r, r * 2, r * 2);
    }
  }
  const id = x.getImageData(0, 0, N, N), d = id.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = rng();
    if (n < 0.5) { const k = (0.5 - n) * 46; d[i] = (d[i] * d[i + 3] / 255) * (1 - k / 255) + 255 * (k / 255); d[i + 1] = d[i]; d[i + 2] = d[i] * 0.95; d[i + 3] = Math.max(d[i + 3], k); }
    else { const k = (n - 0.5) * 40; d[i + 3] = Math.max(d[i + 3], k); }
  }
  x.putImageData(id, 0, 0);
  return c;
}

export interface JourneyOptions {
  canvas: HTMLCanvasElement;
  stage: HTMLElement;
  section: HTMLElement;
  /** 0..1 scroll progress of the journey section */
  getProgress: () => number;
  carColor?: keyof typeof CAR_COLORS;
  clouds?: boolean;
  /** current UI theme — picks the sky palette (night for dark, morning for light) */
  getTheme?: () => "light" | "dark";
}

export class JourneyEngine {
  canvas; stage; section; opts;
  pS = 0; uz = 1; uzT = 1; visible = true;

  constructor(opts: JourneyOptions) {
    this.canvas = opts.canvas; this.stage = opts.stage; this.section = opts.section;
    this.opts = { carColor: 'Red', clouds: true, ...opts };
  }

  start() {
    this.build();
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(this.stage);
    this.io = new IntersectionObserver(([e]) => { this.visible = e.isIntersecting; }, { rootMargin: '100px' });
    this.io.observe(this.section);
    // pinch / ctrl+wheel zoom and double-click, scoped to the map only
    this.onWheel = (e) => { if (!e.ctrlKey) return; e.preventDefault(); this.uzT = clamp(this.uzT * Math.exp(-e.deltaY * 0.01), 1, 3.2); };
    this.stage.addEventListener('wheel', this.onWheel, { passive: false });
    this.onDbl = () => { this.uzT = this.uzT > 1.2 ? 1 : 2.2; };
    this.stage.addEventListener('dblclick', this.onDbl);
    this.resize();
    const loop = (t) => { if (this.visible) this.frame(t / 1000); this.raf = requestAnimationFrame(loop); };
    this.raf = requestAnimationFrame(loop);
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.ro?.disconnect(); this.io?.disconnect();
    this.stage.removeEventListener('wheel', this.onWheel);
    this.stage.removeEventListener('dblclick', this.onDbl);
  }

  zoomIn() { this.uzT = clamp(this.uzT * 1.4, 1, 3.2); }
  zoomOut() { this.uzT = clamp(this.uzT / 1.4, 1, 3.2); }

  resize() {
    const c = this.canvas;
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.vw = this.stage.clientWidth; this.vh = this.stage.clientHeight;
    if (!this.vw || !this.vh) return;
    c.width = this.vw * this.dpr; c.height = this.vh * this.dpr;
    this.s = this.vw / (this.vw < 720 ? 560 : 1000);
    this.pat = null;
  }

  build() {
    const rng = mulberry(7);
    this.paper = makePaper(3);
    const road = spline([[600, -150], [600, 250], [560, 520], [480, 800], [540, 1100], [700, 1350], [690, 1650], [560, 1900], [500, 2150], [560, 2450], [690, 2700], [660, 3000], [510, 3250], [490, 3550], [640, 3850], [800, 4150], [760, 4500], [540, 4800], [440, 5150], [560, 5500], [740, 5800], [710, 6150], [600, 6400], [560, 6560]], 8);
    const river = spline([[150, -200], [110, 300], [170, 700], [90, 1150], [150, 1600], [80, 2050], [-60, 2400]], 10);
    this.road = road; this.river = river;
    this.lStart = road.find(p => p.y >= 230).l;
    const rd = (x, y, src) => { let m = 1e9; for (const p of (src || road)) { if (Math.abs(p.y - y) > 260) continue; const d = Math.hypot(p.x - x, p.y - y); if (d < m) m = d; } return m; };
    this.L = {
      sap: { x: 860, y: 640, w: 270, h: 200 },
      col: { x: 330, y: 370, rx: 115, ry: 88 },
      office: { x: 900, y: 2720, w: 170, h: 120 },
      farm: { x: 760, y: 6640 },
      pisa: { x: 385, y: 6610 },
    };
    const avoid = [[700, 510, 1020, 790], [190, 250, 490, 520], [280, 6440, 490, 6690], [790, 2630, 1130, 2900], [620, 6520, 1000, 6820]];
    const inAvoid = (x, y, pad) => avoid.some(b => x > b[0] - pad && x < b[2] + pad && y > b[1] - pad && y < b[3] + pad);

    const roofCols = ['#C9643A', '#D9773F', '#CC6E44', '#B95A35', '#E08A4E'];
    this.blocks = [];
    for (let gy = 60; gy < 2050; gy += 62) for (let gx = 190; gx < 1200; gx += 62) {
      const dens = gy < 1650 ? 0.82 : 0.82 * (1 - (gy - 1650) / 400);
      if (rng() > dens) continue;
      const x = gx + (rng() - 0.5) * 16, y = gy + (rng() - 0.5) * 16, w = 30 + rng() * 22, h = 24 + rng() * 18;
      if (rd(x, y) < 30 + w / 2 || inAvoid(x, y, 26) || rd(x, y, river) < 50) continue;
      this.blocks.push({ x, y, w, h, a: (rng() - 0.5) * 0.25, c: roofCols[Math.floor(rng() * roofCols.length)] });
    }
    this.pines = [];
    for (let i = 0; i < 90; i++) {
      const x = rng() * 1200, y = rng() * 2100, r = 9 + rng() * 8;
      if (rd(x, y) < 26 + r || inAvoid(x, y, 0) || rd(x, y, river) < 34) continue;
      if (this.blocks.some(b => Math.abs(b.x - x) < b.w / 2 + r && Math.abs(b.y - y) < b.h / 2 + r)) continue;
      this.pines.push({ x, y, r, w: wobble(rng, 14, 0.25), c: '#4F7E3E' });
    }
    this.trees = [];
    for (let i = 0; i < 380; i++) {
      const x = rng() * 1200, y = 2000 + rng() * 5000, r = 8 + rng() * 9;
      if (rd(x, y) < 28 + r || inAvoid(x, y, 10)) continue;
      const olive = y > 5600;
      this.trees.push({ x, y, r: olive ? r * 0.75 : r, w: wobble(rng, 14, 0.3), c: olive ? '#7E9A5E' : (rng() < 0.5 ? '#5E9A45' : '#4E873E') });
    }
    this.cypress = [];
    for (let i = 0; i < 46; i++) {
      const x0 = rng() * 1200, y0 = 3700 + rng() * 3300, a = rng() * Math.PI, n = 5 + Math.floor(rng() * 9);
      for (let j = 0; j < n; j++) {
        const x = x0 + Math.cos(a) * j * 15, y = y0 + Math.sin(a) * j * 15;
        if (rd(x, y) < 28 || inAvoid(x, y, 6)) continue;
        this.cypress.push({ x, y, r: 4.6 + rng() * 1.4 });
      }
    }
    for (let j = 0; j < 9; j++) { this.cypress.push({ x: 600 + j * 17, y: 6585 + j * 2, r: 5 }); this.cypress.push({ x: 600 + j * 17, y: 6625 + j * 2, r: 5 }); }
    this.olives = [];
    for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) this.olives.push({ x: 880 + i * 34 + (j % 2) * 10, y: 6560 + j * 34, r: 9, w: wobble(rng, 12, 0.3) });

    this.fields = [];
    const types = (y) => {
      const r = rng();
      if (y < 3700) return r < 0.35 ? 'green' : r < 0.6 ? 'dark' : r < 0.78 ? 'meadow' : r < 0.9 ? 'ochre' : 'brown';
      return r < 0.18 ? 'ochre' : r < 0.32 ? 'rust' : r < 0.46 ? 'brown' : r < 0.6 ? 'vine' : r < 0.7 ? 'sun' : r < 0.85 ? 'green' : 'dark';
    };
    for (let gy = 2050; gy < 7100; gy += 140) for (let gx = -40; gx < 1260; gx += 160) {
      if (rng() < 0.12) continue;
      const x = gx + (rng() - 0.5) * 50, y = gy + (rng() - 0.5) * 40;
      if (inAvoid(x, y, 30)) continue;
      const cj = [0, 1, 2, 3].map(() => [(rng() - 0.5) * 8, (rng() - 0.5) * 8]);
      this.fields.push({ x, y, w: 130 + rng() * 80, h: 100 + rng() * 70, a: (rng() - 0.5) * 0.5, t: types(y), ra: (rng() - 0.5) * 0.6 + (rng() < 0.5 ? 0 : Math.PI / 2), cj });
    }
    this.sheep = []; this.cows = []; this.bales = []; this.tractors = [];
    this.fields.filter(f => ['green', 'meadow', 'dark'].includes(f.t)).forEach(f => {
      const r = rng();
      if (r < 0.5) { const n = 6 + Math.floor(rng() * 10); for (let i = 0; i < n; i++) { const x = f.x + (rng() - 0.5) * f.w * 0.6, y = f.y + (rng() - 0.5) * f.h * 0.6; if (rd(x, y) < 30 || inAvoid(x, y, 6)) continue; this.sheep.push({ x, y, a: rng() * 6.28, ph: rng() * 6, sp: 0.3 + rng() * 0.5 }); } }
      else if (r < 0.68) { for (let i = 0; i < 5; i++) { const x = f.x + (rng() - 0.5) * f.w * 0.5, y = f.y + (rng() - 0.5) * f.h * 0.5; if (rd(x, y) < 34 || inAvoid(x, y, 6)) continue; this.cows.push({ x, y, a: rng() * 6.28, ph: rng() * 6, sp: [[(rng() - 0.5) * 7, (rng() - 0.5) * 4, 1.6 + rng() * 1.4], [(rng() - 0.5) * 7, (rng() - 0.5) * 4, 1.4 + rng() * 1.2]] }); } }
    });
    for (let i = 0; i < 12; i++) { const x = 430 + (rng() - 0.5) * 140, y = 6820 + (rng() - 0.5) * 70; if (rd(x, y) > 32) this.sheep.push({ x, y, a: rng() * 6.28, ph: rng() * 6, sp: 0.3 + rng() * 0.5 }); }
    this.fields.filter(f => f.t === 'ochre').forEach(f => { if (rng() < 0.65) { const rows = 2 + Math.floor(rng() * 2), c = Math.cos(f.a), s2 = Math.sin(f.a); for (let i = 0; i < rows; i++) for (let j = 0; j < 4; j++) { const lx = (j - 1.5) * f.w * 0.2, ly = (i - (rows - 1) / 2) * f.h * 0.28; const x = f.x + lx * c - ly * s2, y = f.y + lx * s2 + ly * c; if (rd(x, y) < 28) continue; this.bales.push({ x, y }); } } });
    this.fields.filter(f => f.t === 'brown' || f.t === 'rust').forEach(f => { if (rng() < 0.4) this.tractors.push({ f, ph: rng() * 6, col: rng() < 0.5 ? '#C4492F' : '#3F7A3A' }); });
    this.hills = [];
    for (let i = 0; i < 12; i++) this.hills.push({ x: 80 + rng() * 1040, y: 3800 + rng() * 3200, rx: 130 + rng() * 110 });
    this.washes = [];
    for (let i = 0; i < 520; i++) this.washes.push({ x: rng() * 1300 - 50, y: rng() * 7200, r: 30 + rng() * 90, dark: rng() < 0.55, a: 0.05 + rng() * 0.07 });
    this.washes.sort((a, b) => a.y - b.y);
    this.clouds = [];
    for (let i = 0; i < 26; i++) {
      const side = rng();
      const x = side < 0.42 ? -60 + rng() * 380 : side < 0.84 ? 840 + rng() * 420 : 400 + rng() * 400;
      const W = (side >= 0.84 ? 120 : 170) + rng() * 190, n = 6 + Math.floor(rng() * 5), circles = [];
      for (let j = 0; j < n; j++) {
        const t = j / (n - 1), r = (0.42 + 0.58 * Math.sin(Math.PI * t)) * W * 0.25 * (0.8 + rng() * 0.4);
        circles.push({ x: (t - 0.5) * W + (rng() - 0.5) * 18, y: (rng() - 0.5) * W * 0.16, r });
      }
      for (let j = 0; j < 4; j++) circles.push({ x: (rng() - 0.5) * W * 0.6, y: (rng() - 0.3) * W * 0.22, r: W * (0.1 + rng() * 0.1) });
      this.clouds.push({ x, y: -300 + i * 300 + rng() * 120, circles, v: 3 + rng() * 6, W });
    }
    this.birds = [];
    for (let i = 0; i < 14; i++) this.birds.push({ x: rng() * 1200, y: rng() * 7200, v: 18 + rng() * 14, ph: rng() * 6 });
    this.stars = [];
    for (let i = 0; i < 160; i++) this.stars.push({ x: rng() * 1200, y: rng() * 7200, r: 0.6 + rng() * 1.1, ph: rng() * 6 });
    this.people = [];
    const pc = ['#C4492F', '#3C5A7A', '#E7B53C', '#2B2A3A', '#F4EEE2'];
    for (let i = 0; i < 12; i++) this.people.push({ rx: 20 + rng() * 60, ry: 14 + rng() * 40, w: (rng() < 0.5 ? -1 : 1) * (0.15 + rng() * 0.25), ph: rng() * 6, c: pc[i % pc.length] });
  }

  frame(time) {
    const c = this.canvas; if (!this.vw) return;
    const ctx = c.getContext('2d');
    const isNight = (this.opts.getTheme ? this.opts.getTheme() : 'dark') !== 'light';
    const p = clamp(this.opts.getProgress(), 0, 1);
    this.pS += (p - this.pS) * 0.08;
    const total = this.road[this.road.length - 1].l;
    const car = at(this.road, this.lStart + (total - this.lStart) * this.pS);
    this.uz += (this.uzT - this.uz) * 0.1;
    const mob = this.vw < 720, mix = mob ? 0.35 : 0.5;
    let zt = 1, fx0 = car.x, fy0 = car.y, best = 0;
    for (const [lx, ly, k] of [[this.L.sap.x, this.L.sap.y, 0.7], [this.L.col.x, this.L.col.y + 12, 1.15], [580, 6570, 0.8]]) {
      const pr = 1 - ss(120, 520, Math.abs(car.y - ly));
      if (pr > best) { best = pr; zt = 1 + k * (mob ? 0.6 : 1) * pr; fx0 = car.x + (lx - car.x) * mix * pr; fy0 = car.y + (ly - car.y) * mix * pr; }
    }
    if (!this.cam) this.cam = { x: fx0, y: fy0, z: zt };
    this.cam.x += (fx0 - this.cam.x) * 0.07; this.cam.y += (fy0 - this.cam.y) * 0.07; this.cam.z += (zt - this.cam.z) * 0.07;
    fx0 = this.cam.x; fy0 = this.cam.y; zt = this.cam.z;
    const s = this.s * zt * this.uz, dpr = this.dpr, vw = this.vw, vh = this.vh;
    const vwu = vw / s, vhu = vh / s;
    const camx = vwu >= WW ? WW / 2 : clamp(fx0, vwu / 2, WW - vwu / 2);
    const camy = fy0 + vhu * 0.06;
    const x0 = camx - vwu / 2 - 20, x1 = camx + vwu / 2 + 20, y0 = camy - vhu / 2 - 40, y1 = camy + vhu / 2 + 40;
    const S = s * dpr;
    ctx.setTransform(S, 0, 0, S, (vw / 2 - camx * s) * dpr, (vh / 2 - camy * s) * dpr);
    const inV = (x, y, r) => x + r > x0 && x - r < x1 && y + r > y0 && y - r < y1;
    const EDGE = 'rgba(40,45,20,.16)';

    const g = ctx.createLinearGradient(0, 0, 0, 7200);
    if (isNight) {
      g.addColorStop(0, '#1C2049'); g.addColorStop(1750 / 7200, '#1E2440'); g.addColorStop(2250 / 7200, '#2C4430');
      g.addColorStop(4300 / 7200, '#2A4330'); g.addColorStop(5400 / 7200, '#2E4730'); g.addColorStop(1, '#324E32');
    } else {
      g.addColorStop(0, '#FDEAC8'); g.addColorStop(1750 / 7200, '#F6E2B8'); g.addColorStop(2250 / 7200, '#8CC052');
      g.addColorStop(4300 / 7200, '#88BD4F'); g.addColorStop(5400 / 7200, '#94BE52'); g.addColorStop(1, '#9CBF57');
    }
    ctx.fillStyle = g; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);

    // soft washes
    let lo = 0, hi = this.washes.length;
    while (lo < hi) { const m = (lo + hi) >> 1; if (this.washes[m].y < y0 - 120) lo = m + 1; else hi = m; }
    for (let i = lo; i < this.washes.length && this.washes[i].y < y1 + 120; i++) {
      const w = this.washes[i]; if (w.x + w.r < x0 || w.x - w.r > x1) continue;
      const rg = ctx.createRadialGradient(w.x, w.y, 0, w.x, w.y, w.r);
      rg.addColorStop(0, w.dark ? 'rgba(50,90,30,' + w.a + ')' : 'rgba(225,235,150,' + w.a + ')'); rg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rg; ctx.fillRect(w.x - w.r, w.y - w.r, w.r * 2, w.r * 2);
    }

    // fields — broad painted stripes
    const FC = { green: ['#79AE48', '#699F40', 26], dark: ['#5B8C4C', '#4E7C45', 24], meadow: ['#8FC657', null], ochre: ['#D4A23D', '#B98B38', 18], rust: ['#C7733A', '#B0632F', 18], brown: ['#B38D66', '#9E7B59', 9], vine: ['#B79870', '#6E9445', 7], sun: ['#8DB352', null] };
    for (const f of this.fields) {
      if (!inV(f.x, f.y, 150)) continue;
      const [A, B, sw] = FC[f.t];
      ctx.save(); ctx.translate(f.x, f.y); ctx.rotate(f.a);
      const hw = f.w / 2, hh = f.h / 2, j = f.cj;
      ctx.beginPath(); ctx.moveTo(-hw + j[0][0], -hh + j[0][1]); ctx.lineTo(hw + j[1][0], -hh + j[1][1]); ctx.lineTo(hw + j[2][0], hh + j[2][1]); ctx.lineTo(-hw + j[3][0], hh + j[3][1]); ctx.closePath();
      ctx.fillStyle = A; ctx.fill();
      ctx.strokeStyle = EDGE; ctx.lineWidth = 2.2; ctx.stroke();
      if (B) {
        ctx.clip(); ctx.rotate(f.ra); ctx.fillStyle = B; ctx.globalAlpha = 0.85;
        for (let k = -f.w; k < f.w; k += sw * 2) ctx.fillRect(k, -f.w, sw, f.w * 2);
        ctx.globalAlpha = 1;
      }
      if (f.t === 'sun') { ctx.fillStyle = '#E9C547'; for (let i = -hw + 5; i < hw; i += 8) for (let jj = -hh + 5; jj < hh; jj += 8) { ctx.beginPath(); ctx.arc(i, jj, 2.3, 0, 7); ctx.fill(); } }
      ctx.restore();
    }
    // hills: soft shade
    for (const h of this.hills) {
      if (!inV(h.x, h.y, h.rx)) continue;
      const rg = ctx.createRadialGradient(h.x + h.rx * 0.25, h.y - h.rx * 0.2, h.rx * 0.1, h.x, h.y, h.rx);
      rg.addColorStop(0, 'rgba(255,245,200,.12)'); rg.addColorStop(0.6, 'rgba(0,0,0,0)'); rg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rg; ctx.fillRect(h.x - h.rx, h.y - h.rx, h.rx * 2, h.rx * 2);
    }

    const path = (pts, w, col) => { ctx.beginPath(); pts.forEach((q, i) => i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y)); ctx.lineWidth = w; ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke(); };
    if (y0 < 2400) {
      path(this.river, 52, 'rgba(70,120,140,.25)'); path(this.river, 48, '#86BCD3'); path(this.river, 24, 'rgba(170,215,228,.6)');
    }
    // road — no stroke, painted
    const rv = this.road.filter(q => q.y > y0 - 60 && q.y < y1 + 60);
    if (rv.length > 1) { path(rv, 36, 'rgba(150,145,130,.45)'); path(rv, 32, '#BCB8AC'); path(rv, 16, 'rgba(215,212,202,.55)'); }
    const end = this.road[this.road.length - 1];
    if (inV(end.x, end.y, 80)) { ctx.beginPath(); ctx.arc(end.x, end.y + 6, 34, 0, 7); ctx.fillStyle = '#D8CDB2'; ctx.fill(); }

    const shadowRect = (x, y, w, h, a, k) => { ctx.save(); ctx.translate(x - 8, y + 6); ctx.rotate(a || 0); ctx.fillStyle = NAVY + (k || 0.55) + ')'; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.restore(); };
    const roof = (x, y, w, h, a, col) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(a || 0);
      ctx.fillStyle = '#F2ECDF'; ctx.fillRect(-w / 2, -h / 2 + 4, w, h + 2);
      ctx.fillStyle = 'rgba(30,34,72,.18)'; ctx.fillRect(-w / 2, -h / 2 + 4, 4, h + 2);
      if (h > w) { ctx.rotate(Math.PI / 2); const t = w; w = h; h = t; }
      ctx.fillStyle = col; ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.fillStyle = 'rgba(255,220,180,.18)'; ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(w / 2, -h / 2); ctx.lineTo(w / 2 - h / 2, 0); ctx.lineTo(-w / 2 + h / 2, 0); ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(80,25,10,.16)'; ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(-w / 2 + h / 2, 0); ctx.lineTo(-w / 2, h / 2); ctx.closePath(); ctx.fill();
      ctx.restore();
    };
    const tree = (t, col) => {
      blob(ctx, t.x - t.r * 0.7, t.y + t.r * 0.5, t.r * 1.05, t.w); ctx.fillStyle = NAVY + '.78)'; ctx.fill();
      blob(ctx, t.x, t.y, t.r, t.w); ctx.fillStyle = col || t.c; ctx.fill();
      ctx.beginPath(); ctx.arc(t.x + t.r * 0.25, t.y - t.r * 0.25, t.r * 0.55, 0, 7); ctx.fillStyle = 'rgba(220,240,160,.22)'; ctx.fill();
    };
    for (const b of this.bales) { if (!inV(b.x, b.y, 12)) continue; ctx.beginPath(); ctx.arc(b.x - 4, b.y + 3, 6.2, 0, 7); ctx.fillStyle = NAVY + '.55)'; ctx.fill(); ctx.beginPath(); ctx.arc(b.x, b.y, 6, 0, 7); ctx.fillStyle = '#E2BC5E'; ctx.fill(); ctx.beginPath(); ctx.arc(b.x, b.y, 3.4, 0.5, 5); ctx.strokeStyle = 'rgba(160,115,40,.55)'; ctx.lineWidth = 1; ctx.stroke(); }
    for (const t of this.tractors) {
      const f = t.f; if (!inV(f.x, f.y, 120)) continue;
      const u = Math.sin(time * 0.22 + t.ph), A = f.a + f.ra, d = u * Math.min(f.w, f.h) * 0.38;
      const tx = f.x - Math.sin(A) * d, ty = f.y + Math.cos(A) * d, head = A + Math.PI / 2 + (Math.cos(time * 0.22 + t.ph) > 0 ? 0 : Math.PI);
      ctx.save(); ctx.translate(tx - 4, ty + 3); ctx.rotate(head); ctx.fillStyle = NAVY + '.55)'; ctx.fillRect(-8, -6, 16, 12); ctx.restore();
      ctx.save(); ctx.translate(tx, ty); ctx.rotate(head);
      ctx.fillStyle = 'rgba(120,90,60,.35)'; ctx.fillRect(-26, -5, 18, 10);
      ctx.fillStyle = '#2B2A3A'; ctx.fillRect(-7, -7.5, 6, 3); ctx.fillRect(-7, 4.5, 6, 3); ctx.fillRect(4, -6, 3.5, 2); ctx.fillRect(4, 4, 3.5, 2);
      ctx.fillStyle = t.col; ctx.beginPath(); ctx.roundRect(-8, -5, 17, 10, 2); ctx.fill();
      ctx.fillStyle = '#F4EEE2'; ctx.fillRect(-6, -3.5, 6, 7); ctx.restore();
    }
    for (const sh of this.sheep) {
      if (!inV(sh.x, sh.y, 10)) continue;
      const x = sh.x + Math.sin(time * sh.sp + sh.ph) * 3, y = sh.y + Math.cos(time * sh.sp * 0.7 + sh.ph) * 2, a = sh.a + Math.sin(time * 0.3 + sh.ph) * 0.4;
      ctx.save(); ctx.translate(x - 3, y + 2.2); ctx.rotate(a); ctx.beginPath(); ctx.ellipse(0, 0, 5.4, 3.9, 0, 0, 7); ctx.fillStyle = NAVY + '.5)'; ctx.fill(); ctx.restore();
      ctx.save(); ctx.translate(x, y); ctx.rotate(a);
      ctx.beginPath(); ctx.ellipse(0, 0, 5, 3.7, 0, 0, 7); ctx.fillStyle = '#F7F4EC'; ctx.fill();
      ctx.beginPath(); ctx.arc(-1, -1, 2.2, 0, 7); ctx.fillStyle = '#FFFFFF'; ctx.fill();
      ctx.beginPath(); ctx.ellipse(5.6 + Math.sin(time * 2 + sh.ph) * 0.5, 0, 2, 1.6, 0, 0, 7); ctx.fillStyle = '#2B2A3A'; ctx.fill(); ctx.restore();
    }
    for (const cw of this.cows) {
      if (!inV(cw.x, cw.y, 14)) continue;
      const x = cw.x + Math.sin(time * 0.2 + cw.ph) * 2, y = cw.y, a = cw.a + Math.sin(time * 0.15 + cw.ph) * 0.3;
      ctx.save(); ctx.translate(x - 4, y + 3); ctx.rotate(a); ctx.beginPath(); ctx.ellipse(0, 0, 8.4, 4.8, 0, 0, 7); ctx.fillStyle = NAVY + '.5)'; ctx.fill(); ctx.restore();
      ctx.save(); ctx.translate(x, y); ctx.rotate(a);
      ctx.beginPath(); ctx.ellipse(0, 0, 8, 4.5, 0, 0, 7); ctx.fillStyle = '#F4F0E6'; ctx.fill();
      ctx.fillStyle = '#2B2A3A'; for (const p of cw.sp) { ctx.beginPath(); ctx.arc(p[0], p[1], p[2], 0, 7); ctx.fill(); }
      ctx.beginPath(); ctx.ellipse(9.5, 0, 2.6, 2.1, 0, 0, 7); ctx.fill(); ctx.restore();
    }
    // Rome
    for (const b of this.blocks) { if (!inV(b.x, b.y, 40)) continue; shadowRect(b.x, b.y, b.w, b.h, b.a, 0.4); roof(b.x, b.y, b.w, b.h, b.a, b.c); }
    const L = this.L;
    if (inV(L.sap.x, L.sap.y, 220)) {
      const { x, y, w, h } = L.sap;
      ctx.fillStyle = '#DCCDAA'; ctx.fillRect(x - w / 2 - 20, y + h / 2, w + 40, 60);
      shadowRect(x, y, w, h, 0, 0.45);
      ctx.fillStyle = '#F2E9D6'; ctx.fillRect(x - w / 2, y - h / 2, w, h);
      ctx.fillStyle = 'rgba(30,34,72,.12)'; ctx.fillRect(x - w / 2, y - h / 2, w, 6);
      ctx.fillStyle = '#7FB44D'; ctx.fillRect(x - w / 2 + 38, y - h / 2 + 34, w - 76, h - 68);
      ctx.fillStyle = 'rgba(30,34,72,.22)'; ctx.fillRect(x - w / 2 + 38, y - h / 2 + 34, w - 76, 8); ctx.fillRect(x + w / 2 - 46, y - h / 2 + 34, 8, h - 68);
      ctx.fillStyle = '#EDE3CC'; ctx.fillRect(x - w / 2 + 38, y - 3, w - 76, 6); ctx.fillRect(x - 3, y - h / 2 + 34, 6, h - 68);
      ctx.fillStyle = 'rgba(120,80,50,.18)'; for (let i = 1; i < 12; i++) { const xx = x - w / 2 + (w / 12) * i; ctx.fillRect(xx, y - h / 2 + 6, 1.4, 22); ctx.fillRect(xx, y + h / 2 - 28, 1.4, 22); }
      ctx.beginPath(); ctx.arc(x, y + h / 2 + 30, 9, 0, 7); ctx.fillStyle = '#C9BC9C'; ctx.fill();
      ctx.beginPath(); ctx.arc(x - 3, y + h / 2 + 32, 3, 0, 7); ctx.fillStyle = NAVY + '.7)'; ctx.fill();
      for (const pp of this.people) {
        const px = x + Math.cos(time * pp.w + pp.ph) * pp.rx, py = y + Math.sin(time * pp.w + pp.ph) * pp.ry;
        ctx.beginPath(); ctx.arc(px - 2, py + 1.5, 2.8, 0, 7); ctx.fillStyle = NAVY + '.5)'; ctx.fill();
        ctx.beginPath(); ctx.arc(px, py, 2.8, 0, 7); ctx.fillStyle = pp.c; ctx.fill();
      }
    }
    if (inV(L.col.x, L.col.y, 180)) {
      const { x, y, rx, ry } = L.col, H = 24;
      ctx.beginPath(); ctx.ellipse(x - 16, y + 14, rx + 4, ry + 4, 0, 0, 7); ctx.fillStyle = NAVY + '.5)'; ctx.fill();
      const facade = () => { ctx.beginPath(); ctx.ellipse(x, y + H, rx, ry, 0, 0, Math.PI); ctx.lineTo(x - rx, y); ctx.ellipse(x, y, rx, ry, 0, Math.PI, 0, true); ctx.closePath(); };
      facade(); ctx.fillStyle = '#DCC79C'; ctx.fill();
      const fg = ctx.createLinearGradient(x - rx, 0, x + rx, 0); fg.addColorStop(0, 'rgba(30,34,72,.32)'); fg.addColorStop(0.6, 'rgba(30,34,72,0)'); facade(); ctx.fillStyle = fg; ctx.fill();
      ctx.fillStyle = 'rgba(95,65,42,.78)';
      for (let row = 0; row < 3; row++) for (let i = 1; i < 40; i++) {
        const a = i / 40 * Math.PI, ax = x + Math.cos(a) * rx * 0.99, ay = y + Math.sin(a) * ry + 3 + row * 6.6, aw = 3.3 * Math.sin(a) + 0.4;
        ctx.beginPath(); ctx.roundRect(ax - aw / 2, ay, aw, 4.6, [aw / 2, aw / 2, 0, 0]); ctx.fill();
      }
      ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 7); ctx.fillStyle = '#EADCB9'; ctx.fill();
      for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.ellipse(x, y, rx * (0.92 - k * 0.065), ry * (0.9 - k * 0.07), 0, 0, 7); ctx.strokeStyle = k % 2 ? 'rgba(150,115,70,.3)' : 'rgba(255,250,235,.55)'; ctx.lineWidth = 2.5; ctx.stroke(); }
      ctx.beginPath(); for (let i = 0; i < 48; i++) { const a = i / 48 * Math.PI * 2; ctx.moveTo(x + Math.cos(a) * rx * 0.56, y + Math.sin(a) * ry * 0.52); ctx.lineTo(x + Math.cos(a) * rx * 0.94, y + Math.sin(a) * ry * 0.92); } ctx.strokeStyle = 'rgba(140,100,60,.22)'; ctx.lineWidth = 1; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, Math.PI * 1.08, Math.PI * 1.62); ctx.ellipse(x, y, rx * 0.84, ry * 0.82, 0, Math.PI * 1.62, Math.PI * 1.08, true); ctx.closePath(); ctx.fillStyle = '#CDB78B'; ctx.fill();
      ctx.beginPath(); ctx.ellipse(x, y, rx - 2, ry - 2, 0, Math.PI * 1.62, Math.PI * 3.08); ctx.strokeStyle = '#F7EED8'; ctx.lineWidth = 4; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(x, y, rx * 0.52, ry * 0.46, 0, 0, 7); ctx.fillStyle = '#B98E5E'; ctx.fill();
      ctx.save(); ctx.clip();
      ctx.fillStyle = 'rgba(70,45,25,.55)'; for (let i = -7; i <= 7; i++) ctx.fillRect(x + i * 8 - 1.5, y - ry, 3, ry * 2);
      ctx.fillStyle = 'rgba(70,45,25,.65)'; ctx.fillRect(x - rx, y - 2, rx * 2, 4);
      ctx.fillStyle = '#D8BC8A'; ctx.fillRect(x + rx * 0.2, y - ry, rx, ry * 2);
      ctx.fillStyle = 'rgba(150,110,70,.35)'; for (let i = 0; i < 9; i++) ctx.fillRect(x + rx * 0.2 + i * 5, y - ry, 1, ry * 2);
      ctx.restore();
      ctx.beginPath(); ctx.ellipse(x - 3, y - 3, rx * 0.52, ry * 0.46, 0, Math.PI * 0.85, Math.PI * 1.75); ctx.strokeStyle = NAVY + '.35)'; ctx.lineWidth = 5; ctx.stroke();
      const tc = ['#C4492F', '#3C5A7A', '#E7B53C', '#F4EEE2', '#2B2A3A'];
      for (let i = 0; i < 22; i++) {
        const a = i / 22 * Math.PI * 2 + time * 0.025 * (i % 2 ? 1 : -1), rr = 16 + (i % 3) * 6;
        const px = x + Math.cos(a) * (rx + rr), py = y + Math.sin(a) * (ry + rr) + (Math.sin(a) > 0 ? H : 0);
        ctx.beginPath(); ctx.arc(px - 2, py + 1.5, 2.4, 0, 7); ctx.fillStyle = NAVY + '.5)'; ctx.fill();
        ctx.beginPath(); ctx.arc(px, py, 2.4, 0, 7); ctx.fillStyle = tc[i % 5]; ctx.fill();
      }
    }
    for (const t of this.pines) if (inV(t.x, t.y, 20)) tree(t);
    // Work
    for (const t of this.trees) if (inV(t.x, t.y, 20)) tree(t);
    if (inV(L.office.x, L.office.y, 200)) {
      const { x, y, w, h } = L.office;
      ctx.fillStyle = '#BDB8AC'; ctx.fillRect(x - w / 2 - 10, y + h / 2 + 10, w + 120, 70);
      ctx.fillStyle = 'rgba(245,240,230,.7)'; for (let i = 0; i < 11; i++) ctx.fillRect(x - w / 2 + 6 + i * 26, y + h / 2 + 12, 1.4, 28);
      [[x - w / 2 + 19, '#4F7FA8'], [x - w / 2 + 71, '#E7B53C'], [x - w / 2 + 149, '#F4EFE4'], [x - w / 2 + 201, '#7A9A55']].forEach(([cx, cc]) => { ctx.fillStyle = NAVY + '.45)'; ctx.beginPath(); ctx.roundRect(cx - 11, y + h / 2 + 16, 16, 24, 4); ctx.fill(); ctx.fillStyle = cc; ctx.beginPath(); ctx.roundRect(cx - 8, y + h / 2 + 14, 16, 24, 4); ctx.fill(); });
      shadowRect(x, y, w, h, 0, 0.55);
      ctx.fillStyle = '#E6E2D8'; ctx.fillRect(x - w / 2, y - h / 2, w, h);
      ctx.fillStyle = 'rgba(30,34,72,.12)'; ctx.fillRect(x - w / 2, y - h / 2, w, 6); ctx.fillRect(x - w / 2, y - h / 2, 6, h);
      ctx.fillStyle = '#7F96A8'; for (let i = 0; i < 5; i++) for (let j = 0; j < 2; j++) ctx.fillRect(x - w / 2 + 16 + i * 22, y - h / 2 + 18 + j * 22, 18, 16);
      ctx.fillStyle = '#C9C3B5'; ctx.fillRect(x + w / 2 - 44, y + 4, 28, 28);
      ctx.fillStyle = NAVY + '.25)'; ctx.fillRect(x + w / 2 - 44, y + 4, 4, 28);
    }
    // Tuscany
    for (const t of this.cypress) {
      if (!inV(t.x, t.y, 34)) continue;
      ctx.save(); ctx.translate(t.x, t.y); ctx.rotate(2.45); ctx.beginPath(); ctx.ellipse(16, 0, 20, t.r * 0.75, 0, 0, 7); ctx.fillStyle = NAVY + '.7)'; ctx.fill(); ctx.restore();
      ctx.beginPath(); ctx.ellipse(t.x, t.y, t.r, t.r * 1.15, 0.3, 0, 7); ctx.fillStyle = '#34503A'; ctx.fill();
      ctx.beginPath(); ctx.arc(t.x + 1.2, t.y - 1.2, t.r * 0.45, 0, 7); ctx.fillStyle = 'rgba(150,190,120,.25)'; ctx.fill();
    }
    const fx = L.farm.x, fy = L.farm.y;
    if (inV(fx, fy, 260)) {
      ctx.fillStyle = '#DDD0B2'; ctx.fillRect(fx - 160, fy - 50, 170, 34); ctx.fillRect(fx - 20, fy - 70, 130, 170);
      ctx.beginPath(); ctx.roundRect(fx + 2, fy + 108, 66, 30, 3); ctx.fillStyle = '#7FC0D6'; ctx.fill();
      ctx.fillStyle = 'rgba(30,34,72,.18)'; ctx.fillRect(fx + 2, fy + 108, 66, 5);
      ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fillRect(fx + 14, fy + 120, 18, 1.5); ctx.fillRect(fx + 38, fy + 128, 20, 1.5);
      shadowRect(fx + 30, fy - 20, 100, 56, 0, 0.6); shadowRect(fx + 62, fy + 34, 46, 80, 0, 0.6);
      roof(fx + 30, fy - 20, 100, 56, 0, '#C9643A'); roof(fx + 62, fy + 34, 46, 80, 0, '#BC5A34');
      if (this.pS > 0.985) { ctx.globalAlpha = ss(0.985, 1, this.pS); this.cat(ctx, fx - 4, fy + 18, 0, 1.3); ctx.globalAlpha = 1; }
    }
    for (const t of this.olives) if (inV(t.x, t.y, 20)) tree(t, '#7E9A5E');
    const P = L.pisa;
    if (inV(P.x, P.y - 50, 200)) {
      ctx.beginPath(); ctx.roundRect(P.x - 95, P.y - 75, 190, 140, 6); ctx.fillStyle = '#93CF5E'; ctx.fill();
      ctx.fillStyle = 'rgba(245,238,220,.8)'; ctx.fillRect(P.x - 95, P.y + 28, 190, 6); ctx.fillRect(P.x - 60, P.y - 75, 6, 140);
      const R0 = 14, Ht = 98, dx = 16, ry = R0 * 0.55, T = { x: P.x + dx, y: P.y - Ht };
      ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = NAVY + '.5)'; ctx.lineWidth = R0 * 1.9; ctx.beginPath(); ctx.moveTo(P.x, P.y); ctx.lineTo(P.x - 78, P.y + 56); ctx.stroke(); ctx.restore();
      const body = (b, t, r) => { ctx.beginPath(); ctx.ellipse(b.x, b.y, r, r * 0.55, 0, 0, Math.PI); ctx.lineTo(t.x - r, t.y); ctx.ellipse(t.x, t.y, r, r * 0.55, 0, Math.PI, 0, true); ctx.closePath(); };
      body(P, T, R0); ctx.fillStyle = '#F3EDE0'; ctx.fill();
      const gr = ctx.createLinearGradient(P.x - R0, 0, P.x + R0 + dx, 0); gr.addColorStop(0, 'rgba(30,34,72,.34)'); gr.addColorStop(0.55, 'rgba(30,34,72,.04)'); gr.addColorStop(1, 'rgba(30,34,72,.12)');
      body(P, T, R0); ctx.fillStyle = gr; ctx.fill();
      for (let k = 1; k <= 7; k++) {
        const f = k / 8, cx = P.x + dx * f, cy = P.y - Ht * f, lh = Ht / 8;
        ctx.beginPath(); ctx.ellipse(cx, cy, R0 + 0.6, ry, 0, 0, Math.PI); ctx.strokeStyle = 'rgba(130,115,90,.55)'; ctx.lineWidth = 1.2; ctx.stroke();
        if (k < 7) for (let j = 1; j < 8; j++) {
          const a = j / 8 * Math.PI, ax = cx + dx / 8 * 0.5 + Math.cos(a) * R0 * 0.96, ay = cy + Math.sin(a) * ry - lh * 0.82, aw = 2.3 * Math.sin(a) + 0.3;
          ctx.fillStyle = 'rgba(95,85,70,.6)'; ctx.beginPath(); ctx.roundRect(ax - aw / 2, ay, aw, lh * 0.62, [aw / 2, aw / 2, 0, 0]); ctx.fill();
        }
      }
      for (let j = 1; j < 8; j++) { const a = j / 8 * Math.PI, ax = P.x + Math.cos(a) * R0 * 0.96, ay = P.y + Math.sin(a) * ry - Ht / 8 * 0.85, aw = 2.6 * Math.sin(a) + 0.3; ctx.fillStyle = 'rgba(130,115,90,.35)'; ctx.fillRect(ax - aw / 2, ay, aw, Ht / 8 * 0.7); }
      ctx.beginPath(); ctx.ellipse(T.x, T.y, R0, ry, 0, 0, 7); ctx.fillStyle = '#E4DCCB'; ctx.fill();
      const T2 = { x: T.x + 2, y: T.y - 11 };
      body(T, T2, R0 * 0.68); ctx.fillStyle = '#EFE8DA'; ctx.fill();
      ctx.fillStyle = 'rgba(95,85,70,.6)'; for (let j = 1; j < 6; j++) { const a = j / 6 * Math.PI; ctx.fillRect(T.x + Math.cos(a) * R0 * 0.62 - 0.8, T.y + Math.sin(a) * ry * 0.68 - 9, 1.6, 6); }
      ctx.beginPath(); ctx.ellipse(T2.x, T2.y, R0 * 0.68, R0 * 0.68 * 0.55, 0, 0, 7); ctx.fillStyle = '#C9643A'; ctx.fill();
      const tc = ['#C4492F', '#3C5A7A', '#E7B53C', '#F4EEE2', '#2B2A3A'];
      for (let i = 0; i < 12; i++) {
        const a = i / 12 * Math.PI * 2 + time * 0.04 * (i % 2 ? 1 : -1), rr = 26 + (i % 3) * 7;
        const px = P.x + Math.cos(a) * rr, py = P.y + 8 + Math.sin(a) * rr * 0.6;
        if (py < P.y - 4 && Math.abs(px - P.x) < R0 + 4) continue;
        ctx.beginPath(); ctx.arc(px - 2, py + 1.5, 2.3, 0, 7); ctx.fillStyle = NAVY + '.5)'; ctx.fill();
        ctx.beginPath(); ctx.arc(px, py, 2.3, 0, 7); ctx.fillStyle = tc[i % 5]; ctx.fill();
      }
    }

    const chapter = car.y < 2075 ? 0 : car.y < 3725 ? 1 : car.y < 6275 ? 2 : 3;
    this.drawCar(ctx, car.x, car.y, car.ang, chapter >= 2 && this.pS <= 0.985, CAR_COLORS[this.opts.carColor] || CAR_COLORS.Red);

    // cloud shadows — clouds thin out over the landmarks so nothing gets buried (e.g. Pisa)
    const clouds = this.opts.clouds !== false;
    const drift = (cl) => ((cl.x + time * cl.v + 300) % 1800) - 300;
    const landmarks = [
      { x: L.sap.x, y: L.sap.y, hw: L.sap.w / 2 + 50 },
      { x: L.col.x, y: L.col.y, hw: L.col.rx + 60 },
      { x: L.office.x, y: L.office.y, hw: L.office.w / 2 + 60 },
      { x: fx + 30, y: fy, hw: 120 },
      { x: P.x, y: P.y - 40, hw: 140 },
    ];
    const cloudClear = (cl, cx, cy) => {
      let f = 1;
      for (const lm of landmarks) {
        if (Math.abs(cy - lm.y) > 200) continue;
        const outer = lm.hw + (cl.W || 160) * 0.55, inner = outer * 0.4;
        const k = ss(inner, outer, Math.abs(cx - lm.x));
        if (k < f) f = k;
      }
      return f;
    };
    if (clouds) {
      for (const cl of this.clouds) {
        const cx = drift(cl) - 90, cy = cl.y + 110;
        if (!inV(cx, cy, 260)) continue;
        const f = cloudClear(cl, cx, cy);
        if (f <= 0.02) continue;
        ctx.globalAlpha = f;
        ctx.fillStyle = NAVY + '.16)'; ctx.beginPath();
        for (const q of cl.circles) { ctx.moveTo(cx + q.x + q.r, cy + q.y); ctx.arc(cx + q.x, cy + q.y, q.r, 0, Math.PI * 2); }
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    // paper / watercolor grain, moves with the ground
    if (!this.pat) this.pat = ctx.createPattern(this.paper, 'repeat');
    ctx.save(); ctx.fillStyle = this.pat; ctx.globalAlpha = 0.9; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
    ctx.scale(0.43, 0.43); ctx.globalAlpha = 0.6; ctx.fillRect(x0 / 0.43, y0 / 0.43, (x1 - x0) / 0.43, (y1 - y0) / 0.43); ctx.restore();

    if (clouds) {
      const K = 1.55;
      ctx.setTransform(S * K, 0, 0, S * K, (vw / 2 - camx * s * K) * dpr, (vh / 2 - camy * s * K) * dpr);
      const hw = vwu / K / 2 + 260, hh = vhu / K / 2 + 260;
      for (const b of this.birds) {
        const bx = ((b.x + time * b.v) % 1400) - 100, by = b.y;
        if (Math.abs(bx - camx) > hw || Math.abs(by - camy) > hh) continue;
        const f = Math.sin(time * 9 + b.ph) * 3;
        ctx.beginPath(); ctx.moveTo(bx - 6, by - f); ctx.quadraticCurveTo(bx - 3, by - 2, bx, by); ctx.quadraticCurveTo(bx + 3, by - 2, bx + 6, by - f);
        ctx.strokeStyle = 'rgba(43,42,58,.7)'; ctx.lineWidth = 1.2; ctx.stroke();
      }
      if (isNight) {
        for (const st of this.stars) {
          if (Math.abs(st.x - camx) > hw || Math.abs(st.y - camy) > hh) continue;
          const tw = 0.3 + 0.6 * (0.5 + 0.5 * Math.sin(time * 1.6 + st.ph));
          ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, 7); ctx.fillStyle = `rgba(255,255,255,${tw.toFixed(2)})`; ctx.fill();
        }
      }
      for (const cl of this.clouds) {
        const cx = drift(cl), cy = cl.y;
        if (Math.abs(cx - camx) > hw || Math.abs(cy - camy) > hh) continue;
        const f = cloudClear(cl, cx, cy);
        if (f <= 0.02) continue;
        ctx.globalAlpha = f;
        const fill = (k, dx, dy, col) => { ctx.beginPath(); for (const q of cl.circles) { ctx.moveTo(cx + q.x + dx + q.r * k, cy + q.y + dy); ctx.arc(cx + q.x + dx, cy + q.y + dy, q.r * k, 0, Math.PI * 2); } ctx.fillStyle = col; ctx.fill(); };
        fill(1.04, 0, 2, isNight ? 'rgba(180,190,215,.3)' : 'rgba(255,255,255,.35)');
        fill(1, 0, 0, isNight ? 'rgba(130,140,170,.85)' : 'rgba(196,206,222,.92)');
        fill(0.9, 2, -4, isNight ? 'rgba(165,175,200,.9)' : 'rgba(236,240,246,.95)');
        fill(0.7, 4, -8, isNight ? 'rgba(200,205,225,.85)' : 'rgba(255,255,255,.9)');
      }
      ctx.globalAlpha = 1;
      ctx.setTransform(S, 0, 0, S, (vw / 2 - camx * s) * dpr, (vh / 2 - camy * s) * dpr);
    }

    // sky accent — a fixed moon (night) or sunrise glow (morning), drawn in screen space
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (isNight) {
      const mx = vw - 72, my = 68, mr = 24;
      const glow = ctx.createRadialGradient(mx, my, 0, mx, my, mr * 2.8);
      glow.addColorStop(0, 'rgba(225,230,255,.3)'); glow.addColorStop(1, 'rgba(225,230,255,0)');
      ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(mx, my, mr * 2.8, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.arc(mx, my, mr, 0, 7); ctx.fillStyle = '#F4F1E6'; ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.arc(mx, my, mr, 0, 7); ctx.clip();
      ctx.beginPath(); ctx.arc(mx + mr * 0.55, my - mr * 0.3, mr * 0.9, 0, 7); ctx.fillStyle = 'rgba(28,32,73,.55)'; ctx.fill();
      ctx.restore();
      ctx.fillStyle = 'rgba(190,184,162,.5)';
      [[-5, -3, 3], [5, 6, 2.2], [-8, 7, 1.8]].forEach(([dx, dy, r]) => { ctx.beginPath(); ctx.arc(mx + dx, my + dy, r, 0, 7); ctx.fill(); });
    } else {
      const sx = 84, sy = 62, sr = 20;
      const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr * 3.6);
      glow.addColorStop(0, 'rgba(255,210,135,.55)'); glow.addColorStop(1, 'rgba(255,210,135,0)');
      ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(sx, sy, sr * 3.6, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.arc(sx, sy, sr, 0, 7); ctx.fillStyle = '#F7CD60'; ctx.fill();
    }
    ctx.setTransform(S, 0, 0, S, (vw / 2 - camx * s) * dpr, (vh / 2 - camy * s) * dpr);
  }

  cat(ctx, x, y, ang, k) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(k, k);
    ctx.fillStyle = NAVY + '.45)'; ctx.beginPath(); ctx.ellipse(-8, 2, 7, 5, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#9C9CA3';
    ctx.beginPath(); ctx.ellipse(-6, 0, 6.5, 4.5, 0, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-12, 0); ctx.quadraticCurveTo(-17, 6, -12, 8); ctx.lineWidth = 1.8; ctx.strokeStyle = '#9C9CA3'; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(1, -4.5); ctx.lineTo(4.5, -6.5); ctx.lineTo(4, -2); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(1, 4.5); ctx.lineTo(4.5, 6.5); ctx.lineTo(4, 2); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.arc(2, 0, 4.2, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(60,60,72,.5)'; ctx.fillRect(-9, -1, 6, 1.2); ctx.fillRect(-9, 2, 6, 1.2);
    ctx.restore();
  }

  drawCar(ctx, x, y, ang, withCat, col) {
    ctx.save(); ctx.translate(x, y);
    ctx.save(); ctx.translate(-5, 4); ctx.rotate(ang); ctx.fillStyle = NAVY + '.6)'; ctx.beginPath(); ctx.roundRect(-20, -10, 40, 20, 7); ctx.fill(); ctx.restore();
    ctx.rotate(ang);
    ctx.fillStyle = '#2B2A3A'; [[-12, -11.5], [9, -11.5], [-12, 8.5], [9, 8.5]].forEach(([a, b]) => ctx.fillRect(a, b, 8, 3));
    ctx.beginPath(); ctx.roundRect(-20, -10, 40, 20, 7); ctx.fillStyle = col; ctx.fill();
    ctx.beginPath(); ctx.roundRect(-18, -8, 36, 7, 4); ctx.fillStyle = 'rgba(255,240,220,.22)'; ctx.fill();
    ctx.beginPath(); ctx.roundRect(1, -8, 5, 16, 2); ctx.fillStyle = '#BFD6DA'; ctx.fill();
    ctx.beginPath(); ctx.roundRect(-14, -8, 15, 16, 3); ctx.fillStyle = '#6B3A2A'; ctx.fill();
    ctx.fillStyle = '#FFE7A8'; ctx.fillRect(18, -8, 2, 4); ctx.fillRect(18, 4, 2, 4);
    ctx.beginPath(); ctx.arc(-7, -4, 4.4, 0, 7); ctx.fillStyle = '#3A2620'; ctx.fill();
    if (withCat) {
      ctx.fillStyle = '#9C9CA3';
      ctx.beginPath(); ctx.moveTo(-8, 1.5); ctx.lineTo(-4, 1); ctx.lineTo(-6, 3.5); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-8, 8.5); ctx.lineTo(-4, 9); ctx.lineTo(-6, 6.5); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.arc(-7, 5, 3.6, 0, 7); ctx.fill();
    }
    ctx.restore();
  }
}
