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
// POST /api/projects - Crear un proyecto (Protegido por Admin)
export const createProject = async (req, res) => {
  try {
    const { title, category, description, tech_stack, demo_url, github_url, image_url } = req.body;
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'El título y la descripción son obligatorios.'
      });
    }
    const { data, error } = await supabase
      .from('proyectos')
      .insert([
        {
          title,
          category: category || 'other',
          description,
          tech_stack: Array.isArray(tech_stack) ? tech_stack.join(', ') : tech_stack,
          demo_url: demo_url || '',
          github_url: github_url || '',
          image_url: image_url || ''
        }
      ])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json({
      success: true,
      message: 'Proyecto creado exitosamente 🚀',
      data: data
    });
  } catch (error) {
    console.error('Error al crear proyecto:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error al crear el proyecto.'
    });
  }
};
// PUT /api/projects/:id - Actualizar un proyecto (Protegido por Admin)
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (updates.tech_stack && Array.isArray(updates.tech_stack)) {
      updates.tech_stack = updates.tech_stack.join(', ');
    }
    const { data, error } = await supabase
      .from('proyectos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    res.json({
      success: true,
      message: 'Proyecto actualizado correctamente.',
      data: data
    });
  } catch (error) {
    console.error('Error al actualizar proyecto:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el proyecto.'
    });
  }
};
// DELETE /api/projects/:id - Eliminar un proyecto (Protegido por Admin)
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('proyectos')
      .delete()
      .eq('id', id);
    if (error) throw error;
    res.json({
      success: true,
      message: 'Proyecto eliminado con éxito.'
    });
  } catch (error) {
    console.error('Error al eliminar proyecto:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el proyecto.'
    });
  }
};