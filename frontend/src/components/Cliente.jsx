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
  const [modal, setModal] = useState({ type: null, cliente: null });
  const [successModal, setSuccessModal] = useState({ type: null, visible: false, message: "" });

  useEffect(() => {
    async function fetchClientes() {
      try {
        const data = await getCliente();
        const sortedData = data.sort((a, b) => a.clienteID - b.clienteID);
        setClientes(sortedData);
      } catch (error) {
        console.error("Error al cargar los clientes:", error.message);
      }
    }
    fetchClientes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCliente.nombre) {
      alert("Por favor completa el campo 'Nombre'.");
      return;
    }

    try {
      let updatedClientes;
      if (editCliente) {
        const updatedCliente = await updateCliente(editCliente.clienteID, newCliente);
        updatedClientes = clientes.map((c) =>
          c.clienteID === updatedCliente.clienteID ? updatedCliente : c
        );
        setEditCliente(null);
      } else {
        const createdCliente = await createCliente(newCliente);
        updatedClientes = [...clientes, createdCliente];
        setSuccessModal({ type: "create", visible: true, message: "Cliente creado con éxito." });
        setTimeout(() => setSuccessModal({ type: null, visible: false, message: "" }), 2000);
      }
      updatedClientes.sort((a, b) => a.clienteID - b.clienteID);
      setClientes(updatedClientes);
      setNewCliente({ nombre: "", estado: "disponible" });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al guardar el cliente.";
      setSuccessModal({ type: "error", visible: true, message: errorMessage });
      setTimeout(() => setSuccessModal({ type: null, visible: false, message: "" }), 2000);
    }
  };

  const handleEdit = (cliente) => {
    setModal({ type: "edit", cliente });
  };

  const confirmEdit = () => {
    setEditCliente(modal.cliente);
    setNewCliente({ nombre: modal.cliente.nombre, estado: modal.cliente.estado });
    setModal({ type: null, cliente: null });
  };

  const handleDelete = (cliente) => {
    setModal({ type: "delete", cliente });
  };

  const confirmDelete = async () => {
    try {
      await deleteCliente(modal.cliente.clienteID);
      const updatedClientes = clientes.filter(
        (cliente) => cliente.clienteID !== modal.cliente.clienteID
      );
      updatedClientes.sort((a, b) => a.clienteID - b.clienteID);
      setClientes(updatedClientes);

      setSuccessModal({ type: "delete", visible: true, message: "Cliente eliminado con éxito." });
      setTimeout(() => setSuccessModal({ type: null, visible: false, message: "" }), 2000);
    } catch (error) {
      const errorMessage =
        error.message.includes("viola la restricción de no nulo")
          ? "La mesa no se puede eliminar debido a que tiene un pedido en este momento."
          : "Error al eliminar la mesa.";
      setSuccessModal({ type: "error", visible: true, message: errorMessage });
      setTimeout(() => setSuccessModal({ type: null, visible: false, message: "" }), 2000);
    }
    setModal({ type: null, cliente: null });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center gap-6">
      {/* Modal */}
      {modal.type && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            {modal.type === "delete" && (
              <>
                <h2 className="text-lg font-semibold mb-4 text-center">
                  ¿Estás seguro de que deseas eliminar esta mesa?
                </h2>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setModal({ type: null, cliente: null })}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </>
            )}
            {modal.type === "edit" && (
              <>
                <h2 className="text-lg font-semibold mb-4 text-center">
                  ¿Estás seguro de que deseas editar esta mesa?
                </h2>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setModal({ type: null, cliente: null })}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmEdit}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Confirmar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Popup de éxito */}
      {successModal.visible && (
        <div
          className={`fixed bottom-4 right-4 text-white px-4 py-2 rounded shadow-md z-50 ${
            successModal.type === "create"
              ? "bg-green-500"
              : successModal.type === "delete"
              ? "bg-red-500"
              : "bg-yellow-500"
          }`}
        >
          {successModal.message}
        </div>
      )}

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow-md w-full max-w-screen-sm h-auto flex flex-col gap-4"
      >
        <h2 className="text-xl font-semibold mb-2 text-center">
          {editCliente ? "Editar Mesa" : "Crear Mesa"}
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
      <div className="w-full max-w-screen-lg overflow-x-auto">
        <h2 className="text-xl font-semibold mb-2 text-center">Mesas</h2>
        <table className="table-auto w-full bg-white shadow-md rounded text-center">
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
                <td className="px-4 py-2">{cliente.nombre}</td>
                <td className="px-4 py-2">{cliente.estado}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleEdit(cliente)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(cliente)}
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