import prisma from "../../database/prismaclient";

export async function getSingleDoctorId() {
  const doctor = await prisma.admin.findFirst();
  console.log(doctor, `this is the admin (one doctor application)`);
  if (!doctor) throw new Error("Admin/Doctor not found");
  return doctor.id;
}
