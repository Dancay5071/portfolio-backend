import { supabase } from '../config/supabase.js';

// GET /api/education - Obtener la educación
export const getEducation = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('educacion')
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
    console.error('Error al obtener educación:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor al obtener la educación'
    });
  }
};
