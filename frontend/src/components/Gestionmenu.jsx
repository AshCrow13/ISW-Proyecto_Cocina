import { useState, useEffect } from "react";
import {
  getPlatos,
  createPlato,
  updatePlato,
  deletePlato,
} from "../services/plato.service";
import { getIngredientes } from "../services/ingrediente.service";
//import { useSnackbar } from "../components/SnackbarContext.jsx";

const GestionMenu = () => {
  const [platos, setPlatos] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);
  const [ingredientesCheck, setingredientesCheck] = useState([]);
  const [newPlato, setNewPlato] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    disponibilidad: true,
    ingredienteID: [],
  });
  const [editPlato, setEditPlato] = useState(null);
  //const { showSnackbar } = useSnackbar();

  // Cargar platos e ingredientes al inicio
  useEffect(() => {
    async function fetchData() {
      try {
        const platosData = await getPlatos();
        const ingredientesData = await getIngredientes();
        if (Array.isArray(platosData)) {
          setPlatos(platosData);
        }
        if (ingredientesData?.data && Array.isArray(ingredientesData.data)) {
          setIngredientes(ingredientesData.data); // Extrae 'data'
        console.log("Ingredientes cargados:", ingredientesData);
      } else {
        console.error("Estructura inesperada en ingredientesData:", ingredientesData);
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  }
  fetchData();
}, []);

  const updateFetchData = async () => {
    try {
      const platosData = await getPlatos();
      const ingredientesData = await getIngredientes();
      if (Array.isArray(platosData)) setPlatos(platosData);
      if (Array.isArray(ingredientesData)) setIngredientes(ingredientesData);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que haya al menos un ingrediente seleccionado
    if (!ingredientesCheck || ingredientesCheck.length === 0) {
      //showSnackbar("Debes seleccionar al menos un ingrediente.", "error");
      return;
    }

    if (!newPlato.nombre || !newPlato.descripcion || newPlato.precio <= 0) {
      //showSnackbar("Por favor, completa todos los campos correctamente.", "error");
      return;
    }

    newPlato.ingredienteID = ingredientesCheck;

    try {
      if (editPlato) {
        // Actualizar plato
        const updatedPlato = await updatePlato(editPlato.platoID, newPlato);
        if (updatedPlato?.platoID) {
          //showSnackbar("Plato actualizado correctamente.", "success");
          updateFetchData();
        }
        setEditPlato(null);
      } else {
        // Crear nuevo plato
        const data = await createPlato(newPlato);
        //showSnackbar("Plato creado exitosamente", "success");
        setPlatos([...platos, data]);
        updateFetchData();
      }

      // Reiniciar el formulario
      setNewPlato({
        nombre: "",
        descripcion: "",
        precio: 0,
        disponibilidad: true,
        ingredienteID: [],
      });
      setingredientesCheck([]);
    } catch (error) {
      console.error("Error al guardar el plato:", error);
      //showSnackbar("Ocurrió un error al guardar el plato. Inténtalo de nuevo.", "error");
    }
  };

  const handleEdit = (plato) => {
    setEditPlato(plato);
    setNewPlato({
      platoID: plato.platoID,
      nombre: plato.nombre,
      descripcion: plato.descripcion,
      precio: plato.precio,
      disponibilidad: plato.disponibilidad,
      ingredienteID: plato.ingredienteID,
    });
    setingredientesCheck([...plato.ingredienteID]);
  };

  const handleSelectIngrediente = (ingredienteSeleccionado) => {
    setingredientesCheck((prevIngredientesCheck) => {
      const yaSeleccionado = prevIngredientesCheck.some(
        (ingrediente) => ingrediente.ingredienteID === ingredienteSeleccionado.ingredienteID
      );
      return yaSeleccionado
        ? prevIngredientesCheck.filter(
            (ingrediente) => ingrediente.ingredienteID !== ingredienteSeleccionado.ingredienteID
          )
        : [...prevIngredientesCheck, ingredienteSeleccionado];
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de eliminar este plato?");
    if (confirmDelete) {
      const result = await deletePlato(id);
      if (result?.status !== 500) {
        setPlatos(platos.filter((plato) => plato.platoID !== id));
        //showSnackbar("Plato eliminado correctamente.", "success");
      } else {
        //showSnackbar("Error al eliminar el plato", "error");
      }
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex gap-6 items-start">
      {/* Formulario de creación/edición */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow-md w-1/3 h-auto flex flex-col gap-4"
      >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="text-xl font-semibold mb-2">
          {editPlato ? "Actualizar Plato" : "Crear Plato"}
        </h2>
        <a href="http://localhost:5173/gestionmenu" style={{ textDecoration: 'none' }}>
    <button style={{
      backgroundColor: '#FF5722',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      fontSize: '16px',
      cursor: 'pointer',
      borderRadius: '5px'
    }}>
      Atrás
    </button>
  </a>
  </div>
        <div>
          <label className="block text-gray-700 mb-1">Nombre</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Nombre"
            value={newPlato.nombre}
            onChange={(e) =>
              setNewPlato({ ...newPlato, nombre: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Descripción</label>
          <textarea
            className="w-full p-2 border rounded"
            placeholder="Descripción"
            value={newPlato.descripcion}
            onChange={(e) =>
              setNewPlato({ ...newPlato, descripcion: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Precio</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            placeholder="Precio"
            value={newPlato.precio}
            onChange={(e) =>
              setNewPlato({ ...newPlato, precio: parseFloat(e.target.value) })
            }
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Disponibilidad</label>
          <select
            className="w-full p-2 border rounded"
            value={newPlato.disponibilidad}
            onChange={(e) =>
              setNewPlato({ ...newPlato, disponibilidad: e.target.value === "true" })
            }
          >
            <option value="true">Disponible</option>
            <option value="false">No Disponible</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Ingredientes</label>
          
          {/* Contenedor desplazable */}
          <div className="border p-2 rounded h-40 overflow-y-scroll">
            {ingredientes.map((ingrediente) => (
              <label key={ingrediente.ingredienteID} className="flex items-center gap-2 mb-1">
                <input
                  type="checkbox"
                  checked={ingredientesCheck.some(
                    (ingredienteCheck) =>
                      ingrediente.ingredienteID === ingredienteCheck.ingredienteID
                  )}
                  onChange={() => handleSelectIngrediente(ingrediente)}
                />
                {ingrediente.nombre}
              </label>
          ))}
        </div>
</div>
        <div>
          <button
            type="submit"
            className="text-white px-4 py-2 rounded hover:opacity-90"
            style={{ backgroundColor: "#FF5722" }}
          >
            {editPlato ? "Actualizar" : "Crear"}
          </button>
        </div>
        
        {/* pequeño comentario sobre los prefijos de ensaladas y postres} */}
        <h3 className="text-gray-500 text-sm">
        Nota: Para Utilizar los apartados de Ensaladas y Postres del menú utilice el prefijo Ensalada y Postre respectivamente.
      </h3> 
      </form>

      {/* Tabla de platos */}
      <div className="flex-1 overflow-x-auto">
        <table className="table-auto w-full bg-white shadow-md rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Descripción</th>
              <th className="px-4 py-2 text-left">Precio</th>
              <th className="px-4 py-2 text-left">Disponibilidad</th>
              <th className="px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {platos.map((plato) => (
              <tr key={plato.platoID} className="border-t">
                <td className="px-4 py-2">{plato.nombre}</td>
                <td className="px-4 py-2">{plato.descripcion}</td>
                <td className="px-4 py-2">${plato.precio}</td>
                <td className="px-4 py-2">
                  {plato.disponibilidad ? "Disponible" : "No Disponible"}
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => handleEdit(plato)}
                    className="text-white px-3 py-1 rounded hover:opacity-90"
                    style={{ backgroundColor: "#FFC107" }}
                  >Editar</button>
                  <button
                    onClick={() => handleDelete(plato.platoID)}
                    className="text-white px-3 py-1 rounded hover:opacity-90"
                    style={{ backgroundColor: "#795548" }}
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
export default GestionMenu;
