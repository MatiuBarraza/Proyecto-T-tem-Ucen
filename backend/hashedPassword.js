const bcrypt = require('bcryptjs');
const mysql = require('mysql2');

// Configuración de la base de datos
const db = mysql.createConnection({
  host: 'localhost',        // Cambia esto si tu base de datos está en otro host
  user: 'root',             // Usuario de la base de datos (reemplázalo con tu usuario)
  password: '',             // Contraseña de la base de datos
  database: 'universidad',     // Nombre de la base de datos
});

// Función para crear un nuevo usuario
async function registerUser(username, password) {
    try {
        // Generar el hash de la contraseña
        const salt = await bcrypt.genSalt(10); // Salt con un coste de 10
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insertar el nuevo usuario en la base de datos
        const query = 'INSERT INTO administradores (rut, password) VALUES (?, ?)';
        db.execute(query, [username, hashedPassword], (err, results) => {
        if (err) {
            console.error('Error al insertar el usuario:', err.message);
            return;
        }
        console.log(`Usuario '${username}' registrado correctamente.`);
        
        // Cerrar la conexión después de que la consulta se haya completado
        db.end();  // Cierra la conexión aquí, después de que se haya insertado el usuario
        });

    } catch (error) {
        console.error('Error al registrar el usuario:', error.message);
    }
}

// Uso de la función para registrar un nuevo usuario
const username = '12345678-9';  // Nombre de usuario que deseas registrar
const password = 'admin123';  // Contraseña a hashear

registerUser(username, password);


// Endpoint de Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
  }

  // Buscar al usuario en la base de datos
  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al buscar el usuario' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const user = results[0]; // Suponemos que el usuario es único

    // Comparar la contraseña ingresada con el hash almacenado
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Si todo es correcto, enviar respuesta de éxito
    res.status(200).json({ message: 'Login exitoso', userId: user.id });
  });
});
