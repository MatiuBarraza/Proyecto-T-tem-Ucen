function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;

    // Mostrar mensaje del usuario
    addMessage(userInput, 'sent');
    document.getElementById('user-input').value = '';

    // Llamar al backend (Python)
    axios.post('http://localhost:5000/chat', { message: userInput })
        .then(response => {
            // Mostrar la respuesta del chatbot
            addMessage(response.data.reply, 'received');
        })
        .catch(error => {
            console.error('Error en la respuesta del chatbot:', error);
            addMessage('Lo siento, ha ocurrido un error.', 'received');
        });
}

function addMessage(message, type) {
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', type);
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);

    // Desplazar hacia abajo automáticamente
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
