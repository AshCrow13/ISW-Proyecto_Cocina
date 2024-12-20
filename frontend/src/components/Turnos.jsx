import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { getTurnos, createTurno, updateTurno, deleteTurno } from "../services/turno.service";
import { getEmpleado } from "../services/empleado.service";
import "../styles/Turnos.css";

function Turnos() {
  const [turnos, setTurnos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTurnos, setSelectedTurnos] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTurnoID, setEditingTurnoID] = useState(null);
  const [popupMessage, setPopupMessage] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [form, setForm] = useState({
    fecha: "",
    horaInicio: "",
    horaFin: "",
    empleadoID: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const showPopup = (message) => {
    setPopupMessage(message);
    setPopupVisible(true);
    setTimeout(() => setPopupVisible(false), 2000); // Desaparece después de 2 segundos
  };
  
  const hasConflict = (empleadoID, fecha) => {
    return turnos.some(
      (turno) => turno.fecha === fecha && turno.empleado?.empleadoID === parseInt(empleadoID)
    );
  };
  

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [turnosData, empleadosData] = await Promise.all([getTurnos(), getEmpleado()]);
        setTurnos(turnosData);
        setEmpleados(empleadosData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const formattedDate = date.toISOString().split("T")[0];
    const turnosForDate = turnos.filter((turno) => turno.fecha === formattedDate);
    setSelectedTurnos(turnosForDate);
    setForm({ ...form, fecha: formattedDate }); // Predefine la fecha en el formulario
  };

  const resetForm = () => {
    setForm({
      fecha: selectedDate ? selectedDate.toISOString().split("T")[0] : "",
      horaInicio: "",
      horaFin: "",
      empleadoID: "",
    });
    setIsEditMode(false);
    setEditingTurnoID(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validar coherencia de las horas
    if (form.horaInicio >= form.horaFin) {
      showPopup("La hora de inicio debe ser menor que la hora de fin.");
      return;
    }
  
    // Validar que el empleado no tenga más de un turno el mismo día
    if (hasConflict(form.empleadoID, form.fecha)) {
      showPopup("Este empleado ya tiene un turno asignado en esta fecha.");
      return;
    }
  
    try {
      if (isEditMode) {
        const updatedTurno = {
          ...form,
          empleado: { empleadoID: parseInt(form.empleadoID) },
        };
        await updateTurno(editingTurnoID, updatedTurno);
        alert("Turno actualizado exitosamente");
        setTurnos((prev) =>
          prev.map((turno) => (turno.turnoID === editingTurnoID ? { ...turno, ...updatedTurno } : turno))
        );
      } else {
        const newTurno = {
          ...form,
          empleado: { empleadoID: parseInt(form.empleadoID) },
        };
        const createdTurno = await createTurno(newTurno);
        alert("Turno creado exitosamente");
        setTurnos((prev) => [...prev, createdTurno]);
      }
      resetForm();
    } catch (error) {
      console.error("Error al guardar turno", error);
      showPopup("Hubo un error al guardar el turno.");
    }
  };

  const handleEditTurno = (turno) => {
    setIsEditMode(true);
    setEditingTurnoID(turno.turnoID);
    setForm({
      fecha: turno.fecha,
      horaInicio: turno.horaInicio,
      horaFin: turno.horaFin,
      empleadoID: turno.empleado?.empleadoID || "",
    });
  };

  const handleDeleteTurno = async (turnoID) => {
    try {
      await deleteTurno(turnoID);
      alert("Turno eliminado exitosamente");
      setTurnos((prev) => prev.filter((turno) => turno.turnoID !== turnoID));
    } catch (error) {
      console.error("Error al eliminar turno", error);
      alert("Error al eliminar turno");
    }
  };

  if (isLoading) {
    return <p>Cargando datos...</p>;
  }

  return (
    <div className="turnos-container">
      {popupVisible && (
    <div className="popup">
      <p>{popupMessage}</p>
      <button onClick={() => setPopupVisible(false)}>Cerrar</button>
    </div>
  )}
      <h1>Gestión de Turnos</h1>
      <div className="calendar-container">
        <Calendar onClickDay={handleDateChange} />
      </div>
      <div className="form-and-list">
        <div className="form-container">
          <h2>{isEditMode ? "Editar Turno" : "Crear Nuevo Turno"}</h2>
          <form onSubmit={handleSubmit} className="turno-form">
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
              {isEditMode ? "Actualizar Turno" : "Crear Turno"}
            </button>
          </form>
        </div>
        <div className="turnos-list">
          <h2>Turnos del día {selectedDate?.toLocaleDateString() || "Sin seleccionar"}</h2>
          {selectedTurnos.length > 0 ? (
            <ul>
              {selectedTurnos.map((turno) => (
                <li key={turno.turnoID}>
                  <p>
                    <strong>Hora Inicio:</strong> {turno.horaInicio}{" "}
                    <strong>Hora Fin:</strong> {turno.horaFin}
                  </p>
                  <p>
                    <strong>Empleado:</strong>{" "}
                    {turno.empleado ? turno.empleado.nombre : "No asignado"}
                  </p>
                  <button onClick={() => handleEditTurno(turno)}>Editar</button>
                  <button onClick={() => handleDeleteTurno(turno.turnoID)}>Eliminar</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay turnos para esta fecha.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Turnos;