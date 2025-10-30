import mongoose, { Schema, Document } from "mongoose";
import { Institucion } from "../types/institucion";

const InstitucionColoresSchema = new Schema(
  {
    primario: { type: String, required: true },
    secundario: { type: String, required: true },
    acento: { type: String, required: true },
    texto_primario: { type: String, required: true },
  },
  { _id: false }
);

const InstitucionMensajesSchema = new Schema(
  {
    titulo_bienvenida: { type: String, required: true },
    subtitulo_bienvenida: { type: String, required: true },
    texto_footer: { type: String, required: true },
  },
  { _id: false }
);

const InstitucionConfiguracionTemaSchema = new Schema(
  {
    logo_url: { type: String, required: true },
    favicon_url: { type: String, default: null },
    colores: { type: InstitucionColoresSchema, required: true },
    mensajes: { type: InstitucionMensajesSchema, required: true },
  },
  { _id: false }
);

const ComiteMiembroSchema = new Schema(
  {
    miembro_id: {
      type: String,
      required: true,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    mail: { type: String, required: true },
  },
  { _id: false }
);

const ComiteSchema = new Schema(
  {
    comite_id: {
      type: String,
      required: true,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    miembros: { type: [ComiteMiembroSchema], required: false, default: [] },
  },
  { _id: false }
);

const InstitucionMetadataSchema = new Schema(
  {
    fecha_creacion: { type: Date, required: false, default: Date.now },
    fecha_actualizacion: { type: Date, required: false, default: Date.now },
    version_config: { type: Number, required: false, default: 1 },
  },
  { _id: false }
);

const CarreraSchema = new Schema(
  {
    nombre: { type: String, required: true },
  },
  { _id: false }
);

const DepartamentoSchema = new Schema(
  {
    nombre: { type: String, required: true },
    carreras: { type: [CarreraSchema], required: true, default: [] },
  },
  { _id: false }
);

const InstitucionSchema = new Schema<Institucion & Document>(
  {
    slug: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    estado: {
      type: String,
      required: true,
      enum: ["ACTIVA", "INACTIVA", "PENDIENTE_CONFIGURACION"],
    },
    configuracion_tema: {
      type: InstitucionConfiguracionTemaSchema,
      required: true,
    },
    comite: { type: ComiteSchema, required: false, default: () => ({}) },
    metadata: { type: InstitucionMetadataSchema, required: false },
    departamentos: { type: [DepartamentoSchema], required: false, default: [] },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

InstitucionSchema.pre("save", function (next) {
  if (!this.metadata) {
    this.metadata = {
      fecha_creacion: new Date(),
      fecha_actualizacion: new Date(),
      version_config: 1,
    };
  } else if (this.isNew) {
    this.metadata.fecha_creacion = new Date();
    this.metadata.fecha_actualizacion = new Date();
    this.metadata.version_config = 1;
  } else {
    this.metadata.fecha_actualizacion = new Date();
    this.metadata.version_config += 1;
  }
  next();
});

InstitucionSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() as any;
  if (update) {
    update["metadata.fecha_actualizacion"] = new Date();
    if (update.$inc) {
      update.$inc["metadata.version_config"] = 1;
    } else {
      update.$inc = { "metadata.version_config": 1 };
    }
  }
  next();
});

export const InstitucionModel = mongoose.model<Institucion & Document>(
  "Institucion",
  InstitucionSchema
);
