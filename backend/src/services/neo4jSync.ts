import { getNeo4jDriver } from "../config/neo4j";

export class Neo4jSyncService {
  private get driver() {
    return getNeo4jDriver();
  }

  // Crear/actualizar nodo Estudiante
  async syncEstudiante(
    dni: string,
    nombre: string,
    apellido: string
  ): Promise<void> {
    const session = this.driver.session();
    try {
      await session.run(
        `MERGE (e:Estudiante {dni: $dni})
         SET e.nombre = $nombre, e.apellido = $apellido`,
        { dni, nombre, apellido }
      );
    } finally {
      await session.close();
    }
  }

  // Crear/actualizar nodo Institucion
  async syncInstitucion(slug: string, nombre: string): Promise<void> {
    const session = this.driver.session();
    try {
      await session.run(
        `MERGE (i:Institucion {slug: $slug})
         SET i.nombre = $nombre`,
        { slug, nombre }
      );
    } finally {
      await session.close();
    }
  }

  // Crear/actualizar nodo Carrera y relación con Institución
  async syncCarrera(
    nombreCarrera: string,
    departamento: string,
    institucionSlug: string
  ): Promise<void> {
    const session = this.driver.session();
    try {
      await session.run(
        `MERGE (c:Carrera {nombre: $nombreCarrera})
         SET c.departamento = $departamento
         WITH c
         MATCH (i:Institucion {slug: $institucionSlug})
         MERGE (i)-[:OFRECE]->(c)`,
        { nombreCarrera, departamento, institucionSlug }
      );
    } finally {
      await session.close();
    }
  }

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

  // Actualizar estado de enrollment (eliminar relación vieja, crear nueva)
  async updateEnrollmentStatus(
    dni: string,
    carreraInteres: string,
    nuevoEstado: string,
    estadoAnterior: string
  ): Promise<void> {
    const session = this.driver.session();
    try {
      await session.run(
        `MATCH (e:Estudiante {dni: $dni})-[r:${estadoAnterior}]->(c:Carrera {nombre: $carreraInteres})
         DELETE r
         WITH e, c
         CREATE (e)-[nuevo:${nuevoEstado}]->(c)
         SET nuevo.ultima_actualizacion = datetime()`,
        { dni, carreraInteres }
      );
    } finally {
      await session.close();
    }
  }
}

export const neo4jSyncService = new Neo4jSyncService();
