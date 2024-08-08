// netlify/functions/getTeams.js
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event) => {
    try {
      // Realiza una solicitud asíncrona para obtener los datos de la tabla 'teams'
      const { data, error } = await supabase
        .from('teams')
        .select('*');
  
      // Si hay un error en la consulta, lanza una excepción
      if (error) throw error;
  
      // Devuelve una respuesta exitosa con los datos obtenidos en formato JSON
      return {
        statusCode: 200,
        body: JSON.stringify(data),
      };
    } catch (error) {
      // Si ocurre un error, devuelve una respuesta con el código de error 500
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
  };
