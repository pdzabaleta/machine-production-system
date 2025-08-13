import React from "react";

// Este componente es bastante simple. Recibe la vista actual y la función
// para cambiarla, y muestra los botones de navegación.
function Sidebar({ vistaActual, setVistaActual }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Producción</h2>
      </div>
      <nav className="sidebar-nav">
        <button
          className={vistaActual === "maquinas" ? "active" : ""}
          onClick={() => setVistaActual("maquinas")}
        >
          Gestión de Máquinas
        </button>
        <button
          className={vistaActual === "historial" ? "active" : ""}
          onClick={() => setVistaActual("historial")}
        >
          Historial de Producción
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;
