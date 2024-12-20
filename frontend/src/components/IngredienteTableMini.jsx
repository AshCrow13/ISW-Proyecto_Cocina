const IngredienteTableMini = ({ ingredientes, inventarioNombre }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        {inventarioNombre
          ? `Ingredientes de Inventario: ${inventarioNombre}`
          : "Ingredientes del Inventario Seleccionado"}
      </h2>
      <table className="table-auto w-full bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {ingredientes.length > 0 ? (
            ingredientes.map((ingrediente) => (
              <tr key={ingrediente.ingredienteID} className="border-t">
                <td className="px-4 py-2">{ingrediente.nombre}</td>
                <td className="px-4 py-2">{ingrediente.cantidad}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="px-4 py-2 text-center">
                No hay ingredientes para este inventario jeje prueba.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default IngredienteTableMini;
