"use client";

import { useEffect, useRef } from "react";

/* Home hero: a pinned 3D scroll story (Rome → first job → Tuscany → today).
   The scene and timeline live in ./story; this component owns the renderer,
   lights, resize, scroll progress and drag-to-look. */

const CHAPTERS = [
  { n: "01 — Rome", rail: "Rome", lead: "Student in", em: "Rome" },
  { n: "02 — First job", rail: "First job", lead: "Working as designer at my", em: "first job" },
  { n: "03 — New city", rail: "Tuscany", lead: "Changing city and coming to", em: "Tuscany" },
  { n: "04 — Today", rail: "Today", lead: "Now working as", em: "senior designer" },
];

export default function StoryHero() {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    const host = canvasHostRef.current;
    const loading = loadingRef.current;
    if (!root || !pin || !host || !loading) return;

    let disposed = false;
    let cleanup = () => {};

    const fail = (msg: string) => {
      loading.textContent = msg;
      loading.style.opacity = "1";
      root.classList.add("story-static");
    };

    (async () => {
      const [THREE, { buildWorld }, { createTimeline }] = await Promise.all([
        import("three"),
        import("./story/world.js"),
        import("./story/timeline.js"),
      ]);
      if (disposed) return;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        fail("3D view isn't available in this browser");
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      renderer.toneMapping = THREE.NeutralToneMapping;
      renderer.domElement.style.touchAction = "pan-y";
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const cam = new THREE.PerspectiveCamera(30, 1, 0.05, 120);

      // Studio light: sky/ground wash, shadow-casting key, warm fill.
      scene.add(new THREE.HemisphereLight(0xffffff, 0xd8d2c4, 0.55));
      const key = new THREE.DirectionalLight(0xffffff, 2.3);
      key.castShadow = true;
      key.shadow.mapSize.set(2048, 2048);
      Object.assign(key.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: 0.5, far: 30 });
      key.shadow.camera.updateProjectionMatrix();
      key.shadow.bias = -0.0004;
      key.shadow.normalBias = 0.02;
      scene.add(key, key.target);
      const fill = new THREE.DirectionalLight(0xfff4e6, 0.5);
      fill.position.set(-5, 3, -4);
      scene.add(fill);

      // Soft studio reflections from a tiny generated environment.
      const pm = new THREE.PMREMGenerator(renderer);
      const env = new THREE.Scene();
      env.add(new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), new THREE.MeshBasicMaterial({ color: 0x9a978f, side: THREE.BackSide })));
      const panel = (x: number, y: number, z: number, w: number, h: number, c: number) => {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide }));
        m.position.set(x, y, z);
        m.lookAt(0, 0, 0);
        env.add(m);
      };
      panel(0, 9, 0, 14, 14, 0xffffff);
      panel(8, 4, 6, 6, 4, 0xfff1e0);
      panel(-8, 3, -4, 6, 4, 0xe9eef5);
      const envTex = pm.fromScene(env, 0.04).texture;
      scene.environment = envTex;
      scene.environmentIntensity = 0.55;
      pm.dispose();

      scene.background = new THREE.Color(0xebddc8);
      scene.fog = new THREE.Fog(0xebddc8, 9, 30);

      const refs = buildWorld(THREE);
      refs.world.traverse((o: import("three").Object3D) => {
        if ((o as import("three").Mesh).isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;
        }
      });
      scene.add(refs.world);

      const timeline = createTimeline(THREE, refs, { cam, key, scene }, {
        root,
        panels: Array.from(root.querySelectorAll<HTMLElement>(".story-panel")),
        rail: Array.from(root.querySelectorAll<HTMLElement>(".story-rail > div")),
        capEl: root.querySelector<HTMLElement>(".story-caption"),
        capTxt: root.querySelector<HTMLElement>(".story-caption span"),
        hint: root.querySelector<HTMLElement>(".story-hint"),
      });

      const fit = () => {
        const w = host.clientWidth || 1;
        const h = host.clientHeight || 1;
        renderer.setSize(w, h);
        cam.aspect = w / h;
        cam.updateProjectionMatrix();
      };
      fit();
      const ro = new ResizeObserver(fit);
      ro.observe(host);

      const progress = () => {
        const r = root.getBoundingClientRect();
        return Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - pin.offsetHeight)));
      };

      let raf = 0;
      let visible = true;
      const frame = (now: number) => {
        raf = 0;
        try {
          timeline.tick(now, progress());
          renderer.render(scene, cam);
        } catch (e) {
          fail("Something went wrong drawing the story");
          console.error(e);
          return;
        }
        if (visible) raf = requestAnimationFrame(frame);
      };
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !raf) raf = requestAnimationFrame(frame);
      });
      io.observe(root);

      // Drag sideways to look around; the view eases back on release.
      const canvas = renderer.domElement;
      const down = (e: PointerEvent) => timeline.dragStart(e.clientX);
      const move = (e: PointerEvent) => timeline.dragMove(e.clientX);
      const up = () => timeline.dragEnd();
      canvas.addEventListener("pointerdown", down);
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
      window.addEventListener("pointercancel", up);

      loading.style.opacity = "0";
      raf = requestAnimationFrame(frame);

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        canvas.removeEventListener("pointerdown", down);
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        window.removeEventListener("pointercancel", up);
        scene.traverse((o) => {
          const m = o as import("three").Mesh;
          if (m.geometry) m.geometry.dispose();
          const mat = m.material;
          if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
          else if (mat) mat.dispose();
        });
        envTex.dispose();
        renderer.dispose();
        canvas.remove();
      };
      if (disposed) cleanup();
    })().catch((e) => {
      console.error(e);
      fail("The 3D story couldn't load");
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <section className="story" ref={rootRef} aria-label="My story">
      <div className="story-pin" ref={pinRef}>
        <div className="story-canvas" ref={canvasHostRef} />
        <div className="story-loading" ref={loadingRef}>
          Building the world…
        </div>
        <div className="story-ui">
          <div className="story-top">
            <p className="story-intro">
              <i aria-hidden="true" />
              Product Designer — creative and passionate
            </p>
            <div className="story-rail" aria-hidden="true">
              {CHAPTERS.map((c) => (
                <div key={c.rail}>
                  <span>
                    <b />
                  </span>
                  {c.rail}
                </div>
              ))}
            </div>
          </div>
          <div className="story-panels">
            {CHAPTERS.map((c, i) => (
              <div className="story-panel" key={c.n} style={i === 0 ? { opacity: 1 } : undefined}>
                <p className="story-n">{c.n}</p>
                {i === 0 ? (
                  <h1>
                    {c.lead} <em>{c.em}</em>
                  </h1>
                ) : (
                  <h2>
                    {c.lead} <em>{c.em}</em>
                  </h2>
                )}
              </div>
            ))}
          </div>
          <div className="story-bottom">
            <p className="story-hint">Scroll to begin · drag to look around</p>
            <p className="story-caption" aria-live="polite">
              <i aria-hidden="true" />
              <span />
            </p>
            <div className="story-spacer" />
          </div>
        </div>
      </div>
    </section>
  );
}
