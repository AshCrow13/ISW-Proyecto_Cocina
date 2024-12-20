import React, { useState, useEffect } from "react";
import { getPedidos, updatePedido, deletePedido } from "../services/pedido.service";
import { getPlatos } from "../services/plato.service";
import { getCliente } from "../services/cliente.service";

const VerPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [platos, setPlatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editPedido, setEditPedido] = useState(null);
  const [formData, setFormData] = useState({ estado: "", total: "", platos: [], platoID: "" });
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [pedidoRes, clienteRes, platosRes] = await Promise.all([
          getPedidos(),
          getCliente(),
          getPlatos(),
        ]);

        // Asignar platos a cada pedido
        const pedidosConPlatos = pedidoRes.data.map((pedido) => {
          const platosRelacionados = platosRes.filter((plato) => plato.platoID === pedido.platoID);
          return { ...pedido, platos: platosRelacionados };
        });

        setPedidos(pedidosConPlatos);
        setClientes(clienteRes);
        setPlatos(platosRes);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar los datos:", err);
        setError("Error al cargar los datos");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditClick = (pedido) => {
    setEditPedido(pedido);
    setFormData({ estado: pedido.estado, total: pedido.total, platos: pedido.platos || [], platoID: "" });
    setShowPopup(true);
  };

  const handleDeleteClick = async (pedidoID) => {
    try {
      await deletePedido(pedidoID);
      setPedidos((prevPedidos) => prevPedidos.filter((pedido) => pedido.pedidoID !== pedidoID));
    } catch (err) {
      console.error("Error al eliminar pedido:", err);
      setError("Error al eliminar el pedido");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddPlato = () => {
    const platoSeleccionado = platos.find((p) => p.platoID === parseInt(formData.platoID));
    if (platoSeleccionado) {
      setFormData((prev) => ({
        ...prev,
        platos: [...prev.platos, platoSeleccionado],
        total: parseFloat(prev.total) + parseFloat(platoSeleccionado.precio),
        platoID: "",
      }));
    }
  };

  const handleLiberarPlato = (platoID) => {
    const platoSeleccionado = formData.platos.find((p) => p.platoID === platoID);
    if (platoSeleccionado) {
      setFormData((prev) => ({
        ...prev,
        platos: prev.platos.filter((p) => p.platoID !== platoID),
        total: parseFloat(prev.total) - parseFloat(platoSeleccionado.precio),
      }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
        const updatedData = { ...formData };

        // Verifica el formato de los platos
        updatedData.platos = formData.platos.map((plato) => plato.platoID);

        console.log("Datos enviados al backend:", updatedData);
        await updatePedido(editPedido.pedidoID, updatedData);

        const updatedPedidos = pedidos.map((pedido) =>
            pedido.pedidoID === editPedido.pedidoID
                ? { ...pedido, ...updatedData, platos: formData.platos }
                : pedido
        );

        setPedidos(updatedPedidos);
        setEditPedido(null);
        setShowPopup(false);
    } catch (err) {
        console.error("Error al actualizar pedido:", err);
        setError("Error al actualizar el pedido");
    }
};

  const pedidosPendientes = pedidos.filter((pedido) => !pedido.liberado);
  const pedidosCompletos = pedidos.filter((pedido) => pedido.liberado);

  if (loading) {
    return (
      <div>
        <h3>Cargando pedidos...</h3>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: "center", color: "#4CAF50" }}>Pedidos</h2>
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      <div style={columnContainerStyle}>
        <div style={columnStyle}>
          <h3>Pedidos Pendientes</h3>
          <ul style={listStyle}>
            {pedidosPendientes.map((pedido) => (
              <li key={pedido.pedidoID} style={listItemStyle}>
                <p><strong>Cliente:</strong> {clientes.find(c => c.clienteID === pedido.clienteID)?.nombre || "Desconocido"}</p>
                <p><strong>Fecha:</strong> {pedido.fecha}</p>
                <p><strong>Estado:</strong> {pedido.estado}</p>
                <p><strong>Total:</strong> ${pedido.total}</p>
                <p><strong>Platos:</strong></p>
                <ul>
                  {pedido.platos.length > 0 ? (
                    pedido.platos.map((plato) => (
                      <li key={plato.platoID}>{plato.nombre} - ${plato.precio}</li>
                    ))
                  ) : (
                    <li>No se encontraron platos</li>
                  )}
                </ul>
                <button
                  onClick={() => handleEditClick(pedido)}
                  style={buttonStyle}>
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteClick(pedido.pedidoID)}
                  style={deleteButtonStyle}>
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div style={columnStyle}>
          <h3>Pedidos Completos</h3>
          <ul style={listStyle}>
            {pedidosCompletos.map((pedido) => (
              <li key={pedido.pedidoID} style={listItemStyle}>
                <p><strong>Fecha:</strong> {pedido.fecha}</p>
                <p><strong>Estado:</strong> {pedido.estado}</p>
                <p><strong>Total:</strong> ${pedido.total}</p>
                <p><strong>Platos:</strong></p>
                <ul>
                  {pedido.platos.length > 0 ? (
                    pedido.platos.map((plato) => (
                      <li key={plato.platoID}>{plato.nombre} - ${plato.precio}</li>
                    ))
                  ) : (
                    <li>No se encontraron platos</li>
                  )}
                </ul>
                <button
                  onClick={() => handleDeleteClick(pedido.pedidoID)}
                  style={deleteButtonStyle}>
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showPopup && (
        <div style={popupOverlayStyle}>
          <div style={popupContentStyle}>
            <h3>Editar Pedido</h3>
            <form onSubmit={handleFormSubmit}>
              <div style={{ marginBottom: "10px" }}>
                <label htmlFor="estado" style={{ fontWeight: "bold" }}>Estado:</label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  style={inputStyle}>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Completo">Completo</option>
                </select>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label htmlFor="total" style={{ fontWeight: "bold" }}>Total:</label>
                <input
                  type="number"
                  name="total"
                  value={formData.total}
                  onChange={handleInputChange}
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <h4>Platos Asociados:</h4>
                <ul>
                  {formData.platos.map((plato) => (
                    <li key={plato.platoID}>
                      {plato.nombre} - ${plato.precio}
                      <button
                        type="button"
                        onClick={() => handleLiberarPlato(plato.platoID)}
                        style={deleteButtonStyle}>
                        Liberar
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label htmlFor="platoID" style={{ fontWeight: "bold" }}>Agregar Plato:</label>
                <select
                  name="platoID"
                  value={formData.platoID}
                  onChange={handleInputChange}
                  style={inputStyle}>
                  <option value="">Seleccione un plato</option>
                  {platos.map((plato) => (
                    <option key={plato.platoID} value={plato.platoID}>
                      {plato.nombre} - ${plato.precio}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={handleAddPlato} style={addButtonStyle}>
                  Agregar
                </button>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button type="submit" style={saveButtonStyle}>Guardar Cambios</button>
                <button type="button" onClick={() => setShowPopup(false)} style={cancelButtonStyle}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const containerStyle = { padding: "20px", fontFamily: "Arial, sans-serif" };
const columnContainerStyle = { display: "flex", justifyContent: "space-between" };
const columnStyle = { flex: 1, margin: "0 10px" };
const listStyle = { listStyleType: "none", padding: 0 };
const listItemStyle = { padding: "10px", backgroundColor: "#fff", borderRadius: "6px", marginBottom: "10px" };
const buttonStyle = { padding: "5px 10px", backgroundColor: "#4CAF50", color: "#fff", borderRadius: "4px" };
const deleteButtonStyle = { padding: "5px 10px", backgroundColor: "#f44336", color: "#fff", borderRadius: "4px", marginLeft: "10px" };
const popupOverlayStyle = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center" };
const popupContentStyle = { backgroundColor: "#fff", padding: "20px", borderRadius: "6px", width: "400px" };
const inputStyle = { width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "4px" };
const addButtonStyle = { marginTop: "10px", backgroundColor: "#4CAF50", color: "#fff", borderRadius: "4px", padding: "5px 10px" };
const saveButtonStyle = { padding: "8px 15px", backgroundColor: "#4CAF50", color: "#fff" };
const cancelButtonStyle = { padding: "8px 15px", backgroundColor: "#f44336", color: "#fff" };

export default VerPedidos;