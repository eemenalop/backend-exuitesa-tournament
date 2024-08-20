const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');

const supabase = require('../../config.js')

const saltRounds = 10;

exports.handler = async (event) => {

    const { username, plainPassword } = JSON.parse(event.body);

    try {
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

        const { data, error } = await supabase
            .from('users')
            .insert([{ username, password: hashedPassword }])

        if (error) throw error;

        return {
            statusCode: 201,
            body: JSON.stringify({ message: "Usuario creado exitosamente" }),
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        }
    }

}




