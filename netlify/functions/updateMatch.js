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
    const { team1_id, team2_id, score_team1, score_team2, match_date_time, mode, match_type, location, match_mvp, state,
        team1_q1, team2_q1, team1_q2, team2_q2, team1_q3, team2_q3, team1_q4, team2_q4/*, team1_ot1, team2_ot1 */ } = JSON.parse(event.body);


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
            .update({
                team1_id, team2_id, score_team1, score_team2, match_date_time, mode, match_type, location, match_mvp, state,
                team1_q1, team2_q1, team1_q2, team2_q2, team1_q3, team2_q3, team1_q4, team2_q4/*, team1_ot1, team2_ot1*/
            })
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
