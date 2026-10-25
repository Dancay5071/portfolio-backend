import { Router } from 'express';
import { login } from '../controllers/authController.js';
import rateLimit from 'express-rate-limit';

const router = Router();

// Límite estricto: máximo 5 intentos cada 15 minutos por IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Demasiados intentos de inicio de sesión. Por motivos de seguridad, tu acceso fue bloqueado temporalmente por 15 minutos.'
  }
});

// POST /api/auth/login protegido
router.post('/login', authLimiter, login);

export default router;
