// src/modules/slots/slot.controller.ts
import { Request, Response } from "express";
import {
  generateSlotsForRange,
  addDoctorDayOff,
  removeDoctorDayOff,
  getAvailableSlotsForDate,
  getAdminSlots,
  getAdminDayOffList,
} from "./slots.services";
import {
  generateSlotsSchema,
  dayOffSchema,
  availableSlotsQuerySchema,
  adminSlotsQuerySchema,
} from "./slots.validation";

export async function generateSlotsHandler(req: Request, res: Response) {
  try {
    const parsed = generateSlotsSchema.parse(req.body);

    const result = await generateSlotsForRange(parsed);

    return res.status(200).json({
      success: true,
      message: "Slots generated successfully",
      createdCount: result.createdCount,
    });
  } catch (err: any) {
    console.error("generateSlotsHandler error:", err);
    return res.status(400).json({
      success: false,
      message: err?.message || "Failed to generate slots",
    });
  }
}

export async function addDayOffHandler(req: Request, res: Response) {
  try {
    const parsed = dayOffSchema.parse(req.body);

    const dayOff = await addDoctorDayOff(parsed);

    return res.status(200).json({
      success: true,
      message: "Day off saved successfully",
      data: dayOff,
    });
  } catch (err: any) {
    console.error("addDayOffHandler error:", err);
    return res.status(400).json({
      success: false,
      message: err?.message || "Failed to save day off",
    });
  }
}

export async function removeDayOffHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await removeDoctorDayOff(id);

    return res.status(200).json({
      success: true,
      message: "Day off removed successfully",
    });
  } catch (err: any) {
    console.error("removeDayOffHandler error:", err);
    return res.status(400).json({
      success: false,
      message: err?.message || "Failed to remove day off",
    });
  }
}

export async function getAvailableSlotsHandler(req: Request, res: Response) {
  try {
    const parsed = availableSlotsQuerySchema.parse(req.query);

    const slots = await getAvailableSlotsForDate(parsed);

    return res.status(200).json({
      success: true,
      data: slots,
    });
  } catch (err: any) {
    console.error("getAvailableSlotsHandler error:", err);
    return res.status(400).json({
      success: false,
      message: err?.message || "Failed to fetch available slots",
    });
  }
}

export async function adminGetSlotsHandler(req: Request, res: Response) {
  try {
    const parsed = adminSlotsQuerySchema.parse(req.query);

    const slots = await getAdminSlots(parsed);

    return res.status(200).json({
      success: true,
      data: slots,
    });
  } catch (err: any) {
    console.error("adminGetSlotsHandler error:", err);
    return res.status(400).json({
      success: false,
      message: err?.message || "Failed to fetch admin slots",
    });
  }
}

export async function adminGetDayOffListHandler(req: Request, res: Response) {
  try {
    const offs = await getAdminDayOffList();

    return res.status(200).json({
      success: true,
      data: offs,
    });
  } catch (err: any) {
    console.error("adminGetDayOffListHandler error:", err);
    return res.status(400).json({
      success: false,
      message: err?.message || "Failed to fetch day off list",
    });
  }
}
