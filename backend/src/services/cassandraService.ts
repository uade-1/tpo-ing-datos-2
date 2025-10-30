import { getCassandraClient } from "../config/cassandra";
import { Estudiante } from "../types/estudiante";

export class CassandraScholarshipService {
  private get client() {
    return getCassandraClient();
  }

  async registerScholarship(estudiante: Estudiante): Promise<void> {
    // Use fecha_resolucion if available (when accepted/rejected), otherwise fecha_interes
    const fechaResolucion = estudiante.fecha_resolucion 
      ? new Date(estudiante.fecha_resolucion)
      : new Date(estudiante.fecha_interes);
    const año = fechaResolucion.getFullYear();

    // Fallback to a literal CQL string to avoid codec issues during testing
    const esc = (s: any) =>
      s === null || s === undefined ? "NULL" : `'${String(s).replace(/'/g, "''")}'`;

    // Format timestamp as ISO8601 string for Cassandra
    const ts = (d: any) =>
      d ? `'${new Date(d).toISOString()}'` : "NULL";

    // Extract comite fields - use estado as comite_decision if comite.decision is not available
    const comiteDecision = estudiante.comite?.decision || estudiante.estado || null;
    const comiteId = estudiante.comite?.comite_id || null;
    const comiteComentarios = estudiante.comite?.comentarios || null;
    const comiteFechaRevision = estudiante.comite?.fecha_revision || null;

    const insertCql = `INSERT INTO estudiantes_becados (
        institucion_slug, anio, dni, id_postulante, nombre, apellido, sexo,
        mail, carrera_interes, departamento_interes, fecha_inscripcion,
        fecha_interes, fecha_entrevista, fecha_aceptacion, documentos,
        comite_id, comite_decision, comite_comentarios, comite_fecha_revision
      ) VALUES (
        ${esc(estudiante.institucion_slug)},
        ${año},
        ${esc(estudiante.dni)},
        ${esc(estudiante.id_postulante)},
        ${esc(estudiante.nombre)},
        ${esc(estudiante.apellido)},
        ${esc(estudiante.sexo)},
        ${esc(estudiante.mail)},
        ${esc(estudiante.carrera_interes)},
        ${esc(estudiante.departamento_interes)},
        ${ts(fechaResolucion)},
        ${ts(estudiante.fecha_interes)},
        ${estudiante.fecha_entrevista ? ts(estudiante.fecha_entrevista) : "NULL"},
        ${ts(fechaResolucion)},
        NULL,
        ${esc(comiteId)},
        ${esc(comiteDecision)},
        ${esc(comiteComentarios)},
        ${comiteFechaRevision ? ts(comiteFechaRevision) : "NULL"}
      )`;

    await this.client.execute(insertCql);
  }

  async updateScholarship(
    institucion_slug: string,
    año: number,
    dni: string,
    updates: Partial<Estudiante>
  ): Promise<void> {
    const setClauses: string[] = [];
    const params: any[] = [];

    if (updates.mail) {
      setClauses.push("mail = ?");
      params.push(updates.mail);
    }
    if (updates.documentos) {
      setClauses.push("documentos = ?");
      params.push(updates.documentos);
    }
    
    // Update comite fields - prioritize comite.decision, fallback to estado
    if (updates.comite) {
      if (updates.comite.comite_id) {
        setClauses.push("comite_id = ?");
        params.push(updates.comite.comite_id);
      }
      if (updates.comite.decision) {
        setClauses.push("comite_decision = ?");
        params.push(updates.comite.decision);
      }
      if (updates.comite.comentarios) {
        setClauses.push("comite_comentarios = ?");
        params.push(updates.comite.comentarios);
      }
      if (updates.comite.fecha_revision) {
        setClauses.push("comite_fecha_revision = ?");
        params.push(new Date(updates.comite.fecha_revision));
      }
    }
    
    // If estado is provided and comite_decision hasn't been set yet, use estado
    if (updates.estado && !setClauses.some(clause => clause.includes("comite_decision"))) {
      setClauses.push("comite_decision = ?");
      params.push(updates.estado);
    }

    if (setClauses.length === 0) return;

    params.push(institucion_slug, año, dni);

    const query = `
      UPDATE estudiantes_becados
      SET ${setClauses.join(", ")}
      WHERE institucion_slug = ? AND anio = ? AND dni = ?
    `;

    await this.client.execute(query, params, { prepare: true });
  }

  async getScholarshipByDNI(
    institucion_slug: string,
    año: number,
    dni: string
  ): Promise<any> {
    const query = `
      SELECT * FROM estudiantes_becados
      WHERE institucion_slug = ? AND anio = ? AND dni = ?
    `;

    console.log(
      `[Cassandra Query] institucion_slug=${institucion_slug}, año=${año}, dni=${dni}`
    );

    const result = await this.client.execute(
      query,
      [institucion_slug, año, dni],
      {
        prepare: true,
        consistency: 1, // ONE
      }
    );

    console.log(`[Cassandra Result] Found ${result.rows.length} rows`);

    return result.rows[0] || null;
  }

  async getScholarshipsByInstitution(
    institucion_slug: string,
    año: number
  ): Promise<any[]> {
    const query = `
      SELECT * FROM estudiantes_becados
      WHERE institucion_slug = ? AND anio = ?
    `;

    const result = await this.client.execute(query, [institucion_slug, año], {
      prepare: true,
    });

    return result.rows;
  }
}

export const cassandraService = new CassandraScholarshipService();
