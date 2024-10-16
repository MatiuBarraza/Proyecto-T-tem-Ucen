import React from 'react';
import './ChatWindow.css';

const ChatWindow = ({ messages, suggestions, selectSuggestion }) => {
    return (
        <div className="chat-window">
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="suggestions">
                {suggestions.map((suggestion, index) => (
                    <button key={index} onClick={() => selectSuggestion(suggestion)}>
                        {suggestion}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ChatWindow;
