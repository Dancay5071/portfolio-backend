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
    const { error } = await supabase
      .from('mensajes_contacto')
      .insert([
        {
          nombre: nombre.trim(),
          email: email.trim(),
          mensaje: mensaje.trim(),
          ip_origen: req.ip || req.headers['x-forwarded-for'] || ''
        }
      ])

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

// GET /api/contact - Obtener todos los mensajes (protegido)
export const getMessages = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('mensajes_contacto')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('Error al obtener mensajes:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error al obtener mensajes de contacto'
    });
  }
};

// DELETE /api/contact/:id - Eliminar un mensaje (protegido)
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('mensajes_contacto')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Mensaje eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar mensaje:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el mensaje'
    });
  }
};