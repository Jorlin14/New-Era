import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';

// ─────────────────────────────────────────────
// MIDDLEWARE 1: VERIFICAR TOKEN
// Valida el JWT y comprueba el estado del usuario en la base de datos
// ─────────────────────────────────────────────
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    // 1. Verificar si existe el header Bearer
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Acceso denegado: Token no proporcionado.',
      });
    }

    const token = authHeader.split(' ')[1];

    // 2. Desencriptar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Seguridad Extra: Verificar si el usuario aún existe y está activo
    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      select: { id: true, name: true, email: true, role: true, isActive: true },
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'El usuario del token ya no existe.' });
    }
    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Tu cuenta ha sido desactivada.' });
    }

    // 4. Inyectar datos en la request para el controlador
    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Sesión expirada. Inicia sesión de nuevo.' });
    }
    return res.status(401).json({ success: false, message: 'Token inválido o malformado.' });
  }
};

// ─────────────────────────────────────────────
// MIDDLEWARE 2: VERIFICAR ROL (Fábrica)
// Uso: checkRole('ADMIN', 'CASHIER')
// ─────────────────────────────────────────────
export const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    // Falla de seguridad interna: si req.user no existe, se olvidaron de poner verifyToken antes
    if (!req.user) {
      return res.status(500).json({ success: false, message: 'Error interno: Falta verificar token.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Permisos insuficientes. Requiere: ${allowedRoles.join(' o ')}.`,
      });
    }

    next();
  };
};