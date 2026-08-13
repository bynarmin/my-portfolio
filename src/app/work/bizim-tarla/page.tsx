import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function BizimTarla() {
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
                Bizim <em>Tarla</em>
              </h1>
              <p className="work-subtitle">
                An e-commerce and brand digital experience redesign for a leading regional food products brand — connecting tradition, product authenticity, and modern online shopping.
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
                <span className="work-meta-value">E-commerce & Brand Experience</span>
              </div>
              <div className="work-meta-item">
                <span className="work-meta-label">Tools</span>
                <span className="work-meta-value">Figma, Adobe Photoshop, Illustrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* COVER IMAGE */}
        <div className="work-img-full work-img-full--padded">
          <img
            src="/assets/bizim_tarla_cover.jpg"
            alt="Bizim Tarla — Digital experience overview"
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
                Bizim Tarla is a trusted brand known for natural food products. However, their digital presence did not reflect the quality of their physical products, resulting in low online engagement and complex purchase flows.
              </p>
              <ul className="work-list">
                <li>Outdated e-commerce layout that felt disconnected from the brand identity</li>
                <li>Friction in product discovery and catalog filter usability</li>
                <li>Inconsistent mobile responsive behavior across product detail pages</li>
                <li>Lack of storytelling around product origins and quality assurance</li>
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
                Designed an intuitive, visual-first e-commerce interface that pairs rich brand storytelling with an efficient shopping journey.
              </p>
              <ul className="work-list">
                <li>Streamlined product navigation with smart category filtering</li>
                <li>Warm, natural color palette reinforcing brand authenticity</li>
                <li>Optimized 3-step checkout experience to reduce drop-offs</li>
                <li>Reusable component system for seasonal promotions and dynamic banners</li>
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
                <h3 className="work-card-title">Customer Research</h3>
                <p className="work-card-text">
                  Identified key customer motivations: quick re-ordering, transparent ingredient lists, and confidence in product freshness.
                </p>
              </div>
              <div className="work-strategy-card">
                <h3 className="work-card-title">Catalog Architecture</h3>
                <p className="work-card-text">
                  Reorganized product categories based on usage occasions (breakfast, cooking essentials, preserves) rather than technical production lines.
                </p>
              </div>
              <div className="work-strategy-card">
                <h3 className="work-card-title">Mobile-First Checkout</h3>
                <p className="work-card-text">
                  Designed sticky CTA bars and one-thumb interaction models for mobile shoppers to complete orders effortlessly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* KEY SCREENS / DESIGN SHOWCASE */}
        <section className="work-section">
          <div className="work-section-inner">
            <h2 className="work-section-title work-section-title--full">
              Key Screens
            </h2>
          </div>
        </section>

        <div className="work-img-grid">
          <div>
            <img
              src="/assets/bizim_tarla_home.jpg"
              alt="Bizim Tarla — Homepage layout"
              style={{ width: "100%", height: "auto" }}
            />
            <span className="img-caption">Homepage · Brand narrative &amp; featured products</span>
          </div>
          <div>
            <img
              src="/assets/bizim_tarla_pdp.jpg"
              alt="Bizim Tarla — Product Detail Page"
              style={{ width: "100%", height: "auto" }}
            />
            <span className="img-caption">Product detail · Nutritional values &amp; quick add</span>
          </div>
        </div>

        {/* IMPACT & OUTCOMES */}
        <section className="work-section work-section--accent">
          <div className="work-section-inner">
            <h2 className="work-section-title work-section-title--full">
              Impact &amp; Outcomes
            </h2>
            <div className="work-two-col work-two-col--mt">
              <div className="work-col-body">
                <h3 className="work-card-title">Results</h3>
                <p className="work-body-text">
                  Modernized the brand's digital presence while significantly reducing mobile checkout friction and improving product discoverability.
                </p>
              </div>
              <div className="work-col-body">
                <h3 className="work-card-title">Learnings</h3>
                <p className="work-body-text">
                  Balancing high-quality promotional visuals with fast load times required strict image optimization guidelines integrated directly into the design system handoff.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* NEXT PROJECT */}
        <div className="work-next">
          <span className="work-next-label">Next project</span>
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