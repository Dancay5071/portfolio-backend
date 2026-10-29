import { supabase } from '../config/supabase.js';
import { sendCvRequestNotificationEmail } from '../services/emailService.js';

/**
 * Procesa la solicitud de acceso al CV:
 * 1. Valida los datos y descarta bots (honeypot).
 * 2. Obtiene la URL del CV desde la BD.
 * 3. Registra la solicitud en Supabase (si la tabla está disponible).
 * 4. Envía notificación por correo a la dueña del portfolio.
 * 5. Devuelve la URL del CV para su visualización/descarga.
 */
export const handleCvRequest = async (req, res) => {
  try {
    const { name, email, company, honeypot } = req.body;

    // Si el honeypot fue completado, es un bot. Respondemos con éxito fingido.
    if (honeypot) {
      return res.status(200).json({
        success: true,
        message: 'Solicitud procesada correctamente.'
      });
    }

    const nombre = name?.trim();
    const correo = email?.trim();
    const empresa = company?.trim() || '';

    // Validaciones
    if (!nombre || !correo) {
      return res.status(400).json({
        success: false,
        message: 'Por favor completá tu nombre y correo electrónico.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      return res.status(400).json({
        success: false,
        message: 'El formato de correo electrónico no es válido.'
      });
    }

    // 1. Obtener la URL del CV desde la tabla perfil
    const { data: perfilData, error: perfilError } = await supabase
      .from('perfil')
      .select('cv_url')
      .limit(1)
      .maybeSingle();

    if (perfilError) {
      console.error('Error al obtener cv_url de perfil:', perfilError.message);
    }

    const cvUrl = perfilData?.cv_url || '';

    if (!cvUrl) {
      return res.status(404).json({
        success: false,
        message: 'El currículum no se encuentra disponible temporalmente.'
      });
    }

    const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    // 2. Registrar en Supabase (tabla 'solicitudes_cv')
    // Con bloque try/catch defensivo: si la tabla no fue creada aún en Supabase,
    // no bloqueamos el acceso al CV y dejamos registro en consola.
    try {
      const { error: insertError } = await supabase
        .from('solicitudes_cv')
        .insert([
          {
            nombre,
            email: correo,
            empresa,
            ip_origen: clientIp,
            user_agent: userAgent,
            created_at: new Date().toISOString()
          }
        ]);

      if (insertError) {
        console.warn('Nota: No se pudo registrar en tabla "solicitudes_cv":', insertError.message);
      }
    } catch (dbErr) {
      console.warn('Error al intentar guardar solicitud de CV en BD:', dbErr.message);
    }

    // 3. Enviar notificación por email
    try {
      await sendCvRequestNotificationEmail({
        nombre,
        email: correo,
        empresa
      });
    } catch (emailErr) {
      console.error('Error al enviar email de notificación de CV:', emailErr.message);
    }

    // 4. Retornar éxito y la URL para acceso
    return res.status(200).json({
      success: true,
      message: '¡Acceso verificado! Tu currículum está listo.',
      cvUrl: cvUrl
    });

  } catch (error) {
    console.error('Error en handleCvRequest:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Ocurrió un error al procesar tu solicitud. Por favor intenta nuevamente.'
    });
  }
};

// GET /api/cv/requests - Lista de solicitudes para panel de administración
export const getCvRequests = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('solicitudes_cv')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.json({ success: true, data: [] });
    }

    return res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('Error al obtener solicitudes de CV:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener solicitudes de CV'
    });
  }
};

// DELETE /api/cv/requests/:id - Eliminar solicitud
export const deleteCvRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('solicitudes_cv')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return res.json({
      success: true,
      message: 'Solicitud eliminada correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar solicitud de CV:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar solicitud de CV'
    });
  }
};

