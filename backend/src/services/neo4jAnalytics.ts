import { getNeo4jDriver } from "../config/neo4j";

export class Neo4jAnalyticsService {
  private get driver() {
    return getNeo4jDriver();
  }

  // Obtener todas las carreras de un estudiante con sus estados
  async getCarrerasEstudiante(dni: string) {
    const session = this.driver.session();
    try {
      const result = await session.run(
        `MATCH (e:Estudiante {dni: $dni})-[r]->(c:Carrera)
         RETURN c.nombre as carrera, 
                c.departamento as departamento,
                type(r) as estado,
                r.fecha_inscripcion as fecha_inscripcion,
                r.fecha_entrevista as fecha_entrevista
         ORDER BY r.fecha_inscripcion DESC`,
        { dni }
      );

      return result.records.map((record) => ({
        carrera: record.get("carrera"),
        departamento: record.get("departamento"),
        estado: record.get("estado"),
        fecha_inscripcion: record.get("fecha_inscripcion"),
        fecha_entrevista: record.get("fecha_entrevista"),
      }));
    } finally {
      await session.close();
    }
  }

  // Obtener estudiantes por carrera y estado
  async getEstudiantesPorCarrera(nombreCarrera: string, estado?: string) {
    const session = this.driver.session();
    try {
      const query = estado
        ? `MATCH (e:Estudiante)-[r:${estado}]->(c:Carrera {nombre: $nombreCarrera})
           RETURN e.dni as dni, e.nombre as nombre, e.apellido as apellido, 
                  r.fecha_inscripcion as fecha_inscripcion`
        : `MATCH (e:Estudiante)-[r]->(c:Carrera {nombre: $nombreCarrera})
           RETURN e.dni as dni, e.nombre as nombre, e.apellido as apellido,
                  type(r) as estado, r.fecha_inscripcion as fecha_inscripcion`;

      const result = await session.run(query, { nombreCarrera });

      return result.records.map((record) => ({
        dni: record.get("dni"),
        nombre: record.get("nombre"),
        apellido: record.get("apellido"),
        estado: estado || record.get("estado"),
        fecha_inscripcion: record.get("fecha_inscripcion"),
      }));
    } finally {
      await session.close();
    }
  }

  // Obtener estadísticas de una carrera
  async getEstadisticasCarrera(nombreCarrera: string) {
    const session = this.driver.session();
    try {
      const result = await session.run(
        `MATCH (c:Carrera {nombre: $nombreCarrera})<-[r]-(e:Estudiante)
         RETURN type(r) as estado, count(e) as cantidad`,
        { nombreCarrera }
      );

      return result.records.map((record) => ({
        estado: record.get("estado"),
        cantidad: record.get("cantidad").toNumber(),
      }));
    } finally {
      await session.close();
    }
  }

  // Estudiantes con múltiples aplicaciones
  async getEstudiantesMultiCarrera() {
    const session = this.driver.session();
    try {
      const result = await session.run(
        `MATCH (e:Estudiante)-[r]->(c:Carrera)
         WITH e, collect({carrera: c.nombre, estado: type(r)}) as carreras
         WHERE size(carreras) > 1
         RETURN e.dni as dni, e.nombre as nombre, e.apellido as apellido, carreras
         ORDER BY size(carreras) DESC`
      );

      return result.records.map((record) => ({
        dni: record.get("dni"),
        nombre: record.get("nombre"),
        apellido: record.get("apellido"),
        carreras: record.get("carreras"),
        total_carreras: record.get("carreras").length,
      }));
    } finally {
      await session.close();
    }
  }
}

export const neo4jAnalyticsService = new Neo4jAnalyticsService();
