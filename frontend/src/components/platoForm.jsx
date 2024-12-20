import PropTypes from "prop-types";

const PlatoForm = ({
  newPlato,
  ingredientes,
  ingredientesCheck,
  onChange,
  onSubmit,
  onSelectIngrediente,
  editPlato,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white p-4 rounded shadow-md w-1/4 h-auto flex flex-col gap-4"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 className="text-xl font-semibold mb-2">
          {editPlato ? "Actualizar Plato" : "Crear Plato"}
        </h2>
        <a
          href="http://localhost:5173/gestionmenu"
          style={{ textDecoration: "none" }}
        >
          <button
            style={{
              backgroundColor: "#FF5722",
              color: "white",
              border: "none",
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
              borderRadius: "5px",
            }}
          >
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
          onChange={(e) => onChange({ ...newPlato, nombre: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-1">Descripción</label>
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Descripción"
          value={newPlato.descripcion}
          onChange={(e) =>
            onChange({ ...newPlato, descripcion: e.target.value })
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
            onChange({ ...newPlato, precio: parseFloat(e.target.value) })
          }
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-1">Disponibilidad</label>
        <select
          className="w-full p-2 border rounded"
          value={newPlato.disponibilidad}
          onChange={(e) =>
            onChange({ ...newPlato, disponibilidad: e.target.value === "true" })
          }
        >
          <option value="true">Disponible</option>
          <option value="false">No Disponible</option>
        </select>
      </div>

      <div>
        <label className="block text-gray-700 mb-1">Ingredientes</label>
        <div className="border p-2 rounded h-40 overflow-y-scroll ingredientes-container">
          {ingredientes
            .slice()
            .sort((a, b) => a.nombre.localeCompare(b.nombre))
            .map((ingrediente) => (
              <div key={ingrediente.ingredienteID}>
                <input
                  type="checkbox"
                  checked={ingredientesCheck.some(
                    (ing) => ing.ingredienteID === ingrediente.ingredienteID
                  )}
                  onChange={() => onSelectIngrediente(ingrediente)}
                />
                <span>{ingrediente.nombre}</span>
              </div>
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
        Nota: Para Utilizar los apartados de Ensaladas y Postres del menú
        utilice el prefijo Ensalada y Postre respectivamente.
      </h3>
    </form>
  );
};

PlatoForm.propTypes = {
  newPlato: PropTypes.shape({
    nombre: PropTypes.string,
    descripcion: PropTypes.string,
    precio: PropTypes.number,
    disponibilidad: PropTypes.bool,
  }).isRequired,
  ingredientes: PropTypes.arrayOf(
    PropTypes.shape({
      ingredienteID: PropTypes.number,
      nombre: PropTypes.string,
    })
  ).isRequired,
  ingredientesCheck: PropTypes.arrayOf(
    PropTypes.shape({
      ingredienteID: PropTypes.number,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onSelectIngrediente: PropTypes.func.isRequired,
  editPlato: PropTypes.object,
};

export default PlatoForm;
