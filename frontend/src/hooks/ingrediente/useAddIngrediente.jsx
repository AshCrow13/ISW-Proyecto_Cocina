import { createIngrediente } from "@services/ingrediente.service.js";
import { showErrorAlert, showSuccessAlert } from "@helpers/sweetAlert.js";

const useAddIngrediente = (fetchIngredientes) => {
  const handleAddIngrediente = async (ingrediente) => {
    try {
      const newIngrediente = await createIngrediente(ingrediente);
      showSuccessAlert(
        "¡Creado!",
        "El ingrediente se ha registrado exitosamente."
      );
      await fetchIngredientes();
    } catch (error) {
      console.error("Error al crear ingrediente:", error);
      showErrorAlert("Error", "No se pudo crear el ingrediente.");
    }
  };

  return { handleAddIngrediente };
};

export default useAddIngrediente;
