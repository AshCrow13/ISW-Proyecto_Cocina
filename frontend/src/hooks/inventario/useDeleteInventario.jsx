import { deleteInventario } from "../../services/inventario.service";
import {
  deleteDataAlert,
  showErrorAlert,
  showSuccessAlert,
} from "../../helpers/sweetAlert";

const useDeleteInventario = (fetchInventarios) => {
  const handleDeleteInventario = async (id) => {
    try {
      const result = await deleteDataAlert();
      if (result.isConfirmed) {
        await deleteInventario(id);
        showSuccessAlert(
          "¡Eliminado!",
          "El inventario ha sido eliminado correctamente."
        );
        await fetchInventarios();
      } else {
        showErrorAlert("Cancelado", "La operación ha sido cancelada.");
      }
    } catch (error) {
      console.error("Error al eliminar inventario:", error);
      showErrorAlert("Error", "No se pudo eliminar el inventario.");
    }
  };

  return { handleDeleteInventario };
};

export default useDeleteInventario;
