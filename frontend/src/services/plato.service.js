import axios from "axios";

const API_URL = "http://localhost:3000/api"; // Ajusta esto a tu configuración de backend

export async function getPlatos() {
    try {
        const { data } = await axios.get(`${API_URL}/plato/`);
        console.log("Datos de platos recibidos:", data);

        // Normalización de datos para evitar errores en el frontend
        const normalizedData = data.map((plato) => ({
            ...plato,
            precio: parseFloat(plato.precio) || 0, // Convertir precio a número
            ingredienteID: Array.isArray(plato.ingredienteID) ? plato.ingredienteID : [], // Asegurar que ingredienteID sea array
        }));

        return normalizedData; // Devuelve los datos normalizados
    } catch (error) {
        console.error("Error al obtener platos:", error);

        // Manejo de errores
        return {
            success: false,
            message: error.response?.data?.message || 'Error al obtener platos',
            status: error.response?.status || 500,
        };
    }
}


export async function getPlatoById(id) {
    try {
        const { data } = await axios.get(`${API_URL}/plato/${id}`);
        return data;
    } catch (error) {
        return error.response?.data || { message: 'Error al obtener plato:', status: 500 };
    }
}

export async function createPlato(platoData) {
    try {
        const { data } = await axios.post(`${API_URL}/plato/`, platoData);
        return data; // Ajusta según la estructura de tu respuesta del backend
    } catch (error) {
        return error.response?.data || { message: 'Error al crear plato', status: 500 };
    }
}
export async function updatePlato(id, platoData) {
    try {

        console.log("Datos enviados al backend para actualizar:", platoData);

        const { data } = await axios.put(`${API_URL}/plato/${id}`, platoData);
        return data;
    } catch (error) {

        console.error("Error en updatePlato:", error.response?.data || error.message);

        return error.response?.data || { message: 'Error al actualizar plato', status: 500 };
    }
}

export async function deletePlato(id) {
    try {
        const { data } = await axios.delete(`${API_URL}/plato/${id}`);
        return data;
    } catch (error) {
        return error.response?.data || { message: 'Error al eliminar plato', status: 500 };
    }
}