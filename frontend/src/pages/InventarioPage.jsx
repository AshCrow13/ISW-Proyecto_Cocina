import { useState } from "react";
import InventarioForm from "../components/InventarioForm";
import InventarioTable from "../components/InventarioTable";
import IngredienteTableMini from "../components/IngredienteTableMini";

import useAddInventario from "../hooks/inventario/useAddInventario";
import useDeleteInventario from "../hooks/inventario/useDeleteInventario";
import useEditInventario from "../hooks/inventario/useEditInventario";
import useFetchInventarios from "../hooks/inventario/useFetchInventario";
import useFetchIngredientes from "../hooks/ingrediente/useFetchIngrediente";

const InventarioPage = () => {
  // Hooks para cargar inventarios e ingredientes
  const {
    inventarios,
    fetchInventarios,
    loading: loadingInventarios,
  } = useFetchInventarios();
  const { ingredientes, loading: loadingIngredientes } = useFetchIngredientes();

  // Hooks para acciones de inventario
  const { handleAddInventario } = useAddInventario(fetchInventarios);
  const {
    isEditing,
    selectedInventario,
    handleEdit,
    handleUpdateInventario,
    setIsEditing,
  } = useEditInventario(fetchInventarios);
  const { handleDeleteInventario } = useDeleteInventario(fetchInventarios);

  // Manejar selección de inventario para mostrar ingredientes
  const [currentInventario, setCurrentInventario] = useState(null);

  // Mostrar u ocultar el formulario en el modal
  const [showForm, setShowForm] = useState(false);

  // Obtener nombre del inventario seleccionado
  const currentInventarioNombre = inventarios.find(
    (inv) => inv.inventarioID === currentInventario
  )?.nombre;

  // Filtrar ingredientes por inventario seleccionado
  const filteredIngredientes = ingredientes.filter(
    (ing) => ing.inventarioID === currentInventario
  );

  // Función para manejar el envío del formulario
  const handleSubmit = (data) => {
    if (isEditing) {
      handleUpdateInventario(selectedInventario.inventarioID, data);
    } else {
      // Incluir la fecha en el inventario al crear uno nuevo
      const inventarioConFecha = {
        ...data,
        fecha: new Date().toISOString(),
      };
      handleAddInventario(inventarioConFecha);
    }
    setIsEditing(false);
    setShowForm(false); // Ocultar el formulario después de guardar
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShowForm(false); // Ocultar el formulario si se cancela
  };

  const handleEditClick = (id) => {
    // Establecer el inventario seleccionado para editar y mostrar el formulario
    handleEdit(id);
    setShowForm(true);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex gap-6">
      {/* Cargando datos */}
      {(loadingInventarios || loadingIngredientes) && (
        <p className="text-center">Cargando datos...</p>
      )}

      <div className="w-2/3">
        {/* Botón para mostrar el formulario */}
        <div className="flex justify-end mb-4">
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Crear Inventario
            </button>
          )}
        </div>

        {/* Modal para mostrar el formulario */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/2">
              <h2 className="text-xl font-semibold mb-4">
                {isEditing ? "Editar Inventario" : "Crear Inventario"}
              </h2>
              <InventarioForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                initialValues={isEditing ? selectedInventario : {}}
              />
            </div>
          </div>
        )}

        {/* Tabla de Inventarios */}
        <InventarioTable
          inventarios={inventarios}
          onEdit={handleEditClick} // Pasamos la nueva función para editar
          onDelete={handleDeleteInventario}
          onSelectInventario={(id) => setCurrentInventario(id)}
        />
      </div>

      <div className="w-1/3">
        {/* Tabla de Ingredientes filtrados */}
        {currentInventario && (
          <IngredienteTableMini
            ingredientes={filteredIngredientes}
            inventarioNombre={currentInventarioNombre}
          />
        )}
      </div>
    </div>
  );
};

export default InventarioPage;
