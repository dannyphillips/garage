interface HeroProps {
  appCount: number;
  domain: string;
  query: string;
  onQueryChange: (value: string) => void;
}

export function Hero({
  appCount,
  domain,
  query,
  onQueryChange,
}: HeroProps) {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero-copy">
        <p className="hero-eyebrow">Personal App Store</p>
        <h1 id="hero-heading">
          Every app in the{' '}
          <span className="hero-accent">garage</span>, one tap away
        </h1>
        <p className="hero-description">
          A curated index of side projects and experiments hosted on{' '}
          <code>{domain}</code>. Each app lives on its own subdomain — browse,
          discover, and jump straight in.
        </p>
        <p className="hero-meta">{appCount} apps · updated regularly</p>
      </div>

      <label className="search-field" htmlFor="app-search">
        <span className="search-icon" aria-hidden="true">
          ⌕
        </span>
        <input
          id="app-search"
          type="search"
          placeholder="Search apps, tags, or descriptions"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          autoComplete="off"
        />
      </label>
    </section>
  );
}
