const supabase = require("../../config");
const { checkData } = require("./checkData");


exports.handler = async (event) => {
    const match_id = event.queryStringParameters.match_id;
    try {
        let data;
        let error;
        if (match_id) {
            ({ data, error } = await supabase
                .from('players_matches_stats')
                .select(`*, 
                    player: player_id (team_id, player_name),
                    match_details: match_id (
                        match_date_time,
                        team1: team1_id(team_name),
                        team2: team2_id(team_name),
                        match_type
                    )
                    `)
                .eq('match_id', match_id))
        } else {
            ({ data, error } = await supabase
                .from('players_matches_stats')
                .select(`*, 
                    player: player_id (team_id, player_name),
                    match_details: match_id (
                        match_date_time,
                        team1: team1_id(team_name),
                        team2: team2_id(team_name),
                        match_type
                    )
                    `));
        }

        if (error) throw error;

        return checkData(data, error);

    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            body: JSON.stringify({ error: error.message })
        }
    }

}