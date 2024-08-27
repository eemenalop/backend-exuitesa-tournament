const supabase = require('../../config.js')


exports.handler = async (event) => {

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        }
    }

    try {
        const { team1_id, team2_id, score_team1, score_team2, match_date_time, mode, location, match_mvp } = JSON.parse(event.body)

        //checking the winning team
        let winningTeamId;

        if (score_team1 > score_team2) {
            winningTeamId = team1_id;
        } else if (score_team2 > score_team1) {
            winningTeamId = team2_id;
        } else {

            return {
                statusCode: 400,
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
                body: JSON.stringify({ error: 'El jugador no existe' })
            };
        }

        const mvpTeamId = mvpData[0].team_id;

        if (mvpTeamId !== winningTeamId) {
            return {
                statusCode: 400,
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
                    location,
                    match_mvp
                }
            ])
            .select('match_id');

        if (matchError) {
            throw new Error(matchError.message);
        }

        const matchId = matchData[0].match_id;


        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Match created successfully', matchId }),
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        }

    }
}

