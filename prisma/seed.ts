// Use the PrismaClient instance with middleware (phone normalization)
import prisma from "../src/database/prismaclient";
import bcrypt from "bcrypt";

async function main() {
  // ========== ADMIN RECORD ==========
  // Create admin entry in Admin table
  console.log("🌱 Seeding admin record...");
  const adminEmail = "tanishk.khare40@gmail.com";
  const adminPhone = "916260440241"; // Already normalized format
  const adminPassword = "tanishk@123";
  const adminName = "admin-tanishk";

  console.log(`   Name: ${adminName}`);
  console.log(`   Email: ${adminEmail}`);
  console.log(`   Phone: ${adminPhone}`);
  console.log(`   Password: [HIDDEN]\n`);

  // Hash the password
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const existingAdminRecord = await prisma.admin.findFirst({
    where: {
      OR: [{ email: adminEmail }, { phone: adminPhone }],
    },
  });

  if (existingAdminRecord) {
    console.log("⚠️  Admin record already exists, updating password...");

    // Update existing admin with new password
    const updatedAdmin = await prisma.admin.update({
      where: { id: existingAdminRecord.id },
      data: {
        password: hashedPassword,
        name: adminName, // Update name as well
      },
    });

    console.log("✅ Admin record updated successfully:", {
      id: updatedAdmin.id,
      name: updatedAdmin.name,
      email: updatedAdmin.email,
      phone: updatedAdmin.phone,
      hasPassword: !!updatedAdmin.password,
    });
  } else {
    const adminRecord = await prisma.admin.create({
      data: {
        name: adminName,
        email: adminEmail,
        phone: adminPhone, // Already in normalized format
        password: hashedPassword,
      },
    });

    console.log("✅ Admin record created successfully:", {
      id: adminRecord.id,
      name: adminRecord.name,
      email: adminRecord.email,
      phone: adminRecord.phone,
      hasPassword: !!adminRecord.password,
    });
  }
}

main()
  .then(async () => {
    console.log("\n🎉 Seed completed successfully!");
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error("\n❌ Error seeding admin:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
