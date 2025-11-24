import { Request, Response } from "express";
import prisma from "../../database/prismaclient";
import { getSingleDoctorId } from "./appointment.service";
import { AppointmentStatus } from "@prisma/client";
import { AppointmentMode } from "@prisma/client";

export async function createAppointmentHandler(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const {
      patientId,
      slotId,
      planSlug,
      planName,
      planPrice,
      planDuration,
      planPackageName,
      appointmentMode,
    } = req.body;

    // Validation
    if (!patientId || !slotId) {
      return res.status(400).json({
        success: false,
        message: "patientId and slotId are required",
      });
    }

    // 1️⃣ Fetch slot
    const slot = await prisma.slot.findUnique({
      where: { id: slotId },
    });

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Slot not found",
      });
    }

    if (slot.isBooked) {
      return res.status(400).json({
        success: false,
        message: "Slot already booked",
      });
    }

    // 2️⃣ Fetch doctorId (Admin = Doctor)
    const doctorId = await getSingleDoctorId();

    // 3️⃣ Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        userId,
        doctorId,
        patientId,
        slotId,
        startAt: slot.startAt,
        endAt: slot.endAt,
        mode: appointmentMode,

        planSlug,
        planName,
        planPrice: Number(planPrice),
        planDuration,
        planPackageName,

        status: "PENDING",
      },
    });

    // 4️⃣ Mark slot booked
    await prisma.slot.update({
      where: { id: slotId },
      data: { isBooked: true },
    });

    return res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: appointment,
    });
  } catch (err: any) {
    console.error("APPOINTMENT CREATE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

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

export async function adminGetAppointments(req: Request, res: Response) {
  try {
    const { date, status, mode, page = 1, limit = 20 } = req.query;

    const filters: any = {};

    // Filter by exact date
    if (date) {
      const day = new Date(date as string);
      const nextDay = new Date(day);
      nextDay.setDate(day.getDate() + 1);

      filters.startAt = {
        gte: day,
        lt: nextDay,
      };
    }

    // Filter by status
    if (status) {
      filters.status = status as AppointmentStatus;
    }

    // Filter by mode
    if (mode) {
      filters.mode = mode as AppointmentMode;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where: filters,
        orderBy: { startAt: "asc" },
        skip,
        take: Number(limit),
        include: {
          patient: {
            select: {
              name: true,
              phone: true,
              email: true,
            },
          },
          slot: true,
        },
      }),

      prisma.appointment.count({ where: filters }),
    ]);

    return res.json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      appointments,
    });
  } catch (err) {
    console.error("Admin Get Appointments Error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
}
