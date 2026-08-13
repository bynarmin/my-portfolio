export default function Footer() {
  return (
    <footer className="footer footer-bordered">
      <div className="footer-love">
        Made with love by <em>Narmin</em>
      </div>
      <div className="footer-socials">
        <a 
  href="https://www.iubenda.com/privacy-policy/20188315"
  className="iubenda-white iubenda-noiframe iubenda-embed"
  title="Privacy Policy"
>
  Privacy Policy
</a>
        <a
          href="https://www.linkedin.com/in/narmin-ahmadzadeh/"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
          aria-label="LinkedIn"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="2" width="20" height="20" rx="3" />
            <path d="M7 10v7M7 7v.01M12 10v7M12 13a3 3 0 0 1 6 0v4" />
          </svg>
        </a>
        <a href="mailto:design@bynarmin.it" className="social-link" aria-label="Email">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m2 7 10 7 10-7" />
          </svg>
        </a>
      </div>
    </footer>
  );
}