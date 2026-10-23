import { Router } from 'express';
import { getProjects } from '../controllers/projectsController.js';

const router = Router();

// Ruta para listar proyectos
router.get('/', getProjects);

export default router;
