import axios from "./root.service.js";

export async function getEmpleado() {
  try {
    const { data } = await axios.get(`/empleado/`);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error al obtener empleados", error);
    return [];
  }
}

export async function getEmpleadoById(id) {
  try {
    const { data } = await axios.get(`/empleado/${id}`);
    return data;
  } catch (error) {
    console.error("Error al obtener empleado por ID", error);
    return error.response?.data || { message: "Error al obtener empleado", status: 500 };
  }
}

export async function createEmpleado(empleadoData) {
  try {
    console.log("Datos enviados al servidor:", empleadoData); // Log para verificar los datos enviados
    const { data } = await axios.post(`/empleado/`, empleadoData);
    return data;
  } catch (error) {
    console.error("Error al crear empleado", error.response?.data || error.message);
    throw error; // Asegúrate de manejar el error en el componente React
  }
}

export async function updateEmpleado(id, empleadoData) {
  try {
    const { data } = await axios.put(`/empleado/${id}`, empleadoData); // Corrige el `$/empleado/` a `/empleado/`
    return data;
  } catch (error) {
    console.error("Error al actualizar empleado", error.response?.data || error.message);
    throw error;
  }
}

export async function deleteEmpleado(id) {
    try {
      const { data } = await axios.delete(`/empleado/${id}`);
      return data;
    } catch (error) {
      console.error("Error al eliminar empleado", error);
      return error.response?.data || { message: "Error al eliminar empleado", status: 500 };
    }
  }