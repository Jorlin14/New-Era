// src/routes/index.js
// Router principal: centraliza y organiza todas las rutas de la API.
// server.js solo necesita importar este archivo y montarlo en '/api'.

import { Router } from 'express';
import authRoutes from './auth.routes.js';
// Semana 2: descomenta cuando crees estos módulos:
// import productRoutes from './product.routes.js';
// import orderRoutes   from './order.routes.js';
// import userRoutes    from './user.routes.js';

const router = Router();

// Endpoint de salud: GET /api/health
// Permite verificar que el servidor está corriendo sin autenticación.
// Útil para herramientas de monitoreo y para el evaluador al probar la API.
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API funcionando correctamente.',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Montar sub-routers por módulo.
// Las URLs finales serán: /api/auth/login, /api/auth/register, etc.
router.use('/auth', authRoutes);
// router.use('/products', productRoutes);
// router.use('/orders',   orderRoutes);
// router.use('/users',    userRoutes);

export default router;