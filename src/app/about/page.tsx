import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <>
      <div className="noise"></div>
      <div id="cur-ring"></div>

      <Navbar />

      <div className="page">
        <div className="about-layout">
          {/* LEFT — sticky portrait */}
          <div className="about-left">
            <div className="portrait-fill">
              <img
                src="/assets/portrait.jpg"
                alt="Narmin"
                className="portrait-img"
              />
            </div>
          </div>

          {/* RIGHT — content */}
          <div className="about-right" style={{ color: "#ffffff" }}>
            <div className="ar-title-block">
              <div className="ar-eyebrow">Senior Product Designer</div>
              <h1 className="ar-title">
                Narmin<span className="ar-dot">.</span>
              </h1>
              <p className="ar-intro">
              I design scalable systems and complex workflows turning ambiguous problems into clean, functional products.
              </p>
            </div>

            <div className="ar-section">
              <div className="ar-label">About</div>
              <div className="ar-bio">
                <p>
                  With over 6 years of experience across discovery, design, and delivery, I bridge user needs, 
                  business strategy, and technical feasibility. My background in Architectural Engineering gives 
                  me a unique foundation in systemic thinking,
                  I don't just design screens, I structure information and build end-to-end ecosystems that scale.
                  I integrate AI as an execution partner across my design process leveraging it to compress user research synthesis,
                   accelerate rapid prototyping, and automate design system documentation. Rather than replacing product judgment, 
                  AI amplifies my speed and decision making, allowing me to focus on high-leverage strategy and execution.
                </p>
              </div>
            </div>

            <div className="ar-section">
              <div className="ar-label">Experience</div>
              <div className="ar-exp-list">
                <div className="ar-exp-item">
                  <div className="ar-exp-meta">
                    <div className="ar-exp-company">ONEarth</div>
                    <div className="ar-exp-period">2024 — Present</div>
                  </div>
                  <div className="ar-exp-role">Senior Product Designer</div>
                </div>
                <div className="ar-exp-item">
                  <div className="ar-exp-meta">
                    <div className="ar-exp-company">Girolami s.r.l</div>
                    <div className="ar-exp-period">2022 — 2024</div>
                  </div>
                  <div className="ar-exp-role">Senior Product Designer</div>
                </div>
                <div className="ar-exp-item">
                  <div className="ar-exp-meta">
                    <div className="ar-exp-company">H-Digital</div>
                    <div className="ar-exp-period">2021 — 2022</div>
                  </div>
                  <div className="ar-exp-role">Product Designer</div>
                </div>
                <div className="ar-exp-item">
                  <div className="ar-exp-meta">
                    <div className="ar-exp-company">Lifebonder</div>
                    <div className="ar-exp-period">2019 — 2021</div>
                  </div>
                  <div className="ar-exp-role">Junior Product Designer</div>
                </div>
              </div>
            </div>

            <div className="ar-section">
              <div className="ar-label">Education</div>
              <div className="ar-edu-list">
                <div className="ar-edu-item">
                  <div className="ar-edu-meta">
                    <div className="ar-edu-school">
                      Sapienza Università di Roma
                    </div>
                    <div className="ar-edu-gpa">100 / 110</div>
                  </div>
                  <div className="ar-edu-degree">Master of Product Design</div>
                </div>
                <div className="ar-edu-item">
                  <div className="ar-edu-meta">
                    <div className="ar-edu-school">Azad University</div>
                    <div className="ar-edu-gpa">18 / 20</div>
                  </div>
                  <div className="ar-edu-degree">
                    Bachelor of Architectural Engineering
                  </div>
                </div>
              </div>
            </div>

            <div className="ar-bottom">
              <div className="ar-bottom-col">
                <div className="ar-label">Contact</div>
                <a href="mailto:ahz.nrm@gmail.com" className="ar-link">
                  ahz.nrm@gmail.com
                </a>
                <a
                  href="https://www.linkedin.com/in/narmin-ahmadzadeh/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ar-link"
                >
                  LinkedIn ↗
                </a>
                <a
                  href="https://calendly.com/ahz-nrm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ar-link"
                >
                  Schedule a call ↗
                </a>
              </div>

              <div className="ar-bottom-col">
                <div className="ar-label">Design tools</div>
                <div className="ar-list-item">Figma</div>
                <div className="ar-list-item">Notion / Documentation</div>
                <div className="ar-list-item">Cursor & Front-end Dev</div>
                <div className="ar-list-item">AI-Assisted Workflows</div>
                <div className="ar-list-item">Adobe Ps / Ai / Id</div>
              </div>

              <div className="ar-bottom-col">
                <div className="ar-label">DESIGN & STRATEGY</div>
                <div className="ar-list-item">Product Strategy</div>
                <div className="ar-list-item">Design Systems</div>
                <div className="ar-list-item">UX Research & Synthesis</div>
                <div className="ar-list-item">Wireframing & Prototyping</div>
                <div className="ar-list-item">Information Architecture</div>
              </div>

              <div className="ar-bottom-col">
                <div className="ar-label">Languages</div>
                <div className="ar-lang-row">
                  <span>English</span>
                  <span className="ar-lang-level">C1</span>
                </div>
                <div className="ar-lang-row">
                  <span>Italian</span>
                  <span className="ar-lang-level">C1</span>
                </div>
                <div className="ar-lang-row">
                  <span>Turkish</span>
                  <span className="ar-lang-level">C2</span>
                </div>
                <div className="ar-lang-row">
                  <span>Persian</span>
                  <span className="ar-lang-level">C2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}