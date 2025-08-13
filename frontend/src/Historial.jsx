import { useState, useEffect } from "react";
import { CSVLink } from "react-csv";

function Historial() {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/historial")
      .then((response) => response.json())
      .then((data) => {
        const parsedData = data.map((item) => ({
          ...item,
          calculo_log: JSON.parse(item.calculo_log || "[]"),
        }));
        setHistorial(parsedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener el historial:", error);
        setLoading(false);
      });
  }, []);
  const getCsvData = () => {
    const data = [];
    historial.forEach((produccion) => {
      produccion.calculo_log.forEach((logEntry) => {
        data.push({
          "Ciclo ID": produccion.id,
          Día: logEntry.dia,
          "Detalle Cálculo": logEntry.detalle,
          "Horas Inactividad": logEntry.horas_inactividad,
          "Horas Acumuladas": logEntry.acumulado,
          Penalización: logEntry.penalizacion,
          Restante: logEntry.restante,
        });
      });
    });
    return data;
  };
  const formatDay = (dateString) => {
    const date = new Date(`${dateString}T00:00:00`);
    const dayName = date.toLocaleDateString("es-ES", { weekday: "long" });
    const capitalizedDayName =
      dayName.charAt(0).toUpperCase() + dayName.slice(1);
    return `${dateString} (${capitalizedDayName})`;
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
          filename={"historial_produccion_detallado.csv"}
          className="csv-download-link"
        >
          Descargar en Excel (CSV)
        </CSVLink>
      )}

      {historial.length === 0 ? (
        <p>
          No hay ciclos de producción completados. Ejecuta el comando en el
          backend.
        </p>
      ) : (
        historial.map((produccion) => (
          <div key={produccion.id} className="card">
            <h3>Ciclo de Producción ID: {produccion.id}</h3>
            <p>
              <strong>Tiempo de Producción Total:</strong>{" "}
              {produccion.tiempo_produccion} hrs |{" "}
              <strong>Tiempo de Inactividad Calculado:</strong>{" "}
              {produccion.tiempo_inactividad} hrs
            </p>

            <div className="table-container">
              <div className="grid-table details-table">
                <div className="grid-header">
                  <div>DÍA</div>
                  <div>DETALLE CÁLCULO</div>
                  <div>HRS INACTIVIDAD</div>
                  <div>ACUMULADA</div>
                  <div>PENALIZACIÓN</div>
                  <div>RESTANTE</div>
                </div>
                <div className="grid-body">
                  {produccion.calculo_log.map((log, index) => (
                    <div className="grid-row" key={index}>
                      <div data-label="DÍA">{formatDay(log.dia)}</div>
                      <div data-label="DETALLE CÁLCULO">{log.detalle}</div>
                      <div data-label="HRS INACTIVIDAD">
                        {log.horas_inactividad} hrs
                      </div>
                      <div data-label="ACUMULADA">{log.acumulado} hrs</div>
                      <div data-label="PENALIZACIÓN">
                        {log.penalizacion} hrs
                      </div>
                      <div data-label="RESTANTE">{log.restante} hrs</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Historial;
