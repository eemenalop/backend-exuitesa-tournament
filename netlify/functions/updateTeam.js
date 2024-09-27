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

    const team_id = parseInt(event.path.split('/').pop(), 10);
    const { team_name, captain, logo_url } = JSON.parse(event.body);

    
    if (!team_name || !logo_url) {
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
            .from('teams')
            .update({ team_name, captain, logo_url })
            .eq('team_id', team_id);

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
            body: JSON.stringify({ message: 'Team updated successfully', data }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS, PUT',
            },
            body: JSON.stringify({ message: 'Error updating team', error: error.message }),
        };
    }
};
