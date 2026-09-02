export type AppStatus = 'live' | 'beta' | 'dev' | 'archived';

export type AppCategory =
  | 'productivity'
  | 'home'
  | 'monitoring'
  | 'games'
  | 'experiments';

export interface GarageApp {
  id: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  icon: string;
  category: AppCategory;
  status: AppStatus;
  featured?: boolean;
  tags: string[];
  updatedAt: string;
  monorepo?: boolean;
  external?: boolean;
}

export interface AppCatalog {
  owner: string;
  domain: string;
  appsSubdomain: string;
  apps: GarageApp[];
}
