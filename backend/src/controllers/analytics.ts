import { Request, Response, NextFunction } from "express";
import { neo4jAnalyticsService } from "../services/neo4jAnalytics";
import { ApiError } from "../middleware/errorHandler";

export const getCarrerasEstudiante = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { dni } = req.params;
    const carreras = await neo4jAnalyticsService.getCarrerasEstudiante(dni);

    res.status(200).json({
      success: true,
      data: {
        dni,
        carreras,
        total: carreras.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getEstudiantesPorCarrera = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { nombre_carrera } = req.params;
    const { estado } = req.query;

    const estudiantes = await neo4jAnalyticsService.getEstudiantesPorCarrera(
      nombre_carrera,
      estado as string | undefined
    );

    res.status(200).json({
      success: true,
      data: {
        carrera: nombre_carrera,
        estado: estado || "todos",
        estudiantes,
        total: estudiantes.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getEstadisticasCarrera = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { nombre_carrera } = req.params;
    const estadisticas = await neo4jAnalyticsService.getEstadisticasCarrera(
      nombre_carrera
    );

    res.status(200).json({
      success: true,
      data: {
        carrera: nombre_carrera,
        estadisticas,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getEstudiantesMultiCarrera = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const estudiantes =
      await neo4jAnalyticsService.getEstudiantesMultiCarrera();

    res.status(200).json({
      success: true,
      data: {
        estudiantes,
        total: estudiantes.length,
      },
    });
  } catch (error) {
    next(error);
  }
};
