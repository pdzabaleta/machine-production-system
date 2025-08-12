import { useState, useEffect } from 'react';
import Modal from './Modal';
import './App.css';
import './Modal.css';

function App() {
  const [maquinas, setMaquinas] = useState([]);
  const [loading, setLoading] = useState(true);
  // Guardar los datos del formulario
  const [formData, setFormData] = useState({ nombre: '', coeficiente: '' });
  
  // Estados para el modal de borrado, para saber si se muestra y a quién.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [maquinaParaBorrar, setMaquinaParaBorrar] = useState(null);

  // Estados para la edición, para saber qué fila se edita y qué datos tiene.
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ nombre: '', coeficiente: '' });

  // Peticion a API para asi obtener las maquinas
  const fetchMaquinas = () => {
    setLoading(true);
    fetch('http://127.0.0.1:8000/api/maquinas')
      .then(response => response.json())
      .then(data => {
        setMaquinas(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al obtener las máquinas:", error);
        setLoading(false);
      });
  };

  // useEffect se ejecuta al cargar el componente
  useEffect(() => {
    fetchMaquinas();
  }, []);

  // Manejo de los inputs del usuario, se usar en el metodo crud
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manejo de envio de formulario
  const handleSubmit = (event) => {
    event.preventDefault(); // Se evita que la pagina se recargue ya que se actualizara dinamicamente del lado del cliente

    fetch('http://127.0.0.1:8000/api/maquinas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(formData), 
    })
    .then(response => response.json())
    .then(newMachine => {
      setMaquinas([...maquinas, newMachine]);
      setFormData({ nombre: '', coeficiente: '' });
    })
    .catch(error => console.error("Error al crear la máquina:", error));
  };

  // Abre la ventana para confirmar si se quiere borrar.
  const abrirModalDeConfirmacion = (id) => {
    setMaquinaParaBorrar(id);
    setIsModalOpen(true);
  };

  // Si se confirma en el modal, se ejecuta el borrado.
  const confirmarBorrado = () => {
    fetch(`http://127.0.0.1:8000/api/maquinas/${maquinaParaBorrar}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (response.ok) {
        setMaquinas(maquinas.filter(maquina => maquina.id !== maquinaParaBorrar));
      }
      setIsModalOpen(false);
      setMaquinaParaBorrar(null);
    })
    .catch(error => {
      console.error("Error al eliminar la máquina:", error);
      setIsModalOpen(false);
      setMaquinaParaBorrar(null);
    });
  };

  // Se activa al darle al botón "Editar", preparando todo para la edición.
  const handleEditClick = (maquina) => {
    setEditingId(maquina.id);
    setEditFormData({ nombre: maquina.nombre, coeficiente: maquina.coeficiente });
  };

  // Para salir del modo edición si el usuario se arrepiente.
  const handleCancelClick = () => {
    setEditingId(null);
  };

  // Maneja los cambios en los inputs del formulario de EDICIÓN.
  const handleEditFormChange = (event) => {
    const { name, value } = event.target;
    setEditFormData({ ...editFormData, [name]: value });
  };
  
  // Envía los datos actualizados a la API cuando se guarda una fila.
  const handleUpdateSubmit = (event, id) => {
    event.preventDefault();
    fetch(`http://127.0.0.1:8000/api/maquinas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(editFormData),
    })
    .then(response => response.json())
    .then(updatedMachine => {
      const nuevasMaquinas = maquinas.map(maquina =>
        maquina.id === id ? updatedMachine : maquina
      );
      setMaquinas(nuevasMaquinas);
      setEditingId(null);
    })
    .catch(error => console.error("Error al actualizar la máquina:", error));
  };

  if (loading) {
    return <div>Cargando máquinas...</div>;
  }

  return (
    <div className="App">
      <h1>Gestión de Máquinas</h1>

      {/* Formulario para crear maquinas */}
      <form onSubmit={handleSubmit}>
        <h3>Crear Nueva Máquina</h3>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre de la máquina"
          value={formData.nombre}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="coeficiente"
          placeholder="Coeficiente (1.0 - 3.0)"
          step="0.01"
          min="1"
          max="3"
          value={formData.coeficiente}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Crear Máquina</button>
      </form>

      <hr />
      
      {/* Tabla de maquinas existentes en db*/}
      <form>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Coeficiente</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {maquinas.map(maquina => (
              <tr key={maquina.id}>
                {editingId === maquina.id ? (
                  <>
                    <td>{maquina.id}</td>
                    <td>
                      <input
                        type="text"
                        name="nombre"
                        value={editFormData.nombre}
                        onChange={handleEditFormChange}
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="coeficiente"
                        step="0.01" min="1" max="3"
                        value={editFormData.coeficiente}
                        onChange={handleEditFormChange}
                        required
                      />
                    </td>
                    <td>
                      <button type="button" onClick={(e) => handleUpdateSubmit(e, maquina.id)}>Guardar</button>
                      <button type="button" onClick={handleCancelClick}>Cancelar</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{maquina.id}</td>
                    <td>{maquina.nombre}</td>
                    <td>{maquina.coeficiente}</td>
                    <td>
                      {/* --- AQUÍ ESTÁ LA CORRECCIÓN --- */}
                      <button type="button" onClick={() => handleEditClick(maquina)}>Editar</button>
                      <button type="button" className="delete-btn" onClick={() => abrirModalDeConfirmacion(maquina.id)}>
                        Eliminar
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </form>

      {/* Nuestro modal personalizado. Solo se muestra si isModalOpen es true */}
      <Modal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmarBorrado}
      >
        <p>¿Estás seguro de que quieres eliminar esta máquina?</p>
        <p>Esta acción no se puede deshacer.</p>
      </Modal>
    </div>
  );
}

export default App;
