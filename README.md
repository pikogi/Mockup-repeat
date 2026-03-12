# Repeat

Plataforma de gestión de programas de fidelización. Frontend SPA (React + Vite) que se conecta a un backend Node.js/Express desplegado en AWS (Lambda + API Gateway).

## Inicio Rápido

### Prerrequisitos

- Node.js 22+ (ver `.nvmrc`)
- npm

### Desarrollo local

```bash
# Instalar dependencias
npm install

# Crear archivo .env (opcional, el proxy de Vite usa el backend de dev por defecto)
cp .env.example .env

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en `http://localhost:5173`. En desarrollo, Vite proxea `/api` al backend de AWS automáticamente (ver `vite.config.js`).

## Estructura del Proyecto

```
repeat-app/
├── .github/workflows/   # CI/CD (GitHub Actions → S3 + CloudFront)
├── src/
│   ├── api/             # Cliente API (client.js)
│   ├── components/      # Componentes React (shadcn/ui + Radix)
│   ├── hooks/           # Custom hooks
│   ├── pages/           # Páginas (lazy-loaded via React.lazy)
│   ├── stores/          # Estado global (Zustand)
│   ├── lib/             # Utilidades (cn, etc.)
│   └── utils/           # Helpers
├── public/              # Assets estáticos
├── vite.config.js       # Config de Vite (proxy, build)
└── .env.example         # Variables de entorno de referencia
```

## Variables de Entorno

```env
VITE_API_URL=https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/dev
```

- En **desarrollo**: No es necesaria. Vite proxea `/api` al backend de dev.
- En **producción**: Requerida. Se inyecta en el build via GitHub Actions desde GitHub Environments.

## Scripts

- `npm run dev` — Servidor de desarrollo con HMR
- `npm run build` — Build de producción a `dist/`
- `npm run preview` — Preview del build de producción
- `npm run lint` — ESLint

## Despliegue

El despliegue es automático via GitHub Actions a AWS S3 + CloudFront.

### Stages y branches

| Branch    | Environment | Descripción        |
|-----------|-------------|--------------------|
| `develop` | dev         | Desarrollo         |
| `stage`   | stg         | Staging / QA       |
| `main`    | prod        | Producción         |

### Cómo funciona

1. Push a una branch dispara el workflow correspondiente
2. Se puede disparar manualmente via `workflow_dispatch`
3. El workflow hace `npm ci` + `npm run build` con `VITE_API_URL` del environment
4. Sube `dist/` a S3 con cache headers diferenciados (assets con hash = immutable, root files = no-cache)
5. Invalida CloudFront cache

### Configuración requerida

**GitHub Environments** (dev, stg, prod) — variables por environment:
- `VITE_API_URL` — URL del API backend
- `AWS_S3_BUCKET` — Nombre del bucket S3
- `AWS_CLOUDFRONT_DISTRIBUTION_ID` — ID de la distribución CloudFront

**GitHub Secrets** (a nivel de repositorio):
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

**AWS** (por cada stage):
- Bucket S3 con block public access ON
- CloudFront con OAC, custom error responses (403/404 → `/index.html` con HTTP 200)
- IAM con permisos: `s3:PutObject`, `s3:DeleteObject`, `s3:ListBucket`, `cloudfront:CreateInvalidation`

## Autenticación

JWT almacenado en `localStorage` y cacheado en memoria (`_cachedToken` en `client.js`). Respuestas 401 limpian el token y redirigen a login automáticamente.