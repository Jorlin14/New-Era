import * as productService from '../services/product.service.js';

// GET ALL CATEGORIES
export const getAllCategories = async (req, res, next) => {
  try {
    const result = await productService.getAllCategories(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

// CREATE CATEGORY
export const createCategory = async (req, res, next) => {
  try {
    const category = await productService.createCategory(req.body);

    res.status(201).json({
      success: true,
      message: 'Categoría creada correctamente.',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE CATEGORY
export const updateCategory = async (req, res, next) => {
  try {
    const category = await productService.updateCategory(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Categoría actualizada correctamente.',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE CATEGORY
export const deleteCategory = async (req, res, next) => {
  try {
    const result = await productService.deleteCategory(req.params.id);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};