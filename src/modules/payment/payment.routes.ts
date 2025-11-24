import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";

import { createOrderHandler, verifyPaymentHandler } from "./payment.controller";

const paymentRoutes = Router();

paymentRoutes.post("/order", requireAuth, createOrderHandler);
paymentRoutes.post("/verify", requireAuth, verifyPaymentHandler);

export default paymentRoutes;
