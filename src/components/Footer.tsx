import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        width: "100%",
        backgroundColor: "var(--footer-bg)",
        borderTop: "1px solid var(--footer-border)",
        padding: "28px 48px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        {/* Left Side: Copyright & Privacy Policy */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "12px",
            color: "var(--text-muted)",
          }}
        >
          <span>© {currentYear} · All rights reserved</span>
          <span>•</span>
          <Link
            href="/privacy"
            style={{
              color: "var(--text-3)",
              textDecoration: "none",
            }}
          >
            Privacy Policy
          </Link>
        </div>

        {/* Right Side: Social Links */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            fontSize: "12px",
            fontWeight: 500,
          }}
        >
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--text)",
              textDecoration: "none",
            }}
          >
            LinkedIn
          </a>

          <a
            href="https://www.behance.net/narminahmadza"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--text)",
              textDecoration: "none",
            }}
          >
            Behance
          </a>

          <a
            href="mailto:ahz.nrm@gmail.com"
            style={{
              color: "var(--text)",
              textDecoration: "none",
            }}
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}