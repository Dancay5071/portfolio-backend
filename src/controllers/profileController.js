import { supabase } from '../config/supabase.js';

export const getProfile = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('perfil')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    res.json({
      success: true,
      data: data ? {
        id: data.id,
        name: data.nombre,
        title: data.titulo,
        description: data.descripcion,
        url_foto: data.avatar_url,
        // Protegemos el enlace directo del CV para que no sea visible públicamente
        // en la petición inicial de la web. En su lugar enviamos has_cv.
        has_cv: Boolean(data.cv_url)
      } : null
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los datos del perfil'
    });
  }
};

// PUT /api/profile
export const updateProfile = async (req, res) => {
  try {
    const { name, title, description, url_foto, cv_url, nombre, titulo, descripcion, avatar_url } = req.body;

    const { data: existing } = await supabase
      .from('perfil')
      .select('id')
      .limit(1)
      .maybeSingle();

    const payload = {
      nombre: (name ?? nombre ?? '').trim(),
      titulo: (title ?? titulo ?? '').trim(),
      descripcion: (description ?? descripcion ?? '').trim(),
      avatar_url: url_foto || avatar_url || '',
      cv_url: cv_url || '',
    };

    let result;
    if (existing?.id) {
      // Intentar primero con updated_at
      result = await supabase
        .from('perfil')
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .maybeSingle();

      // Si falló por columna updated_at inexistente, reintentar sin ella
      if (result.error && (result.error.message.includes('updated_at') || result.error.code === '42703')) {
        result = await supabase
          .from('perfil')
          .update(payload)
          .eq('id', existing.id)
          .select()
          .maybeSingle();
      }
    } else {
      result = await supabase
        .from('perfil')
        .insert([payload])
        .select()
        .maybeSingle();
    }

    if (result.error) {
      console.error('Error de Supabase en updateProfile:', result.error);
      throw result.error;
    }

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: result.data
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Error interno al actualizar el perfil'
    });
  }
};
