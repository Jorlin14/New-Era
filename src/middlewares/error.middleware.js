// src/middlewares/error.middleware.js
// Middleware "catch-all" de errores. Se registra AL FINAL de todos los
// middlewares en server.js. Express lo reconoce como manejador de errores
// por tener exactamente 4 parámetros: (err, req, res, next).

export const errorHandler = (err, req, res, next) => {
  // Determinar el código de estado HTTP.
  // Si el error tiene un statusCode definido (ej. errores personalizados),
  // usarlo. Si no, usar 500 (error interno del servidor).
  const statusCode = err.statusCode || 500;

  // Construir el cuerpo de la respuesta de error.
  const response = {
    success: false,
    message: err.message || 'Error interno del servidor.',
    // En desarrollo, incluir el stack trace para facilitar el debugging.
    // En producción NUNCA exponer el stack (revela detalles internos del sistema).
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  // Registrar el error en la consola del servidor para diagnóstico.
  // En un proyecto real aquí iría un logger como Winston o Pino.
  console.error(`[ERROR] ${req.method} ${req.path} → ${statusCode}: ${err.message}`);

  res.status(statusCode).json(response);
};

// Clase de error personalizada para lanzar errores con statusCode desde
// cualquier parte de la app usando: throw new AppError('mensaje', 404)
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);       // Llama al constructor de Error con el mensaje
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}
