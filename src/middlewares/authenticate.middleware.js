import jwt from 'jsonwebtoken';
import env from '../config/env.js';

export function authenticateToken(req, res, next) {
    // Obtener el token de la cabecera de autorización
    const authHeader = req.headers['authorization'];

    // Extraer el token del encabezado "Bearer
    const token = authHeader && authHeader.split(' ')[1];
    if (!token || token === 'null') return res.status(401).json({ message: 'Token no proporcionado.' });
    
    // Verificamos y decodificamos el token
    jwt.verify(token, env.jwt_secret, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token no válido o expirado.' });
        req.user = user;
        next();
    });
}   