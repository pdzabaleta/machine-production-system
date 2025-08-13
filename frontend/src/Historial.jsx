import { useState, useEffect } from 'react';
// Importamos el componente para descargar CSV
import { CSVLink } from 'react-csv';

function Historial() {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  // Nuevo estado para saber qué fila de detalles está abierta.
  const [expandedRowId, setExpandedRowId] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/historial')
      .then(response => response.json())
      .then(data => {
        setHistorial(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al obtener el historial:", error);
        setLoading(false);
      });
  }, []);

  // Función para abrir o cerrar los detalles de una fila.
  const toggleDetails = (id) => {
    if (expandedRowId === id) {
      setExpandedRowId(null); // Si ya está abierto, lo cierra.
    } else {
      setExpandedRowId(id); // Si está cerrado, lo abre.
    }
  };

  // Preparamos los datos para el archivo CSV.
  const getCsvData = () => {
    const data = [];
    historial.forEach(produccion => {
      produccion.tareas.forEach(tarea => {
        data.push({
          "Ciclo ID": produccion.id,
          "Tiempo Produccion Total (hrs)": produccion.tiempo_produccion,
          "Tiempo Inactividad (hrs)": produccion.tiempo_inactividad,
          "Inicio Inactividad": new Date(produccion.fecha_hora_inicio_inactividad).toLocaleString(),
          "Fin Inactividad": new Date(produccion.fecha_hora_termino_inactividad).toLocaleString(),
          "Tarea ID": tarea.id,
          "Tiempo Empleado Tarea (hrs)": tarea.tiempo_empleado,
        });
      });
    });
    return data;
  };

  if (loading) {
    return <div>Cargando historial...</div>;
  }

  return (
    <div>
      <h2>Historial de Producción</h2>
      
      {historial.length > 0 && (
        <CSVLink 
          data={getCsvData()} 
          filename={"historial_produccion.csv"}
          className="csv-download-link"
        >
          Descargar en Excel (CSV)
        </CSVLink>
      )}

      {historial.length === 0 ? (
        <p>No hay ciclos de producción completados todavía.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Ciclo ID</th>
              <th>Tiempo Producción</th>
              <th>Tiempo Inactividad</th>
              <th>Inicio Inactividad</th>
              <th>Fin Inactividad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {historial.map(produccion => (
              // Usamos Fragment para agrupar la fila principal y la de detalles
              <>
                <tr key={produccion.id}>
                  <td>{produccion.id}</td>
                  <td>{produccion.tiempo_produccion} hrs</td>
                  <td>{produccion.tiempo_inactividad} hrs</td>
                  <td>{new Date(produccion.fecha_hora_inicio_inactividad).toLocaleString()}</td>
                  <td>{new Date(produccion.fecha_hora_termino_inactividad).toLocaleString()}</td>
                  <td>
                    <button onClick={() => toggleDetails(produccion.id)}>
                      {expandedRowId === produccion.id ? 'Ocultar Detalles' : 'Ver Detalles'}
                    </button>
                  </td>
                </tr>
                {/* Fila de detalles que solo se muestra si el ID coincide */}
                {expandedRowId === produccion.id && (
                  <tr className="details-row">
                    <td colSpan="6">
                      <div className="details-content">
                        <h4>Detalle de Tareas del Ciclo {produccion.id}</h4>
                        <ul>
                          {produccion.tareas.map(tarea => (
                            <li key={tarea.id}>
                              <strong>Tarea ID: {tarea.id}</strong> | 
                              Tiempo Empleado: {tarea.tiempo_empleado} hrs | 
                              Inicio: {new Date(tarea.fecha_hora_inicio).toLocaleDateString()} | 
                              Fin: {new Date(tarea.fecha_hora_termino).toLocaleDateString()}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Historial;
