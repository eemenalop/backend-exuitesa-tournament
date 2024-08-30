const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('../../config.js');

const jwtSecret = process.env.JWT_SECRET;


exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST',
            },
            body: JSON.stringify({}),
        };
    }
    try {

        const { username, password } = JSON.parse(event.body);

        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single();

        //Check User
        if (userError || !user) {
            return {
                statusCode: 401,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ error: 'Credenciales invalidas' }),
            }
        }
        //Check Password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return {
                statusCode: 401,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ error: 'Credenciales invalidas' })
            }
        }

        //Create Token
        const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret, {
            expiresIn: '1h'
        });

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST',
            },
            body: JSON.stringify({ username, token })
        }

    } catch (error) {
        return {
            statusCode: 500,
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            body: JSON.stringify({ error: error.message })
        }
    }
}