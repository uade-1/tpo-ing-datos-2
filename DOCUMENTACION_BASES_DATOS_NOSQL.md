# Documentación Técnica: Integración de Bases de Datos NoSQL

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Arquitectura General del Sistema](#arquitectura-general-del-sistema)
3. [Integración por Base de Datos](#integración-por-base-de-datos)
4. [Teorema CAP y Decisiones de Diseño](#teorema-cap-y-decisiones-de-diseño)
5. [Flujo de Datos entre Bases de Datos](#flujo-de-datos-entre-bases-de-datos)
6. [Justificación de Elección de Modelos](#justificación-de-elección-de-modelos)
7. [Conclusiones](#conclusiones)

---

## Introducción

Este proyecto fue desarrollado con el objetivo de explorar y aprender sobre diferentes modelos de bases de datos NoSQL, implementando un sistema multi-base de datos que aprovecha las fortalezas específicas de cada tecnología según los diferentes casos de uso dentro de la aplicación.

El sistema gestiona un proceso de postulación y otorgamiento de becas educativas, donde cada base de datos cumple un rol específico en el flujo de datos y procesamiento de información.

---

## Arquitectura General del Sistema

El sistema utiliza cuatro bases de datos NoSQL distintas, cada una optimizada para un propósito específico:

```
┌─────────────────┐
│   Frontend      │
│  (Next.js)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Backend API   │
│   (Express)     │
└────────┬────────┘
         │
    ┌────┴────┬────────┬──────────┐
    │         │        │          │
    ▼         ▼        ▼          ▼
┌────────┐ ┌──────┐ ┌──────┐ ┌──────────┐
│MongoDB │ │Redis │ │Neo4j │ │Cassandra │
│        │ │      │ │      │ │          │
│Datos   │ │Caché │ │Grafos│ │Analytics │
│Princip.│ │&Lock │ │Relac.│ │Históricos│
└────────┘ └──────┘ └──────┘ └──────────┘
```

---

## Integración por Base de Datos

### 1. MongoDB - Base de Datos Principal

#### Librería Utilizada

**Mongoose v8.0.3**

```typescript
import mongoose from "mongoose";
```

Mongoose es un ODM (Object Document Mapper) para MongoDB que proporciona:

- Esquemas tipados con TypeScript
- Validación de datos a nivel de modelo
- Middleware de hooks (pre/post save)
- Queries tipadas con autocompletado
- Conexión y pooling de conexiones automático

#### Configuración

```1:19:backend/src/config/database.ts
import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI =
      process.env.MONGODB_URI ||
      "mongodb://admin:yx05%21%235YV%21CZQ0s0@localhost:27018/eduscale?authSource=admin";

    await mongoose.connect(mongoURI);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
```

#### Uso en el Sistema

MongoDB se utiliza como base de datos principal para:

1. **Almacenamiento de Instituciones Educativas**

   - Esquemas complejos con documentos anidados
   - Configuración de temas personalizables
   - Información de comités de evaluación

2. **Almacenamiento de Estudiantes/Postulantes**

   - Documentos completos con estado de postulación
   - Historial de cambios (mediante timestamps)
   - Relaciones flexibles mediante referencias

3. **Suscripciones de Email**
   - Tracking de conversiones

#### Modelos Principales

- `EstudianteModel`: Almacena toda la información de postulantes
- `InstitucionModel`: Datos completos de instituciones
- `EmailSubscriptionModel`: Suscripciones y conversiones

---

### 2. Redis - Caché y Control de Concurrencia

#### Librería Utilizada

**ioredis v5.3.2**

```typescript
import Redis from "ioredis";
```

ioredis es un cliente Redis robusto para Node.js que ofrece:

- Soporte para operaciones atómicas (SETNX, etc.)
- Reintentos automáticos y manejo de failover
- Eventos de conexión para monitoreo
- Pooling de conexiones eficiente
- Soporte para clusters de Redis

#### Configuración

```1:67:backend/src/config/redis.ts
import Redis from "ioredis";

let redis: Redis | null = null;

const connectRedis = async (): Promise<Redis> => {
  if (redis) {
    return redis;
  }

  try {
    const redisConfig = {
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT || "6379"),
      password: process.env.REDIS_PASSWORD || undefined,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      keepAlive: 30000,
    };

    redis = new Redis(redisConfig);

    redis.on("connect", () => {
      console.log("Redis connected successfully");
    });

    redis.on("error", (error) => {
      console.error("Redis connection error:", error);
    });

    redis.on("close", () => {
      console.log("Redis connection closed");
    });

    redis.on("reconnecting", () => {
      console.log("Redis reconnecting...");
    });

    // Test the connection
    await redis.ping();
    console.log("Redis ping successful");

    return redis;
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    throw error;
  }
};
```

#### Uso en el Sistema

Redis cumple dos funciones críticas:

1. **Caché de Consultas Frecuentes**

   - Verificación rápida de existencia de DNI
   - Reducción de carga en MongoDB
   - TTL automático para invalidación

2. **Control de Concurrencia Atómico**
   - Reservas temporales de DNI durante procesamiento
   - Prevención de inscripciones duplicadas simultáneas
   - Operaciones atómicas para alta concurrencia (2M+ requests)

#### Patrón de Reserva Atómica

```106:133:backend/src/services/enrollmentCache.ts
  /**
   * Atomically reserve a DNI for a specific carrera at a specific institution using Redis SETNX
   * Returns true if reservation successful, false if already exists
   */
  async reserveDNIForCarrera(
    dni: string,
    carrera_interes: string,
    institucion_slug: string,
    ttl: number = DEFAULT_TTL
  ): Promise<boolean> {
    try {
      const reservationKey = `${RESERVATION_PREFIX}${dni}:${carrera_interes}:${institucion_slug}`;

      // Atomic operation: SET if Not eXists
      const result = await this.redis.set(
        reservationKey,
        "reserved",
        "EX",
        ttl,
        "NX"
      );

      return result === "OK";
    } catch (error) {
      console.error("Error reserving DNI for carrera:", error);
      throw new Error("Failed to reserve DNI for carrera") as ApiError;
    }
  }
```

Este patrón garantiza que solo un proceso puede reservar un DNI para una carrera específica a la vez, evitando condiciones de carrera.

---

### 3. Neo4j - Base de Datos de Grafos

#### Librería Utilizada

**neo4j-driver v6.0.0**

```typescript
import neo4j, { Driver, Session } from "neo4j-driver";
```

El driver oficial de Neo4j proporciona:

- Conexiones mediante protocolo Bolt
- Sesiones transaccionales
- Queries Cypher nativas
- Manejo de tipos de datos específicos de grafos
- Pooling de conexiones

#### Configuración

```1:37:backend/src/config/neo4j.ts
import neo4j, { Driver, Session } from "neo4j-driver";
import dotenv from "dotenv";

dotenv.config();

let driver: Driver | null = null;

export const connectNeo4j = async (): Promise<void> => {
  const uri = process.env.NEO4J_URI || "bolt://localhost:7687";
  const user = process.env.NEO4J_USER || "neo4j";
  const password = process.env.NEO4J_PASSWORD || "password123";

  driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

  // Verificar conexión
  const session = driver.session();
  try {
    await session.run("RETURN 1");
    console.log("Neo4j conectado exitosamente");
  } finally {
    await session.close();
  }
};
```

#### Uso en el Sistema

Neo4j almacena y gestiona relaciones entre entidades:

1. **Nodos Principales**

   - `Estudiante`: Representa postulantes
   - `Institucion`: Instituciones educativas
   - `Carrera`: Programas académicos

2. **Relaciones Tipadas**
   - `(Institucion)-[:OFRECE]->(Carrera)`: Qué carreras ofrece cada institución
   - `(Estudiante)-[:INTERES]->(Carrera)`: Estado inicial de postulación
   - `(Estudiante)-[:ENTREVISTA]->(Carrera)`: En proceso de entrevista
   - `(Estudiante)-[:ACEPTADO]->(Carrera)`: Aceptado en la carrera
   - `(Estudiante)-[:RECHAZADO]->(Carrera)`: Rechazado

#### Ejemplo de Sincronización

```61:91:backend/src/services/neo4jSync.ts
  // Crear relación de aplicación con estado
  async createEnrollmentRelation(
    dni: string,
    carreraInteres: string,
    estado: string,
    fechaInscripcion: Date,
    fechaEntrevista?: Date
  ): Promise<void> {
    const session = this.driver.session();
    try {
      // Crear relación de estado específica
      const relationshipType = `:${estado}`; // :INTERES, :ENTREVISTA, :ACEPTADO, :RECHAZADO

      await session.run(
        `MATCH (e:Estudiante {dni: $dni})
         MATCH (c:Carrera {nombre: $carreraInteres})
         MERGE (e)-[r${relationshipType}]->(c)
         SET r.fecha_inscripcion = datetime($fechaInscripcion),
             r.fecha_entrevista = datetime($fechaEntrevista),
             r.ultima_actualizacion = datetime()`,
        {
          dni,
          carreraInteres,
          fechaInscripcion: fechaInscripcion.toISOString(),
          fechaEntrevista: fechaEntrevista?.toISOString() || null,
        }
      );
    } finally {
      await session.close();
    }
  }
```

---

### 4. Cassandra - Base de Datos Distribuida para Analytics

#### Librería Utilizada

**cassandra-driver v4.8.0**

```typescript
import { Client } from "cassandra-driver";
```

El driver oficial de Apache Cassandra ofrece:

- Distribución automática de datos
- Queries preparadas para mejor performance
- Control de consistencia (ONE, QUORUM, ALL)
- Soporte para tipos de datos complejos (maps, sets, lists)
- Replicación automática

#### Configuración

```8:48:backend/src/config/cassandra.ts
export const connectCassandra = async (): Promise<void> => {
  const contactPoints = (
    process.env.CASSANDRA_CONTACT_POINTS || "localhost"
  ).split(",");
  const port = parseInt(process.env.CASSANDRA_PORT || "9042");
  const localDataCenter = process.env.CASSANDRA_DC || "datacenter1";
  const keyspace = process.env.CASSANDRA_KEYSPACE || "eduscale_scholarships";

  client = new Client({
    contactPoints,
    localDataCenter,
    keyspace: "system", // Conectar primero a system para crear keyspace
  });

  await client.connect();
  console.log("Cassandra conectado exitosamente");

  // Crear keyspace si no existe
  await client.execute(`
    CREATE KEYSPACE IF NOT EXISTS ${keyspace}
    WITH replication = {
      'class': 'SimpleStrategy',
      'replication_factor': 1
    }
  `);

  // Cambiar a keyspace de la aplicación
  await client.shutdown();

  client = new Client({
    contactPoints,
    localDataCenter,
    keyspace,
  });

  await client.connect();
  console.log(`Cassandra usando keyspace: ${keyspace}`);

  // Crear tabla si no existe
  await createScholarshipTable();
};
```

#### Modelo de Datos

La tabla `estudiantes_becados` utiliza una estrategia de particionado diseñada para consultas eficientes:

```50:79:backend/src/config/cassandra.ts
const createScholarshipTable = async (): Promise<void> => {
  if (!client) throw new Error("Cassandra client no inicializado");

  await client.execute(`
    CREATE TABLE IF NOT EXISTS estudiantes_becados (
      institucion_slug text,
      anio int,
      dni text,
      id_postulante text,
      nombre text,
      apellido text,
      sexo text,
      mail text,
      carrera_interes text,
      departamento_interes text,
      fecha_inscripcion timestamp,
      fecha_interes timestamp,
      fecha_entrevista timestamp,
      fecha_aceptacion timestamp,
      documentos map<text, text>,
      comite_id text,
      comite_decision text,
      comite_comentarios text,
      comite_fecha_revision timestamp,
      PRIMARY KEY ((institucion_slug, anio), dni)
    ) WITH CLUSTERING ORDER BY (dni ASC)
  `);

  console.log("Tabla estudiantes_becados creada/verificada");
};
```

**Diseño de Primary Key:**

- **Partition Key**: `(institucion_slug, anio)` - Particiona datos por institución y año
- **Clustering Key**: `dni` - Ordena estudiantes dentro de cada partición

Este diseño optimiza consultas como:

- "Obtener todos los becados de Universidad X en 2024"
- "Obtener estudiante específico por DNI en institución y año"

#### Uso en el Sistema

Cassandra almacena solo estudiantes con decisiones finales:

- Estados: `ACEPTADO` o `RECHAZADO`
- Optimizado para reportes y análisis históricos
- Datos inmutable-oriented (append-only)

---

## Teorema CAP y Decisiones de Diseño

El teorema CAP establece que en un sistema distribuido solo se pueden garantizar dos de las tres propiedades:

- **C**onsistencia: Todos los nodos ven los mismos datos simultáneamente
- **A**vailability: El sistema sigue respondiendo incluso con fallos
- **P**artition tolerance: El sistema continúa funcionando a pesar de particiones de red

A continuación se analiza cómo cada base de datos maneja estos trade-offs:

### MongoDB - CP (Consistency + Partition Tolerance)

**Configuración CAP: CP**

MongoDB prioriza **Consistencia** y **Tolerancia a Particiones**, sacrificando disponibilidad total en algunos escenarios.

#### Justificación

1. **Consistencia Fuerte**

   - MongoDB garantiza lecturas consistentes por defecto
   - Write Concern permite controlar el nivel de confirmación
   - Ideal para datos transaccionales críticos como inscripciones

2. **Replica Sets**

   - Configuración de réplicas para alta disponibilidad
   - Elección de Primary con consenso
   - Durante particiones, solo el primary acepta writes

3. **Casos de Uso en el Sistema**
   ```typescript
   // Operaciones críticas que requieren consistencia
   const savedEstudiante = await estudiante.save(); // Write confirmado
   const estudiante = await EstudianteModel.findOne({ dni }); // Read consistente
   ```

#### Trade-offs

- Si el Primary se desconecta, las escrituras se bloquean temporalmente
- Aceptable porque los datos son críticos y la consistencia es prioritaria
- Fallbacks implementados en la aplicación para manejar errores

---

### Redis - AP (Availability + Partition Tolerance)

**Configuración CAP: AP**

Redis prioriza **Alta Disponibilidad** y **Tolerancia a Particiones**, eventualmente consistente.

#### Justificación

1. **Alta Disponibilidad**

   - Redis replica datos a múltiples nodos
   - Puede seguir funcionando con algunos nodos caídos
   - Respuesta inmediata es crítica para caché y locks

2. **Consistencia Eventual**

   - Operaciones atómicas (SETNX) garantizan consistencia a nivel de key individual
   - Replicación asíncrona entre nodos
   - Aceptable para datos de caché y reservas temporales

3. **Casos de Uso en el Sistema**

   ```typescript
   // Lock atómico - consistencia garantizada por operación única
   const result = await this.redis.set(
     reservationKey,
     "reserved",
     "EX",
     ttl,
     "NX" // SET if Not eXists - atómico
   );
   ```

4. **TTL Automático**
   - Las reservas expiran automáticamente
   - Prevención de locks permanentes
   - Self-healing del sistema

#### Trade-offs

- Si hay partición, ambos lados pueden servir datos diferentes temporalmente
- Aceptable porque: (a) las reservas tienen TTL, (b) los datos se validan en MongoDB después
- Los datos de caché son "best effort" - si falla, se consulta la fuente

---

### Neo4j - CA (Consistency + Availability)

**Configuración CAP: CA**

En configuración standalone (no-cluster), Neo4j prioriza **Consistencia** y **Alta Disponibilidad**.

#### Justificación

1. **Consistencia de Grafos**

   - Las relaciones deben ser consistentes para análisis correctos
   - Queries Cypher garantizan consistencia transaccional
   - Ideal para análisis de relaciones complejas

2. **Alta Disponibilidad mediante Replicas**

   - Neo4j Enterprise permite réplicas de lectura
   - Writes siempre van al primary
   - Reads pueden distribuirse

3. **Casos de Uso en el Sistema**
   ```cypher
   // Query consistente para relaciones
   MATCH (e:Estudiante {dni: $dni})-[r:ACEPTADO]->(c:Carrera)
   RETURN e, r, c
   ```

#### Trade-offs

- En particiones, el primary puede quedar aislado
- Las réplicas de lectura pueden quedar desactualizadas
- Aceptable porque los datos de grafos no son críticos para el flujo principal (son complementarios)

---

### Cassandra - AP (Availability + Partition Tolerance)

**Configuración CAP: AP**

Cassandra prioriza **Alta Disponibilidad** y **Tolerancia a Particiones**, con consistencia eventual configurable.

#### Justificación

1. **Alta Disponibilidad Extrema**

   - Arquitectura distribuida sin single point of failure
   - Múltiples nodos pueden servir requests
   - Diseñado para funcionar con nodos caídos

2. **Consistencia Configurable**

   - Niveles de consistencia ajustables por query:
     - `ONE`: Máxima disponibilidad, consistencia eventual
     - `QUORUM`: Balance entre consistencia y disponibilidad
     - `ALL`: Máxima consistencia, menor disponibilidad

3. **Uso en el Sistema**

   ```typescript
   // Query con consistencia ONE para máxima disponibilidad
   const result = await this.client.execute(query, params, {
     prepare: true,
     consistency: 1, // ONE
   });
   ```

4. **Casos de Uso Apropiados**
   - Datos históricos e inmutable-oriented
   - Reportes y analytics que toleran ligera inconsistencia
   - Alta velocidad de escritura

#### Trade-offs

- Con consistencia `ONE`, diferentes nodos pueden mostrar datos ligeramente diferentes
- Aceptable porque:
  - Los datos son históricos (append-only)
  - Los reportes no requieren consistencia perfecta en tiempo real
  - La velocidad y disponibilidad son prioritarias

#### Modelo de Replicación

```26:32:backend/src/config/cassandra.ts
  // Crear keyspace si no existe
  await client.execute(`
    CREATE KEYSPACE IF NOT EXISTS ${keyspace}
    WITH replication = {
      'class': 'SimpleStrategy',
      'replication_factor': 1
    }
  `);
```

En desarrollo: `replication_factor: 1` (sin replicación)
En producción: Típicamente `replication_factor: 3` para alta disponibilidad

---

## Flujo de Datos entre Bases de Datos

El sistema implementa un flujo de datos coordinado donde cada base de datos cumple un rol específico. A continuación se describe el flujo completo desde la inscripción hasta el almacenamiento final.

### Flujo de Inscripción de Estudiante

```
┌─────────────────────────────────────────────────────────────┐
│ 1. POST /api/v1/enrollment/submit                            │
│    Usuario envía formulario de inscripción                   │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Verificación de Institución                               │
│    MongoDB: Consulta si la institución existe                │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Verificación de DNI (Redis + MongoDB)                     │
│    Redis: Caché O(1) check si DNI ya existe                 │
│    MongoDB: Fallback si no está en caché                     │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Reserva Atómica de DNI (Redis)                            │
│    SETNX con TTL de 15 minutos                               │
│    Previene procesamiento simultáneo                        │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Creación en MongoDB                                        │
│    Guardar documento completo del estudiante                 │
│    Estado inicial: "INTERES"                                 │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Confirmación en Redis                                     │
│    Marcar DNI como permanentemente inscrito                  │
│    Liberar reserva temporal                                  │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. Sincronización con Neo4j (Asíncrono)                      │
│    - Crear nodo Estudiante                                   │
│    - Crear nodo Institución (si no existe)                   │
│    - Crear nodo Carrera (si no existe)                       │
│    - Crear relación OFRECE (Institución -> Carrera)          │
│    - Crear relación INTERES (Estudiante -> Carrera)          │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. Respuesta al Cliente                                      │
│    Retornar éxito con datos del estudiante                   │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de Actualización de Estado

Cuando un estudiante cambia de estado (INTERES → ENTREVISTA → ACEPTADO/RECHAZADO):

```
┌─────────────────────────────────────────────────────────────┐
│ 1. PUT /api/v1/estudiantes/:id_postulante                    │
│    Administrador actualiza estado del estudiante             │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Actualización en MongoDB                                  │
│    Update documento con nuevo estado                         │
│    Actualizar campos comité y fecha_resolucion               │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Actualización en Neo4j (Siempre)                          │
│    - Eliminar relación antigua (ej: INTERES)                 │
│    - Crear relación nueva (ej: ACEPTADO)                     │
│    - Actualizar timestamps                                    │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Sincronización con Cassandra (Solo si ACEPTADO/RECHAZADO)│
│    Si estado es ACEPTADO o RECHAZADO:                        │
│    - Insertar en tabla estudiantes_becados                    │
│    - Partición por (institucion_slug, año)                   │
│    - Datos históricos para analytics                         │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Respuesta al Cliente                                      │
│    Retornar estudiante actualizado                            │
└─────────────────────────────────────────────────────────────┘
```

### Detalle de Implementación

#### Sincronización MongoDB → Neo4j

```199:228:backend/src/controllers/enrollment.ts
    // Sincronizar con Neo4j
    try {
      await neo4jSyncService.syncEstudiante(
        dni,
        enrollmentData.nombre,
        enrollmentData.apellido
      );
      await neo4jSyncService.syncInstitucion(
        institucion_slug,
        institution.nombre
      );
      await neo4jSyncService.syncCarrera(
        carrera_interes,
        enrollmentData.departamento_interes,
        institucion_slug
      );
      await neo4jSyncService.createEnrollmentRelation(
        dni,
        carrera_interes,
        enrollmentData.estado,
        new Date(enrollmentData.fecha_interes),
        enrollmentData.fecha_entrevista
          ? new Date(enrollmentData.fecha_entrevista)
          : undefined
      );
    } catch (neo4jError) {
      console.error("Error sincronizando con Neo4j:", neo4jError);
      // No fallar el enrollment si Neo4j falla
    }
```

**Características:**

- Sincronización **asíncrona** - No bloquea el flujo principal
- **Tolerante a fallos** - Si Neo4j falla, el enrollment continúa
- **Idempotente** - Puede ejecutarse múltiples veces sin duplicar datos (MERGE)

#### Sincronización MongoDB → Cassandra

```171:188:backend/src/controllers/estudiante.ts
    // Si el estado cambió a ACEPTADO o RECHAZADO, registrar en Cassandra
    if (
      (updateData.estado === "ACEPTADO" || updateData.estado === "RECHAZADO") &&
      existingEstudiante.estado !== updateData.estado
    ) {
      try {
        const estudiantePlain = (estudiante as any).toObject
          ? (estudiante as any).toObject()
          : (estudiante as any);
        await cassandraService.registerScholarship(estudiantePlain as any);
        console.log(
          `Estudiante ${estudiante.dni} registrado en Cassandra con estado ${updateData.estado}`
        );
      } catch (cassandraError) {
        console.error("Error registrando en Cassandra:", cassandraError);
        // No fallar la actualización si Cassandra falla
      }
    }
```

**Características:**

- Sincronización **selectiva** - Solo estudiantes con decisión final
- **Tolerante a fallos** - No bloquea actualización en MongoDB
- **Datos históricos** - Cassandra almacena snapshot del momento de decisión

### Flujo de Lectura de Datos

#### Consulta de Estadísticas por Institución

```
Cliente solicita estadísticas
         │
         ▼
Redis: Cache check (opcional)
         │
         ├─ Hit: Retornar desde caché
         │
         └─ Miss: Consultar MongoDB
                   │
                   ▼
            Agregación MongoDB:
            - Total inscripciones
            - Por estado (INTERES, ENTREVISTA, ACEPTADO, RECHAZADO)
                   │
                   ▼
            Cachear resultado en Redis
            Retornar al cliente
```

#### Consulta de Relaciones en Neo4j

```
Cliente solicita gráfico de relaciones
         │
         ▼
Neo4j: Query Cypher
         │
         ├─ MATCH (i:Institucion)-[:OFRECE]->(c:Carrera)
         ├─ MATCH (e:Estudiante)-[:ACEPTADO]->(c:Carrera)
         └─ RETURN relaciones
                   │
                   ▼
            Retornar grafo completo
            para visualización
```

#### Consulta de Becas Históricas en Cassandra

```
Cliente solicita becas por institución/año
         │
         ▼
Cassandra: Query por partition key
         │
         ├─ WHERE institucion_slug = ? AND anio = ?
         └─ Clustering key ordena por DNI
                   │
                   ▼
            Retornar todos los becados
            de ese año e institución
```

---

## Justificación de Elección de Modelos

### ¿Por qué MongoDB como Base Principal?

#### Ventajas Aplicadas

1. **Flexibilidad de Esquemas**

   - Los documentos de estudiantes tienen estructuras variables según el estado
   - Facilita evolución del esquema sin migraciones costosas
   - Ejemplo: El campo `comite` solo existe para estudiantes en estados avanzados

2. **Consultas Ricas**

   - Agregaciones complejas para estadísticas
   - Búsquedas por múltiples campos
   - Índices en campos frecuentemente consultados

3. **Transacciones ACID**

   - Garantiza consistencia en operaciones críticas
   - Rollback automático en caso de errores
   - Ideal para datos que no pueden corromperse

4. **Ecosistema Maduro**
   - Mongoose facilita desarrollo con TypeScript
   - Herramientas de monitoreo y backup
   - Comunidad grande y documentación extensa

#### Casos de Uso en el Sistema

- **Documentos de Instituciones**: Estructuras anidadas complejas (tema, comité, departamentos)
- **Documentos de Estudiantes**: Evolución del documento según el proceso
- **Validaciones**: A nivel de esquema con Mongoose

### ¿Por qué Redis para Caché y Locks?

#### Ventajas Aplicadas

1. **Rendimiento Extremo**

   - Operaciones O(1) en memoria
   - Latencia sub-milisegundo
   - Ideal para operaciones frecuentes

2. **Operaciones Atómicas**

   - SETNX garantiza exclusividad
   - Evita condiciones de carrera
   - Sin necesidad de locks distribuidos complejos

3. **TTL Automático**

   - Expiración automática de datos
   - Previene acumulación de datos obsoletos
   - Self-healing del sistema

4. **Simplicidad**
   - Modelo de datos simple (key-value)
   - Fácil de entender y mantener
   - Poca sobrecarga operacional

#### Casos de Uso en el Sistema

- **Verificación de DNI**: Consulta ultra-rápida antes de MongoDB
- **Reservas Temporales**: Previene inscripciones duplicadas simultáneas
- **Caché de Estadísticas**: Reduce carga en MongoDB para consultas frecuentes

#### Comparación con Alternativas

**vs. Memcached:**

- Redis tiene tipos de datos más ricos (sets, sorted sets)
- Persistencia opcional (AOF, RDB)
- Mejor para casos de uso mixtos (caché + locks)

**vs. Locks en Base de Datos:**

- Redis es más rápido (en memoria vs. disco)
- No bloquea tablas de base de datos principal
- Menor latencia para operaciones de lock/unlock

### ¿Por qué Neo4j para Relaciones?

#### Ventajas Aplicadas

1. **Modelo de Grafos Nativo**

   - Representación natural de relaciones complejas
   - Queries expresivas con Cypher
   - Análisis de relaciones profundo

2. **Performance en Traversales**

   - Optimizado para queries que siguen relaciones
   - Algoritmos de grafos integrados (shortest path, etc.)
   - Mejor que JOINs múltiples en SQL

3. **Exploración de Datos**
   - Fácil descubrir conexiones entre entidades
   - Visualización intuitiva
   - Análisis de patrones en relaciones

#### Casos de Uso en el Sistema

- **Visualización de Relaciones**: Gráficos de estudiantes-carreras-instituciones
- **Análisis de Patrones**: "¿Qué carreras son más populares?"
- **Queries de Relaciones**: "¿Qué estudiantes aplicaron a múltiples carreras?"

#### Comparación con Alternativas

**vs. Relaciones en MongoDB:**

- MongoDB puede almacenar referencias, pero queries de relaciones múltiples son lentas
- Neo4j optimiza específicamente para grafos
- Cypher es más expresivo que agregaciones de MongoDB para relaciones

**vs. SQL JOINs:**

- SQL requiere múltiples JOINs para relaciones complejas
- Neo4j optimiza el modelo de datos para relaciones
- Queries de grafos son más naturales y rápidas

**vs. No usar Base de Grafos:**

- Podríamos calcular relaciones en aplicación, pero sería ineficiente
- Neo4j proporciona persistencia y optimización automática
- Mejor separación de responsabilidades

### ¿Por qué Cassandra para Datos Históricos?

#### Ventajas Aplicadas

1. **Escalabilidad Horizontal**

   - Diseñada para crecer agregando nodos
   - Particionado automático de datos
   - Sin single point of failure

2. **Alta Disponibilidad**

   - Múltiples réplicas por partición
   - Continúa funcionando con nodos caídos
   - Tolerancia a particiones de red

3. **Rendimiento de Escritura**

   - Optimizada para writes masivos
   - Append-only model perfecto para datos históricos
   - Throughput alto incluso con grandes volúmenes

4. **Modelo de Datos Orientado a Consultas**
   - Primary key diseñada para queries específicas
   - Particionado por institución y año
   - Consultas eficientes sin escaneos completos

#### Casos de Uso en el Sistema

- **Almacenamiento de Becas Resueltas**: Datos históricos que no cambian
- **Reportes por Institución/Año**: Queries optimizadas por partition key
- **Analytics a Gran Escala**: Puede escalar a millones de registros

#### Comparación con Alternativas

**vs. MongoDB para Históricos:**

- MongoDB escala verticalmente (más costoso)
- Cassandra escala horizontalmente (más económico)
- Cassandra optimizada para datos time-series-like

**vs. Base de Datos SQL:**

- SQL requiere índices complejos para particionado
- Cassandra tiene particionado nativo
- Mejor rendimiento de escritura en Cassandra

**vs. No usar Base Dedicada:**

- Podríamos guardar todo en MongoDB, pero:
  - Mezcla datos activos con históricos
  - Menor rendimiento para reportes
  - Dificulta archivado de datos antiguos

#### Diseño de Particionado

```74:75:backend/src/config/cassandra.ts
      PRIMARY KEY ((institucion_slug, anio), dni)
    ) WITH CLUSTERING ORDER BY (dni ASC)
```

**Justificación del Diseño:**

1. **Partition Key: `(institucion_slug, anio)`**

   - Todos los datos de una institución en un año están en la misma partición
   - Consultas por institución/año son ultra-rápidas (una partición)
   - Distribuye carga entre nodos

2. **Clustering Key: `dni`**

   - Ordena estudiantes dentro de cada partición
   - Permite queries eficientes por DNI dentro de una partición
   - Facilita paginación ordenada

3. **Queries Optimizadas:**

   ```sql
   -- ✅ Optimizado: Usa partition key
   SELECT * FROM estudiantes_becados
   WHERE institucion_slug = 'universidad-x' AND anio = 2024;

   -- ✅ Optimizado: Usa partition + clustering key
   SELECT * FROM estudiantes_becados
   WHERE institucion_slug = 'universidad-x' AND anio = 2024 AND dni = '12345678';

   -- ❌ No optimizado: Requiere escaneo de múltiples particiones
   SELECT * FROM estudiantes_becados WHERE dni = '12345678';
   ```

### Arquitectura Multi-Base de Datos: Ventajas y Desafíos

#### Ventajas

1. **Optimización Específica**

   - Cada base de datos optimizada para su caso de uso
   - Mejor rendimiento general del sistema
   - Menor costo operacional

2. **Separación de Responsabilidades**

   - Datos activos vs. históricos
   - Datos estructurados vs. relaciones
   - Datos persistentes vs. temporales

3. **Escalabilidad Independiente**

   - Escalar cada base según su carga
   - Optimizar recursos por tipo de dato
   - Flexibilidad operacional

4. **Resiliencia**
   - Fallo de una base no afecta todas las funcionalidades
   - Sincronización asíncrona tolera fallos temporales
   - Sistema más robusto

#### Desafíos

1. **Complejidad Operacional**

   - Múltiples bases de datos para mantener
   - Monitoreo de cada sistema
   - Backup y recovery más complejo

2. **Consistencia Eventual**

   - Datos pueden estar desincronizados temporalmente
   - Requiere manejo de inconsistencias
   - Lógica de sincronización más compleja

3. **Debugging**

   - Datos distribuidos en múltiples lugares
   - Requiere herramientas de trazabilidad
   - Más difícil rastrear problemas

4. **Costo de Desarrollo**
   - Aprender múltiples tecnologías
   - Mantener código de sincronización
   - Más tiempo de desarrollo inicial

#### Mitigación de Desafíos

1. **Sincronización Asíncrona con Tolerancia a Fallos**

   - Las sincronizaciones no bloquean operaciones principales
   - Logs de errores para debugging
   - Reintentos automáticos posibles

2. **Monitoreo y Alertas**

   - Health checks para cada base de datos
   - Métricas de sincronización
   - Alertas proactivas

3. **Documentación Clara**
   - Este documento explica el flujo
   - Código comentado
   - Decisiones arquitectónicas documentadas

---

## Conclusiones

Este proyecto demuestra un uso práctico y educacional de múltiples modelos de bases de datos NoSQL, cada uno optimizado para casos de uso específicos:

### Resumen de Elecciones

| Base de Datos | Modelo      | CAP | Uso Principal                       | Librería                |
| ------------- | ----------- | --- | ----------------------------------- | ----------------------- |
| MongoDB       | Documento   | CP  | Datos principales transaccionales   | mongoose v8.0.3         |
| Redis         | Key-Value   | AP  | Caché y control de concurrencia     | ioredis v5.3.2          |
| Neo4j         | Grafo       | CA  | Relaciones y análisis de conexiones | neo4j-driver v6.0.0     |
| Cassandra     | Wide Column | AP  | Datos históricos y analytics        | cassandra-driver v4.8.0 |

### Lecciones Aprendidas

1. **No hay una Base de Datos Universal**

   - Cada modelo tiene fortalezas específicas
   - La elección debe basarse en casos de uso concretos
   - Multi-base puede ser beneficioso con diseño apropiado

2. **Teorema CAP es Fundamental**

   - Entender trade-offs es crucial para diseño
   - Diferentes bases pueden tener diferentes configuraciones CAP
   - La elección depende de requisitos de consistencia vs. disponibilidad

3. **Sincronización Requiere Diseño Cuidadoso**

   - Asíncrona para no bloquear operaciones críticas
   - Tolerante a fallos para resiliencia
   - Idempotente para prevenir duplicación

4. **Modelado de Datos Depende del Sistema**
   - Cassandra requiere diseño orientado a queries
   - Neo4j aprovecha relaciones nativas
   - MongoDB flexibilidad de documentos

### Próximos Pasos Sugeridos

1. **Monitoreo Avanzado**

   - Implementar métricas de sincronización
   - Dashboards para cada base de datos
   - Alertas proactivas

2. **Optimizaciones**

   - Índices adicionales según patrones de acceso
   - Estrategias de caché más sofisticadas
   - Particionado más granular en Cassandra

3. **Testing**

   - Tests de carga para validar sincronización
   - Tests de fallos (chaos engineering)
   - Validación de consistencia eventual

4. **Producción**
   - Configuración de réplicas para alta disponibilidad
   - Backup automatizado
   - Estrategias de disaster recovery

---

**Documento generado para fines educativos y de aprendizaje sobre bases de datos NoSQL.**
