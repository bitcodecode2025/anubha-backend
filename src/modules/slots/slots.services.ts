import prisma from "../../database/prismaclient";
import { APPOINTMENT_MODES, AppointmentModeType } from "./slots.constants";
import {
  generateSlotsForDate,
  toDateString,
  isPastDate,
  formatSlotLabel,
} from "./slots.utils";

/**
 * Since there is only one doctor/admin in Nutriwell,
 * this helper fetches that single Admin.
 */
export async function getSingleAdminId() {
  const admin = await prisma.admin.findFirst();
  if (!admin) {
    throw new Error("No admin found in database. Seed the Admin first.");
  }
  return admin.id;
}

/**
 * Check if a date (YYYY-MM-DD) is a Sunday.
 */
export function isSunday(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00Z");
  return d.getDay() === 0;
}

/**
 * Generate slots for a range of dates (admin-driven).
 */
export async function generateSlotsForRange(opts: {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  modes: AppointmentModeType[]; // e.g. ['IN_PERSON', 'ONLINE']
}) {
  const adminId = await getSingleAdminId();
  const { startDate, endDate, modes } = opts;

  const start = new Date(startDate + "T00:00:00Z");
  const end = new Date(endDate + "T00:00:00Z");

  if (end < start) {
    throw new Error("endDate cannot be before startDate");
  }

  // Fetch all doctor day offs in range once for efficiency
  const dayOffs = await prisma.doctorDayOff.findMany({
    where: {
      adminId,
      date: {
        gte: start,
        lte: end,
      },
    },
  });

  const dayOffSet = new Set(dayOffs.map((d) => toDateString(d.date)));

  const data: {
    adminId: string;
    startAt: Date;
    endAt: Date;
    mode: AppointmentModeType;
  }[] = [];

  const cursor = new Date(start);
  const now = new Date();

  while (cursor <= end) {
    const dateStr = toDateString(cursor);

    // Skip Sundays
    if (!isSunday(dateStr) && !dayOffSet.has(dateStr)) {
      for (const mode of modes) {
        const slots = generateSlotsForDate(dateStr, mode);

        for (const { startAt, endAt } of slots) {
          // Don't generate slots in the past
          if (startAt <= now) continue;

          data.push({
            adminId,
            startAt,
            endAt,
            mode,
          });
        }
      }
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  if (!data.length) {
    return { createdCount: 0 };
  }

  const result = await prisma.slot.createMany({
    data,
    skipDuplicates: true, // respects @@unique([adminId, startAt])
  });

  return { createdCount: result.count };
}

/**
 * Mark a doctor day off.
 */
export async function addDoctorDayOff(opts: {
  date: string; // YYYY-MM-DD
  reason?: string;
}) {
  const adminId = await getSingleAdminId();
  const date = new Date(opts.date + "T00:00:00Z");

  const dayOff = await prisma.doctorDayOff.upsert({
    where: {
      adminId_date: {
        adminId,
        date,
      },
    },
    update: {
      reason: opts.reason,
    },
    create: {
      adminId,
      date,
      reason: opts.reason,
    },
  });

  // Optionally: delete any existing slots on that day (cleaner)
  await prisma.slot.deleteMany({
    where: {
      adminId,
      startAt: {
        gte: date,
        lt: new Date(date.getTime() + 24 * 60 * 60 * 1000),
      },
    },
  });

  return dayOff;
}

export async function removeDoctorDayOff(id: string) {
  await prisma.doctorDayOff.delete({
    where: { id },
  });
}

/**
 * Get available slots for a given date + mode for the public booking flow.
 * If no slots exist, auto-generate from default templates (if not Sunday / day off).
 */
export async function getAvailableSlotsForDate(opts: {
  date: string; // YYYY-MM-DD
  mode: AppointmentModeType;
}) {
  const adminId = await getSingleAdminId();
  const { date, mode } = opts;

  const dayStart = new Date(date + "T00:00:00Z");
  const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

  // Check Sunday
  if (isSunday(date)) {
    return [];
  }

  // Check DoctorDayOff
  const dayOff = await prisma.doctorDayOff.findFirst({
    where: {
      adminId,
      date: {
        gte: dayStart,
        lt: dayEnd,
      },
    },
  });

  if (dayOff) {
    return [];
  }

  // Fetch slots for this date/mode
  let slots = await prisma.slot.findMany({
    where: {
      adminId,
      mode,
      isBooked: false,
      startAt: {
        gte: dayStart,
        lt: dayEnd,
      },
    },
    orderBy: {
      startAt: "asc",
    },
  });

  const now = new Date();

  // If no slots exist for this date, auto-generate from default template
  if (slots.length === 0) {
    const { generateSlotsForDate } = await import("./slots.utils");
    const generated = generateSlotsForDate(date, mode)
      .filter(({ startAt }) => startAt > now)
      .map(({ startAt, endAt }) => ({
        adminId,
        startAt,
        endAt,
        mode,
        isBooked: false,
      }));

    if (generated.length) {
      await prisma.slot.createMany({
        data: generated,
        skipDuplicates: true,
      });

      slots = await prisma.slot.findMany({
        where: {
          adminId,
          mode,
          isBooked: false,
          startAt: {
            gte: dayStart,
            lt: dayEnd,
          },
        },
        orderBy: {
          startAt: "asc",
        },
      });
    }
  }

  // Filter out slots that are in the past (for today)
  const validSlots = slots.filter((s) => !isPastDate(s.startAt));

  // Map to frontend-friendly format
  return validSlots.map((slot) => ({
    id: slot.id,
    startAt: slot.startAt.toISOString(),
    endAt: slot.endAt.toISOString(),
    label: formatSlotLabel(slot.startAt, slot.endAt),
    mode: slot.mode,
  }));
}

// ADMIN: fetch all slots (with booking details)
export async function getAdminSlots(opts: {
  date?: string;
  startDate?: string;
  endDate?: string;
}) {
  const adminId = await getSingleAdminId();

  let where: any = { adminId };

  // CASE 1: single date
  if (opts.date) {
    const dayStart = new Date(opts.date + "T00:00:00Z");
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

    where.startAt = { gte: dayStart, lt: dayEnd };
  }

  // CASE 2: range filter
  if (opts.startDate && opts.endDate) {
    const start = new Date(opts.startDate + "T00:00:00Z");
    const end = new Date(opts.endDate + "T23:59:59Z");

    where.startAt = { gte: start, lte: end };
  }

  const slots = await prisma.slot.findMany({
    where,
    orderBy: { startAt: "asc" },
    include: {
      appointment: {
        include: {
          patient: true,
        },
      },
    },
  });

  return slots.map((s) => ({
    id: s.id,
    startAt: s.startAt,
    endAt: s.endAt,
    mode: s.mode,
    isBooked: s.isBooked,
    appointment: s.appointment
      ? {
          id: s.appointment.id,
          patientName: s.appointment.patient.name,
          patientId: s.appointment.patientId,
        }
      : null,
  }));
}

export async function getAdminDayOffList() {
  const adminId = await getSingleAdminId();

  const offs = await prisma.doctorDayOff.findMany({
    where: { adminId },
    orderBy: { date: "asc" },
  });

  return offs.map((d) => ({
    id: d.id,
    date: d.date,
    reason: d.reason,
  }));
}
