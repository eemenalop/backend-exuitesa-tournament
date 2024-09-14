const supabase = require('../../config.js')


exports.handler = async (event) => {

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            body: JSON.stringify({ error: 'Method not allowed' })
        }
    }

    try {
        const { team1_id, team2_id, score_team1, score_team2, 
            match_date_time, mode, location, match_mvp, match_type } = JSON.parse(event.body)

        //checking the winning team
        let winnerId, loserId;

        if (score_team1 > score_team2) {
            winnerId = team1_id;
            loserId = team2_id;
        } else if (score_team2 > score_team1) {
            winnerId = team2_id;
            loserId = team1_id
        } else {

            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                },
                body: JSON.stringify({ Error: 'El partido no puede terminar empate' })
            }
        }

        //checking that the inserted MVP is from the winning team
        const { data: mvpData, error: mvpError } = await supabase
            .from('players')
            .select('team_id')
            .eq('player_id', match_mvp);

        if (mvpError) {
            throw new Error(mvpError.message)
        }

        if (!mvpData || mvpData.length === 0) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                },
                body: JSON.stringify({ error: 'El jugador no existe' })
            };
        }

        const mvpTeamId = mvpData[0].team_id;

        if (mvpTeamId !== winnerId) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                },
                body: JSON.stringify({ error: 'El MVP debe ser del equipo ganador' })
            };
        }

        const { data: matchData, error: matchError } = await supabase
            .from('matches')
            .insert([
                {
                    team1_id,
                    team2_id,
                    score_team1,
                    score_team2,
                    match_date_time,
                    mode,
                    match_type,
                    location,
                    match_mvp,
                    winner: winnerId,
                    loser: loserId,
                    match_type
                }
            ])
            .select('match_id');

        if (matchError) {
            throw new Error(matchError.message);
        }

        const matchId = matchData[0].match_id;


        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            body: JSON.stringify({ message: 'Match created successfully', matchId }),
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
        }

    }
}

