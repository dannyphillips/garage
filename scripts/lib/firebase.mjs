import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { getRepoRoot } from './config.mjs';
import { listAppSlugs } from './build-apps.mjs';

export function resolveFirebaseCommand() {
  const localBin = join(getRepoRoot(), 'node_modules/.bin/firebase');
  if (existsSync(localBin)) {
    return localBin;
  }

  return 'firebase';
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    cwd: options.cwd ?? getRepoRoot(),
    env: { ...process.env, ...options.env },
  });

  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(' ')}`);
  }

  return result;
}

export function firebase(args, options = {}) {
  return run(resolveFirebaseCommand(), args, options);
}

export function buildGarageIndex() {
  run('npm', ['run', 'build:garage']);
}

export function createHostingSite(siteId, config) {
  const result = spawnSync(
    resolveFirebaseCommand(),
    ['hosting:sites:create', siteId, '--project', config.firebase.project],
    { cwd: getRepoRoot(), stdio: 'pipe', encoding: 'utf8' },
  );

  if (result.status === 0) {
    return { created: true, siteId };
  }

  if (result.stderr?.includes('already exists') || result.stdout?.includes('already exists')) {
    return { created: false, siteId };
  }

  console.error(result.stderr || result.stdout);
  throw new Error(`Failed to create Firebase site ${siteId}`);
}

export function firebaseSiteUrl(siteId) {
  return `${siteId}.web.app`;
}

export function deployHosting(targets, options = {}) {
  const args = ['deploy', '--only', targets.map((t) => `hosting:${t}`).join(',')];

  if (options.nonInteractive) {
    args.push('--non-interactive');
  }

  if (process.env.FIREBASE_TOKEN) {
    args.push('--token', process.env.FIREBASE_TOKEN);
  }

  firebase(args);
}

export function deployGarage(config, options = {}) {
  deployHosting([config.firebase.garageTarget], options);
}

export function deployAll(config, options = {}) {
  const appTargets = listAppSlugs();
  const targets = [config.firebase.garageTarget, ...appTargets];
  deployHosting(targets, options);
}
