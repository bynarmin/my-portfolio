"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  useEffect(() => {
    // Build magnetic letter spans
    const words = document.querySelectorAll(".nav-word");
    words.forEach((word) => {
      const target = word as HTMLElement;
      const text = target.dataset.word || "";
      target.innerHTML = "";
      text.split("").forEach((ch) => {
        const span = document.createElement("span");
        span.className = "nav-letter";
        span.textContent = ch;
        target.appendChild(span);
      });
    });

    // Magnetic animation loop
    let mx = -200, my = -200;
    const RADIUS = 90, STRENGTH = 0.45, LERP_T = 0.085;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const lerpColorMuted = (t: number) =>
      `rgb(${Math.round(lerp(120, 220, t))},${Math.round(lerp(120, 0, t))},${Math.round(lerp(120, 0, t))})`;

    const handleMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const letters = Array.from(
      document.querySelectorAll(".nav-letter")
    ) as HTMLElement[];
    const states = letters.map(() => ({ x: 0, y: 0, heat: 0 }));

    let animId: number;
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

        letter.style.transform = `translate(${states[i].x.toFixed(2)}px,${states[i].y.toFixed(2)}px)`;
        const h = states[i].heat;
        if (h > 0.01) {
          letter.style.color = lerpColorMuted(h);
        } else {
          letter.style.color = "";
        }
      });
      animId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [pathname]);

  return (
    <nav id="nav" className="nav-center">
      <div className="nav-left">
        <Link className={`nav-item ${pathname === "/" ? "active" : ""}`} data-page="index" href="/">
          <div className="nav-word" data-word="HOME"></div>
        </Link>
        <Link className={`nav-item ${pathname === "/about" ? "active" : ""}`} data-page="about" href="/about">
          <div className="nav-word" data-word="ABOUT"></div>
        </Link>
        <a className="nav-item" data-page="contact" href="mailto:design@bynarmin.it">
          <div className="nav-word" data-word="CONTACT"></div>
        </a>
      </div>
    </nav>
  );
}