import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CatMe() {
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
              <h1 className="work-title">
                Cat <em>Me</em>
              </h1>
              <p className="work-subtitle">
                A mobile app designed to help cat owners track health, behaviour,
                and care routines — with a focus on emotional connection and
                daily usability.
              </p>
            </div>

            <div className="work-meta-top">
              <div className="work-meta-item">
                <span className="work-meta-label">Role</span>
                <span className="work-meta-value">Product Designer</span>
              </div>
              <div className="work-meta-item">
                <span className="work-meta-label">Timeline</span>
                <span className="work-meta-value">—</span>
              </div>
              <div className="work-meta-item">
                <span className="work-meta-label">Type</span>
                <span className="work-meta-value">Mobile App Design — iOS</span>
              </div>
              <div className="work-meta-item">
                <span className="work-meta-label">Tools</span>
                <span className="work-meta-value">Figma, Adobe Photoshop</span>
              </div>
            </div>
          </div>
        </header>

        {/* COVER IMAGE */}
        <div className="work-img-full work-img-full--padded">
          <img
            src="/assets/27_May_04.png"
            alt="Cat Me — App overview"
            style={{ width: "100%", height: "auto" }}
          />
        </div>

        {/* THE CHALLENGE & SOLUTION */}
        <section className="work-section">
          <div className="work-section-inner work-two-col">
            <div className="work-col-label">
              <h2 className="work-section-title">The challenge</h2>
            </div>
            <div className="work-col-body">
              <p className="work-body-text">
                The pet care app market is fragmented and generic. Cat owners
                struggle to find a tool built around feline behaviour patterns.
              </p>
              <ul className="work-list">
                <li>No app combined health tracking with emotional connection</li>
                <li>Interfaces were designed primarily for dogs</li>
                <li>Difficulty communicating health conditions to vets</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="work-section">
          <div className="work-section-inner work-two-col">
            <div className="work-col-label">
              <h2 className="work-section-title">Solution</h2>
            </div>
            <div className="work-col-body">
              <p className="work-body-text">
                Centralise health, habits, and personality in one interface with a
                warm, caring visual language.
              </p>
              <ul className="work-list">
                <li>4-tab structure optimized for one-handed use</li>
                <li>Adaptive daily logs based on owner habits</li>
                <li>Scalable architecture toward community features</li>
              </ul>
            </div>
          </div>
        </section>

        {/* DESIGN SYSTEM IMAGE */}
        <div className="work-img-full work-img-full--padded">
          <img
            src="/assets/cat_me_design_system_board-html-05-08-2026_10_14_AM.png"
            alt="Cat Me — Design system"
            style={{ width: "100%", height: "auto" }}
          />
          <span className="img-caption">
            Design system · palette, components, typography
          </span>
        </div>

        {/* KEY SCREENS */}
        <div className="work-img-grid" style={{ marginTop: "40px" }}>
          <div>
            <img
              src="/assets/iPhone 12 Pro_01.jpg"
              alt="Cat Me — Onboarding flow"
              style={{ width: "100%", height: "auto" }}
            />
            <span className="img-caption">Onboarding &amp; Profile flow</span>
          </div>
          <div>
            <img
              src="/assets/iPhone 12 Pro 3.jpg"
              alt="Cat Me — Map view"
              style={{ width: "100%", height: "auto" }}
            />
            <span className="img-caption">Map view &amp; community pins</span>
          </div>
        </div>

        {/* IMPACT */}
        <section className="work-section work-section--accent">
          <div className="work-section-inner">
            <h2 className="work-section-title work-section-title--full">
              Impact &amp; Outcomes
            </h2>
            <div className="work-two-col work-two-col--mt">
              <div className="work-col-body">
                <h3 className="work-card-title">Results</h3>
                <p className="work-body-text">
                  Highly positive feedback on clarity and emotional resonance from
                  early testers.
                </p>
              </div>
              <div className="work-col-body">
                <h3 className="work-card-title">Learnings</h3>
                <p className="work-body-text">
                  Testing revealed users preferred 3 core parameters over 7
                  heavy inputs. An adaptive log resolved daily friction.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* NEXT PROJECT */}
        <div className="work-next">
          <span className="work-next-label">Next project</span>
          <a href="/work/website-redesign" className="work-next-link">
            <span className="work-next-name">
              Website <em>Redesign</em>
            </span>
            <span className="work-next-arrow">↗</span>
          </a>
        </div>
      </div>

      <Footer />
    </>
  );
}