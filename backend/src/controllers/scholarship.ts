import { Request, Response, NextFunction } from "express";
import { cassandraService } from "../services/cassandraService";
import { EstudianteModel } from "../models/estudiante";
import { ApiError } from "../middleware/errorHandler";

export const registerScholarshipManual = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { dni } = req.params;

    // Buscar estudiante en MongoDB
    const estudiante = await EstudianteModel.findOne({ dni });

    if (!estudiante) {
      const error = new Error("Estudiante no encontrado") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    if (estudiante.estado !== "ACEPTADO") {
      const error = new Error(
        "Solo estudiantes ACEPTADOS pueden registrarse como becados"
      ) as ApiError;
      error.statusCode = 400;
      throw error;
    }

    const estudiantePlain = (estudiante as any).toObject
      ? (estudiante as any).toObject()
      : (estudiante as any);
    await cassandraService.registerScholarship(estudiantePlain as any);

    res.status(201).json({
      success: true,
      data: {
        message: "Estudiante registrado como becado en Cassandra",
        dni: estudiante.dni,
        nombre: estudiante.nombre,
        apellido: estudiante.apellido,
        carrera: estudiante.carrera_interes,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getScholarship = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { institucion_slug, año, dni } = req.params;

    const scholarship = await cassandraService.getScholarshipByDNI(
      institucion_slug,
      parseInt(año),
      dni
    );

    if (!scholarship) {
      const error = new Error("Registro de beca no encontrado") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: scholarship,
    });
  } catch (error) {
    next(error);
  }
};

export const getScholarshipsByInstitution = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { institucion_slug, año } = req.params;

    const scholarships = await cassandraService.getScholarshipsByInstitution(
      institucion_slug,
      parseInt(año)
    );

    res.status(200).json({
      success: true,
      data: {
        institucion_slug,
        año: parseInt(año),
        scholarships,
        total: scholarships.length,
      },
    });
  } catch (error) {
    next(error);
  }
};
