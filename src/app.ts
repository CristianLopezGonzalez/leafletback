import express,{Express,Response,Request} from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes';
import markerRoutes from './routes/markerRoutes';
import userRoutes from './routes/userRoutes';

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/markers', markerRoutes);

// Ruta de test para verificar que el backend funciona
app.get('/api/test', (_req: Request, res: Response) => {
  res.json({ message: 'Backend funcionando' });
});


// Manejo de rutas no encontradas
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware de manejo de errores global
import { config } from './config/config';
app.use((err: any, _req: Request, res: Response, _next: any) => {

  const status = err.status || 500;
  const isDev = config.NODE_ENV === 'development';

  if (isDev) {
    res.status(status).json({
      error: err.message || 'Error interno del servidor',
      stack: err.stack
    });
  } else {
    res.status(status).json({
      error: 'Error interno del servidor'
    });
  }
  
});

export default app;