import { Request, Response, NextFunction } from "express";
import {
  CreateInstitucionRequest,
  UpdateInstitucionRequest,
} from "../types/institucion";
import {
  CreateEstudianteRequest,
  UpdateEstudianteRequest,
} from "../types/estudiante";
import {
  CreateEmailSubscriptionRequest,
  EnrollmentRequest,
} from "../types/enrollment";

const validateHexColor = (color: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const validateEstado = (estado: string): boolean => {
  return ["ACTIVA", "INACTIVA", "PENDIENTE_CONFIGURACION"].includes(estado);
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateSexo = (sexo: string): boolean => {
  return ["masculino", "femenino"].includes(sexo);
};

const validateEstadoEstudiante = (estado: string): boolean => {
  return ["ENTREVISTA", "INTERES", "ACEPTADO", "RECHAZADO"].includes(estado);
};

const validateDate = (date: any): boolean => {
  if (!date) return false;
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
};

const validateEstudianteDocumentos = (documentos: any): boolean => {
  return (
    documentos &&
    typeof documentos === "object" &&
    typeof documentos.dni_img === "string" &&
    documentos.dni_img.trim().length > 0 &&
    typeof documentos.analitico_img === "string" &&
    documentos.analitico_img.trim().length > 0
  );
};

const validateEstudianteComite = (comite: any): boolean => {
  return (
    comite &&
    typeof comite === "object" &&
    typeof comite.comite_id === "string" &&
    comite.comite_id.trim().length > 0 &&
    validateDate(comite.fecha_revision) &&
    typeof comite.decision === "string" &&
    comite.decision.trim().length > 0 &&
    typeof comite.comentarios === "string" &&
    comite.comentarios.trim().length > 0
  );
};

// More lenient validation for updates - allows auto-generation of comite_id and fecha_revision
const validateEstudianteComiteUpdate = (comite: any): boolean => {
  if (!comite || typeof comite !== "object") {
    return false;
  }
  // decision and comentarios are required
  if (
    typeof comite.decision !== "string" ||
    comite.decision.trim().length === 0 ||
    typeof comite.comentarios !== "string" ||
    comite.comentarios.trim().length === 0
  ) {
    return false;
  }
  // comite_id and fecha_revision are optional (will be auto-generated if missing)
  if (comite.comite_id !== undefined && (typeof comite.comite_id !== "string" || comite.comite_id.trim().length === 0)) {
    return false;
  }
  if (comite.fecha_revision !== undefined && !validateDate(comite.fecha_revision)) {
    return false;
  }
  return true;
};

const validateComiteMiembro = (miembro: any): boolean => {
  return (
    miembro &&
    typeof miembro === "object" &&
    (miembro.miembro_id === undefined ||
      (typeof miembro.miembro_id === "string" &&
        miembro.miembro_id.trim().length > 0)) &&
    typeof miembro.nombre === "string" &&
    miembro.nombre.trim().length > 0 &&
    typeof miembro.apellido === "string" &&
    miembro.apellido.trim().length > 0 &&
    typeof miembro.mail === "string" &&
    miembro.mail.trim().length > 0 &&
    validateEmail(miembro.mail)
  );
};

export const validateCreateInstitucion = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { slug, nombre, estado, configuracion_tema, comite } =
    req.body as CreateInstitucionRequest;

  if (!slug || typeof slug !== "string" || slug.trim().length === 0) {
    res.status(400).json({
      success: false,
      error: {
        message: "slug is required and must be a non-empty string",
        statusCode: 400,
      },
    });
    return;
  }

  if (!nombre || typeof nombre !== "string" || nombre.trim().length === 0) {
    res.status(400).json({
      success: false,
      error: {
        message: "nombre is required and must be a non-empty string",
        statusCode: 400,
      },
    });
    return;
  }

  if (!estado || !validateEstado(estado)) {
    res.status(400).json({
      success: false,
      error: {
        message:
          "estado is required and must be one of: ACTIVA, INACTIVA, PENDIENTE_CONFIGURACION",
        statusCode: 400,
      },
    });
    return;
  }

  if (!configuracion_tema) {
    res.status(400).json({
      success: false,
      error: { message: "configuracion_tema is required", statusCode: 400 },
    });
    return;
  }

  const { logo_url, favicon_url, colores, mensajes } = configuracion_tema;

  if (!logo_url || typeof logo_url !== "string" || !validateUrl(logo_url)) {
    res.status(400).json({
      success: false,
      error: {
        message:
          "configuracion_tema.logo_url is required and must be a valid URL",
        statusCode: 400,
      },
    });
    return;
  }

  if (
    favicon_url !== null &&
    (typeof favicon_url !== "string" || !validateUrl(favicon_url))
  ) {
    res.status(400).json({
      success: false,
      error: {
        message: "configuracion_tema.favicon_url must be null or a valid URL",
        statusCode: 400,
      },
    });
    return;
  }

  if (!colores) {
    res.status(400).json({
      success: false,
      error: {
        message: "configuracion_tema.colores is required",
        statusCode: 400,
      },
    });
    return;
  }

  const { primario, secundario, acento, texto_primario } = colores;

  if (!primario || !validateHexColor(primario)) {
    res.status(400).json({
      success: false,
      error: {
        message:
          "configuracion_tema.colores.primario is required and must be a valid hex color",
        statusCode: 400,
      },
    });
    return;
  }

  if (!secundario || !validateHexColor(secundario)) {
    res.status(400).json({
      success: false,
      error: {
        message:
          "configuracion_tema.colores.secundario is required and must be a valid hex color",
        statusCode: 400,
      },
    });
    return;
  }

  if (!acento || !validateHexColor(acento)) {
    res.status(400).json({
      success: false,
      error: {
        message:
          "configuracion_tema.colores.acento is required and must be a valid hex color",
        statusCode: 400,
      },
    });
    return;
  }

  if (!texto_primario || !validateHexColor(texto_primario)) {
    res.status(400).json({
      success: false,
      error: {
        message:
          "configuracion_tema.colores.texto_primario is required and must be a valid hex color",
        statusCode: 400,
      },
    });
    return;
  }

  if (!mensajes) {
    res.status(400).json({
      success: false,
      error: {
        message: "configuracion_tema.mensajes is required",
        statusCode: 400,
      },
    });
    return;
  }

  const { titulo_bienvenida, subtitulo_bienvenida, texto_footer } = mensajes;

  if (
    !titulo_bienvenida ||
    typeof titulo_bienvenida !== "string" ||
    titulo_bienvenida.trim().length === 0
  ) {
    res.status(400).json({
      success: false,
      error: {
        message:
          "configuracion_tema.mensajes.titulo_bienvenida is required and must be a non-empty string",
        statusCode: 400,
      },
    });
    return;
  }

  if (
    !subtitulo_bienvenida ||
    typeof subtitulo_bienvenida !== "string" ||
    subtitulo_bienvenida.trim().length === 0
  ) {
    res.status(400).json({
      success: false,
      error: {
        message:
          "configuracion_tema.mensajes.subtitulo_bienvenida is required and must be a non-empty string",
        statusCode: 400,
      },
    });
    return;
  }

  if (
    !texto_footer ||
    typeof texto_footer !== "string" ||
    texto_footer.trim().length === 0
  ) {
    res.status(400).json({
      success: false,
      error: {
        message:
          "configuracion_tema.mensajes.texto_footer is required and must be a non-empty string",
        statusCode: 400,
      },
    });
    return;
  }

  if (comite !== undefined) {
    if (!comite || typeof comite !== "object") {
      res.status(400).json({
        success: false,
        error: {
          message: "comite must be an object",
          statusCode: 400,
        },
      });
      return;
    }

    if (comite.miembros !== undefined) {
      if (!Array.isArray(comite.miembros)) {
        res.status(400).json({
          success: false,
          error: {
            message: "comite.miembros must be an array",
            statusCode: 400,
          },
        });
        return;
      }

      for (let i = 0; i < comite.miembros.length; i++) {
        if (!validateComiteMiembro(comite.miembros[i])) {
          res.status(400).json({
            success: false,
            error: {
              message: `comite.miembros[${i}] is invalid. Each member must have nombre, apellido, and valid mail`,
              statusCode: 400,
            },
          });
          return;
        }
      }
    }
  }

  if (comite !== undefined) {
    if (!comite || typeof comite !== "object") {
      res.status(400).json({
        success: false,
        error: {
          message: "comite must be an object",
          statusCode: 400,
        },
      });
      return;
    }

    if (comite.miembros !== undefined) {
      if (!Array.isArray(comite.miembros)) {
        res.status(400).json({
          success: false,
          error: {
            message: "comite.miembros must be an array",
            statusCode: 400,
          },
        });
        return;
      }

      for (let i = 0; i < comite.miembros.length; i++) {
        if (!validateComiteMiembro(comite.miembros[i])) {
          res.status(400).json({
            success: false,
            error: {
              message: `comite.miembros[${i}] is invalid. Each member must have nombre, apellido, and valid mail`,
              statusCode: 400,
            },
          });
          return;
        }
      }
    }
  }

  next();
};

export const validateUpdateInstitucion = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { slug, nombre, estado, configuracion_tema, comite } =
    req.body as UpdateInstitucionRequest;

  if (
    slug !== undefined &&
    (typeof slug !== "string" || slug.trim().length === 0)
  ) {
    res.status(400).json({
      success: false,
      error: { message: "slug must be a non-empty string", statusCode: 400 },
    });
    return;
  }

  if (
    nombre !== undefined &&
    (typeof nombre !== "string" || nombre.trim().length === 0)
  ) {
    res.status(400).json({
      success: false,
      error: { message: "nombre must be a non-empty string", statusCode: 400 },
    });
    return;
  }

  if (estado !== undefined && !validateEstado(estado)) {
    res.status(400).json({
      success: false,
      error: {
        message:
          "estado must be one of: ACTIVA, INACTIVA, PENDIENTE_CONFIGURACION",
        statusCode: 400,
      },
    });
    return;
  }

  if (configuracion_tema) {
    const { logo_url, favicon_url, colores, mensajes } = configuracion_tema;

    if (
      logo_url !== undefined &&
      (typeof logo_url !== "string" || !validateUrl(logo_url))
    ) {
      res.status(400).json({
        success: false,
        error: {
          message: "configuracion_tema.logo_url must be a valid URL",
          statusCode: 400,
        },
      });
      return;
    }

    if (
      favicon_url !== undefined &&
      favicon_url !== null &&
      (typeof favicon_url !== "string" || !validateUrl(favicon_url))
    ) {
      res.status(400).json({
        success: false,
        error: {
          message: "configuracion_tema.favicon_url must be null or a valid URL",
          statusCode: 400,
        },
      });
      return;
    }

    if (colores) {
      const { primario, secundario, acento, texto_primario } = colores;

      if (primario !== undefined && !validateHexColor(primario)) {
        res.status(400).json({
          success: false,
          error: {
            message:
              "configuracion_tema.colores.primario must be a valid hex color",
            statusCode: 400,
          },
        });
        return;
      }

      if (secundario !== undefined && !validateHexColor(secundario)) {
        res.status(400).json({
          success: false,
          error: {
            message:
              "configuracion_tema.colores.secundario must be a valid hex color",
            statusCode: 400,
          },
        });
        return;
      }

      if (acento !== undefined && !validateHexColor(acento)) {
        res.status(400).json({
          success: false,
          error: {
            message:
              "configuracion_tema.colores.acento must be a valid hex color",
            statusCode: 400,
          },
        });
        return;
      }

      if (texto_primario !== undefined && !validateHexColor(texto_primario)) {
        res.status(400).json({
          success: false,
          error: {
            message:
              "configuracion_tema.colores.texto_primario must be a valid hex color",
            statusCode: 400,
          },
        });
        return;
      }
    }

    if (mensajes) {
      const { titulo_bienvenida, subtitulo_bienvenida, texto_footer } =
        mensajes;

      if (
        titulo_bienvenida !== undefined &&
        (typeof titulo_bienvenida !== "string" ||
          titulo_bienvenida.trim().length === 0)
      ) {
        res.status(400).json({
          success: false,
          error: {
            message:
              "configuracion_tema.mensajes.titulo_bienvenida must be a non-empty string",
            statusCode: 400,
          },
        });
        return;
      }

      if (
        subtitulo_bienvenida !== undefined &&
        (typeof subtitulo_bienvenida !== "string" ||
          subtitulo_bienvenida.trim().length === 0)
      ) {
        res.status(400).json({
          success: false,
          error: {
            message:
              "configuracion_tema.mensajes.subtitulo_bienvenida must be a non-empty string",
            statusCode: 400,
          },
        });
        return;
      }

      if (
        texto_footer !== undefined &&
        (typeof texto_footer !== "string" || texto_footer.trim().length === 0)
      ) {
        res.status(400).json({
          success: false,
          error: {
            message:
              "configuracion_tema.mensajes.texto_footer must be a non-empty string",
            statusCode: 400,
          },
        });
        return;
      }
    }
  }

  if (comite !== undefined) {
    if (!comite || typeof comite !== "object") {
      res.status(400).json({
        success: false,
        error: {
          message: "comite must be an object",
          statusCode: 400,
        },
      });
      return;
    }

    if (comite.miembros !== undefined) {
      if (!Array.isArray(comite.miembros)) {
        res.status(400).json({
          success: false,
          error: {
            message: "comite.miembros must be an array",
            statusCode: 400,
          },
        });
        return;
      }

      for (let i = 0; i < comite.miembros.length; i++) {
        if (!validateComiteMiembro(comite.miembros[i])) {
          res.status(400).json({
            success: false,
            error: {
              message: `comite.miembros[${i}] is invalid. Each member must have nombre, apellido, and valid mail`,
              statusCode: 400,
            },
          });
          return;
        }
      }
    }
  }

  next();
};
export const validateCreateEstudiante = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const {
    id_postulante,
    nombre,
    apellido,
    sexo,
    dni,
    mail,
    departamento_interes,
    carrera_interes,
    fecha_interes,
    fecha_entrevista,
    estado,
    documentos,
    comite,
    fecha_inscripcion,
  } = req.body as CreateEstudianteRequest;

  if (!id_postulante || typeof id_postulante !== "string" || id_postulante.trim().length === 0) {
    res.status(400).json({
      success: false,
      error: {
        message: "id_postulante is required and must be a non-empty string",
        statusCode: 400,
      },
    });
    return;
  }

  if (!nombre || typeof nombre !== "string" || nombre.trim().length === 0) {
    res.status(400).json({
      success: false,
      error: {
        message: "nombre is required and must be a non-empty string",
        statusCode: 400,
      },
    });
    return;
  }

  if (!apellido || typeof apellido !== "string" || apellido.trim().length === 0) {
    res.status(400).json({
      success: false,
      error: {
        message: "apellido is required and must be a non-empty string",
        statusCode: 400,
      },
    });
    return;
  }

  if (!sexo || !validateSexo(sexo)) {
    res.status(400).json({
      success: false,
      error: {
        message: "sexo is required and must be one of: masculino, femenino",
        statusCode: 400,
      },
    });
    return;
  }

  if (!dni || typeof dni !== "string" || dni.trim().length === 0) {
    res.status(400).json({
      success: false,
      error: {
        message: "dni is required and must be a non-empty string",
        statusCode: 400,
      },
    });
    return;
  }

  if (!mail || typeof mail !== "string" || !validateEmail(mail)) {
    res.status(400).json({
      success: false,
      error: {
        message: "mail is required and must be a valid email address",
        statusCode: 400,
      },
    });
    return;
  }

  if (!departamento_interes || typeof departamento_interes !== "string" || departamento_interes.trim().length === 0) {
    res.status(400).json({
      success: false,
      error: {
        message: "departamento_interes is required and must be a non-empty string",
        statusCode: 400,
      },
    });
    return;
  }

  if (!carrera_interes || typeof carrera_interes !== "string" || carrera_interes.trim().length === 0) {
    res.status(400).json({
      success: false,
      error: {
        message: "carrera_interes is required and must be a non-empty string",
        statusCode: 400,
      },
    });
    return;
  }

  if (!fecha_interes || !validateDate(fecha_interes)) {
    res.status(400).json({
      success: false,
      error: {
        message: "fecha_interes is required and must be a valid date",
        statusCode: 400,
      },
    });
    return;
  }

  if (!fecha_entrevista || !validateDate(fecha_entrevista)) {
    res.status(400).json({
      success: false,
      error: {
        message: "fecha_entrevista is required and must be a valid date",
        statusCode: 400,
      },
    });
    return;
  }

  if (!estado || !validateEstadoEstudiante(estado)) {
    res.status(400).json({
      success: false,
      error: {
        message: "estado is required and must be one of: ENTREVISTA, INTERES, ACEPTADO, RECHAZADO",
        statusCode: 400,
      },
    });
    return;
  }

  if (!fecha_inscripcion || !validateDate(fecha_inscripcion)) {
    res.status(400).json({
      success: false,
      error: {
        message: "fecha_inscripcion is required and must be a valid date",
        statusCode: 400,
      },
    });
    return;
  }

  if (documentos !== undefined && !validateEstudianteDocumentos(documentos)) {
    res.status(400).json({
      success: false,
      error: {
        message: "documentos must be an object with dni_img and analitico_img as non-empty strings",
        statusCode: 400,
      },
    });
    return;
  }

  if (comite !== undefined && !validateEstudianteComiteUpdate(comite)) {
    res.status(400).json({
      success: false,
      error: {
        message: "comite must be an object with decision and comentarios (comite_id and fecha_revision are optional)",
        statusCode: 400,
      },
    });
    return;
  }

  next();
};

export const validateUpdateEstudiante = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const {
    id_postulante,
    nombre,
    apellido,
    sexo,
    dni,
    mail,
    departamento_interes,
    carrera_interes,
    fecha_interes,
    fecha_entrevista,
    estado,
    documentos,
    comite,
    fecha_inscripcion,
  } = req.body as UpdateEstudianteRequest;

  if (id_postulante !== undefined && (typeof id_postulante !== "string" || id_postulante.trim().length === 0)) {
    res.status(400).json({
      success: false,
      error: {
        message: "id_postulante must be a non-empty string",
        statusCode: 400,
      },
    });
    return;
  }

  if (nombre !== undefined && (typeof nombre !== "string" || nombre.trim().length === 0)) {
    res.status(400).json({
      success: false,
      error: {
        message: "nombre must be a non-empty string",
        statusCode: 400,
      },
    });
    return;
  }

  if (apellido !== undefined && (typeof apellido !== "string" || apellido.trim().length === 0)) {
    res.status(400).json({
      success: false,
      error: {
        message: "apellido must be a non-empty string",
        statusCode: 400,
      },
    });
    return;
  }

  if (sexo !== undefined && !validateSexo(sexo)) {
    res.status(400).json({
      success: false,
      error: {
        message: "sexo must be one of: masculino, femenino",
        statusCode: 400,
      },
    });
    return;
  }

  if (dni !== undefined && (typeof dni !== "string" || dni.trim().length === 0)) {
    res.status(400).json({
      success: false,
      error: {
        message: "dni must be a non-empty string",
        statusCode: 400,
      },
    });
    return;
  }

  if (mail !== undefined && (typeof mail !== "string" || !validateEmail(mail))) {
    res.status(400).json({
      success: false,
      error: {
        message: "mail must be a valid email address",
        statusCode: 400,
      },
    });
    return;
  }

  if (departamento_interes !== undefined && (typeof departamento_interes !== "string" || departamento_interes.trim().length === 0)) {
    res.status(400).json({
      success: false,
      error: {
        message: "departamento_interes must be a non-empty string",
        statusCode: 400,
      },
    });
    return;
  }

  if (carrera_interes !== undefined && (typeof carrera_interes !== "string" || carrera_interes.trim().length === 0)) {
    res.status(400).json({
      success: false,
      error: {
        message: "carrera_interes must be a non-empty string",
        statusCode: 400,
      },
    });
    return;
  }

  if (fecha_interes !== undefined && !validateDate(fecha_interes)) {
    res.status(400).json({
      success: false,
      error: {
        message: "fecha_interes must be a valid date",
        statusCode: 400,
      },
    });
    return;
  }

  if (fecha_entrevista !== undefined && !validateDate(fecha_entrevista)) {
    res.status(400).json({
      success: false,
      error: {
        message: "fecha_entrevista must be a valid date",
        statusCode: 400,
      },
    });
    return;
  }

  if (estado !== undefined && !validateEstadoEstudiante(estado)) {
    res.status(400).json({
      success: false,
      error: {
        message: "estado must be one of: ENTREVISTA, INTERES, ACEPTADO, RECHAZADO",
        statusCode: 400,
      },
    });
    return;
  }

  if (fecha_inscripcion !== undefined && !validateDate(fecha_inscripcion)) {
    res.status(400).json({
      success: false,
      error: {
        message: "fecha_inscripcion must be a valid date",
        statusCode: 400,
      },
    });
    return;
  }

  if (documentos !== undefined && !validateEstudianteDocumentos(documentos)) {
    res.status(400).json({
      success: false,
      error: {
        message: "documentos must be an object with dni_img and analitico_img as non-empty strings",
        statusCode: 400,
      },
    });
    return;
  }

  if (comite !== undefined && !validateEstudianteComiteUpdate(comite)) {
    res.status(400).json({
      success: false,
      error: {
        message: "comite must be an object with decision and comentarios (comite_id and fecha_revision are optional)",
        statusCode: 400,
      },
    });
    return;
  }

  next();
};

const validateDNI = (dni: string): boolean => {
  // Basic DNI validation - adjust regex based on your country's DNI format
  const dniRegex = /^[0-9]{7,8}$/;
  return dniRegex.test(dni);
};

export const validateEmailSubscription = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, institucion_slug } = req.body as CreateEmailSubscriptionRequest;

  if (!email || typeof email !== "string" || !validateEmail(email)) {
    res.status(400).json({
      success: false,
      error: {
        message: "email is required and must be a valid email address",
        statusCode: 400,
      },
    });
    return;
  }

  if (!institucion_slug || typeof institucion_slug !== "string" || institucion_slug.trim().length === 0) {
    res.status(400).json({
      success: false,
      error: {
        message: "institucion_slug is required and must be a non-empty string",
        statusCode: 400,
      },
    });
    return;
  }

  next();
};

export const validateEnrollmentSubmission = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const {
    id_postulante,
    nombre,
    apellido,
    sexo,
    dni,
    mail,
    departamento_interes,
    carrera_interes,
    fecha_interes,
    fecha_entrevista,
    estado,
    documentos,
    comite,
    fecha_inscripcion,
    institucion_slug,
  } = req.body as EnrollmentRequest;

  if (!id_postulante || typeof id_postulante !== "string" || id_postulante.trim().length === 0) {
    res.status(400).json({
      success: false,
      error: {
        message: "id_postulante is required and must be a non-empty string",
        statusCode: 400,
      },
    });
    return;
  }

  if (!nombre || typeof nombre !== "string" || nombre.trim().length === 0) {
    res.status(400).json({
      success: false,
      error: {
        message: "nombre is required and must be a non-empty string",
        statusCode: 400,
      },
    });
    return;
  }

  if (!apellido || typeof apellido !== "string" || apellido.trim().length === 0) {
    res.status(400).json({
      success: false,
      error: {
        message: "apellido is required and must be a non-empty string",
        statusCode: 400,
      },
    });
    return;
  }

  if (!sexo || !validateSexo(sexo)) {
    res.status(400).json({
      success: false,
      error: {
        message: "sexo is required and must be one of: masculino, femenino",
        statusCode: 400,
      },
    });
    return;
  }

  if (!dni || typeof dni !== "string" || !validateDNI(dni)) {
    res.status(400).json({
      success: false,
      error: {
        message: "dni is required and must be a valid DNI format (7-8 digits)",
        statusCode: 400,
      },
    });
    return;
  }

  if (!mail || typeof mail !== "string" || !validateEmail(mail)) {
    res.status(400).json({
      success: false,
      error: {
        message: "mail is required and must be a valid email address",
        statusCode: 400,
      },
    });
    return;
  }

  if (!departamento_interes || typeof departamento_interes !== "string" || departamento_interes.trim().length === 0) {
    res.status(400).json({
      success: false,
      error: {
        message: "departamento_interes is required and must be a non-empty string",
        statusCode: 400,
      },
    });
    return;
  }

  if (!carrera_interes || typeof carrera_interes !== "string" || carrera_interes.trim().length === 0) {
    res.status(400).json({
      success: false,
      error: {
        message: "carrera_interes is required and must be a non-empty string",
        statusCode: 400,
      },
    });
    return;
  }

  if (!fecha_interes || !validateDate(fecha_interes)) {
    res.status(400).json({
      success: false,
      error: {
        message: "fecha_interes is required and must be a valid date",
        statusCode: 400,
      },
    });
    return;
  }

  if (!fecha_entrevista || !validateDate(fecha_entrevista)) {
    res.status(400).json({
      success: false,
      error: {
        message: "fecha_entrevista is required and must be a valid date",
        statusCode: 400,
      },
    });
    return;
  }

  if (!estado || !validateEstadoEstudiante(estado)) {
    res.status(400).json({
      success: false,
      error: {
        message: "estado is required and must be one of: ENTREVISTA, INTERES, ACEPTADO, RECHAZADO",
        statusCode: 400,
      },
    });
    return;
  }

  if (!fecha_inscripcion || !validateDate(fecha_inscripcion)) {
    res.status(400).json({
      success: false,
      error: {
        message: "fecha_inscripcion is required and must be a valid date",
        statusCode: 400,
      },
    });
    return;
  }

  if (!institucion_slug || typeof institucion_slug !== "string" || institucion_slug.trim().length === 0) {
    res.status(400).json({
      success: false,
      error: {
        message: "institucion_slug is required and must be a non-empty string",
        statusCode: 400,
      },
    });
    return;
  }

  if (documentos !== undefined && !validateEstudianteDocumentos(documentos)) {
    res.status(400).json({
      success: false,
      error: {
        message: "documentos must be an object with dni_img and analitico_img as non-empty strings",
        statusCode: 400,
      },
    });
    return;
  }

  if (comite !== undefined && !validateEstudianteComiteUpdate(comite)) {
    res.status(400).json({
      success: false,
      error: {
        message: "comite must be an object with decision and comentarios (comite_id and fecha_revision are optional)",
        statusCode: 400,
      },
    });
    return;
  }

  next();
};

export const validateDNICheck = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { dni } = req.params;
  const { carrera_interes, institucion_slug } = req.query;

  if (!dni || !validateDNI(dni)) {
    res.status(400).json({
      success: false,
      error: {
        message: "dni parameter is required and must be a valid DNI format (7-8 digits)",
        statusCode: 400,
      },
    });
    return;
  }

  if (!carrera_interes || typeof carrera_interes !== "string") {
    res.status(400).json({
      success: false,
      error: {
        message: "carrera_interes query parameter is required",
        statusCode: 400,
      },
    });
    return;
  }

  if (!institucion_slug || typeof institucion_slug !== "string") {
    res.status(400).json({
      success: false,
      error: {
        message: "institucion_slug query parameter is required",
        statusCode: 400,
      },
    });
    return;
  }

  next();
};
