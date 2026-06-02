import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { validate, registerSchema, loginSchema } from '../validators/auth.validator.js';

const router = Router();

// Auth Routes
// Flujo: Joi -> Controller -> Response

// Public Routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

// Private Routes
router.get('/me', verifyToken, getMe);

export default router;