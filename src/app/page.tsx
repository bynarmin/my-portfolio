import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroJourney from "@/components/HeroJourney";

export default function Home() {
  return (
    <>
      <div className="noise"></div>
      <div id="cur-ring"></div>

      {/* Reusable Navbar */}
      <Navbar />

      <div className="page">
        <HeroJourney />

        <section className="projects-section" id="work">
          <div className="section-header">
            <div className="section-label">Selected Projects</div>
            <div className="section-count">(06)</div>
          </div>

          {/* Project 1 */}
          <a
            href="https://tenuta-belvedere-manaro.myshopify.com/pages/chi-siamo"
            target="_blank"
            rel="noopener noreferrer"
            className="project-row"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div className="proj-name">Tenuta Belvedere</div>
              <p className="proj-desc-text" style={{ fontSize: '13px', margin: 0, fontWeight: 400, color: 'var(--text-muted)', opacity: 0.7 }}>
                Tailored online shop designed to improve checkout flow and highlight brand identity.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span className="proj-italic" style={{ fontSize: '15px' }}>
                E-commerce & Brand
              </span>
              <div className="proj-arrow">↗</div>
            </div>
          </a>

          {/* Project 2 */}
          <Link 
            href="/work/website-redesign" 
            className="project-row"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div className="proj-name">Website Redesign</div>
              <p className="proj-desc-text" style={{ fontSize: '13px', margin: 0, fontWeight: 400, color: 'var(--text-muted)', opacity: 0.7 }}>
                End-to-end patient onboarding, health tracking dashboards, and accessible mobile UX.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span className="proj-italic" style={{ fontSize: '15px' }}>
                Web Platform & Design System
              </span>
              <div className="proj-arrow">↗</div>
            </div>
          </Link>

          {/* Project 3 */}
          <a
            href="https://arrostostudio.com"
            target="_blank"
            rel="noopener noreferrer"
            className="project-row"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div className="proj-name">Arrosto Studio</div>
              <p className="proj-desc-text" style={{ fontSize: '13px', margin: 0, fontWeight: 400, color: 'var(--text-muted)', opacity: 0.7 }}>
                High-converting setup with modular UI components and tailored checkout experience.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span className="proj-italic" style={{ fontSize: '15px' }}>
                E-commerce Strategy
              </span>
              <div className="proj-arrow">↗</div>
            </div>
          </a>

          {/* Project 4 */}
          <Link 
            href="/work/my-digital-health" 
            className="project-row"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div className="proj-name">My Digital Health</div>
              <p className="proj-desc-text" style={{ fontSize: '13px', margin: 0, fontWeight: 400, color: 'var(--text-muted)', opacity: 0.7 }}>
                Complex portal simplifying patient care management, onboarding, and health tracking dashboards.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span className="proj-italic" style={{ fontSize: '15px' }}>
                SaaS & Digital Health
              </span>
              <div className="proj-arrow">↗</div>
            </div>
          </Link>

          {/* Project 5 */}
          <Link 
            href="/work/cat-me" 
            className="project-row"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div className="proj-name">Cat Me</div>
              <p className="proj-desc-text" style={{ fontSize: '13px', margin: 0, fontWeight: 400, color: 'var(--text-muted)', opacity: 0.7 }}>
                End-to-end mobile UX connecting local pet owners with intuitive discovery and interaction flows.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span className="proj-italic" style={{ fontSize: '15px' }}>
                Mobile App & Community
              </span>
              <div className="proj-arrow">↗</div>
            </div>
          </Link>

          {/* Project 6 */}
          <Link 
            href="/work/bizim-tarla" 
            className="project-row"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div className="proj-name">Bizim Tarla</div>
              <p className="proj-desc-text" style={{ fontSize: '13px', margin: 0, fontWeight: 400, color: 'var(--text-muted)', opacity: 0.7 }}>
                Cross-platform fresh produce delivery service
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span className="proj-italic" style={{ fontSize: '15px' }}>
                e-commerce + app
              </span>
              <div className="proj-arrow">↗</div>
            </div>
          </Link>
        </section>
      </div>

      {/* Reusable Footer */}
      <Footer />
    </>
  );
}