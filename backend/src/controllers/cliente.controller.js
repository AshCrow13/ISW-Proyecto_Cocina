"use strict";
import { AppDataSource } from "../config/configDb.js"; 
import ClienteSchema from "../entity/Cliente.entity.js"; 

const clienteController = {
    create: async (req, res) => {
        try {
            const clienteRepo = AppDataSource.getRepository(ClienteSchema);
            const nuevoCliente = clienteRepo.create(req.body);
            const result = await clienteRepo.save(nuevoCliente);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getAll: async (req, res) => {
        try {
            const clienteRepo = AppDataSource.getRepository(ClienteSchema);
            const clientes = await clienteRepo.find();
            res.status(200).json(clientes);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const clienteRepo = AppDataSource.getRepository(ClienteSchema);
            const cliente = await clienteRepo.findOneBy({ clienteID: parseInt(req.params.id) }); // Cambiado a clienteID
            if (!cliente) {
                return res.status(404).json({ message: "Cliente no encontrado" });
            }
            res.status(200).json(cliente);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const clienteRepo = AppDataSource.getRepository(ClienteSchema);
            const cliente = await clienteRepo.findOneBy({ clienteID: parseInt(req.params.id) }); // Cambiado a clienteID
            if (!cliente) {
                return res.status(404).json({ message: "Cliente no encontrado" });
            }
            clienteRepo.merge(cliente, req.body);
            const result = await clienteRepo.save(cliente);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    

    delete: async (req, res) => {
        try {
            const clienteRepo = AppDataSource.getRepository(ClienteSchema);
            const cliente = await clienteRepo.findOneBy({ clienteID: parseInt(req.params.id) }); // Cambiado a clienteID
            if (!cliente) {
                return res.status(404).json({ message: "Cliente no encontrado" });
            }
            await clienteRepo.remove(cliente);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};

export default clienteController;
