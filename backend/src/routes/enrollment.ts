import { Router } from "express";
import {
  checkDNIAvailability,
  subscribeWithEmail,
  submitEnrollment,
  getInstitutionEnrollmentStatus,
  getAllInstitutionStats,
  healthCheck,
} from "../controllers/enrollment";
import {
  validateEmailSubscription,
  validateEnrollmentSubmission,
  validateDNICheck,
} from "../middleware/validation";

const router = Router();

// DNI availability check (fast Redis lookup) - requires carrera_interes query param
router.get("/check/:dni", validateDNICheck, checkDNIAvailability);

// Email subscription (lightweight enrollment)
router.post("/subscribe", validateEmailSubscription, subscribeWithEmail);

// Full enrollment submission (with Redis DNI reservation)
router.post("/submit", validateEnrollmentSubmission, submitEnrollment);

// Institution enrollment statistics
router.get("/status/:institucion_slug", getInstitutionEnrollmentStatus);

// All institutions statistics
router.get("/stats", getAllInstitutionStats);

// Health check
router.get("/health", healthCheck);

export default router;
