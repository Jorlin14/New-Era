import Joi from 'joi';

export const createCategorySchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .trim()
    .required()
    .messages({
      'string.min': 'El nombre de la categoría debe tener al menos 2 caracteres.',
      'string.max': 'El nombre de la categoría no puede superar los 50 caracteres.',
      'any.required': 'El nombre de la categoría es obligatorio.',
    }),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .trim()
    .required()
    .messages({
      'string.min': 'El nombre de la categoría debe tener al menos 2 caracteres.',
      'string.max': 'El nombre de la categoría no puede superar los 50 caracteres.',
      'any.required': 'El nombre de la categoría es obligatorio.',
    }),
});

// Validador para query params
export const categoryQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

// Factory
export const validate = (schema, source = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[source], {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  });

  if (error) {
    const messages = error.details.map((d) => d.message);
    return res.status(400).json({
      success: false,
      message: 'Error de validación.',
      errors: messages,
    });
  }

  req[source] = value;
  next();
};