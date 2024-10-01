import React, { useState } from 'react';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import './App.css';

const App = () => {
    const [messages, setMessages] = useState([]);
    const suggestions = [
        "¿Cómo hago mi cambio de claves?",
        "¿Qué debo hacer para congelar?",
        "En caso de tener licencia, ¿qué debo hacer?",
        "¿Cómo puedo imprimir dentro de la universidad?",
    ];

    const sendMessage = (msg) => {
        setMessages([...messages, msg]);
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
