"use strict";
import { EntitySchema } from "typeorm";

const IngredienteSchema = new EntitySchema({
    name: "Ingrediente",
    tableName: "ingrediente",
    columns: {
        ingredienteID: {
            type: "int",
            primary: true,
            generated: true,
        },
        nombre: {
            type: "varchar",
            length: 100,
            nullable: false,
        },
        cantidad: {
            type: "int",
            nullable: false,
        },
        porcion: {
            type: "int",
            nullable: false,
        },
        inventarioID: {
            type: "int",
            nullable: true, 
        },
    },
    relations: {
        inventario: {
            target: "Inventario",  
            type: "many-to-one",  
            joinColumn: { name: "inventarioID" },  
            onDelete: "SET NULL",  
          },
    },
});

export default IngredienteSchema;
