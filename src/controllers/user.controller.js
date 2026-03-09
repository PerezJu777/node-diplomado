import { User } from "../models/user.js";
import { Task } from "../models/task.js";
import logger from "../logs/logger.js";
import { Status } from "../constants/index.js";
import { encriptar } from "../common/bycript.js";
//import { validatePagination } from "../validators/user.paginacion.validate.js";
import { Op } from "sequelize";

async function create(req, res) {
  const { username, password } = req.body;
  try {
    const newUser = await User.create({ 
      username, 
      password 
    });
    console.log(newUser);
    // res.status(201).json(newUser);
    return res.json(newUser);
  } catch (error) {
    logger.error(error);
    return res.json(error.message);
  }
} 

async function get(_req, res) {
  try {
    const users = await User.findAndCountAll({
      attributes: ['id', 'username', 'status'],
      order: [['id', 'DESC']],
      where: {
        status: Status.ACTIVE
      },
      //include: Task,
    });
    return res.json({
      total: users.count,
      data: users.rows
    });
  } catch (error) {
    logger.error(error);
    return res.json(error.message);
  }
}

async function find(req, res) {
  const { id } = req.params;
  try {
    const user = await User.findOne({
      attributes: ['username', 'status'],
      where: { 
        id 
      },
      //include: Task,
    });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    return res.json(user);
  } catch (error) {
    logger.error(error);
    return res.json(error.message);
  }
}

const update = async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;
  const passwordHash = await encriptar(password);
  try {
    const user = await User.update(
      { 
        username, 
        password: passwordHash
      }, 
      { where: { id } });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    return res.json(user);
  } catch (error) {
    logger.error(error);
    return res.json(error.message);
  }
}

const activateInactivate = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) return res.status(400).json({ message: 'No existe el estado' });
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'No existe el usuario' });
    if (user.status === status) {
      return res
        .status(400)
        .json({ message: `El usuario ya se encuentra en estado ${status}` });
    } 
    user.status = status;
    await user.save(); 
    return res.json(user);
  } catch (error) {
    logger.error(error);
    return res.json(error.message);
  }
}

const eliminar = async (req, res) => {
  const { id } = req.params;
  
  try {
    await Task.destroy({ 
      where: { 
        userId: id, 
      },
    });
    await User.destroy({ 
      where: { 
        id 
      } 
    });
    return res.sendStatus(204);
    
  } catch (error) {
    logger.error(error);
    return res.json(error.message);
  }
}

const getTasks = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ 
      attributes: [ 'username' ],
      include: [
        {
          model: Task,
          attributes: ['name', 'done'],
        /*  where: {
            done: false,
          }, */
          // required: false, // Permite incluir usuarios sin tareas
        }
      ],
      where: { 
        id 
      } 
    });
    if (!user) return res.status(404).json({ message: 'El usuario no tiene tareas pendientes' });
    return res.json(user);
  } catch (error) {
    logger.error(error);
    return res.json(error.message);
  }
}

export const getUsersPagination = async (req, res) => {
    try {
        // Los datos ya vienen limpios gracias al middleware
        const { page, limit, search, orderBy, orderDir } = req.query;
        const offset = (page - 1) * limit;

        const { count, rows } = await User.findAndCountAll({
            where: search ? { username: { [Op.iLike]: `%${search}%` } } : {},
            attributes: ['id', 'username', 'status'],
            order: [[orderBy, orderDir]],
            limit: limit,
            offset: offset
        });

        res.json({
            total: count,
            page: page,
            pages: Math.ceil(count / limit),
            data: rows
        });
    } catch (err) {
        res.status(500).json({ message: 'Error interno al obtener la paginación' });
    }
};

/*
export const getUsersPagination = async (req, res) => {
    try {
        // VALIDACIÓN CON JOI
        const { error, value } = paginationSchema.validate(req.query, { abortEarly: false });

        if (error) {
            return res.status(400).json({
                message: 'Parámetros de consulta inválidos',
                errors: error.details.map(d => d.message)
            });
        }

        // Usamos 'value' que ya contiene los datos validados y con valores por defecto
        const { page, limit, search, orderBy, orderDir } = value;
        const offset = (page - 1) * limit;

        const { count, rows } = await User.findAndCountAll({
            where: search ? { username: { [Op.iLike]: `%${search}%` } } : {},
            attributes: ['id', 'username', 'status'],
            order: [[orderBy, orderDir]],
            limit: limit,
            offset: offset
        });

        res.json({
            total: count,
            page: page,
            pages: Math.ceil(count / limit),
            data: rows
        });

    } catch (err) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
*/

export default {
    create,
    get,
    find,
    update,
    activateInactivate,
    eliminar,
    getTasks,
}