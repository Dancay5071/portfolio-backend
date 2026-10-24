import {supabase} from '../config/supabase.js';

export const getProfile = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('configuracion')
      .select('*')
      .eq('id', 'perfil_data')
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    
    // Valores por defecto
    let profileData = {
      name: 'Daniela Cabrera',
      title: 'Técnica en Programación & Desarrolladora de Software',
      url_foto: ''
    };
    if (data && data.theme) {
      const parsed = typeof data.theme === 'string' ? JSON.parse(data.theme) : data.theme;
      profileData = {
        name: parsed.name || profileData.name,
        title: parsed.title || profileData.title,
        url_foto: parsed.image || parsed.url_foto || ''
      };
    }
    res.json({
      success: true,
      data: profileData
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los datos del perfil'
    });
  }
};