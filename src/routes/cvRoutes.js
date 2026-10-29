import { Router } from 'express';
import { handleCvRequest, getCvRequests, deleteCvRequest } from '../controllers/cvController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import rateLimit from 'express-rate-limit';

const router = Router();

// Límite de 8 solicitudes cada 15 minutos por IP para evitar saturación
const cvLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Has realizado varias solicitudes de CV recientemente. Por favor espera unos minutos antes de volver a intentar.'
  }
});

// POST /api/cv/request - Público con rate limit y honeypot
router.post('/request', cvLimiter, handleCvRequest);

// Rutas protegidas para administración
router.get('/requests', verifyToken, getCvRequests);
router.delete('/requests/:id', verifyToken, deleteCvRequest);

export default router;

