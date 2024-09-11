const supabase = require("../../config");
const { checkData } = require("./checkData");


exports.handler = async () => {

    try {
        const { data, error } = await supabase
            .from('matches')
            .select('*');

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