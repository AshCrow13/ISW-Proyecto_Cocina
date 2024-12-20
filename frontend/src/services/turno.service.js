import axios from "axios";

const API_URL = "http://localhost:3000/api/turnos";

export async function getTurnos() {
  try {
    const { data } = await axios.get(API_URL);
    return data;
  } catch (error) {
    console.error("Error al obtener turnos", error);
    return [];
  }
}

export async function getTurnoById(turnoID) {
  try {
    const { data } = await axios.get(`${API_URL}/${turnoID}`);
    return data;
  } catch (error) {
    console.error("Error al obtener turno por ID", error);
    return error.response?.data || { message: "Error al obtener turno", status: 500 };
  }
}

export async function createTurno(turnoData) {
  try {
    const { data } = await axios.post(API_URL, turnoData);
    return data;
  } catch (error) {
    console.error("Error al crear turno", error);
    return error.response?.data || { message: "Error al crear turno", status: 500 };
  }
}

export async function updateTurno(turnoID, turnoData) {
  try {
    const { data } = await axios.put(`${API_URL}/${turnoID}`, turnoData);
    return data;
  } catch (error) {
    console.error("Error al actualizar turno", error);
    return error.response?.data || { message: "Error al actualizar turno", status: 500 };
  }
}

export async function deleteTurno(turnoID) {
  try {
    const { data } = await axios.delete(`${API_URL}/${turnoID}`);
    return data;
  } catch (error) {
    console.error("Error al eliminar turno", error);
    return error.response?.data || { message: "Error al eliminar turno", status: 500 };
  }
}
