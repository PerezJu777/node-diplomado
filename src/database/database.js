import { Sequelize } from 'sequelize';
import env from '../config/env.js';

export const sequelize = new Sequelize(
    env.db_database, //db name 
    env.db_user, //username
    env.db_password, //password
    {
        dialect: env.db_dialect,
        host: env.db_host,
        logging: console.log, //para ver las consultas SQL en consola   
        //logging: false,
    }
);