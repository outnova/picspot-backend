const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

const connection = mysql.createConnection({
  host: 'localhost', 
  user: 'root',
  password: 'root',
  database: 'picspot_db'
});

app.use(express.json());

connection.connect((error) => {
  if (error) {
    console.error('No connection with the database.', error);
  } else {
    console.log('Database connection succefully.');
  }
});

/*
app.post('/registro', (req, res) => {
  const { nombre, email, password } = req.body;

  // Verificar si el usuario ya existe en la base de datos
  for (const user of users) {
    if (user.email === email) {
      return res.status(400).json({ mensaje: 'El usuario ya existe' });
    }
  }

  // Crear un nuevo usuario
  const nuevoUsuario = { nombre, email, password };
  users.push(nuevoUsuario);

  return res.status(200).json({ mensaje: 'Registro exitoso' });
});
*/

const mariadb = require('mariadb');

app.post('/login', async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  const query = `
    SELECT * FROM users
    WHERE (username = ? OR email = ?) AND password = SHA2(CONCAT(?, salt), 256)
  `;
  const params = [usernameOrEmail, usernameOrEmail, password];

  const rows = await connection.query(query, params);

  if (rows.length > 0) {
    return res.status(200).json({ mensaje: 'Login succefully' });
  } else {
    return res.status(401).json({ mensaje: 'Invalid credentials' });
  }
});

app.listen(port, () => {
  console.log('Server listen to %d port', port);
});