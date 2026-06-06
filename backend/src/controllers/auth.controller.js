import * as authService from '../services/auth.service.js';

// REGISTER
export const register = async (req, res, next) => {
  try {
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

// LOGIN
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

// GET ME
export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    data: { user: req.user },
  });
};