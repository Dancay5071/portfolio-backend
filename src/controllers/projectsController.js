import { supabase } from '../config/supabase.js';

// GET /api/projects - Obtener todos los proyectos
export const getProjects = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('proyectos')
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
    console.error('Error al obtener proyectos:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor al obtener los proyectos'
    });
  }
};
