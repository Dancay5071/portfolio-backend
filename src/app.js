import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import projectsRoutes from './routes/projectsRoutes.js';
import experienceRoutes from './routes/experienceRoutes.js';
import educationRoutes from './routes/educationRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import visitsRoutes from './routes/visitsRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

app.set('trust proxy', 1);

// Middlewares globales de seguridad y formato
app.use(helmet());

// CORS Configurado de forma segura
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://localhost:3000',
  'https://portfolio-danic5071.vercel.app',
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map(url => url.trim()) : [])
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(morgan('dev'));

// Ruta de health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend del Portfolio funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Rutas de la API
app.use('/api/projects', projectsRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/visits', visitsRoutes);
app.use('/api/auth', authRoutes);

// Manejador de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta ${req.originalUrl} no encontrada en este servidor.`
  });
});

// Middleware global para atrapar errores no controlados (500)
app.use((err, req, res, next) => {
  console.error('⚠️ Error interno capturado en Express:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor.'
  });
});

export default app;
