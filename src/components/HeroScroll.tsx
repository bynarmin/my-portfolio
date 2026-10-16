"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

type Scene = {
  key: string;
  eyebrow: string;
  title: string;
  accent: string;
  body: string;
  href: string;
  external?: boolean;
  cta: string;
  img?: string;
  alt?: string;
};

/* One pinned stage, six beats: intro, four case studies, design systems. */
const PROJECTS: Scene[] = [
  {
    key: "bizim",
    eyebrow: "E-commerce + app",
    title: "Bizim",
    accent: "Tarla",
    body: "Cross-platform fresh produce delivery service, from first order to repeat basket.",
    href: "/work/bizim-tarla",
    cta: "Read case study",
    img: "/hero/bizim.webp",
    alt: "Bizim Tarla app screens in an isometric grid",
  },
  {
    key: "health",
    eyebrow: "SaaS & Digital Health",
    title: "My Digital",
    accent: "Health",
    body: "A patient portal that simplifies care management, onboarding and health tracking dashboards.",
    href: "/work/my-digital-health",
    cta: "Read case study",
    img: "/hero/health.webp",
    alt: "My Digital Health dashboard on a laptop",
  },
  {
    key: "catme",
    eyebrow: "Mobile app & community",
    title: "Cat",
    accent: "Me",
    body: "End-to-end mobile UX connecting local pet owners through discovery and interaction flows.",
    href: "/work/cat-me",
    cta: "Read case study",
    img: "/hero/catme.webp",
    alt: "Cat Me mobile app screens",
  },
  {
    key: "tenuta",
    eyebrow: "E-commerce & brand",
    title: "Tenuta",
    accent: "Belvedere",
    body: "A tailored online shop built to improve checkout flow and carry the brand identity.",
    href: "https://tenuta-belvedere-manaro.myshopify.com/pages/chi-siamo",
    external: true,
    cta: "Visit the shop",
    img: "/hero/tenuta.webp",
    alt: "Tenuta Belvedere website on a laptop",
  },
];

const SYSTEM_CARDS = [
  { src: "/hero/sys-type.webp", alt: "Typography and colour specimen" },
  { src: "/hero/sys-ui.webp", alt: "UI component library" },
  { src: "/hero/sys-catme.webp", alt: "Cat Me design system board" },
];

const TOTAL = PROJECTS.length + 2; // intro + projects + systems
const DEAD = 0.18; // fraction of each beat where the scene holds still

const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function Letters({ text }: { text: string }) {
  return (
    <>
      {text.split("").map((ch, i) => (
        <span className="hs-char" key={i}>
          {ch === " " ? " " : ch}
        </span>
      ))}
    </>
  );
}

export default function HeroScroll() {
  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return; // CSS renders the stacked, static layout

    const scenes = Array.from(
      stage.querySelectorAll<HTMLElement>("[data-scene]")
    );
    const ticks = Array.from(
      stage.querySelectorAll<HTMLElement>("[data-tick]")
    );
    const counter = stage.querySelector<HTMLElement>("[data-counter]");
    const chars = Array.from(
      stage.querySelectorAll<HTMLElement>(".hs-char")
    );
    const charState = chars.map(() => ({ x: 0, y: 0, heat: 0 }));

    let cur = 0;
    let visible = true;
    let raf = 0;
    let shown = -1;
    // pointer: target and eased values, normalised to -1..1 across the stage
    let tx = 0,
      ty = 0,
      mx = 0,
      my = 0;
    let px = -999,
      py = -999;

    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      ty = ((e.clientY - r.top) / r.height) * 2 - 1;
      px = e.clientX;
      py = e.clientY;
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      px = -999;
      py = -999;
    };
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !raf) raf = requestAnimationFrame(frame);
      },
      { rootMargin: "100px 0px" }
    );
    io.observe(track);

    function frame() {
      raf = 0;
      if (!visible) return;

      const rect = track!.getBoundingClientRect();
      const span = Math.max(1, rect.height - stage!.offsetHeight);
      const target = clamp(-rect.top / span) * (TOTAL - 1);
      cur = lerp(cur, target, 0.13);
      if (Math.abs(cur - target) < 0.0008) cur = target;
      mx = lerp(mx, tx, 0.08);
      my = lerp(my, ty, 0.08);

      stage!.style.setProperty("--mx", mx.toFixed(4));
      stage!.style.setProperty("--my", my.toFixed(4));
      stage!.style.setProperty("--p", (cur / (TOTAL - 1)).toFixed(4));

      scenes.forEach((el, i) => {
        const d = cur - i;
        const dd = Math.sign(d) * Math.max(0, Math.abs(d) - DEAD) / (1 - DEAD);
        const media = clamp(1 - Math.abs(dd) * 1.3);
        const text = clamp(1 - Math.abs(dd) * 2.4);
        el.style.setProperty("--d", dd.toFixed(4));
        el.style.setProperty("--v", media.toFixed(4));
        el.style.setProperty("--tv", text.toFixed(4));
        el.toggleAttribute("inert", text < 0.35);
      });

      ticks.forEach((el, i) => {
        el.style.setProperty("--fill", clamp(cur - i + 0.5).toFixed(3));
      });

      const idx = Math.round(cur);
      if (idx !== shown && counter) {
        shown = idx;
        counter.textContent = String(idx + 1).padStart(2, "0");
      }

      // magnetic headline letters, only while the intro is on screen
      if (cur < 0.6) {
        chars.forEach((el, i) => {
          const s = charState[i];
          const r = el.getBoundingClientRect();
          const cx = r.left + r.width / 2 - s.x;
          const cy = r.top + r.height / 2 - s.y;
          const dx = px - cx;
          const dy = py - cy;
          const dist = Math.hypot(dx, dy);
          const near = dist < 100;
          const pull = near ? (1 - dist / 100) * 0.4 : 0;
          s.x = lerp(s.x, dx * pull, 0.1);
          s.y = lerp(s.y, dy * pull, 0.1);
          s.heat = lerp(s.heat, near ? 1 - dist / 100 : 0, 0.1);
          el.style.transform = `translate3d(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px, 0)`;
          el.style.setProperty("--heat", s.heat.toFixed(3));
        });
      }

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section
      className="hs"
      ref={trackRef}
      aria-label="Introduction and selected work"
      style={{ ["--scenes" as string]: TOTAL }}
    >
      <div className="hs-stage" ref={stageRef}>
        <div className="hs-glow" aria-hidden="true" />
        <div className="hs-marquee" aria-hidden="true">
          <div className="hs-marquee-inner">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i}>Design.</span>
            ))}
          </div>
        </div>

        {/* 0 — intro */}
        <article
          className="hs-scene hs-intro"
          data-scene
          style={{ ["--v" as string]: 1, ["--tv" as string]: 1, ["--d" as string]: 0 }}
        >
          <div className="hs-text">
            <p className="hs-eyebrow">Senior Product Designer</p>
            <h1 className="hs-headline">
              <span className="hs-row">
                <span className="hs-word">
                  <Letters text="I" />
                </span>
                <span className="hs-sep">·</span>
                <span className="hs-word hs-word-soft">
                  <Letters text="Design" />
                </span>
              </span>
              <span className="hs-row">
                <span className="hs-word">
                  <Letters text="Digital Products" />
                </span>
                <span className="hs-sep">·</span>
                <span className="hs-word">
                  <Letters text="that" />
                </span>
                <span className="hs-sep">·</span>
                <span className="hs-word">
                  <Letters text="scale" />
                </span>
              </span>
            </h1>
            <p className="hs-body hs-body-mono">
              Senior Product &amp; Service Designer. With 6 years of experience
              and a foundation in architecture, I build intuitive interfaces,
              robust design systems, and end-to-end user journeys.
            </p>
            <p className="hs-hint" aria-hidden="true">
              <span className="hs-hint-line" /> Scroll for selected work
            </p>
          </div>
          <div className="hs-media hs-media-portrait">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero/portrait.webp"
              alt="Portrait of Narmin"
              width={900}
              height={1350}
              decoding="async"
            />
          </div>
        </article>

        {/* 1–4 — case studies */}
        {PROJECTS.map((p, i) => (
          <article
            className="hs-scene"
            data-scene
            key={p.key}
            inert
            style={{
              ["--v" as string]: 0,
              ["--tv" as string]: 0,
              ["--d" as string]: i + 1,
            }}
          >
            <div className="hs-text">
              <p className="hs-eyebrow">{p.eyebrow}</p>
              <h2 className="hs-title">
                {p.title} <em>{p.accent}</em>
              </h2>
              <p className="hs-body">{p.body}</p>
              {p.external ? (
                <a
                  className="hs-cta"
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {p.cta} <span aria-hidden="true">↗</span>
                </a>
              ) : (
                <Link className="hs-cta" href={p.href}>
                  {p.cta} <span aria-hidden="true">↗</span>
                </Link>
              )}
            </div>
            <div className={`hs-media hs-media-${p.key}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.img} alt={p.alt} decoding="async" />
            </div>
          </article>
        ))}

        {/* 5 — design systems */}
        <article
          className="hs-scene"
          data-scene
          inert
          style={{
            ["--v" as string]: 0,
            ["--tv" as string]: 0,
            ["--d" as string]: TOTAL - 1,
          }}
        >
          <div className="hs-text">
            <p className="hs-eyebrow">Design systems</p>
            <h2 className="hs-title">
              Systems that <em>scale</em>
            </h2>
            <p className="hs-body">
              Type, colour and component libraries built once and reused across
              every product above.
            </p>
            <Link className="hs-cta" href="#projects">
              See all projects <span aria-hidden="true">↓</span>
            </Link>
          </div>
          <div className="hs-media hs-media-systems">
            {SYSTEM_CARDS.map((c, i) => (
              <div className={`hs-card hs-card-${i}`} key={c.src}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.src} alt={c.alt} decoding="async" />
              </div>
            ))}
          </div>
        </article>

        <div className="hs-rail" aria-hidden="true">
          <span className="hs-count">
            <b data-counter>01</b>
            <i> / {String(TOTAL).padStart(2, "0")}</i>
          </span>
          <span className="hs-ticks">
            {Array.from({ length: TOTAL }).map((_, i) => (
              <span className="hs-tick" data-tick key={i} />
            ))}
          </span>
        </div>
      </div>
    </section>
  );
}
