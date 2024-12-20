import { useState, useEffect } from "react";
import {
  getInventarios,
  getInventarioById,
} from "../../services/inventario.service";
import { showErrorAlert } from "../../helpers/sweetAlert";

const useFetchInventarios = () => {
  const [inventarios, setInventarios] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInventarios = async () => {
    try {
      setLoading(true);
      const data = await getInventarios();
      setInventarios(data);
    } catch (error) {
      console.error("Error al obtener inventarios:", error);
      showErrorAlert("Error", "No se pudo cargar la lista de inventarios.");
    } finally {
      setLoading(false);
    }
  };

  const fetchInventarioById = async (id) => {
    try {
      setLoading(true);
      return await getInventarioById(id);
    } catch (error) {
      console.error(`Error al obtener el inventario con ID ${id}:`, error);
      showErrorAlert("Error", "No se pudo obtener el inventario solicitado.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventarios();
  }, []);

  return {
    inventarios,
    fetchInventarios,
    fetchInventarioById,
    setInventarios,
    loading,
  };
};

export default useFetchInventarios;
