const supabase = require("../../config");
const { checkData } = require("./checkData");


exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            body: ''
        };
    }

    const matchType = event.queryStringParameters.match_type;
    try {
        let data;
        let error;

        if (matchType) {
        ({ data, error } = await supabase
            .from('matches')
            .select(`
                    *,
                    team1:team1_id (team_name),
                    team2:team2_id (team_name)
                `)
            .eq('match_type', matchType));
        } else {
        ({ data, error } = await supabase
            .from('matches')
            .select(`
                    *,
                    team1:team1_id (team_name),
                    team2:team2_id (team_name)
                `));
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
            body: JSON.stringify({ error: error.message })
        }
    }

}