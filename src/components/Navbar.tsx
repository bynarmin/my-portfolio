"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();

  useEffect(() => {
    // 1. Build magnetic letter spans cleanly
    const words = document.querySelectorAll<HTMLElement>(".nav-word");
    words.forEach((target) => {
      const text = target.dataset.word || "";
      target.innerHTML = ""; // Clear existing spans to prevent duplicate letters on navigation
      text.split("").forEach((ch) => {
        const span = document.createElement("span");
        span.className = "nav-letter";
        span.textContent = ch;
        span.style.display = "inline-block";
        span.style.willChange = "transform, color";
        target.appendChild(span);
      });
    });

    // 2. Setup animation tracking variables
    let mx = -200, my = -200;
    const RADIUS = 90;
    const STRENGTH = 0.45;
    const LERP_T = 0.085;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    // Muted grey -> full contrast, flipped per theme (white on dark, near-black on light)
    const lerpColor = (t: number) => {
      const light = document.documentElement.dataset.theme === "light";
      const v = Math.round(light ? lerp(110, 20, t) : lerp(160, 255, t));
      return `rgb(${v},${v},${v})`;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const letters = Array.from(
      document.querySelectorAll<HTMLElement>(".nav-letter")
    );
    const states = letters.map(() => ({ x: 0, y: 0, heat: 0 }));

    let animId: number;

    // 3. Magnetic Animation Loop
    const tick = () => {
      letters.forEach((letter, i) => {
        const rect = letter.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = mx - cx;
        const dy = my - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let tx = 0, ty = 0, targetHeat = 0;

        if (dist < RADIUS && dist > 0) {
          const force = Math.pow(1 - dist / RADIUS, 1.8);
          tx = dx * force * STRENGTH;
          ty = dy * force * STRENGTH;
          targetHeat = force;
        }

        states[i].x = lerp(states[i].x, tx, LERP_T);
        states[i].y = lerp(states[i].y, ty, LERP_T);
        states[i].heat = lerp(states[i].heat, targetHeat, LERP_T * 1.4);

        letter.style.transform = `translate3d(${states[i].x.toFixed(2)}px, ${states[i].y.toFixed(2)}px, 0)`;

        const h = states[i].heat;
        if (h > 0.01) {
          letter.style.color = lerpColor(h);
        } else {
          letter.style.color = "";
        }
      });

      animId = requestAnimationFrame(tick);
    };

    tick();

    // 4. Cleanup on unmount or route change
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [pathname]);

  return (
    <nav id="nav" className="nav-center">
      <div className="nav-left">
        <Link
          className={`nav-item ${pathname === "/" ? "active" : ""}`}
          data-page="index"
          href="/"
        >
          <div className="nav-word" data-word="HOME"></div>
        </Link>
        <Link
          className={`nav-item ${pathname === "/about" ? "active" : ""}`}
          data-page="about"
          href="/about"
        >
          <div className="nav-word" data-word="ABOUT"></div>
        </Link>
        <a
          className="nav-item"
          data-page="contact"
          href="mailto:ahz.nrm@gmail.com"
        >
          <div className="nav-word" data-word="CONTACT"></div>
        </a>
      </div>
      <div className="nav-tools">
        <ThemeToggle />
      </div>
    </nav>
  );
}