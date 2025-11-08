import { Request, Response } from "express";
import prisma from "../database/prismaclient";
import { ServiceType, AppointmentStatus } from "@prisma/client";
import { CreateUserFormBody } from "../types/formRequest";

export const createUserForm = async (req: Request, res: Response) => {
  try {
    console.log("🚀 Incoming form data:", req.body);

    const { userName, phone, slotId, slotTime, formData, files } =
      req.body as CreateUserFormBody;

    if (!userName || !phone || !slotId || !slotTime) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // 🧩 1️⃣ Find or create user
    console.log("creating users");
    let user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      user = await prisma.user.create({ data: { name: userName, phone } });
    }

    console.log("checking for doctor availablity");
    const doctor = await prisma.doctor.findFirst();
    if (!doctor) {
      return res.status(404).json({ error: "No doctor found." });
    }

    console.log("creating the appointment table");
    const appointment = await prisma.appointment.create({
      data: {
        service: ServiceType.NUTRITION,
        startAt: new Date(slotTime.startTime),
        endAt: new Date(slotTime.endTime),
        status: AppointmentStatus.PENDING,
        doctorId: doctor.id,
        userId: user.id,
        slotId, // optional, if you’re linking a slot
      },
    });

    console.log("creating the userform table");
    const userForm = await prisma.userForm.create({
      data: {
        formData: JSON.parse(JSON.stringify(formData)),
        userId: user.id,
        appointmentId: appointment.id,
      },
    });

    console.log("creating the files");
    if (files && Array.isArray(files) && files.length > 0) {
      const formattedFiles = files.map((f) => ({
        url: f.url,
        fileName: f.fileName,
        mimeType: f.mimeType,
        sizeInBytes: f.sizeInBytes,
        userFormId: userForm.id,
      }));
      await prisma.file.createMany({ data: formattedFiles });
    }

    console.log("all done");

    return res.status(201).json({
      message: "Form and appointment stored successfully ✅",
      data: { userForm, appointment },
    });
  } catch (error: any) {
    console.error("Form creation error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
