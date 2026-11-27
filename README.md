# carconfig

Explore every package plan a car was offered with, with plain-language hints for each feature (hover or tap the **?**). Starting with the Dodge Challenger 3.6L V6 (SXT and GT).

Pick a model year and a trim to see what's standard and every factory package offered for it.

## Run it

```bash
pnpm install
pnpm dev           # http://localhost:5173
```

| Script | What it does |
| --- | --- |
| `pnpm dev` | Dev server with hot reload |
| `pnpm build` | Type check and production build into `dist/` |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript only |
| `pnpm test` | Checks every dataset in `data/` for broken ids |

## Live site

Every push to `main` is built and deployed to GitHub Pages: https://jed0s.github.io/carconfig/
(see `.github/workflows/pages.yml`). Pull requests run lint, tests and build without deploying.

## Data

All car data lives in `data/` as one JSON file per model and engine, for example `data/challenger-3.6.json`. The shape is defined in [`src/data/schema.ts`](src/data/schema.ts):

- `features` is a dictionary of every feature with its `name`, `category` and `hint`. Trims and packages refer to features by id, so each hint is written once.
- `years[]` holds each model year's `trims` (with `standardFeatures`) and `packages` (with `availableOn`, `priceUsd`, `features`, and optional `requires` / `includes`).
- `confidence` (`verified`, `likely`, `uncertain`) marks how sure we are about a trim or package.

The app loads the real file when present and falls back to `*.sample.json` otherwise (a banner says when sample data is shown). `data/challenger-3.6.sample.json` is illustrative only and not verified.

## Stack

Vite, React 19, TypeScript, Vitest. No backend: data is bundled at build time.
