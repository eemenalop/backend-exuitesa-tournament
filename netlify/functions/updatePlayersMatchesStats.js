const supabase = require('../../config.js')

exports.handler = async (event) => {
    if (event.httpMethod !== 'PUT') {
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


    const { points, assists, rebounds, steals, blocks, turnovers/*,
        fga, fgm, threeptm, threepta, ftm, fta*/ } = JSON.parse(event.body);

    const { data: statsData, error: statsError } = await supabase
        .from('players_matches_stats')
        .insert([{
            points,
            assists,
            rebounds,
            steals,
            blocks,
            turnovers,
            fouls,
            /*fga,
            fgm,
            threeptm,
            threepta,
            ftm,
            fta*/
        }])

    if (statsError) {
        throw new Error(statsError.message)
    }

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        body: JSON.stringify({ message: 'Stats match updated successfully' })
    }

}