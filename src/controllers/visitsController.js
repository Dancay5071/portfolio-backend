import { supabase } from '../config/supabase.js';

// POST /api/visits - Registrar una nueva visita
export const recordVisit = async (req, res) => {
  try {
    const userAgent = req.headers['user-agent'] || 'Desconocido';
    const ip = req.ip || req.headers['x-forwarded-for'] || '';
    const { error } = await supabase
      .from('visitas')
      .insert([
        {
          ip: ip,
          user_agent: userAgent
        }
      ]);
    if (error) throw error;
    res.status(201).json({
      success: true,
      message: 'Visita registrada con éxito'
    });
  } catch (error) {
    console.error('Error al registrar visita:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error al registrar la visita'
    });
  }
};
// GET /api/visits/stats - Obtener el total de visitas
export const getVisitStats = async (req, res) => {
  try {
    const { count, error } = await supabase
      .from('visitas')
      .select('*', { count: 'exact', head: true });
    if (error) throw error;
    res.json({
      success: true,
      totalVisits: count || 0
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de visitas:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error al obtener métricas de visitas'
    });
  }
};
