import { Request, Response } from "express";
import prisma from "../../database/prismaclient";
import { getSingleDoctorId } from "./appointment.service";

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
