"use strict";
import { AppDataSource } from "../config/configDb.js";
import TurnoSchema from "../entity/Turno.entity.js";

const turnoController = {
  create: async (req, res) => {
    try {
      const turnoRepo = AppDataSource.getRepository(TurnoSchema);
      const nuevoTurno = turnoRepo.create(req.body);
      const result = await turnoRepo.save(nuevoTurno);
      res.status(201).json(result);
    } catch (error) {
      console.error("Error al crear turno:", error);
      res.status(500).json({ message: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const turnoRepo = AppDataSource.getRepository(TurnoSchema);
      // Incluye la relación con el empleado
      const turnos = await turnoRepo.find({
        relations: ["empleado"], // Asegura que incluya los datos del empleado
      });
      console.log("Turnos obtenidos con empleado:", turnos); // Diagnóstico
      res.status(200).json(turnos);
    } catch (error) {
      console.error("Error al obtener turnos:", error);
      res.status(500).json({ message: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const turnoRepo = AppDataSource.getRepository(TurnoSchema);
      // Incluye la relación con el empleado
      const turno = await turnoRepo.findOne({
        where: { turnoID: parseInt(req.params.id) },
        relations: ["empleado"], // Incluye los datos del empleado
      });
      if (!turno) {
        return res.status(404).json({ message: "Turno no encontrado" });
      }
      console.log("Turno obtenido con empleado:", turno); // Diagnóstico
      res.status(200).json(turno);
    } catch (error) {
      console.error("Error al obtener turno:", error);
      res.status(500).json({ message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const turnoRepo = AppDataSource.getRepository(TurnoSchema);
      const turno = await turnoRepo.findOne({
        where: { turnoID: parseInt(req.params.id) },
        relations: ["empleado"], // Incluye los datos del empleado
      });
      if (!turno) {
        return res.status(404).json({ message: "Turno no encontrado" });
      }
      turnoRepo.merge(turno, req.body);
      const result = await turnoRepo.save(turno);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error al actualizar turno:", error);
      res.status(500).json({ message: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const turnoRepo = AppDataSource.getRepository(TurnoSchema);
      const turno = await turnoRepo.findOne({
        where: { turnoID: parseInt(req.params.id) },
        relations: ["empleado"], // Incluye los datos del empleado para validaciones
      });
      if (!turno) {
        return res.status(404).json({ message: "Turno no encontrado" });
      }
      await turnoRepo.remove(turno);
      res.status(204).send();
    } catch (error) {
      console.error("Error al eliminar turno:", error);
      res.status(500).json({ message: error.message });
    }
  },
};

export default turnoController;