import type { GarageApp } from '../types/app';

interface StatsBarProps {
  apps: GarageApp[];
}

export function StatsBar({ apps }: StatsBarProps) {
  const live = apps.filter((app) => app.status === 'live').length;
  const inProgress = apps.filter(
    (app) => app.status === 'beta' || app.status === 'dev',
  ).length;
  const monorepo = apps.filter((app) => app.monorepo).length;

  return (
    <div className="stats-bar" aria-label="App statistics">
      <div className="stat">
        <span className="stat-value">{apps.length}</span>
        <span className="stat-label">Total apps</span>
      </div>
      <div className="stat">
        <span className="stat-value stat-live">{live}</span>
        <span className="stat-label">Live</span>
      </div>
      <div className="stat">
        <span className="stat-value stat-progress">{inProgress}</span>
        <span className="stat-label">In progress</span>
      </div>
      {monorepo > 0 && (
        <div className="stat">
          <span className="stat-value">{monorepo}</span>
          <span className="stat-label">In this repo</span>
        </div>
      )}
    </div>
  );
}
