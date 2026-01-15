import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Admin credentials
  const adminData = {
    email: "anubhasnutritionclinic@gmail.com",
    password: "anubha@123",
    name: "staging anubha admin",
    phone: "919713885582",
  };

  // Hash password
  const hashedPassword = await bcrypt.hash(adminData.password, 10);

  // Create or update admin (upsert to avoid duplicates)
  const admin = await prisma.admin.upsert({
    where: {
      email: adminData.email,
    },
    update: {
      name: adminData.name,
      phone: adminData.phone,
      password: hashedPassword,
    },
    create: {
      email: adminData.email,
      phone: adminData.phone,
      name: adminData.name,
      password: hashedPassword,
    },
  });

  console.log("✅ Admin seeded successfully!");
  console.log(`   ID: ${admin.id}`);
  console.log(`   Name: ${admin.name}`);
  console.log(`   Email: ${admin.email}`);
  console.log(`   Phone: ${admin.phone}`);
  console.log("   Password: anubha@123 (hashed)");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
