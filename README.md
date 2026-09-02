# Garage

Where ideas start — a polished App Store for personal projects, built as a **monorepo hub** with one deploy pipeline.

![Garage logo](https://user-images.githubusercontent.com/8366399/57677626-1d84ad00-75dc-11e9-91ec-64c32aa4c9e6.png)

## Monorepo vs separate repos

**Recommendation: monorepo first, extract later.**

| Approach | Best for |
|----------|----------|
| **This monorepo** | Side projects you own solo — one CI pipeline, shared tooling, `garage new-app` does everything |
| **Separate repo** | Open-sourcing an app, inviting collaborators, or wildly different stacks |

Apps you build here live in `apps/<slug>/`. When a project needs its own repo, move the folder out — the manifest and DNS setup transfer cleanly. Apps hosted elsewhere (legacy repos, different domains) stay listed via `garage/external.json`.

## What you get

- **App Store UI** at `apps.yourdomain.com` — browse, search, and open any app
- **Monorepo** — all apps in `apps/*`, one GitHub Actions workflow deploys everything
- **Garage CLI** — scaffold apps, configure Porkbun DNS, register Firebase sites, sync the catalog

## Quick start

```bash
npm install
cp .env.example .env.local    # Porkbun API keys

npm run dev                   # Garage index at http://localhost:5173
garage new-app my-app --name "My App"
npm run deploy                # build + deploy index + all apps
```

## Repo layout

```
src/                      Garage App Store (this site)
apps/<slug>/              Your apps (Vite + React scaffold)
  garage.manifest.json    Catalog + deploy metadata
garage/
  apps.json               Auto-generated catalog (don't edit by hand)
  external.json           Apps hosted outside this repo
  config.json             Domain + Firebase + Porkbun settings
  templates/app/          Scaffold template for new apps
scripts/                  Garage CLI
```

## Garage CLI

```bash
garage new-app my-cool-app \
  --name "My Cool App" \
  --tagline "Does something neat" \
  --category experiments

garage sync-catalog       # rebuild garage/apps.json from manifests
garage deploy --all       # build + deploy index and every app
garage dns list           # Porkbun DNS records
```

### What `garage new-app` does

1. Scaffolds `apps/<slug>/` from `garage/templates/app`
2. Creates Firebase Hosting site + registers deploy target
3. Upserts Porkbun CNAME: `<slug>.yourdomain.com` → `<slug>.web.app`
4. Syncs `garage/apps.json` so the app appears on the index

One-time per app — link the custom domain in Firebase:

```bash
firebase hosting:domains:create my-app.dannyphillips.io \
  --site my-app --project danny-phillips
```

## Configuration

| File | Purpose |
|------|---------|
| `garage/config.json` | Domain, Firebase project, Porkbun domain |
| `apps/*/garage.manifest.json` | Per-app metadata (source of truth) |
| `garage/external.json` | Apps not in this repo |
| `.env.local` | `PORKBUN_API_KEY`, `PORKBUN_SECRET_KEY` |

### Porkbun

1. [Create API keys](https://porkbun.com/account/api)
2. Enable **API Access** on your domain
3. Add keys to `.env.local`

### Firebase / CI

Add `FIREBASE_SERVICE_ACCOUNT` to GitHub secrets. Pushes to `main` run `npm run build` and deploy all hosting targets.

## Stack

Vite · React 18 · TypeScript · Firebase Hosting · Porkbun API · GitHub Actions
