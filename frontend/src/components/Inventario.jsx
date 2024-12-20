import { useState, useEffect } from "react";
import { getInventarios, createInventario, updateInventario, deleteInventario } from "../services/inventario.service";
import { getIngredientes } from "../services/ingrediente.service";

const Inventario = () => {
  const [inventarios, setInventarios] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);
  const [newInventario, setNewInventario] = useState({
    nombre: "",
    estado: "",
  });
  const [editInventario, setEditInventario] = useState(null);
  const [selectedInventario, setSelectedInventario] = useState(""); // Valor del inventario seleccionado
  const [showForm, setShowForm] = useState(false);

  // Cargar inventarios e ingredientes al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      const inventariosData = await getInventarios();
      const ingredientesData = await getIngredientes();
      setInventarios(inventariosData);
      setIngredientes(ingredientesData);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nombre, estado } = newInventario;

    if (!nombre || !estado) {
      alert("Por favor, completa todos los campos correctamente.");
      return;
    }

    let updatedInventarios;
    if (editInventario) {
      const updatedInventarioResponse = await updateInventario(editInventario.inventarioID, newInventario);
      updatedInventarios = inventarios.map((inv) =>
        inv.inventarioID === editInventario.inventarioID ? updatedInventarioResponse : inv
      );
      setInventarios(updatedInventarios);
      setEditInventario(null);
    } else {
      const newInventarioResponse = await createInventario({ ...newInventario, fecha: new Date() });
      updatedInventarios = [...inventarios, newInventarioResponse];
      setInventarios(updatedInventarios);
    }

    setNewInventario({ nombre: "", estado: "" });
    setShowForm(false);
  };

  const handleEdit = (inventario) => {
    setEditInventario(inventario);
    setNewInventario({
      nombre: inventario.nombre,
      estado: inventario.estado,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este inventario?")) {
      await deleteInventario(id);
      setInventarios(inventarios.filter((inv) => inv.inventarioID !== id));
    }
  };

  const handleSelectInventario = (id) => {
    setSelectedInventario(id);  // Establece el inventario seleccionado
  };

  // Filtrar ingredientes según el inventarioID seleccionado
  const filteredIngredientes = ingredientes.filter(
    (ingrediente) => ingrediente.inventarioID === parseInt(selectedInventario)
  );

  // Obtener el nombre del inventario seleccionado
  const selectedInventarioNombre = inventarios.find(
    (inventario) => inventario.inventarioID === parseInt(selectedInventario)
  )?.nombre;

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex gap-6">
      {/* Formulario para crear o editar inventario */}
      <div className="w-full flex flex-col gap-4">
        {!showForm && (
          <div className="flex justify-end">
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Crear Inventario
            </button>
          </div>
        )}

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded shadow-md w-1/3"
          >
            <h2 className="text-xl font-semibold mb-4">
              {editInventario ? "Actualizar Inventario" : "Crear Inventario"}
            </h2>
            <div>
              <label className="block mb-1">Nombre</label>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={newInventario.nombre}
                onChange={(e) =>
                  setNewInventario({ ...newInventario, nombre: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block mb-1">Estado</label>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={newInventario.estado}
                onChange={(e) =>
                  setNewInventario({ ...newInventario, estado: e.target.value })
                }
              />
            </div>
            <div className="flex mt-4 gap-2">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {editInventario ? "Actualizar" : "Crear"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditInventario(null);
                  setNewInventario({ nombre: "", estado: "" });
                  setShowForm(false);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {/* Tabla de Inventarios */}
        <div className="w-full">
          <select
            onChange={(e) => handleSelectInventario(e.target.value)}
            value={selectedInventario || ""}
            className="mb-4 p-2 border rounded w-full"
          >
            <option value="">Seleccionar inventario</option>
            {inventarios.map((inventario) => (
              <option key={inventario.inventarioID} value={inventario.inventarioID}>
                {inventario.nombre}
              </option>
            ))}
          </select>

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
                  onClick={() => handleSelectInventario(inventario.inventarioID)}
                >
                  <td className="px-4 py-2">{inventario.nombre}</td>
                  <td className="px-4 py-2">{inventario.estado}</td>
                  <td className="px-4 py-2">{new Date(inventario.fecha).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(inventario);
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(inventario.inventarioID);
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
        </div>
      </div>

      {/* Tabla de Ingredientes */}
      <div className="w-1/2">
        {selectedInventario && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              {selectedInventarioNombre ? `Ingredientes de Inventario: ${selectedInventarioNombre}` : "Ingredientes del Inventario Seleccionado"}
            </h2>
            <table className="table-auto w-full bg-white shadow-md rounded">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2">Nombre</th>
                  <th className="px-4 py-2">Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {filteredIngredientes.length > 0 ? (
                  filteredIngredientes.map((ingrediente) => (
                    <tr key={ingrediente.ingredienteID} className="border-t">
                      <td className="px-4 py-2">{ingrediente.nombre}</td>
                      <td className="px-4 py-2">{ingrediente.cantidad}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="px-4 py-2 text-center">
                      No hay ingredientes para este inventario.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventario;
