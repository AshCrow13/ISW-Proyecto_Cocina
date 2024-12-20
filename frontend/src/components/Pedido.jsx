import React, { useState, useEffect } from "react";
import { createPedido } from "../services/pedido.service";
import { getPlatos } from "../services/plato.service";
import { getCliente } from "../services/cliente.service";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

const payloadCookie = Cookies.get("payload");
let payload = {};

if (payloadCookie) {
  try {
    payload = JSON.parse(payloadCookie);
  } catch (error) {
    console.error("Error al parsear la cookie payload:", error);
  }
}

const Pedido = () => {
  const [pedido, setPedido] = useState({
    clienteID: "",
    empleadoID: payload?.empleadoID || "",
    fecha: new Date().toISOString().slice(0, 10),
    estado: "Pendiente", // Valor predeterminado según tu entidad
    total: 0,
  });

  const [clientes, setClientes] = useState([]);
  const [platos, setPlatos] = useState([]);
  const [platosSeleccionados, setPlatosSeleccionados] = useState([]);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const clientesData = await getCliente();
        const platosData = await getPlatos();
  
        // Filtrar clientes con estado "disponible"
        const clientesDisponibles = clientesData.filter(
          (cliente) => cliente.estado === "disponible"
        );
  
        // Ordenar los clientes disponibles por ID (opcional)
        const clientesOrdenados = clientesDisponibles.sort(
          (a, b) => a.clienteID - b.clienteID
        );
  
        setClientes(clientesOrdenados);
        setPlatos(platosData);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };
  
    cargarDatos();
  }, []);

  const handlePlatoSelect = (idPlato) => {
    const plato = platos.find((p) => p.platoID === parseInt(idPlato));
    if (
      plato &&
      !platosSeleccionados.some((p) => p.platoID === parseInt(idPlato))
    ) {
      setPlatosSeleccionados([...platosSeleccionados, plato]);
      setPedido((prevPedido) => ({
        ...prevPedido,
        total: prevPedido.total + parseFloat(plato.precio),
      }));
    }
  };

  const handlePlatoRemove = (idPlato) => {
    const plato = platosSeleccionados.find(
      (p) => p.platoID === parseInt(idPlato)
    );
    if (plato) {
      setPlatosSeleccionados(
        platosSeleccionados.filter((p) => p.platoID !== parseInt(idPlato))
      );
      setPedido((prevPedido) => ({
        ...prevPedido,
        total: prevPedido.total - parseFloat(plato.precio),
      }));
    }
  };

  const handleCreate = async () => {
    if (
      !pedido.clienteID ||
      !pedido.empleadoID ||
      platosSeleccionados.length === 0
    ) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      setError("");
      for (const plato of platosSeleccionados) {
        const nuevoPedido = {
          ...pedido,
          platoID: plato.platoID,
        };
        await createPedido(nuevoPedido);
      }

      console.log("Pedido(s) creado(s) con éxito");
      setShowPopup(true);

      setTimeout(() => {
        setShowPopup(false);
      }, 2000);

      setPedido({
        clienteID: "",
        empleadoID: payload?.empleadoID || "",
        fecha: new Date().toISOString().slice(0, 10),
        estado: "Pendiente",
        total: 0,
      });
      setPlatosSeleccionados([]);
    } catch (error) {
      console.error("Error creando pedido:", error.message);
      setError("Hubo un error al crear el pedido.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Crear Pedido</h1>
      {error && <p style={styles.error}>{error}</p>}

      {showPopup && (
        <div style={styles.popup}>
          <p>Pedido creado exitosamente 🎉</p>
        </div>
      )}

      <form onSubmit={(e) => e.preventDefault()} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Mesa:</label>
          <select
            value={pedido.clienteID}
            onChange={(e) =>
              setPedido({
                ...pedido,
                clienteID: parseInt(e.target.value) || "",
              })
            }
            style={styles.select}
          >
            <option value="">Seleccione una mesa</option>
            {clientes.map((cliente) => (
              <option key={cliente.clienteID} value={cliente.clienteID}>
                {cliente.nombre}
              </option>
            ))}
          </select>
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Empleado:</label>
          <input
            type="text"
            value={payload?.nombre || "Empleado no identificado"}
            readOnly
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Estado:</label>
          <select
            value={pedido.estado}
            onChange={(e) => setPedido({ ...pedido, estado: e.target.value })}
            style={styles.select}
          >
            <option value="Pendiente">Pendiente</option>
          </select>
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Platos:</label>
          <select
            onChange={(e) => handlePlatoSelect(e.target.value)}
            style={styles.select}
          >
            <option value="">Seleccione un plato</option>
            {platos.map((plato) => (
              <option key={plato.platoID} value={plato.platoID}>
                {plato.nombre} - ${plato.precio}
              </option>
            ))}
          </select>
        </div>
        <div>
          <h3>Platos seleccionados:</h3>
          <ul>
            {platosSeleccionados.map((plato) => (
              <li key={plato.platoID}>
                {plato.nombre} - ${plato.precio}
                <button
                  onClick={() => handlePlatoRemove(plato.platoID)}
                  style={styles.removeButton}
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Total:</label>
          <input
            type="number"
            value={pedido.total}
            readOnly
            style={styles.input}
          />
        </div>
        <button type="button" onClick={handleCreate} style={styles.button}>
          Crear Pedido
        </button>
        <Link to="/verpedidos" style={styles.buttonLink}>
          Ver Pedidos
        </Link>
      </form>
    </div>
  );
};

const styles = {
    container: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    title: {
        textAlign: 'center',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        marginBottom: '5px',
        fontSize: '14px',
        color: '#555',
    },
    input: {
        padding: '10px',
        fontSize: '16px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box',
    },
    select: {
        padding: '10px',
        fontSize: '16px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box',
    },
    removeButton: {
        marginLeft: '10px',
        backgroundColor: '#ff5c5c',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        cursor: 'pointer',
        borderRadius: '4px',
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#4CAF50',
        color: 'white',
        fontSize: '16px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        textAlign: 'center',
        textDecoration: 'none',
    },
    buttonLink: {
        display: 'inline-block',
        padding: '10px 20px',
        backgroundColor: '#4CAF50',
        color: 'white',
        fontSize: '16px',
        borderRadius: '4px',
        textAlign: 'center',
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginBottom: '10px',
    },
    popup: {
      position: "fixed",
      top: "10%",
      left: "50%",
      transform: "translate(-50%, -10%)",
      backgroundColor: "#4CAF50",
      color: "white",
      padding: "15px 30px",
      borderRadius: "5px",
      fontSize: "1.2rem",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      zIndex: 1000,
      textAlign: "center",
    }
};

export default Pedido;