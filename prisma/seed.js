import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando el semillero de datos (Seeding)...');

  // 1. Crear el usuario ADMIN por defecto (upsert = actualiza si existe, crea si no existe)
  const adminPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@newera.com' },
    update: {}, // Si ya existe, no le hace nada
    create: {
      name: 'Super Admin',
      email: 'admin@newera.com',
      password: adminPassword,
      phone: '3000000000',
      role: 'ADMIN',
    },
  });
  console.log('✅ Administrador maestro verificado: admin@newera.com / admin123');

  // 2. Crear algunas categorías iniciales para tener con qué probar
  const categorias = ['Lácteos', 'Carnes', 'Verduras', 'Snacks', 'Bebidas'];
  
  for (const nombre of categorias) {
    await prisma.category.upsert({
      where: { name: nombre },
      update: {},
      create: { name: nombre },
    });
  }
  console.log('✅ Categorías base inyectadas.');

  console.log('🎉 Seeding completado con éxito. ¡Base de datos lista!');
}

main()
  .catch((e) => {
    console.error('Error durante el seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });