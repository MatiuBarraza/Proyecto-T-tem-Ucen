const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 8080; // Cambia el puerto si es necesario

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configura la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'universidad',
});

db.connect((err) => {
  if (err) {
    console.error('Error de conexión: ' + err.stack);
    return;
  }
  console.log('Conectado a la base de datos.');
});

// Endpoint para verificar el login (verificar RUT)
app.post('/login', (req, res) => {
    const { rut } = req.body; // Obtener el RUT desde la solicitud
  
    // Validar si el RUT fue proporcionado
    if (!rut) {
      return res.status(400).json({ success: false, message: 'RUT es requerido' });
    }
  
    // Formatear el RUT (eliminar espacios y convertir a minúsculas)
    const formattedRUT = rut.trim().toLowerCase();
  
    // Primero, buscar en la tabla de administradores
    const queryAdmin = 'SELECT * FROM administradores WHERE rut = ?';
  
    db.query(queryAdmin, [formattedRUT], (err, resultAdmin) => {
      if (err) {
        console.error('Error en la consulta: ' + err.stack);
        return res.status(500).json({ success: false, message: 'Error en la consulta a la base de datos' });
      }
  
      // Si el RUT se encuentra en administradores
      if (resultAdmin.length > 0) {
        return res.json({
          success: true,
          type: 'admin', // Indicamos que es un administrador
        });
      }
  
      // Si no se encuentra en administradores, buscar en alumnos
      const queryAlumnos = 'SELECT * FROM alumnos WHERE rut = ? AND vigente = TRUE';
  
      db.query(queryAlumnos, [formattedRUT], (err, resultAlumnos) => {
        if (err) {
          console.error('Error en la consulta: ' + err.stack);
          return res.status(500).json({ success: false, message: 'Error en la consulta a la base de datos' });
        }
  
        // Verificar si se encontró un registro válido en alumnos
        if (resultAlumnos.length > 0) {
          return res.json({
            success: true,
            type: 'alumno', // Indicamos que es un alumno
          });
        } else {
          // Si no se encuentra en ninguna de las dos tablas
          return res.status(400).json({ success: false, message: 'RUT no válido o no vigente' });
        }
      });
    });
  });

// Endpoint para validar la contraseña de un administrador
app.post('/validate-password', (req, res) => {
  const { rut, password } = req.body; // Obtener el RUT y la contraseña desde la solicitud

  // Validar si el RUT y la contraseña fueron proporcionados
  if (!rut || !password) {
    return res.status(400).json({ success: false, message: 'RUT y contraseña son requeridos' });
  }

  // Formatear el RUT (eliminar espacios y convertir a minúsculas)
  const formattedRUT = rut.trim().toLowerCase();

  // Buscar al administrador en la base de datos
  const query = 'SELECT * FROM administradores WHERE rut = ?';

  db.query(query, [formattedRUT], (err, result) => {
    if (err) {
      console.error('Error en la consulta: ' + err.stack);
      return res.status(500).json({ success: false, message: 'Error en la consulta a la base de datos' });
    }

    if (result.length > 0) {
      const admin = result[0];

      // Aquí deberías verificar la contraseña (usando hash en un entorno real)
      if (admin.password === password) {
        return res.json({ success: true });
      } else {
        return res.status(400).json({ success: false, message: 'Contraseña incorrecta' });
      }
    } else {
      return res.status(400).json({ success: false, message: 'Administrador no encontrado' });
    }
  });
});  
  

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
