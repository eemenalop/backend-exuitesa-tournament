const supabase = require('../../config.js');
const { checkData } = require('./checkData.js');

exports.handler = async (event) => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*');

    if (error) throw error;

    return checkData(data, error);

  } catch (error) {
    console.error('Error fetching teams:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
