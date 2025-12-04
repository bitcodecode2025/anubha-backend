import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const phoneNumber = "6260440241";
  const phoneWithCountryCode = "916260440241";

  console.log("🌱 Seeding admin...");
  console.log(`   Phone: ${phoneNumber}`);
  console.log(`   Phone (with country code): ${phoneWithCountryCode}`);
  console.log(`   Name: admin-tanishk`);
  console.log(`   Email: admin-tanishk@nutriwell.com\n`);

  // Try to find existing admin by either phone format
  const existingAdmin = await prisma.admin.findFirst({
    where: {
      OR: [{ phone: phoneNumber }, { phone: phoneWithCountryCode }],
    },
  });

  if (existingAdmin) {
    console.log("⚠️  Admin already exists with phone:", existingAdmin.phone);
    console.log("   Updating admin details...\n");

    const updatedAdmin = await prisma.admin.update({
      where: { id: existingAdmin.id },
      data: {
        name: "admin-tanishk",
        email: "admin-tanishk@nutriwell.com",
        phone: phoneNumber, // Normalize to format without country code
      },
    });

    console.log("✅ Admin updated successfully:", {
      id: updatedAdmin.id,
      name: updatedAdmin.name,
      phone: updatedAdmin.phone,
      email: updatedAdmin.email,
    });
  } else {
    // Create new admin
    const admin = await prisma.admin.create({
      data: {
        name: "admin-tanishk",
        phone: phoneNumber,
        email: "admin-tanishk@nutriwell.com",
      },
    });

    console.log("✅ Admin created successfully:", {
      id: admin.id,
      name: admin.name,
      phone: admin.phone,
      email: admin.email,
    });
  }

  // Verify the admin exists
  console.log("\n🔍 Verifying admin in database...");
  const verifyAdmin = await prisma.admin.findUnique({
    where: { phone: phoneNumber },
  });

  if (verifyAdmin) {
    console.log("✅ Verification successful! Admin found:", {
      id: verifyAdmin.id,
      name: verifyAdmin.name,
      phone: verifyAdmin.phone,
      email: verifyAdmin.email,
    });
  } else {
    console.error("❌ Verification failed! Admin not found in database.");
    throw new Error("Admin verification failed");
  }

  // Also check with country code format
  const verifyAdminWithCode = await prisma.admin.findUnique({
    where: { phone: phoneWithCountryCode },
  });

  if (verifyAdminWithCode) {
    console.log(
      "⚠️  Found admin with country code format:",
      verifyAdminWithCode.phone
    );
    console.log("   Consider normalizing phone numbers in your application.");
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
