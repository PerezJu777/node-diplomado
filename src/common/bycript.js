import bcrypt from 'bcrypt';
import env from '../config/env.js';
import logger from '../logs/logger.js';
export const encriptar = async (texto) => {
    try {
        const saltRounds = env.bcrypt_salt_rounds;
        return await bcrypt.hash(texto, saltRounds);
    } catch (error) {
        logger.error(error);
        throw new Error('Error al encriptar el texto: ' + error.message);
    }
};

export const comparar = async (texto, hash) => {
    try {
        return await bcrypt.compare(texto, hash);
    } catch (error) {
        logger.error(error);
        throw new Error('Error al comparar el texto con el hash: ' + error.message);
    }
};