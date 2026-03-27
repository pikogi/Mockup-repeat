# Repeat

Loyalty program management platform. Frontend SPA (React + Vite) that connects to a Node.js/Express backend deployed on AWS (Lambda + API Gateway).

## Quick Start

### Prerequisites

- Node.js 22+ (see `.nvmrc`)
- npm

### Local Development

```bash
# Install dependencies
npm install

# Create .env file (optional, Vite proxy uses the dev backend by default)
cp .env.example .env

# Start dev server
npm run dev
```

The frontend will be available at `http://localhost:5173`. In development, Vite proxies `/api` to the AWS backend automatically (see `vite.config.js`).

## Project Structure

```
repeat-app/
├── .github/workflows/   # CI/CD (GitHub Actions → S3 + CloudFront)
├── docs/                # Reference docs (DEPLOY.md, openapi.yaml)
├── src/
│   ├── api/             # API client (client.js + domain namespaces)
│   │   └── namespaces/  # Domain-specific API modules (auth, brands, stores, …)
│   ├── components/      # React components (shadcn/ui + Radix)
│   ├── constants/       # Shared constants (programTypes.js)
│   ├── hooks/           # Custom hooks (useClubForm, useMyPrograms, useCustomers, useDashboard, useStores)
│   ├── pages/           # Pages (lazy-loaded via React.lazy)
│   ├── stores/          # Global state (Zustand, legacy — only used by ScanQR)
│   ├── lib/             # Utilities (cn, etc.)
│   └── utils/           # Helpers (jwt, image processing, date, password validation)
├── public/              # Static assets
├── vite.config.js       # Vite config (proxy, build)
└── .env.example         # Environment variables reference
```

## Environment Variables

```env
VITE_API_URL=https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/dev
VITE_API_KEY=
VITE_AWS_S3_BUCKET_PROGRAM_IMAGES=repeat-program-images-dev
```

- `VITE_API_URL` — **Development**: Not required (Vite proxies `/api` to the dev backend; `.env.development` sets the dev URL). **Production**: Required, injected at build time via GitHub Actions. `.env` provides an empty default to suppress Vite HTML replacement warnings.
- `VITE_API_KEY` — Optional API key sent as `x-api-key` header on all requests. Used when the backend requires API Gateway key authentication.
- `VITE_AWS_S3_BUCKET_PROGRAM_IMAGES` — S3 bucket for program images (stamp cards and logos). Each environment has its own bucket. Falls back to `repeat-program-images-dev` if not set.

## Scripts

- `npm run dev` — Dev server with HMR
- `npm run build` — Production build to `dist/`
- `npm run preview` — Preview production build
- `npm run lint` — ESLint
- `npm run lint:fix` — ESLint with auto-fix
- `npm run format` — Format files with Prettier

## Code Quality

The project uses the following tools to maintain code quality:

- **Prettier** — Auto-formatting (no semicolons, single quotes, trailing commas, 120 char width)
- **ESLint** — Linting with plugins for React, import sorting, and Prettier
- **Commitlint** — Validates commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) (allowed types: `feat`, `fix`, `docs`, `chore`, `refactor`, `style`, `test`, `build`, `ci`, `perf`, `revert`)
- **Husky + lint-staged** — Pre-commit hooks that automatically run ESLint and Prettier on staged files

## Releases & Changelog

Releases are managed automatically with [release-please](https://github.com/googleapis/release-please). On pushes to `main`, release-please analyzes commits (Conventional Commits) and maintains an open release PR. Merging that PR:

- Bumps the version in `package.json`
- Generates/updates `CHANGELOG.md`
- Creates a GitHub Release with a tag (`v1.x.x`)

## Deployment

Deployment is automated via GitHub Actions to AWS S3 + CloudFront.

### Stages and Branches

| Branch    | Environment | Description  |
| --------- | ----------- | ------------ |
| `develop` | dev         | Development  |
| `stage`   | stg         | Staging / QA |
| `main`    | prod        | Production   |

### How It Works

1. Push to a branch triggers the corresponding workflow
2. Can be triggered manually via `workflow_dispatch`
3. The workflow runs `npm ci` + `npm run build` with `VITE_API_URL` and `VITE_AWS_S3_BUCKET_PROGRAM_IMAGES` from the environment
4. Uploads `dist/` to S3 with differentiated cache headers (hashed assets = immutable, root files = no-cache)
5. Invalidates CloudFront cache

### Required Configuration

**GitHub Environments** (dev, stg, prod) — per-environment variables:

- `VITE_API_URL` — Backend API URL
- `VITE_AWS_S3_BUCKET_PROGRAM_IMAGES` — S3 bucket for program images
- `AWS_S3_BUCKET` — S3 bucket for static site hosting
- `AWS_CLOUDFRONT_DISTRIBUTION_ID` — CloudFront distribution ID

**GitHub Secrets** (repository-level):

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

**AWS** (per stage):

- S3 bucket with block public access ON
- CloudFront with OAC, custom error responses (403/404 → `/index.html` with HTTP 200)
- IAM with permissions: `s3:PutObject`, `s3:DeleteObject`, `s3:ListBucket`, `cloudfront:CreateInvalidation`

## Authentication

JWT stored in `localStorage` and cached in memory (`_cachedToken` in `client.js`). 401 responses automatically clear the token and redirect to login.
