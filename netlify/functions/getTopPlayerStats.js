const supabase = require('../../config.js')

exports.handler = async () => {

    try {
        const { data, error } = await supabase
            .from('players_matches_stats')
            .select('*')

        if (error) {
            throw error
        }

        return {
            statusCode: 200,
            body: JSON.stringify(data)
        }

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        }
    }



}