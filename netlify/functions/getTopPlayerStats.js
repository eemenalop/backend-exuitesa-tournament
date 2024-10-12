const supabase = require('../../config.js');

exports.handler = async (event) => {
    try {
        // Obtenemos los parámetros desde la query string
        const matchType = event.queryStringParameters.match_type;
        const statType = event.queryStringParameters.stat_type;

        if (!matchType || !statType) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                },
                body: JSON.stringify({ error: 'match_type and stat_type are required' }),
            };
        }

        // Llamamos a la función RPC con los parámetros necesarios
        const { data: statsData, error } = await supabase.rpc('calculate_stats_per_game', {
            match_type_input: matchType,
            stat_type_input: statType
        });

        if (error) throw error;

        const roundStat = (stat) => {
            return {
                ...stat,
                stat_per_game: Math.round(stat.stat_per_game * 10) / 10 // Redondeo a 2 decimales
            };
        };

        // Agregamos el ranking en el frontend
        const addRanking = (data) => data.map((item, index) => ({
            rank: index + 1,
            ...roundStat(item)
        }));

        // Devolvemos la respuesta con los datos y rankings
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            body: JSON.stringify(addRanking(statsData)),
        };

    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            body: JSON.stringify({ error: error.message }),
        };
    }
};
