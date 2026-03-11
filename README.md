# Repeat

Aplicación completa de gestión de programas de fidelización con frontend (React + Vite) y backend (Node.js + Express).

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ instalado
- npm o yarn

### 1. Configurar el Backend

```bash
# Ir a la carpeta del backend
cd backend

# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env

# Editar .env y cambiar JWT_SECRET por un valor seguro
# (puedes usar: openssl rand -base64 32)

# Iniciar el servidor backend
npm run dev
```

El backend estará disponible en `http://localhost:3000`

### 2. Configurar el Frontend

En una nueva terminal:

```bash
# Volver a la raíz del proyecto
cd ..

# Instalar dependencias del frontend
npm install

# Crear archivo .env en la raíz
echo "VITE_API_URL=http://localhost:3000/api" > .env
echo "VITE_LOGIN_URL=/login" >> .env

# Iniciar el frontend
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## 📁 Estructura del Proyecto

```
repeat/
├── backend/              # Backend API (Node.js + Express)
│   ├── database/        # Base de datos SQLite
│   ├── routes/          # Rutas de la API
│   ├── middleware/      # Middleware (auth, etc.)
│   └── server.js        # Servidor principal
├── src/                 # Frontend (React + Vite)
│   ├── api/             # Cliente API
│   ├── components/      # Componentes React
│   └── pages/           # Páginas de la aplicación
└── README.md
```

## 🔧 Configuración

### Variables de Entorno del Backend (`backend/.env`)

```env
PORT=3000
JWT_SECRET=tu_secret_super_seguro_aqui
FRONTEND_URL=http://localhost:5173
UPLOAD_DIR=./uploads
```

### Variables de Entorno del Frontend (`.env` en la raíz)

```env
VITE_API_URL=http://localhost:3000/api
VITE_LOGIN_URL=/login
```

## 📚 Documentación

- **Backend**: Ver [backend/README.md](backend/README.md) para documentación completa de la API
- **Frontend**: El cliente API está en `src/api/client.js`

## 🛠️ Scripts Disponibles

### Frontend
- `npm run dev` - Iniciar servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Previsualizar build de producción

### Backend
- `npm run dev` - Iniciar servidor con recarga automática
- `npm start` - Iniciar servidor en producción
- `npm run init-db` - Reinicializar base de datos

## 🎯 Primeros Pasos

1. **Inicia el backend** primero (puerto 3000)
2. **Luego inicia el frontend** (puerto 5173)
3. **Registra un usuario** nuevo desde el frontend
4. **Crea un negocio** cuando te lo solicite
5. **¡Empieza a usar la aplicación!**

## 📝 Notas Importantes

- La base de datos SQLite se crea automáticamente al iniciar el backend
- Los archivos subidos se guardan en `backend/uploads/`
- En producción, cambia `JWT_SECRET` por un valor seguro y aleatorio
- Las funciones de integración (email, LLM, etc.) están simuladas - necesitarás implementarlas según tus necesidades

## 🔐 Autenticación

El sistema usa JWT (JSON Web Tokens) para autenticación. El token se almacena automáticamente en `localStorage` del navegador después del login.

## 🚀 Despliegue en Producción

### Despliegue en Vercel

La aplicación está lista para desplegarse en Vercel y se conecta directamente al backend AWS.

**Pasos rápidos:**

1. Conecta tu repositorio a Vercel
2. Vercel detectará automáticamente que es un proyecto Vite
3. No se requieren variables de entorno (usa el backend AWS por defecto)
4. Haz clic en "Deploy"

**Backend configurado:**
- URL: `https://uvlrwbjp35.execute-api.us-east-1.amazonaws.com/dev`
- La aplicación se conecta automáticamente a este backend

Para más detalles sobre el despliegue, consulta [DEPLOY.md](DEPLOY.md).

## 💡 Próximos Pasos

Para producción, considera:

1. Cambiar SQLite por PostgreSQL o MySQL
2. Implementar envío real de emails
3. Configurar almacenamiento en la nube (AWS S3, etc.)
4. Agregar tests automatizados
5. Configurar HTTPS
6. Implementar rate limiting