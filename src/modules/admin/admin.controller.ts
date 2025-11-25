import prisma from "../../database/prismaclient";
import { AppointmentStatus } from "@prisma/client";
import { AppointmentMode } from "@prisma/client";
import { Request, Response } from "express";

function dateRangeFromQuery(dateStr?: string) {
  if (!dateStr) return undefined;
  const day = new Date(dateStr);
  day.setHours(0, 0, 0, 0);
  const nextDay = new Date(day);
  nextDay.setDate(day.getDate() + 1);
  return { gte: day, lt: nextDay };
}

//. ADMIN — GET APPOINTMENTS LIST (WITH ALL FILTERS)
export async function adminGetAppointments(req: Request, res: Response) {
  try {
    // Optional: Ensure admin role here or rely on route middleware
    // if (req.user?.role !== "ADMIN") return res.status(403).json({ error: "Forbidden" });

    const { date, status, mode, page = "1", limit = "20", q } = req.query;

    const where: any = {};

    // date filter
    const dateRange = dateRangeFromQuery(date as string | undefined);
    if (dateRange) where.startAt = dateRange;

    // status filter
    if (status) where.status = status as AppointmentStatus;

    // mode filter
    if (mode) where.mode = mode as AppointmentMode;

    // optional text search across patient name/phone/email (q)
    if (q && typeof q === "string") {
      where.OR = [
        { patient: { name: { contains: q, mode: "insensitive" } } },
        { patient: { phone: { contains: q, mode: "insensitive" } } },
        { patient: { email: { contains: q, mode: "insensitive" } } },
      ];
    }

    const pageNum = Math.max(1, Number(page));
    const lim = Math.min(200, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * lim;

    // return only lightweight fields needed for the dashboard list
    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        select: {
          id: true,
          startAt: true,
          endAt: true,
          status: true,
          mode: true,
          patient: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
            },
          },
        },
        orderBy: { startAt: "asc" },
        skip,
        take: lim,
      }),
      prisma.appointment.count({ where }),
    ]);

    return res.json({
      success: true,
      total,
      page: pageNum,
      limit: lim,
      appointments,
    });
  } catch (err) {
    console.error("Admin Get Appointments Error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
}

//. ADMIN — UPDATE APPOINTMENT STATUS
export async function adminUpdateAppointmentStatus(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;
    const { status } = req.body as { status: AppointmentStatus };

    if (!status) {
      return res.status(400).json({ error: "Missing status" });
    }

    // Fetch appointment
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { slot: true },
    });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // ✋ Prevent illegal transitions
    const current = appointment.status;

    if (current === "CANCELLED" || current === "COMPLETED") {
      return res.status(400).json({
        error: `Cannot modify an appointment that is ${current}`,
      });
    }

    // VALID transitions:
    const allowedStatuses: AppointmentStatus[] = [
      "PENDING",
      "CONFIRMED",
      "CANCELLED",
      "COMPLETED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    // SPECIAL LOGIC:
    // If cancelled → free the slot
    let slotUpdate = undefined;
    if (status === "CANCELLED" && appointment.slotId) {
      slotUpdate = prisma.slot.update({
        where: { id: appointment.slotId },
        data: { isBooked: false },
      });
    }

    // If confirmed → slot booked (fallback)
    if (status === "CONFIRMED" && appointment.slotId) {
      slotUpdate = prisma.slot.update({
        where: { id: appointment.slotId },
        data: { isBooked: true },
      });
    }

    // Update appointment
    const updated = await prisma.appointment.update({
      where: { id },
      data: { status },
    });

    if (slotUpdate) await slotUpdate;

    return res.json({
      success: true,
      appointment: updated,
    });
  } catch (err) {
    console.error("Admin Update Status Error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}

// GET /api/admin/appointments/:id
export async function adminGetAppointmentDetails(req: Request, res: Response) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: "Missing id param" });

    const appt = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: {
          include: {
            files: true,
            recalls: {
              include: { entries: true },
            },
          },
        },
        slot: true,
        doctor: true,
        DoctorFormSession: {
          include: {
            values: {
              include: {
                field: {
                  include: { options: true },
                },
              },
            },
          },
        },
      },
    });

    if (!appt) return res.status(404).json({ error: "Appointment not found" });

    return res.json({ success: true, appointment: appt });
  } catch (err) {
    console.error("Admin Get Appointment Details Error:", err);
    return res
      .status(500)
      .json({ success: false, message: "from adminGetappointmentdetails" });
  }
}
// POST /api/admin/doctor-session
//create sessions
export async function createDoctorSession(req: Request, res: Response) {
  try {
    const doctorId = req.user?.id;
    if (!doctorId) return res.status(401).json({ error: "Unauthenticated" });

    const { appointmentId, patientId, title } = req.body;
    if (!patientId) return res.status(400).json({ error: "Missing patientId" });

    // optional: check appointment belongs to same patient if appointmentId provided
    if (appointmentId) {
      const appt = await prisma.appointment.findUnique({
        where: { id: appointmentId },
      });
      if (!appt)
        return res.status(404).json({ error: "Appointment not found" });
      if (appt.patientId !== patientId) {
        return res
          .status(400)
          .json({ error: "Appointment does not belong to patientId" });
      }
    }

    // create session
    const session = await prisma.doctorFormSession.create({
      data: {
        appointmentId: appointmentId ?? null,
        patientId,
        doctorId,
        title: title ?? "Assessment",
      },
      include: { values: { include: { field: true } } },
    });

    return res.json({ success: true, session });
  } catch (err) {
    console.error("Create Doctor Session Error:", err);
    return res
      .status(500)
      .json({ success: false, message: "from createDoctorsession fucntion" });
  }
}
// PATCH /api/admin/doctor-session/:sessionId/value
//add update field values
export async function upsertDoctorFieldValue(req: Request, res: Response) {
  try {
    const doctorId = req.user?.id;
    if (!doctorId) return res.status(401).json({ error: "Unauthenticated" });

    const { sessionId } = req.params;
    const { fieldId, value } = req.body;
    if (!sessionId || !fieldId || !value)
      return res.status(400).json({ error: "Missing body" });

    // verify session exists and doctor owns it
    const session = await prisma.doctorFormSession.findUnique({
      where: { id: sessionId },
      select: { doctorId: true },
    });
    if (!session) return res.status(404).json({ error: "Session not found" });
    if (session.doctorId !== doctorId)
      return res.status(403).json({ error: "Not authorized" });

    // check field exists
    const field = await prisma.doctorFieldMaster.findUnique({
      where: { id: fieldId },
      select: { id: true, type: true },
    });
    if (!field) return res.status(404).json({ error: "Field not found" });

    // Basic validation: ensure the payload shape is allowed (we keep this small; frontend should ensure correct shape)
    const allowedKeys = [
      "stringValue",
      "numberValue",
      "booleanValue",
      "dateValue",
      "timeValue",
      "jsonValue",
      "notes",
    ];
    const cleanData: any = {};
    for (const k of allowedKeys) {
      if (value[k] !== undefined) cleanData[k] = value[k];
    }

    // upsert: find existing value
    const existing = await prisma.doctorFormFieldValue.findFirst({
      where: { sessionId, fieldId },
    });

    let saved;
    if (existing) {
      saved = await prisma.doctorFormFieldValue.update({
        where: { id: existing.id },
        data: cleanData,
        include: { field: { include: { options: true } } },
      });
    } else {
      saved = await prisma.doctorFormFieldValue.create({
        data: { sessionId, fieldId, ...cleanData },
        include: { field: { include: { options: true } } },
      });
    }

    return res.json({ success: true, value: saved });
  } catch (err) {
    console.error("Upsert Doctor Field Value Error:", err);
    return res.status(500).json({ success: false });
  }
}

//get sessions with all values
// GET /api/admin/doctor-session/:id
export async function getDoctorSession(req: Request, res: Response) {
  try {
    const session = await prisma.doctorFormSession.findUnique({
      where: { id: req.params.id },
      include: {
        values: {
          include: { field: { include: { options: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!session) return res.status(404).json({ error: "Session not found" });
    return res.json({ success: true, session });
  } catch (err) {
    console.error("Get Doctor Session Error:", err);
    return res.status(500).json({ success: false });
  }
}

//Delete session
// DELETE /api/admin/doctor-session/:id
export async function deleteDoctorSession(req: Request, res: Response) {
  try {
    const doctorId = req.user?.id;
    if (!doctorId) return res.status(401).json({ error: "Unauthenticated" });

    const { id } = req.params;
    const session = await prisma.doctorFormSession.findUnique({
      where: { id },
      select: { doctorId: true },
    });
    if (!session) return res.status(404).json({ error: "Session not found" });
    if (session.doctorId !== doctorId)
      return res.status(403).json({ error: "Not authorized" });

    await prisma.doctorFormSession.delete({ where: { id } });
    return res.json({ success: true });
  } catch (err) {
    console.error("Delete Doctor Session Error:", err);
    return res.status(500).json({ success: false });
  }
}

//get fields groups
// GET /api/admin/doctor-fields/groups
export async function getDoctorFieldGroups(req: Request, res: Response) {
  try {
    const groups = await prisma.doctorFieldGroup.findMany({
      orderBy: { order: "asc" },
      include: {
        fields: {
          where: { active: true },
          orderBy: { order: "asc" },
          include: { options: true },
        },
      },
    });
    return res.json({ success: true, groups });
  } catch (err) {
    console.error("Get Doctor Field Groups Error:", err);
    return res.status(500).json({ success: false });
  }
}
//search fields
// GET /api/admin/doctor-fields/search?q=alcohol
export async function searchDoctorFields(req: Request, res: Response) {
  try {
    const q = (req.query.q as string) || "";
    const fields = await prisma.doctorFieldMaster.findMany({
      where: {
        active: true,
        OR: [
          { label: { contains: q, mode: "insensitive" } },
          { key: { contains: q, mode: "insensitive" } },
        ],
      },
      include: { options: true },
      orderBy: { order: "asc" },
      take: 50,
    });
    return res.json({ success: true, fields });
  } catch (err) {
    console.error("Search Doctor Fields Error:", err);
    return res.status(500).json({ success: false });
  }
}

/**
 * ADMIN — add a field placeholder into a session (useful when doctor clicks + to add a new field)
 * POST /api/admin/doctor-session/:sessionId/field
 * body: { fieldId: string }
 * Creates an empty DoctorFormFieldValue and returns it (so frontend can render input immediately).
 */
export async function addFieldToSession(req: Request, res: Response) {
  try {
    const doctorId = req.user?.id;
    if (!doctorId) return res.status(401).json({ error: "Unauthenticated" });

    const { sessionId } = req.params;
    const { fieldId } = req.body;
    if (!sessionId || !fieldId)
      return res.status(400).json({ error: "Missing params" });

    // verify session exists and doctor owns it (or is admin)
    const session = await prisma.doctorFormSession.findUnique({
      where: { id: sessionId },
      select: { doctorId: true },
    });
    if (!session) return res.status(404).json({ error: "Session not found" });
    if (session.doctorId !== doctorId) {
      return res
        .status(403)
        .json({ error: "Not authorized to modify this session" });
    }

    // verify field exists & active
    const field = await prisma.doctorFieldMaster.findUnique({
      where: { id: fieldId },
      select: { id: true },
    });
    if (!field) return res.status(404).json({ error: "Field not found" });

    // create placeholder value (no typed value yet)
    const value = await prisma.doctorFormFieldValue.create({
      data: {
        sessionId,
        fieldId,
      },
      include: { field: { include: { options: true } } },
    });

    return res.json({ success: true, value });
  } catch (err) {
    console.error("Add Field To Session Error:", err);
    return res.status(500).json({ success: false });
  }
}
