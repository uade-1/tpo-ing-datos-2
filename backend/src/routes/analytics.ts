import { Router } from "express";
import {
  getCarrerasEstudiante,
  getEstudiantesPorCarrera,
  getEstadisticasCarrera,
  getEstudiantesMultiCarrera,
  getGraphDataByInstitution,
} from "../controllers/analytics";

const router = Router();

// GET /api/v1/analytics/estudiante/:dni/carreras
router.get("/estudiante/:dni/carreras", getCarrerasEstudiante);

// GET /api/v1/analytics/carrera/:nombre_carrera/estudiantes?estado=ACEPTADO
router.get("/carrera/:nombre_carrera/estudiantes", getEstudiantesPorCarrera);

// GET /api/v1/analytics/carrera/:nombre_carrera/estadisticas
router.get("/carrera/:nombre_carrera/estadisticas", getEstadisticasCarrera);

// GET /api/v1/analytics/estudiantes/multi-carrera
router.get("/estudiantes/multi-carrera", getEstudiantesMultiCarrera);

// GET /api/v1/analytics/graph/institucion/:institucion_slug
router.get("/graph/institucion/:institucion_slug", getGraphDataByInstitution);

export default router;
