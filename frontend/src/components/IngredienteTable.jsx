const IngredienteTable = ({
  ingredientes,
  onEdit,
  onDelete,
  loading,
  getInventarioNombre,
}) => {
  console.log("Ingredientes en la tabla:", ingredientes); // Verifica si los ingredientes están llegando correctamente

  if (loading) {
    return (
      <div className="text-center">
        <p>Cargando ingredientes...</p>
      </div>
    );
  }

  // Asegúrate de que ingredientes sea un array antes de mapear
  if (!Array.isArray(ingredientes) || ingredientes.length === 0) {
    return (
      <div className="text-center">
        <p>No hay ingredientes disponibles.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Cantidad</th>
            <th className="px-4 py-2">Porción</th>
            <th className="px-4 py-2">Inventario</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ingredientes.map((ingrediente) => (
            <tr key={ingrediente.ingredienteID} className="border-t">
              <td className="px-4 py-2">{ingrediente.nombre}</td>
              <td className="px-4 py-2">{ingrediente.cantidad}</td>
              <td className="px-4 py-2">{ingrediente.porcion}</td>
              <td className="px-4 py-2">
                {ingrediente.inventarioNombre ||
                  getInventarioNombre(ingrediente.inventarioID)}
              </td>
              <td className="px-4 py-2 text-center">
                <button
                  onClick={() => onEdit(ingrediente)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(ingrediente.ingredienteID)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IngredienteTable;
