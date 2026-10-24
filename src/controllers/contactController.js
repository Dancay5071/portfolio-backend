import { supabase } from '../config/supabase.js';
import { sendNotificationEmail } from '../services/emailService.js';

export const handleContact = async (req, res) => {
  try {
    
    const nombre = req.body.name || req.body.nombre;
    const email = req.body.email;
    const mensaje = req.body.message || req.body.mensaje;
    // Validaciones básicas
    if (!nombre || !email || !mensaje) {
      return res.status(400).json({
        success: false,
        message: 'Por favor completá todos los campos (nombre, email y mensaje).'
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'El formato de correo electrónico no es válido.'
      });
    }
    //  Guardar en Supabase
    const { data, error } = await supabase
      .from('mensajes_contacto')
      .insert([
        {
          nombre: nombre.trim(),
          email: email.trim(),
          mensaje: mensaje.trim(),
          ip_origen: req.ip || req.headers['x-forwarded-for'] || ''
        }
      ])
      .single();
    if (error) {
      console.error('Error al guardar mensaje en Supabase:', error);
      throw error;
    }
    // Enviar notificación por correo
    try {
      await sendNotificationEmail({ nombre, email, mensaje });
    } catch (emailError) {
      console.error('Error al enviar el mail (pero quedó guardado en la base de datos):', emailError.message);
    }

    // Respuesta exitosa
    res.status(201).json({
      success: true,
      message: '¡Mensaje enviado con éxito! Me pondré en contacto a la brevedad.',
    });
  } catch (error) {
    console.error('Error en el endpoint de contacto:', error.message);
    res.status(500).json({
      success: false,
      message: 'Ocurrió un error al procesar tu mensaje. Por favor intenta nuevamente.'
    });
  }
};