import { Router } from 'express';
import { verifyToken, checkRole } from '../middlewares/auth.middleware.js';
import {
  validate,
  createAddressSchema,
  updateAddressSchema,
} from '../validators/address.validator.js';
import * as addressController from '../controllers/address.controller.js';

const router = Router();

// ─────────────────────────────────────────────
// Todas las rutas de direcciones exigen:
//   1. Token válido       → verifyToken
//   2. Rol CUSTOMER       → checkRole
//
// Ambos se aplican una sola vez al router completo.
// Cualquier request a /api/addresses/* pasa por
// estos dos guards antes de llegar al controlador.
// ─────────────────────────────────────────────
router.use(verifyToken);
router.use(checkRole('CUSTOMER'));

// GET    /api/addresses
router.get(
  '/',
  addressController.getMyAddresses
);

// POST   /api/addresses
router.post(
  '/',
  validate(createAddressSchema),
  addressController.createAddress
);

// PATCH  /api/addresses/:id
router.patch(
  '/:id',
  validate(updateAddressSchema),
  addressController.updateAddress
);

// PATCH  /api/addresses/:id/default
// ⚠️  Debe definirse ANTES de '/:id' solo si hubiera ambigüedad,
//     pero como el segmento fijo es '/default' después del parámetro,
//     Express lo resuelve correctamente en cualquier orden.
//     Lo ponemos arriba igual por convención de legibilidad.
router.patch(
  '/:id/default',
  addressController.setDefaultAddress
);

// DELETE /api/addresses/:id
router.delete(
  '/:id',
  addressController.deleteAddress
);