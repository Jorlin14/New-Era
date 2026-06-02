import { PrismaClient } from '@prisma/client';

// Singleton instance of Prisma.
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn']  // En desarrollo: muestra las queries SQL ejecutadas
    : ['error'],                   // En producción: solo errores
});

export default prisma;