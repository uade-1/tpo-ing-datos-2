export interface EmailSubscription {
  _id?: string;
  email: string;
  institucion_slug: string;
  subscribed_at: Date;
  converted_to_enrollment: boolean;
}

export interface CreateEmailSubscriptionRequest {
  email: string;
  institucion_slug: string;
}

export interface EnrollmentRequest {
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
  documentos?: {
    dni_img: string;
    analitico_img: string;
  };
  comite?: {
    comite_id: string;
    fecha_revision: Date;
    decision: string;
    comentarios: string;
  };
  fecha_resolucion?: Date;
  institucion_slug: string;
}

export interface EnrollmentCheckResponse {
  available: boolean;
  message: string;
  status?: "AVAILABLE" | "RESERVED" | "ENROLLED" | "ERROR";
  existing_carreras?: string[]; // If DNI exists, show which carreras they're enrolled in
}

export interface InstitutionEnrollmentStatus {
  institucion_slug: string;
  total_enrollments: number;
  pending_enrollments: number;
  confirmed_enrollments: number;
  rejected_enrollments: number;
  available_spots?: number;
  max_capacity?: number;
}

export interface DNIReservationResult {
  success: boolean;
  message: string;
  reservation_id?: string;
}

export type EnrollmentStatus = "PENDING" | "CONFIRMED" | "REJECTED";
