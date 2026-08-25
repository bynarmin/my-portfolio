import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div
      style={{
        backgroundColor: "#000000",
        color: "#ffffff",
        minHeight: "100vh",
        padding: "80px 24px",
        fontFamily: "monospace",
      }}
    >
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <Link
          href="/"
          style={{
            fontSize: "12px",
            color: "#888888",
            textDecoration: "none",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          ← Back to Home
        </Link>

        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            marginTop: "32px",
            marginBottom: "8px",
            letterSpacing: "-0.02em",
          }}
        >
          Privacy Policy
        </h1>
        <p style={{ fontSize: "12px", color: "#666666", marginBottom: "40px" }}>
          Last updated: August 2026
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          <section>
            <h2 style={{ fontSize: "14px", fontWeight: 600, color: "#ffffff", marginBottom: "8px" }}>
              1. Overview
            </h2>
            <p style={{ fontSize: "13px", color: "#aaaaaa", lineHeight: "1.6", margin: 0 }}>
              This personal portfolio website operates as a showcase of design work. Your privacy is respected, and no personal data is collected or tracked automatically when visiting this site.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "14px", fontWeight: 600, color: "#ffffff", marginBottom: "8px" }}>
              2. Cookies & Analytics
            </h2>
            <p style={{ fontSize: "13px", color: "#aaaaaa", lineHeight: "1.6", margin: 0 }}>
              This website does not use tracking cookies, Google Analytics, or third-party advertising trackers. Essential technical session cookies may be processed automatically by hosting infrastructure solely to deliver web content securely.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "14px", fontWeight: 600, color: "#ffffff", marginBottom: "8px" }}>
              3. Direct Contact
            </h2>
            <p style={{ fontSize: "13px", color: "#aaaaaa", lineHeight: "1.6", margin: 0 }}>
              If you choose to reach out via email, your email address and message details will be used exclusively to reply to your inquiry and will never be shared or sold to third parties.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "14px", fontWeight: 600, color: "#ffffff", marginBottom: "8px" }}>
              4. External Links
            </h2>
            <p style={{ fontSize: "13px", color: "#aaaaaa", lineHeight: "1.6", margin: 0 }}>
              This site contains links to external platforms (such as LinkedIn, Pinterest, and live project URL previews). Third-party sites maintain their own independent privacy policies.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}