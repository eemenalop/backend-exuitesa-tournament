const supabase = require("../../config");
const { checkData } = require("./checkData");

exports.handler = async (event) => {
    const match_id = event.queryStringParameters.match_id;
    const matchType = event.queryStringParameters.match_type;

    try {
        let data;
        let error;
        const query = supabase
            .from('players_matches_stats')
            .select(`*, 
                player: player_id (team_id, player_name),
                match_details: match_id (
                    match_date_time,
                    team1: team1_id(team_id, team_name),
                    team2: team2_id(team_id, team_name),
                    match_type
                )
            `);

        // Aplicar filtros
        if (match_id) {
            query.eq('match_id', match_id);
        }

        if (matchType) {
            // Aquí usamos el filtro para la relación
            query.eq('match_details.match_type', matchType);
        }

        // Ejecutar la consulta
        ({ data, error } = await query);

        if (error) throw error;

        // Filtrar resultados que no tengan match_type
        const filteredData = data.filter(item => {
            return !matchType || (item.match_details && item.match_details.match_type === matchType);
        });

        return checkData(filteredData, error);

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
