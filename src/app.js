import express from 'express';
import morgan from 'morgan';
import usersRoutes from './routes/users.route.js'
import authRoutes from './routes/auth.route.js';
import taskRoutes from './routes/task.route.js';
import { authenticateToken } from './middlewares/authenticate.middleware.js';

const app = express();

// Middlewares
app.use(morgan('combined'));
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users/', usersRoutes);
app.use('/api/tasks/', authenticateToken, taskRoutes);
app.use('/api/login/', authRoutes);

app.get('/', (req, res) => {
    res.send('Bienvenido a la API del proyecto final del diplomado de Node.js');
});

export default app;
