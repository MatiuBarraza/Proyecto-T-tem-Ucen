// src/Login.js
import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [rut, setRut] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    // Función para validar el formato del RUT
    const validateRutFormat = (rut) => {
        const rutPattern = /^\d{1,8}-[0-9kK]$/; // Validación de formato
        return rutPattern.test(rut);
    };

    // Función para manejar el inicio de sesión
const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!rut) {
        setError('RUT es requerido');
        return;
    }

    // Validar el formato del RUT
    if (!validateRutFormat(rut)) {
        setError('Formato de RUT incorrecto'); // Mensaje de error de formato
        return;
    }

    try {
        const response = await axios.post('http://localhost/login/login.php', {
            rut,
            password: isAdmin ? password : null,
        });

        if (response.data.success) {
            // Aquí puedes agregar un mensaje de éxito si el RUT es válido
            alert('Usuario válido. Login exitoso'); // Mensaje de usuario válido
            // Redirigir o realizar otra acción
        } else {
            setError('RUT no válido o no vigente'); // Mensaje de error de RUT no válido
        }
    } catch (err) {
        console.error(err);
        setError('Error en la conexión con el servidor');
    }
};


    return (
        <div className="container d-flex align-items-center justify-content-center vh-100">
            <div className="card" style={{ width: '400px' }}>
                <div className="card-header text-center">
                    <h2>Login</h2>
                </div>
                <div className="card-body">
                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="RUT (sin puntos, con guion)"
                                value={rut}
                                onChange={(e) => setRut(e.target.value)}
                            />
                        </div>
                        {isAdmin && (
                            <div className="mb-3">
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        )}
                        <button type="submit" className="btn btn-primary w-100">Iniciar sesión</button>
                        <div className="form-check mt-3">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={isAdmin}
                                onChange={() => setIsAdmin(!isAdmin)}
                            />
                            <label className="form-check-label">¿Eres administrador?</label>
                        </div>
                        {error && <p className="text-danger mt-3">{error}</p>} {/* Mensaje de error */}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
