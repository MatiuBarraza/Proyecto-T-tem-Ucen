import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLoginSuccess }) => {
    const [rut, setRut] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    // Función para formatear el RUT (permitiendo hasta 8 dígitos y 1 dígito verificador)
    const formatRut = (input) => {
        // Eliminamos cualquier carácter que no sea un número o la "K"
        let rut = input.replace(/[^0-9kK]/g, '');

        // Limitar la longitud a 9 caracteres (8 dígitos y 1 dígito verificador)
        if (rut.length > 9) {
            rut = rut.slice(0, 9); // Limitar a 9 caracteres
        }

        // Si tiene menos de 2 caracteres, lo dejamos tal cual
        if (rut.length <= 1) return rut;

        // Dividir el RUT en el cuerpo (hasta 8 dígitos) y el dígito verificador
        const rutBody = rut.slice(0, -1); // Los primeros 8 dígitos
        const rutDv = rut.slice(-1).toUpperCase(); // El dígito verificador, el último carácter

        // Formatear el cuerpo del RUT con puntos
        const formattedRut = rutBody.replace(/\B(?=(\d{3})+(?!\d))/g, '');

        // Retornamos el RUT formateado, con el dígito verificador al final
        return `${formattedRut}-${rutDv}`;
    };

    // Validar formato básico del RUT (sin puntos, con guion)
    const validateRutFormat = (rut) => {
        const rutPattern = /^\d{1,12}-[0-9kK]$/;
        return rutPattern.test(rut);
    };

    // Manejo del login
    const handleLogin = async (e) => {
        e.preventDefault();

        // Formatear el RUT antes de validarlo
        const formattedRut = formatRut(rut);

        // Verificar que el RUT tenga el formato correcto
        if (!validateRutFormat(formattedRut)) {
            setError('RUT no es válido');
            return;
        }

        try {
            // Enviar el RUT al servidor para verificar si es administrador o alumno
            const response = await axios.post('http://localhost:8080/login', { rut: formattedRut });

            if (response.data.success) {
                setIsAdmin(response.data.type === 'admin');

                // Si es un administrador, solicitar la contraseña
                if (response.data.type === 'admin' && password) {
                    const passwordResponse = await axios.post('http://localhost:8080/validate-password', { rut: formattedRut, password });
                    if (passwordResponse.data.success) {
                        onLoginSuccess(); // Aquí llamamos al callback para manejar el login exitoso
                    } else {
                        setError(passwordResponse.data.message);
                    }
                } else if (response.data.type === 'alumno') {
                    onLoginSuccess(); // Si es un alumno, también se valida
                }
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            console.error('Error en la solicitud de login:', error);
            setError('Hubo un error al intentar iniciar sesión.');
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
                                onChange={(e) => setRut(formatRut(e.target.value))} // Aplica el formateo mientras escribe
                                maxLength="12" // Limitar la longitud a 12 caracteres (max 8 dígitos + guion + dígito verificador)
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
                        {error && <p className="text-danger mt-3">{error}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
