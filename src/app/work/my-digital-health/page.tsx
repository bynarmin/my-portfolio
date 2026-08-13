import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MyDigitalHealth() {
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
                My Digital <em>Health</em>
              </h1>
              <p className="work-subtitle">
                A digital health platform designed to give users control over
                their personal health data — with a focus on clarity,
                accessibility, and long-term engagement.
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
                <span className="work-meta-value">
                  Web App Design — HealthTech
                </span>
              </div>
              <div className="work-meta-item">
                <span className="work-meta-label">Tools</span>
                <span className="work-meta-value">
                  Figma, Adobe Photoshop, Adobe Illustrator
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* COVER IMAGE */}
        <div className="work-img-full work-img-full--padded">
          <img
            src="/assets/MacBook.jpg"
            alt="My Digital Health — Overview"
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
                In the HealthTech space, most platforms are built for healthcare
                professionals, not the patient. The result is a dense,
                anxiety-inducing experience that is difficult for non-technical
                users to navigate.
              </p>
              <ul className="work-list">
                <li>Interfaces overloaded with uncontextualised clinical data</li>
                <li>No visual hierarchy in personal health dashboards</li>
                <li>
                  Accessibility overlooked despite the target audience including
                  elderly users
                </li>
                <li>
                  No consistent visual identity — each section felt like a
                  different product
                </li>
                <li>
                  High drop-off rate after the first login due to perceived
                  complexity
                </li>
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
                Redesign the experience with a human-centred,
                accessibility-first approach — treating WCAG 2.1 AA compliance as
                a project requirement, not an afterthought.
              </p>
              <ul className="work-list">
                <li>
                  Dashboard with clear hierarchy: critical data upfront, details
                  on demand
                </li>
                <li>
                  Medical yet warm visual identity that reduces health-related
                  anxiety
                </li>
                <li>WCAG 2.1 AA compliance as a core design requirement</li>
                <li>Progressive onboarding to reduce initial cognitive overload</li>
              </ul>
            </div>
          </div>
        </section>

        {/* UX STRATEGY */}
        <section className="work-section">
          <div className="work-section-inner">
            <h2 className="work-section-title work-section-title--full">
              UX Strategy
            </h2>
            <div className="work-three-col">
              <div className="work-strategy-card">
                <h3 className="work-card-title">User Research &amp; Personas</h3>
                <p className="work-card-text">
                  3 profiles identified: the chronic user, the preventive user,
                  and the caregiver.
                </p>
              </div>
              <div className="work-strategy-card">
                <h3 className="work-card-title">Accessibility-First Design</h3>
                <p className="work-card-text">
                  Validated against WCAG 2.1 AA: 4.5:1 contrast, visible focus
                  states, 44×44px touch targets.
                </p>
              </div>
              <div className="work-strategy-card">
                <h3 className="work-card-title">Dashboard Architecture</h3>
                <p className="work-card-text">
                  Follows progressive disclosure: key metrics upfront with
                  drill-down into history.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="work-img-full work-img-full--padded">
          <img
            src="/assets/Top Scene_01.png"
            alt="My Digital Health — Key screens"
            style={{ width: "100%", height: "auto" }}
          />
          <span className="img-caption">
            Platform overview · web app, mobile app, and admin dashboard
          </span>
        </div>

        {/* DESIGN SYSTEM */}
        <section className="work-section">
          <div className="work-section-inner">
            <h2 className="work-section-title work-section-title--full">
              Design System
            </h2>
          </div>
        </section>

        <div className="work-img-grid">
          <div>
            <img
              src="/assets/Typography & Colors.jpg"
              alt="Design system typography"
              style={{ width: "100%", height: "auto" }}
            />
            <span className="img-caption">Colour palette &amp; typography scale</span>
          </div>
          <div>
            <img
              src="/assets/UI components.jpg"
              alt="UI components library"
              style={{ width: "100%", height: "auto" }}
            />
            <span className="img-caption">Component library</span>
          </div>
        </div>

        {/* KEY SCREENS GRID */}
        <div className="work-img-grid" style={{ marginTop: "40px" }}>
          <div>
            <img
              src="/assets/Home full.jpg"
              alt="Dashboard view"
              style={{ width: "100%", height: "auto" }}
            />
            <span className="img-caption">Dashboard summary</span>
          </div>
          <div>
            <img
              src="/assets/Misurazioni. visualizza Analysis.jpg"
              alt="Health analysis"
              style={{ width: "100%", height: "auto" }}
            />
            <span className="img-caption">Trend analysis &amp; charts</span>
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
                  WCAG 2.1 AA compliance verified across all interactive
                  components. Onboarding completion rate significantly improved.
                </p>
              </div>
              <div className="work-col-body">
                <h3 className="work-card-title">Learnings</h3>
                <p className="work-body-text">
                  Progressive disclosure became the foundation of every design
                  decision in the later stages of the project.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* NEXT PROJECT */}
        <div className="work-next">
          <span className="work-next-label">Next project</span>
          <a href="/work/cat-me" className="work-next-link">
            <span className="work-next-name">
              Cat <em>Me</em>
            </span>
            <span className="work-next-arrow">↗</span>
          </a>
        </div>
      </div>

      <Footer />
    </>
  );
}