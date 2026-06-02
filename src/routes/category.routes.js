import { Router } from 'express';
import { verifyToken, checkRole } from '../middlewares/auth.middleware.js';
import { validate, createCategorySchema, updateCategorySchema, categoryQuerySchema } from '../validators/category.validator.js';
import * as categoryController from '../controllers/category.controller.js';

const router = Router();

// Public Routes

// GET /api/categories?page=1&limit=10
router.get(
  '/',
  validate(categoryQuerySchema, 'query'),
  categoryController.getAllCategories
);

// Routes protegidas - ADMIN

// POST /api/categories
router.post(
  '/',
  verifyToken,
  checkRole('ADMIN'),
  validate(createCategorySchema),
  categoryController.createCategory
);

// PATCH /api/categories/:id
router.patch(
  '/:id',
  verifyToken,
  checkRole('ADMIN'),
  validate(updateCategorySchema),
  categoryController.updateCategory
);

// DELETE /api/categories/:id
router.delete(
  '/:id',
  verifyToken,
  checkRole('ADMIN'),
  categoryController.deleteCategory
);

export default router;