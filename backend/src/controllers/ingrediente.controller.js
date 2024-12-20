"use strict";
import { AppDataSource } from "../config/configDb.js";
import IngredienteSchema from "../entity/Ingrediente.entity.js";
import {
  ingredienteBodyValidation,
  ingredienteQueryValidation,
  validateIngredienteUniqueness,
} from "../validations/ingrediente.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

const ingredienteController = {
  create: async (req, res) => {
    try {
      const { body } = req;

      // Validación del cuerpo de la solicitud
      const { error: bodyError } = ingredienteBodyValidation.validate(body);
      if (bodyError) {
        return handleErrorClient(
          res,
          400,
          "Error de validación en los datos enviados",
          bodyError.message,
        );
      }

      // Validación de unicidad
      await validateIngredienteUniqueness(body.nombre, body.inventarioID);

      const ingredienteRepo = AppDataSource.getRepository(IngredienteSchema);
      const nuevoIngrediente = ingredienteRepo.create(body);
      const result = await ingredienteRepo.save(nuevoIngrediente);
      return handleSuccess(
        res,
        201,
        "Ingrediente creado correctamente",
        result,
      );
    } catch (error) {
      if (error.message.includes("Ya existe un ingrediente")) {
        return handleErrorClient(res, 400, error.message);
      }
      return handleErrorServer(res, 500, error.message);
    }
  },

  getAll: async (req, res) => {
    try {
      const { nombre, id, inventarioID } = req.query;

      // Construir los filtros dinámicamente
      const filters = {};
      if (nombre) filters.nombre = nombre;
      if (id) filters.ingredienteID = id;
      if (inventarioID) filters.inventarioID = inventarioID;

      // Obtener todos los ingredientes con los filtros aplicados
      const ingredienteRepo = AppDataSource.getRepository(IngredienteSchema);
      const ingredientes = await ingredienteRepo.find({
        where: filters, // Aplicar filtros solo si existen
      });

      if (ingredientes.length === 0) {
        return handleSuccess(res, 204, "No se encontraron ingredientes.");
      }

      return handleSuccess(res, 200, "Ingredientes encontrados", ingredientes);
    } catch (error) {
      return handleErrorServer(res, 500, error.message);
    }
  },

  getById: async (req, res) => {
    try {
      const ingredienteRepo = AppDataSource.getRepository(IngredienteSchema);
      const ingrediente = await ingredienteRepo.findOne({
        where: { ingredienteID: parseInt(req.params.id) },
      });
      if (!ingrediente) {
        return handleErrorClient(res, 404, "Ingrediente no encontrado");
      }
      return handleSuccess(res, 200, "Ingrediente encontrado", ingrediente);
    } catch (error) {
      return handleErrorServer(res, 500, error.message);
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params; // Obtener el ID desde los parámetros de la URL
      const { nombre, inventarioID } = req.body; // Los datos a actualizar provienen del cuerpo de la solicitud

      // Validación del cuerpo de la solicitud
      const { error: bodyError } = ingredienteBodyValidation.validate(req.body);
      if (bodyError) {
        return handleErrorClient(
          res,
          400,
          "Error de validación en los datos enviados",
          bodyError.message,
        );
      }

      // Validación de unicidad
      await validateIngredienteUniqueness(nombre, inventarioID);

      const ingredienteRepo = AppDataSource.getRepository(IngredienteSchema);
      const ingrediente = await ingredienteRepo.findOne({
        where: { ingredienteID: parseInt(id) }, // Buscar por ID en los parámetros de la URL
      });

      if (!ingrediente) {
        return handleErrorClient(res, 404, "Ingrediente no encontrado");
      }

      // Actualizar los datos del ingrediente
      ingredienteRepo.merge(ingrediente, req.body); // Merge los cambios con el cuerpo
      const result = await ingredienteRepo.save(ingrediente);

      return handleSuccess(
        res,
        200,
        "Ingrediente modificado correctamente",
        result,
      );
    } catch (error) {
      if (error.message.includes("Ya existe un ingrediente")) {
        return handleErrorClient(res, 400, error.message);
      }
      return handleErrorServer(res, 500, error.message);
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params; // Obtener el ID desde los parámetros de la URL

      const ingredienteRepo = AppDataSource.getRepository(IngredienteSchema);
      const ingrediente = await ingredienteRepo.findOne({
        where: { ingredienteID: parseInt(id) }, // Buscar por ID en los parámetros de la URL
      });
      if (!ingrediente) {
        return handleErrorClient(res, 404, "Ingrediente no encontrado");
      }

      await ingredienteRepo.remove(ingrediente);
      return handleSuccess(res, 204, "Ingrediente eliminado correctamente");
    } catch (error) {
      return handleErrorServer(res, 500, error.message);
    }
  },
};

export default ingredienteController;
