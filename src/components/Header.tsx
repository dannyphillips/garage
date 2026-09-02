import { catalog } from '../data/apps';

interface HeaderProps {
  query: string;
  onQueryChange: (value: string) => void;
}

export function Header({ query, onQueryChange }: HeaderProps) {
  return (
    <header className="store-header">
      <div className="store-header-inner">
        <a className="store-brand" href="/" aria-label="Garage home">
          <img src="/logo_192.png" alt="" className="store-brand-mark" />
          <span>Garage</span>
        </a>

        <label className="store-search" htmlFor="store-search-input">
          <svg
            className="store-search-icon"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M7 12A5 5 0 1 0 7 2a5 5 0 0 0 0 10Zm0 1.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13Z"
              fill="currentColor"
            />
            <path
              d="M11.5 11.5 14 14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <input
            id="store-search-input"
            type="search"
            placeholder="Games, utilities, experiments…"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            autoComplete="off"
          />
        </label>
      </div>
    </header>
  );
}

export function StoreNav() {
  return (
    <nav className="store-nav" aria-label="Quick links">
      <a href={`https://${catalog.appsSubdomain}.${catalog.domain}`}>Apps</a>
      <a href={`https://${catalog.domain}`}>{catalog.domain}</a>
      <a href="https://dannyphillips.me">About</a>
    </nav>
  );
}
