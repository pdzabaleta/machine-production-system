import { useState } from 'react';
import Sidebar from './Sidebar';
import Maquinas from './Maquinas';
import Historial from './Historial';
import './App.css';
import './Modal.css';

function App() {
  const [vistaActual, setVistaActual] = useState('maquinas');

  return (
    <div className="app-container">
      <Sidebar vistaActual={vistaActual} setVistaActual={setVistaActual} />
      <main className="content">
        {vistaActual === 'maquinas' ? <Maquinas /> : <Historial />}
      </main>
    </div>
  );
}

export default App;
