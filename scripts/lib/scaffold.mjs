import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';
import { getRepoRoot } from './config.mjs';

export function scaffoldApp(slug, options, config) {
  const templateDir = join(getRepoRoot(), 'garage/templates/app');
  const appDir = join(getRepoRoot(), 'apps', slug);

  if (existsSync(appDir)) {
    throw new Error(`App directory already exists: apps/${slug}`);
  }

  cpSync(templateDir, appDir, { recursive: true });

  const name = options.name ?? slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  const manifest = {
    id: slug,
    name,
    tagline: options.tagline ?? 'A new project from the garage',
    description:
      options.description ??
      `${name} — built in the Garage monorepo and hosted at ${slug}.${config.domain}.`,
    subdomain: slug,
    icon: options.icon ?? '📱',
    category: options.category ?? 'experiments',
    status: options.status ?? 'dev',
    featured: Boolean(options.featured),
    tags: options.tags ?? ['new'],
    updatedAt: new Date().toISOString().slice(0, 10),
    firebase: {
      site: slug,
      target: slug,
    },
  };

  writeFileSync(
    join(appDir, 'garage.manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  );

  const pkgPath = join(appDir, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  pkg.name = `@garage/${slug}`;
  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');

  const indexHtml = readFileSync(join(appDir, 'index.html'), 'utf8').replaceAll(
    '@APP_NAME@',
    name,
  );
  writeFileSync(join(appDir, 'index.html'), indexHtml, 'utf8');

  const appTsx = readFileSync(join(appDir, 'src/App.tsx'), 'utf8').replaceAll(
    '@APP_NAME@',
    name,
  );
  writeFileSync(join(appDir, 'src/App.tsx'), appTsx, 'utf8');

  return { appDir, manifest };
}

export function registerFirebaseTarget(slug, config) {
  const firebasercPath = join(getRepoRoot(), '.firebaserc');
  const firebaseJsonPath = join(getRepoRoot(), 'firebase.json');

  const firebaserc = JSON.parse(readFileSync(firebasercPath, 'utf8'));
  const firebaseJson = JSON.parse(readFileSync(firebaseJsonPath, 'utf8'));

  const project = config.firebase.project;
  firebaserc.targets ??= {};
  firebaserc.targets[project] ??= { hosting: {} };
  firebaserc.targets[project].hosting[slug] ??= [slug];

  const hostingEntry = {
    target: slug,
    public: `apps/${slug}/dist`,
    ignore: ['firebase.json', '**/.*', '**/node_modules/**'],
    rewrites: [{ source: '**', destination: '/index.html' }],
  };

  const existingIndex = firebaseJson.hosting.findIndex(
    (entry) => entry.target === slug,
  );

  if (existingIndex >= 0) {
    firebaseJson.hosting[existingIndex] = hostingEntry;
  } else {
    firebaseJson.hosting.push(hostingEntry);
  }

  writeFileSync(firebasercPath, `${JSON.stringify(firebaserc, null, 2)}\n`, 'utf8');
  writeFileSync(firebaseJsonPath, `${JSON.stringify(firebaseJson, null, 2)}\n`, 'utf8');
}
