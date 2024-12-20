import React, { useState, useEffect } from "react";
import {
  getCliente,
  createCliente,
  updateCliente,
  deleteCliente,
} from "../services/cliente.service";

const Cliente = () => {
  const [clientes, setClientes] = useState([]);
  const [newCliente, setNewCliente] = useState({
    nombre: "",
    estado: "disponible",
  });
  const [editCliente, setEditCliente] = useState(null);

  // Cargar clientes al iniciar el componente
  useEffect(() => {
    async function fetchClientes() {
      try {
        const data = await getCliente();
        // Ordenamos los clientes por clienteID de forma creciente
        const sortedData = data.sort((a, b) => a.clienteID - b.clienteID);
        setClientes(sortedData);
      } catch (error) {
        console.error("Error al cargar los clientes:", error.message);
      }
    }
    fetchClientes();
  }, []);

  // Manejar creación o edición de cliente
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCliente.nombre) {
      alert("Por favor completa el campo 'Nombre'.");
      return;
    }

    try {
      let updatedClientes;
      if (editCliente) {
        // Actualizar cliente existente
        const updatedCliente = await updateCliente(editCliente.clienteID, newCliente);
        updatedClientes = clientes.map((c) =>
          c.clienteID === updatedCliente.clienteID ? updatedCliente : c
        );
        setEditCliente(null);
      } else {
        // Crear un nuevo cliente
        const createdCliente = await createCliente(newCliente);
        updatedClientes = [...clientes, createdCliente];
      }
      // Ordenamos los clientes por clienteID de forma creciente
      updatedClientes.sort((a, b) => a.clienteID - b.clienteID);
      setClientes(updatedClientes);

      // Reiniciar formulario
      setNewCliente({ nombre: "", estado: "disponible" });
    } catch (error) {
      alert("Error al guardar el cliente: " + error.message);
    }
  };

  // Manejar edición
  const handleEdit = (cliente) => {
    setEditCliente(cliente);
    setNewCliente({ nombre: cliente.nombre, estado: cliente.estado });
  };

  // Manejar eliminación
  const handleDelete = async (clienteID) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este cliente?"
    );
    if (!confirmDelete) return;

    try {
      await deleteCliente(clienteID);
      const updatedClientes = clientes.filter((cliente) => cliente.clienteID !== clienteID);
      // Ordenamos los clientes por clienteID de forma creciente
      updatedClientes.sort((a, b) => a.clienteID - b.clienteID);
      setClientes(updatedClientes);
    } catch (error) {
      alert("Error al eliminar el cliente: " + error.message);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col gap-6">
      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow-md w-1/3 h-auto flex flex-col gap-4"
      >
        <h2 className="text-xl font-semibold mb-2">
          {editCliente ? "Editar Cliente" : "Crear Cliente"}
        </h2>
        <div>
          <label className="block text-gray-700 mb-1">Nombre</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={newCliente.nombre}
            onChange={(e) =>
              setNewCliente({ ...newCliente, nombre: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Estado</label>
          <select
            className="w-full p-2 border rounded"
            value={newCliente.estado}
            onChange={(e) =>
              setNewCliente({ ...newCliente, estado: e.target.value })
            }
          >
            <option value="disponible">Disponible</option>
            <option value="Con clientes">Con clientes</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editCliente ? "Actualizar" : "Crear"}
        </button>
      </form>

      {/* Lista de Clientes */}
      <div className="flex-1 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-2">Clientes</h2>
        <table className="table-auto w-full bg-white shadow-md rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.clienteID}>
                <td>{cliente.nombre}</td>
                <td>{cliente.estado}</td>
                <td>
                  <button
                    onClick={() => handleEdit(cliente)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(cliente.clienteID)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
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
  );
};

export default Cliente;
