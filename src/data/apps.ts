import catalogData from '../../garage/apps.json';
import type { AppCatalog } from '../types/app';

export const catalog = catalogData as AppCatalog;

export const categoryLabels: Record<string, string> = {
  all: 'All Apps',
  productivity: 'Productivity',
  home: 'Home & Family',
  monitoring: 'Monitoring',
  games: 'Games',
  experiments: 'Experiments',
};

export const statusLabels: Record<string, string> = {
  live: 'Live',
  beta: 'Beta',
  dev: 'In Development',
  archived: 'Archived',
};
