require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('SUPABASE_URL y SUPABASE_KEY son requeridos.');
  }
const supabase = createClient(supabaseUrl, supabaseKey);

async function getAllTablesData() {
  try {
    const tables = ['team', 'players', 'matches', 'match_stats']; // Sustituir con los nombres de tus tablas
    const results = {};

    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('*');
      if (error) {
        console.error(`Error al obtener datos de ${table}:`, error);
        continue;
      }
      results[table] = data;
    }

    return results;
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    return {};
  }
}

module.exports = { getAllTablesData };
