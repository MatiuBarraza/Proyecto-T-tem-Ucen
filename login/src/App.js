import logo from './logo.svg';
import './App.css';
// src/index.js o src/App.js
import 'bootstrap/dist/css/bootstrap.min.css';

// src/App.js
import React from 'react';
import Login from './Login';

function App() {
    return (
        <div className="App">
            <Login />
        </div>
    );
}

export default App;

