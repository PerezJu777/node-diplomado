import Joi from 'joi';

export const validatePagination = (req, res, next) => {
    const schema = Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().valid(5, 10, 15, 20).default(10),
        search: Joi.string().allow('').default(''),
        orderBy: Joi.string().valid('id', 'username', 'status').default('id'),
        orderDir: Joi.string().valid('ASC', 'DESC', 'asc', 'desc').uppercase().default('DESC')
    });

    const { error, value } = schema.validate(req.query, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Error de validación en los parámetros de paginación',
            errors: error.details.map(detail => detail.message)
        });
    }

    // Transferimos los valores validados a req.query uno por uno
    Object.assign(req.query, value); 
    
    next();
};
