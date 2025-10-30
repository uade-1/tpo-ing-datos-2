import { Router } from "express";
import {
  registerScholarshipManual,
  getScholarship,
  getScholarshipsByInstitution,
} from "../controllers/scholarship";

const router = Router();

console.log("[Scholarship Routes] Registering scholarship routes...");

// POST /api/v1/scholarships/register/:dni - Registrar manualmente
router.post("/register/:dni", registerScholarshipManual);
console.log("[Scholarship Routes] POST /register/:dni registered");

// GET /api/v1/scholarships/:institucion_slug/:anio/:dni - Obtener becado específico
router.get("/:institucion_slug/:anio/:dni", (req, res, next) => {
  console.log(`[Scholarship GET] Called with params:`, req.params);
  // Map anio to año for the controller
  (req.params as any).año = req.params.anio;
  getScholarship(req, res, next);
});
console.log("[Scholarship Routes] GET /:institucion_slug/:anio/:dni registered");

// GET /api/v1/scholarships/:institucion_slug/:anio - Todos los becados de institución/año
router.get("/:institucion_slug/:anio", (req, res, next) => {
  // Map anio to año for the controller
  (req.params as any).año = req.params.anio;
  getScholarshipsByInstitution(req, res, next);
});
console.log("[Scholarship Routes] GET /:institucion_slug/:anio registered");

export default router;
