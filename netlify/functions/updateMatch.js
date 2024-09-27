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

    const match_id = parseInt(event.path.split('/').pop(), 10);
    const { team1_id, team2_id, score_team1, score_team2, match_date_time, winner, mode, match_type, location, match_mvp, state } = JSON.parse(event.body);

    
    if (!team1_id || !team2_id || !match_date_time || !mode || !match_type || !state) {
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
            .from('matches')
            .update({ team1_id, team2_id, score_team1, score_team2, match_date_time, mode, match_type, location, match_mvp, state })
            .eq('match_id', match_id);

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
            body: JSON.stringify({ message: 'Match updated successfully', data }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS, PUT',
            },
            body: JSON.stringify({ message: 'Error updating Match', error: error.message }),
        };
    }
};
