const supabase = require('../../config.js');

exports.handler = async (event) => {
    try {
        // Obtenemos los parámetros desde la query string ...
        const matchType = event.queryStringParameters.match_type;
        const teamId = event.queryStringParameters.team_id;
        const playerId = event.queryStringParameters.player_id;

        if (!matchType) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                },
                body: JSON.stringify({ error: 'match_type is required' }),
            };
        }

        const { data: statsData, error } = await supabase.rpc('player_stat_per_game', {
            match_type_input: matchType,
            team_id_input: teamId,
            player_id_input: playerId
        })

        if (error) throw error;

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            body: JSON.stringify(statsData),
        };

    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            body: JSON.stringify({ error: error.message }),
        };
    }
};
