const supabase = require('../../config.js');
const { checkData } = require('./checkData.js');

exports.handler = async (event) => {

  const team_id = event.queryStringParameters.team_id;
  try {
    let data;
    let error;
    if (team_id) {
      ({ data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('team_id', team_id));
    } else {
      ({ data, error } = await supabase
        .from('teams')
        .select('*'));
    }

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
