import { Webchat, WebchatProvider, getClient } from "@botpress/webchat";
import { buildTheme } from "@botpress/webchat-generator";
import { useState } from "react";

const { theme, style } = buildTheme({
  themeName: "prism",
  themeColor: "#0026fa", // Color del encabezado
});

// Estilos adicionales
const customStyles = `
/* Media Queries para pantallas más grandes */
@media (min-width: 768px) {
  .bpHeaderContainer {
    display: flex; /* Habilita Flexbox */
    background-color: #0026fa;
    color: white;
    padding: 10px;
  }
  .bpHeaderContentContainer {
    height: 10vh; /* Ajusta el tamaño del contenedor */
  }
  .bpHeaderContentTitle {
    font-size: 1.5rem;
    text-transform: uppercase;
    font-weight: bold;
    text-align: center;
    color: white;
    margin: 0 auto; /* Centra este item específico */
  }
  .bpHeaderContentAvatarContainer img {
    display: none; /* Oculta la imagen original */
  }
  .bpHeaderContentAvatarContainer {
    background-image: url("https://www.ucentral.cl/triptico-dave/images/logo.png");
    background-size: cover; /* O 'contain', dependiendo de tu diseño */
    background-position: fixed; /* O 'center', dependiendo de tu diseño */
    width: 100%; /* Define el ancho */
    height: 100%; /* Define la altura */
    aspect-ratio: 2.3/1; /* Define la relación de aspecto */
    border-radius: 0%;
  }
  .bpHeaderContentActionsIcons,bpComposerVoiceButtonIcon {
    background-color: #fe5200;
    color: white;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto; /* Centra este item específico */
    cursor: pointer;
  }
  .bpModalDialogNewConversationButton {
    background-color: #fe5200;
    color: white;
  }
  .bpComposerContainer{
    border: 1px solid #0026fa;
    width: 60%;
    margin: 0 auto 50px auto; /* Centra este item específico */
  }
  .bpComposerContainer:focus {
    border-color: #fe5200; /* Cambia el color del borde a rojo al hacer foco */
    outline: none; /* Elimina el contorno predeterminado del foco */
  }
  .bpMessageListContainer {
    width: 60%;
    margin: 0 auto; /* Centra este item específico */
  }
}
`;


const config = {
  composerPlaceholder: "¿En qué puedo ayudarte hoy?",
  botName: "Tótem Informativo Ucen",
  botAvatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5LGQO4NG82OZRHSxZ8-_oHQYtesszWlCVtw&s"
};

// Añade tu Client ID aquí ⬇️
const clientId = "e5b8480b-e0a4-4ddd-b4a4-f1275aa7c502";

export default function App() {
  const client = getClient({ clientId });
  const [isWebchatOpen] = useState(true); // Cambiar a true para abrirlo por defecto

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <style>{style}</style>
      <style>{customStyles}</style> {/* Agregar estilos personalizados */}
      <WebchatProvider 
        key={JSON.stringify(config)}
        theme={theme}
        configuration={config}
        client={client}
      >
        {isWebchatOpen && <Webchat />} {/* Mostrar el Webchat directamente */}
      </WebchatProvider>
    </div>
  );
}
