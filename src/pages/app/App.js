import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Webchat, WebchatProvider, getClient } from '@botpress/webchat';
import { buildTheme } from '@botpress/webchat-generator';
import './App.css';

const { theme, style } = buildTheme({
  themeName: 'prism',
  themeColor: '#0026fa',
});

const svgContent = ` 
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2"> 
    <path d="M4.698 4.034l16.302 7.966l-16.302 7.966a.503 .503 0 0 1 -.546 -.124a.555 .555 0 0 1 -.12 -.568l2.468 -7.274l-2.468 -7.274a.555 .555 0 0 1 .12 -.568a.503 .503 0 0 1 .546 -.124z"></path> 
    <path d="M6.5 12h14.5"></path> 
  </svg>
`;

const customStyles = `
@media (min-width: 768px) {
  .bpHeaderContainer {
    display: flex;
    background-color: #0026fa;
    color: white;
    padding: 10px;
  }
  .bpHeaderContentContainer {
    height: 10vh;
  }
  .bpHeaderContentTitle {
    font-size: 1.5rem;
    text-transform: uppercase;
    font-weight: bold;
    text-align: center;
    color: white;
    margin: 0 auto;
  }
  .bpHeaderContentAvatarContainer img {
    display: none;
  }
  .bpHeaderContentAvatarContainer img, .bpComposerButtonContainer, .bpHeaderContentActionsContainer svg:nth-child(2) {
    display: none;
  }
  .bpHeaderContentAvatarContainer {
    background-image: url("https://www.ucentral.cl/triptico-dave/images/logo.png");
    background-size: cover;
    background-position: fixed;
    width: 100%;
    height: 100%;
    aspect-ratio: 2.3/1;
    border-radius: 0%;
  }
  .bpHeaderContentActionsIcons, bpComposerVoiceButtonIcon {
    background-color: #fe5200;
    color: white;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    cursor: pointer;
  }
  .bpModalDialogNewConversationButton {
    background-color: #fe5200;
    color: white;
  }
  .bpComposerContainer {
    border: 1px solid #0026fa;
    width: 60%;
    margin: 0 auto 50px auto;
  }
  .bpComposerContainer:focus {
    border-color: #fe5200;
    outline: none;
  }
  .bpMessageListContainer {
    width: 60%;
    margin: 0 auto;
  }
  .send-message-button-container {
    background-color: #fe5200;
    color: white;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0.2rem;
    cursor: pointer;
  }
  .reset-button {
    background-color: #fe5200;
    color: white;
    margin: 0.2rem; 
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.5rem;
    border: white 2px solid;
  }
}
.bpHeaderContentAvatarImage {
    width: 100%;
    height: 100%;
}
.bpHeaderContentAvatarContainer img, .bpComposerButtonContainer, .bpHeaderContentActionsContainer svg:nth-child(2) {
  display: none;
}
.bpHeaderContentActionsContainer {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.bpHeaderContentAvatarContainer {
  background-image: url("https://www.ucentral.cl/triptico-dave/images/logo.png");
  background-size: cover;
  background-position: fixed;
  margin: 0 !important;
}
.bpHeaderContainer {
  display: flex;
  background-color: #0026fa;
  color: white;
  padding: 10px;
}
.bpHeaderContentContainer {
  height: 14vh;
    gap: 0;
}
.bpHeaderContentTitle {
  font-size: 2rem;
  text-transform: uppercase;
  font-weight: bold;
  text-align: center;
  color: white;
  margin: 0 auto;
}
.bpHeaderContentActionsIcons {
  background-color: #fe5200;
  color: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  cursor: pointer;
}
.reset-button, .logout-button {
  background-color: #fe5200;
  color: white;
  margin: 0.2rem; 
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: white 2px solid;
}
.bpHeaderContentActionsContainer {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.bpComposerContainer {
  border: 1px solid #0026fa;
  width: 90%;
  margin: 0 auto 20px auto;
}
.bpComposerContainer:focus {
  border-color: #fe5200;
  outline: none;
}
.bpMessageListContainer {
  width: 100%;
  margin: 0 auto;
}
.send-message-button-container {
  background-color: #fe5200;
  color: white;
  border-radius: 50%;
  width: 6vh;
  height: 6vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0.2rem;
  cursor: pointer;
}
.
`;

const config = {
  composerPlaceholder: '¿En qué puedo ayudarte hoy?',
  botName: 'Tótem Informativo Ucen',
  botAvatar: 'https://i.imgur.com/9ETSYzU.png',
};

const clientId = 'e5b8480b-e0a4-4ddd-b4a4-f1275aa7c502';

export default function App() {
  const client = getClient({ clientId });
  const [isWebchatOpen, setIsWebchatOpen] = useState(true);
  const [container1, setContainer1] = useState(null);
  const [container2, setContainer2] = useState(null);

  const handleSendMessage = () => {
    const textarea = document.querySelector('.bpComposerInput');
    if (textarea) {
      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        keyCode: 13,
        code: 'Enter',
        which: 13,
        bubbles: true,
      });
      textarea.dispatchEvent(enterEvent);
    }
  };

  // Manejo de cierre de sesión
  const handleLogout = () => {
    window.location.reload();
  };

  useEffect(() => {
    const checkContainer1 = document.querySelector('.bpComposerContainer');
    const checkContainer2 = document.querySelector('.bpHeaderContentActionsContainer');

    if (checkContainer1) setContainer1(checkContainer1);
    if (checkContainer2) setContainer2(checkContainer2);
  }, [isWebchatOpen]); // Solo se verifica cuando Webchat está abierto

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <style>{style}</style>
      <style>{customStyles}</style>

      <WebchatProvider
        key={JSON.stringify(config)}
        theme={theme}
        configuration={config}
        client={client}
      >
        {isWebchatOpen && <Webchat />}
      </WebchatProvider>

      {/* Usamos React Portal para renderizar el botón solo si el contenedor está disponible */}
      {container1 && ReactDOM.createPortal(
        <div className='send-message-button-container'>
          <button className="send-message-button" onClick={handleSendMessage} dangerouslySetInnerHTML={{ __html: svgContent }} />
        </div>,
        container1 // Aquí insertamos el botón en el contenedor adecuado
      )}

      {container2 && ReactDOM.createPortal(
        <div>
          <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
        </div>,
        container2 // Aquí insertamos el botón en el contenedor adecuado
      )}
    </div>
  );
}