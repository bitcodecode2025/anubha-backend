export const IST_TIMEZONE_OFFSET = "+05:30";

export const OFFLINE_SLOT_TEMPLATES = [
  { start: "10:00", end: "10:40" },
  { start: "11:00", end: "11:40" },
  { start: "12:00", end: "12:40" },
];

export const ONLINE_SLOT_TEMPLATES = [
  { start: "14:00", end: "14:40" },
  { start: "15:00", end: "15:40" },
  { start: "16:00", end: "16:40" },
  { start: "17:00", end: "17:40" },
  { start: "18:00", end: "18:40" },
  { start: "19:00", end: "19:40" },
];

export const APPOINTMENT_MODES = {
  IN_PERSON: "IN_PERSON",
  ONLINE: "ONLINE",
} as const;

export type AppointmentModeType =
  (typeof APPOINTMENT_MODES)[keyof typeof APPOINTMENT_MODES];
