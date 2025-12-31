import { Router } from "express";
import {
  createTestimonial,
  getAllTestimonials,
  getActiveTestimonials,
  updateTestimonial,
  deleteTestimonial,
} from "./testimonials.controller";
import { requireAuth } from "../../middleware/requireAuth";
import { requireAdmin } from "../../middleware/requireAdmin";
import { attachUser } from "../../middleware/attachUser";
import imageUpload from "../../middleware/multerConfig";
import { validateFileContentMiddleware } from "../../middleware/validateFileContent";
import { adminLimiter, generalLimiter } from "../../middleware/rateLimit";

const testimonialsRoutes = Router();

// Apply rate limiting
testimonialsRoutes.use(generalLimiter);

// Public route - Get active testimonials
testimonialsRoutes.get("/", getActiveTestimonials);

// Admin routes
testimonialsRoutes.post(
  "/admin",
  attachUser,
  requireAuth,
  requireAdmin,
  adminLimiter,
  imageUpload.single("image"),
  validateFileContentMiddleware,
  createTestimonial
);

testimonialsRoutes.get(
  "/admin",
  attachUser,
  requireAuth,
  requireAdmin,
  getAllTestimonials
);

testimonialsRoutes.put(
  "/admin/:id",
  attachUser,
  requireAuth,
  requireAdmin,
  adminLimiter,
  imageUpload.single("image"),
  validateFileContentMiddleware,
  updateTestimonial
);

testimonialsRoutes.delete(
  "/admin/:id",
  attachUser,
  requireAuth,
  requireAdmin,
  deleteTestimonial
);

export default testimonialsRoutes;

