// src/controllers/auth.controller.js
// Capa de controlador: punto de entrada HTTP para las rutas de autenticación.
// Su único trabajo es: recibir req, llamar al servicio, y formatear la respuesta.
// Nunca contiene lógica de negocio (eso va en el servicio).

import { AuthService } from '../services/auth.service.js';

export const AuthController = {

  // POST /api/auth/register
  async register(req, res, next) {
    try {
      // req.body ya fue validado por validateBody(registerSchema) en la ruta.
      // Aquí confiamos en que los datos son correctos y completos.
      const { name, email, password } = req.body;

      const user = await AuthService.register(name, email, password);

      // 201 = Created. Respuesta estándar cuando se crea un recurso nuevo.
      return res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente.',
        data: { user },
      });
    } catch (error) {
      // Pasar el error al errorHandler global con next(error).
      // Esto evita try/catch repetitivos en cada controlador.
      next(error);
    }
  },

  // POST /api/auth/login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const { token, user } = await AuthService.login(email, password);

      return res.status(200).json({
        success: true,
        message: 'Inicio de sesión exitoso.',
        data: { token, user },
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/auth/me  (ruta protegida - requiere verifyToken)
  // Retorna el perfil del usuario autenticado actualmente.
  async getMe(req, res) {
    // req.user fue adjuntado por el middleware verifyToken.
    // No necesitamos buscar en la BD de nuevo: ya tenemos los datos del token.
    return res.status(200).json({
      success: true,
      data: { user: req.user },
    });
  },
};
