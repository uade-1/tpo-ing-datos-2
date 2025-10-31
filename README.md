# EduScale - Sistema de Postulación de Becas

Sistema completo de gestión de postulaciones y otorgamiento de becas educativas, construido con Next.js y Express, utilizando múltiples bases de datos NoSQL para diferentes casos de uso.

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Características Principales](#características-principales)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Documentación Adicional](#documentación-adicional)
- [Solución de Problemas](#solución-de-problemas)

## 📝 Descripción

EduScale es una plataforma completa que permite a instituciones educativas gestionar el proceso de postulación y otorgamiento de becas. El sistema incluye:

- **Frontend**: Aplicación web moderna desarrollada con Next.js 16, React 19 y TypeScript
- **Backend**: API REST construida con Express y TypeScript, ejecutándose sobre Bun
- **Bases de Datos NoSQL**: Integración multi-base de datos aprovechando las fortalezas de cada tecnología:
  - **MongoDB**: Almacenamiento principal de datos estructurados
  - **Redis**: Sistema de caché y gestión de bloqueos
  - **Neo4j**: Análisis de relaciones y grafos
  - **Cassandra**: Almacenamiento de datos históricos y analíticos

## ✨ Características Principales

- 🔐 Sistema de autenticación y autorización
- 📝 Formularios de postulación dinámicos con validación
- 📊 Dashboard con visualización de datos y analíticas
- 🎨 Sistema de temas personalizables por institución
- 📧 Integración con sistema de emails
- 🔍 Validación de DNI en tiempo real
- 📈 Análisis de relaciones entre estudiantes e instituciones
- 💾 Persistencia multi-base de datos optimizada

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐
│   Frontend      │
│   (Next.js)     │
│   Puerto 3005   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Backend API   │
│   (Express)     │
│   Puerto 3000   │
└────────┬────────┘
         │
    ┌────┴────┬────────┬──────────┐
    │         │        │          │
    ▼         ▼        ▼          ▼
┌────────┐ ┌──────┐ ┌──────┐ ┌──────────┐
│MongoDB │ │Redis │ │Neo4j │ │Cassandra │
│:27018  │ │:6379 │ │:7687 │ │  :9042   │
│        │ │      │ │      │ │          │
│Datos   │ │Caché │ │Grafos│ │Analytics │
│Princip.│ │&Lock │ │Relac.│ │Históricos│
└────────┘ └──────┘ └──────┘ └──────────┘
```

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

- **Node.js** (v18 o superior) - Para el frontend
  - Verificar instalación: `node --version`
  - Descargar desde: https://nodejs.org/
- **Bun** (v1.0 o superior) - Para el backend
  - Instalación: `curl -fsSL https://bun.sh/install | bash`
  - Verificar instalación: `bun --version`
- **Docker** y **Docker Compose** - Para las bases de datos
  - Verificar instalación: `docker --version` y `docker-compose --version`
  - Descargar desde: https://www.docker.com/get-started
- **Git** - Para clonar el repositorio
  - Verificar instalación: `git --version`

### Gestor de Paquetes (Frontend)

El proyecto soporta múltiples gestores de paquetes. Elige uno:

- **npm** (incluido con Node.js)
- **pnpm** (recomendado): `npm install -g pnpm`

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd tpo-dbs
```

### 2. Instalar Dependencias del Frontend

Navega a la raíz del proyecto e instala las dependencias:

```bash
# Con npm
npm install

# O con pnpm (recomendado)
pnpm install
```

### 3. Instalar Dependencias del Backend

Navega a la carpeta `backend` e instala las dependencias usando Bun:

```bash
cd backend
bun install
cd ..
```

### 4. Configurar Bases de Datos con Docker Compose

En la carpeta `backend`, levanta todos los servicios de bases de datos:

```bash
cd backend
docker-compose up -d
```

Esto iniciará:

- MongoDB en el puerto 27018
- Redis en el puerto 6379
- Neo4j en los puertos 7474 (interfaz web) y 7687 (Bolt)
- Cassandra en el puerto 9042

Para verificar que todos los servicios están corriendo:

```bash
docker ps
```

Deberías ver los contenedores de mongodb, redis, neo4j y cassandra en estado "Up".

## ⚙️ Configuración

### Configuración del Backend

1. Crea un archivo `.env` en la carpeta `backend/`:

```bash
cd backend
touch .env
```

2. Agrega las siguientes variables de entorno al archivo `.env`:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://admin:yx05%21%235YV%21CZQ0s0@localhost:27018/eduscale?authSource=admin
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
ENROLLMENT_RESERVATION_TTL=900
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password123
CASSANDRA_CONTACT_POINTS=localhost
CASSANDRA_PORT=9042
CASSANDRA_KEYSPACE=eduscale_scholarships
CASSANDRA_DC=datacenter1
```

**Nota**: Si usas el script de setup automático (`setup.sh` en `backend/`), el archivo `.env` se creará automáticamente con la configuración correcta.

### Configuración del Frontend

1. **Configurar el slug de la institución**

Edita el archivo `lib/api-config.ts` y actualiza el `INSTITUCION_SLUG`:

```typescript
export const API_CONFIG = {
  INSTITUCION_SLUG: "tu-slug-de-institucion", // Cambiar aquí
  // ...
};
```

O configura la variable de entorno:

```bash
export NEXT_PUBLIC_INSTITUCION_SLUG="tu-slug-de-institucion"
```

2. **Configurar la URL base de la API** (opcional)

Si tu API backend corre en un dominio diferente, configura:

```bash
export NEXT_PUBLIC_API_BASE_URL="http://localhost:3000"
```

El frontend ya está configurado por defecto para usar `http://localhost:3000` mediante rewrites en `next.config.mjs`.

## ▶️ Ejecución

### Opción 1: Ejecución Manual (Desarrollo)

#### Backend

Desde la carpeta `backend/`:

```bash
cd backend

# Modo desarrollo (con hot reload)
bun run dev

# O compilar y ejecutar en producción
bun run build
bun run start
```

El backend estará disponible en: `http://localhost:3000`

#### Frontend

Desde la raíz del proyecto:

```bash
# Modo desarrollo
npm run dev
# o
pnpm dev

# Modo producción (requiere build primero)
npm run build
npm run start
# o
pnpm build
pnpm start
```

El frontend estará disponible en: `http://localhost:3005`

### Opción 2: Docker Compose Completo (Backend)

Desde la carpeta `backend/`, puedes levantar el backend junto con todas las bases de datos:

```bash
cd backend
docker-compose up --build
```

Esto iniciará todos los servicios (bases de datos + API) en contenedores Docker.

### Verificar que Todo Funciona

1. **Verificar Backend**:

   ```bash
   curl http://localhost:3000/api/v1/instituciones
   ```

   Deberías recibir una respuesta JSON (posiblemente un array vacío si no hay instituciones).

2. **Verificar Frontend**:
   Abre tu navegador en `http://localhost:3005` y deberías ver la aplicación.

3. **Verificar Bases de Datos**:
   ```bash
   docker ps
   ```
   Todos los contenedores deberían estar corriendo.

## 📁 Estructura del Proyecto

```
tpo-dbs/
├── app/                    # Frontend Next.js (App Router)
│   ├── api/               # API routes del frontend
│   ├── dashboard/         # Página del dashboard
│   ├── login/             # Página de login
│   └── ...
├── backend/               # Backend Express
│   ├── src/
│   │   ├── config/       # Configuración de bases de datos
│   │   ├── controllers/  # Controladores
│   │   ├── models/       # Modelos de datos
│   │   ├── routes/       # Rutas de la API
│   │   ├── services/     # Lógica de negocio
│   │   └── index.ts      # Punto de entrada
│   ├── docker-compose.yml # Configuración Docker
│   └── setup.sh          # Script de configuración automática
├── components/            # Componentes React reutilizables
├── lib/                  # Utilidades y configuraciones
├── public/               # Archivos estáticos
└── README.md            # Este archivo
```

## 📚 Documentación Adicional

Este repositorio incluye documentación adicional:

- **[API_INTEGRATION.md](./API_INTEGRATION.md)**: Guía de integración con la API backend
- **[DOCUMENTACION_BASES_DATOS_NOSQL.md](./DOCUMENTACION_BASES_DATOS_NOSQL.md)**: Documentación técnica detallada sobre la integración de bases de datos NoSQL
- **[backend/README.md](./backend/README.md)**: Documentación específica del backend (en inglés)

## 🔧 Solución de Problemas

### Error: Puerto 3000 ya está en uso

```bash
# En macOS/Linux
lsof -ti:3000 | xargs kill -9

# O cambia el puerto en backend/.env
PORT=3001
```

### Error: Puerto 3005 ya está en uso

```bash
# En macOS/Linux
lsof -ti:3005 | xargs kill -9

# O cambia el puerto en package.json
"dev": "next dev -p 3006"
```

### MongoDB no se conecta

1. Verifica que Docker esté corriendo:

   ```bash
   docker ps
   ```

2. Verifica que el contenedor de MongoDB esté activo:

   ```bash
   docker ps | grep mongodb
   ```

3. Reinicia el contenedor si es necesario:

   ```bash
   cd backend
   docker-compose restart mongodb
   ```

4. Verifica los logs:
   ```bash
   docker logs mongodb
   ```

### Error: Bun no encontrado

Si Bun no está instalado o no está en el PATH:

1. Instala Bun:

   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

2. Añade Bun al PATH (sigue las instrucciones después de la instalación)

3. Reinicia tu terminal

### Dependencias no se instalan correctamente

**Frontend**:

```bash
# Limpia node_modules y reinstala
rm -rf node_modules package-lock.json pnpm-lock.yaml
npm install
# o
pnpm install
```

**Backend**:

```bash
cd backend
rm -rf node_modules
bun install
```

### Error de conexión a bases de datos

Asegúrate de que todos los servicios estén corriendo:

```bash
cd backend
docker-compose ps
```

Si algún servicio no está corriendo:

```bash
docker-compose up -d
```

Espera unos segundos para que todos los servicios inicien completamente antes de ejecutar la aplicación.

### Frontend no se conecta al Backend

1. Verifica que el backend esté corriendo en `http://localhost:3000`
2. Verifica la configuración en `next.config.mjs` (rewrites)
3. Verifica las variables de entorno si cambiaste la URL base

## 🤝 Contribuir

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es parte de un trabajo práctico para la materia Ingeniería de Datos 2.

---

**¿Necesitas ayuda?** Revisa la documentación adicional o abre un issue en el repositorio.
