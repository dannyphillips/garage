import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { getRepoRoot, slugify } from './config.mjs';

export function titleCaseFromSlug(slug) {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function validateSlug(slug) {
  const normalized = slugify(slug);

  if (!normalized) {
    throw new Error('App slug is required');
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized)) {
    throw new Error(
      `Invalid slug "${slug}". Use lowercase letters, numbers, and hyphens.`,
    );
  }

  return normalized;
}
