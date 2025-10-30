# Instituciones CRUD API

## API Flow Test Script

Run the full end-to-end flow against the local server:

```bash
chmod +x scripts/test-flow.sh
./scripts/test-flow.sh
```

Override base URL if needed:

```bash
BASE_URL=http://localhost:3000 ./scripts/test-flow.sh
```

The script performs:
- Create and verify institución (`universidad-buenos-aires`)
- Enrollment subscribe and DNI check
- Submit full enrollment for `EST002` (DNI `87654321`)
- List/get/update estudiante
- Analytics queries (Neo4j)
- Scholarship register and reads (Cassandra)
- Optional cleanup (commented out at bottom)

A RESTful API for managing educational institutions built with Node.js, TypeScript, Express, Mongoose, and Bun.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Bun](https://bun.sh/) - JavaScript runtime and package manager
- [Docker](https://www.docker.com/) - For running MongoDB
- [Git](https://git-scm.com/) - For cloning the repository

## Installation & Setup

### Quick Setup (Recommended)

```bash
git clone <repository-url>
cd instituciones-crud-api
./setup.sh
```

The setup script will:

- Check prerequisites (Bun, Docker)
- Install dependencies
- Create `.env` file
- Start MongoDB
- Verify everything is working

### Manual Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd instituciones-crud-api
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Environment Setup

Create a `.env` file in the root directory with the following content:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://admin:yx05%21%235YV%21CZQ0s0@localhost:27018/eduscale?authSource=admin
```

## Running the Application

### Option 1: Using Docker Compose (Recommended)

```bash
docker-compose up --build
```

### Option 2: Manual Setup

1. **Start MongoDB with Docker:**

   ```bash
   docker-compose up mongodb -d
   ```

2. **Run the API locally:**

   ```bash
   bun run dev
   bun run build
   bun run start
   ```

## API Endpoints

The API is available at `http://localhost:3000/api/v1/instituciones`

| Method | Endpoint | Description                          |
| ------ | -------- | ------------------------------------ |
| POST   | `/`      | Create a new institution (with slug) |
| GET    | `/`      | Get all institutions                 |
| GET    | `/:slug` | Get institution by slug              |
| PATCH  | `/:slug` | Update institution (partial)         |
| DELETE | `/:slug` | Delete institution                   |

## Example Usage

### Create an Institution

```bash
curl -X POST http://localhost:3000/api/v1/instituciones \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "my-university",
    "nombre": "My University",
    "estado": "ACTIVA",
    "configuracion_tema": {
      "logo_url": "https://example.com/logo.png",
      "favicon_url": null,
      "colores": {
        "primario": "#FF0000",
        "secundario": "#00FF00",
        "acento": "#0000FF",
        "texto_primario": "#FFFFFF"
      },
      "mensajes": {
        "titulo_bienvenida": "Welcome to My University",
        "subtitulo_bienvenida": "Apply now for 2025",
        "texto_footer": "© 2025 My University"
      }
    }
  }'
```

### Get All Institutions

```bash
curl http://localhost:3000/api/v1/instituciones
```

### Update an Institution

```bash
curl -X PATCH http://localhost:3000/api/v1/instituciones/my-university \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Updated University Name",
    "estado": "INACTIVA"
  }'
```

### Delete an Institution

```bash
curl -X DELETE http://localhost:3000/api/v1/instituciones/my-university
```

## Development

### Project Structure

```
src/
├── config/
│   └── database.ts
├── controllers/
│   └── institucion.controller.ts
├── middleware/
│   ├── errorHandler.ts
│   └── validation.ts
├── models/
│   └── institucion.model.ts
├── routes/
│   └── institucion.routes.ts
├── types/
│   └── institucion.types.ts
└── index.ts
```

### Available Scripts

- `bun run dev` - Start development server with hot reload
- `bun run build` - Build TypeScript to JavaScript
- `bun run start` - Start production server

### Database Schema

The institution document structure:

```json
{
  "_id": "string (auto-generated ObjectId)",
  "slug": "string (unique identifier for API routes)",
  "nombre": "string",
  "estado": "ACTIVA" | "INACTIVA" | "PENDIENTE_CONFIGURACION",
  "configuracion_tema": {
    "logo_url": "string",
    "favicon_url": "string | null",
    "colores": {
      "primario": "string",
      "secundario": "string",
      "acento": "string",
      "texto_primario": "string"
    },
    "mensajes": {
      "titulo_bienvenida": "string",
      "subtitulo_bienvenida": "string",
      "texto_footer": "string"
    }
  },
  "comite": {
    "comite_id": "string (auto-generated ObjectId)",
    "miembros": [
      {
        "miembro_id": "string (auto-generated ObjectId)",
        "nombre": "string",
        "apellido": "string",
        "mail": "string (email)"
      }
    ]
  },
  "metadata": {
    "fecha_creacion": "Date",
    "fecha_actualizacion": "Date",
    "version_config": "number"
  }
}
```

**Key Changes:**

- `_id` is now auto-generated by MongoDB (ObjectId)
- `slug` is the unique identifier used in API routes (e.g., `/api/v1/instituciones/my-university`)
- All CRUD operations now use `slug` instead of `_id` in the URL path
- `comite_id` is now at the root level of the `comite` object (auto-generated ObjectId)
- `miembro_id` is auto-generated for each committee member
- Committee structure: `comite: { comite_id: "...", miembros: [...] }`
- When creating/updating committee members, only provide `nombre`, `apellido`, and `mail` - IDs are generated automatically

## Troubleshooting

### Common Issues

1. **Port 3000 already in use:**

   ```bash
   lsof -ti:3000 | xargs kill -9
   ```

2. **MongoDB connection failed:**

   - Ensure Docker is running
   - Start MongoDB: `docker-compose up mongodb -d`
   - Check if MongoDB is accessible: `docker ps`

3. **Dependencies not found:**
   ```bash
   bun install
   ```

### Logs

- Development logs are shown in the terminal
- Production logs can be viewed with: `docker-compose logs api`

## Testing the Setup

After running the setup, you can test the API with these commands:

```bash
curl http://localhost:3000/api/v1/instituciones
curl -X POST http://localhost:3000/api/v1/instituciones \
  -H "Content-Type: application/json" \
  -d '{
    "_id": "test-uni",
    "nombre": "Test University",
    "estado": "ACTIVA",
    "configuracion_tema": {
      "logo_url": "https://example.com/logo.png",
      "favicon_url": null,
      "colores": {
        "primario": "#FF0000",
        "secundario": "#00FF00",
        "acento": "#0000FF",
        "texto_primario": "#FFFFFF"
      },
      "mensajes": {
        "titulo_bienvenida": "Welcome",
        "subtitulo_bienvenida": "Apply now",
        "texto_footer": "© 2025 Test University"
      }
    }
  }'

```

If you get a successful response, the API is working correctly! 🎉

### Database Setup

```bash
docker run -d --name mongodb -p 27018:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD='yx05!#5YV!CZQ0s0' \
  mongo

docker ps
docker logs mongodb

docker-compose up -d

docker exec -it mongodb mongosh -u admin -p 'yx05!#5YV!CZQ0s0'

```

Once inside mongosh

```
use eduscale

db.instituciones.insertMany([
  {
    "_id": "instituto-tecnologico-avanzado",
    "nombre": "Instituto Tecnológico Avanzado del Futuro",
    "estado": "ACTIVA",
    "configuracion_tema": {
      "logo_url": "https://cdn.eduscale.com/logos/ita-futuro.svg",
      "favicon_url": "https://cdn.eduscale.com/favicons/ita.ico",
      "colores": {
        "primario": "#1A1A2E",
        "secundario": "#16213E",
        "acento": "#00FFD1",
        "texto_primario": "#E94560"
      },
      "mensajes": {
        "titulo_bienvenida": "Bienvenido a la Vanguardia Educativa",
        "subtitulo_bienvenida": "Postula al ITA Futuro y construye el mañana",
        "texto_footer": "© 2025 ITA Futuro. Innovación y desarrollo."
      }
    },
    "metadata": {
      "fecha_creacion": new Date(),
      "fecha_actualizacion": new Date(),
      "version_config": 1
    }
  },
  {
    "_id": "conservatorio-bellas-artes",
    "nombre": "Conservatorio Nacional de Bellas Artes",
    "estado": "ACTIVA",
    "configuracion_tema": {
      "logo_url": "https://cdn.eduscale.com/logos/cnba.png",
      "favicon_url": null,
      "colores": {
        "primario": "#5D4037",
        "secundario": "#EFEBE9",
        "acento": "#D4AF37",
        "texto_primario": "#3E2723"
      },
      "mensajes": {
        "titulo_bienvenida": "Proceso de Admisión Artística 2026",
        "subtitulo_bienvenida": "Forma parte de nuestra tradición y excelencia",
        "texto_footer": "© 2025 Conservatorio Nacional de Bellas Artes."
      }
    },
    "metadata": {
      "fecha_creacion": new Date(),
      "fecha_actualizacion": new Date(),
      "version_config": 1
    }
  },
  {
    "_id": "escuela-primaria-del-sol",
    "nombre": "Escuela Primaria del Sol",
    "estado": "PENDIENTE_CONFIGURACION",
    "configuracion_tema": {
      "logo_url": "https://cdn.eduscale.com/logos/default.png",
      "favicon_url": null,
      "colores": {
        "primario": "#CCCCCC",
        "secundario": "#FFFFFF",
        "acento": "#888888",
        "texto_primario": "#000000"
      },
      "mensajes": {
        "titulo_bienvenida": "Portal de Admisiones",
        "subtitulo_bienvenida": "Bienvenido al proceso de inscripción.",
        "texto_footer": "© 2025 EduScale Platform."
      }
    },
    "metadata": {
      "fecha_creacion": new Date(),
      "fecha_actualizacion": new Date(),
      "version_config": 1
    }
  }
]);

```
