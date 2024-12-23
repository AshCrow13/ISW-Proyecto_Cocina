import { useState, useEffect } from "react";
import PlatoForm from "../components/platoForm.jsx";
import PlatoTable from "../components/platoTable.jsx";
import { getPlatos, createPlato, updatePlato, deletePlato } from "../services/plato.service";
import { getIngredientes } from "../services/ingrediente.service";
import { showErrorAlert, showSuccessAlert, deleteDataAlert } from "../helpers/sweetAlert.js";
//import { useSnackbar } from "../components/SnackbarContext";

const GestionMenuPage = () => {
  const [platos, setPlatos] = useState([]); // Lista de platos
  const [ingredientes, setIngredientes] = useState([]); // Lista de ingredientes
  const [ingredientesCheck, setingredientesCheck] = useState([]); // Ingredientes seleccionados
  const [newPlato, setNewPlato] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    disponibilidad: true,
    ingredienteID: [],
  });
  const [editPlato, setEditPlato] = useState(null); // Plato en edición
  //const { showSnackbar } = useSnackbar(); // Snackbar para notificaciones

  // Cargar datos al iniciar el componente
  useEffect(() => {
    async function fetchData() {
      try {
        const platosData = await getPlatos();
        const ingredientesData = await getIngredientes();
        if (Array.isArray(platosData)) {
          setPlatos(platosData);
        }
        if (ingredientesData?.data && Array.isArray(ingredientesData.data)) {
          setIngredientes(ingredientesData.data); // Extrae 'data'
        console.log("Ingredientes cargados:", ingredientesData);
      } else {
        console.error("Estructura inesperada en ingredientesData:", ingredientesData);
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  }
  fetchData();
}, []);

  const updateFetchData = async () => {
    try {
      const platosData = await getPlatos();
      const ingredientesData = await getIngredientes();
      if (Array.isArray(platosData)) setPlatos(platosData);
      if (Array.isArray(ingredientesData)) setIngredientes(ingredientesData);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  };

  // Enviar formulario: crear o actualizar un plato
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que haya al menos un ingrediente seleccionado
    if (!ingredientesCheck || ingredientesCheck.length === 0) {
      showErrorAlert("Error","Debes seleccionar al menos un ingrediente.");
      return;
    }

    if (!newPlato.nombre || !newPlato.descripcion || newPlato.precio <= 0) {
      showErrorAlert("Error","Por favor, completa todos los campos correctamente.");
      return;
    }

    newPlato.ingredienteID = ingredientesCheck;

    try {
      if (editPlato) {
        // Actualizar plato
        const updatedPlato = await updatePlato(editPlato.platoID, newPlato);
        if (updatedPlato?.platoID) {
          showSuccessAlert("Listo!", "Plato actualizado correctamente.");
          updateFetchData();
        }
        setEditPlato(null);
      } else {
        // Crear nuevo plato
        const data = await createPlato(newPlato);
        showSuccessAlert("Listo!","Plato creado exitosamente");
        setPlatos([...platos, data]);
        updateFetchData();
      }

      // Reiniciar el formulario
      setNewPlato({
        nombre: "",
        descripcion: "",
        precio: 0,
        disponibilidad: true,
        ingredienteID: [],
      });
      setingredientesCheck([]);
    } catch (error) {
      console.error("Error al guardar el plato:", error);
      showErrorAlert("Error", "Ocurrió un error al guardar el plato. Inténtalo de nuevo.");
    }
  };

  // Editar un plato
  const handleEdit = (plato) => {
    setEditPlato(plato);
    setNewPlato({
      platoID: plato.platoID,
      nombre: plato.nombre,
      descripcion: plato.descripcion,
      precio: plato.precio,
      disponibilidad: plato.disponibilidad,
      ingredienteID: plato.ingredienteID,
    });
    setingredientesCheck([...plato.ingredienteID]);
  };


  
  // Eliminar un plato
  const handleDelete = async (id) => {
    const result = await deleteDataAlert();
    if (result.isConfirmed) {
      try {
        await deletePlato(id);
        setPlatos(platos.filter((plato) => plato.platoID !== id));
        showSuccessAlert("Listo!", "Plato eliminado correctamente.");
      } catch (error) {
        console.error("Error al eliminar el plato:", error);
        showErrorAlert("error", "Error al eliminar el plato.");
      }
    }
  };

  // Seleccionar o deseleccionar ingredientes
  const handleSelectIngrediente = (ingredienteSeleccionado) => {
    setingredientesCheck((prevIngredientesCheck) => {
      const yaSeleccionado = prevIngredientesCheck.some(
        (ingrediente) => ingrediente.ingredienteID === ingredienteSeleccionado.ingredienteID
      );
      return yaSeleccionado
        ? prevIngredientesCheck.filter(
            (ingrediente) => ingrediente.ingredienteID !== ingredienteSeleccionado.ingredienteID
          )
        : [...prevIngredientesCheck, ingredienteSeleccionado];
    });
  };

  // Renderizado de la página
  return (
    <div className="p-6 bg-gray-100 min-h-screen flex gap-6">
      <PlatoForm
        newPlato={newPlato}
        ingredientes={ingredientes}
        ingredientesCheck={ingredientesCheck}
        onChange={setNewPlato}
        onSubmit={handleSubmit}
        onSelectIngrediente={handleSelectIngrediente}
        editPlato={editPlato}
      />
      <PlatoTable platos={platos} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default GestionMenuPage;
