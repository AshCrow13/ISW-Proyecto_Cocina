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
            res.status(500).json({ message: error.message });
        }
    },

    getAll: async (req, res) => {
        try {
            const turnoRepo = AppDataSource.getRepository(TurnoSchema);
            const turnos = await turnoRepo.find();
            res.status(200).json(turnos);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const turnoRepo = AppDataSource.getRepository(TurnoSchema);
            const turno = await turnoRepo.findOneBy({ turnoID: parseInt(req.params.id) }); // Cambiado a turnoID
            if (!turno) {
                return res.status(404).json({ message: "Turno no encontrado" });
            }
            res.status(200).json(turno);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const turnoRepo = AppDataSource.getRepository(TurnoSchema);
            const turno = await turnoRepo.findOneBy({ turnoID: parseInt(req.params.id) }); // Cambiado a turnoID
            if (!turno) {
                return res.status(404).json({ message: "Turno no encontrado" });
            }
            turnoRepo.merge(turno, req.body);
            const result = await turnoRepo.save(turno);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            const turnoRepo = AppDataSource.getRepository(TurnoSchema);
            const turno = await turnoRepo.findOneBy({ turnoID: parseInt(req.params.id) }); // Cambiado a turnoID
            if (!turno) {
                return res.status(404).json({ message: "Turno no encontrado" });
            }
            await turnoRepo.remove(turno);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};

export default turnoController;

