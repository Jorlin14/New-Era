// src/routes/auth.routes.js
// Define los endpoints del módulo de autenticación y aplica
// los middlewares en el orden correcto para cada ruta.

import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';

const router = Router();

// Rutas PÚBLICAS (sin autenticación):
// El middleware de validación se ejecuta ANTES del controlador.
// Si el body es inválido, el request ni siquiera llega al controlador.
router.post('/register', validateBody(registerSchema), AuthController.register);
router.post('/login',    validateBody(loginSchema),    AuthController.login);

// Ruta PRIVADA (requiere autenticación):
// verifyToken intercepta el request, verifica el JWT,
// y solo si es válido pasa el control a AuthController.getMe
router.get('/me', verifyToken, AuthController.getMe);

export default router;
