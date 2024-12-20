import React, { useState, useEffect } from 'react';
import { getPedidos, updatePedido } from '../services/pedido.service'; 

const VerPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editPedido, setEditPedido] = useState(null);
  const [formData, setFormData] = useState({ estado: '', total: '' });

  // Obtener pedidos al cargar el componente
  useEffect(() => {
    getPedidos()
      .then((response) => {
        setPedidos(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Error al obtener los pedidos');
        setLoading(false);
      });
  }, []);

  // Manejar click para editar un pedido
  const handleEditClick = (pedido) => {
    setEditPedido(pedido);
    setFormData({ estado: pedido.estado, total: pedido.total });
  };

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Enviar formulario de edición
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const updatedData = await updatePedido(editPedido.pedidoID, formData);

    if (updatedData) {
      const updatedPedidos = pedidos.map((pedido) =>
        pedido.pedidoID === editPedido.pedidoID
          ? { ...pedido, estado: formData.estado, total: formData.total }
          : pedido
      );
      setPedidos(updatedPedidos);
      setEditPedido(null);
    } else {
      setError('Error al actualizar el pedido');
    }
  };

  // Mostrar mensaje de carga o error
  if (loading) {
    return <div><h3>Cargando pedidos...</h3></div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center', color: '#4CAF50' }}>Pedidos</h2>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <div style={{ marginBottom: '20px' }}>
        <h3>Lista de Pedidos</h3>
        <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
          {pedidos.map((pedido) => (
            <li key={pedido.pedidoID} style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#fff', borderRadius: '6px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
              <p><strong>ID:</strong> {pedido.pedidoID}</p>
              <p><strong>Fecha:</strong> {pedido.fecha}</p>
              <p><strong>Estado:</strong> {pedido.estado}</p>
              <p><strong>Total:</strong> ${pedido.total}</p>
              <button
                onClick={() => handleEditClick(pedido)}
                style={{
                  padding: '5px 10px', 
                  backgroundColor: '#4CAF50', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Editar
              </button>
            </li>
          ))}
        </ul>
      </div>

      {editPedido && (
        <div style={{ marginTop: '30px', backgroundColor: '#fff', padding: '20px', borderRadius: '6px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
          <h3>Editar Pedido</h3>
          <form onSubmit={handleFormSubmit}>
            <div style={{ marginBottom: '10px' }}>
              <label htmlFor="estado" style={{ fontWeight: 'bold' }}>Estado:</label>
              <input
                type="text"
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                style={{ padding: '8px', width: '100%', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label htmlFor="total" style={{ fontWeight: 'bold' }}>Total:</label>
              <input
                type="number"
                name="total"
                value={formData.total}
                onChange={handleInputChange}
                style={{ padding: '8px', width: '100%', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                type="submit"
                style={{
                  padding: '8px 15px', 
                  backgroundColor: '#4CAF50', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: 'pointer',
                }}
              >
                Guardar Cambios
              </button>
              <button
                type="button"
                onClick={() => setEditPedido(null)}
                style={{
                  padding: '8px 15px', 
                  backgroundColor: '#f44336', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default VerPedidos;