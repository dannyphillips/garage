import { useMemo, useState } from 'react';
import { catalog, categoryLabels } from './data/apps';
import type { AppCategory } from './types/app';
import { AppCard } from './components/AppCard';
import { FeaturedRow } from './components/FeaturedRow';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { StatsBar } from './components/StatsBar';
import './App.css';

type FilterCategory = 'all' | AppCategory;

function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<FilterCategory>('all');

  const featuredApps = useMemo(
    () => catalog.apps.filter((app) => app.featured),
    [],
  );

  const filteredApps = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return catalog.apps.filter((app) => {
      const matchesCategory =
        category === 'all' || app.category === category;

      if (!normalizedQuery) {
        return matchesCategory;
      }

      const haystack = [
        app.name,
        app.tagline,
        app.description,
        ...app.tags,
      ]
        .join(' ')
        .toLowerCase();

      return matchesCategory && haystack.includes(normalizedQuery);
    });
  }, [category, query]);

  const categories = Object.keys(categoryLabels) as FilterCategory[];

  return (
    <div className="garage">
      <div className="ambient-glow" aria-hidden="true" />
      <Header />
      <main className="garage-main">
        <Hero
          appCount={catalog.apps.length}
          domain={catalog.domain}
          query={query}
          onQueryChange={setQuery}
        />

        <StatsBar apps={catalog.apps} />

        {featuredApps.length > 0 && !query && category === 'all' && (
          <FeaturedRow apps={featuredApps} />
        )}

        <section className="catalog" aria-labelledby="catalog-heading">
          <div className="catalog-header">
            <div>
              <h2 id="catalog-heading">Browse</h2>
              <p className="catalog-subtitle">
                {filteredApps.length}{' '}
                {filteredApps.length === 1 ? 'app' : 'apps'}
                {query ? ` matching “${query}”` : ''}
              </p>
            </div>

            <div
              className="category-tabs"
              role="tablist"
              aria-label="Filter by category"
            >
              {categories.map((value) => (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={category === value}
                  className={
                    category === value
                      ? 'category-tab active'
                      : 'category-tab'
                  }
                  onClick={() => setCategory(value)}
                >
                  {categoryLabels[value]}
                </button>
              ))}
            </div>
          </div>

          {filteredApps.length > 0 ? (
            <ul className="app-grid">
              {filteredApps.map((app) => (
                <li key={app.id}>
                  <AppCard app={app} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <p>No apps match your search.</p>
              <button
                type="button"
                className="text-button"
                onClick={() => {
                  setQuery('');
                  setCategory('all');
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </section>
      </main>
      <Footer domain={catalog.domain} subdomain={catalog.appsSubdomain} />
    </div>
  );
}

export default App;
