import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { validate, registerSchema, loginSchema } from '../validators/auth.validator.js';

const router = Router();

// ─────────────────────────────────────────────
// RUTAS DE AUTENTICACIÓN
// Flujo: Validación (Joi) -> Controlador -> Respuesta
// ─────────────────────────────────────────────

// Rutas Públicas
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

// Rutas Privadas
// verifyToken asegura que haya un JWT válido antes de llamar a getMe
router.get('/me', verifyToken, getMe);

export default router;