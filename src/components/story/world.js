/* Story world: every mesh in the scroll story, built once.
   Ported from the Claude Design file "Portfolio Story v2" — geometry and
   materials are unchanged. Returns the scene root plus the parts the
   timeline animates. */
/* eslint-disable */
export function buildWorld(THREE) {
const V3 = THREE.Vector3;

// ---------- Materials ----------
const M = (name, color, o = {}) => new THREE.MeshStandardMaterial({ name, color, roughness: 0.7, ...o });
const mat = {
  ink: M('ink', 0x2A2420, { roughness: 0.6 }),
  inkDS: M('ink', 0x2A2420, { roughness: 0.6, side: THREE.DoubleSide }),
  paper: M('paper', 0xF4ECDF, { roughness: 0.85 }),
  stone: M('stone', 0xE7DAC5, { roughness: 0.95 }),
  sand: M('sand', 0xD8C6A8, { roughness: 1 }),
  ground: M('ground', 0xE2D3BB, { roughness: 1 }),
  teal: M('teal', 0x55A6AB, { roughness: 0.75, side: THREE.DoubleSide }),
  sweater: M('sweater', 0x2F5A50, { roughness: 0.9 }),
  orange: M('orange', 0xE0703A, { roughness: 0.8 }),
  ochre: M('ochre', 0xD9A350, { roughness: 0.8 }),
  sage: M('sage', 0x9DB39A, { roughness: 0.8 }),
  gold: M('gold', 0xE2B866, { roughness: 0.3, metalness: 0.35 }),
  cloud: M('cloud', 0xFBF5EC, { roughness: 1 }),
  far1: M('far_hills', 0xD9C3A4, { roughness: 1 }),
  far2: M('far_hills_2', 0xCDB291, { roughness: 1 }),
  red: M('red', 0xD2402F, { roughness: 0.5 }),
  carPaint: M('car_paint', 0xD2402F, { roughness: 0.22, metalness: 0.1 }),
  glass: M('glass', 0x1c1d20, { roughness: 0.06 }),
  foliage: M('foliage', 0x4E5A3F, { roughness: 0.9 }),
  asphalt: M('asphalt', 0x2A2A2A, { roughness: 0.95 }),
  skin: M('skin', 0xEBC0A2, { roughness: 0.55 }),
  lips: M('lips', 0xC2574D, { roughness: 0.4 }),
  hair: M('hair', 0x8A4524, { roughness: 0.42, side: THREE.DoubleSide }),
  knit: M('knit', 0xE4DED1, { roughness: 0.95 }),
  silver: M('silver', 0xE8E8E8, { roughness: 0.2, metalness: 0.4 }),
  lamp: M('lamp_glow', 0xFFF6E8, { emissive: 0xFFE9C9, emissiveIntensity: 0.6 }),
};

// ---------- Helpers ----------
function add(parent, name, geo, m, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) {
  const o = new THREE.Mesh(geo, m); o.name = name;
  o.position.set(x, y, z); o.rotation.set(rx, ry, rz); parent.add(o); return o;
}
function grp(parent, name, x = 0, y = 0, z = 0) { const g = new THREE.Group(); g.name = name; g.position.set(x, y, z); parent.add(g); return g; }
const cyl = (rt, rb, h, s = 32) => new THREE.CylinderGeometry(rt, rb, h, s);
const sph = (r, w = 40, h = 28) => new THREE.SphereGeometry(r, w, h);
const cap = (r, len, s = 24) => new THREE.CapsuleGeometry(r, len, 8, s);
const lathe = (pts, seg = 64, ps = 0, pl = Math.PI * 2) => new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), seg, ps, pl);
function rrShape(w, h, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s;
}
function rbox(w, h, d, r = 0.02) {
  r = Math.min(r, w / 2.2, h / 2.2, d / 2.2);
  const g = new THREE.ExtrudeGeometry(rrShape(w - 2 * r, h - 2 * r, r * 0.4), { depth: d - 2 * r, bevelEnabled: true, bevelThickness: r, bevelSize: r, bevelSegments: 4, curveSegments: 6 });
  g.translate(0, 0, -(d - 2 * r) / 2); return g;
}
function rod(parent, name, a, b, r, m) {
  const A = new V3(...a), B = new V3(...b);
  const o = add(parent, name, cyl(r, r, A.distanceTo(B), 10), m);
  o.position.copy(A).add(B).multiplyScalar(0.5);
  o.quaternion.setFromUnitVectors(new V3(0, 1, 0), B.clone().sub(A).normalize()); return o;
}

const world = new THREE.Group(); world.name = 'my-story';

// ---------- Island ----------
{
  add(world, 'ground', new THREE.PlaneGeometry(140, 70), mat.ground, 7.6, -0.001, -10, -Math.PI / 2);
  // paths
  add(world, 'path_a', rbox(6.6, 0.01, 0.8, 0.004), mat.stone, 3.0, 0.005, 0);
  add(world, 'path_b', rbox(5.6, 0.01, 0.8, 0.004), mat.stone, 14.0, 0.005, 0);
  add(world, 'road', rbox(5.6, 0.012, 1.5, 0.004), mat.asphalt, 8.9, 0.006, 0);
  for (let x = 6.5; x < 11.6; x += 0.55) add(world, 'road_dash', new THREE.BoxGeometry(0.26, 0.004, 0.05), mat.paper, x, 0.014, 0);
}

// ---------- Rome (x ≈ 0) ----------
{
  const rome = grp(world, 'rome');
  add(rome, 'piazza', cyl(1.4, 1.4, 0.012, 96), mat.stone, 0, 0.006, 0);
  for (let i = 0; i < 3; i++) add(rome, 'piazza_ring', new THREE.TorusGeometry(0.5 + i * 0.3, 0.004, 6, 96), mat.sand, 0, 0.013, 0, Math.PI / 2);
  const co = grp(rome, 'colosseum', -1.0, 0, -1.15);
  const R = 0.95, TH = 0.3, a0 = Math.PI * 0.2, a1 = Math.PI * 1.75, N = 30, da = (a1 - a0) / N;
  add(co, 'colosseum_floor', cyl(R + 0.06, R + 0.08, 0.04, 96), mat.stone, 0, 0.02, 0);
  for (let k = 0; k <= N; k++) {
    const u = k / N, t = a0 + (a1 - a0) * u;
    const n = 1 + Math.round(2.2 * Math.pow(Math.sin(u * Math.PI), 0.55));
    for (let j = 0; j < Math.min(n, 3); j++) {
      const y = 0.04 + j * TH;
      add(co, 'col_pier', new THREE.BoxGeometry(0.06, TH - 0.04, 0.09), mat.stone, R * Math.sin(t), y + (TH - 0.04) / 2, R * Math.cos(t), 0, t);
      if (k < N && (j < n - 1 || k < N * 0.9)) {
        const tm = t + da / 2;
        add(co, 'col_arch', new THREE.TorusGeometry(0.068, 0.018, 8, 16, Math.PI), mat.stone, R * Math.sin(tm), y + TH - 0.115, R * Math.cos(tm), 0, tm);
      }
    }
  }
  for (let j = 0; j < 3; j++) {
    const span = (a1 - a0) * [1, 0.86, 0.6][j], st = a0 + ((a1 - a0) - span) / 2;
    add(co, 'col_cornice', new THREE.CylinderGeometry(R + 0.055, R + 0.055, 0.03, 96, 1, true, st, span), mat.paper, 0, 0.04 + (j + 1) * TH - 0.03, 0);
    add(co, 'col_cornice_in', new THREE.CylinderGeometry(R - 0.05, R - 0.05, 0.03, 96, 1, true, st, span), mat.paper, 0, 0.04 + (j + 1) * TH - 0.03, 0).material = mat.inkDS.clone();
  }
  co.children.filter(c => c.name === 'col_cornice_in').forEach(c => { c.material = new THREE.MeshStandardMaterial({ name: 'stone', color: 0xD6D0C4, roughness: 0.95, side: THREE.DoubleSide }); });
  add(co, 'col_attic', new THREE.CylinderGeometry(R + 0.04, R + 0.04, 0.16, 96, 1, true, Math.PI * 0.75, Math.PI * 0.55), new THREE.MeshStandardMaterial({ name: 'stone', color: 0xE3DED4, roughness: 0.95, side: THREE.DoubleSide }), 0, 0.04 + 3 * TH + 0.08, 0);

  const pine = (x, z, h, s) => {
    const p = grp(rome, 'stone_pine', x, 0, z);
    rod(p, 'pine_trunk', [0, 0, 0], [0.12 * s, h, 0.02], 0.045 * s, mat.ink);
    [[0, 0, 0, 0.5], [0.28, -0.05, 0.1, 0.36], [-0.25, -0.03, -0.08, 0.38], [0.05, 0.06, -0.2, 0.32]].forEach(([dx, dy, dz, r]) =>
      add(p, 'pine_canopy', sph(r * s, 32, 16), mat.foliage, 0.12 * s + dx * s, h + dy + 0.06, dz * s).scale.set(1, 0.38, 1));
  };
  pine(1.4, -1.65, 1.5, 0.75); pine(-2.75, -0.7, 1.3, 0.65); pine(2.3, -1.8, 1.2, 0.55);

  const lamp = grp(rome, 'street_lamp', 1.75, 0, -0.55);
  add(lamp, 'lamp_base', cyl(0.06, 0.08, 0.12, 24), mat.ink, 0, 0.06, 0);
  add(lamp, 'lamp_pole', cyl(0.022, 0.03, 1.9, 16), mat.ink, 0, 1.0, 0);
  add(lamp, 'lamp_head', cyl(0.05, 0.11, 0.16, 24), mat.ink, 0, 2.0, 0);
  add(lamp, 'lamp_glass', sph(0.07, 24, 16), mat.lamp, 0, 1.9, 0);

  const bench = grp(rome, 'bench', -0.95, 0, 0.75);
  add(bench, 'bench_seat', rbox(0.9, 0.05, 0.32, 0.015), mat.paper, 0, 0.42, 0);
  for (const x of [-0.36, 0.36]) add(bench, 'bench_leg', rbox(0.06, 0.4, 0.3, 0.01), mat.ink, x, 0.2, 0);
  [[0.24, 0.05, 0.17, mat.ink, 0.1], [0.22, 0.045, 0.16, mat.red, -0.18], [0.2, 0.04, 0.15, mat.paper, 0.32]].reduce((y, [w, h, d, m, r]) => {
    add(bench, 'book', rbox(w, h, d, 0.006), m, 0.15, y + h / 2, 0, 0, r); return y + h;
  }, 0.445);
}

// ---------- First job (x ≈ 4.5) ----------
{
  const of = grp(world, 'office', 4.7, 0, 0);
  add(of, 'office_floor', rbox(2.8, 0.012, 2.1, 0.004), mat.sand, 0, 0.008, -0.55);
  add(of, 'office_wall', rbox(2.8, 1.8, 0.08, 0.02), mat.paper, 0, 0.9, -1.6);
  const notes = [mat.red, mat.knit, mat.paper, mat.ink];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) {
    if ((r * 7 + c * 3) % 5 === 0) continue;
    add(of, 'sticky_note', rbox(0.15, 0.15, 0.008, 0.003), notes[(r + c * 2) % 4], -1.05 + c * 0.22 + (r % 2) * 0.04, 1.55 - r * 0.22, -1.555, 0, 0, ((r + c) % 3 - 1) * 0.06);
  }
  add(of, 'pinboard', rbox(1.5, 0.78, 0.02, 0.008), mat.stone, -0.3, 1.33, -1.565);
  const dk = grp(of, 'desk', 0.45, 0, -0.85);
  add(dk, 'desk_top', rbox(1.4, 0.045, 0.66, 0.012), mat.paper, 0, 0.74, 0);
  for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) add(dk, 'desk_leg', cyl(0.018, 0.018, 0.72, 12), mat.ink, x * 0.64, 0.36, z * 0.28);
  add(dk, 'monitor_stand', cyl(0.02, 0.02, 0.22, 12), mat.ink, 0, 0.87, -0.15);
  add(dk, 'monitor_foot', rbox(0.2, 0.012, 0.14, 0.005), mat.ink, 0, 0.768, -0.15);
  add(dk, 'monitor', rbox(0.72, 0.44, 0.03, 0.015), mat.ink, 0, 1.18, -0.13);
  add(dk, 'monitor_display', new THREE.PlaneGeometry(0.68, 0.4), mat.paper, 0, 1.18, -0.113);
  add(dk, 'ui_hero', new THREE.PlaneGeometry(0.28, 0.2), mat.red, -0.15, 1.22, -0.112);
  for (let i = 0; i < 4; i++) add(dk, 'ui_line', new THREE.PlaneGeometry(0.22 - i * 0.04, 0.018), mat.ink, 0.17 - i * 0.02, 1.3 - i * 0.05, -0.112);
  add(dk, 'ui_btn', new THREE.PlaneGeometry(0.12, 0.04), mat.ink, 0.12, 1.06, -0.112);
  add(dk, 'keyboard', rbox(0.42, 0.016, 0.13, 0.006), mat.stone, 0, 0.77, 0.12);
  const mg = grp(dk, 'mug', 0.48, 0.763, 0.05);
  add(mg, 'mug_body', cyl(0.042, 0.038, 0.1, 32), mat.red, 0, 0.05, 0);
  add(mg, 'mug_handle', new THREE.TorusGeometry(0.026, 0.007, 10, 20), mat.red, 0.044, 0.05, 0);
  const ch = grp(of, 'chair', 0.4, 0, -0.25);
  add(ch, 'chair_post', cyl(0.025, 0.025, 0.36, 12), mat.ink, 0, 0.24, 0);
  for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; rod(ch, 'chair_leg', [0, 0.06, 0], [0.25 * Math.sin(a), 0.03, 0.25 * Math.cos(a)], 0.016, mat.ink); add(ch, 'chair_wheel', sph(0.03, 12, 8), mat.ink, 0.25 * Math.sin(a), 0.03, 0.25 * Math.cos(a)); }
  add(ch, 'chair_seat', rbox(0.46, 0.07, 0.44, 0.03), mat.ink, 0, 0.45, 0);
  add(ch, 'chair_back', rbox(0.44, 0.5, 0.06, 0.03), mat.ink, 0, 0.78, 0.2, -0.08);
  const pl = grp(of, 'plant', -1.15, 0, -1.2);
  add(pl, 'pot', cyl(0.16, 0.12, 0.34, 32), mat.red, 0, 0.17, 0);
  for (let i = 0; i < 9; i++) { const a = i * 2.4, r = 0.08 + (i % 3) * 0.05; add(pl, 'leaf', sph(0.12, 20, 12), mat.foliage, Math.sin(a) * r, 0.5 + (i % 4) * 0.13, Math.cos(a) * r, Math.sin(a) * 0.6, a, Math.cos(a) * 0.6).scale.set(0.45, 1, 0.12); }
}

// ---------- Car ----------
const car = grp(world, 'car', 6.9, 0, 0); car.scale.setScalar(0.78);
const carWheels = [];
{
  const s = new THREE.Shape();
  s.moveTo(-0.98, 0.24); s.lineTo(0.98, 0.24);
  s.quadraticCurveTo(1.06, 0.26, 1.04, 0.44); s.quadraticCurveTo(1.0, 0.62, 0.82, 0.65);
  s.lineTo(0.45, 0.68); s.quadraticCurveTo(0.33, 0.86, 0.2, 1.0);
  s.quadraticCurveTo(-0.15, 1.08, -0.52, 1.02); s.quadraticCurveTo(-0.85, 0.95, -0.95, 0.72);
  s.quadraticCurveTo(-1.04, 0.52, -0.98, 0.24);
  const body = new THREE.ExtrudeGeometry(s, { depth: 1.0, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.06, bevelSegments: 6, curveSegments: 24 });
  body.translate(0, 0, -0.5);
  add(car, 'car_body', body, mat.carPaint);
  const w = new THREE.Shape();
  w.moveTo(0.5, 0.7); w.quadraticCurveTo(0.38, 0.9, 0.25, 1.02); w.quadraticCurveTo(-0.15, 1.09, -0.52, 1.03);
  w.quadraticCurveTo(-0.84, 0.95, -0.9, 0.72); w.lineTo(0.5, 0.7);
  const glass = new THREE.ExtrudeGeometry(w, { depth: 1.12, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.015, bevelSegments: 2, curveSegments: 20 });
  glass.translate(0, 0, -0.56);
  add(car, 'car_glass', glass, mat.glass);
  add(car, 'car_pillar', rbox(0.07, 0.36, 1.2, 0.02), mat.carPaint, -0.15, 0.87, 0, 0, 0, 0.12);
  add(car, 'car_belt', rbox(1.92, 0.035, 1.18, 0.012), mat.paper, 0, 0.5, 0);
  for (const z of [-0.36, 0.36]) {
    add(car, 'headlight', sph(0.075, 24, 16), mat.lamp, 1.02, 0.52, z).scale.set(0.5, 1, 1);
    add(car, 'taillight', rbox(0.03, 0.1, 0.08, 0.01), mat.ink, -1.03, 0.6, z);
  }
  add(car, 'bumper_front', rbox(0.06, 0.07, 1.1, 0.03), mat.paper, 1.08, 0.3, 0);
  add(car, 'bumper_rear', rbox(0.06, 0.07, 1.1, 0.03), mat.paper, -1.06, 0.3, 0);
  for (const [x, z] of [[0.62, 0.52], [0.62, -0.52], [-0.62, 0.52], [-0.62, -0.52]]) {
    const wg = grp(car, 'wheel', x, 0.2, z);
    add(wg, 'tyre', new THREE.TorusGeometry(0.15, 0.055, 16, 40), mat.ink);
    add(wg, 'hubcap', cyl(0.11, 0.11, 0.06, 32), mat.paper, 0, 0, 0, Math.PI / 2);
    carWheels.push(wg);
  }
  for (const z of [-0.32, 0.32]) add(car, 'roof_rail', rbox(0.9, 0.03, 0.04, 0.012), mat.ink, -0.15, 1.13, z);
}
const roofCase = grp(car, 'roof_suitcase', -0.15, 1.27, 0);
add(roofCase, 'roof_case_body', rbox(0.62, 0.22, 0.42, 0.04), mat.ink, 0, 0, 0);
add(roofCase, 'roof_case_strap', rbox(0.04, 0.23, 0.43, 0.01), mat.red, 0.12, 0, 0);
add(roofCase, 'roof_case_strap', rbox(0.04, 0.23, 0.43, 0.01), mat.red, -0.12, 0, 0);

// ---------- Tuscany (x ≈ 11.8) ----------
const sun = new THREE.Group();
{
  const tu = grp(world, 'tuscany', 0, 0, 0);
  const hill = (x, z, r, sy, m) => add(tu, 'hill', new THREE.SphereGeometry(r, 64, 20, 0, Math.PI * 2, 0, Math.PI * 0.3), m, x, -r * Math.cos(Math.PI * 0.3) * sy + 0.004, z).scale.set(1, sy, 0.8);
  hill(11.4, -1.15, 1.35, 0.55, mat.stone);
  hill(13.0, -1.35, 1.1, 0.7, mat.sand);
  hill(10.3, -1.45, 0.9, 0.5, mat.sand);
  const cypress = (x, z, s, y = 0) => {
    const c = grp(tu, 'cypress', x, y, z);
    add(c, 'cypress_trunk', cyl(0.018, 0.024, 0.1, 10), mat.ink, 0, 0.05, 0);
    add(c, 'cypress_crown', lathe([[0, 0], [0.09, 0.1], [0.13, 0.35], [0.12, 0.65], [0.07, 0.95], [0.015, 1.12], [0, 1.15]], 40), mat.foliage, 0, 0.07, 0).scale.setScalar(s);
  };
  [[10.2, -0.75, 1], [10.55, -0.85, 0.85], [10.9, -0.95, 1.05], [11.25, -1.05, 0.9], [11.6, -1.15, 1.1]].forEach(a => cypress(...a, 0.08));
  cypress(12.2, -0.55, 1.2); cypress(14.0, -1.4, 0.9); cypress(9.7, 0.95, 0.8);
  const fh = grp(tu, 'farmhouse', 13.25, 0, -0.65);
  add(fh, 'farmhouse_walls', rbox(1.1, 0.62, 0.66, 0.015), mat.paper, 0, 0.31, 0);
  const roof = new THREE.Shape(); roof.moveTo(-0.62, 0); roof.lineTo(0.62, 0); roof.lineTo(0, 0.3); roof.lineTo(-0.62, 0);
  const rg = new THREE.ExtrudeGeometry(roof, { depth: 0.74, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 1 }); rg.translate(0, 0, -0.37);
  add(fh, 'farmhouse_roof', rg, mat.red, 0, 0.62, 0);
  add(fh, 'farmhouse_tower', rbox(0.34, 0.42, 0.34, 0.01), mat.paper, -0.3, 0.92, 0);
  add(fh, 'tower_roof', new THREE.ConeGeometry(0.27, 0.16, 4), mat.red, -0.3, 1.21, 0, 0, Math.PI / 4);
  for (const x of [-0.35, 0, 0.35]) add(fh, 'farm_window', rbox(0.1, 0.14, 0.02, 0.004), mat.ink, x, 0.4, 0.335);
  add(fh, 'farm_door', rbox(0.14, 0.24, 0.02, 0.004), mat.ink, 0.18, 0.12, 0.335);
  sun.name = 'sun'; sun.userData.keep = true; tu.add(sun); sun.position.set(12.6, 2.2, -1.9);
  add(sun, 'sun_disc', sph(0.32, 40, 28), new THREE.MeshStandardMaterial({ name: 'sun', color: 0xD7262B, emissive: 0xD7262B, emissiveIntensity: 0.35, roughness: 0.6 }));
}

// ---------- Today / studio (x ≈ 15.6) ----------
const floaters = [];
{
  const st = grp(world, 'studio', 15.7, 0, 0);
  add(st, 'studio_floor', rbox(3.2, 0.012, 2.2, 0.004), mat.ink, 0, 0.008, -0.55);
  add(st, 'studio_wall', rbox(3.2, 1.9, 0.08, 0.02), mat.paper, 0, 0.95, -1.6);
  const card = (parent, name, w, h, x, y, z, ry = 0, variant = 0) => {
    const c = grp(parent, name, x, y, z); c.rotation.y = ry;
    add(c, 'card_frame', rbox(w, h, 0.02, 0.012), mat.ink);
    add(c, 'card_face', new THREE.PlaneGeometry(w - 0.03, h - 0.03), mat.paper, 0, 0, 0.0115);
    add(c, 'card_block', new THREE.PlaneGeometry((w - 0.06) * (variant ? 1 : 0.45), h * 0.38), mat.red, variant ? 0 : -(w - 0.06) * 0.27, h * 0.18, 0.012);
    for (let i = 0; i < 3; i++) add(c, 'card_line', new THREE.PlaneGeometry((w - 0.08) * (0.7 - i * 0.15), h * 0.05), mat.ink, -(w - 0.08) * (0.15 + i * 0.075), -h * (0.1 + i * 0.1), 0.012);
    return c;
  };
  card(st, 'wall_screen', 0.42, 0.8, -1.05, 1.0, -1.545, 0, 1);
  card(st, 'wall_screen', 0.42, 0.8, -0.55, 1.0, -1.545, 0, 0);
  card(st, 'wall_board', 1.1, 0.72, 0.4, 1.05, -1.545, 0, 0);
  for (let i = 0; i < 5; i++) add(st, 'flow_dot', sph(0.025, 12, 8), mat.red, -0.78 + i * 0.12 + 0.1 * (i > 1), 1.48, -1.53);
  floaters.push(card(st, 'floating_card', 0.36, 0.24, 0.85, 1.35, -0.2, -0.5, 0));
  floaters.push(card(st, 'floating_card', 0.24, 0.42, -0.9, 1.15, 0.1, 0.5, 1));
  floaters.push(card(st, 'floating_card', 0.3, 0.2, 0.3, 1.9, -0.6, -0.2, 0));
  floaters.forEach(f => { f.userData.y = f.position.y; f.userData.keep = true; });
  const lp = grp(st, 'floor_lamp', 1.25, 0, -1.1);
  add(lp, 'lamp_foot', cyl(0.14, 0.16, 0.03, 32), mat.paper, 0, 0.015, 0);
  rod(lp, 'lamp_arm', [0, 0, 0], [-0.1, 1.55, 0.15], 0.014, mat.paper);
  add(lp, 'lamp_shade', new THREE.ConeGeometry(0.16, 0.2, 32, 1, true), mat.red, -0.12, 1.55, 0.18, 0.5).material = new THREE.MeshStandardMaterial({ name: 'red', color: 0xD7262B, roughness: 0.45, side: THREE.DoubleSide });
}

// ---------- Character ----------
const her = grp(world, 'me', 0, 0, 0);
const body = grp(her, 'body');
const J = {};
for (const [k, sd] of [['l', 1], ['r', -1]]) {
  const hip = grp(body, `hip_${k}`, sd * 0.06, 1.02, 0);
  add(hip, `trouser_${k}`, lathe([[0.0, 0.03], [0.07, 0.01], [0.077, -0.15], [0.085, -0.45], [0.098, -0.75], [0.112, -0.965], [0.109, -0.98]], 48), mat.teal);
  add(hip, `crease_${k}`, cap(0.004, 0.9, 6), M('teal_light', 0x6FB2B4), 0, -0.5, 0.088, -0.03);
  const knee = grp(hip, `knee_${k}`, 0, -0.5, 0);
  const foot = grp(knee, `foot_${k}`, 0, -0.47, 0);
  add(foot, `shoe_${k}`, cap(0.034, 0.11, 16), mat.red, 0, -0.012, 0.06, Math.PI / 2).scale.set(1, 1, 0.72);
  J[`hip_${k}`] = hip; J[`knee_${k}`] = knee;
}
add(body, 'pelvis', lathe([[0, 0.97], [0.118, 0.985], [0.124, 1.04], [0.104, 1.12], [0, 1.125]]), mat.teal).scale.set(1, 1, 0.74);
add(body, 'belt', new THREE.TorusGeometry(0.104, 0.009, 10, 64), mat.ink, 0, 1.115, 0, Math.PI / 2).scale.set(1, 0.74, 1);
const torsoPts = [[0.1, 1.11], [0.097, 1.17], [0.108, 1.25], [0.128, 1.33], [0.136, 1.39], [0.118, 1.44], [0.07, 1.47], [0.034, 1.478], [0, 1.479]];
add(body, 'top', lathe(torsoPts), mat.sweater).scale.set(1, 1, 0.72);
const rAt = y => { for (let i = 1; i < torsoPts.length; i++) if (y <= torsoPts[i][1]) { const [r0, y0] = torsoPts[i - 1], [r1, y1] = torsoPts[i]; return r0 + (r1 - r0) * (y - y0) / (y1 - y0); } return 0; };
const motif = (name, ang, y, size, m, sx = 1, sy = 1, rot = 0) => {
  const r = rAt(y) + 0.003, x = r * Math.sin(ang), z = r * Math.cos(ang) * 0.72;
  const o = add(body, name, sph(size, 24, 12), m, x, y, z); o.scale.set(sx, sy, 0.22);
  o.lookAt(x * 3, y, z * 3); o.rotateZ(rot); return o;
};
[[0.5, 1.33, 0.04, mat.red], [-0.7, 1.22, 0.034, mat.orange], [2.4, 1.3, 0.04, mat.red], [-2.2, 1.36, 0.035, mat.orange], [1.3, 1.2, 0.03, mat.ochre], [3.3, 1.2, 0.034, mat.ochre], [-1.5, 1.27, 0.028, mat.red], [0.05, 1.18, 0.026, mat.ochre]].forEach(([ang, y, sz, m], i) => {
  motif('flower', ang, y, sz, m);
  motif('flower_leaf', ang + 0.28, y - 0.03, sz * 0.7, mat.sage, 0.45, 1.3, 0.6);
  motif('flower_leaf', ang - 0.3, y + 0.025, sz * 0.6, mat.sage, 0.45, 1.3, -0.5);
});
add(body, 'neck', cyl(0.027, 0.031, 0.15, 24), mat.skin, 0, 1.53, -0.004);
add(body, 'necklace_chain', new THREE.TorusGeometry(0.05, 0.0014, 6, 64), mat.gold, 0, 1.455, 0.02, Math.PI / 2 + 1.05).scale.set(1, 0.8, 1);
add(body, 'necklace_ring', new THREE.TorusGeometry(0.016, 0.004, 12, 36), mat.gold, 0, 1.4, 0.088, -0.2);
for (const [k, sd] of [['l', 1], ['r', -1]]) {
  const sh = grp(body, `shoulder_${k}`, sd * 0.135, 1.415, 0);
  add(sh, `shoulder_cap_${k}`, sph(0.042), mat.sweater, 0, 0, 0).scale.set(1, 0.9, 0.9);
  add(sh, `upper_arm_${k}`, cap(0.033, 0.22), mat.sweater, 0, -0.15, 0);
  const el = grp(sh, `elbow_${k}`, 0, -0.29, 0);
  add(el, `forearm_${k}`, cap(0.03, 0.19), mat.sweater, 0, -0.12, 0);
  add(el, `cuff_${k}`, cyl(0.031, 0.031, 0.02, 20), mat.sweater, 0, -0.235, 0);
  add(el, `hand_${k}`, sph(0.03, 24, 16), mat.skin, 0, -0.27, 0.004).scale.set(0.75, 1.3, 0.5);
  J[`sh_${k}`] = sh; J[`el_${k}`] = el;
}
// head
const head = grp(body, 'head', 0, 1.675, 0); head.scale.setScalar(0.86);
{
  const g = sph(0.1, 64, 48), pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i) / 0.1;
    if (y < 0) { const f = 1 - 0.3 * y * y; pos.setX(i, pos.getX(i) * f); pos.setZ(i, pos.getZ(i) * (1 - 0.12 * y * y)); }
  }
  g.computeVertexNormals();
  add(head, 'face', g, mat.skin).scale.set(0.9, 1.2, 1.0);
  for (const s of [-1, 1]) {
    add(head, `eye_${s > 0 ? 'l' : 'r'}`, sph(0.0105, 20, 14), mat.ink, s * 0.034, 0.008, 0.09).scale.set(1, 1.15, 0.7);
    add(head, `lid_${s > 0 ? 'l' : 'r'}`, new THREE.TorusGeometry(0.013, 0.0022, 6, 16, Math.PI), mat.ink, s * 0.034, 0.011, 0.091, -0.2);
    add(head, `brow_${s > 0 ? 'l' : 'r'}`, cap(0.0035, 0.026, 8), mat.hair, s * 0.036, 0.04, 0.088, 0, 0, Math.PI / 2 - s * 0.12);
    add(head, `cheek_${s > 0 ? 'l' : 'r'}`, sph(0.018, 16, 12), new THREE.MeshStandardMaterial({ name: 'blush', color: 0xE9A891, roughness: 0.8, transparent: true, opacity: 0.55 }), s * 0.048, -0.02, 0.078).scale.set(1, 0.7, 0.3);
  }
  add(head, 'nose', sph(0.014, 20, 14), mat.skin, 0, -0.018, 0.098).scale.set(0.75, 1.3, 0.9);
  add(head, 'lip_upper', sph(0.02, 24, 12), mat.lips, 0, -0.05, 0.083).scale.set(1, 0.3, 0.45);
  add(head, 'lip_lower', sph(0.019, 24, 12), mat.lips, 0, -0.06, 0.081).scale.set(0.95, 0.38, 0.45);
  const hc = add(head, 'hair_cap', new THREE.SphereGeometry(0.1, 64, 32, 0, Math.PI * 2, 0, Math.PI * 0.56), mat.hair, 0, 0.008, -0.006, -0.28);
  hc.scale.set(1.02, 1.32, 1.1);
  add(head, 'hair_bob', lathe([[0.1, 0.03], [0.108, -0.02], [0.113, -0.07], [0.111, -0.11], [0.1, -0.138], [0.088, -0.132]], 64, 0.8, Math.PI * 2 - 1.6), mat.hair).scale.set(1, 1, 1.08);
  add(head, 'hair_fringe', sph(0.065, 40, 24), mat.hair, 0.045, 0.022, 0.088, 0.1, 0.35, -0.75).scale.set(0.95, 1.3, 0.3);
  add(head, 'hair_side', sph(0.06, 40, 24), mat.hair, -0.055, 0.035, 0.075, 0, -0.4, 0.5).scale.set(0.9, 0.95, 0.3);
  for (const sd of [-1, 1]) { add(head, 'earring_stud', sph(0.007, 12, 8), mat.gold, sd * 0.088, -0.035, 0.005); add(head, 'earring_drop', sph(0.011, 16, 12), mat.gold, sd * 0.089, -0.058, 0.005).scale.set(0.8, 1.2, 0.8); }
}
// accessories
const acc = {};
acc.backpack = grp(body, 'backpack', 0, 1.24, -0.135); acc.backpack.scale.setScalar(0.85);
add(acc.backpack, 'backpack_body', rbox(0.3, 0.38, 0.13, 0.05), mat.red);
add(acc.backpack, 'backpack_pocket', rbox(0.22, 0.14, 0.05, 0.02), mat.red, 0, -0.08, -0.08);
add(acc.backpack, 'backpack_flap', rbox(0.31, 0.1, 0.14, 0.03), mat.ink, 0, 0.15, 0);
for (const s of [-1, 1]) rod(acc.backpack, 'backpack_strap', [s * 0.09, 0.18, 0.1], [s * 0.11, -0.12, 0.28], 0.012, mat.ink);
acc.badge = grp(body, 'badge');
rod(acc.badge, 'lanyard', [0.045, 1.47, 0.045], [0.007, 1.27, 0.095], 0.0035, mat.red);
rod(acc.badge, 'lanyard', [-0.045, 1.47, 0.045], [-0.007, 1.27, 0.095], 0.0035, mat.red);
add(acc.badge, 'badge_card', rbox(0.05, 0.072, 0.005, 0.003), mat.paper, 0, 1.235, 0.096, -0.12);
add(acc.badge, 'badge_mark', new THREE.PlaneGeometry(0.034, 0.014), mat.red, 0, 1.25, 0.1, -0.12);
acc.suitcase = grp(body, 'suitcase', 0.3, 0, 0.02);
add(acc.suitcase, 'case_body', rbox(0.18, 0.5, 0.36, 0.04), mat.ink, 0, 0.33, 0);
for (const z of [-0.08, 0.08]) add(acc.suitcase, 'case_strap', rbox(0.185, 0.51, 0.03, 0.01), mat.red, 0, 0.33, z);
for (const z of [-0.05, 0.05]) add(acc.suitcase, 'case_rod', cyl(0.007, 0.007, 0.2, 10), mat.silver, 0, 0.67, z);
add(acc.suitcase, 'case_grip', rbox(0.025, 0.025, 0.13, 0.01), mat.ink, 0, 0.775, 0);
for (const z of [-0.14, 0.14]) add(acc.suitcase, 'case_wheel', cyl(0.025, 0.025, 0.02, 16), mat.ink, 0, 0.03, z, 0, 0, Math.PI / 2);
acc.blazer = grp(body, 'blazer');
add(acc.blazer, 'blazer_body', lathe(torsoPts.slice(0, 7).map(([r, y]) => [r * 1.08 + 0.004, y]).concat([[0.11, 1.425], [0.07, 1.445]]), 64, 0.38, Math.PI * 2 - 0.76), mat.inkDS).scale.set(1, 1, 0.74);
for (const s of [-1, 1]) add(acc.blazer, 'blazer_lapel', rbox(0.05, 0.24, 0.008, 0.004), mat.ink, s * 0.05, 1.34, 0.098, -0.1, s * 0.3, s * 0.3);
acc.sleeves = [];
for (const k of ['l', 'r']) {
  const a = grp(J[`sh_${k}`], `sleeve_${k}`); add(a, 'sleeve_upper', cap(0.038, 0.22), mat.ink, 0, -0.15, 0);
  const b = grp(J[`el_${k}`], `sleeve_lower_${k}`); add(b, 'sleeve_lower', cap(0.035, 0.17), mat.ink, 0, -0.11, 0);
  acc.sleeves.push(a, b);
}
acc.pencil = grp(J.el_r, 'pencil', 0, -0.27, 0.0);
add(acc.pencil, 'pencil_body', cyl(0.022, 0.022, 0.5, 6), mat.red, 0, -0.05, 0);
add(acc.pencil, 'pencil_band', cyl(0.023, 0.023, 0.035, 20), mat.silver, 0, 0.217, 0);
add(acc.pencil, 'pencil_eraser', cap(0.021, 0.02, 12), mat.ink, 0, 0.245, 0);
add(acc.pencil, 'pencil_wood', new THREE.ConeGeometry(0.022, 0.08, 6), mat.paper, 0, -0.34, 0, Math.PI);
add(acc.pencil, 'pencil_lead', new THREE.ConeGeometry(0.007, 0.025, 12), mat.ink, 0, -0.372, 0, Math.PI);

// ---------- Ambient ----------
const amb = { clouds: [], birds: [], pigeons: [] };
{
  const ridge = (z, m, n, y0, rr) => { for (let i = 0; i < n; i++) { const x = -14 + i * (44 / n) + Math.sin(i * 7.3) * 1.2, r = rr * (0.8 + 0.4 * Math.abs(Math.sin(i * 3.1))); add(world, 'far_hill', new THREE.SphereGeometry(r, 48, 16, 0, Math.PI * 2, 0, Math.PI / 2), m, x, y0, z).scale.set(1, 0.32, 0.6); } };
  ridge(-9, mat.far1, 14, 0, 4.2); ridge(-15, mat.far2, 10, 0, 6.5);
  const rs = grp(world, 'rome_skyline', 0.5, 0, -10.5);
  add(rs, 'dome_drum', cyl(0.55, 0.6, 0.7, 48), mat.stone, -0.6, 1.55, 0);
  add(rs, 'dome', new THREE.SphereGeometry(0.62, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), mat.stone, -0.6, 1.9, 0).scale.set(1, 1.15, 1);
  add(rs, 'lantern', cyl(0.07, 0.09, 0.3, 24), mat.stone, -0.6, 2.75, 0);
  add(rs, 'basilica', rbox(2.6, 1.2, 1.2, 0.02), mat.stone, -0.6, 0.6, 0.2);
  [[-3.4, 0.9, 1.1], [-2.4, 1.3, 0.8], [1.3, 1.0, 1.0], [2.3, 1.5, 0.7], [3.3, 0.8, 1.2]].forEach(([x, h, w]) => add(rs, 'roman_block', rbox(w, h, 0.8, 0.02), mat.stone, x, h / 2, 0.4));
  for (let i = 0; i < 9; i++) {
    const c = grp(world, 'cloud', -8 + i * 4.1, 3.6 + (i % 3) * 0.7, -6 - (i % 4) * 2.2);
    [[0, 0, 0.55], [0.55, -0.1, 0.4], [-0.55, -0.12, 0.42], [0.2, 0.25, 0.38]].forEach(([dx, dy, r]) => add(c, 'cloud_puff', sph(r, 24, 16), mat.cloud, dx, dy, 0).scale.set(1, 0.62, 0.7));
    c.userData.speed = 0.12 + (i % 3) * 0.05; amb.clouds.push(c);
  }
  for (let i = 0; i < 7; i++) {
    const bd = grp(world, 'bird', i * 3.5, 2.6 + (i % 3) * 0.5, -2.5 - (i % 2) * 2);
    add(bd, 'bird_body', sph(0.03, 12, 8), mat.ink).scale.set(1.8, 0.8, 0.8);
    const wl = grp(bd, 'wing_l'), wr = grp(bd, 'wing_r');
    add(wl, 'wing', rbox(0.06, 0.006, 0.16, 0.003), mat.ink, 0, 0, 0.08); add(wr, 'wing', rbox(0.06, 0.006, 0.16, 0.003), mat.ink, 0, 0, -0.08);
    bd.userData = { wl, wr, ph: i * 1.7, sp: 0.5 + (i % 3) * 0.15, base: bd.position.clone() }; amb.birds.push(bd);
  }
  [[0.6, 0.35], [0.85, 0.1], [-0.4, 0.55], [0.2, -0.45]].forEach(([x, z], i) => {
    const p = grp(world, 'pigeon', x, 0, z); p.rotation.y = i * 1.9;
    add(p, 'pigeon_body', sph(0.05, 16, 12), M('pigeon', 0x8C8A8F), 0, 0.05, 0).scale.set(1.4, 0.9, 0.9);
    const h = grp(p, 'pigeon_head', 0.06, 0.09, 0); add(h, 'pigeon_head_ball', sph(0.025, 12, 8), M('pigeon', 0x8C8A8F));
    add(h, 'pigeon_beak', new THREE.ConeGeometry(0.008, 0.02, 8), mat.ochre, 0.025, 0, 0, 0, 0, -Math.PI / 2);
    p.userData = { h, ph: i * 2.3 }; amb.pigeons.push(p);
  });
  const N = 260, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { pos[i * 3] = Math.random() * 14 - 7; pos[i * 3 + 1] = Math.random() * 4; pos[i * 3 + 2] = Math.random() * 8 - 6; }
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  amb.dust = new THREE.Points(pg, new THREE.PointsMaterial({ name: 'dust', color: 0xFFF3DC, size: 0.035, transparent: true, opacity: 0.8, depthWrite: false }));
  amb.dust.name = 'dust'; world.add(amb.dust);
}
function bake(g) {
  g.updateMatrixWorld(true);
  g.children.filter(c => c.userData.keep).forEach(c => world.attach(c));
  const buckets = new Map();
  g.traverse(o => {
    if (!o.isMesh || Array.isArray(o.material)) return;
    let geo = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
    geo.applyMatrix4(o.matrixWorld);
    const b = buckets.get(o.material) || []; b.push(geo); buckets.set(o.material, b);
  });
  for (const [m, list] of buckets) {
    const out = new THREE.BufferGeometry();
    for (const k of ['position', 'normal', 'uv']) {
      const size = k === 'uv' ? 2 : 3, n = list.reduce((a, q) => a + q.attributes.position.count, 0), arr = new Float32Array(n * size);
      let off = 0;
      for (const q of list) { const at = q.attributes[k]; if (at) arr.set(at.array, off); off += q.attributes.position.count * size; }
      out.setAttribute(k, new THREE.BufferAttribute(arr, size));
    }
    const mesh = new THREE.Mesh(out, m); mesh.name = g.name + '_' + m.name; world.add(mesh);
  }
  g.removeFromParent();
}
['rome', 'office', 'tuscany', 'studio', 'rome_skyline'].forEach(n => bake(world.getObjectByName(n)));

  return { world, her, body, J, head, acc, roofCase, car, carWheels, floaters, sun, amb };
}
