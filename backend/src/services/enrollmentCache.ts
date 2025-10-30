import { getRedis } from "../config/redis";
import { EstudianteModel } from "../models/estudiante";
import { ApiError } from "../middleware/errorHandler";

const DNI_PREFIX = "dni:";
const ENROLLMENT_PREFIX = "enrollment:";
const RESERVATION_PREFIX = "reservation:";

const DEFAULT_TTL = parseInt(process.env.ENROLLMENT_RESERVATION_TTL || "900"); // 15 minutes

export class EnrollmentCacheService {
  private get redis() {
    return getRedis();
  }

  /**
   * Check if DNI exists for a specific carrera_interes at a specific institution
   * Redis first (O(1)), then MongoDB fallback
   */
  async checkDNIExistsForCarrera(
    dni: string,
    carrera_interes: string,
    institucion_slug: string
  ): Promise<boolean> {
    try {
      // Check Redis first (fastest) - use compound key with institucion_slug
      const redisKey = `${DNI_PREFIX}${dni}:${carrera_interes}:${institucion_slug}`;
      const existsInRedis = await this.redis.exists(redisKey);

      if (existsInRedis) {
        return true;
      }

      // Fallback to MongoDB - check specific DNI + carrera + institution combination
      const existsInMongoDB = await EstudianteModel.exists({
        dni,
        carrera_interes,
        institucion_slug,
      });

      if (existsInMongoDB) {
        // Cache the result in Redis for future requests
        await this.redis.setex(redisKey, 3600, "1"); // Cache for 1 hour
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error checking DNI existence for carrera:", error);
      // If Redis fails, fallback to MongoDB
      try {
        return (
          (await EstudianteModel.exists({ dni, carrera_interes, institucion_slug })) !== null
        );
      } catch (mongoError) {
        console.error("MongoDB fallback failed:", mongoError);
        throw new Error("Database connection error") as ApiError;
      }
    }
  }

  /**
   * Get all carreras a DNI is enrolled in (optionally filtered by institution)
   */
  async getDNICarreras(dni: string, institucion_slug?: string): Promise<string[]> {
    try {
      // Build MongoDB query
      const query: any = { dni };
      if (institucion_slug) {
        query.institucion_slug = institucion_slug;
      }

      // Fallback to MongoDB (Redis keys pattern matching is inefficient, so we query MongoDB directly)
      const estudiantes = await EstudianteModel.find(
        query,
        { carrera_interes: 1, institucion_slug: 1 }
      );
      
      // Extract unique carreras
      const carreras = [...new Set(estudiantes.map((est) => est.carrera_interes))];

      // Cache each carrera in Redis with institution slug
      for (const estudiante of estudiantes) {
        const key = `${DNI_PREFIX}${dni}:${estudiante.carrera_interes}:${estudiante.institucion_slug}`;
        await this.redis.setex(key, 3600, "1");
      }

      return carreras;
    } catch (error) {
      console.error("Error getting DNI carreras:", error);
      // If Redis fails, fallback to MongoDB
      try {
        const query: any = { dni };
        if (institucion_slug) {
          query.institucion_slug = institucion_slug;
        }
        const estudiantes = await EstudianteModel.find(query, { carrera_interes: 1 });
        return [...new Set(estudiantes.map((est) => est.carrera_interes))];
      } catch (mongoError) {
        console.error("MongoDB fallback failed:", mongoError);
        throw new Error("Database connection error") as ApiError;
      }
    }
  }

  /**
   * Atomically reserve a DNI for a specific carrera at a specific institution using Redis SETNX
   * Returns true if reservation successful, false if already exists
   */
  async reserveDNIForCarrera(
    dni: string,
    carrera_interes: string,
    institucion_slug: string,
    ttl: number = DEFAULT_TTL
  ): Promise<boolean> {
    try {
      const reservationKey = `${RESERVATION_PREFIX}${dni}:${carrera_interes}:${institucion_slug}`;

      // Atomic operation: SET if Not eXists
      const result = await this.redis.set(
        reservationKey,
        "reserved",
        "EX",
        ttl,
        "NX"
      );

      return result === "OK";
    } catch (error) {
      console.error("Error reserving DNI for carrera:", error);
      throw new Error("Failed to reserve DNI for carrera") as ApiError;
    }
  }

  /**
   * Release a DNI reservation for a specific carrera at a specific institution
   */
  async releaseDNIForCarrera(
    dni: string,
    carrera_interes: string,
    institucion_slug: string
  ): Promise<void> {
    try {
      const reservationKey = `${RESERVATION_PREFIX}${dni}:${carrera_interes}:${institucion_slug}`;
      await this.redis.del(reservationKey);
    } catch (error) {
      console.error("Error releasing DNI reservation for carrera:", error);
      // Don't throw error for release operations
    }
  }

  /**
   * Confirm enrollment and cache the DNI for specific carrera at specific institution permanently
   */
  async confirmEnrollmentForCarrera(
    dni: string,
    carrera_interes: string,
    institucion_slug: string
  ): Promise<void> {
    try {
      const dniKey = `${DNI_PREFIX}${dni}:${carrera_interes}:${institucion_slug}`;
      const enrollmentKey = `${ENROLLMENT_PREFIX}${dni}:${carrera_interes}:${institucion_slug}`;

      // Mark as enrolled in Redis (permanent)
      await this.redis.set(dniKey, "enrolled");
      await this.redis.set(enrollmentKey, "confirmed");

      // Remove any pending reservation
      await this.releaseDNIForCarrera(dni, carrera_interes, institucion_slug);
    } catch (error) {
      console.error("Error confirming enrollment for carrera:", error);
      throw new Error("Failed to confirm enrollment for carrera") as ApiError;
    }
  }

  /**
   * Get DNI enrollment status
   */
  async getDNIStatus(dni: string): Promise<string> {
    try {
      const reservationKey = `${RESERVATION_PREFIX}${dni}`;
      const enrollmentKey = `${ENROLLMENT_PREFIX}${dni}`;

      // Check if enrolled
      const isEnrolled = await this.redis.exists(enrollmentKey);
      if (isEnrolled) {
        return "ENROLLED";
      }

      // Check if reserved
      const isReserved = await this.redis.exists(reservationKey);
      if (isReserved) {
        return "RESERVED";
      }

      return "AVAILABLE";
    } catch (error) {
      console.error("Error getting DNI status:", error);
      return "ERROR";
    }
  }

  /**
   * Get enrollment statistics for an institution
   */
  async getInstitutionStats(institucion_slug: string): Promise<{
    total_enrollments: number;
    pending_enrollments: number;
    confirmed_enrollments: number;
    rejected_enrollments: number;
  }> {
    try {
      const stats = await EstudianteModel.aggregate([
        { $match: { institucion_slug } },
        {
          $group: {
            _id: "$enrollment_status",
            count: { $sum: 1 },
          },
        },
      ]);

      const result = {
        total_enrollments: 0,
        pending_enrollments: 0,
        confirmed_enrollments: 0,
        rejected_enrollments: 0,
      };

      stats.forEach((stat) => {
        result.total_enrollments += stat.count;
        switch (stat._id) {
          case "PENDING":
            result.pending_enrollments = stat.count;
            break;
          case "CONFIRMED":
            result.confirmed_enrollments = stat.count;
            break;
          case "REJECTED":
            result.rejected_enrollments = stat.count;
            break;
        }
      });

      return result;
    } catch (error) {
      console.error("Error getting institution stats:", error);
      throw new Error("Failed to get institution statistics") as ApiError;
    }
  }

  /**
   * Clean up expired reservations (can be called periodically)
   */
  async cleanupExpiredReservations(): Promise<number> {
    try {
      const pattern = `${RESERVATION_PREFIX}*`;
      const keys = await this.redis.keys(pattern);

      if (keys.length === 0) {
        return 0;
      }

      // Check TTL for each key and delete if expired
      let deletedCount = 0;
      for (const key of keys) {
        const ttl = await this.redis.ttl(key);
        if (ttl === -2) {
          // Key doesn't exist (expired)
          await this.redis.del(key);
          deletedCount++;
        }
      }

      return deletedCount;
    } catch (error) {
      console.error("Error cleaning up expired reservations:", error);
      return 0;
    }
  }

  /**
   * Health check for Redis connection
   */
  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.redis.ping();
      return result === "PONG";
    } catch (error) {
      console.error("Redis health check failed:", error);
      return false;
    }
  }
}

export const enrollmentCacheService = new EnrollmentCacheService();
