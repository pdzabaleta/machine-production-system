import React, { useEffect } from "react";

// Recibe el mensaje, el tipo (éxito o error) y la función para cerrarse.
function Notification({ message, type, onClose }) {
  if (!message) {
    return null;
  }

  // Este efecto hará que la notificación desaparezca sola después de 5 segundos.
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    // Limpiamos el timer si el componente se desmonta antes.
    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div className={`notification ${type}`}>
      {message}
      <button onClick={onClose} className="close-btn">
        &times;
      </button>
    </div>
  );
}

export default Notification;
