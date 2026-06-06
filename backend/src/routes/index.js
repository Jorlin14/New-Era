import { Router } from 'express';
import authRoutes from './auth.routes.js';
import categoryRoutes from './category.routes.js';
import productRoutes from './product.routes.js';
import orderRoutes from './order.routes.js';
import addressRoutes from './address.routes.js';

const router = Router();

// HEALTH CHECK
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API funcionando correctamente.',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// MOUNT ROUTES
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/addresses', addressRoutes);

export default router;
