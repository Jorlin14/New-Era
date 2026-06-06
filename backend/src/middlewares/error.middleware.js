// ERROR HANDLER
export const errorHandler = (err, req, res, next) => {
  // PRISMA UNIQUE CONSTRAINT (P2002)
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'campo';
    return res.status(409).json({
      success: false,
      message: `Ya existe un registro con ese ${field}.`,
    });
  }

  const statusCode = err.statusCode || 500;

  const response = {
    success: false,
    message: err.message || 'Error interno del servidor.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  console.error(`[ERROR] ${req.method} ${req.path} → ${statusCode}: ${err.message}`);
  res.status(statusCode).json(response);
};

// APP ERROR
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}
