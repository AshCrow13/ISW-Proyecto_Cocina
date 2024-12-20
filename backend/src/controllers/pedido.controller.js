"use strict";
import { AppDataSource } from "../config/configDb.js"; 
import PedidoSchema from "../entity/Pedido.entity.js"; 

const pedidoController = {
    create: async (req, res) => {
        try {
            const pedidoRepo = AppDataSource.getRepository(PedidoSchema);
            const nuevoPedido = pedidoRepo.create(req.body);
            const result = await pedidoRepo.save(nuevoPedido);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getAll: async (req, res) => {
        try {
            const pedidoRepo = AppDataSource.getRepository(PedidoSchema);
            const pedidos = await pedidoRepo.find();
            console.log("Pedidos obtenidos:", pedidos); // Agregado para depurar
            res.status(200).json(pedidos);
        } catch (error) {
            console.error("Error al obtener pedidos:", error.message);
            res.status(500).json({ message: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const pedidoRepo = AppDataSource.getRepository(PedidoSchema);
            const pedido = await pedidoRepo.findOneBy({ pedidoID: parseInt(req.params.id) }); // Cambiado a findOneBy
            if (!pedido) {
                return res.status(404).json({ message: "Pedido no encontrado" });
            }
            res.status(200).json(pedido);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const pedidoRepo = AppDataSource.getRepository(PedidoSchema);
            const pedidoID = parseInt(req.params.id);
    
            if (isNaN(pedidoID)) {
                return res.status(400).json({ message: "ID inválido" });
            }
    
            const pedido = await pedidoRepo.findOne({
                where: { pedidoID },
                relations: ["platos"], // Incluye la relación de platos
            });
    
            if (!pedido) {
                return res.status(404).json({ message: "Pedido no encontrado" });
            }
    
            // Actualizar los datos básicos
            pedidoRepo.merge(pedido, req.body);
    
            // Actualizar los platos asociados
            if (req.body.platos && Array.isArray(req.body.platos)) {
                const platoRepo = AppDataSource.getRepository("Plato");
                const nuevosPlatos = await platoRepo.findByIds(req.body.platos);
                pedido.platos = nuevosPlatos;
            }
    
            const result = await pedidoRepo.save(pedido);
            res.status(200).json(result);
        } catch (error) {
            console.error("Error al actualizar el pedido:", error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },

    delete: async (req, res) => {
        try {
            const pedidoRepo = AppDataSource.getRepository(PedidoSchema);
            const pedidoID = parseInt(req.params.id);
    
            if (isNaN(pedidoID)) {
                return res.status(400).json({ message: "ID inválido" });
            }
    
            const pedido = await pedidoRepo.findOneBy({ pedidoID });
            if (!pedido) {
                return res.status(404).json({ message: "Pedido no encontrado" });
            }
    
            console.log("Eliminando pedido con ID:", pedidoID);
    
            // Verifica si hay restricciones de relaciones antes de eliminar
            await pedidoRepo.remove(pedido);
    
            res.status(204).send();
        } catch (error) {
            console.error("Error al eliminar el pedido:", error.message);
    
            // Manejo detallado de errores
            if (error.name === "QueryFailedError") {
                return res.status(400).json({ message: "Error de consulta: posiblemente restricciones de integridad referencial" });
            }
    
            res.status(500).json({ message: error.message });
        }
    },
};

export default pedidoController;