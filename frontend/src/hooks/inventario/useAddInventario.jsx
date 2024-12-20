import { createInventario } from "@services/inventario.service.js";
import { showErrorAlert, showSuccessAlert } from "@helpers/sweetAlert.js";

const useAddInventario = (fetchInventarios) => {
  const handleAddInventario = async (inventario) => {
    try {
      const newInventario = await createInventario(inventario);
      showSuccessAlert(
        "¡Creado!",
        "El inventario se ha registrado exitosamente."
      );
      await fetchInventarios();
    } catch (error) {
      console.error("Error al crear inventario:", error);
      showErrorAlert("Error", "No se pudo crear el inventario.");
    }
  };

  return { handleAddInventario };
};

export default useAddInventario;
