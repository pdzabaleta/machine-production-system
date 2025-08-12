// frontend/src/Modal.jsx
import './Modal.css'; // Importaremos los estilos que crearemos a continuación

// Este componente recibe props para funcionar:
// isOpen: para saber si debe mostrarse
// onClose: la función que se ejecuta al cerrar/cancelar
// onConfirm: la función que se ejecuta al confirmar
// children: el contenido o mensaje que mostrará el modal
function Modal({ isOpen, onClose, onConfirm, children }) {
  if (!isOpen) {
    return null; // Si no está abierto, no renderiza nada
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
        <div className="modal-actions">
          <button onClick={onConfirm} className="confirm-btn">Confirmar</button>
          <button onClick={onClose} className="cancel-btn">Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default Modal;