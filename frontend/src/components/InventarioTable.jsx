const InventarioTable = ({
  inventarios,
  onEdit,
  onDelete,
  onSelectInventario,
}) => {
  return (
    <table className="table-auto w-full bg-white shadow-md rounded">
      <thead>
        <tr className="bg-gray-200">
          <th className="px-4 py-2">Nombre</th>
          <th className="px-4 py-2">Estado</th>
          <th className="px-4 py-2">Fecha</th>
          <th className="px-4 py-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {inventarios.map((inventario) => (
          <tr
            key={inventario.inventarioID}
            className="border-t cursor-pointer"
            onClick={() => onSelectInventario(inventario.inventarioID)}
          >
            <td className="px-4 py-2">{inventario.nombre}</td>
            <td className="px-4 py-2">{inventario.estado}</td>
            <td className="px-4 py-2">
              {new Date(inventario.fecha).toLocaleDateString()}
            </td>
            <td className="px-4 py-2 text-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(inventario);
                }}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
              >
                Editar
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm("¿Estás seguro de eliminar este inventario?")) {
                    onDelete(inventario.inventarioID);
                  }
                }}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default InventarioTable;
