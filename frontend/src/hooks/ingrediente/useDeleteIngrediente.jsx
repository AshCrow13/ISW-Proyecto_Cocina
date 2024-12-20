import { deleteIngrediente } from "../../services/ingrediente.service";
import {
  deleteDataAlert,
  showErrorAlert,
  showSuccessAlert,
} from "../../helpers/sweetAlert";

const useDeleteIngrediente = (fetchIngredientes) => {
  const handleDeleteIngrediente = async (id) => {
    console.log("Eliminando ingrediente con ID:", id); // Log de eliminación
    try {
      const result = await deleteDataAlert();
      if (result.isConfirmed) {
        const response = await deleteIngrediente(id);
        console.log("Respuesta de la eliminación:", response); // Log de respuesta
        showSuccessAlert(
          "¡Eliminado!",
          "El ingrediente ha sido eliminado correctamente."
        );
        await fetchIngredientes(); // Actualiza los ingredientes
      } else {
        showErrorAlert("Cancelado", "La operación ha sido cancelada.");
      }
    } catch (error) {
      console.error("Error al eliminar ingrediente:", error);
      showErrorAlert("Error", "No se pudo eliminar el ingrediente.");
    }
  };

  return { handleDeleteIngrediente };
};

export default useDeleteIngrediente;
