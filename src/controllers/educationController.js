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
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, message: 'Título creado con éxito', data });
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
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, message: 'Título actualizado correctamente', data });
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

