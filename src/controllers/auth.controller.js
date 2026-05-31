import * as authService from '../services/auth.service.js';

// ─────────────────────────────────────────────
// CONTROLADOR DE AUTENTICACIÓN
// Recibe la petición, llama al servicio y formatea la respuesta.
// ─────────────────────────────────────────────

export const register = async (req, res, next) => {
  try {
    // req.body ya viene validado y sanitizado por Joi
    const { user, token } = await authService.registerUser(req.body);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente.',
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { user, token } = await authService.loginUser(req.body);

    res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso.',
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
// Devuelve los datos del usuario logueado usando el token
export const getMe = async (req, res) => {
  // req.user ya fue consultado e inyectado por verifyToken
  res.status(200).json({
    success: true,
    data: { user: req.user },
  });
};