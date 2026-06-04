import { Router } from 'express';
import { verifyToken, checkRole } from '../middlewares/auth.middleware.js';
import {
  validate,
  createOrderSchema,
  updateOrderStatusSchema,
  orderQuerySchema,
} from '../validators/order.validator.js';
import * as orderController from '../controllers/order.controller.js';

const router = Router();

// Proteger todas las rutas de este módulo de forma global
router.use(verifyToken);

// Rutas de cliente
router.post('/', checkRole('CUSTOMER'), validate(createOrderSchema), orderController.createOrder);
router.get('/my-orders', checkRole('CUSTOMER'), validate(orderQuerySchema, 'query'), orderController.getMyOrders);

// Rutas de administración
router.get('/', checkRole('ADMIN', 'CASHIER'), validate(orderQuerySchema, 'query'), orderController.getAllOrders);
router.patch('/:id/status', checkRole('ADMIN', 'CASHIER', 'DELIVERER'), validate(updateOrderStatusSchema), orderController.updateOrderStatus);

export default router;