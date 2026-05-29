// src/middlewares/auth.middleware.js
// Contiene los dos guardianes de seguridad del sistema:
//   1. verifyToken  → ¿Hay un JWT válido en el request?
//   2. checkRole    → ¿El usuario tiene el rol necesario para esta ruta?

import jwt from 'jsonwebtoken';

// =============================================================
// MIDDLEWARE 1: verifyToken
// Intercepta el request ANTES de llegar al controlador.
// Verifica que el usuario esté autenticado mediante un JWT.
// =============================================================
export const verifyToken = (req, res, next) => {
  // PASO 1: Extraer el token del header 'Authorization'
  // El estándar HTTP usa el formato: "Authorization: Bearer <token>"
  // El operador ?. (optional chaining) evita un crash si el header no existe.
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Toma solo la parte después de "Bearer "

  // PASO 2: Verificar que el token existe
  // Si no hay token, el usuario no está autenticado. Cortamos el ciclo con 401.
  // 401 = "No autorizado" → significa "no me has dicho quién eres".
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Acceso denegado: token no proporcionado.',
    });
  }

  // PASO 3: Verificar la firma y la expiración del token
  // jwt.verify() hace DOS cosas a la vez:
  //   a) Verifica que el token fue firmado con NUESTRO JWT_SECRET (no fue falsificado)
  //   b) Verifica que el token no ha expirado
  // Si cualquiera de las dos falla, lanza una excepción que capturamos en el catch.
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // PASO 4: Adjuntar el payload decodificado al objeto 'req'
    // Ahora todos los middlewares y controladores que vienen DESPUÉS
    // tienen acceso a req.user.id, req.user.role, req.user.email
    // sin tener que consultar la base de datos de nuevo.
    req.user = decoded;

    // PASO 5: Pasar el control al siguiente middleware o controlador
    // Si no llamamos a next(), el request se congela aquí para siempre.
    next();

  } catch (error) {
    // jwt.verify lanza errores específicos que podemos distinguir:
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Sesión expirada. Por favor, inicia sesión de nuevo.',
      });
    }
    // JsonWebTokenError cubre tokens malformados, firma inválida, etc.
    return res.status(401).json({
      success: false,
      message: 'Token inválido.',
    });
  }
};


// =============================================================
// MIDDLEWARE 2: checkRole (Higher-Order Function / Fábrica de middlewares)
// Se llama así: checkRole('admin')  o  checkRole('admin', 'cashier')
// Retorna un middleware configurado para ese/esos roles.
// SIEMPRE debe ejecutarse DESPUÉS de verifyToken (necesita req.user).
// =============================================================
export const checkRole = (...allowedRoles) => {
  // Esta función retorna el middleware real.
  // El truco del "..." (rest parameter) permite pasar uno o varios roles:
  //   checkRole('ADMIN')              → allowedRoles = ['ADMIN']
  //   checkRole('ADMIN', 'CASHIER')   → allowedRoles = ['ADMIN', 'CASHIER']
  return (req, res, next) => {

    // PASO 1: Verificar que verifyToken ya se ejecutó antes.
    // Si req.user no existe, alguien configuró mal las rutas
    // y usó checkRole sin verifyToken antes.
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No autenticado.',
      });
    }

    // PASO 2: Verificar si el rol del usuario está en la lista de roles permitidos.
    // Array.includes() retorna true/false.
    const hasPermission = allowedRoles.includes(req.user.role);

    // PASO 3: Si no tiene permiso, responder con 403.
    // 403 = "Prohibido" → significa "sé quién eres, pero no tienes permiso".
    // Es diferente al 401: el usuario SÍ está autenticado, pero NO autorizado.
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado: se requiere rol ${allowedRoles.join(' o ')}.`,
      });
    }

    // PASO 4: Tiene el rol correcto, continuar.
    next();
  };
};
