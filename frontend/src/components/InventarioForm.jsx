import { useState, useEffect } from "react";

const InventarioForm = ({ onSubmit, onCancel, initialValues }) => {
  const [formValues, setFormValues] = useState(initialValues);

  // Actualizar los valores del formulario cuando initialValues cambie
  useEffect(() => {
    setFormValues(initialValues);
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formValues.nombre || !formValues.estado) {
      alert("Todos los campos son obligatorios");
      return;
    }
    onSubmit(formValues);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {formValues.inventarioID ? "Actualizar Inventario" : "Crear Inventario"}
      </h2>
      <div>
        <label className="block mb-1">Nombre</label>
        <input
          name="nombre"
          type="text"
          className="w-full border p-2 rounded"
          value={formValues.nombre || ""}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block mb-1">Estado</label>
        <input
          name="estado"
          type="text"
          className="w-full border p-2 rounded"
          value={formValues.estado || ""}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex mt-4 gap-2">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {formValues.inventarioID ? "Actualizar" : "Crear"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default InventarioForm;
