import { supabase } from '../config/supabase.js';

// POST /api/auth/login - Iniciar sesión como administradora
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor ingresá tu email y contraseña.'
      });
    }

    // Autenticar contra Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas (email o contraseña incorrectos).'
      });
    }

    // Entrega de token JWT y los datos del usuario
    res.json({
      success: true,
      message: '¡Bienvenida al Panel de Control!',
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email
      }
    });

  } catch (error) {
    console.error('Error en login:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error interno en el servidor al intentar iniciar sesión.'
    });
  }
};
