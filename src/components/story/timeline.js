/* Story timeline: maps scroll progress s (0..1) to the character's walk,
   accessories, car drive, camera path, sky colour and chapter UI.
   Ported from the Claude Design file "Portfolio Story v2"; the keyframes
   and easing are unchanged. */
/* eslint-disable */
export function createTimeline(THREE, refs, view, ui) {
  const V3 = THREE.Vector3;
  const { her, body, J, head, acc, roofCase, car, carWheels, floaters, sun, amb } = refs;
  const { cam, key, scene } = view;
  const { root, panels, rail, capEl, capTxt, hint } = ui;
  const forcedMode = false;

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ss = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
const back = x => { const c1 = 1.6, c3 = c1 + 1; return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2; };
function track(keys, s) { // [[s, v], ...] eased per segment
  if (s <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (s <= keys[i][0]) {
    const [s0, v0] = keys[i - 1], [s1, v1] = keys[i], t = ss(s0, s1, s);
    return Array.isArray(v0) ? v0.map((v, j) => lerp(v, v1[j], t)) : lerp(v0, v1, t);
  }
  return keys[keys.length - 1][1];
}
const herX = [[0, 0.1], [0.12, 0.1], [0.24, 4.3], [0.37, 4.3], [0.415, 6.3], [0.43, 6.3], [0.52, 10.7], [0.56, 11.3], [0.7, 11.2], [0.8, 15.4], [1, 15.4]];
const carX = [[0, 6.9], [0.43, 6.9], [0.53, 9.9], [1, 9.9]];
// camera: [offX, offY, offZ, tgtOffX, tgtY, tgtZ] relative to focus
const camK = [
  [0.00, [2.8, 2.6, 8.6, -1.1, 1.17, -0.5]],
  [0.10, [-1.6, 2, 7, -0.9, 1.22, -0.4]],
  [0.18, [0.2, 1.9, 7.4, -0.2, 1.12, 0]],
  [0.27, [2.2, 2.2, 6.6, -0.6, 1.22, -0.6]],
  [0.36, [-0.6, 2.4, 6.4, -0.4, 1.17, -0.6]],
  [0.47, [-0.8, 3.4, 9.4, 0.2, 0.82, 0]],
  [0.58, [2.6, 2, 7, -0.6, 1.22, -0.6]],
  [0.68, [-1.4, 2.2, 6.8, -0.4, 1.22, -0.5]],
  [0.76, [0.2, 1.9, 7.2, 0, 1.17, 0]],
  [0.86, [2, 2, 6.2, -0.6, 1.37, -0.5]],
  [0.93, [-0.6, 2.2, 6, -0.5, 1.42, -0.5]],
  [1.00, [0, 7.5, 17.5, 0, 0.4, 0]],
];
const pose = { // [shLx, shLz, elL, shRx, shRz, elR]
  rest: [0.02, 0.07, -0.12, 0.02, -0.07, -0.12],
  straps: [-0.35, 0.18, -1.7, -0.35, -0.18, -1.7],
  office: [-0.25, 0.08, -0.7, -0.15, -0.08, -0.35],
  case: [0.0, 0.32, -0.05, 0.02, -0.08, -0.15],
  pencil: [0.02, 0.08, -0.2, -2.55, -0.3, -0.25],
};
const chapters = [[0, 0.13], [0.23, 0.38], [0.55, 0.71], [0.8, 1.01]];
const hex = h => { const c = new THREE.Color(h); return [c.r, c.g, c.b]; };
const skyK = [[0, hex(0xEDDCC6)], [0.15, hex(0xEDDCC6)], [0.24, hex(0xE6E0D4)], [0.38, hex(0xE6E0D4)], [0.47, hex(0xE9C8A8)], [0.58, hex(0xF0D9B0)], [0.72, hex(0xF0D9B0)], [0.82, hex(0xE9E0D2)], [1, hex(0xEADFCD)]];
const captions = [[0.13, 0.23, 'Next stop: first job'], [0.39, 0.54, 'Changing city'], [0.71, 0.8, 'Next stop: today']];

  let s = 0, prevX = 0, phase = 0, amp = 0, face = 0, carPrev = 6.9, wheelA = 0, yaw = 0, yawT = 0, drag = null, last = performance.now();
  const focusS = new V3(), tmp = new V3();

  function setPose(name, w, acc) { const p = pose[name]; for (let i = 0; i < 6; i++) acc[i] += p[i] * w; return w; }
  function show(g, w) { g.visible = w > 0.002; g.scale.setScalar(Math.max(0.0001, back(w))); }

  function tick(now, goal) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  const t = now / 1000;
  s += (goal - s) * (1 - Math.pow(0.002, dt));

  // character travel + walk cycle
  const x = track(herX, s), dx = x - prevX; prevX = x;
  const inCar = s > 0.418 && s < 0.528;
  const spd = Math.abs(dx) / Math.max(dt, 1e-3);
  amp += ((inCar ? 0 : clamp(spd / 1.0)) - amp) * (1 - Math.pow(0.001, dt));
  if (!inCar) phase += dx / 0.62 * Math.PI;
  her.position.x = x;
  const vis = 1 - ss(0.405, 0.418, s) + ss(0.528, 0.545, s);
  her.scale.setScalar(Math.max(0.0001, clamp(vis)));
  her.visible = vis > 0.01;
  face += ((amp > 0.15 ? 1 : 0) - face) * (1 - Math.pow(0.02, dt));
  her.rotation.y = lerp(0.35 + Math.sin(t * 0.5) * 0.05, Math.PI / 2, face);

  const sw = Math.sin(phase);
  J.hip_l.rotation.x = -sw * 0.5 * amp; J.hip_r.rotation.x = sw * 0.5 * amp;
  J.knee_l.rotation.x = amp * 0.18 * Math.max(0, Math.sin(phase + 1.3)) + 0.02;
  J.knee_r.rotation.x = amp * 0.18 * Math.max(0, Math.sin(phase + 1.3 + Math.PI)) + 0.02;
  body.position.y = amp * Math.abs(Math.cos(phase)) * 0.028 + Math.sin(t * 1.6) * 0.003 * (1 - amp);
  body.rotation.z = sw * 0.03 * amp;

  // accessories timeline
  const wBack = 1 - ss(0.2, 0.235, s);
  const wBadge = ss(0.235, 0.26, s) * (1 - ss(0.385, 0.405, s));
  const wCase = ss(0.535, 0.555, s) * (1 - ss(0.71, 0.73, s));
  const wBlazer = ss(0.795, 0.83, s);
  const wPencil = ss(0.84, 0.87, s);
  const wOffice = ss(0.25, 0.28, s) * (1 - ss(0.36, 0.38, s));
  show(acc.backpack, wBack); show(acc.badge, wBadge); show(acc.suitcase, wCase); show(acc.blazer, wBlazer); show(acc.pencil, wPencil);
  acc.sleeves.forEach(g => show(g, wBlazer));
  roofCase.visible = s < 0.545; roofCase.scale.setScalar(Math.max(0.0001, 1 - ss(0.53, 0.545, s)));

  const P = [0, 0, 0, 0, 0, 0];
  let used = setPose('straps', wBack * (1 - amp * 0.3), P) + setPose('office', wOffice, P) + setPose('case', wCase, P) + setPose('pencil', wPencil * (1 - amp), P);
  setPose('rest', Math.max(0, 1 - used), P);
  const armAmp = amp * (1 - wBack * 0.75);
  J.sh_l.rotation.set(P[0] + sw * 0.45 * armAmp * (1 - wCase), 0, P[1]);
  J.sh_r.rotation.set(P[3] - sw * 0.45 * armAmp, 0, P[4] + Math.sin(t * 2.2) * 0.04 * wPencil);
  J.el_l.rotation.x = P[2] - 0.15 * armAmp; J.el_r.rotation.x = P[5] - 0.15 * armAmp;
  head.rotation.set(-0.04 + Math.sin(t * 0.7) * 0.02 - 0.12 * wPencil, Math.sin(t * 0.4) * 0.12 * (1 - amp), Math.sin(t * 0.9) * 0.03);

  // car
  const cx = track(carX, s), cdx = cx - carPrev; carPrev = cx;
  car.position.x = cx; wheelA -= cdx / 0.2;
  carWheels.forEach(w => { w.rotation.z = wheelA; });
  const driving = Math.abs(cdx) > 0.0004 ? 1 : 0;
  car.position.y = driving * Math.abs(Math.sin(t * 14)) * 0.012;
  car.rotation.z = driving * Math.sin(t * 7) * 0.006;

  // studio floaters + sun
  floaters.forEach((f, i) => { f.position.y = f.userData.y + Math.sin(t * 1.2 + i * 2) * 0.03; f.rotation.z = Math.sin(t * 0.8 + i) * 0.04; });
  sun.position.y = 2.2 + Math.sin(t * 0.5) * 0.04;

  // camera
  const wCar = ss(0.4, 0.43, s) * (1 - ss(0.52, 0.55, s));
  let fx = lerp(x, cx, wCar);
  fx = lerp(fx, 7.6, ss(0.94, 1, s));
  focusS.x += (fx - focusS.x) * (forcedMode ? 1 : 1 - Math.pow(0.0005, dt));
  const k = track(camK, s);
  if (drag == null) yawT *= Math.pow(0.08, dt);
  yaw += (yawT - yaw) * (1 - Math.pow(0.001, dt));
  const tgt = new V3(focusS.x + k[3], k[4], k[5]);
  tmp.set(k[0] - k[3], k[1] - k[4], k[2] - k[5]).applyAxisAngle(new V3(0, 1, 0), yaw);
  cam.position.copy(tgt).add(tmp);
  cam.lookAt(tgt);
  key.position.set(tgt.x + 4, 8, 5); key.target.position.set(tgt.x, 0, 0);
  const wide = ss(0.94, 1, s);
  const sc = lerp(4, 11, wide);
  if (key.shadow.camera.right !== sc) Object.assign(key.shadow.camera, { left: -sc, right: sc, top: sc, bottom: -sc }), key.shadow.camera.updateProjectionMatrix();

  // ambient
  const sky = track(skyK, s); scene.background.setRGB(sky[0], sky[1], sky[2]); scene.fog.color.copy(scene.background);
  root.style.setProperty('--bg', '#' + scene.background.getHexString());
  amb.clouds.forEach(c => { c.position.x += c.userData.speed * dt; if (c.position.x > focusS.x + 18) c.position.x -= 36; if (c.position.x < focusS.x - 18) c.position.x += 36; });
  amb.birds.forEach(b => { const u = b.userData; b.position.x = u.base.x + ((t * u.sp + u.ph) % 30) - 8; if (b.position.x - focusS.x > 14) u.base.x -= 30; if (focusS.x - b.position.x > 14) u.base.x += 30; b.position.y = u.base.y + Math.sin(t * 0.8 + u.ph) * 0.2; const f = Math.sin(t * 9 + u.ph) * 0.7; u.wl.rotation.x = f; u.wr.rotation.x = -f; });
  amb.pigeons.forEach(p => { const u = p.userData, k = Math.max(0, Math.sin(t * 2.4 + u.ph)); u.h.position.set(0.06 + k * 0.02, 0.09 - k * 0.06, 0); });
  amb.dust.position.x = focusS.x; const dp = amb.dust.geometry.attributes.position;
  for (let i = 0; i < dp.count; i++) { let y = dp.getY(i) + dt * 0.08; if (y > 4) y = 0; dp.setY(i, y); dp.setX(i, dp.getX(i) + Math.sin(t * 0.5 + i) * dt * 0.05); }
  dp.needsUpdate = true;
  // UI
  panels.forEach((el, i) => {
    const [a, b] = chapters[i];
    const o = ss(a - 0.03, a + 0.01, s) * (1 - ss(b - 0.015, b + 0.02, s));
    el.style.opacity = i === 0 ? 1 - ss(0.11, 0.14, s) : o;
    el.style.transform = `translateY(${(1 - o) * 16}px)`;
  });
  rail.forEach((el, i) => {
    const [a, b] = chapters[i];
    el.classList.toggle('on', s >= a - 0.02 && s < b);
    el.querySelector('b').style.transform = `scaleX(${clamp((s - a) / (b - a))})`;
  });
  const c = captions.find(([a, b]) => s > a && s < b);
  capEl.style.opacity = c ? 1 : 0; if (c) capTxt.textContent = c[2];
  hint.style.opacity = s < 0.03 ? 1 : 0;
  }

  return {
    tick,
    dragStart(x) { drag = x; },
    dragMove(x) { if (drag != null) { yawT = clamp(yawT + (x - drag) * -0.006, -1.1, 1.1); drag = x; } },
    dragEnd() { drag = null; },
  };
}
