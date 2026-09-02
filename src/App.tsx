import { useMemo, useState } from 'react';
import { catalog, categoryLabels } from './data/apps';
import type { AppCategory } from './types/app';
import { Header, StoreNav } from './components/Header';
import { Footer } from './components/Footer';
import { SpotlightCard } from './components/SpotlightCard';
import { FeaturedCarousel } from './components/FeaturedCarousel';
import { AppListRow } from './components/AppListRow';
import './App.css';

type FilterCategory = 'all' | AppCategory;

function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<FilterCategory>('all');

  const featuredApps = useMemo(
    () => catalog.apps.filter((app) => app.featured),
    [],
  );

  const spotlightApp = featuredApps[0] ?? catalog.apps[0];
  const carouselApps = featuredApps.slice(1);

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
  const showEditorial = !query && category === 'all';

  return (
    <div className="store">
      <Header query={query} onQueryChange={setQuery} />
      <StoreNav />

      <main className="store-main">
        {showEditorial && spotlightApp && (
          <section className="today" aria-label="Featured">
            <SpotlightCard app={spotlightApp} />
          </section>
        )}

        {showEditorial && carouselApps.length > 0 && (
          <FeaturedCarousel apps={carouselApps} />
        )}

        <section className="shelf" aria-labelledby="apps-heading">
          <div className="shelf-header">
            <h2 id="apps-heading">
              {query ? 'Results' : category === 'all' ? 'All Apps' : categoryLabels[category]}
            </h2>
            {!query && (
              <p>{filteredApps.length} {filteredApps.length === 1 ? 'app' : 'apps'}</p>
            )}
          </div>

          <div
            className="category-rail"
            role="tablist"
            aria-label="Categories"
          >
            {categories.map((value) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={category === value}
                className={
                  category === value ? 'category-chip active' : 'category-chip'
                }
                onClick={() => setCategory(value)}
              >
                {categoryLabels[value]}
              </button>
            ))}
          </div>

          {filteredApps.length > 0 ? (
            <ul className="app-list">
              {filteredApps.map((app) => (
                <AppListRow key={app.id} app={app} />
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <p>No apps found.</p>
              <button
                type="button"
                className="text-button"
                onClick={() => {
                  setQuery('');
                  setCategory('all');
                }}
              >
                Clear search
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
