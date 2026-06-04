import * as orderService from '../services/order.service.js';
import { AppError } from '../middlewares/error.middleware.js';

// POST /api/orders
export const createOrder = async (req, res, next) => {
  try {
    // Tomamos el id del token (req.user.id) para evitar suplantación
    const result = await orderService.createOrder(req.user.id, req.body);

    res.status(201).json({
      success: true,
      message: '¡Pedido creado exitosamente!',
      data: result.order,
      summary: result.summary,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/my-orders
export const getMyOrders = async (req, res, next) => {
  try {
    const result = await orderService.getMyOrders(req.user.id, req.query);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders (ADMIN y CASHIER)
export const getAllOrders = async (req, res, next) => {
  try {
    const result = await orderService.getAllOrders(req.query);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/orders/:id/status
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const DELIVERER_ALLOWED_STATUSES = ['DISPATCHED', 'DELIVERED'];
    const STAFF_ALLOWED_STATUSES     = ['PAID', 'PREPARING', 'CANCELLED'];

    // Control de transiciones por rol usando AppError
    if (req.user.role === 'DELIVERER' && !DELIVERER_ALLOWED_STATUSES.includes(status)) {
      throw new AppError(`Como repartidor, solo puedes actualizar a: ${DELIVERER_ALLOWED_STATUSES.join(', ')}.`, 403);
    }

    if (['ADMIN', 'CASHIER'].includes(req.user.role) && !STAFF_ALLOWED_STATUSES.includes(status)) {
      throw new AppError(`Tu rol operativo solo puede actualizar a: ${STAFF_ALLOWED_STATUSES.join(', ')}.`, 403);
    }

    const updatedOrder = await orderService.updateOrderStatus(id, status, req.user.id);

    res.status(200).json({
      success: true,
      message: `Estado de la orden actualizado a ${status}.`,
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};