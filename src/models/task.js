import { DataTypes } from "sequelize";
import { Status } from "../constants/index.js";
import { sequelize } from "../database/database.js";

export const Task = sequelize.define('tasks', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Ingrese el nombre de la tarea'
            },
            notEmpty: {
                msg: 'El nombre de la tarea no puede estar vacío'
            },
        },
    },
    done: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },

});