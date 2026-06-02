import prisma from '../config/database.js';
import { AppError } from '../middlewares/error.middleware.js';

// Serialize Decimal
const serializeProduct = (product) => ({
  ...product,
  price: parseFloat(product.price),
});


// Categories
export const getAllCategories = async ({ page, limit }) => {
  const skip = (page - 1) * limit;

// Promise.all: ejecutar ambas queries en paralelo
  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      skip,
      take: limit,
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: { where: { isActive: true } } },
        },
      },
    }),
    prisma.category.count(),
  ]);

  return {
    data: categories,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const createCategory = async ({ name }) => {
  const category = await prisma.category.create({
    data: { name },
  });
  return category;
};
// Update Category
export const updateCategory = async (id, { name }) => {
  await findCategoryOrFail(id);

  const updated = await prisma.category.update({
    where: { id },
    data: { name },
  });
  return updated;
};

// Delete Category
export const deleteCategory = async (id) => {
  await findCategoryOrFail(id);

  const productCount = await prisma.product.count({
    where: { categoryId: id },
  });

  if (productCount > 0) {
    throw new AppError(
      `No se puede eliminar: la categoría tiene ${productCount} producto(s) asociado(s). Reasignalos primero.`,
      409
    );
  }

  await prisma.category.delete({ where: { id } });
  return { message: 'Categoría eliminada correctamente.' };
};

// Find Category or Fail
const findCategoryOrFail = async (id) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw new AppError('Categoría no encontrada.', 404);
  return category;
};

// Products

export const getAllProducts = async ({ search, categoryId, onlyActive, page, limit, sortBy, order }) => {

  // Dynamic Where
  const where = {
    ...(onlyActive && { isActive: true }),
    ...(search && {
      name: {
        contains: search,
        mode: 'insensitive',
      },
    }),

    ...(categoryId && { categoryId }),
  };

  // large datasets (> 100k registros): usar cursor-based pagination.
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: order },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    data: products.map(serializeProduct),
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: { select: { id: true, name: true } },
    },
  });

  if (!product) throw new AppError('Producto no encontrado.', 404);

  return serializeProduct(product);
};

export const createProduct = async (data) => {
  await findCategoryOrFail(data.categoryId);

  const product = await prisma.product.create({
    data,
    include: {
      category: { select: { id: true, name: true } },
    },
  });

  return serializeProduct(product);
};

export const updateProduct = async (id, data) => {
  await findProductOrFail(id);

  if (data.categoryId) {
    await findCategoryOrFail(data.categoryId);
  }

  const updated = await prisma.product.update({
    where: { id },
    data,
    include: {
      category: { select: { id: true, name: true } },
    },
  });

  return serializeProduct(updated);
};

export const deleteProduct = async (id) => {
  await findProductOrFail(id);

  const deactivated = await prisma.product.update({
    where: { id },
    data: { isActive: false },
    select: { id: true, name: true, isActive: true },
  });

  return {
    message: 'Producto desactivado correctamente.',
    product: deactivated,
  };
};

// Find Product or Fail
const findProductOrFail = async (id) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new AppError('Producto no encontrado.', 404);
  return product;
};