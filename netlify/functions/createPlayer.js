const supabase = require('../../config')

exports.handler = async (event) => {
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
        const { team_id, player_name, position, number } = JSON.parse(event.body)

        const { data: playerData, error: playerError } = await supabase
            .from('players')
            .insert([{
                team_id,
                player_name,
                position,
                number
            }])
            .select('player_id');

        const playerId = playerData[0].player_id;

        if (playerError) {
            throw new Error(playerError.message)
        }

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            body: JSON.stringify({ message: 'Player created successfully', playerId })
        }

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