import { useState, useEffect } from "react";

const IngredienteForm = ({
  onSubmit,
  onCancel,
  initialValues = { nombre: "", cantidad: 0, porcion: 0, inventarioID: "" },
  inventarios = [],
}) => {
  const [formValues, setFormValues] = useState(initialValues);

  useEffect(() => {
    // Solo actualizar si los initialValues han cambiado
    if (initialValues.ingredienteID !== formValues.ingredienteID) {
      setFormValues(initialValues);
    }
  }, [initialValues, formValues.ingredienteID]); // Añadimos formValues.ingredienteID como dependencia

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]:
        name === "cantidad" || name === "porcion"
          ? parseInt(value) || 0
          : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pasamos los valores del formulario al callback de onSubmit
    onSubmit(formValues);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {initialValues.ingredienteID
          ? "Actualizar Ingrediente"
          : "Crear Ingrediente"}
      </h2>
      <div>
        <label>Nombre</label>
        <input
          type="text"
          name="nombre"
          value={formValues.nombre}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </div>
      <div>
        <label>Cantidad</label>
        <input
          type="number"
          name="cantidad"
          value={formValues.cantidad}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </div>
      <div>
        <label>Porción</label>
        <input
          type="number"
          name="porcion"
          value={formValues.porcion}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </div>
      <div>
        <label>Inventario</label>
        <select
          name="inventarioID"
          value={formValues.inventarioID}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Selecciona un inventario</option>
          {inventarios.map((inv) => (
            <option key={inv.inventarioID} value={inv.inventarioID}>
              {inv.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default IngredienteForm;
