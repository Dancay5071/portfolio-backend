import { Router } from 'express';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/projectsController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

// Ruta para listar proyectos
router.get('/', getProjects);

// Rutas protegidas (SOLO con token de admin)
router.post('/', verifyToken, createProject);
router.put('/:id', verifyToken, updateProject);
router.delete('/:id', verifyToken, deleteProject);

export default router;
