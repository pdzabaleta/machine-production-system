import { useState } from 'react';
import Maquinas from './Maquinas';
import Historial from './Historial';
import './App.css';
import './Modal.css'; // Importamos los estilos aquí para que estén disponibles en toda la app

function App() {
  // Este estado es como un interruptor, nos dice qué pantalla mostrar.
  const [vistaActual, setVistaActual] = useState('maquinas'); // Por defecto, mostramos las máquinas.

  return (
    <div className="App">
      {/* Esta es la barra de navegación con los botones */}
      <nav>
        <button onClick={() => setVistaActual('maquinas')}>
          Gestión de Máquinas
        </button>
        <button onClick={() => setVistaActual('historial')}>
          Historial de Producción
        </button>
      </nav>
      
      <main>
        {/* Aquí está la magia. Si vistaActual es 'maquinas', muestra ese componente. Si no, muestra el otro. */}
        {vistaActual === 'maquinas' ? <Maquinas /> : <Historial />}
      </main>
    </div>
  );
}

export default App;
