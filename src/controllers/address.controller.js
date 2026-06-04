import * as addressService from '../services/address.service.js';

// ══════════════════════════════════════════════
// POST /api/addresses
// ══════════════════════════════════════════════
export const createAddress = async (req, res, next) => {
  try {
    // userId siempre del token, NUNCA del body.
    // El validate(createAddressSchema) ya hizo stripUnknown: true,
    // así que aunque el cliente enviara un userId en el body,
    // Joi lo eliminó antes de llegar aquí.
    const address = await addressService.createAddress(req.user.id, req.body);

    res.status(201).json({
      success: true,
      message: 'Dirección creada correctamente.',
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

// ══════════════════════════════════════════════
// GET /api/addresses
// ══════════════════════════════════════════════
export const getMyAddresses = async (req, res, next) => {
  try {
    const addresses = await addressService.getMyAddresses(req.user.id);

    res.status(200).json({
      success: true,
      // Devolvemos el conteo directamente para que el frontend
      // no tenga que hacer addresses.data.length
      count: addresses.length,
      data: addresses,
    });
  } catch (error) {
    next(error);
  }
};

// ══════════════════════════════════════════════
// PATCH /api/addresses/:id
// ══════════════════════════════════════════════
export const updateAddress = async (req, res, next) => {
  try {
    const address = await addressService.updateAddress(
      req.params.id,
      req.user.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: 'Dirección actualizada correctamente.',
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

// ══════════════════════════════════════════════
// DELETE /api/addresses/:id
// ══════════════════════════════════════════════
export const deleteAddress = async (req, res, next) => {
  try {
    const result = await addressService.deleteAddress(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      ...result, // expande { message: 'Dirección eliminada correctamente.' }
    });
  } catch (error) {
    next(error);
  }
};

// ══════════════════════════════════════════════
// PATCH /api/addresses/:id/default
// Endpoint dedicado: marca una dirección como predeterminada
// sin necesidad de reenviar todos los campos.
// ══════════════════════════════════════════════
export const setDefaultAddress = async (req, res, next) => {
  try {
    const address = await addressService.setDefaultAddress(
      req.params.id,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message: 'Dirección predeterminada actualizada.',
      data: address,
    });
  } catch (error) {
    next(error);
  }
};