import axios from "axios";

const API_URL = "http://localhost:3000/api";

export const getPedidos = () => {
    return axios.get(`${API_URL}/pedido`);
  };

  export async function createPedido(pedidoData) {
    try {
        const { data } = await axios.post(`${API_URL}/pedido/`, pedidoData);
        return data;
    } catch (error) {
        console.error('Error al crear pedido:', error.response?.data || error.message);
        throw error.response?.data || error;
    }
}
export async function updatePedido(id, pedidoData) {
  try {
    const { data } = await axios.put(`${API_URL}/pedido/${id}`, pedidoData);
    return data;
  } catch (error) {
    console.error("Error al actualizar pedido", error);
    return null;
  }
}

export async function deletePedido(id) {
  try {
    const { data } = await axios.delete(`${API_URL}/pedido/${id}`);
    return data;
  } catch (error) {
    console.error("Error al eliminar pedido", error);
    return null;
  }
}