import { Request, Response } from "express";
import { adminProfileService } from "./admin-profile.service";
import { AppError } from "../../util/AppError";

/**
 * Admin Profile Controller
 * Handles HTTP requests for admin profile picture operations
 */

/**
 * Upload admin profile picture
 * POST /api/admin/profile/picture
 */
export async function uploadAdminProfilePicture(req: Request, res: Response) {
  try {
    const adminId = req.user?.id;
    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Login required.",
      });
    }

    const file = req.file as Express.Multer.File | undefined;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Profile picture file is required",
      });
    }

    const result = await adminProfileService.uploadProfilePicture(
      adminId,
      file
    );

    return res.status(200).json({
      success: true,
      message: "Profile picture uploaded successfully",
      profilePictureUrl: result.profilePictureUrl,
    });
  } catch (error: any) {
    console.error("[ADMIN PROFILE] Upload error:", error);
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to upload profile picture",
    });
  }
}

/**
 * Get admin profile picture
 * GET /api/admin/profile/picture
 */
export async function getAdminProfilePicture(req: Request, res: Response) {
  try {
    const adminId = req.user?.id;
    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Login required.",
      });
    }

    const result = await adminProfileService.getProfilePicture(adminId);

    return res.status(200).json({
      success: true,
      profilePictureUrl: result.profilePictureUrl,
    });
  } catch (error: any) {
    console.error("[ADMIN PROFILE] Get error:", error);
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to get profile picture",
    });
  }
}

/**
 * Update admin profile picture
 * PUT /api/admin/profile/picture
 * PATCH /api/admin/profile/picture
 */
export async function updateAdminProfilePicture(req: Request, res: Response) {
  try {
    const adminId = req.user?.id;
    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Login required.",
      });
    }

    const file = req.file as Express.Multer.File | undefined;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Profile picture file is required",
      });
    }

    const result = await adminProfileService.updateProfilePicture(
      adminId,
      file
    );

    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      profilePictureUrl: result.profilePictureUrl,
    });
  } catch (error: any) {
    console.error("[ADMIN PROFILE] Update error:", error);
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to update profile picture",
    });
  }
}

/**
 * Delete admin profile picture
 * DELETE /api/admin/profile/picture
 */
export async function deleteAdminProfilePicture(req: Request, res: Response) {
  try {
    const adminId = req.user?.id;
    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Login required.",
      });
    }

    const result = await adminProfileService.deleteProfilePicture(adminId);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    console.error("[ADMIN PROFILE] Delete error:", error);
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to delete profile picture",
    });
  }
}
