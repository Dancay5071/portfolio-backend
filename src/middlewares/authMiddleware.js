import { supabase } from '../config/supabase.js';

// Middleware que protege rutas privadas
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Verificar si enviaron la cabecera 'Authorization: Bearer <token>'
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Acceso denegado: No se proporcionó un token de autenticación.'
      });
    }

    const token = authHeader.split(' ')[1];

    // Validar el token con Supabase Auth
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(403).json({
        success: false,
        message: 'Token inválido o expirado. Por favor iniciá sesión nuevamente.'
      });
    }

    // Adjuntar los datos del usuario a la petición y continuar
    req.user = user;
    next();

  } catch (error) {
    console.error('Error en authMiddleware:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error al verificar la autenticación.'
    });
  }
};
