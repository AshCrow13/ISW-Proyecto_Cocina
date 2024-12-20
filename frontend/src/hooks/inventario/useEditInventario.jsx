import { useState } from "react";
import { updateInventario } from "../../services/inventario.service";
import { showErrorAlert, showSuccessAlert } from "../../helpers/sweetAlert";

const useEditInventario = (fetchInventarios) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedInventario, setSelectedInventario] = useState(null);

  const handleEdit = (inventario) => {
    setSelectedInventario(inventario);
    setIsEditing(true);
  };

  const handleUpdateInventario = async (id, inventario) => {
    try {
      await updateInventario(id, inventario);
      showSuccessAlert(
        "¡Actualizado!",
        "El inventario se ha actualizado correctamente."
      );
      setIsEditing(false);
      await fetchInventarios();
    } catch (error) {
      console.error("Error al actualizar inventario:", error);
      showErrorAlert("Error", "No se pudo actualizar el inventario.");
    }
  };

  return {
    isEditing,
    selectedInventario,
    handleEdit,
    handleUpdateInventario,
    setIsEditing,
  };
};

export default useEditInventario;
