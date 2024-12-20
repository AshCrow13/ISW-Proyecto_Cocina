import { useState, useEffect } from "react";
import {
  getIngredientes,
  getIngredienteById,
} from "../../services/ingrediente.service";
import { showErrorAlert } from "../../helpers/sweetAlert";

const useFetchIngredientes = () => {
  const [ingredientes, setIngredientes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchIngredientes = async () => {
    try {
      setLoading(true);
      const response = await getIngredientes();
      // Asegúrate de acceder a los ingredientes dentro de 'data'
      setIngredientes(response.data || []);
    } catch (error) {
      console.error("Error al obtener ingredientes:", error);
      showErrorAlert("Error", "No se pudo cargar la lista de ingredientes.");
    } finally {
      setLoading(false);
    }
  };

  const fetchIngredienteById = async (id) => {
    try {
      setLoading(true);
      return await getIngredienteById(id);
    } catch (error) {
      console.error(`Error al obtener el ingrediente con ID ${id}:`, error);
      showErrorAlert("Error", "No se pudo obtener el ingrediente solicitado.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredientes();
  }, []);

  return {
    ingredientes,
    fetchIngredientes,
    fetchIngredienteById,
    setIngredientes,
    loading,
  };
};

export default useFetchIngredientes;
