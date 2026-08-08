import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="noise"></div>
      <div id="cur-ring"></div>
      <div id="nav-mount"></div>

      <div className="page">
        {/* ══ HERO ══════════════════════════════════ */}
        <main className="main">
          <div className="marquee-wrap" aria-hidden="true">
            <div className="marquee-inner">
              <span>Design.</span>
              <span>Design.</span>
              <span>Design.</span>
              <span>Design.</span>
              <span>Design.</span>
              <span>Design.</span>
            </div>
          </div>

          <div className="hello-tag">AI-Powered Product Design</div>

          <h1 className="headline">
            <div className="hl-stack">
              <div className="hl-row">
                <span className="hl-word" data-text="I'm">
                  I'm
                </span>
                <span className="hl-sep">·</span>
                <span className="hl-word" data-text="Narmin">
                  Narmin
                </span>
              </div>
              <div className="hl-row">
                <span className="hl-word" data-text="Lead">
                  Lead
                </span>
                <span className="hl-sep">·</span>
                <span className="hl-word" data-text="Product">
                  Product
                </span>
                <span className="hl-sep">·</span>
                <span className="hl-word" data-text="Designer">
                  Designer
                </span>
              </div>
            </div>
          </h1>

          <div className="hero-body">
            <p>
              A product designer who uses <em>AI to amplify</em> every stage —
              from research and ideation to <em>final pixel</em>.
            </p>
          </div>
        </main>

        {/* ══ PROJECTS ═══════════════════════════════ */}
        <section className="projects-section">
          <div className="section-header">
            <div className="section-label">Selected Projects</div>
            <div className="section-count">(06)</div>
          </div>

          <a
            href="https://tenuta-belvedere-manaro.myshopify.com/pages/chi-siamo"
            target="_blank"
            rel="noopener noreferrer"
            className="project-row"
          >
            <div className="proj-name">
              Tenuta Belvedere <span className="proj-italic">e-commerce</span>
            </div>
            <div className="proj-arrow">↗</div>
          </a>

          <Link href="/website-redesign" className="project-row">
            <div className="proj-name">
              Website Redesign <span className="proj-italic">website design</span>
            </div>
            <div className="proj-arrow">↗</div>
          </Link>

          <a
            href="https://arrostostudio.com"
            target="_blank"
            rel="noopener noreferrer"
            className="project-row"
          >
            <div className="proj-name">
              Arrosto Studio <span className="proj-italic">e-commerce</span>
            </div>
            <div className="proj-arrow">↗</div>
          </a>

          <Link href="/my-digital-health" className="project-row">
            <div className="proj-name">
              My Digital Health <span className="proj-italic">app design</span>
            </div>
            <div className="proj-arrow">↗</div>
          </Link>

          <Link href="/cat-me" className="project-row">
            <div className="proj-name">
              Cat Me <span className="proj-italic">community design</span>
            </div>
            <div className="proj-arrow">↗</div>
          </Link>

          <Link href="/bizim-tarla" className="project-row">
            <div className="proj-name">
              Bizim Tarla <span className="proj-italic">e-commerce + app</span>
            </div>
            <div className="proj-arrow">↗</div>
          </Link>
        </section>
      </div>

      <div id="footer-mount"></div>
    </>
  );
}