import { useState } from "react";
import { updateIngrediente } from "../../services/ingrediente.service";
import { showErrorAlert, showSuccessAlert } from "../../helpers/sweetAlert";

const useEditIngrediente = (fetchIngredientes) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedIngrediente, setSelectedIngrediente] = useState(null);

  const handleEdit = (ingrediente) => {
    setSelectedIngrediente(ingrediente);
    setIsEditing(true);
  };

  const handleUpdateIngrediente = async (id, ingrediente) => {
    // Eliminar ingredienteID si está presente en los datos
    const { ingredienteID, ...dataToUpdate } = ingrediente;

    try {
      const response = await updateIngrediente(id, dataToUpdate);
      console.log("Respuesta de la actualización:", response);
      showSuccessAlert(
        "¡Actualizado!",
        "El ingrediente se ha actualizado correctamente."
      );
      setIsEditing(false);
      await fetchIngredientes(); // Actualiza los ingredientes
    } catch (error) {
      console.error("Error al actualizar ingrediente:", error);
      showErrorAlert("Error", "No se pudo actualizar el ingrediente.");
    }
  };

  return {
    isEditing,
    selectedIngrediente,
    handleEdit,
    handleUpdateIngrediente,
    setIsEditing,
  };
};

export default useEditIngrediente;
