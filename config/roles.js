const express = require('express');
const auth = require('./config/auth'); // Importa las funciones de autenticación
const app = express();

// Ruta para procesar el formulario de inicio_sesión
app.post('/asignar-rol', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    auth.verificarCredenciales(email, password, (error, usuario) => {
        if (error) {
            res.status(500).send('Error en la autenticación');
        } else if (!usuario) {
            res.status(401).send('Credenciales incorrectas');
        } else {
            const rol = usuario.rol; // Obtiene el rol del usuario desde la base de datos

            if (rol === 'DBA') {
                // Redirige al área de administrador de bases de datos (DBA)
                res.redirect('/DBA');
            } else if (rol === 'Backend') {
                // Redirige al área de backend
                res.redirect('/backend');
            } else if (rol === 'Frontend') {
                // Redirige al área de frontend
                res.redirect('/frontend');
            } else if (rol === 'Testing') {
                // Redirige al área de testing
                res.redirect('/testing');
            } else {
                // Rol no válido
                res.status(403).send('Rol no válido');
            }
        }
    });
});

// Rutas para diferentes roles
app.get('/dba', (req, res) => {
    res.send('Bienvenido a la página de DBA');
});

app.get('/backend', (req, res) => {
    res.send('Bienvenido a la página de Backend');
});

app.get('/frontend', (req, res) => {
    res.send('Bienvenido a la página de Frontend');
});

app.get('/testing', (req, res) => {
    res.send('Bienvenido a la página de Testing');
});

module.exports = app;
