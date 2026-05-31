import { Router } from 'express';
import authRoutes from './auth.routes.js';

const router = Router();

// ─────────────────────────────────────────────
// ENRUTADOR PRINCIPAL
// Centraliza todos los submódulos de la API
// ─────────────────────────────────────────────

// Health check para monitoreo y balanceadores de carga
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API funcionando correctamente.',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Montaje de rutas
router.use('/auth', authRoutes);

// Futuros módulos:
// router.use('/products', productRoutes);
// router.use('/orders', orderRoutes);

export default router;