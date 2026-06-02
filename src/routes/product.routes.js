import { Router } from 'express';
import { verifyToken, checkRole } from '../middlewares/auth.middleware.js';
import {
  validate,
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
} from '../validators/product.validator.js';
import * as productController from '../controllers/product.controller.js';

const router = Router();

// Public Routes

// GET /api/products?search=leche&categoryId=uuid&page=1&limit=12
router.get(
  '/',
  validate(productQuerySchema, 'query'),
  productController.getAllProducts
);

// GET /api/products/:id
router.get('/:id', productController.getProductById);

// Routes protegidas - ADMIN

// POST /api/products
router.post(
  '/',
  verifyToken,
  checkRole('ADMIN'),
  validate(createProductSchema),
  productController.createProduct
);

// PATCH /api/products/:id
router.patch(
  '/:id',
  verifyToken,
  checkRole('ADMIN'),
  validate(updateProductSchema),
  productController.updateProduct
);

// DELETE /api/products/:id  →  soft delete (isActive: false)
router.delete(
  '/:id',
  verifyToken,
  checkRole('ADMIN'),
  productController.deleteProduct
);

export default router;