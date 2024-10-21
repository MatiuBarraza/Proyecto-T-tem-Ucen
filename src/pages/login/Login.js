import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLoginSuccess }) => {
    const [rut, setRut] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    // Validar formato básico del RUT (sin puntos, con guion)
    const validateRutFormat = (rut) => {
        const rutPattern = /^\d{1,12}-[0-9kK]$/;
        return rutPattern.test(rut);
    };

    // Manejo del login
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!rut) {
            setError('RUT es requerido');
            return;
        }

        // Validar formato del RUT
        if (!validateRutFormat(rut)) {
            setError('Formato de RUT incorrecto');
            return;
        }

        try {
            // Preparar los datos a enviar en la solicitud
            const data = {
                rut: rut.trim(),
            };

            if (isAdmin) {
                if (!password) {
                    setError('Contraseña es requerida para administradores');
                    return;
                }
                data.password = password;  // Añadir contraseña para administradores
            }

            const response = await axios.post('http://localhost/proyecto_totem_ucen/login.php', data);

            if (response.data.success) {
                // Login exitoso, ejecutar callback
                onLoginSuccess();
            } else {
                // Mostrar mensaje de error devuelto por el servidor
                setError(response.data.message || 'RUT no válido o no vigente');
            }
        } catch (err) {
            console.error('Error en la conexión:', err);
            setError('Error en la conexión con el servidor. Intenta más tarde.');
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
                        {error && <p className="text-danger mt-3">{error}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
