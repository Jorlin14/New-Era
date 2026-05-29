// server.js
// Punto de entrada de la aplicación.
// Responsabilidades:
//   1. Cargar variables de entorno
//   2. Inicializar Express con middlewares globales de seguridad
//   3. Montar el router principal
//   4. Registrar el manejador de errores global
//   5. Arrancar el servidor HTTP

// IMPORTANTE: dotenv debe ser lo PRIMERO en ejecutarse.
// Carga el archivo .env y pone las variables en process.env
// antes de que cualquier otro módulo las intente leer.
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import apiRouter from './src/routes/index.js';
import { errorHandler } from './src/middlewares/error.middleware.js';
import prisma from './src/config/database.js';

// ─────────────────────────────────────────────
// INICIALIZACIÓN DE EXPRESS
// ─────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 3000;


// ─────────────────────────────────────────────
// MIDDLEWARES GLOBALES DE SEGURIDAD
// Se ejecutan en ORDEN, de arriba a abajo,
// para CADA request que llegue al servidor.
// ─────────────────────────────────────────────

// 1. HELMET: Configura cabeceras HTTP de seguridad automáticamente.
//    Protege contra ataques comunes: clickjacking, XSS, sniffing de MIME, etc.
//    Es una sola línea que activa ~14 protecciones distintas.
app.use(helmet());

// 2. CORS: Define qué dominios (origins) pueden hacer requests a esta API.
//    Sin esto, el navegador bloqueará las requests desde tu frontend React.
//    En producción, cambiar 'origin' por la URL real del frontend.
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// 3. RATE LIMITER: Limita la cantidad de requests por IP en un período de tiempo.
//    Protege contra ataques de fuerza bruta (intentos masivos de login)
//    y ataques de denegación de servicio (DoS).
//    Config: máximo 100 requests por IP cada 15 minutos.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos en milisegundos
  max: 100,
  standardHeaders: true,     // Incluye info del límite en los headers de respuesta
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Demasiadas solicitudes desde esta IP. Intenta de nuevo en 15 minutos.',
  },
});
app.use('/api', limiter); // Solo aplica el límite a rutas que empiecen con /api

// 4. MORGAN: Logger de requests HTTP.
//    Registra en consola cada request: método, ruta, status, tiempo de respuesta.
//    Formato 'dev' es colorido y compacto. Formato 'combined' es estándar Apache (para producción).
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// 5. express.json(): Parsea el body de los requests con Content-Type: application/json.
//    Sin este middleware, req.body sería undefined en POST/PUT/PATCH.
//    'limit' previene ataques donde se envía un body enorme para saturar la memoria.
app.use(express.json({ limit: '10kb' }));

// 6. express.urlencoded(): Parsea datos de formularios HTML clásicos (no JSON).
//    Necesario si algún día tu frontend envía FormData en lugar de JSON.
app.use(express.urlencoded({ extended: true, limit: '10kb' }));


// ─────────────────────────────────────────────
// RUTAS DE LA API
// Todas las rutas de negocio viven bajo el prefijo /api
// ─────────────────────────────────────────────
app.use('/api', apiRouter);

// Manejo de rutas no encontradas (404).
// Se ejecuta si ninguna ruta anterior coincidió.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta ${req.method} ${req.originalUrl} no encontrada.`,
  });
});


// ─────────────────────────────────────────────
// MANEJADOR GLOBAL DE ERRORES
// DEBE ser el ÚLTIMO middleware registrado.
// Express lo identifica como error handler por tener 4 parámetros (err, req, res, next).
// ─────────────────────────────────────────────
app.use(errorHandler);


// ─────────────────────────────────────────────
// ARRANQUE DEL SERVIDOR
// Verificamos la conexión a la BD antes de aceptar tráfico.
// ─────────────────────────────────────────────
const startServer = async () => {
  try {
    // Intentar conectar a PostgreSQL a través de Prisma.
    // $connect() lanza una excepción si la BD no está disponible.
    await prisma.$connect();
    console.log('✅ Conexión a PostgreSQL establecida correctamente.');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📋 Ambiente: ${process.env.NODE_ENV}`);
      console.log(`💡 Health check: http://localhost:${PORT}/api/health`);
    });

  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error.message);
    // Si no hay BD, cerrar el proceso. No tiene sentido correr la API sin datos.
    process.exit(1);
  }
};

// Manejo de cierre limpio del servidor (Ctrl+C o señal de cierre del SO).
// Desconecta Prisma antes de cerrar para liberar las conexiones a la BD.
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('\n🔌 Servidor cerrado y BD desconectada.');
  process.exit(0);
});

startServer();
