import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { attachUser } from "../../middleware/attachUser";
import {
  paymentLimiter,
  paymentVerifyLimiter,
  generalLimiter,
} from "../../middleware/rateLimit";
import { validateFieldSizes } from "../../middleware/fieldSizeValidator";

import {
  createOrderHandler,
  verifyPaymentHandler,
  getPlanPriceHandler,
  getExistingOrderHandler,
} from "./payment.controller";

const paymentRoutes = Router();

// Apply general rate limiting to all payment routes
paymentRoutes.use(generalLimiter);

// Payment order creation - strict rate limiting + field validation
paymentRoutes.post(
  "/order",
  paymentLimiter,
  attachUser,
  requireAuth,
  validateFieldSizes(), // Validate field sizes
  createOrderHandler
);

// Payment verification - very strict rate limiting + field validation
paymentRoutes.post(
  "/verify",
  paymentVerifyLimiter,
  attachUser,
  requireAuth,
  validateFieldSizes(), // Validate field sizes
  verifyPaymentHandler
);

// Get existing order - moderate rate limiting
paymentRoutes.get(
  "/existing-order/:appointmentId",
  paymentLimiter,
  attachUser,
  requireAuth,
  getExistingOrderHandler
);

// Public endpoint - moderate rate limiting
paymentRoutes.get("/plan-price", generalLimiter, getPlanPriceHandler);

export default paymentRoutes;
