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
  const [formData, setFormData] = useState({
    nombre: "",
    contacto: "",
    rol: "Mesero",
    email: "",
    password: "",
  });
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [rolFilter, setRolFilter] = useState("Todos");
  const [errors, setErrors] = useState({});
  const [focusMessage, setFocusMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchEmpleados = async () => {
      setLoading(true);
      try {
        const empleados = await getEmpleado();
        setEmpleados(empleados);
        setFilteredEmpleados(empleados);
      } catch (e) {
        setErrorMessage("No se pudieron cargar los empleados.");
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
    setErrors((prev) => ({ ...prev, [name]: "" })); // Limpia el error del campo modificado
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio.";
    }
    if (!formData.email.includes("@")) {
      newErrors.email = "El correo electrónico no es válido.";
    }
    if (!editing && !formData.password.trim()) {
      newErrors.password = "La contraseña es obligatoria.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      if (editing) {
        const updatedEmpleado = await updateEmpleado(editId, formData);
        setEmpleados((prev) =>
          prev.map((emp) => (emp.empleadoID === editId ? updatedEmpleado : emp))
        );
        setFilteredEmpleados((prev) =>
          prev.map((emp) => (emp.empleadoID === editId ? updatedEmpleado : emp))
        );
        setSuccessMessage("Empleado actualizado con éxito.");
        setEditing(false);
      } else {
        const newEmpleado = await createEmpleado(formData);
        setEmpleados((prev) => [...prev, newEmpleado]);
        setFilteredEmpleados((prev) => [...prev, newEmpleado]);
        setSuccessMessage("Empleado creado con éxito.");
      }
      setFormData({ nombre: "", contacto: "", rol: "Mesero", email: "", password: "" });
    } catch (error) {
      setErrorMessage("No se pudo completar la acción. Verifica los datos.");
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
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro que deseas eliminar este empleado?")) {
      setLoading(true);
      try {
        await deleteEmpleado(id);
        setEmpleados((prev) => prev.filter((emp) => emp.empleadoID !== id));
        setFilteredEmpleados((prev) => prev.filter((emp) => emp.empleadoID !== id));
        setSuccessMessage("Empleado eliminado con éxito.");
      } catch (error) {
        setErrorMessage("No se pudo eliminar el empleado.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFocus = (message) => {
    setFocusMessage(message);
  };

  const handleBlur = () => {
    setFocusMessage("");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Gestión de Empleados</h1>
      <form onSubmit={handleCreateOrUpdate} style={styles.form}>
        <div style={styles.inputGroup}>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            onFocus={() => handleFocus("Ingrese el nombre completo del empleado.")}
            onBlur={handleBlur}
            style={styles.input}
          />
          {errors.nombre && <p style={styles.error}>{errors.nombre}</p>}

          <input
            type="text"
            name="contacto"
            value={formData.contacto}
            onChange={handleChange}
            placeholder="Contacto"
            onFocus={() => handleFocus("Ingrese un número de contacto válido.")}
            onBlur={handleBlur}
            style={styles.input}
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Correo Electrónico Único"
            onFocus={() => handleFocus("Ingrese un correo electrónico válido, único para cada empleado.")}
            onBlur={handleBlur}
            style={styles.input}
          />
          {errors.email && <p style={styles.error}>{errors.email}</p>}

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Contraseña"
            onFocus={() => handleFocus("La contraseña debe tener al menos 8 caracteres, maximo 25.")}
            onBlur={handleBlur}
            style={styles.input}
          />
          {errors.password && <p style={styles.error}>{errors.password}</p>}
        </div>
        <div style={styles.inputGroup}>
          <select
            name="rol"
            value={formData.rol}
            onChange={handleChange}
            onFocus={() => handleFocus("Seleccione el rol del empleado.")}
            onBlur={handleBlur}
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
      {focusMessage && <p style={styles.focusMessage}>{focusMessage}</p>}
      {successMessage && <p style={styles.success}>{successMessage}</p>}
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}
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
                <button
                  onClick={() => handleEdit(empleado.empleadoID)}
                  style={styles.editButton}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(empleado.empleadoID)}
                  style={styles.deleteButton}
                >
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
  container: { fontFamily: "Arial, sans-serif", margin: "0 auto", maxWidth: "1000px", padding: "20px" },
  header: { textAlign: "center", fontSize: "2.5em", marginBottom: "20px" },
  form: { marginBottom: "20px" },
  inputGroup: { display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "10px" },
  input: { padding: "10px", borderRadius: "5px", border: "1px solid #ccc", flex: "1 1 200px", background: 'none', // Limpia el fondo
    backgroundImage: 'none' },
  select: { padding: "10px", borderRadius: "5px", border: "1px solid #ccc", flex: "1 1 200px" },
  button: { padding: "10px 20px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px" },
  filterContainer: { display: "flex", justifyContent: "center", marginBottom: "20px" },
  table: { width: "100%", borderCollapse: "collapse", margin: "20px 0" },
  th: { background: "#f2f2f2", padding: "10px" },
  td: { padding: "10px", textAlign: "center" },
  editButton: { background: "#007bff", color: "white", border: "none", padding: "5px 10px" },
  deleteButton: { background: "#dc3545", color: "white", border: "none", padding: "5px 10px" },
  focusMessage: { textAlign: "center", color: "#555", marginBottom: "10px" },
  success: { color: "green", textAlign: "center" },
  error: { color: "red", textAlign: "center" },
  loading: { textAlign: "center", color: "#555" },
};

export default Empleado;