# Deployment Architecture

## Overview

Repeat App is a React SPA deployed to AWS S3 + CloudFront via GitHub Actions. The backend (Lambda + API Gateway) is managed in a separate repository.

## Diagram

```mermaid
graph TB
    subgraph "Source Control"
        DEV_BRANCH["develop branch"]
        STG_BRANCH["stage branch"]
        MAIN_BRANCH["main branch"]
    end

    subgraph "GitHub Actions CI/CD"
        GHA["Deploy Repeat App<br/>workflow"]
        BUILD["npm ci → npm run build<br/>(Vite + VITE_API_URL)"]
        GHA --> BUILD
    end

    DEV_BRANCH -->|push| GHA
    STG_BRANCH -->|push| GHA
    MAIN_BRANCH -->|push| GHA

    subgraph "AWS — Static Hosting"
        S3_DEV["S3 Bucket<br/>(dev)"]
        S3_STG["S3 Bucket<br/>(stg)"]
        S3_PROD["S3 Bucket<br/>(prod)"]
        CF_DEV["CloudFront<br/>(dev)"]
        CF_STG["CloudFront<br/>(stg)"]
        CF_PROD["CloudFront<br/>(prod)"]
        S3_DEV --> CF_DEV
        S3_STG --> CF_STG
        S3_PROD --> CF_PROD
    end

    BUILD --> S3_DEV
    BUILD --> S3_STG
    BUILD -->|"assets/ → immutable cache<br/>root files → no cache"| S3_PROD
    BUILD --> CF_DEV
    BUILD --> CF_STG
    BUILD -->|"invalidate /index.html /"| CF_PROD

    subgraph "AWS — Backend"
        APIGW["API Gateway<br/> endpoint"]
        LAMBDA["Lambda Functions"]
        APIGW --> LAMBDA
    end

    subgraph "AWS — Storage"
        S3_IMAGES["S3 Bucket<br/>repeat-program-images"]
    end

    USERS["Users / Browser"]
    USERS -->|"SPA"| CF_PROD
    CF_PROD -->|"API calls<br/>(VITE_API_URL)"| APIGW
    CF_PROD -->|"images"| S3_IMAGES
```

## Environments

| Environment | Branch    | Trigger        |
| ----------- | --------- | -------------- |
| dev         | `develop` | push or manual |
| stg         | `stage`   | push or manual |
| prod        | `main`    | push or manual |

All environments also support `workflow_dispatch` for manual deploys with environment selection.

## Build & Deploy Pipeline

1. **Checkout** code from the triggered branch
2. **Setup Node.js** (version from `.nvmrc`)
3. **Install** dependencies with `npm ci`
4. **Build** with `npm run build` — Vite injects `VITE_API_URL` per environment
5. **Sync hashed assets** (`dist/assets/`) to S3 with `Cache-Control: public, max-age=31536000, immutable`
6. **Sync root files** (`dist/` excluding assets) to S3 with `Cache-Control: public, max-age=0, must-revalidate`
7. **Invalidate CloudFront** cache for `/index.html` and `/`

## Secrets & Variables (GitHub Environments)

| Type     | Name                             | Description                           |
| -------- | -------------------------------- | ------------------------------------- |
| Secret   | `AWS_ACCESS_KEY_ID`              | IAM credentials for S3/CloudFront     |
| Secret   | `AWS_SECRET_ACCESS_KEY`          | IAM credentials for S3/CloudFront     |
| Variable | `VITE_API_URL`                   | Backend API Gateway URL               |
| Variable | `AWS_S3_BUCKET`                  | Target S3 bucket name                 |
| Variable | `AWS_CLOUDFRONT_DISTRIBUTION_ID` | CloudFront distribution to invalidate |

## Releases

Automated via [release-please](https://github.com/googleapis/release-please) (`.github/workflows/release-please.yml`). On pushes to `stage`, release-please analyzes Conventional Commit messages and maintains an open release PR. Merging that PR:

1. Bumps `version` in `package.json` and `.release-please-manifest.json`
2. Updates `CHANGELOG.md`
3. Creates a GitHub Release with a `vX.Y.Z` tag
4. The merge commit triggers `deploy.yml`, deploying the release to stg automatically

## Cache Strategy

- **Hashed assets** (`/assets/*`): Long-lived immutable cache (1 year). Vite generates unique filenames on each build, so old cached files are never served for new code.
- **Root files** (`index.html`, etc.): No cache (`must-revalidate`). Ensures users always get the latest `index.html` which references the current hashed assets.
- **CloudFront invalidation**: Only `/index.html` and `/` are invalidated — hashed assets don't need invalidation since their filenames change on each build.
