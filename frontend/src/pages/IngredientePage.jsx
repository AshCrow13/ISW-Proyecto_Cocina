import { useState } from "react";
import IngredienteForm from "../components/IngredienteForm";
import IngredienteTable from "../components/IngredienteTable";

import useFetchIngredientes from "../hooks/ingrediente/useFetchIngrediente";
import useFetchInventarios from "../hooks/inventario/useFetchInventario";
import useAddIngrediente from "../hooks/ingrediente/useAddIngrediente";
import useEditIngrediente from "../hooks/ingrediente/useEditIngrediente";
import useDeleteIngrediente from "../hooks/ingrediente/useDeleteIngrediente";

const IngredientePage = () => {
  const {
    ingredientes,
    fetchIngredientes,
    loading: loadingIngredientes,
  } = useFetchIngredientes();
  console.log(ingredientes);
  const { inventarios, loading: loadingInventarios } = useFetchInventarios();
  console.log(inventarios);

  const { handleAddIngrediente } = useAddIngrediente(fetchIngredientes);
  const {
    isEditing,
    selectedIngrediente,
    handleEdit,
    handleUpdateIngrediente,
    setIsEditing,
  } = useEditIngrediente(fetchIngredientes);
  const { handleDeleteIngrediente } = useDeleteIngrediente(fetchIngredientes);

  // Manejo del formulario
  const [showForm, setShowForm] = useState(false);

  // Función para obtener el nombre del inventario
  const getInventarioNombre = (inventarioID) => {
    if (!inventarioID) return "No disponible"; // Validar valores nulos o undefined
    const inventario = inventarios.find(
      (inv) => inv.inventarioID === inventarioID
    );
    return inventario ? inventario.nombre : "No disponible";
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShowForm(false); // Cierra el modal al cancelar
  };

  const handleSubmit = (data) => {
    if (isEditing) {
      // Actualizar ingrediente si estamos en modo edición
      handleUpdateIngrediente(selectedIngrediente.ingredienteID, data);
    } else {
      // Agregar un nuevo ingrediente
      handleAddIngrediente(data);
    }
    setShowForm(false); // Cierra el modal después de enviar el formulario
  };

  const handleEditClick = (id) => {
    // Establecer el ingrediente seleccionado para editar y mostrar el formulario
    handleEdit(id);
    setShowForm(true); // Mostrar el modal cuando se haga clic en "Editar"
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col gap-6">
      {(loadingIngredientes || loadingInventarios) && (
        <p className="text-center">Cargando datos...</p>
      )}

      {/* Botón para mostrar el formulario */}
      <div className="flex justify-end mb-4">
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Crear Ingrediente
          </button>
        )}
      </div>

      {/* Modal para mostrar el formulario de ingrediente */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/2">
            <h2 className="text-xl font-semibold mb-4">
              {isEditing ? "Editar Ingrediente" : "Crear Ingrediente"}
            </h2>
            <IngredienteForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              initialValues={isEditing ? selectedIngrediente : undefined}
              inventarios={inventarios}
            />
          </div>
        </div>
      )}

      {/* Tabla de Ingredientes */}
      <IngredienteTable
        ingredientes={ingredientes}
        onEdit={handleEditClick} // Al hacer clic en editar, se abrirá el formulario en modo edición
        onDelete={handleDeleteIngrediente}
        loading={loadingIngredientes}
        getInventarioNombre={getInventarioNombre}
      />
    </div>
  );
};

export default IngredientePage;
