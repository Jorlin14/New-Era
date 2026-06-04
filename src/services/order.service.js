import prisma from '../config/database.js';
import { AppError } from '../middlewares/error.middleware.js';
// ══════════════════════════════════════════════
// CONSTANTES DE TARIFAS
// Centralizadas aquí para que un cambio de negocio
// sea una edición en un solo lugar.
// ══════════════════════════════════════════════
const SHIPPING = {
  BASE_FEE:          4_000,  // COP — tarifa fija para los primeros 3 km
  BASE_KM_THRESHOLD: 3,      // km incluidos en la tarifa base
  FEE_PER_EXTRA_KM:  1_000,  // COP por cada km adicional después del umbral
  MAX_COVERAGE_KM:   15,     // km máximo de cobertura
  FREE_THRESHOLD:    100_000, // COP — subtotal mínimo para envío gratis
  FREE_MAX_KM:       5,      // km máximo para aplicar envío gratis
};

// ─────────────────────────────────────────────
// HELPER: serializar Decimals de Prisma a Float
// ─────────────────────────────────────────────
const serializeOrder = (order) => ({
  ...order,
  total: parseFloat(order.total),
  items: order.items?.map((item) => ({
    ...item,
    unitPrice: parseFloat(item.unitPrice),
  })),
});


// ══════════════════════════════════════════════
// LÓGICA DE TARIFAS DE ENVÍO
//
// EJEMPLOS NUMÉRICOS:
//
// Caso 1 — distancia <= 3 km, subtotal cualquiera:
//   distance = 2 km  → extraKm = max(0, 2-3) = 0
//   shippingCost = 4.000 + (0 × 1.000) = $4.000
//
// Caso 2 — distancia > 3 km:
//   distance = 7 km  → extraKm = max(0, 7-3) = 4
//   shippingCost = 4.000 + (4 × 1.000) = $8.000
//
// Caso 3 — envío gratis (subtotal >= 100k Y distance <= 5 km):
//   distance = 4 km, subtotal = 120.000
//   → cumple AMBAS condiciones → shippingCost = $0
//
// Caso 4 — fuera de cobertura:
//   distance = 16 km → lanza error 400
// ══════════════════════════════════════════════
const calculateShipping = (distance, subtotal) => {

  // Guard: límite de cobertura (doble check; Joi ya lo rechazó antes)
  if (distance > SHIPPING.MAX_COVERAGE_KM) {
    throw new AppError(
      `Fuera de cobertura. El máximo es ${SHIPPING.MAX_COVERAGE_KM} km. Tu distancia: ${distance} km.`,
      400
    );
  }

  // Regla de envío gratis: AMBAS condiciones deben cumplirse
  const qualifiesFreeShipping =
    subtotal >= SHIPPING.FREE_THRESHOLD &&
    distance <= SHIPPING.FREE_MAX_KM;

  if (qualifiesFreeShipping) return 0;

  // Cálculo escalonado:
  // Math.max(0, ...) garantiza que nunca haya kilómetros negativos
  // cuando distance < BASE_KM_THRESHOLD.
  const extraKm = Math.max(0, distance - SHIPPING.BASE_KM_THRESHOLD);

  // Math.ceil: si el cliente está a 3.4 km extra, paga 4 km extra.
  // Redondear hacia arriba es la convención estándar en logística.
  const shippingCost = SHIPPING.BASE_FEE + Math.ceil(extraKm) * SHIPPING.FEE_PER_EXTRA_KM;

  return shippingCost;
};


// ══════════════════════════════════════════════
// CREAR ORDEN
// ══════════════════════════════════════════════
export const createOrder = async (customerId, { addressId, distance, items }) => {

  // ─────────────────────────────────────────────
  // PASO 1: Verificar que la dirección pertenece al usuario
  //
  // Un cliente no debe poder pedir con la dirección de otro.
  // Buscamos por id Y userId a la vez: si no coincide, devuelve null.
  // ─────────────────────────────────────────────
  const address = await prisma.address.findFirst({
    where: { id: addressId, userId: customerId },
  });

  if (!address) {
    throw new AppError('La dirección no existe o no te pertenece.', 404);
  }

  // ─────────────────────────────────────────────
  // PASO 2: Obtener todos los productos del pedido en UNA sola query
  //
  // Extraemos los IDs del array de ítems para hacer un findMany.
  // Es mucho más eficiente que N queries individuales (N+1 problem).
  // ─────────────────────────────────────────────
  const productIds = items.map((item) => item.productId);

  const productsInDB = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      isActive: true, // no aceptar pedidos con productos desactivados
    },
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
    },
  });

  // Verificar que todos los productos enviados existen y están activos.
  // Si el cliente envió 3 productIds pero solo encontramos 2 en la BD,
  // alguno fue eliminado/desactivado.
  if (productsInDB.length !== productIds.length) {
    const foundIds = productsInDB.map((p) => p.id);
    const missingIds = productIds.filter((id) => !foundIds.includes(id));
    throw new AppError(
      `Los siguientes productos no están disponibles: ${missingIds.join(', ')}`,
      404
    );
  }

  // ─────────────────────────────────────────────
  // PASO 3: Verificar stock e iniciar cálculo de subtotal
  //
  // Convertimos el array de productos a un Map para acceso O(1).
  // Iterar con .find() dentro de otro loop sería O(n²).
  // ─────────────────────────────────────────────
  const productMap = new Map(productsInDB.map((p) => [p.id, p]));

  let subtotal = 0;
  const stockErrors = [];

  const enrichedItems = items.map((item) => {
    const product = productMap.get(item.productId);

    // Acumular errores de stock en lugar de fallar en el primero.
    // Así el cliente ve TODOS los productos sin stock en un solo mensaje.
    if (product.stock < item.quantity) {
      stockErrors.push(
        `"${product.name}": solicitás ${item.quantity}, disponible ${product.stock}`
      );
    }

    // Snapshot de precio: tomamos el precio ACTUAL de la BD, no del cliente.
    // parseFloat convierte Decimal.js a número nativo para operar con él.
    const unitPrice = parseFloat(product.price);
    subtotal += unitPrice * item.quantity;

    return {
      productId: item.productId,
      quantity:  item.quantity,
      unitPrice, // este valor se guarda en OrderItem como snapshot histórico
    };
  });

  // Si hay errores de stock, los lanzamos todos juntos
  if (stockErrors.length > 0) {
    throw new AppError(
      `Stock insuficiente para:\n${stockErrors.join('\n')}`,
      409 // 409 Conflict: el estado actual del recurso impide la operación
    );
  }

  // ─────────────────────────────────────────────
  // PASO 4: Calcular tarifa de envío
  // ─────────────────────────────────────────────
  const shippingCost = calculateShipping(distance, subtotal);
  const total = subtotal + shippingCost;

  // ─────────────────────────────────────────────
  // PASO 5: Crear la orden y descontar stock en UNA transacción atómica
  //
  // Una transacción garantiza que si cualquier operación falla,
  // TODAS se revierten. Sin esto, podríamos crear la orden pero
  // fallar al descontar el stock, dejando la BD inconsistente.
  //
  // prisma.$transaction([]) ejecuta todas las queries como una
  // sola unidad de trabajo en PostgreSQL (BEGIN / COMMIT / ROLLBACK).
  // ─────────────────────────────────────────────
  const addressSnapshot = `${address.address}, ${address.city}`;

  const transactionOperations = [
    // Operación A: crear la orden con sus ítems anidados
    prisma.order.create({
      data: {
        customerId,
        address: addressSnapshot, // snapshot fijo de la dirección
        total,
        items: {
          create: enrichedItems, // Prisma crea todos los OrderItems en cascada
        },
      },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, imageUrl: true } },
          },
        },
      },
    }),

    // Operaciones B: decrementar stock de cada producto
    // updateMany no funciona con IDs distintos, por eso generamos
    // un update individual por producto. Todo dentro de la misma transacción.
    ...enrichedItems.map((item) =>
      prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })
    ),
  ];

  // Ejecutar todas las operaciones atómicamente
  const [newOrder] = await prisma.$transaction(transactionOperations);

  // ─────────────────────────────────────────────
  // PASO 6: Construir respuesta enriquecida
  // ─────────────────────────────────────────────
  return {
    order: serializeOrder(newOrder),
    summary: {
      subtotal,
      shippingCost,
      total,
      // Informar al cliente si obtuvo envío gratis
      freeShippingApplied: shippingCost === 0,
    },
  };
};


// ══════════════════════════════════════════════
// OBTENER ÓRDENES DEL CLIENTE AUTENTICADO
// ══════════════════════════════════════════════
export const getMyOrders = async (customerId, { status, page, limit }) => {
  const skip = (page - 1) * limit;

  const where = {
    customerId,
    ...(status && { status }),
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, imageUrl: true } },
          },
        },
      },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    data: orders.map(serializeOrder),
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};


// ══════════════════════════════════════════════
// OBTENER TODAS LAS ÓRDENES (ADMIN / CASHIER)
// ══════════════════════════════════════════════
export const getAllOrders = async ({ status, page, limit }) => {
  const skip = (page - 1) * limit;

  const where = {
    ...(status && { status }),
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        customer:  { select: { id: true, name: true, email: true, phone: true } },
        deliverer: { select: { id: true, name: true } },
        items: {
          include: {
            product: { select: { id: true, name: true } },
          },
        },
      },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    data: orders.map(serializeOrder),
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};


// ══════════════════════════════════════════════
// ACTUALIZAR ESTADO (ADMIN / CASHIER / DELIVERER)
// ══════════════════════════════════════════════

// Mapa de transiciones válidas.
// Cada estado solo puede avanzar a los estados de su array.
// Esto previene retrocesos arbitrarios (ej: DELIVERED → PENDING).
const VALID_TRANSITIONS = {
  PENDING:    ['PAID', 'CANCELLED'],
  PAID:       ['PREPARING', 'CANCELLED'],
  PREPARING:  ['DISPATCHED', 'CANCELLED'],
  DISPATCHED: ['DELIVERED'],
  DELIVERED:  [], // estado terminal: no hay transición posible
  CANCELLED:  [], // estado terminal
};

export const updateOrderStatus = async (orderId, newStatus, operatorId) => {

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new AppError('Orden no encontrada.', 404);

  // Verificar transición válida
  const allowedNext = VALID_TRANSITIONS[order.status];
  if (!allowedNext.includes(newStatus)) {
    throw new AppError(
      `No se puede cambiar el estado de ${order.status} a ${newStatus}. Transiciones válidas: ${allowedNext.join(', ') || 'ninguna (estado terminal)'}`,
      422 // 422 Unprocessable Entity: sintaxis OK, lógica de negocio falla
    );
  }

  // Construir data de actualización con timestamps de KPI
  const updateData = { status: newStatus };

  if (newStatus === 'DISPATCHED') {
    updateData.dispatchedAt = new Date();
    updateData.delivererId = operatorId; // asignar al repartidor que despacha
  }
  if (newStatus === 'DELIVERED') {
    updateData.deliveredAt = new Date();
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: updateData,
    include: {
      customer:  { select: { id: true, name: true, email: true } },
      deliverer: { select: { id: true, name: true } },
      items: {
        include: { product: { select: { id: true, name: true } } },
      },
    },
  });

  return serializeOrder(updated);
};