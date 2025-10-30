import { Request, Response, NextFunction } from "express";
import { EstudianteModel } from "../models/estudiante";
import { neo4jSyncService } from "../services/neo4jSync";
import { cassandraService } from "../services/cassandraService";
import {
  CreateEstudianteRequest,
  UpdateEstudianteRequest,
} from "../types/estudiante";
import { ApiError } from "../middleware/errorHandler";

export const createEstudiante = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const estudianteData: CreateEstudianteRequest = req.body;

    const existingEstudiante = await EstudianteModel.findOne({
      id_postulante: estudianteData.id_postulante,
    });
    if (existingEstudiante) {
      const error = new Error(
        "Estudiante with this id_postulante already exists"
      ) as ApiError;
      error.statusCode = 409;
      throw error;
    }

    const estudiante = new EstudianteModel(estudianteData);
    const savedEstudiante = await estudiante.save();

    res.status(201).json({
      success: true,
      data: savedEstudiante,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllEstudiantes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const estudiantes = await EstudianteModel.find({});

    res.status(200).json({
      success: true,
      data: estudiantes,
    });
  } catch (error) {
    next(error);
  }
};

export const getEstudiantesByInstitution = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { institucion_slug } = req.params;

    const estudiantes = await EstudianteModel.find(
      { institucion_slug },
      {
        nombre: 1,
        apellido: 1,
        carrera_interes: 1,
        departamento_interes: 1,
        estado: 1,
        id_postulante: 1,
        dni: 1,
        mail: 1,
        fecha_resolucion: 1,
        fecha_interes: 1,
        fecha_entrevista: 1,
      }
    ).sort({ fecha_resolucion: -1 }); // Most recent first

    res.status(200).json({
      success: true,
      data: estudiantes,
    });
  } catch (error) {
    next(error);
  }
};

export const getEstudianteByIdPostulante = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id_postulante } = req.params;

    const estudiante = await EstudianteModel.findOne({ id_postulante });

    if (!estudiante) {
      const error = new Error("Estudiante not found") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: estudiante,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEstudiante = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id_postulante } = req.params;
    const updateData: UpdateEstudianteRequest = req.body;

    // Obtener estudiante existente para comparar estado
    const existingEstudiante = await EstudianteModel.findOne({ id_postulante });
    if (!existingEstudiante) {
      const error = new Error("Estudiante not found") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    // Auto-generate comite_id and fecha_revision if comite is provided but missing these fields
    if (updateData.comite && typeof updateData.comite === "object") {
      if (!updateData.comite.comite_id) {
        updateData.comite.comite_id = `COM${Date.now()}`;
      }
      if (!updateData.comite.fecha_revision) {
        updateData.comite.fecha_revision = new Date().toISOString();
      }
    }

    const estudiante = await EstudianteModel.findOneAndUpdate(
      { id_postulante },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!estudiante) {
      const error = new Error("Estudiante not found") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    // Si el estado cambió, actualizar Neo4j
    if (updateData.estado && existingEstudiante.estado !== updateData.estado) {
      try {
        await neo4jSyncService.updateEnrollmentStatus(
          existingEstudiante.dni,
          existingEstudiante.carrera_interes,
          updateData.estado,
          existingEstudiante.estado
        );
      } catch (neo4jError) {
        console.error("Error actualizando Neo4j:", neo4jError);
      }
    }

    // Si el estado cambió a ACEPTADO o RECHAZADO, registrar en Cassandra
    if (
      (updateData.estado === "ACEPTADO" || updateData.estado === "RECHAZADO") &&
      existingEstudiante.estado !== updateData.estado
    ) {
      try {
        const estudiantePlain = (estudiante as any).toObject
          ? (estudiante as any).toObject()
          : (estudiante as any);
        await cassandraService.registerScholarship(estudiantePlain as any);
        console.log(
          `Estudiante ${estudiante.dni} registrado en Cassandra con estado ${updateData.estado}`
        );
      } catch (cassandraError) {
        console.error("Error registrando en Cassandra:", cassandraError);
        // No fallar la actualización si Cassandra falla
      }
    }

    // Si ya estaba ACEPTADO o RECHAZADO y se actualizó, sincronizar cambios
    if (
      (updateData.estado === "ACEPTADO" || updateData.estado === "RECHAZADO") &&
      (existingEstudiante.estado === "ACEPTADO" || existingEstudiante.estado === "RECHAZADO") &&
      existingEstudiante.estado === updateData.estado
    ) {
      try {
        const año = estudiante.fecha_resolucion
          ? new Date(estudiante.fecha_resolucion).getFullYear()
          : new Date().getFullYear();
        await cassandraService.updateScholarship(
          estudiante.institucion_slug,
          año,
          estudiante.dni,
          updateData as any
        );
        console.log(
          `Datos actualizados en Cassandra para ${estudiante.dni}`
        );
      } catch (cassandraError) {
        console.error("Error actualizando Cassandra:", cassandraError);
        // No fallar la actualización si Cassandra falla
      }
    }

    res.status(200).json({
      success: true,
      data: estudiante,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEstudiante = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id_postulante } = req.params;

    const estudiante = await EstudianteModel.findOneAndDelete({
      id_postulante,
    });

    if (!estudiante) {
      const error = new Error("Estudiante not found") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
