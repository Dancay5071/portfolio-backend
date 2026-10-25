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

// POST /api/experience - Crear experiencia (Protegido por Admin)
export const createExperience = async (req, res) => {
  try {
    const { empresa, cargo, fecha_inicio, fecha_fin, tecnologias, descripcion } = req.body;
    if (!empresa || !cargo) {
      return res.status(400).json({
        success: false,
        message: 'La empresa y el cargo son obligatorios.'
      });
    }

    const { data, error } = await supabase
      .from('experiencia')
      .insert([
        {
          empresa: empresa.trim(),
          cargo: cargo.trim(),
          fecha_inicio: fecha_inicio || '',
          fecha_fin: fecha_fin || null,
          tecnologias: tecnologias || '',
          descripcion: descripcion || ''
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Experiencia creada con éxito',
      data
    });
  } catch (error) {
    console.error('Error al crear experiencia:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error al crear la experiencia'
    });
  }
};

// PUT /api/experience/:id - Actualizar experiencia (Protegido por Admin)
export const updateExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('experiencia')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Experiencia actualizada correctamente',
      data
    });
  } catch (error) {
    console.error('Error al actualizar experiencia:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al actualizar la experiencia'
    });
  }
};

// DELETE /api/experience/:id - Eliminar experiencia (Protegido por Admin)
export const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('experiencia')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Experiencia eliminada con éxito'
    });
  } catch (error) {
    console.error('Error al eliminar experiencia:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la experiencia'
    });
  }
};
