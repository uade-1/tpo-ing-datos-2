export interface EstudianteDocumentos {
  dni_img: string;
  analitico_img: string;
}

export interface EstudianteComite {
  comite_id: string;
  fecha_revision: Date;
  decision: string;
  comentarios: string;
}

export interface Estudiante {
  _id: string;
  id_postulante: string;
  nombre: string;
  apellido: string;
  sexo: "masculino" | "femenino";
  dni: string;
  mail: string;
  departamento_interes: string;
  carrera_interes: string;
  fecha_interes: Date;
  fecha_entrevista?: Date;
  estado: "ENTREVISTA" | "INTERES" | "ACEPTADO" | "RECHAZADO";
  documentos: EstudianteDocumentos;
  comite: EstudianteComite;
  fecha_resolucion?: Date;
  institucion_slug: string;
}

export interface CreateEstudianteRequest {
  id_postulante: string;
  nombre: string;
  apellido: string;
  sexo: "masculino" | "femenino";
  dni: string;
  mail: string;
  departamento_interes: string;
  carrera_interes: string;
  fecha_interes: Date;
  fecha_entrevista?: Date;
  estado: "ENTREVISTA" | "INTERES" | "ACEPTADO" | "RECHAZADO";
  documentos?: EstudianteDocumentos;
  comite?: EstudianteComite;
  fecha_resolucion?: Date;
  institucion_slug: string;
}

export interface UpdateEstudianteRequest {
  id_postulante?: string;
  nombre?: string;
  apellido?: string;
  sexo?: "masculino" | "femenino";
  dni?: string;
  mail?: string;
  departamento_interes?: string;
  carrera_interes?: string;
  fecha_interes?: Date;
  fecha_entrevista?: Date;
  estado?: "ENTREVISTA" | "INTERES" | "ACEPTADO" | "RECHAZADO";
  documentos?: Partial<EstudianteDocumentos>;
  comite?: Partial<EstudianteComite>;
  fecha_resolucion?: Date;
  institucion_slug?: string;
  enrollment_status?: EnrollmentStatus;
}
