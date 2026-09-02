import type { AppCategory } from '../types/app';

const accents: Record<AppCategory, { from: string; to: string; glow: string }> = {
  home: { from: '#ff6b6b', to: '#ff8e53', glow: 'rgba(255, 107, 107, 0.35)' },
  productivity: { from: '#4facfe', to: '#00f2fe', glow: 'rgba(79, 172, 254, 0.35)' },
  monitoring: { from: '#43e97b', to: '#38f9d7', glow: 'rgba(67, 233, 123, 0.35)' },
  games: { from: '#a855f7', to: '#ec4899', glow: 'rgba(168, 85, 247, 0.35)' },
  experiments: { from: '#6366f1', to: '#22d3ee', glow: 'rgba(99, 102, 241, 0.35)' },
};

export function getAppAccent(category: AppCategory) {
  return accents[category] ?? accents.experiments;
}

export function getCategoryLabel(category: AppCategory): string {
  const labels: Record<AppCategory, string> = {
    home: 'Home & Family',
    productivity: 'Productivity',
    monitoring: 'Monitoring',
    games: 'Games',
    experiments: 'Experiments',
  };
  return labels[category];
}
