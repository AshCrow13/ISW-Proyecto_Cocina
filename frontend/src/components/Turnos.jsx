import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { getTurnos, createTurno } from "../services/turno.service";
import { getEmpleado } from "../services/empleado.service";
import "../styles/Turnos.css"; // Importa el archivo CSS

function Turnos() {
  const [turnos, setTurnos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTurnos, setSelectedTurnos] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form, setForm] = useState({
    fecha: "",
    horaInicio: "",
    horaFin: "",
    empleadoID: "",
  });

  useEffect(() => {
    async function fetchData() {
      const turnosData = await getTurnos();
      setTurnos(turnosData);

      const empleadosData = await getEmpleado();
      setEmpleados(empleadosData);
    }
    fetchData();
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const formattedDate = date.toISOString().split("T")[0];
    const turnosForDate = turnos.filter((turno) => turno.fecha === formattedDate);
    setSelectedTurnos(turnosForDate);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedDate(null);
    setSelectedTurnos([]);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTurno = {
      fecha: form.fecha,
      horaInicio: form.horaInicio,
      horaFin: form.horaFin,
      empleado: { empleadoID: parseInt(form.empleadoID) },
    };

    try {
      const createdTurno = await createTurno(newTurno);
      alert("Turno creado exitosamente");
      setTurnos((prev) => [...prev, createdTurno]);
      setForm({
        fecha: "",
        horaInicio: "",
        horaFin: "",
        empleadoID: "",
      });
    } catch (error) {
      console.error("Error al crear turno", error);
      alert("Hubo un error al crear el turno");
    }
  };

  return (
    <div className="turnos-container">
      <h1>Gestión de Turnos</h1>
      <div className="turnos-content">
        <div className="calendar-container">
          <Calendar onClickDay={handleDateChange} />
          {isModalVisible && (
            <div className="modal">
              <div className="modal-content">
                <h2>Turnos del día {selectedDate?.toLocaleDateString()}</h2>
                {selectedTurnos.length > 0 ? (
                  <ul>
                    {selectedTurnos.map((turno) => (
                      <li key={turno.turnoID}>
                        <p>
                          <strong>Hora Inicio:</strong> {turno.horaInicio}{" "}
                          <strong>Hora Fin:</strong> {turno.horaFin}
                        </p>
                        <p>
                          <strong>Empleado:</strong> {turno.empleado?.nombre || "No asignado"}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No hay turnos para esta fecha.</p>
                )}
                <button onClick={closeModal}>Cerrar</button>
              </div>
            </div>
          )}
        </div>
        <div className="form-container">
          <h2>Crear Nuevo Turno</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fecha">Fecha:</label>
              <input
                type="date"
                id="fecha"
                name="fecha"
                value={form.fecha}
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="horaInicio">Hora Inicio:</label>
              <input
                type="time"
                id="horaInicio"
                name="horaInicio"
                value={form.horaInicio}
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="horaFin">Hora Fin:</label>
              <input
                type="time"
                id="horaFin"
                name="horaFin"
                value={form.horaFin}
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="empleadoID">Empleado:</label>
              <select
                id="empleadoID"
                name="empleadoID"
                value={form.empleadoID}
                onChange={handleFormChange}
                required
              >
                <option value="">Seleccione un empleado</option>
                {empleados.map((empleado) => (
                  <option key={empleado.empleadoID} value={empleado.empleadoID}>
                    {empleado.nombre}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="submit-button">
              Crear Turno
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Turnos;
