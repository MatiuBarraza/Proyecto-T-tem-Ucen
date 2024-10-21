import React, { useState } from 'react';
import './MessageInput.css';

const MessageInput = ({ sendMessage }) => {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(input);
        setInput('');
    };

    return (
        <form onSubmit={handleSubmit} className="message-input">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe un mensaje..."
            />
            <button type="submit">Enviar</button>
        </form>
    );
};

export default MessageInput;
