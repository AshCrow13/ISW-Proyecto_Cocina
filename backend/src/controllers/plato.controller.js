"use strict";
import { AppDataSource } from "../config/configDb.js"; 
import PlatoSchema from "../entity/Plato.entity.js"; 
import IngredienteSchema from "../entity/Ingrediente.entity.js";
import PlatoIngredienteSchema from "../entity/ingredientes_plato.entity.js";

const platoController = {
    create: async (req, res) => {
        try {
          const platoRepo = AppDataSource.getRepository(PlatoSchema);
          const ingredienteRepo = AppDataSource.getRepository(IngredienteSchema);
    
          console.log("Datos en req.body:", req.body);
    
          // Obtener datos del cuerpo de la solicitud
          const data = req.body;
    
          // Validar datos obligatorios
          if (!data.nombre || !data.descripcion || !data.precio || data.disponibilidad === undefined) {
            return res.status(400).json({ message: "Todos los campos son obligatorios." });
          }
    
          // Validar que haya al menos un ingrediente seleccionado
          if (!data.ingredienteID || data.ingredienteID.length === 0) {
            return res.status(400).json({ message: "Debes seleccionar al menos un ingrediente." });
          }
        
          // Crear el nuevo plato con los ingredientes relacionados
          const nuevoPlato = await platoRepo.save({
            nombre: data.nombre,
            descripcion: data.descripcion,
            precio: data.precio,
            disponibilidad: data.disponibilidad
          });
          console.log("Plato creado:", nuevoPlato);

          data.ingredienteID.forEach(async (ingredienteID) => {
            const ingrediente = await ingredienteRepo.findOne({ 
                where: { 
                    ingredienteID: ingredienteID.ingredienteID
                 } });
             
            
            if (!ingrediente) {
                console.error("El ingrediente no existe:", error);
                res.status(500).json({ message: error.message });
            }
            console.log("Ingrediente encontrado:", ingrediente);

            const platoIngredienteRepo = AppDataSource.getRepository(PlatoIngredienteSchema);
            let platoIngrediente = await platoIngredienteRepo.save({
                platoID: nuevoPlato.platoID,
                ingredienteID: ingrediente.ingredienteID
            });
            console.log("PlatoIngrediente creado:", platoIngrediente);
          });
            
          res.status(201).json(nuevoPlato);
        } catch (error) {
          console.error("Error al crear el plato:", error);
          res.status(500).json({ message: error.message });
        }
      },

    getAll: async (req, res) => {
        try {
            const platoRepo = AppDataSource.getRepository(PlatoSchema);
            const platoIngredienteRepo = AppDataSource.getRepository(PlatoIngredienteSchema);
            const ingredienteRepo = AppDataSource.getRepository(IngredienteSchema);
            const response = [];
            const platos = await platoRepo.find();
            for(const plato of platos) {
                
                const ingredientes = await platoIngredienteRepo.find({ where: { platoID: plato.platoID } });
                let ingredientesData = [];
                for(const ingrediente of ingredientes) {
                    const ingredienteData = await ingredienteRepo.findOne({ 
                        where: { ingredienteID: ingrediente.ingredienteID }, select: { nombre: true } });
                    ingredientesData.push({
                        ingredienteID: ingrediente.ingredienteID,
                        nombre: ingredienteData.nombre
                    });
                }
                
                response.push({
                    platoID: plato.platoID,
                    nombre: plato.nombre,
                    descripcion: plato.descripcion,
                    precio: plato.precio,
                    disponibilidad: plato.disponibilidad,
                    ingredienteID: ingredientesData
                 });
            };
            res.status(200).json(response);
        } catch (error) {
            console.error("Error en getAll:", error.message);
            res.status(500).json({ message: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const platoRepo = AppDataSource.getRepository(PlatoSchema);
            const plato = await platoRepo.findOneBy({ platoID: parseInt(req.params.id) }); // Cambiado a platoID
            if (!plato) {
                return res.status(404).json({ message: "Plato no encontrado" });
            }
            res.status(200).json(plato);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const platoRepo = AppDataSource.getRepository(PlatoSchema);
    
            // Buscar el plato por ID
            console.log(req.params.id);
            const plato = await platoRepo.findOne({
                where: { platoID: parseInt(req.params.id) },
            });
    
            if (!plato) {
                return res.status(404).json({ message: "Plato no encontrado" });
            }
    
            console.log(req.body);
    
            // Actualizar manualmente los campos
            const { nombre, descripcion, precio, disponibilidad, ingredienteID } = req.body;
    
            if (nombre !== undefined) plato.nombre = nombre;
            if (descripcion !== undefined) plato.descripcion = descripcion;
            if (precio !== undefined) plato.precio = precio;
            if (disponibilidad !== undefined) plato.disponibilidad = disponibilidad;
            if (ingredienteID !== undefined) {
                const platoIngredienteRepo = AppDataSource.getRepository(PlatoIngredienteSchema);
            
                // Eliminar relaciones existentes
                await platoIngredienteRepo.delete({ platoID: plato.platoID });
            
                // Insertar nuevas relaciones
                for (const id of ingredienteID) {
                    await platoIngredienteRepo.save({
                        platoID: plato.platoID,
                        ingredienteID: id,
                    });
                }
            }
    
            // Guardar el plato actualizado
            const result = await platoRepo.save(plato);
    
            res.status(200).json(result);
        } catch (error) {
            console.error("Error al actualizar plato:", error);
            res.status(500).json({ message: error.message });
        }
    },
    

    delete: async (req, res) => {
        try {
            const platoRepo = AppDataSource.getRepository(PlatoSchema);
            const plato = await platoRepo.findOneBy({ platoID: parseInt(req.params.id) }); // Cambiado a platoID
            if (!plato) {
                return res.status(404).json({ message: "Plato no encontrado" });
            }
            await platoRepo.remove(plato);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};

export default platoController;