const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('../../config.js');
const checkData = require('./checkData.js')

const jwtSecret = process.env.JWT_SECRET;


exports.handler = async (event) => {
    try {

        const { username, password } = JSON.parse(event.body);

        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single();

        const checkResult = checkData(user, userError);

        if (checkResult.statusCode !== 200) {
            return checkResult; // Si checkData detectó un problema, se retorna su respuesta
        }

        //Check User
        if (userError || !user) {
            return {
                statusCode: 401,
                body: JSON.stringify({ error: 'Usuario no encontrado' }),
            }
        }
        //Check Password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return {
                statusCode: 401,
                body: JSON.stringify({ error: 'Contraseña Incorrecta' })
            }
        }

        //Create Token
        const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret, {
            expiresIn: '1h'
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ token })
        }

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        }
    }
}