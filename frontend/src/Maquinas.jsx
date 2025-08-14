import { useState, useEffect } from "react";
import Modal from "./Modal";
import Notification from "./Notification";

function Maquinas() {
  // --- Estados Principales ---
  // Aquí guardamos los datos que vienen de la API.
  const [maquinas, setMaquinas] = useState([]);
  const [loading, setLoading] = useState(true); // Para mostrar un mensaje de "Cargando..."
  const [notification, setNotification] = useState({ message: "", type: "" }); // Para las notificaciones de éxito/error

  // --- Estados para los Formularios y Modales ---
  const [formData, setFormData] = useState({ nombre: "", coeficiente: "" }); // Para el form de crear
  const [editFormData, setEditFormData] = useState({
    nombre: "",
    coeficiente: "",
  }); // Para el form de editar
  const [editingId, setEditingId] = useState(null); // Para saber qué fila estamos editando
  const [isModalOpen, setIsModalOpen] = useState(false); // Para mostrar/ocultar el modal de borrado
  const [maquinaParaBorrar, setMaquinaParaBorrar] = useState(null);

  // Una función simple para mostrar notificaciones.
  const showNotification = (message, type) =>
    setNotification({ message, type });

  // Esta función va a buscar la lista de máquinas a nuestra API de Laravel.
  const fetchMaquinas = () => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/api/maquinas")
      .then((response) => response.json())
      .then((data) => {
        setMaquinas(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener las máquinas:", error);
        setLoading(false);
        showNotification(
          "No se pudo conectar con el servidor. ¿Está encendido?",
          "error"
        );
      });
  };

  // useEffect se asegura de que la lista de máquinas se cargue solo una vez, al abrir la página.
  useEffect(() => {
    fetchMaquinas();
  }, []);

  // Guarda lo que el usuario escribe en los inputs del formulario.
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Se activa al enviar el formulario para crear una máquina nueva.
  const handleSubmit = (event) => {
    event.preventDefault();
    showNotification("", "");
    fetch("http://127.0.0.1:8000/api/maquinas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok)
          return response.json().then((err) => {
            throw err;
          });
        return response.json();
      })
      .then((newMachine) => {
        setMaquinas([...maquinas, newMachine]);
        setFormData({ nombre: "", coeficiente: "" });
        showNotification("Máquina creada con éxito.", "success");
      })
      .catch((err) => {
        const errorMessages = Object.values(err.errors || {})
          .flat()
          .join(" ");
        showNotification(
          errorMessages || "Hubo un error al crear la máquina.",
          "error"
        );
      });
  };

  // Lógica para el borrado, separada en dos pasos para la confirmación.
  const abrirModalDeConfirmacion = (id) => {
    setMaquinaParaBorrar(id);
    setIsModalOpen(true);
  };
  const confirmarBorrado = () => {
    fetch(`http://127.0.0.1:8000/api/maquinas/${maquinaParaBorrar}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setMaquinas(
            maquinas.filter((maquina) => maquina.id !== maquinaParaBorrar)
          );
          showNotification("Máquina eliminada con éxito.", "success");
        } else {
          throw new Error("No se pudo eliminar.");
        }
        setIsModalOpen(false);
        setMaquinaParaBorrar(null);
      })
      .catch((error) => {
        showNotification("Error al eliminar la máquina.", "error");
        setIsModalOpen(false);
        setMaquinaParaBorrar(null);
      });
  };

  // Lógica para la edición en línea.
  const handleEditClick = (maquina) => {
    setEditingId(maquina.id);
    setEditFormData({
      nombre: maquina.nombre,
      coeficiente: maquina.coeficiente,
    });
    showNotification("", "");
  };
  const handleCancelClick = () => {
    setEditingId(null);
    showNotification("", "");
  };
  const handleEditFormChange = (event) => {
    const { name, value } = event.target;
    setEditFormData({ ...editFormData, [name]: value });
  };
  const handleUpdateSubmit = (id) => {
    showNotification("", "");
    fetch(`http://127.0.0.1:8000/api/maquinas/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(editFormData),
    })
      .then((response) => {
        if (!response.ok)
          return response.json().then((err) => {
            throw err;
          });
        return response.json();
      })
      .then((updatedMachine) => {
        const nuevasMaquinas = maquinas.map((maquina) =>
          maquina.id === id ? updatedMachine : maquina
        );
        setMaquinas(nuevasMaquinas);
        setEditingId(null);
        showNotification("Máquina actualizada con éxito.", "success");
      })
      .catch((err) => {
        const errorMessages = Object.values(err.errors || {})
          .flat()
          .join(" ");
        showNotification(
          errorMessages || "Error al actualizar la máquina.",
          "error"
        );
      });
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => showNotification("", "")}
      />
      <h1>Gestión de Máquinas</h1>
      <div className="card">
        <h3>Crear Nueva Máquina</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre de la nueva máquina"
            value={formData.nombre}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="coeficiente"
            placeholder="Coeficiente (1.0-3.0)"
            step="0.01"
            min="1"
            max="3"
            value={formData.coeficiente}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Crear Máquina</button>
        </form>
      </div>
      <div className="card">
        <h2>Máquinas Existentes</h2>
        <div className="grid-table">
          <div className="grid-header">
            <div>ID</div>
            <div>Nombre</div>
            <div>Coeficiente</div>
            <div>Acciones</div>
          </div>
          <div className="grid-body">
            {maquinas.map((maquina) => (
              <div className="grid-row" key={maquina.id}>
                {/* Aquí está la magia de la edición: si el ID de esta fila es el que estamos
                    editando, mostramos los inputs. Si no, mostramos los datos normales. */}
                {editingId === maquina.id ? (
                  <>
                    <div data-label="ID">{maquina.id}</div>
                    <div data-label="Nombre">
                      <input
                        type="text"
                        name="nombre"
                        value={editFormData.nombre}
                        onChange={handleEditFormChange}
                        required
                      />
                    </div>
                    <div data-label="Coeficiente">
                      <input
                        type="number"
                        name="coeficiente"
                        step="0.01"
                        min="1"
                        max="3"
                        value={editFormData.coeficiente}
                        onChange={handleEditFormChange}
                        required
                      />
                    </div>
                    <div data-label="Acciones" className="actions-cell">
                      <button
                        type="button"
                        onClick={() => handleUpdateSubmit(maquina.id)}
                      >
                        Guardar
                      </button>
                      <button type="button" onClick={handleCancelClick}>
                        Cancelar
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div data-label="ID">{maquina.id}</div>
                    <div data-label="Nombre">{maquina.nombre}</div>
                    <div data-label="Coeficiente">{maquina.coeficiente}</div>
                    <div data-label="Acciones" className="actions-cell">
                      <button
                        type="button"
                        onClick={() => handleEditClick(maquina)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => abrirModalDeConfirmacion(maquina.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmarBorrado}
      >
        <p>¿Estás seguro de que quieres eliminar esta máquina?</p>
        <p>Esta acción no se puede deshacer.</p>
      </Modal>
    </>
  );
}

export default Maquinas;
