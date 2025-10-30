import mongoose, { Schema, Document } from "mongoose";
import { Estudiante } from "../types/estudiante";

const EstudianteDocumentosSchema = new Schema(
  {
    dni_img: { type: String, required: true },
    analitico_img: { type: String, required: true },
  },
  { _id: false }
);

const EstudianteComiteSchema = new Schema(
  {
    comite_id: { type: String, required: true },
    fecha_revision: { type: Date, required: true },
    decision: { type: String, required: true },
    comentarios: { type: String, required: true },
  },
  { _id: false }
);

const EstudianteSchema = new Schema<Estudiante & Document>(
  {
    id_postulante: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    sexo: {
      type: String,
      required: true,
      enum: ["masculino", "femenino"],
    },
    dni: { type: String, required: true },
    mail: { type: String, required: true },
    departamento_interes: { type: String, required: true },
    carrera_interes: { type: String, required: true },
    fecha_interes: { type: Date, required: true },
    fecha_entrevista: { type: Date, required: false },
    estado: {
      type: String,
      required: true,
      enum: ["ENTREVISTA", "INTERES", "ACEPTADO", "RECHAZADO"],
    },
    documentos: { type: EstudianteDocumentosSchema, required: false },
    comite: { type: EstudianteComiteSchema, required: false },
    fecha_resolucion: { type: Date, required: false },
    institucion_slug: { type: String, required: true },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export const EstudianteModel = mongoose.model<Estudiante & Document>(
  "Estudiante",
  EstudianteSchema
);
