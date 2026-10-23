import { supabase } from '../config/supabase.js';

// GET /api/experience - Obtener la experiencia laboral
export const getExperience = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('experiencia')
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
    console.error('Error al obtener experiencia:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor al obtener la experiencia'
    });
  }
};
