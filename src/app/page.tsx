import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <div className="noise"></div>
      <div id="cur-ring"></div>

      {/* Reusable Navbar */}
      <Navbar />

      <div className="page">
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

          <div className="hello-tag">Senior Product Designer</div>

          <h1 className="headline">
            <div className="hl-stack">
              <div className="hl-row">
                <span className="hl-word" data-text="I'm">
                  I
                </span>
                <span className="hl-sep">·</span>
                <span className="hl-word" data-text="Narmin">
                  Design
                </span>
              </div>
              <div className="hl-row">
                <span className="hl-word" data-text="Lead">
                  Digital Products
                </span>
                <span className="hl-sep">·</span>
                <span className="hl-word" data-text="Product">
                  that
                </span>
                <span className="hl-sep">·</span>
                <span className="hl-word" data-text="Designer">
                  scale
                </span>
              </div>
            </div>
          </h1>

          <div className="hero-body">
            
<p className="font-mono text-lg md:text-xl font-normal text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl mt-4">
  Senior Product & Service Designer. 
  With 6 years of experience and a foundation in architecture, I build intuitive interfaces, robust design systems, and end-to-end user journeys.
</p>
          </div>
        </main>

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

          <Link href="/work/website-redesign" className="project-row">
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

          <Link href="/work/my-digital-health" className="project-row">
            <div className="proj-name">
              My Digital Health <span className="proj-italic">app design</span>
            </div>
            <div className="proj-arrow">↗</div>
          </Link>

          <Link href="/work/cat-me" className="project-row">
            <div className="proj-name">
              Cat Me <span className="proj-italic">community design</span>
            </div>
            <div className="proj-arrow">↗</div>
          </Link>

          <Link href="/work/bizim-tarla" className="project-row">
            <div className="proj-name">
              Bizim Tarla <span className="proj-italic">e-commerce + app</span>
            </div>
            <div className="proj-arrow">↗</div>
          </Link>
        </section>
      </div>

      {/* Reusable Footer */}
      <Footer />
    </>
  );
}