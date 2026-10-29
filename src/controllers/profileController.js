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
    const { name, title, description, url_foto, cv_url } = req.body;
    // Verificar si ya existe al menos una fila
    const { data: existing } = await supabase
      .from('perfil')
      .select('id')
      .limit(1)
      .maybeSingle();
    const payload = {
      nombre: name,
      titulo: title,
      descripcion: description || '',
      avatar_url: url_foto || '',
      cv_url: cv_url || '',
      updated_at: new Date().toISOString()
    };
    let result;
    if (existing?.id) {
      result = await supabase
        .from('perfil')
        .update(payload)
        .eq('id', existing.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from('perfil')
        .insert([payload])
        .select()
        .single();
    }
    if (result.error) throw result.error;
    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: result.data
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error interno al actualizar el perfil'
    });
  }
};
