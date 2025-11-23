// src/modules/slots/slot.utils.ts
import {
  OFFLINE_SLOT_TEMPLATES,
  ONLINE_SLOT_TEMPLATES,
  IST_TIMEZONE_OFFSET,
  APPOINTMENT_MODES,
  AppointmentModeType,
} from "./slots.constants";

/**
 * Build a JS Date in UTC from a YYYY-MM-DD + HH:mm (24h) in IST.
 */
export function buildDateInIST(dateStr: string, timeStr: string): Date {
  // Example: "2025-11-23T10:00:00+05:30"
  return new Date(`${dateStr}T${timeStr}:00${IST_TIMEZONE_OFFSET}`);
}

/**
 * Returns YYYY-MM-DD from a Date object (UTC-safe for our usage here)
 */
export function toDateString(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Generate 40-minute slot Date objects for a given date + mode.
 * Uses fixed templates from frontend.
 */
export function generateSlotsForDate(
  dateStr: string,
  mode: AppointmentModeType
) {
  const templates =
    mode === APPOINTMENT_MODES.IN_PERSON
      ? OFFLINE_SLOT_TEMPLATES
      : ONLINE_SLOT_TEMPLATES;

  return templates.map(({ start, end }) => ({
    startAt: buildDateInIST(dateStr, start),
    endAt: buildDateInIST(dateStr, end),
  }));
}

/**
 * Format slot Date objects into strings like "10:00 AM – 10:40 AM"
 * for returning to frontend.
 */
export function formatSlotLabel(startAt: Date, endAt: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  const start = startAt.toLocaleTimeString("en-IN", options);
  const end = endAt.toLocaleTimeString("en-IN", options);

  return `${start} – ${end}`;
}

/**
 * Utility to check if a JS Date (slot start) is already in the past.
 */
export function isPastDate(date: Date) {
  return date.getTime() < Date.now();
}
