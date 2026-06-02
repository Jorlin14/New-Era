export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  const response = {
    success: false,
    message: err.message || 'Error interno del servidor.',
    // En desarrollo, incluir el stack para debugging.
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    // En producción no exponer el stack.
  };

  // Error en consola - Winston o Pino en futura actualización
  console.error(`[ERROR] ${req.method} ${req.path} → ${statusCode}: ${err.message}`);

  res.status(statusCode).json(response);
};

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}
