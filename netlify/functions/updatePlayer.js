const supabase = require('../../config')

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET, PUT'
            },
            body: JSON.stringify({})
        };
    }
    if (event.httpMethod !== 'PUT') {
        return {
            statusCode: 405,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS, PUT',
            },
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }

    const player_id = parseInt(event.path.split('/').pop(), 10);
    const { player_name, team_id, position, number, player_photo } = JSON.parse(event.body);


    if (!player_name || !team_id || !position || !number) {
        return {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS, PUT',
            },
            body: JSON.stringify({ message: 'Missing required fields' }),
        };
    }

    try {

        const { data, error } = await supabase
            .from('players')
            .update({ player_name, team_id, position, number, player_photo })
            .eq('player_id', player_id);

        if (error) {
            throw error;
        }

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS, PUT',
            },
            body: JSON.stringify({ message: 'Player updated successfully', data }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS, PUT',
            },
            body: JSON.stringify({ message: 'Error updating player', error: error.message }),
        };
    }
};
