import Joi from 'joi';

// ─────────────────────────────────────────────
// SCHEMA BASE: campos comunes a crear y actualizar.
// Lo definimos como objeto plano para poder reutilizarlo
// en ambos schemas sin duplicar las reglas de cada campo.
// ─────────────────────────────────────────────
const addressFields = {

  // Etiqueta semántica que el usuario le da a su dirección.
  // Ejemplos: "Casa", "Trabajo", "Casa de mamá".
  label: Joi.string()
    .min(2)
    .max(50)
    .trim()
    .messages({
      'string.min': 'La etiqueta debe tener al menos 2 caracteres.',
      'string.max': 'La etiqueta no puede superar los 50 caracteres.',
    }),

  // Calle y número. No validamos formato estricto porque los
  // formatos de dirección varían mucho por ciudad/país.
  address: Joi.string()
    .min(5)
    .max(200)
    .trim()
    .messages({
      'string.min': 'La dirección debe tener al menos 5 caracteres.',
      'string.max': 'La dirección no puede superar los 200 caracteres.',
    }),

  city: Joi.string()
    .min(2)
    .max(100)
    .trim()
    .messages({
      'string.min': 'La ciudad debe tener al menos 2 caracteres.',
      'string.max': 'La ciudad no puede superar los 100 caracteres.',
    }),

  // Coordenadas opcionales para integración con mapas en el frontend.
  // Los rangos de latitud y longitud son los límites geográficos absolutos.
  latitude: Joi.number()
    .min(-90)
    .max(90)
    .optional()
    .messages({
      'number.min': 'La latitud debe estar entre -90 y 90.',
      'number.max': 'La latitud debe estar entre -90 y 90.',
    }),

  longitude: Joi.number()
    .min(-180)
    .max(180)
    .optional()
    .messages({
      'number.min': 'La longitud debe estar entre -180 y 180.',
      'number.max': 'La longitud debe estar entre -180 y 180.',
    }),

  // Si el usuario marca esta dirección como su favorita/predeterminada.
  isDefault: Joi.boolean().optional(),
};

// ─────────────────────────────────────────────
// SCHEMA: Crear dirección (POST)
// Todos los campos estructurales son requeridos.
// Las coordenadas y isDefault son opcionales.
// ─────────────────────────────────────────────
export const createAddressSchema = Joi.object({
  label:     addressFields.label.required().messages({
    ...addressFields.label.describe().rules, // hereda los mensajes base
    'any.required': 'La etiqueta es obligatoria (ej: "Casa", "Trabajo").',
  }),
  address:   addressFields.address.required().messages({
    'any.required': 'La dirección es obligatoria.',
  }),
  city:      addressFields.city.required().messages({
    'any.required': 'La ciudad es obligatoria.',
  }),
  latitude:  addressFields.latitude,
  longitude: addressFields.longitude,
  isDefault: addressFields.isDefault,
})
  // Regla de consistencia: si viene latitud, debe venir longitud y viceversa.
  // No tiene sentido guardar una coordenada incompleta.
  .and('latitude', 'longitude')
  .messages({
    'object.and': 'Si enviás coordenadas, debés enviar tanto latitud como longitud.',
  });

// ─────────────────────────────────────────────
// SCHEMA: Actualizar dirección (PATCH)
// Todos los campos son opcionales (partial update),
// pero al menos uno debe estar presente.
// ─────────────────────────────────────────────
export const updateAddressSchema = Joi.object({
  label:     addressFields.label,
  address:   addressFields.address,
  city:      addressFields.city,
  latitude:  addressFields.latitude,
  longitude: addressFields.longitude,
  isDefault: addressFields.isDefault,
})
  .min(1)
  .and('latitude', 'longitude')
  .messages({
    'object.min': 'Debés enviar al menos un campo para actualizar.',
    'object.and': 'Si enviás coordenadas, debés enviar tanto latitud como longitud.',
  });

// ─────────────────────────────────────────────
// Factory validate — misma firma que en todos los módulos
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