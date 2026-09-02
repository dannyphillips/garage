import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { getRepoRoot } from './config.mjs';

export function listAppSlugs() {
  const appsRoot = join(getRepoRoot(), 'apps');
  if (!existsSync(appsRoot)) {
    return [];
  }

  return readdirSync(appsRoot, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        !entry.name.startsWith('_') &&
        existsSync(join(appsRoot, entry.name, 'package.json')),
    )
    .map((entry) => entry.name);
}

export function buildMonorepoApps() {
  const slugs = listAppSlugs();
  const built = [];

  for (const slug of slugs) {
    console.log(`\n→ Building apps/${slug}`);
    const result = spawnSync('npm', ['run', 'build', '-w', `@garage/${slug}`], {
      cwd: getRepoRoot(),
      stdio: 'inherit',
    });

    if (result.status !== 0) {
      throw new Error(`Failed to build apps/${slug}`);
    }

    built.push(slug);
  }

  return built;
}

if (process.argv[1]?.endsWith('build-apps.mjs')) {
  buildMonorepoApps();
}
