import { Router } from 'express';
import {
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience
} from '../controllers/experienceController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

// Ruta para listar experiencia (Pública)
router.get('/', getExperience);

// Rutas protegidas (SOLO con token de admin)
router.post('/', verifyToken, createExperience);
router.put('/:id', verifyToken, updateExperience);
router.delete('/:id', verifyToken, deleteExperience);

export default router;
