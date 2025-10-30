import { Router } from "express";
import {
  createInstitucion,
  getAllInstituciones,
  getInstitucionBySlug,
  updateInstitucion,
  deleteInstitucion,
} from "../controllers/institucion";
import {
  validateCreateInstitucion,
  validateUpdateInstitucion,
} from "../middleware/validation";

const router = Router();

router.post("/", validateCreateInstitucion, createInstitucion);
router.get("/", getAllInstituciones);
router.get("/:slug", getInstitucionBySlug);
router.patch("/:slug", validateUpdateInstitucion, updateInstitucion);
router.delete("/:slug", deleteInstitucion);

export default router;
