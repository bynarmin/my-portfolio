import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function WebsiteRedesign() {
  return (
    <>
      <div className="noise"></div>
      <div id="cur-ring"></div>

      <Navbar />

      <div className="page work-page">
        {/* HERO */}
        <header className="work-hero">
          <div className="work-hero-inner">
            <div className="work-hero-title-wrap">
              <h1 className="work-title">Website Redesign</h1>
              <p className="work-subtitle">
                A strategic UX/UI redesign focused on improving information
                architecture, consistency, and development efficiency through a
                scalable design system.
              </p>
            </div>

            <div className="work-meta-top">
              <div className="work-meta-item">
                <span className="work-meta-label">Role</span>
                <span className="work-meta-value">Product Designer</span>
              </div>
              <div className="work-meta-item">
                <span className="work-meta-label">Timeline</span>
                <span className="work-meta-value">6 months</span>
              </div>
              <div className="work-meta-item">
                <span className="work-meta-label">Type</span>
                <span className="work-meta-value">
                  Full service website redesign
                </span>
              </div>
              <div className="work-meta-item">
                <span className="work-meta-label">Tools</span>
                <span className="work-meta-value">Figma, Notion, VS Code</span>
              </div>
            </div>
          </div>
        </header>

        {/* HERO IMAGE */}
        <div className="work-img-full work-img-full--padded">
          <img
            src="/assets/portfolio-mockup-laptop 1.png"
            alt="Website Redesign — MacBook device mockup"
            style={{ width: "100%", height: "auto" }}
          />
        </div>

        {/* THE CHALLENGE */}
        <section className="work-section">
          <div className="work-section-inner work-two-col">
            <div className="work-col-label">
              <h2 className="work-section-title">The challenge</h2>
            </div>
            <div className="work-col-body">
              <p className="work-body-text">
                The existing website lacked structure, consistency and
                scalability. Its components were not standardized, leading to a
                slow and inconsistent experience across browsers and devices.
              </p>
              <ul className="work-list">
                <li>No unified component system</li>
                <li>Inconsistent typography and spacing</li>
                <li>Weak hierarchy in content-heavy sections</li>
                <li>Absent design tokens for naming documentation</li>
                <li>Hard to maintain for non-technical teams</li>
              </ul>
            </div>
          </div>
        </section>

        {/* SOLUTION */}
        <section className="work-section">
          <div className="work-section-inner work-two-col">
            <div className="work-col-label">
              <h2 className="work-section-title">Solution</h2>
            </div>
            <div className="work-col-body">
              <p className="work-body-text">
                The objective was to redesign the website with a system-first
                approach that would:
              </p>
              <ul className="work-list">
                <li>Improve content hierarchy and readability</li>
                <li>Establish a modular component system</li>
                <li>
                  Reduce design-to-development gap and implementation cost
                </li>
                <li>Simplify future maintainability</li>
              </ul>
            </div>
          </div>
        </section>

        {/* RESPONSIVE LAYOUT IMAGE */}
        <div className="work-img-full work-img-full--padded">
          <img
            src="/assets/Screenshot 2026-02-14 at 18.07.11 1.png"
            alt="Website Redesign — Responsive layout overview"
            style={{ width: "100%", height: "auto" }}
          />
          <span className="img-caption">
            Responsive layout · desktop, tablet and mobile breakpoints
          </span>
        </div>

        {/* UX STRATEGY */}
        <section className="work-section">
          <div className="work-section-inner">
            <h2 className="work-section-title work-section-title--full">
              UX Strategy
            </h2>
            <div className="work-three-col">
              <div className="work-strategy-card">
                <h3 className="work-card-title">Information Architecture</h3>
                <p className="work-card-text">
                  Audited the existing site structure, mapping content to user
                  goals and business objectives. Restructured responsive layout
                  for the site instead of repeating it per page length.
                </p>
              </div>
              <div className="work-strategy-card">
                <h3 className="work-card-title">Simplified Navigation</h3>
                <p className="work-card-text">
                  Simplified navigation patterns to reduce cognitive load and
                  improve discoverability of key sections.
                </p>
              </div>
              <div className="work-strategy-card">
                <h3 className="work-card-title">
                  Design System & Technical Foundations
                </h3>
                <p className="work-card-text">
                  Established design tokens and reusable component libraries to
                  streamline handoff and ongoing updates.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* UX IMAGES GRID */}
        <div className="work-img-grid" style={{ padding: "0 80px" }}>
          <div>
            <img
              src="https://res.cloudinary.com/dz05xejqo/image/upload/v1773745600/SiteMap_fqhrsy.jpg"
              alt="SiteMap"
              style={{ width: "100%", height: "auto" }}
            />
            <span className="img-caption">SiteMap</span>
          </div>
          <div>
            <img
              src="https://res.cloudinary.com/dz05xejqo/image/upload/v1773745750/SiteMap_ayqmpj.jpg"
              alt="Mind Map"
              style={{ width: "100%", height: "auto" }}
            />
            <span className="img-caption">Mind Map</span>
          </div>
        </div>

        {/* DESIGN SYSTEM */}
        <section className="work-section">
          <div className="work-section-inner">
            <h2 className="work-section-title work-section-title--full">
              Design System
            </h2>
          </div>
        </section>

        <div className="work-img-full work-img-full--padded">
          <img
            src="/assets/Screenshot 2026-02-14 at 18.00.21 1.png"
            alt="Website Redesign — Design system"
            style={{ width: "100%", height: "auto" }}
          />
          <span className="img-caption">
            Design system overview · colour tokens, typography, button variants
            · 2026
          </span>
        </div>

        {/* FOUNDATION & COMPONENT ARCHITECTURE */}
        <section className="work-section">
          <div className="work-section-inner work-two-col">
            <div className="work-col-label">
              <h2 className="work-section-title">Foundation</h2>
            </div>
            <div className="work-col-body">
              <p className="work-body-text">
                Established core foundations focusing on color tokens,
                typography scale, spacing system (8px grid), and responsive
                breakpoints.
              </p>
            </div>
          </div>
        </section>

        <section className="work-section">
          <div className="work-section-inner work-two-col">
            <div className="work-col-label">
              <h2 className="work-section-title">Component Architecture</h2>
            </div>
            <div className="work-col-body">
              <p className="work-body-text">
                Developed 40+ reusable UI components (14+ shared, 20+ for UX
                library) with a clear hierarchy: atoms → molecules → organisms →
                groups.
              </p>
            </div>
          </div>
        </section>

        <div className="work-img-full work-img-full--padded">
          <img
            src="/assets/Group 39877.png"
            alt="Website Redesign — Figma design tokens"
            style={{ width: "100%", height: "auto" }}
          />
          <span className="img-caption">
            Design tokens · colour, spacing and typography variables in Figma ·
            2026
          </span>
        </div>

        {/* SCALABILITY */}
        <section className="work-section work-section--accent">
          <div className="work-section-inner">
            <h2 className="work-section-title work-section-title--full">
              Scalability &amp; Figma Optimization
            </h2>
            <div className="work-two-col work-two-col--mt">
              <div className="work-col-body">
                <h3 className="work-card-title">Key Improvements</h3>
                <p className="work-body-text">
                  The redesign improved user clarity by establishing a
                  consistent visual system with a proper typographic hierarchy,
                  allowing users to scan and navigate pages with ease.
                </p>
              </div>
              <div className="work-col-body">
                <h3 className="work-card-title">Impact &amp; Outcomes</h3>
                <p className="work-body-text">
                  The new system reduced design-to-development inconsistencies.
                  The aligned design-to-code system made it easier to build new
                  features across all the website.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* NEXT PROJECT */}
        <div className="work-next">
          <span class="work-next-label">Next project</span>
          <a href="/work/my-digital-health" className="work-next-link">
            <span className="work-next-name">
              My Digital <em>Health</em>
            </span>
            <span className="work-next-arrow">↗</span>
          </a>
        </div>
      </div>

      <Footer />
    </>
  );
}