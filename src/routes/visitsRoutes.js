import { Router } from 'express';
import { recordVisit, getVisitStats } from '../controllers/visitsController.js';

const router = Router();
// Registrar visita

router.post('/', recordVisit);

// Consultar estadísticas

router.get('/stats', getVisitStats);

export default router;