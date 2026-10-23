import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(' Faltan variables de entorno para Supabase en el archivo .env');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
