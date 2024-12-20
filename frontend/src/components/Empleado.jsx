import React, { useEffect, useState } from "react";
import {
  getEmpleado,
  createEmpleado,
  updateEmpleado,
  deleteEmpleado,
} from "../services/empleado.service.js";

const Empleado = () => {
  const [empleados, setEmpleados] = useState([]);
  const [filteredEmpleados, setFilteredEmpleados] = useState([]);
  const [formData, setFormData] = useState({ nombre: "", contacto: "", rol: "Mesero", email: "", password: "" });
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [rolFilter, setRolFilter] = useState("Todos");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmpleados = async () => {
      setLoading(true);
      try {
        const empleados = await getEmpleado();
        setEmpleados(empleados);
        setFilteredEmpleados(empleados);
      } catch (e) {
        setError("No se pudieron cargar los empleados.");
      } finally {
        setLoading(false);
      }
    };
    fetchEmpleados();
  }, []);

  const handleFilterChange = (e) => {
    const selectedRole = e.target.value;
    setRolFilter(selectedRole);
    if (selectedRole === "Todos") {
      setFilteredEmpleados(empleados);
    } else {
      setFilteredEmpleados(empleados.filter((emp) => emp.rol === selectedRole));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      setError("El nombre es obligatorio.");
      return false;
    }
    if (editing && formData.password === "") {
      return true; // Permitir actualizaciones sin cambiar la contraseña
    }
    if (!formData.password.trim()) {
      setError("La contraseña es obligatoria.");
      return false;
    }
    if (!formData.email.includes("@")) {
      setError("El correo electrónico no es válido.");
      return false;
    }
    setError("");
    return true;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      if (editing) {
        const updatedEmpleado = await updateEmpleado(editId, formData);
        setEmpleados((prev) =>
          prev.map((emp) => (emp.empleadoID === editId ? updatedEmpleado : emp))
        );
        setFilteredEmpleados((prev) =>
          prev.map((emp) => (emp.empleadoID === editId ? updatedEmpleado : emp))
        );
        setEditing(false);
        setSuccess("Empleado actualizado con éxito.");
      } else {
        const newEmpleado = await createEmpleado(formData);
        setEmpleados((prev) => [...prev, newEmpleado]);
        setFilteredEmpleados((prev) => [...prev, newEmpleado]);
        setSuccess("Empleado creado con éxito.");
      }
      setFormData({ nombre: "", contacto: "", rol: "Mesero", email: "", password: "" });
      setRolFilter("Todos");
    } catch (error) {
      setError("No se pudo completar la acción. Verifica los datos.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    const empleado = empleados.find((emp) => emp.empleadoID === id);
    setFormData({
      nombre: empleado.nombre,
      contacto: empleado.contacto,
      rol: empleado.rol,
      email: empleado.email,
      password: "",
    });
    setEditing(true);
    setEditId(id);
    setSuccess("");
    setError("");
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro que deseas eliminar este empleado?");
    if (confirmDelete) {
      try {
        setLoading(true);
        await deleteEmpleado(id);
        setEmpleados((prev) => prev.filter((emp) => emp.empleadoID !== id));
        setFilteredEmpleados((prev) => prev.filter((emp) => emp.empleadoID !== id));
        setSuccess("Empleado eliminado con éxito.");
      } catch (error) {
        setError("No se pudo eliminar el empleado.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Gestión de Empleados</h1>
      <form onSubmit={handleCreate} style={styles.form}>
        <div style={styles.inputGroup}>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            style={styles.input}
            required
          />
          <input
            type="text"
            name="contacto"
            value={formData.contacto}
            onChange={handleChange}
            placeholder="Contacto"
            style={styles.input}
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Correo Electrónico"
            style={styles.input}
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Contraseña"
            style={styles.input}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <select
            name="rol"
            value={formData.rol}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="Mesero">Mesero</option>
            <option value="Chef">Chef</option>
            <option value="JefeCocina">Jefe de Cocina</option>
            <option value="Administrador">Administrador</option>
          </select>
          <button type="submit" style={styles.button}>
            {editing ? "Actualizar" : "Crear"}
          </button>
        </div>
      </form>
      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}
      {loading && <p style={styles.loading}>Cargando...</p>}

      <div style={styles.filterContainer}>
        <label style={styles.label}>Filtrar por rol:</label>
        <select value={rolFilter} onChange={handleFilterChange} style={styles.select}>
          <option value="Todos">Todos</option>
          <option value="Mesero">Mesero</option>
          <option value="Chef">Chef</option>
          <option value="JefeCocina">Jefe de Cocina</option>
          <option value="Administrador">Administrador</option>
        </select>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Nombre</th>
            <th style={styles.th}>Correo</th>
            <th style={styles.th}>Contacto</th>
            <th style={styles.th}>Rol</th>
            <th style={styles.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
  {filteredEmpleados.map((empleado) => (
    <tr key={empleado.empleadoID} style={styles.tr}>
      <td style={styles.td}>{empleado.nombre}</td>
      <td style={styles.td}>{empleado.email}</td>
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
    fontFamily: "Arial, sans-serif",
    margin: "0 auto",
    maxWidth: "1000px",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  header: {
    textAlign: "center",
    color: "#333",
    fontSize: "2.5em",
    marginBottom: "20px",
  },
  form: {
    marginBottom: "20px",
  },
  inputGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "10px",
    justifyContent: "center",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    flex: "1 1 200px",
    fontSize: "1em",
        background: 'none', // Limpia el fondo
    backgroundImage: 'none', // Evita patrones de imagen
    color: '#333', // Color del texto
  },
  select: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    flex: "1 1 200px",
    fontSize: "1em",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1em",
  },
  filterContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px",
  },
  label: {
    marginRight: "10px",
    fontSize: "1em",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "white",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  th: {
    textAlign: "left",
    padding: "15px",
    backgroundColor: "#f2f2f2",
    fontWeight: "bold",
  },
  td: {
    padding: "15px",
    borderBottom: "1px solid #ddd",
  },
  tr: {
    "&:hover": {
      backgroundColor: "#f1f1f1",
    },
  },
  editButton: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "5px",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: "10px",
  },
  success: {
    color: "green",
    textAlign: "center",
    marginBottom: "10px",
  },
  loading: {
    textAlign: "center",
    marginBottom: "10px",
    color: "#555",
  },
};

export default Empleado;