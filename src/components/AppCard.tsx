import type { GarageApp } from '../types/app';
import { statusLabels } from '../data/apps';

interface AppCardProps {
  app: GarageApp;
  variant?: 'default' | 'featured';
}

export function AppCard({ app, variant = 'default' }: AppCardProps) {
  const hostname = new URL(app.url).hostname;

  return (
    <article
      className={
        variant === 'featured' ? 'app-card app-card-featured' : 'app-card'
      }
    >
      <div className="app-card-top">
        <div className="app-icon" aria-hidden="true">
          <span className="app-icon-inner">{app.icon}</span>
        </div>
        <div className="app-card-heading">
          <div className="app-title-row">
            <h3>{app.name}</h3>
            {app.monorepo && <span className="repo-badge">monorepo</span>}
          </div>
          <p className="app-tagline">{app.tagline}</p>
        </div>
        <span className={`status-pill status-${app.status}`}>
          {statusLabels[app.status]}
        </span>
      </div>

      <p className="app-description">{app.description}</p>

      <div className="app-tags">
        {app.tags.map((tag) => (
          <span key={tag} className="app-tag">
            {tag}
          </span>
        ))}
      </div>

      <div className="app-card-footer">
        <span className="app-host">{hostname}</span>
        <a
          href={app.url}
          className="app-open"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open
          <span aria-hidden="true"> ↗</span>
        </a>
      </div>
    </article>
  );
}
