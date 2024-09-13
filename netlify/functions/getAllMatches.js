const supabase = require("../../config");
const { checkData } = require("./checkData");


exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            body: ''
        };
    }

    const matcheType = event.queryStringParameters.match_type;
    try {
        let data;
        let error;

        if (matcheType) {
        ({ data, error } = await supabase
            .from('matches')
            .select('*')
            .eq('match_type', matcheType));
        } else {
        ({ data, error } = await supabase
            .from('matches')
            .select('*'));
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