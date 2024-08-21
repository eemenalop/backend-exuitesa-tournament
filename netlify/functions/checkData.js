function checkData(data, error) {
    if (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        }
    }

    if (!data || data.length === 0) {
        return {
            statusCode: 404,
            body: JSON.stringify({ error: "No se encontraron datos desde la DB" })
        }
    }
    return {
        statusCode: 200,
        body: JSON.stringify(data)
    }
}

module.exports = { checkData };