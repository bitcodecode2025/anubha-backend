// modules/patient/patient.routes.ts
import { Router } from "express";
import { patientController } from "./patient.contoller";
import { validateBody } from "../../middleware/validateRequest";
import { createPatientSchema } from "./patient.validators";
import { requireAuth } from "../../middleware/requireAuth";
import { requireRole } from "../../middleware/requiredRole";
import { patientLimiter } from "../../middleware/rateLimit";

const patientRoutes = Router();

/**
 * ------------------------------
 * USER ROUTES
 * ------------------------------
 */

// Create a new patient (multi-step form submission)
patientRoutes.post(
  "/",
  requireAuth,
  patientLimiter,
  validateBody(createPatientSchema),
  (req, res) => patientController.create(req, res)
);

// List all patients of logged-in user
patientRoutes.get("/me", requireAuth, (req, res) =>
  patientController.listMine(req, res)
);

// Get one specific patient belonging to logged-in user
patientRoutes.get("/me/:id", requireAuth, (req, res) =>
  patientController.getMineById(req, res)
);

/**
 * ------------------------------
 * ADMIN ROUTES
 * ------------------------------
 */

// Admin: list all patients
patientRoutes.get("/", requireAuth, requireRole("ADMIN"), (req, res) =>
  patientController.adminListAll(req, res)
);

// Admin: get detailed patient info
patientRoutes.get("/:id", requireAuth, requireRole("ADMIN"), (req, res) =>
  patientController.adminGetById(req, res)
);

// Admin: update patient
patientRoutes.patch("/:id", requireAuth, requireRole("ADMIN"), (req, res) =>
  patientController.adminUpdate(req, res)
);

patientRoutes.delete("/file/:fileId", requireAuth, (req, res) =>
  patientController.deleteFile(req, res)
);

export default patientRoutes;
