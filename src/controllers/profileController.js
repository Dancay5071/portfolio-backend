import {supabase} from '../config/supabase.js';

export const getProfile = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('perfil')
      .select('*')
      .limit(1)
      .single();
    if (error) throw error;
    // Entregamos un formato claro y estandarizado
    res.json({
      success: true,
      data: {
        id: data.id,
        name: data.nombre,
        title: data.titulo,
        description: data.descripcion,
        url_foto: data.avatar_url,
        cv_url: data.cv_url
      }
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los datos del perfil'
    });
  }
};
