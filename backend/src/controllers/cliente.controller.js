"use strict";
import { AppDataSource } from "../config/configDb.js"; 
import ClienteSchema from "../entity/Cliente.entity.js"; 

const clienteController = {
    create: async (req, res) => {
        try {
            const clienteRepo = AppDataSource.getRepository(ClienteSchema);
    
            // Verificar si ya existe un cliente con el mismo nombre
            const existingCliente = await clienteRepo.findOneBy({ nombre: req.body.nombre });
            if (existingCliente) {
                return res.status(400).json({ message: "El nombre del cliente ya está en uso." });
            }
    
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
    
            const cliente = await clienteRepo.findOneBy({ clienteID: parseInt(req.params.id) });
            if (!cliente) {
                return res.status(404).json({ message: "Cliente no encontrado" });
            }
    
            // Verificar si ya existe un cliente con el mismo nombre (excepto el actual)
            const existingCliente = await clienteRepo.findOneBy({ nombre: req.body.nombre });
            if (existingCliente && existingCliente.clienteID !== cliente.clienteID) {
                return res.status(400).json({ message: "El nombre del cliente ya está en uso." });
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
            console.log("Intentando eliminar cliente con ID:", req.params.id);
            const clienteRepo = AppDataSource.getRepository(ClienteSchema);
            
            const cliente = await clienteRepo.findOneBy({ clienteID: parseInt(req.params.id) });
            if (!cliente) {
                console.log("Cliente no encontrado");
                return res.status(404).json({ message: "Cliente no encontrado" });
            }
            
            console.log("Cliente encontrado:", cliente);
            await clienteRepo.remove(cliente);
            console.log("Cliente eliminado con éxito");
            res.status(204).send();
        } catch (error) {
            console.error("Error al eliminar el cliente:", error.message);
            res.status(500).json({ message: error.message });
        }
    },
};

export default clienteController;