const supabase = require('../../config.js')

exports.handler = async () => {

    try {
        const { data: poinstData, error: pointsError } = await supabase.rpc('calculate_points_per_game')
            .limit(10);
        if (pointsError) throw pointsError;

        const { data: assistsData, error: assistsError } = await supabase.rpc('calculate_assists_per_game')
            .limit(10);
        if (assistsError) throw assistsError;

        const { data: reboundsData, error: reboundsError } = await supabase.rpc('calculate_rebounds_per_game')
            .limit(10);
        if (reboundsError) throw reboundsError;

        const { data: stealsData, error: stealsError } = await supabase.rpc('calculate_steals_per_game')
            .limit(10);
        if (stealsError) throw stealsError;

        const { data: blocksData, error: blocksError } = await supabase.rpc('calculate_blocks_per_game')
            .limit(10);
        if (blocksError) throw blocksError;

        const addRanking = (data) => data.map((item, index) => ({
            rank: index + 1,
            ...item
        }));

        const response = {
            points: { data: addRanking(poinstData) },
            assists: { data: addRanking(assistsData) },
            rebounds: { data: addRanking(reboundsData) },
            steals: { data: addRanking(stealsData) },
            blocks: { data: addRanking(blocksData) }
        }

        return {
            statusCode: 200,
            body: JSON.stringify(response.steals)
        }

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        }
    }



}