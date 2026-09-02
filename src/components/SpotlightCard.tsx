import type { GarageApp } from '../types/app';
import { AppIcon } from './AppIcon';

interface SpotlightCardProps {
  app: GarageApp;
}

export function SpotlightCard({ app }: SpotlightCardProps) {
  return (
    <a
      className="spotlight-card"
      href={app.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="spotlight-copy">
        <p className="spotlight-label">Featured App</p>
        <h2>{app.name}</h2>
        <p className="spotlight-tagline">{app.tagline}</p>
        <span className="spotlight-cta">Open</span>
      </div>
      <div className="spotlight-visual">
        <AppIcon app={app} size="xl" />
      </div>
      <p className="spotlight-description">{app.description}</p>
    </a>
  );
}
