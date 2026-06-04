import Joi from 'joi';

// ─────────────────────────────────────────────
// SCHEMA: Crear orden
//
// El frontend envía:
// {
//   addressId: "uuid",          ← dirección guardada del usuario
//   distance:  4.2,             ← km calculados por el frontend (Google Maps, etc.)
//   items: [
//     { productId: "uuid", quantity: 2 },
//     { productId: "uuid", quantity: 1 },
//   ]
// }
//
// El backend calcula todo lo demás: precios, subtotal, envío, total.
// NUNCA confiamos en precios enviados desde el cliente.
// ─────────────────────────────────────────────
export const createOrderSchema = Joi.object({

  addressId: Joi.string()
    .uuid({ version: 'uuidv4' })
    .required()
    .messages({
      'string.uuid': 'El ID de dirección debe ser un UUID válido.',
      'any.required': 'La dirección de entrega es obligatoria.',
    }),

  // distance: número con hasta 2 decimales, máximo 15 km.
  // La validación de negocio del límite 15 km la hacemos también
  // en el servicio para tener el mensaje de error en contexto,
  // pero la cota máxima aquí actúa como primera línea de defensa.
  distance: Joi.number()
    .positive()
    .max(15)
    .precision(2)
    .required()
    .messages({
      'number.base': 'La distancia debe ser un número.',
      'number.positive': 'La distancia debe ser mayor a 0.',
      'number.max': 'Lo sentimos, estás fuera de nuestra zona de cobertura (máximo 15 km).',
      'any.required': 'La distancia de entrega es obligatoria.',
    }),

  // items: array no vacío, cada elemento con productId y quantity
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string()
          .uuid({ version: 'uuidv4' })
          .required()
          .messages({
            'string.uuid': 'Cada productId debe ser un UUID válido.',
            'any.required': 'El productId es obligatorio en cada ítem.',
          }),

        quantity: Joi.number()
          .integer()
          .min(1)
          .max(99) // límite razonable por ítem en un supermercado
          .required()
          .messages({
            'number.base': 'La cantidad debe ser un número.',
            'number.integer': 'La cantidad debe ser un número entero.',
            'number.min': 'La cantidad mínima por producto es 1.',
            'number.max': 'La cantidad máxima por producto es 99.',
            'any.required': 'La cantidad es obligatoria en cada ítem.',
          }),
      })
    )
    .min(1)
    .max(50) // máximo 50 líneas distintas por orden
    .unique('productId') // Joi rechaza si el mismo productId se repite
    .required()
    .messages({
      'array.min': 'La orden debe tener al menos un producto.',
      'array.max': 'La orden no puede tener más de 50 ítems distintos.',
      'array.unique': 'Hay productos duplicados en la orden. Ajustá la cantidad en un solo ítem.',
      'any.required': 'Los ítems de la orden son obligatorios.',
    }),
});

// ─────────────────────────────────────────────
// SCHEMA: Actualizar estado de la orden (ADMIN / DELIVERER)
//
// Solo se puede avanzar el estado, nunca retroceder.
// La lógica de transiciones válidas vive en el servicio.
// Aquí solo validamos que el valor sea uno del enum.
// ─────────────────────────────────────────────
export const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid('PENDING', 'PAID', 'PREPARING', 'DISPATCHED', 'DELIVERED', 'CANCELLED')
    .required()
    .messages({
      'any.only': 'Estado inválido. Los estados válidos son: PENDING, PAID, PREPARING, DISPATCHED, DELIVERED, CANCELLED.',
      'any.required': 'El estado es obligatorio.',
    }),
});

// ─────────────────────────────────────────────
// SCHEMA: Query params para listar órdenes
// ─────────────────────────────────────────────
export const orderQuerySchema = Joi.object({
  status: Joi.string()
    .valid('PENDING', 'PAID', 'PREPARING', 'DISPATCHED', 'DELIVERED', 'CANCELLED')
    .optional(),

  page:  Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
});

// ─────────────────────────────────────────────
// Factory validate (misma firma que en los otros módulos)
// ─────────────────────────────────────────────
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