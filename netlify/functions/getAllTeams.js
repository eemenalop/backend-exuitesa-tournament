const supabase = require('../../config.js');
const { checkData } = require('./checkData.js');

exports.handler = async (event) => {
  try {
    // Realiza una solicitud asíncrona para obtener los datos de la tabla 'teams'
    const { data, error } = await supabase
      .from('teams')
      .select('*');

    // Si hay un error en la consulta, lanza una excepción
    if (error) throw error;

    // Devuelve una respuesta exitosa con los datos obtenidos en formato JSON
    return checkData(data, error);

  } catch (error) {
    // Si ocurre un error, devuelve una respuesta con el código de error 500
    console.error('Error fetching teams:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
