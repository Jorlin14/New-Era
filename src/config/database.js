// src/config/database.js
// Responsabilidad única: crear y exportar la instancia de Prisma Client.
// El resto de la app importa 'prisma' desde aquí (no crea nuevas instancias).

import { PrismaClient } from '@prisma/client';

// Instancia ÚNICA (Singleton) de Prisma.
// Esto es crítico: crear múltiples PrismaClient abre conexiones extra
// innecesarias a la base de datos.
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn']  // En desarrollo: muestra las queries SQL ejecutadas
    : ['error'],                   // En producción: solo errores (menos ruido en logs)
});

export default prisma;