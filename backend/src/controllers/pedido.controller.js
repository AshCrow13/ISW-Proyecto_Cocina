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
            const pedido = await pedidoRepo.findOneBy({ pedidoID: parseInt(req.params.id) }); // Cambiado a findOneBy
            if (!pedido) {
                return res.status(404).json({ message: "Pedido no encontrado" });
            }
            pedidoRepo.merge(pedido, req.body);
            const result = await pedidoRepo.save(pedido);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            const pedidoRepo = AppDataSource.getRepository(PedidoSchema);
            const pedido = await pedidoRepo.findOneBy({ pedidoID: parseInt(req.params.id) }); // Cambiado a findOneBy
            if (!pedido) {
                return res.status(404).json({ message: "Pedido no encontrado" });
            }
            await pedidoRepo.remove(pedido);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};

export default pedidoController;