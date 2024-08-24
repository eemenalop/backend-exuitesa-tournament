function checkData(data, error) {
    if (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error de conexion con la base de datos o consulta incorrecta" }),
        }
    }

    if (!data || data.length === 0) {
        console.log(data)

        return {
            statusCode: 404,
            body: JSON.stringify({ error: "No se encontraron datos en la DB" })
        }
    }
    return {
        statusCode: 200,
        body: JSON.stringify(data)
    }
}

module.exports = { checkData };