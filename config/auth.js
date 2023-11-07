//Archivo de configuracion de roles para el administrador, backend, frontend y testing

const bcrypt = require('bcrypt');
const db = require('./config/db'); // Importa la conexión a la base de datos

// Función para verificar las credenciales del usuario
function verificarCredenciales(email, password, callback) {
    const query = 'SELECT * FROM administradores WHERE correo = ?';

    db.query(query, [email], (error, results) => {
        if (error) {
            callback(error, null);
            return;
        }

        if (results.length === 0) {
            // El usuario no fue encontrado
            callback(null, null);
        } else {
            const usuario = results[0];
            // Compara la contraseña ingresada con la contraseña almacenada hasheada
            bcrypt.compare(password, usuario.contrasena, (err, res) => {
                if (res) {
                    // Contraseña válida, envía el objeto usuario
                    callback(null, usuario);
                } else {
                    // Contraseña incorrecta
                    callback(null, null);
                }
            });
        }
    });
}

module.exports = {
    verificarCredenciales
};
