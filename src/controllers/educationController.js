import { supabase } from '../config/supabase.js';

// GET /api/education
export const getEducation = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('educacion')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error al obtener educación:', error.message);
    res.status(500).json({ success: false, message: 'Error al obtener la educación' });
  }
};

// POST /api/education
export const createEducation = async (req, res) => {
  try {
    const { institucion, titulo, siglas, color_badge, fecha_inicio, fecha_fin, descripcion } = req.body;
    if (!institucion || !titulo) {
      return res.status(400).json({ success: false, message: 'Institución y título son obligatorios.' });
    }

    const { data, error } = await supabase
      .from('educacion')
      .insert([{
        institucion: institucion.trim(),
        titulo: titulo.trim(),
        siglas: siglas || titulo.substring(0, 2).toUpperCase(),
        color_badge: color_badge || 'Curso',
        fecha_inicio: fecha_inicio || '',
        fecha_fin: fecha_fin || null,
        descripcion: descripcion || ''
      }])
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'No se pudo crear la educación. Asegúrate de configurar SUPABASE_SERVICE_ROLE_KEY en Render.'
      });
    }
    res.status(201).json({ success: true, message: 'Título creado con éxito', data: data[0] });
  } catch (error) {
    console.error('Error al crear educación:', error.message);
    res.status(500).json({ success: false, message: 'Error al crear educación' });
  }
};

// PUT /api/education/:id
export const updateEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('educacion')
      .update(req.body)
      .eq('id', id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'No se pudo actualizar la educación. Asegúrate de configurar SUPABASE_SERVICE_ROLE_KEY en Render.'
      });
    }
    res.json({ success: true, message: 'Título actualizado correctamente', data: data[0] });
  } catch (error) {
    console.error('Error al actualizar educación:', error.message);
    res.status(500).json({ success: false, message: 'Error al actualizar educación' });
  }
};

// DELETE /api/education/:id
export const deleteEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('educacion').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true, message: 'Título eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar educación:', error.message);
    res.status(500).json({ success: false, message: 'Error al eliminar educación' });
  }
};

