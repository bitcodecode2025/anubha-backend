import { Router } from "express";
import {
  downloadInvoiceHandler,
  getInvoiceByAppointmentHandler,
} from "./invoice.controller";
import { attachUser } from "../../middleware/attachUser";
import { requireAuth } from "../../middleware/requireAuth";

const invoiceRoutes = Router();

// Apply auth middleware to all invoice routes
invoiceRoutes.use(attachUser);
invoiceRoutes.use(requireAuth);

// Get invoice metadata by appointment ID (must come before :invoiceNumber route)
invoiceRoutes.get(
  "/appointment/:appointmentId",
  getInvoiceByAppointmentHandler
);

// Download invoice PDF by invoice number
invoiceRoutes.get("/:invoiceNumber", downloadInvoiceHandler);

export default invoiceRoutes;
