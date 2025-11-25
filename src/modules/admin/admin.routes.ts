import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { requireRole } from "../../middleware/requiredRole";
import { Role } from "@prisma/client";

import {
  adminGetAppointments,
  adminUpdateAppointmentStatus,
  adminGetAppointmentDetails,
  createDoctorSession,
  upsertDoctorFieldValue,
  getDoctorSession,
  deleteDoctorSession,
  getDoctorFieldGroups,
  searchDoctorFields,
} from "./admin.controller";

const adminRoutes = Router();

/* -------------------------------------------------------
    ADMIN — APPOINTMENTS MANAGEMENT
-------------------------------------------------------- */

// GET ALL appointments (filters: date, mode, status, pagination)
adminRoutes.get(
  "/appointments",
  requireAuth,
  requireRole(Role.ADMIN),
  adminGetAppointments
);

// GET one appointment with patient + recall + files + sessions
adminRoutes.get(
  "/appointments/:id",
  requireAuth,
  requireRole(Role.ADMIN),
  adminGetAppointmentDetails
);

// UPDATE appointment status (PENDING → CONFIRMED → COMPLETED or CANCELLED)
adminRoutes.patch(
  "/appointments/:id/status",
  requireAuth,
  requireRole(Role.ADMIN),
  adminUpdateAppointmentStatus
);

/* -------------------------------------------------------
    ADMIN — DOCTOR FORM SESSIONS
-------------------------------------------------------- */

// CREATE new doctor form session (when clicking +)
adminRoutes.post(
  "/doctor-session",
  requireAuth,
  requireRole(Role.ADMIN),
  createDoctorSession
);

// GET a doctor form session with all values
adminRoutes.get(
  "/doctor-session/:sessionId",
  requireAuth,
  requireRole(Role.ADMIN),
  getDoctorSession
);

// UPSERT field values for doctor session (auto-save)
adminRoutes.patch(
  "/doctor-session/:sessionId/value",
  requireAuth,
  requireRole(Role.ADMIN),
  upsertDoctorFieldValue
);

// DELETE a doctor form session
adminRoutes.delete(
  "/doctor-session/:sessionId",
  requireAuth,
  requireRole(Role.ADMIN),
  deleteDoctorSession
);

/* -------------------------------------------------------
    ADMIN — DOCTOR FIELD DEFINITIONS (200+ master fields)
-------------------------------------------------------- */

// GET all groups → with fields (for UI sidebar)
adminRoutes.get(
  "/doctor-fields/groups",
  requireAuth,
  requireRole(Role.ADMIN),
  getDoctorFieldGroups
);

// SEARCH fields → used in “Add Field” search bar
adminRoutes.get(
  "/doctor-fields/search",
  requireAuth,
  requireRole(Role.ADMIN),
  searchDoctorFields
);

export default adminRoutes;
