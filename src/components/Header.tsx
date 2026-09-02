import { catalog } from '../data/apps';

export function Header() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a className="brand" href="/" aria-label="Garage home">
          <img src="/logo_192.png" alt="" className="brand-mark" />
          <span className="brand-text">
            <strong>Garage</strong>
            <span className="brand-tagline">Where ideas start</span>
          </span>
        </a>
        <nav className="site-nav" aria-label="Primary">
          <a href={`https://${catalog.domain}`} className="nav-link">
            {catalog.domain}
          </a>
          <a
            href="https://github.com/dannyphillips/garage"
            className="nav-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source
          </a>
        </nav>
      </div>
    </header>
  );
}
