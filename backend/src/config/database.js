import { PrismaClient } from '@prisma/client';

// PRISMA SINGLETON
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export default prisma;