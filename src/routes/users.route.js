import { Router } from 'express';
import userController from '../controllers/user.controller.js';
import validate from '../validators/validate.js';
import { schema } from '../validators/user.validate.js';
import { authenticateToken } from '../middlewares/authenticate.middleware.js';
import { getUsersPagination } from '../controllers/user.controller.js';
import { validatePagination } from '../validators/user.paginacion.validate.js';

const router = Router();

// 1. Ruta específica para paginación (DEBE IR ANTES de las rutas con :id)
router.get('/list/pagination', validatePagination, getUsersPagination);

router
    .route('/')
    .get(userController.get)
    .post(validate(schema), userController.create);

router
    .route('/:id')
    .get(authenticateToken, userController.find)
    .put(authenticateToken, validate(schema), userController.update)
    .patch(authenticateToken, userController.activateInactivate)
    .delete(authenticateToken, userController.eliminar);

router.get('/:id/tasks', authenticateToken, userController.getTasks);

export default router;