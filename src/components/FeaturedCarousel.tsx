import type { GarageApp } from '../types/app';
import { AppIcon } from './AppIcon';
import { getCategoryLabel } from '../lib/appTheme';

interface FeaturedCarouselProps {
  apps: GarageApp[];
}

export function FeaturedCarousel({ apps }: FeaturedCarouselProps) {
  if (apps.length === 0) {
    return null;
  }

  return (
    <section className="shelf" aria-labelledby="featured-heading">
      <div className="shelf-header">
        <h2 id="featured-heading">Must-Haves</h2>
      </div>
      <ul className="featured-carousel">
        {apps.map((app) => (
          <li key={app.id}>
            <a
              className="featured-tile"
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <AppIcon app={app} size="lg" />
              <div className="featured-tile-copy">
                <h3>{app.name}</h3>
                <p>{app.tagline}</p>
                <span className="featured-tile-meta">
                  {getCategoryLabel(app.category)}
                  {app.status === 'beta' && ' · Beta'}
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
