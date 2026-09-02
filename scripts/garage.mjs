#!/usr/bin/env node

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  getRepoRoot,
  loadConfig,
  getPorkbunCredentials,
} from './lib/config.mjs';
import { upsertCname, listDnsRecords } from './lib/porkbun.mjs';
import {
  buildGarageIndex,
  createHostingSite,
  deployAll,
  deployGarage,
  firebaseSiteUrl,
} from './lib/firebase.mjs';
import { buildMonorepoApps } from './lib/build-apps.mjs';
import { syncCatalog } from './lib/sync-catalog.mjs';
import { scaffoldApp, registerFirebaseTarget } from './lib/scaffold.mjs';
import { validateSlug, titleCaseFromSlug } from './lib/catalog.mjs';

function printHelp() {
  console.log(`
Garage — monorepo hub for personal apps

Usage:
  garage sync-catalog                 Rebuild garage/apps.json from app manifests
  garage deploy [--all] [--skip-build]  Deploy index (and optionally all apps)
  garage new-app <slug> [options]     Scaffold app + DNS + Firebase + catalog
  garage dns list                     List Porkbun DNS records
  garage dns add <subdomain>          Create/update a CNAME record

Options for new-app:
  --name "App Name"
  --tagline "Short description"
  --description "Longer App Store copy"
  --icon "emoji"
  --category productivity|home|monitoring|games|experiments
  --status live|beta|dev|archived
  --featured
  --skip-dns / --skip-firebase / --skip-scaffold
  --dry-run

Environment:
  PORKBUN_API_KEY, PORKBUN_SECRET_KEY, FIREBASE_TOKEN (optional)

Monorepo layout:
  src/                  Garage App Store UI (apps.yourdomain.com)
  apps/<slug>/          Your apps — each with garage.manifest.json
  garage/external.json  Apps hosted outside this repo
`);
}

function parseFlags(argv) {
  const flags = {};
  const positionals = [];

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '--help' || arg === '-h') {
      flags.help = true;
      continue;
    }

    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = argv[i + 1];

      if (
        [
          'skip-build',
          'featured',
          'skip-dns',
          'skip-firebase',
          'skip-scaffold',
          'skip-catalog',
          'dry-run',
          'all',
        ].includes(key)
      ) {
        flags[key] = true;
        continue;
      }

      flags[key] = next;
      i += 1;
      continue;
    }

    positionals.push(arg);
  }

  return { flags, positionals };
}

function logStep(title) {
  console.log(`\n→ ${title}`);
}

function cmdSyncCatalog() {
  const catalog = syncCatalog();
  console.log(`✓ Synced ${catalog.apps.length} apps to garage/apps.json`);
}

async function cmdDeploy(flags) {
  const config = loadConfig();

  logStep('Syncing catalog');
  syncCatalog();

  if (!flags['skip-build']) {
    logStep('Building Garage index');
    buildGarageIndex();
    logStep('Building monorepo apps');
    buildMonorepoApps();
  }

  if (flags.all) {
    logStep('Deploying Garage + all apps');
    deployAll(config, { nonInteractive: Boolean(process.env.FIREBASE_TOKEN) });
  } else {
    logStep(`Deploying Garage index (${config.firebase.garageTarget})`);
    deployGarage(config, { nonInteractive: Boolean(process.env.FIREBASE_TOKEN) });
  }

  console.log(`\n✓ Deployed — https://${config.appsSubdomain}.${config.domain}`);
}

async function cmdDnsList() {
  const config = loadConfig();
  const credentials = getPorkbunCredentials();
  const domain = config.porkbun.domain;

  logStep(`Listing DNS records for ${domain}`);
  const records = await listDnsRecords(domain, credentials);

  for (const record of records) {
    console.log(
      `${record.type.padEnd(6)} ${record.name.padEnd(28)} ${record.content}`,
    );
  }
}

async function cmdDnsAdd(subdomain, flags) {
  const config = loadConfig();
  const credentials = getPorkbunCredentials();
  const domain = config.porkbun.domain;
  const siteId = flags.site ?? subdomain;
  const cnameTarget = flags.target ?? firebaseSiteUrl(siteId);

  if (flags['dry-run']) {
    console.log(`Would upsert CNAME ${subdomain}.${domain} -> ${cnameTarget}`);
    return;
  }

  logStep(`Creating CNAME ${subdomain}.${domain} -> ${cnameTarget}`);
  const result = await upsertCname(
    domain,
    credentials,
    subdomain,
    cnameTarget,
    config.dns.ttl,
  );

  console.log(`✓ DNS ${result.action}: ${subdomain}.${domain}`);
}

async function cmdNewApp(slugArg, flags) {
  const config = loadConfig();
  const slug = validateSlug(slugArg);
  const hostname = `${slug}.${config.domain}`;
  const siteId = slug;

  console.log(`\nGarage new-app: ${slug}`);
  console.log(`  Monorepo: apps/${slug}/`);
  console.log(`  URL:      https://${hostname}`);

  if (flags['dry-run']) {
    console.log('\nDry run — no changes applied.');
    return;
  }

  if (!flags['skip-scaffold']) {
    logStep(`Scaffolding apps/${slug}`);
    scaffoldApp(
      slug,
      {
        name: flags.name ?? titleCaseFromSlug(slug),
        tagline: flags.tagline,
        description: flags.description,
        icon: flags.icon,
        category: flags.category,
        status: flags.status ?? 'dev',
        featured: flags.featured,
        tags: flags.tags?.split(',').map((t) => t.trim()).filter(Boolean),
      },
      config,
    );
    console.log('✓ App scaffolded');
  }

  if (!flags['skip-firebase']) {
    logStep(`Creating Firebase hosting site "${siteId}"`);
    const site = createHostingSite(siteId, config);
    console.log(site.created ? '✓ Site created' : '• Site already exists');
    registerFirebaseTarget(slug, config);
    console.log('✓ Firebase target registered');
  }

  if (!flags['skip-dns']) {
    logStep(`Provisioning Porkbun DNS for ${hostname}`);
    const credentials = getPorkbunCredentials();
    const dns = await upsertCname(
      config.porkbun.domain,
      credentials,
      slug,
      firebaseSiteUrl(siteId),
      config.dns.ttl,
    );
    console.log(`✓ DNS ${dns.action}`);
  }

  logStep('Syncing catalog');
  syncCatalog();
  console.log('✓ Catalog updated');

  console.log(`
Next steps:
  cd apps/${slug} && npm run dev
  firebase hosting:domains:create ${hostname} --site ${siteId} --project ${config.firebase.project}
  garage deploy --all
`);
}

async function main() {
  const { flags, positionals } = parseFlags(process.argv.slice(2));
  const [command, subcommand, ...rest] = positionals;

  if (flags.help || !command) {
    printHelp();
    process.exit(command ? 0 : 1);
  }

  try {
    switch (command) {
      case 'sync-catalog':
        cmdSyncCatalog();
        break;
      case 'deploy':
        await cmdDeploy(flags);
        break;
      case 'dns':
        if (subcommand === 'list') {
          await cmdDnsList();
        } else if (subcommand === 'add') {
          await cmdDnsAdd(rest[0], flags);
        } else {
          throw new Error('Usage: garage dns list | garage dns add <subdomain>');
        }
        break;
      case 'new-app':
        await cmdNewApp(subcommand, flags);
        break;
      default:
        throw new Error(`Unknown command: ${command}`);
    }
  } catch (error) {
    console.error(`\n✗ ${error.message}`);
    process.exit(1);
  }
}

main();
