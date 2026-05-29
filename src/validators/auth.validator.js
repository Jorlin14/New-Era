// src/validators/auth.validator.js
// Define los esquemas de validación para los endpoints de autenticación.
// Joi valida tipos, formatos, longitudes y requerimientos ANTES de tocar la BD.

import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'El nombre debe tener al menos 2 caracteres.',
      'any.required': 'El nombre es obligatorio.',
    }),

  email: Joi.string()
    .email()
    .lowercase() // Normaliza a minúsculas automáticamente
    .required()
    .messages({
      'string.email': 'El email no tiene un formato válido.',
      'any.required': 'El email es obligatorio.',
    }),

  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/) // Al menos 1 minúscula, 1 mayúscula, 1 número
    .required()
    .messages({
      'string.min': 'La contraseña debe tener al menos 8 caracteres.',
      'string.pattern.base': 'La contraseña debe contener mayúsculas, minúsculas y números.',
      'any.required': 'La contraseña es obligatoria.',
    }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().required(),
});
