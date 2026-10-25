import { Router } from 'express';
import { recordVisit, getVisitStats } from '../controllers/visitsController.js';
import rateLimit from 'express-rate-limit';

const router = Router();

// Límite para evitar spam en la base de datos
const visitLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Límite de registro de visitas excedido.'
  }
});

// Registrar visita
router.post('/', visitLimiter, recordVisit);

// Consultar estadísticas de visitas 
router.get('/stats', getVisitStats);

export default router;
