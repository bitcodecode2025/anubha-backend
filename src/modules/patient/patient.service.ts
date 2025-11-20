// modules/patient/patient.service.ts
import prisma from "../../database/prismaclient";
import { CreatePatientInput } from "./patient.validators";
import { deleteFromCloudinary } from "../../util/cloudinary";

export class PatientService {
  async createPatient(
    userId: string,
    data: CreatePatientInput & { fileIds?: string[] }
  ) {
    const {
      fileIds = [], // 🟢 new field (array of file IDs)
      ...rest
    } = data;

    // 1) Create patient first
    const patient = await prisma.patientDetials.create({
      data: {
        userId,
        ...rest,
        dateOfBirth: new Date(rest.dateOfBirth),
      },
    });

    // 2) Attach uploaded files to this patient
    if (fileIds.length > 0) {
      await prisma.file.updateMany({
        where: { id: { in: fileIds } },
        data: { patientId: patient.id },
      });
    }

    return patient;
  }

  async getMyPatients(userId: string) {
    return prisma.patientDetials.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async getByIdForUser(patientId: string, userId: string) {
    const patient = await prisma.patientDetials.findUnique({
      where: { id: patientId },
    });

    if (!patient || patient.userId !== userId) return null;
    return patient;
  }

  async getByIdForAdmin(patientId: string) {
    return prisma.patientDetials.findUnique({
      where: { id: patientId },
      include: {
        user: true,
        appointments: true,
      },
    });
  }

  async adminUpdatePatient(
    patientId: string,
    data: Partial<CreatePatientInput>
  ) {
    // Only allow specific fields to be updated
    const updateData: any = { ...data };
    if (updateData.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateData.dateOfBirth);
    }

    const updated = await prisma.patientDetials.update({
      where: { id: patientId },
      data: updateData,
    });

    return updated;
  }

  async deleteFile(fileId: string, requester: { id: string; role: string }) {
    const file = await prisma.file.findUnique({
      where: { id: fileId },
      include: {
        patient: true,
      },
    });

    console.log(file);
    if (!file) {
      return { success: false, code: 404, message: "File not found" };
    }

    const patient = file.patient;

    if (!patient) {
      await prisma.file.delete({ where: { id: fileId } });
      if (file.publicId) await deleteFromCloudinary(file.publicId);
      return { success: true, code: 200, message: "Temporary file deleted" };
    }

    // AUTHORIZATION
    const isOwner = patient.userId === requester.id;
    const isAdmin = requester.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return {
        success: false,
        code: 403,
        message: "Not allowed to delete this file",
      };
    }

    // DELETE FROM CLOUDINARY (using stored publicId)
    console.log(file.publicId);
    if (file.publicId) {
      await deleteFromCloudinary(file.publicId);
    }

    // DELETE FROM DB
    await prisma.file.delete({ where: { id: fileId } });

    return {
      success: true,
      code: 200,
      message: "File deleted successfully",
    };
  }

  async adminListAllPatients() {
    return prisma.patientDetials.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
      },
    });
  }
}

export const patientService = new PatientService();
