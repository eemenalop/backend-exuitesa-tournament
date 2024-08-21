const supabase = require('../../config.js');
const { checkData } = require('./checkData.js');

exports.handler = async (event) => {

    try {
        const { data, error } = await supabase
            .from('players')
            .select('*')

        if (error) throw error;

        return checkData(data, error);
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        }
    }
}