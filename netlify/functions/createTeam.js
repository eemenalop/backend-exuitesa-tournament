const supabase = require('../../config')

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
        const { team_name, logo_url } = JSON.parse(event.body);

        if (!team_name) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Team name is required' })
            };
        }

        const { data: teamData, error: teamError } = await supabase
            .from('teams')
            .insert([{
                team_name,
                logo_url
            }])
            .select('team_id');

        const teamId = teamData[0].team_id;

        if (teamError) {
            throw new Error(teamError.message)
        }

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            body: JSON.stringify({ message: 'Team created successfully', teamId })
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