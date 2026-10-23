import {supabase} from '../config/supabase.js';
export const getPerfil = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('perfil')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      count: data.length,
      data: data
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor al obtener el perfil'
    });
  }
};