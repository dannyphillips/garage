import type { GarageApp } from '../types/app';
import { AppIcon } from './AppIcon';
import { getCategoryLabel } from '../lib/appTheme';
import { statusLabels } from '../data/apps';

interface AppListRowProps {
  app: GarageApp;
}

export function AppListRow({ app }: AppListRowProps) {
  const showStatus = app.status !== 'live';

  return (
    <li>
      <a
        className="app-row"
        href={app.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <AppIcon app={app} size="md" />
        <div className="app-row-copy">
          <h3>{app.name}</h3>
          <p>{app.tagline}</p>
          <span className="app-row-meta">
            {getCategoryLabel(app.category)}
            {showStatus && ` · ${statusLabels[app.status]}`}
          </span>
        </div>
        <span className="app-row-action">Open</span>
      </a>
    </li>
  );
}
