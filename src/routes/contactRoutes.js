import { Router } from 'express';
import { handleContact } from '../controllers/contactController.js';
import rateLimit from 'express-rate-limit';

const router = Router();

// Límite de 5 envíos cada 15 minutos por IP contra ataques de spam
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Has enviado demasiados mensajes recientemente. Por favor espera 15 minutos antes de volver a intentar.'
  }
});

// POST /api/contact protegido con rate limit
router.post('/', contactLimiter, handleContact);

export default router;
