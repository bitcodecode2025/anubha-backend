import { Router } from "express";
import { Role } from "@prisma/client";
import {
  createAppointmentHandler,
  adminUpdateAppointmentStatus,
  adminGetAppointments,
} from "./appointment.controller";
import { attachUser } from "../../middleware/attachUser";
import { requireAuth } from "../../middleware/requireAuth";
import { requireRole } from "../../middleware/requiredRole";

const appointmentRoutes = Router();

appointmentRoutes.post(
  "/create",
  attachUser,
  requireAuth,
  createAppointmentHandler
);

appointmentRoutes.patch(
  "/admin/:id/status",
  requireAuth,
  requireRole(Role.ADMIN),
  adminUpdateAppointmentStatus
);

appointmentRoutes.get(
  "/admin/list",
  requireAuth,
  requireRole(Role.ADMIN),
  adminGetAppointments
);
export default appointmentRoutes;
