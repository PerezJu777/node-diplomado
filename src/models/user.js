import { DataTypes } from "sequelize";
import { Status } from "../constants/index.js";
import { sequelize } from "../database/database.js";
import { Task } from "./task.js";
import { encriptar } from "../common/bycript.js";

export const User = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Ingrese el nombre de usuario'
            },
            notEmpty: {
                msg: 'El nombre de usuario no puede estar vacío'
            },
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Ingrese la contraseña'
            },
            notEmpty: {
                msg: 'La contraseña no puede estar vacía'
            },
        },
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: Status.ACTIVE,
        validate: {
            isIn: {
                args: [[Status.ACTIVE, Status.INACTIVE]],
                msg: `El estado debe ser ${Status.ACTIVE} o ${Status.INACTIVE}`,
            }
        },
    },

});


User.hasMany(Task);
Task.belongsTo(User);


/*
User.hasMany(Task, { 
    foreignKey: 'user_id', // Nombre de la clave foránea en la tabla Task
    sourceKey: 'id', // Nombre de la clave primaria en la tabla User
    // onDelete: 'CASCADE', // Eliminar tareas asociadas si se elimina un usuario
    // onUpdate: 'CASCADE', // Actualizar tareas asociadas si se actualiza el ID del usuario   
});

Task.belongsTo(User, {
    foreignKey: 'user_id', // Nombre de la clave foránea en la tabla Task
    targetKey: 'id', // Nombre de la clave primaria en la tabla User
    // onDelete: 'CASCADE', // Eliminar tareas asociadas si se elimina un usuario
    // onUpdate: 'CASCADE', // Actualizar tareas asociadas si se actualiza el ID del usuario
});
*/

User.beforeCreate(async (user) => {
    user.password = await encriptar(user.password);
});

/*
User.beforeUpdate(async (user) => {
    user.password = await encriptar(user.password);
});
*/