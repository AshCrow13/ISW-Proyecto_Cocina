"use strict";
import { EntitySchema } from "typeorm";

const RolEnum = {
    PENDIENTE: "Pendiente",
    COMPLETO: "Completo"
};

const PedidoSchema = new EntitySchema({
    name: "Pedido",
    tableName: "pedido",
    columns: {
        pedidoID: {
            type: "int",
            primary: true,
            generated: true,
        },
        fecha: {
            type: "date",
            nullable: true,
        },
        estado: {
            type: "enum",
            enum: Object.values(RolEnum),
            nullable: false,
            default: RolEnum.PENDIENTE, 
        },
        total: {
            type: "decimal",
            precision: 10,
            scale: 2,
            nullable: true,
        },
        clienteID: {
            type: "int",
            nullable: false,
        },
        platoID: {  
            type: "int",
            nullable: false,
        },
        empleadoID: { 
            type: "int",
            nullable: false,
        },            
        liberado: {
                type: "boolean",
                default: false, // Por defecto, los pedidos no están liberados
            },
    },
    relations: {
        cliente: {
            target: "Cliente",
            type: "many-to-one",
            joinColumn: { name: "clienteID" },
            onDelete: "SET NULL",
        },
        plato: {
            target: "Plato",
            type: "many-to-many",
            joinTable: true, 
            cascade: true,
            onDelete: "CASCADE",
        },
        empleado: {
            target: "Empleado",
            type: "many-to-one",
            joinColumn: { name: "empleadoID" }, 
            onDelete: "SET NULL", 
        },
    },
});

export default PedidoSchema;