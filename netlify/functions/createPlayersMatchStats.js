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
        }
    }

    try {
        const { match_id,
            player_id,
            points,
            assists,
            rebounds,
            steals,
            blocks,
            turnovers,
            fga,
            fgm,
            threepta,
            threeptm,
            fta,
            ftm } = JSON.parse(event.body);

        if (!match_id) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'match_id is required' })
            };
        }

        const { data, error } = await supabase
            .from('players_matches_stats')
            .insert([{
                match_id,
                player_id,
                points,
                assists,
                rebounds,
                steals,
                blocks,
                turnovers,
                fga,
                fgm,
                threepta,
                threeptm,
                fta,
                ftm
            }])
            .select('match_stats_id')

        const matchStatId = data[0].match_stats_id

        if (error) {
            throw new Error(error.message)
        }

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            body: JSON.stringify({ message: 'Stats created successfully', matchStatId })
        }


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
