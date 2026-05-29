// src/services/auth.service.js
// Capa de servicio: contiene la lógica de negocio pura.
// NO sabe nada de HTTP (no usa req/res). Solo opera con datos y retorna resultados.
// Esto permite reutilizar la lógica desde cualquier lugar (otro servicio, tests, etc.)

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';
import { AppError } from '../middlewares/error.middleware.js';

export const AuthService = {

  // -------------------------------------------------------
  // Registrar un nuevo usuario
  // -------------------------------------------------------
  async register(name, email, password) {
    // PASO 1: Verificar que el email no esté en uso.
    // Consultar la BD ANTES de insertar evita duplicados y errores de constraint.
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError('El email ya está registrado.', 409); // 409 = Conflict
    }

    // PASO 2: Hashear la contraseña con bcrypt.
    // El número 12 es el "costo" (salt rounds):
    //   - Mayor costo = hash más lento = más difícil de crackear con fuerza bruta.
    //   - 12 es el estándar de la industria (balance entre seguridad y velocidad).
    // NUNCA guardes contraseñas en texto plano. JAMÁS.
    const hashedPassword = await bcrypt.hash(password, 12);

    // PASO 3: Crear el usuario en la base de datos.
    // Prisma retorna el objeto creado. Usamos 'select' para excluir el password
    // del objeto que retornaremos. Los datos sensibles no deben viajar innecesariamente.
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    return user;
  },

  // -------------------------------------------------------
  // Iniciar sesión y generar JWT
  // -------------------------------------------------------
  async login(email, password) {
    // PASO 1: Buscar el usuario por email.
    // Aquí SÍ necesitamos el password (para compararlo), pero lo excluiremos del token.
    const user = await prisma.user.findUnique({ where: { email } });

    // PASO 2: Validación deliberadamente ambigua.
    // Respondemos con el MISMO mensaje tanto si el email no existe como si
    // la contraseña es incorrecta. Esto previene "user enumeration attacks":
    // si dijéramos "email no encontrado", un atacante sabría qué emails existen.
    if (!user || !user.isActive) {
      throw new AppError('Credenciales inválidas.', 401);
    }

    // PASO 3: Comparar la contraseña ingresada con el hash almacenado.
    // bcrypt.compare() hace el hash de 'password' y lo compara de forma segura.
    // Retorna true/false. Nunca des-hashea ni compares en texto plano.
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Credenciales inválidas.', 401);
    }

    // PASO 4: Generar el JWT.
    // El "payload" del token contiene solo lo necesario para identificar al usuario
    // y verificar sus permisos sin hacer una query a la BD en cada request.
    // NO incluyas datos sensibles (contraseñas, tarjetas) en el payload.
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role }, // Payload
      process.env.JWT_SECRET,                               // Clave secreta
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }    // Expiración
    );

    // Retornar token + datos públicos del usuario (sin el password)
    const { password: _, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  },
};
