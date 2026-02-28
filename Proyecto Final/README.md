# Leveling UP - Fitness App

Aplicación Full Stack de fitness que permite a los usuarios registrar sus entrenamientos en el gimnasio y obtener recomendaciones personalizadas de una IA motivacional.

## 🏗️ Arquitectura

### Backend (Express.js + PostgreSQL)
- **Estructura en capas**: Routes → Controllers → Repositories → Domain
- **Autenticación**: JWT en cookies
- **Base de datos**: PostgreSQL (Supabase)
- **IA**: Integración con Google Gemini API

### Frontend (Next.js 15 + Tailwind CSS)
- **App Router** (nuevo sistema de Next.js)
- **Dark Mode** con colores neón (Azul + Morado)
- **Axios** para consumo de APIs
- **Autenticación** con tokens JWT

## 📋 Requisitos Previos

- Node.js 18+
- PostgreSQL
- API Key de Google Gemini
- Git

## 🚀 Instalación

### 1. Backend

```bash
cd backend
npm install
```

Crea un archivo `.env` con tus variables:
```env
DB_USER=postgres
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=levelup_db
JWT_SECRET=tu_secret_key_super_largo
GEMINI_API_KEY=tu_api_key_gemini
```

Crea la base de datos:
```bash
psql -U postgres -f schema.sql -d levelup_db
```

Inicia el servidor:
```bash
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
```

Crea `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Inicia la app:
```bash
npm run dev
```

## 📚 Archivo SQL

El archivo `backend/schema.sql` contiene:
- 3 tablas (usuarios, ejercicios_catalogo, historial_entrenamientos)
- 40 ejercicios seed
- Índices para optimización

## 🔐 Roles

### Admin
- CRUD completo sobre el catálogo de ejercicios

### User (Normal)
- Registrarse / Iniciar sesión
- Leer catálogo de ejercicios (con paginación)
- Registrar entrenamientos
- Ver historial personal
- Chat con IA

## 🤖 Características Principales

1. **Registro de Entrenamientos**
   - Seleccionar ejercicio
   - Ingresar series, reps y peso
   - Fecha del entrenamiento

2. **Historial Personal**
   - Ver todos los entrenamientos registrados
   - Paginación
   - Eliminar entrenamientos

3. **Chat de IA**
   - Análisis contextual del historial
   - Recomendaciones personalizadas
   - Sugerencias de progresión de carga

## 📁 Estructura del Proyecto

```
Proyecto Final/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── domain/
│   │   ├── middlewares/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── tests/
│   │   └── utils/
│   ├── schema.sql
│   ├── package.json
│   └── .env
├── frontend/
│   ├── app/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── components/
│   │   ├── api/
│   │   └── globals.css
│   ├── lib/
│   ├── package.json
│   └── .env.local
└── README.md
```

## 🧪 Testing

```bash
cd backend
npm run test:unit       # Unit tests
npm run test:integration # Integration tests
npm test                # Todos los tests
```

## 🛠️ Variables de Entorno

Ver `.env.example` en cada carpeta para la configuración necesaria.

## 📝 API Endpoints

### Usuarios
- `POST /api/usuarios/register` - Registro
- `POST /api/usuarios/login` - Login
- `POST /api/usuarios/logout` - Logout
- `GET /api/usuarios/profile` - Obtener perfil
- `PUT /api/usuarios/profile` - Actualizar perfil
- `DELETE /api/usuarios/profile` - Eliminar cuenta

### Ejercicios
- `GET /api/ejercicios?page=1&limit=10` - Listar (con paginación)
- `GET /api/ejercicios/:id` - Detalle
- `POST /api/ejercicios` - Crear (Admin)
- `PUT /api/ejercicios/:id` - Actualizar (Admin)
- `DELETE /api/ejercicios/:id` - Eliminar (Admin)

### Historial
- `GET /api/historial?page=1&limit=20` - Mi historial
- `POST /api/historial` - Registrar entrenamiento
- `GET /api/historial/:id` - Detalle
- `PUT /api/historial/:id` - Actualizar
- `DELETE /api/historial/:id` - Eliminar

### Chat IA
- `POST /api/chat/message` - Enviar mensaje a IA

## 📄 Licencia

MIT

## 👤 Autor

Proyecto Final - Curso Full Stack
