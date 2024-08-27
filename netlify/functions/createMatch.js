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
        /**
        const { data: playersData, error: playersError } = await supabase
            .from('players')
            .select('player_id')
            .in('team_id', [team1_id, team2_id]);

        if (playersError) {
            throw new Error(playersError.message);
        }

        const playerStats = playersData.map((player) => ({
            match_id: matchId,
            player_id: player.player_id,
            points: 0,
            assists: 0,
            rebounds: 0,
            steals: 0,
            blocks: 0,
            turnovers: 0,
            fga: 0,
            fgm: 0,
            threeptm: 0,
            threepta: 0,
            ftm: 0,
            fta: 0,
        }));

        const { data: statsData, error: statsError } = await supabase
            .from('players_matches_stats')
            .insert(playerStats);

        if (statsError) {
            throw new Error(statsError.message);
        }*/

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Match and player stats created successfully', matchId }),
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        }

    }
}

