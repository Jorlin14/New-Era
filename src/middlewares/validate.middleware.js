// src/middlewares/validate.middleware.js
// Fábrica de middleware de validación usando Joi.
// Uso: validateBody(miSchema) → retorna un middleware que valida req.body.

export const validateBody = (schema) => {
  return (req, res, next) => {
    // schema.validate() retorna { error, value }
    // abortEarly: false → reporta TODOS los errores de validación, no solo el primero
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      // Extraer los mensajes de error de Joi y limpiar las comillas de los nombres de campo
      const messages = error.details.map((d) => d.message.replace(/"/g, "'"));
      return res.status(422).json({
        success: false,
        message: 'Datos inválidos.',
        errors: messages,
      });
    }

    // Reemplazar req.body con el valor "limpio" de Joi.
    // Joi hace sanitización: elimina campos extra, aplica defaults, etc.
    req.body = value;
    next();
  };
};
