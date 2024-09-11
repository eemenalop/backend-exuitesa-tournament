const supabase = require('../../config.js');
const { checkData } = require('./checkData.js');

exports.handler = async (event) => {
    const team_id = event.queryStringParameters.team_id;
    try {
        let data;
        let error;
        if (team_id) {
            ({ data, error } = await supabase
                .from('players')
                .select('*')
                .eq('team_id', team_id))
        } else {
            ({ data, error } = await supabase
                .from('players')
                .select('*'));
        }


        if (error) throw error;

        return checkData(data, error);

    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            body: JSON.stringify({ error: error.message }),
        }
    }
}