import * as productService from '../services/product.service.js';

// Category Controller
export const getAllCategories = async (req, res, next) => {
  try {
    const result = await productService.getAllCategories(req.query);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const category = await productService.createCategory(req.body);

    res.status(201).json({
      success: true,
      message: 'Categoría creada correctamente.',
      data: category,
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'Ya existe una categoría con ese nombre.',
      });
    }
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await productService.updateCategory(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Categoría actualizada correctamente.',
      data: category,
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'Ya existe una categoría con ese nombre.',
      });
    }
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const result = await productService.deleteCategory(req.params.id);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};