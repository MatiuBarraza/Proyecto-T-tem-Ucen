import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import App from './pages/app/App'; // El componente principal de la app
import Login from './pages/login/Login'; // El componente de Login
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa Bootstrap

const Main = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para controlar si el usuario está autenticado

  // Función que se llama cuando el login es exitoso
  const handleLoginSuccess = () => {
    setIsAuthenticated(true); // Cambiamos el estado para mostrar la app
  };

  return (
    <React.StrictMode>
      {isAuthenticated ? (
        <App />  // Si está autenticado, mostramos el componente principal App
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />  // Si no, mostramos el componente Login
      )}
    </React.StrictMode>
  );
};

ReactDOM.render(<Main />, document.getElementById('root'));
