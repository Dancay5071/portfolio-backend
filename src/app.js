import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

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

export default app;
