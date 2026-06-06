import * as orderService from '../services/order.service.js';
import { AppError } from '../middlewares/error.middleware.js';

// ROLE-BASED STATUS PERMISSIONS
const DELIVERER_ALLOWED = ['DISPATCHED', 'DELIVERED'];
const STAFF_ALLOWED = ['PAID', 'PREPARING', 'CANCELLED'];

// CREATE ORDER
export const createOrder = async (req, res, next) => {
  try {
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

// GET MY ORDERS
export const getMyOrders = async (req, res, next) => {
  try {
    const result = await orderService.getMyOrders(req.user.id, req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

// GET ALL ORDERS (ADMIN / CASHIER)
export const getAllOrders = async (req, res, next) => {
  try {
    const result = await orderService.getAllOrders(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

// UPDATE ORDER STATUS
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // CHECK ROLE PERMISSIONS
    if (req.user.role === 'DELIVERER' && !DELIVERER_ALLOWED.includes(status)) {
      throw new AppError(`Como repartidor, solo puedes actualizar a: ${DELIVERER_ALLOWED.join(', ')}.`, 403);
    }

    if (['ADMIN', 'CASHIER'].includes(req.user.role) && !STAFF_ALLOWED.includes(status)) {
      throw new AppError(`Tu rol operativo solo puede actualizar a: ${STAFF_ALLOWED.join(', ')}.`, 403);
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