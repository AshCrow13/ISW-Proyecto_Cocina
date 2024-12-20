// src/api/inventario.js
import axios from "axios";

const API_URL = "http://localhost:3000/api"; // Asegúrate de que esta URL sea correcta

// Obtener todos los inventarios
export async function getInventarios() {
  try {
    const { data } = await axios.get(`${API_URL}/inventario`);
    return data;
  } catch (error) {
    return error.response?.data || { message: 'Error al obtener inventarios', status: 500 };
  }
}

// Crear un nuevo inventario
export async function createInventario(inventarioData) {
  try {
    const { data } = await axios.post(`${API_URL}/inventario`, inventarioData);
    return data;
  } catch (error) {
    return error.response?.data || { message: 'Error al crear inventario', status: 500 };
  }
}

// Obtener inventario por ID
export async function getInventarioById(id) {
  try {
    const { data } = await axios.get(`${API_URL}/inventario/${id}`);
    return data;
  } catch (error) {
    return error.response?.data || { message: 'Error al obtener inventario', status: 500 };
  }
}

// Actualizar un inventario
export async function updateInventario(id, inventarioData) {
  try {
    const { data } = await axios.put(`${API_URL}/inventario/${id}`, inventarioData);
    return data;
  } catch (error) {
    return error.response?.data || { message: 'Error al actualizar inventario', status: 500 };
  }
}

// Eliminar un inventario
export async function deleteInventario(id) {
  try {
    const { data } = await axios.delete(`${API_URL}/inventario/${id}`);
    return data;
  } catch (error) {
    return error.response?.data || { message: 'Error al eliminar inventario', status: 500 };
  }
}
