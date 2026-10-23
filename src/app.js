import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import projectsRoutes from './routes/projectsRoutes.js';
import experienceRoutes from './routes/experienceRoutes.js';
import educationRoutes from './routes/educationRoutes.js';
import perfilRoutes from './routes/perfilRoutes.js';

const app = express();

// Middlewares globales de seguridad y formato
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Ruta de prueba para verificar que el backend responde
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend del Portfolio funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Ruta de Proyectos
app.use('/api/projects', projectsRoutes);
// Ruta de Experiencia
app.use('/api/experience', experienceRoutes);
// Ruta de Educación
app.use('/api/education', educationRoutes);
//Ruta de Perfil

app.use('/api/perfil', perfilRoutes);
export default app;
