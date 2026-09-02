import type { GarageApp } from '../types/app';
import { AppCard } from './AppCard';

interface FeaturedRowProps {
  apps: GarageApp[];
}

export function FeaturedRow({ apps }: FeaturedRowProps) {
  return (
    <section className="featured" aria-labelledby="featured-heading">
      <div className="section-heading">
        <h2 id="featured-heading">Featured</h2>
        <p>Hand-picked projects worth opening first</p>
      </div>
      <ul className="featured-grid">
        {apps.map((app) => (
          <li key={app.id}>
            <AppCard app={app} variant="featured" />
          </li>
        ))}
      </ul>
    </section>
  );
}
