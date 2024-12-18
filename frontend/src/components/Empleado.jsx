import React, { useEffect, useState } from "react";
import {
  getEmpleado,
  createEmpleado,
  updateEmpleado,
  deleteEmpleado,
} from "../services/empleado.service.js"; // Ajusta la ruta según tu estructura

const Empleado = () => {
  const [empleados, setEmpleados] = useState([]);
  const [filteredEmpleados, setFilteredEmpleados] = useState([]);
  const [formData, setFormData] = useState({ nombre: "", contacto: "", rol: "Mesero" });
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [rolFilter, setRolFilter] = useState("Todos");

  // Obtener todos los empleados
  useEffect(() => {
    const fetchEmpleados = async () => {
      const empleados = await getEmpleado();
      setEmpleados(empleados);
      setFilteredEmpleados(empleados);  // Inicia la lista filtrada con todos los empleados
    };
    fetchEmpleados();
  }, []);

  // Filtrar empleados por rol
  const handleFilterChange = (e) => {
    const selectedRole = e.target.value;
    setRolFilter(selectedRole);
    if (selectedRole === "Todos") {
      setFilteredEmpleados(empleados);  // Mostrar todos los empleados si se selecciona "Todos"
    } else {
      setFilteredEmpleados(empleados.filter((emp) => emp.rol === selectedRole));
    }
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar la creación de un nuevo empleado
  const handleCreate = async (e) => {
    e.preventDefault();
    if (editing) {
      const updatedEmpleado = await updateEmpleado(editId, formData);
      setEmpleados((prev) =>
        prev.map((emp) => (emp.empleadoID === editId ? updatedEmpleado : emp))
      );
      setFilteredEmpleados((prev) =>
        prev.map((emp) => (emp.empleadoID === editId ? updatedEmpleado : emp))
      );
      setEditing(false);
    } else {
      const newEmpleado = await createEmpleado(formData);
      setEmpleados((prev) => [...prev, newEmpleado]);
      setFilteredEmpleados((prev) => [...prev, newEmpleado]); // También agregar al estado filtrado
    }
    setFormData({ nombre: "", contacto: "", rol: "Mesero" });
    setRolFilter("Todos");  // Resetea el filtro de rol al crear un empleado
  };

  // Manejar la edición de un empleado
  const handleEdit = (id) => {
    const empleado = empleados.find((emp) => emp.empleadoID === id);
    setFormData({ nombre: empleado.nombre, contacto: empleado.contacto, rol: empleado.rol });
    setEditing(true);
    setEditId(id);
  };

  // Manejar la eliminación de un empleado con confirmación
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro que deseas eliminar este empleado?");
    if (confirmDelete) {
      try {
        const response = await deleteEmpleado(id);  // Eliminar el empleado desde el backend
        if (response.status === 200) {
          // Actualizar el estado para eliminar el empleado de la lista
          setEmpleados((prev) => prev.filter((emp) => emp.empleadoID !== id));
          setFilteredEmpleados((prev) => prev.filter((emp) => emp.empleadoID !== id));  // También eliminar de la lista filtrada
        } else {
          console.error("Error al eliminar el empleado");
        }
      } catch (error) {
        console.error("Error al eliminar el empleado", error);
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Gestión de Empleados</h1>
      <form onSubmit={handleCreate} style={styles.form}>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          style={styles.input}
        />
        <input
          type="text"
          name="contacto"
          value={formData.contacto}
          onChange={handleChange}
          placeholder="Contacto"
          style={styles.input}
        />
        {/* Menú desplegable para el rol */}
        <select
          name="rol"
          value={formData.rol}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="Mesero">Mesero</option>
          <option value="Chef">Chef</option>
          <option value="Jefe de Cocina">Jefe de Cocina</option>
          <option value="Administrador">Administrador</option>
        </select>
        <button type="submit" style={styles.button}>
          {editing ? "Actualizar" : "Crear"}
        </button>
      </form>

      {/* Filtro por rol */}
      <div style={styles.filterContainer}>
        <label>Filtrar por rol: </label>
        <select value={rolFilter} onChange={handleFilterChange} style={styles.input}>
          <option value="Todos">Todos</option>
          <option value="Mesero">Mesero</option>
          <option value="Chef">Chef</option>
          <option value="Jefe de Cocina">Jefe de Cocina</option>
          <option value="Administrador">Administrador</option>
        </select>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Nombre</th>
            <th style={styles.th}>Contacto</th>
            <th style={styles.th}>Rol</th>
            <th style={styles.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmpleados.map((empleado) => (
            <tr key={empleado.empleadoID} style={styles.tr}>
              <td style={styles.td}>{empleado.nombre}</td>
              <td style={styles.td}>{empleado.contacto}</td>
              <td style={styles.td}>{empleado.rol}</td>
              <td style={styles.td}>
                <button onClick={() => handleEdit(empleado.empleadoID)} style={styles.editButton}>
                  Editar
                </button>
                <button onClick={() => handleDelete(empleado.empleadoID)} style={styles.deleteButton}>
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

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    margin: '0 auto',
    maxWidth: '900px',
    padding: '20px',
  },
  header: {
    textAlign: 'center',
    color: '#333',
    fontSize: '2em',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '20px',
    alignItems: 'center',
  },
  input: {
    width: '200px',
    padding: '8px',
    margin: '5px 0',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '1em',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1em',
    marginTop: '10px',
  },
  filterContainer: {
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  th: {
    textAlign: 'left',
    padding: '10px',
    backgroundColor: '#f2f2f2',
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
  },
  tr: {
    textAlign: 'left',
  },
  editButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Empleado;
