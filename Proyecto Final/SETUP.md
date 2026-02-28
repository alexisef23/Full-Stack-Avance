# Guía Rápida de Instalación - Leveling UP

## Paso 1: Configurar PostgreSQL y Base de Datos

```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE levelup_db;

# Salir
\q

# Ejecutar el script SQL
psql -U postgres -f backend/schema.sql -d levelup_db
```

## Paso 2: Configurar Backend

```bash
cd backend

# Copiar .env.example a .env
cp .env.example .env

# EDITAR .env con tus credenciales:
# - DB_PASSWORD (tu password de PostgreSQL)
# - JWT_SECRET (genera uno seguro)
# - GEMINI_API_KEY (obten en https://ai.google.dev)

# Instalar dependencias
npm install

# Iniciar servidor (default puerto 5000)
npm run dev
```

## Paso 3: Configurar Frontend

```bash
cd frontend

# Copiar .env.example a .env.local
cp .env.example .env.local

# Instalar dependencias
npm install

# Iniciar Next.js (default puerto 3000)
npm run dev
```

## Acceso a la Aplicación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## Primeros Pasos

1. Registrate en http://localhost:3000/auth/register
2. Inicia sesión con tus credenciales
3. Ve al dashboard y registra tu primer entrenamiento
4. Visualiza tu historial
5. Chatea con la IA en la sección Chat 🤖

## Crear un Usuario Admin (Opcional)

Para poder crear/editar/eliminar ejercicios en el catálogo, necesitas un usuario admin.

Ejecuta en tu base de datos PostgreSQL:

```sql
INSERT INTO usuarios (email, password, role)
VALUES ('admin@example.com', '$2a$10/hashed_password_here', 'admin');
```

O crea uno desde el script:

```bash
node backend/scripts/create-admin.js
```

## Troubleshooting

### "Connection refused" en la BD
- Verifica que PostgreSQL esté corriendo
- Comprueba las credenciales en .env

### "GEMINI_API_KEY no configurada"
- Obtén una API Key en: https://ai.google.dev
- Agregarla a backend/.env

### El frontend no se conecta al backend
- Verifica que backend esté corriendo en puerto 5000
- Revisa que NEXT_PUBLIC_API_URL sea correcto en frontend/.env.local

## Testing

```bash
cd backend
npm run test:unit
npm run test:integration
```

¡Listo! Ahora puedes empezar a usar Leveling UP 💪
