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

**State management**: React Query is the primary approach for server state. Zustand stores exist but are being phased out.

- **React Query** (@tanstack/react-query) for server state — configured in `src/App.jsx` (retry: 1, staleTime: 5min). Pages use custom hooks that call the API directly via React Query instead of going through Zustand stores.
- **Zustand** (with persist middleware) — `src/stores/useProgramsStore.js`, `src/stores/useStoresStore.js`. Legacy; most pages have been migrated to React Query + direct API calls. Only used by `ScanQR.jsx` at this point.

**Custom hooks pattern**: Page-level logic (data fetching, mutations, filtering, sorting, form state) is extracted into custom hooks in `src/hooks/`. Pages are thin — they import a hook and sub-components, then render JSX.

| Hook | Page | Responsibilities |
| --- | --- | --- |
| `useClubForm` | `CreateClub` | Form state, image uploads, create/update program via direct API. Uses `initialData` from the programs list cache to avoid refetching on edit. |
| `useMyPrograms` | `MyPrograms` | Programs list (single query), member counts (inline from API), toggle active, delete |
| `useCustomers` | `Customers` | Members list with inline stats (single paginated query), filtering, date filter, server-side sorting, infinite scroll |
| `useDashboard` | `Dashboard` | Brand selector, logo upload, create/delete brand, me query |
| `useDashboardHome` | `DashboardHome` | Stats queries (brand stats, user/transaction/redemption history), date/store filters, chart data |
| `useStores` | `Stores` | Stores CRUD with optimistic updates, QR URL generation, form/dialog state |
| `useNotifications` | `Notifications` | Notification form state, program selector, send wallet push notification |

**API layer**: Domain-namespaced API client in `src/api/`. The core HTTP layer (`client.js`) exports an `ApiClient` class instance (`api`) with methods `get()`, `post()`, `patch()`, `delete()`, and `publicRequest()`. Domain logic lives in factory functions under `src/api/namespaces/` — each receives the client instance and returns an object of methods:

| Namespace | File | Key methods |
| --- | --- | --- |
| `api.auth` | `namespaces/auth.js` | login, register, verifyEmail, resetPassword, logout, me, updateBrandAdmin |
| `api.brands` | `namespaces/brands.js` | create, get, userList, stats (byUser, transactions, redemptions), update, delete |
| `api.stores` | `namespaces/stores.js` | list, create, update, delete |
| `api.loyaltyPrograms` | `namespaces/loyaltyPrograms.js` | list, get, create, update, delete, public endpoints |
| `api.loyaltyCards` | `namespaces/loyaltyCards.js` | create (public), get, list (by card or program) |
| `api.transactions` | `namespaces/transactions.js` | create (with unit_type and amount) |
| `api.images` | `namespaces/images.js` | createStampCard, URL builders for stamp cards and logos |

Tiny namespaces (`health`, `redemptions`, `shortUrls`, `notifications`) are defined inline in the `ApiClient` constructor. Helper modules: `authHelpers.js` (JWT processing + localStorage persistence) and `helpers.js` (`buildQueryString`).

In dev, Vite proxies `/api` to the AWS backend. In prod, uses `VITE_API_URL`. JWT is cached in a module-level variable (`_cachedToken`) and synced to localStorage via `setCachedToken()`; 401 responses auto-clear token and redirect to login. All token mutations (login, register, verifyEmail, updateBrandAdmin, logout) use `setCachedToken()` to keep the cache in sync. An optional `VITE_API_KEY` is sent as `x-api-key` header on all requests when set.

**Error monitoring**: Sentry (`src/sentry.jsx`) — initialized before React in `main.jsx`, wraps `<Pages />` with `SentryErrorBoundary` in `App.jsx`. Auto-derives environment from `VITE_API_URL` (dev/stg/prod). Disabled entirely without `VITE_SENTRY_DSN`. API errors get breadcrumbs and 5xx responses are auto-captured via `Sentry.captureException()` in `client.js`. Source maps uploaded during CI builds via `@sentry/vite-plugin` (conditional on `SENTRY_AUTH_TOKEN`). Sample rates: 10% traces, 10% session replays, 100% error replays.

**Product analytics**: PostHog (`src/posthog.js`) — initialized before React in `main.jsx`. Captures pageviews automatically via the `ScrollToTop` component in `src/pages/index.jsx`. Users are identified on login/register (with device info via `src/utils/device.js`) and reset on logout in `src/api/namespaces/auth.js`. Disabled entirely without `VITE_POSTHOG_KEY`. Uses `person_profiles: 'identified_only'` to only create profiles for identified users. Feature flags are used to gate features (e.g., `notifications` flag controls Notifications page visibility in the Sidebar via `posthog.isFeatureEnabled()` and `posthog.onFeatureFlags()`).

**UI**: shadcn/ui components (~30) built on Radix UI primitives, in `src/components/ui/`. Styled with Tailwind CSS using HSL CSS variables for theming (light/dark via class). Icons from lucide-react.

**Path alias**: `@` maps to `./src` (configured in both vite.config.js and jsconfig.json).

**Component extraction pattern**: Large pages are decomposed into sub-components in `src/components/<domain>/`:

- `programs/ClubFormSections.jsx` — form section components for CreateClub (StoreSelector, BasicInfoFields, ImageUploadGroup, etc.)
- `programs/ProgramPreviewSection.jsx`, `programs/ProgramPreviewComponent.jsx` — live preview for CreateClub (iOS/Android toggle, flip)
- `programs/MyProgramsSections.jsx`, `programs/ProgramListItem.jsx` — ProgramListSkeleton, EmptyProgramsState, list item for MyPrograms
- `programs/FlyerPDF.jsx`, `programs/FlyerPreview.jsx` — PDF flyer generation and preview for programs
- `customers/CustomersSections.jsx` — CustomerCard, CustomerListSkeleton, CustomerEmptyState, PaginationControls
- `customers/CustomerDetailModal.jsx` — customer detail dialog with stats, transaction history, stamp addition, reward redemption
- `dashboard/DashboardSections.jsx` — BrandLogoButton, BrandSelectorDropdown, DeleteBrandDialog, DashboardFilters
- `dashboard/MetricCard.jsx`, `dashboard/StatsChart.jsx`, `dashboard/Step3CTA.jsx` — dashboard metric cards, charts, empty state CTA
- `dashboard/OnboardingView.jsx`, `dashboard/StampsDistribution.jsx` — onboarding flow, stamps distribution chart
- `onboarding/ShareCardModal.jsx` — card sharing modal for onboarding
- `subscription/PricingModal.jsx` — subscription pricing dialog
- `shared/DateFilterSelect.jsx` — reusable date filter (7d, month, custom range) used by dashboard and customers
- `stores/StoresSections.jsx` — StoreCard, StoresLoadingSkeleton, StoresEmptyState, StoreFormDialog, StoreQrDialog

**Shared constants**: `src/constants/programTypes.js` — PROGRAM_TYPES array with id/key/name/description, plus helpers (`getProgramTypeDescription`, `getProgramTypeName`, `getProgramTypeFromId`).

**Image utilities**: `src/utils/image.js` — canvas-based functions for image processing (resizeImageToMax, compressForBrandUpload, compressForStampCard, cropToCircle, sampleCircleEdgeColor, estimateBase64Size). All `Image` instances use `crossOrigin = 'anonymous'` to avoid tainted canvas errors with S3/CDN images. Stamp icons are cropped to a 150px circular PNG (preserving transparency) and sent as-is to the stamp card API; backgrounds and logos are compressed to JPEG via `compressForStampCard`. Before sending, `estimateBase64Size` validates the combined payload stays under 5MB (Lambda limit).

**Date utilities**: `src/utils/date.js` — UTC-safe date helpers (`formatDateUTC`, `addDaysUTC`, `subDaysUTC`, `startOfMonthUTC`) used for API date filters. Avoids timezone offset issues that occur with `date-fns` local-time functions.

**Password validation**: `src/utils/passwordValidation.js` — shared password validation rules used across auth forms.

**Device utilities**: `src/utils/device.js` — uses `ua-parser-js` to extract device type, vendor, model, OS, and browser info. Sent as PostHog user properties on login/register for device analytics.

**Documentation**: The `docs/` directory contains reference material — `DEPLOY.md` (deployment architecture, pipeline, cache strategy) and `openapi.yaml` (backend API spec with all endpoints, schemas, and examples). Consult these when working on API integration or deployment changes.

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

Automated via GitHub Actions (`.github/workflows/deploy.yml`) to AWS S3 + CloudFront. Three stages: `develop` → dev, `stage` → stg, `main` → prod. Each stage uses a separate GitHub Environment with its own `VITE_API_URL`, `VITE_AWS_S3_BUCKET_PROGRAM_IMAGES`, `VITE_SENTRY_DSN`, `VITE_POSTHOG_KEY`, `AWS_S3_BUCKET`, and `AWS_CLOUDFRONT_DISTRIBUTION_ID`. Sentry source maps are uploaded during CI builds when `SENTRY_AUTH_TOKEN` secret is set.

## Releases & Changelog

Automated via [release-please](https://github.com/googleapis/release-please) (`.github/workflows/release-please.yml`). On pushes to `main`, release-please analyzes Conventional Commit messages and maintains an open release PR. Merging that PR bumps `version` in `package.json`, updates `CHANGELOG.md`, and creates a GitHub Release with a tag. Config lives in `release-please-config.json` and `.release-please-manifest.json`.

## Environment

- Node 22+ (see `.nvmrc`)
- `VITE_API_URL` — backend API endpoint (only needed in prod; dev uses Vite proxy). `.env` provides an empty default to suppress Vite HTML replacement warnings; `.env.development` sets the dev backend URL.
- `VITE_API_KEY` — optional API key sent as `x-api-key` header on all requests. Used when the backend requires API Gateway key authentication.
- Backend API (dev): `https://service-dev.repeat.la` (Vite proxy target)
- `VITE_AWS_S3_BUCKET_PROGRAM_IMAGES` — S3 bucket for program images (stamp cards and logos). Each environment has its own bucket; dev fallback: `repeat-program-images-dev`. URL pattern: `https://<bucket>.s3.us-east-1.amazonaws.com`
- `VITE_SENTRY_DSN` — Sentry DSN for error tracking. If not set, Sentry is completely disabled.
- `SENTRY_AUTH_TOKEN` / `SENTRY_ORG` / `SENTRY_PROJECT` — CI-only, used by `@sentry/vite-plugin` to upload source maps during builds.
- `VITE_POSTHOG_KEY` — PostHog project API key. If not set, PostHog is completely disabled.
- `VITE_POSTHOG_HOST` — PostHog ingestion host (optional, defaults to `https://us.i.posthog.com`).

## Performance Patterns

- **Single-query pages**: Backend LIST endpoints return all fields needed by the UI (including nested objects like `wallet_design`, `brand`, `loyalty_cards`). Hooks like `useMyPrograms` and `useCustomers` make a single API call per page load — no N+1 detail fetches.
- **`initialData` for instant navigation**: When navigating from a list to a detail/edit view, pass cached data via React Query's `initialData` to render instantly while refetching in the background (see `useClubForm` for edit mode, `CustomerDetailModal` for customer details).
- **Short URL fast redirect**: `public/redirect.js` is loaded as a synchronous `<script>` in `index.html` that resolves `/s/{code}` short URLs before React loads, avoiding full SPA boot for redirects. It reads the API URL from a `<meta name="api-url">` tag. Must remain synchronous (no `defer`/`async`/`type="module"`).
- Prefer computed values during render over `useEffect` that derives state from props/other state.
- Use `Map` for O(1) lookups when iterating over arrays (instead of `.find()` inside loops).
- `content-visibility: auto` is used on long lists for rendering performance.
- Do not add debug `console.log` blocks to `client.js` — they were removed intentionally to reduce per-request overhead.

## Security Headers

A Content-Security-Policy is defined via `<meta>` tag in `index.html`. Key directives:

- `script-src 'self' https://us-assets.i.posthog.com` — the short-URL redirect script was externalized to `public/redirect.js` to avoid `'unsafe-inline'`. PostHog assets CDN is allowed for feature flags.
- `style-src 'self' 'unsafe-inline'` — required by Tailwind, Framer Motion, and Radix UI inline styles.
- `img-src 'self' data: blob: https://*.s3.us-east-1.amazonaws.com https://api.qrserver.com` — covers canvas base64, QR downloads, S3 program images, and QR generation.
- `connect-src 'self' %VITE_API_URL% https://*.ingest.sentry.io https://us.i.posthog.com https://*.i.posthog.com` — Vite replaces the env var at build time per environment. Sentry ingest and PostHog endpoints are always allowed.

When adding new external resources (CDN fonts, analytics, etc.), update the CSP directives in `index.html`.

## Build Notes

- `manualChunks` was intentionally removed from vite.config.js to prevent React init-time ReferenceErrors with Radix UI. Do not re-add chunk splitting without testing thoroughly.
- Console logs/warnings are stripped in production builds via esbuild config.
- Chunk size warning limit is set to 500KB.
- `pako` is a direct dependency required by `@react-pdf/pdfkit` — do not remove it.
