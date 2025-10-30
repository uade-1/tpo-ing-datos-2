import { Router } from "express";
import {
  createEstudiante,
  getAllEstudiantes,
  getEstudianteByIdPostulante,
  getEstudiantesByInstitution,
  updateEstudiante,
  deleteEstudiante,
} from "../controllers/estudiante";
import {
  validateCreateEstudiante,
  validateUpdateEstudiante,
} from "../middleware/validation";

const router = Router();

router.post("/", validateCreateEstudiante, createEstudiante);
router.get("/", getAllEstudiantes);
router.get("/institucion/:institucion_slug", getEstudiantesByInstitution);
router.get("/:id_postulante", getEstudianteByIdPostulante);
router.patch("/:id_postulante", validateUpdateEstudiante, updateEstudiante);
router.put("/:id_postulante", validateUpdateEstudiante, updateEstudiante);
router.delete("/:id_postulante", deleteEstudiante);

export default router;
