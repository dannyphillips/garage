import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');

export function getRepoRoot() {
  return repoRoot;
}

export function loadConfig() {
  const configPath = join(repoRoot, 'garage/config.json');
  const examplePath = join(repoRoot, 'garage/config.example.json');

  if (!existsSync(configPath)) {
    throw new Error(
      `Missing garage/config.json. Copy garage/config.example.json and fill in your values:\n  cp garage/config.example.json garage/config.json`,
    );
  }

  const config = JSON.parse(readFileSync(configPath, 'utf8'));
  const example = existsSync(examplePath)
    ? JSON.parse(readFileSync(examplePath, 'utf8'))
    : {};

  return { ...example, ...config, _path: configPath };
}

export function loadCatalog() {
  const catalogPath = join(repoRoot, 'garage/apps.json');
  return {
    path: catalogPath,
    data: JSON.parse(readFileSync(catalogPath, 'utf8')),
  };
}

export function getPorkbunCredentials() {
  const apiKey = process.env.PORKBUN_API_KEY;
  const secretKey = process.env.PORKBUN_SECRET_KEY;

  if (!apiKey || !secretKey) {
    throw new Error(
      'Missing Porkbun credentials. Set PORKBUN_API_KEY and PORKBUN_SECRET_KEY in your environment or .env.local',
    );
  }

  return { apiKey, secretKey };
}

export function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
