const supabase = require('../../config.js');

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            body: JSON.stringify({})
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            body: JSON.stringify({ error: 'Method not Allowed' })
        };
    }

    try {
        const { match_id, stats } = JSON.parse(event.body);

        // Validar que el match_id esté presente
        if (!match_id) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                },
                body: JSON.stringify({ error: 'match_id is required' })
            };
        }

        // Recorrer el objeto de stats y preparar los datos para la inserción
        const statsArray = Object.keys(stats).map(player_id => ({
            match_id,
            player_id: parseInt(player_id, 10), // Convertir el player_id a número
            points: stats[player_id].points || 0,
            assists: stats[player_id].assists || 0,
            rebounds: stats[player_id].rebounds || 0,
            steals: stats[player_id].steals || 0,
            blocks: stats[player_id].blocks || 0,
            turnovers: stats[player_id].turnovers || 0,
            fga: stats[player_id].fga || 0,
            fgm: stats[player_id].fgm || 0,
            threepta: stats[player_id].threepta || 0,
            threeptm: stats[player_id].threeptm || 0,
            fta: stats[player_id].fta || 0,
            ftm: stats[player_id].ftm || 0
        }));

        // Insertar todas las estadísticas de una vez
        const { data, error } = await supabase
            .from('players_matches_stats')
            .insert(statsArray)
            .select('match_stats_id');

        if (error) {
            throw new Error(error.message);
        }

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            body: JSON.stringify({ message: 'Stats created successfully', data })
        };

    } catch (error) {
        console.error('Error general:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            body: JSON.stringify({ error: error.message || 'Internal Server Error' })
        };
    }
};
