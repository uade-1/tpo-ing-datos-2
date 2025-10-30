import { Router } from "express";
import {
  createEstudiante,
  getAllEstudiantes,
  getEstudianteByIdPostulante,
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
router.get("/:id_postulante", getEstudianteByIdPostulante);
router.patch("/:id_postulante", validateUpdateEstudiante, updateEstudiante);
router.delete("/:id_postulante", deleteEstudiante);

export default router;
