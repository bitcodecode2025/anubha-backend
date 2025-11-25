import { Router } from "express";
import { createAppointmentHandler } from "./appointment.controller";
import { attachUser } from "../../middleware/attachUser";
import { requireAuth } from "../../middleware/requireAuth";

const appointmentRoutes = Router();

appointmentRoutes.post(
  "/create",
  attachUser,
  requireAuth,
  createAppointmentHandler
);

export default appointmentRoutes;
