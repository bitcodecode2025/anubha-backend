import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";

/**
 * SECURITY: requireRole middleware
 *
 * Checks user role from JWT token (req.user.role).
 * JWT tokens are cryptographically signed, so role cannot be tampered with.
 *
 * For critical operations (delete, update, write), use requireAdmin() instead,
 * which also verifies role from the database for defense-in-depth.
 *
 * Usage:
 *   routes.get("/endpoint", requireAuth, requireRole(Role.ADMIN), handler);
 */
export function requireRole(...allowedRoles: Role[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Login required.",
      });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden. You don't have permission.",
      });
    }

    next();
  };
}
