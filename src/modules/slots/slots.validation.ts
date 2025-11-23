import { z } from "zod";
import { APPOINTMENT_MODES } from "./slots.constants";

export const generateSlotsSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  modes: z
    .array(z.nativeEnum(APPOINTMENT_MODES as any))
    .nonempty()
    .default([APPOINTMENT_MODES.IN_PERSON, APPOINTMENT_MODES.ONLINE]),
});

export const dayOffSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string().max(255).optional(),
});

export const availableSlotsQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  mode: z.nativeEnum(APPOINTMENT_MODES as any),
});

export const adminSlotsQuerySchema = z.object({
  date: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
