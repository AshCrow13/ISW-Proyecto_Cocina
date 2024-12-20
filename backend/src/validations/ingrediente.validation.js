"use strict";

import { AppDataSource } from "../config/configDb.js";
import IngredienteSchema from "../entity/Ingrediente.entity.js";
import Joi from "joi";

// Esquema de validación para el cuerpo (body) de las solicitudes
const ingredienteBodyValidation = Joi.object({
  nombre: Joi.string().min(3).max(255).required().messages({
    "string.base": "El nombre debe ser una cadena de caracteres",
    "string.min": "El nombre debe tener al menos 3 caracteres",
    "string.max": "El nombre no puede tener más de 255 caracteres",
    "any.required": "El nombre es obligatorio",
  }),
  cantidad: Joi.number().integer().min(1).required().messages({
    "number.base": "La cantidad debe ser un número entero",
    "number.min": "La cantidad debe ser al menos 1",
    "any.required": "La cantidad es obligatoria",
  }),
  porcion: Joi.number().integer().min(1).required().messages({
    "number.base": "La porción debe ser un número entero",
    "number.min": "La porción debe ser al menos 1",
    "any.required": "La porción es obligatoria",
  }),
  inventarioID: Joi.number().integer().optional().messages({
    "number.base": "El ID del inventario debe ser un número entero",
  }),
});

// Esquema de validación para los parámetros de consulta (query)
const ingredienteQueryValidation = Joi.object({
  nombre: Joi.string().min(3).max(255).optional().messages({
    "string.base": "El nombre debe ser una cadena de caracteres",
    "string.min": "El nombre debe tener al menos 3 caracteres",
    "string.max": "El nombre no puede tener más de 255 caracteres",
  }),
  cantidad: Joi.number().integer().optional().messages({
    "number.base": "La cantidad debe ser un número entero",
  }),
  porcion: Joi.number().integer().optional().messages({
    "number.base": "La porción debe ser un número entero",
  }),
  inventarioID: Joi.number().integer().optional().messages({
    "number.base": "El ID del inventario debe ser un número entero",
  }),
});

// Función para validar la unicidad del ingrediente
const validateIngredienteUniqueness = async (nombre, inventarioID) => {
  const ingredienteRepo = AppDataSource.getRepository(IngredienteSchema);
  const existingIngrediente = await ingredienteRepo.findOne({
    where: { nombre, inventarioID },
  });

  if (existingIngrediente) {
    throw new Error(
      "Ya existe un ingrediente con este nombre en el mismo inventario.",
    );
  }
};

export {
  ingredienteBodyValidation,
  ingredienteQueryValidation,
  validateIngredienteUniqueness,
};
