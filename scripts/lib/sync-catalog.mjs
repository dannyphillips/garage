import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { getRepoRoot, loadConfig } from './config.mjs';

const MANIFEST = 'garage.manifest.json';

export function readManifest(appDir) {
  const manifestPath = join(appDir, MANIFEST);
  if (!existsSync(manifestPath)) {
    return null;
  }
  return JSON.parse(readFileSync(manifestPath, 'utf8'));
}

export function listMonorepoApps() {
  const appsRoot = join(getRepoRoot(), 'apps');
  if (!existsSync(appsRoot)) {
    return [];
  }

  return readdirSync(appsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('_'))
    .map((entry) => {
      const dir = join(appsRoot, entry.name);
      const manifest = readManifest(dir);
      return manifest ? { slug: entry.name, dir, manifest } : null;
    })
    .filter(Boolean);
}

export function manifestToCatalogEntry(manifest, config) {
  const slug = manifest.id;
  const subdomain = manifest.subdomain ?? slug;

  return {
    id: slug,
    name: manifest.name,
    tagline: manifest.tagline,
    description: manifest.description,
    url: manifest.url ?? `https://${subdomain}.${config.domain}`,
    icon: manifest.icon ?? '📱',
    category: manifest.category ?? 'experiments',
    status: manifest.status ?? 'dev',
    featured: Boolean(manifest.featured),
    tags: manifest.tags ?? [],
    updatedAt: manifest.updatedAt ?? new Date().toISOString().slice(0, 10),
    monorepo: true,
  };
}

export function syncCatalog() {
  const config = loadConfig();
  const catalogPath = join(getRepoRoot(), 'garage/apps.json');
  const externalPath = join(getRepoRoot(), 'garage/external.json');

  const monorepoApps = listMonorepoApps().map(({ manifest }) =>
    manifestToCatalogEntry(manifest, config),
  );

  const externalApps = existsSync(externalPath)
    ? JSON.parse(readFileSync(externalPath, 'utf8'))
    : [];

  const catalog = {
    owner: config.owner,
    domain: config.domain,
    appsSubdomain: config.appsSubdomain,
    apps: [...monorepoApps, ...externalApps].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.name.localeCompare(b.name);
    }),
  };

  writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
  return catalog;
}
