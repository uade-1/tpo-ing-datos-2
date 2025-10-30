export interface InstitucionColores {
  primario: string;
  secundario: string;
  acento: string;
  texto_primario: string;
}

export interface InstitucionMensajes {
  titulo_bienvenida: string;
  subtitulo_bienvenida: string;
  texto_footer: string;
}

export interface InstitucionConfiguracionTema {
  logo_url: string;
  favicon_url: string | null;
  colores: InstitucionColores;
  mensajes: InstitucionMensajes;
}

export interface InstitucionMetadata {
  fecha_creacion: Date;
  fecha_actualizacion: Date;
  version_config: number;
}

export interface ComiteMiembro {
  miembro_id: string;
  nombre: string;
  apellido: string;
  mail: string;
}

export interface CreateComiteMiembroRequest {
  miembro_id?: string;
  nombre: string;
  apellido: string;
  mail: string;
}

export interface Comite {
  comite_id: string;
  miembros: ComiteMiembro[];
}

export interface CreateComiteRequest {
  comite_id?: string;
  miembros?: CreateComiteMiembroRequest[];
}

export interface Institucion {
  _id: string;
  slug: string;
  nombre: string;
  estado: "ACTIVA" | "INACTIVA" | "PENDIENTE_CONFIGURACION";
  configuracion_tema: InstitucionConfiguracionTema;
  comite: Comite;
  metadata: InstitucionMetadata;
}

export interface CreateInstitucionRequest {
  slug: string;
  nombre: string;
  estado: "ACTIVA" | "INACTIVA" | "PENDIENTE_CONFIGURACION";
  configuracion_tema: InstitucionConfiguracionTema;
  comite?: CreateComiteRequest;
}

export interface UpdateInstitucionRequest {
  slug?: string;
  nombre?: string;
  estado?: "ACTIVA" | "INACTIVA" | "PENDIENTE_CONFIGURACION";
  configuracion_tema?: Partial<InstitucionConfiguracionTema>;
  comite?: CreateComiteRequest;
}
