// src/Login.js
import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [rut, setRut] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const validateRut = (rut) => {
        const rutPattern = /^\d{1,8}-[0-9kK]$/;
        return rutPattern.test(rut);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!rut) {
            setError('RUT es requerido');
            return;
        }

        if (!validateRut(rut)) {
            setError('Formato de RUT incorrecto');
            return;
        }

        try {
            const response = await axios.post('http://localhost/sistema-login/login.php', {
                rut,
                password: isAdmin ? password : null,
            });

            if (response.data.success) {
                alert('Login exitoso');
                // Redirigir o realizar otra acción
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            console.error(err);
            setError('Error en la conexión con el servidor');
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="RUT (sin puntos, con guion)"
                    value={rut}
                    onChange={(e) => setRut(e.target.value)}
                />
                {isAdmin && (
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                )}
                <button type="submit">Iniciar sesión</button>
                <div>
                    <input
                        type="checkbox"
                        checked={isAdmin}
                        onChange={() => setIsAdmin(!isAdmin)}
                    />
                    <label>¿Eres administrador?</label>
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
};

export default Login;
