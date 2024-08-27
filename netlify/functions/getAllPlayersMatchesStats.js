const supabase = require("../../config");
const { checkData } = require("./checkData");


exports.handler = async () => {

    try {
        const { data, error } = await supabase
            .from('players_matches_stats')
            .select('*');

        if (error) throw error;

        return checkData(data, error);

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        }
    }

}