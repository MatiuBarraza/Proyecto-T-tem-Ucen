import React, { useState } from 'react';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import './App.css';
import axios from 'axios';

const App = () => {
    const [messages, setMessages] = useState([]);
    const suggestions = [
        "¿Cómo hago mi cambio de claves?",
        "¿Qué debo hacer para congelar?",
        "En caso de tener licencia, ¿qué debo hacer?",
        "¿Cómo puedo imprimir dentro de la universidad?",
    ];

    const sendMessage = async (msg) => {
        // Añadir el mensaje del usuario al chat
        setMessages((prevMessages) => [...prevMessages, { text: msg, sender: "user" }]);

        try {
            const response = await axios.post('http://localhost:5000/preguntar', { pregunta: msg });
            const botResponse = response.data.respuesta;
            // Añadir la respuesta del bot al chat
            setMessages((prevMessages) => [...prevMessages, { text: botResponse, sender: "bot" }]);
        } catch (error) {
            console.error("Error enviando la pregunta:", error);
            setMessages((prevMessages) => [...prevMessages, { text: "Error al obtener respuesta.", sender: "bot" }]);
        }
    };

    const selectSuggestion = (suggestion) => {
        sendMessage(suggestion);
    };

    return (
        <div className="app">
            <Header />
            <ChatWindow messages={messages} suggestions={suggestions} selectSuggestion={selectSuggestion} />
            <MessageInput sendMessage={sendMessage} />
        </div>
    );
};

export default App;
