import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        width: "100%",
        backgroundColor: "#0d0d0d",
        borderTop: "1px solid #1a1a1a",
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
            color: "#777777",
          }}
        >
          <span>© {currentYear} · All rights reserved</span>
          <span>•</span>
          <Link
            href="/privacy"
            style={{
              color: "#999999",
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
              color: "#ffffff",
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
              color: "#ffffff",
              textDecoration: "none",
            }}
          >
            Behance
          </a>

          <a
            href="mailto:design@bynarmin.it"
            style={{
              color: "#ffffff",
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