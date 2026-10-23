import { Router } from 'express';
import { getExperience} from '../controllers/experienceController.js';

const router = Router();

// Ruta para listar experiencia
router.get('/', getExperience);

export default router;
