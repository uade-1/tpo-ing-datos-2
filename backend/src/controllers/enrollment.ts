import { Request, Response, NextFunction } from "express";
import { EstudianteModel } from "../models/estudiante";
import { EmailSubscriptionModel } from "../models/emailSubscription";
import { InstitucionModel } from "../models/institucion";
import { enrollmentCacheService } from "../services/enrollmentCache";
import { neo4jSyncService } from "../services/neo4jSync";
import {
  CreateEmailSubscriptionRequest,
  EnrollmentRequest,
  EnrollmentCheckResponse,
  InstitutionEnrollmentStatus,
} from "../types/enrollment";
import { ApiError } from "../middleware/errorHandler";

/**
 * Check if a DNI is available for enrollment in a specific carrera
 * Uses Redis for fast lookup with MongoDB fallback
 */
export const checkDNIAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { dni } = req.params;
    const { carrera_interes, institucion_slug } = req.query;

    if (!carrera_interes || typeof carrera_interes !== "string") {
      const error = new Error(
        "carrera_interes query parameter is required"
      ) as ApiError;
      error.statusCode = 400;
      throw error;
    }

    if (!institucion_slug || typeof institucion_slug !== "string") {
      const error = new Error(
        "institucion_slug query parameter is required"
      ) as ApiError;
      error.statusCode = 400;
      throw error;
    }

    // Check if DNI exists for this specific carrera at this specific institution
    const existsForCarrera =
      await enrollmentCacheService.checkDNIExistsForCarrera(
        dni,
        carrera_interes,
        institucion_slug
      );

    // Get all carreras this DNI is enrolled in (at this institution)
    const existingCarreras = await enrollmentCacheService.getDNICarreras(dni, institucion_slug);

    const response: EnrollmentCheckResponse = {
      available: !existsForCarrera,
      message: existsForCarrera
        ? `DNI already enrolled in ${carrera_interes} at this institution`
        : existingCarreras.length > 0
        ? `DNI available for ${carrera_interes}. Currently enrolled in: ${existingCarreras.join(
            ", "
          )}`
        : "DNI is available for enrollment",
      status: existsForCarrera ? "ENROLLED" : "AVAILABLE",
      existing_carreras: existingCarreras,
    };

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Subscribe with email only (lightweight enrollment)
 */
export const subscribeWithEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, institucion_slug }: CreateEmailSubscriptionRequest =
      req.body;

    // Verify institution exists
    const institution = await InstitucionModel.findOne({
      slug: institucion_slug,
    });
    if (!institution) {
      const error = new Error("Institution not found") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    // Check if email already subscribed
    const existingSubscription = await EmailSubscriptionModel.findOne({
      email,
    });
    if (existingSubscription) {
      const error = new Error("Email already subscribed") as ApiError;
      error.statusCode = 409;
      throw error;
    }

    // Create email subscription
    const subscription = new EmailSubscriptionModel({
      email,
      institucion_slug,
      subscribed_at: new Date(),
      converted_to_enrollment: false,
    });

    const savedSubscription = await subscription.save();

    res.status(201).json({
      success: true,
      data: {
        message: "Successfully subscribed to institution updates",
        subscription: savedSubscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Submit full enrollment form
 * Uses Redis for atomic DNI reservation to handle high concurrency
 * Allows multiple carreras per DNI
 */
export const submitEnrollment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let dniReserved = false;

  try {
    const enrollmentData: EnrollmentRequest = req.body;
    const { dni, institucion_slug, carrera_interes } = enrollmentData;

    // Verify institution exists
    const institution = await InstitucionModel.findOne({
      slug: institucion_slug,
    });
    if (!institution) {
      const error = new Error("Institution not found") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    // Check if DNI already exists for this specific carrera at this institution (Redis + MongoDB)
    const dniExistsForCarrera =
      await enrollmentCacheService.checkDNIExistsForCarrera(
        dni,
        carrera_interes,
        institucion_slug
      );
    if (dniExistsForCarrera) {
      const error = new Error(
        `DNI already enrolled in ${carrera_interes} at this institution`
      ) as ApiError;
      error.statusCode = 409;
      throw error;
    }

    // Atomically reserve DNI for this carrera at this institution in Redis (handles 2M+ concurrent requests)
    const reservationSuccess =
      await enrollmentCacheService.reserveDNIForCarrera(dni, carrera_interes, institucion_slug);
    if (!reservationSuccess) {
      const error = new Error(
        `DNI is currently being processed for ${carrera_interes} at this institution by another user`
      ) as ApiError;
      error.statusCode = 409;
      throw error;
    }

    dniReserved = true;

    // Create estudiante in MongoDB
    const estudiante = new EstudianteModel({
      ...enrollmentData,
    });

    const savedEstudiante = await estudiante.save();

    // Confirm enrollment in Redis (mark as permanently enrolled for this carrera at this institution)
    await enrollmentCacheService.confirmEnrollmentForCarrera(
      dni,
      carrera_interes,
      institucion_slug
    );

    // Sincronizar con Neo4j
    try {
      await neo4jSyncService.syncEstudiante(
        dni,
        enrollmentData.nombre,
        enrollmentData.apellido
      );
      await neo4jSyncService.syncInstitucion(
        institucion_slug,
        institution.nombre
      );
      await neo4jSyncService.syncCarrera(
        carrera_interes,
        enrollmentData.departamento_interes,
        institucion_slug
      );
      await neo4jSyncService.createEnrollmentRelation(
        dni,
        carrera_interes,
        enrollmentData.estado,
        enrollmentData.fecha_resolucion
          ? new Date(enrollmentData.fecha_resolucion)
          : undefined,
        enrollmentData.fecha_entrevista
          ? new Date(enrollmentData.fecha_entrevista)
          : undefined
      );
    } catch (neo4jError) {
      console.error("Error sincronizando con Neo4j:", neo4jError);
      // No fallar el enrollment si Neo4j falla
    }

    // Update email subscription if exists
    await EmailSubscriptionModel.updateOne(
      { email: enrollmentData.mail },
      { converted_to_enrollment: true }
    );

    res.status(201).json({
      success: true,
      data: {
        message: `Enrollment submitted successfully for ${carrera_interes}`,
        estudiante: savedEstudiante,
      },
    });
  } catch (error) {
    // Rollback: release DNI reservation if MongoDB operation failed
    if (dniReserved && req.body?.dni && req.body?.carrera_interes && req.body?.institucion_slug) {
      await enrollmentCacheService.releaseDNIForCarrera(
        req.body.dni,
        req.body.carrera_interes,
        req.body.institucion_slug
      );
    }
    next(error);
  }
};

/**
 * Get enrollment status for an institution
 */
export const getInstitutionEnrollmentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { institucion_slug } = req.params;

    // Verify institution exists
    const institution = await InstitucionModel.findOne({
      slug: institucion_slug,
    });
    if (!institution) {
      const error = new Error("Institution not found") as ApiError;
      error.statusCode = 404;
      throw error;
    }

    // Get enrollment statistics
    const stats = await enrollmentCacheService.getInstitutionStats(
      institucion_slug
    );

    const response: InstitutionEnrollmentStatus = {
      institucion_slug,
      ...stats,
    };

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get enrollment statistics for all institutions
 */
export const getAllInstitutionStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const institutions = await InstitucionModel.find(
      {},
      { slug: 1, nombre: 1 }
    );

    const statsPromises = institutions.map(async (institution) => {
      const stats = await enrollmentCacheService.getInstitutionStats(
        institution.slug
      );
      return {
        institucion_slug: institution.slug,
        institucion_nombre: institution.nombre,
        ...stats,
      };
    });

    const allStats = await Promise.all(statsPromises);

    res.status(200).json({
      success: true,
      data: allStats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Health check for Redis connection
 */
export const healthCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const redisHealthy = await enrollmentCacheService.healthCheck();

    res.status(200).json({
      success: true,
      data: {
        redis: redisHealthy ? "connected" : "disconnected",
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
};
