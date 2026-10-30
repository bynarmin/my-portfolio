"use client";

import { useEffect, useRef, useState } from "react";
import { JourneyEngine } from "./journey/engine";

/**
 * Home hero — a scroll-driven illustrated map. The section is tall; the stage
 * inside it is sticky, so scrolling "drives" the car along the road.
 */
export default function HeroJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<JourneyEngine | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const section = sectionRef.current!;
    const stage = stageRef.current!;
    const canvas = canvasRef.current!;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const getProgress = () => {
      const r = section.getBoundingClientRect();
      const span = r.height - stage.clientHeight;
      return span > 0 ? -r.top / span : 0;
    };

    const engine = new JourneyEngine({
      canvas,
      stage,
      section,
      getProgress,
      getTheme: () =>
        document.documentElement.dataset.theme === "light" ? "light" : "dark",
      clouds: !reduceMotion,
    });
    engine.start();
    engineRef.current = engine;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const p = Math.min(1, Math.max(0, getProgress()));
        stage.style.setProperty("--journey-p", p.toFixed(4));
        setStarted(p > 0.025);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  const skipToWork = (e: React.MouseEvent) => {
    const target = document.getElementById("work");
    if (!target) return;
    e.preventDefault();
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - 76,
      behavior: "instant",
    });
  };

  return (
    <section ref={sectionRef} className="journey" aria-label="Introduction">
      <div
        ref={stageRef}
        className="journey-stage"
        data-started={started ? "true" : "false"}
      >
        <canvas ref={canvasRef} className="journey-canvas" aria-hidden="true" />
        <div className="journey-tint" aria-hidden="true" />

        <div className="journey-card" data-started={started ? "true" : "false"}>
          <div className="hello-tag">Senior Product Designer</div>

          <h1 className="headline">
            <div className="hl-stack">
              <div className="hl-row">
                <span className="hl-word">I</span>
                <span className="hl-sep">·</span>
                <span className="hl-word">Design</span>
              </div>
              <div className="hl-row">
                <span className="hl-word">Digital Products</span>
                <span className="hl-sep">·</span>
                <span className="hl-word">that</span>
                <span className="hl-sep">·</span>
                <span className="hl-word">scale</span>
              </div>
            </div>
          </h1>

          <div className="hero-body">
            <p>
              Senior Product &amp; Service Designer. With 6 years of experience
              and a foundation in architecture, I build intuitive interfaces,
              robust design systems, and end-to-end user journeys.
            </p>
          </div>

          <div className="journey-cta">
            <a href="#work" className="journey-skip" onClick={skipToWork}>
              Skip to projects ↓
            </a>
            <span className="journey-hint">Scroll to follow the road</span>
          </div>
        </div>

        <a
          href="#work"
          className="journey-skip-pill"
          onClick={skipToWork}
          tabIndex={started ? 0 : -1}
        >
          Skip to projects ↓
        </a>

        <div className="journey-zoom">
          <button
            type="button"
            aria-label="Zoom in"
            onClick={() => engineRef.current?.zoomIn()}
          >
            +
          </button>
          <button
            type="button"
            aria-label="Zoom out"
            onClick={() => engineRef.current?.zoomOut()}
          >
            −
          </button>
        </div>

        <div className="journey-progress" aria-hidden="true" />
      </div>
    </section>
  );
}
