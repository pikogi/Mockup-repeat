# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Repeat is a loyalty program management SPA built with React 18 + Vite 5. The backend is a separate Node.js/Express API deployed on AWS (Lambda + API Gateway). This repo contains only the frontend.

## Commands

- `npm run dev` — Start Vite dev server (port 5173)
- `npm run build` — Production build to `dist/`
- `npm run preview` — Preview production build locally
- `npm run lint` — ESLint (flat config, ESLint 9)
- `npm run lint:fix` — ESLint with auto-fix
- `npm run format` — Format all files with Prettier

No test framework is configured.

## Architecture

**Routing**: React Router v7 with lazy-loaded pages (`src/pages/index.jsx`). `ProtectedRoute` checks JWT validity. Public routes: login, register, verify-email, forgot-password, reset-password, public program/store views.

**State management**: Dual approach:

- **Zustand** (with persist middleware) for client state — `src/stores/useProgramsStore.js`, `src/stores/useStoresStore.js`
- **React Query** (@tanstack/react-query) for server state — configured in `src/App.jsx` (retry: 1, staleTime: 5min)

**API layer**: Class-based fetch wrapper in `src/api/client.js`. In dev, Vite proxies `/api` to the AWS backend. In prod, uses `VITE_API_URL`. JWT is cached in a module-level variable (`_cachedToken`) and synced to localStorage via `setCachedToken()`; 401 responses auto-clear token and redirect to login. All token mutations (login, register, verifyEmail, updateBrandAdmin, logout) use `setCachedToken()` to keep the cache in sync.

**UI**: shadcn/ui components (50+) built on Radix UI primitives, in `src/components/ui/`. Styled with Tailwind CSS using HSL CSS variables for theming (light/dark via class). Icons from lucide-react.

**Path alias**: `@` maps to `./src` (configured in both vite.config.js and jsconfig.json).

## Key Conventions

- Language: The app UI is in Spanish. Code (variables, functions), documentation (README, CLAUDE.md, CHANGELOG, commit messages, PR descriptions), and comments are always in English.
- Styling: Tailwind utility classes + `cn()` helper from `src/lib/utils.js` (clsx + tailwind-merge).
- Forms: React Hook Form + Zod for validation.
- Animations: Framer Motion.
- Charts: Recharts.
- No TypeScript — plain JavaScript with JSX. Type hints via jsconfig.json.

## Code Quality

- **Prettier**: Auto-formatting (no semicolons, single quotes, trailing commas, 120 char width). Config in `.prettierrc`.
- **ESLint**: Flat config (ESLint 9) with plugins for React, React Hooks, React Refresh, Prettier, and `simple-import-sort`.
- **Conventional Commits**: Enforced via commitlint + Husky `commit-msg` hook. Allowed types: `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`.
- **Pre-commit hook**: Husky runs lint-staged on commit — ESLint + Prettier on `*.{js,jsx}`, Prettier on `*.{json,md,yml,yaml}`.
- **Import sorting**: Handled automatically by `eslint-plugin-simple-import-sort` via lint-staged.

## Deployment

Automated via GitHub Actions (`.github/workflows/deploy.yml`) to AWS S3 + CloudFront. Three stages: `develop` → dev, `stage` → stg, `main` → prod. Each stage uses a separate GitHub Environment with its own `VITE_API_URL`, `VITE_AWS_S3_BUCKET_PROGRAM_IMAGES`, `AWS_S3_BUCKET`, and `AWS_CLOUDFRONT_DISTRIBUTION_ID`.

## Releases & Changelog

Automated via [release-please](https://github.com/googleapis/release-please) (`.github/workflows/release-please.yml`). On pushes to `main`, release-please analyzes Conventional Commit messages and maintains an open release PR. Merging that PR bumps `version` in `package.json`, updates `CHANGELOG.md`, and creates a GitHub Release with a tag. Config lives in `release-please-config.json` and `.release-please-manifest.json`.

## Environment

- Node 22+ (see `.nvmrc`)
- `VITE_API_URL` — backend API endpoint (only needed in prod; dev uses Vite proxy)
- Backend API (dev): `https://service-dev.repeat.la` (Vite proxy target)
- `VITE_AWS_S3_BUCKET_PROGRAM_IMAGES` — S3 bucket for program images (stamp cards and logos). Each environment has its own bucket; dev fallback: `repeat-program-images-dev`. URL pattern: `https://<bucket>.s3.us-east-1.amazonaws.com`

## Performance Patterns

- Parallelize independent API calls with `Promise.all()` — avoid sequential awaits (see `Customers.jsx` queryFn for the pattern).
- Use `useMemo` for arrays/objects passed to React Query keys or `useQueries` to prevent unnecessary refetches.
- Prefer computed values during render over `useEffect` that derives state from props/other state.
- Use `Map` for O(1) lookups when iterating over arrays (instead of `.find()` inside loops).
- `content-visibility: auto` is used on long lists for rendering performance.
- Do not add debug `console.log` blocks to `client.js` — they were removed intentionally to reduce per-request overhead.

## Build Notes

- `manualChunks` was intentionally removed from vite.config.js to prevent React init-time ReferenceErrors with Radix UI. Do not re-add chunk splitting without testing thoroughly.
- Console logs/warnings are stripped in production builds via esbuild config.
- Chunk size warning limit is set to 500KB.
- `pako` is a direct dependency required by `@react-pdf/pdfkit` — do not remove it.
