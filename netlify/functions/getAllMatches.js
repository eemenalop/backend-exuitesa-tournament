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
    const match_id = event.queryStringParameters.match_id;
    try {
        let data;
        let error;

        if (matchType && match_id) {
            // Filtrar por ambos matchType y match_id
            ({ data, error } = await supabase
                .from('matches')
                .select(`
                    *,
                    team1:team1_id (team_name),
                    team2:team2_id (team_name)
                `)
                .eq('match_type', matchType)
                .eq('match_id', match_id)); // Filtrar por match_id también
        } else if (matchType) {
            // Filtrar solo por matchType
            ({ data, error } = await supabase
                .from('matches')
                .select(`
                    *,
                    team1:team1_id (team_name),
                    team2:team2_id (team_name)
                `)
                .eq('match_type', matchType));
        } else if (match_id) {
            // Filtrar solo por match_id
            ({ data, error } = await supabase
                .from('matches')
                .select(`
                    *,
                    team1:team1_id (team_name),
                    team2:team2_id (team_name)
                `)
                .eq('match_id', match_id));
        } else {
            // Si no hay parámetros, obtener todos los datos
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