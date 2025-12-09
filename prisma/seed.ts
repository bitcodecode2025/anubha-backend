// Use the PrismaClient instance with middleware (phone normalization)
import prisma from "../src/database/prismaclient";

async function main() {
  const phoneNumber = "6260440241";
  // Phone will be normalized by Prisma middleware to: 916260440241
  const phoneWithCountryCode = "916260440241";

  console.log("🌱 Seeding admin...");
  console.log(`   Phone (input): ${phoneNumber}`);
  console.log(`   Phone (will be normalized to): ${phoneWithCountryCode}`);
  console.log(`   Name: admin-tanishk`);
  console.log(`   Email: admin-tanishk@nutriwell.com\n`);

  // Try to find existing admin by either phone format
  // Note: Prisma middleware will normalize phone numbers, so we search for both formats
  const existingAdmin = await prisma.admin.findFirst({
    where: {
      OR: [{ phone: phoneNumber }, { phone: phoneWithCountryCode }],
    },
  });

  if (existingAdmin) {
    console.log("⚠️  Admin already exists with phone:", existingAdmin.phone);
    console.log("   Updating admin details...\n");

    // Update admin - phone will be normalized by middleware
    const updatedAdmin = await prisma.admin.update({
      where: { id: existingAdmin.id },
      data: {
        name: "admin-tanishk",
        email: "admin-tanishk@nutriwell.com",
        phone: phoneNumber, // Will be normalized to 916260440241 by middleware
      },
    });

    console.log("✅ Admin updated successfully:", {
      id: updatedAdmin.id,
      name: updatedAdmin.name,
      phone: updatedAdmin.phone, // Should be normalized: 916260440241
      email: updatedAdmin.email,
    });
  } else {
    // Create new admin - phone will be normalized by middleware
    const admin = await prisma.admin.create({
      data: {
        name: "admin-tanishk",
        phone: phoneNumber, // Will be normalized to 916260440241 by middleware
        email: "admin-tanishk@nutriwell.com",
      },
    });

    console.log("✅ Admin created successfully:", {
      id: admin.id,
      name: admin.name,
      phone: admin.phone, // Should be normalized: 916260440241
      email: admin.email,
    });
  }

  // Verify the admin exists (search with normalized format)
  console.log("\n🔍 Verifying admin in database...");
  const verifyAdmin = await prisma.admin.findFirst({
    where: {
      OR: [{ phone: phoneNumber }, { phone: phoneWithCountryCode }],
    },
  });

  if (verifyAdmin) {
    console.log("✅ Verification successful! Admin found:", {
      id: verifyAdmin.id,
      name: verifyAdmin.name,
      phone: verifyAdmin.phone,
      email: verifyAdmin.email,
    });
    console.log(`\n📝 Note: Phone stored as: ${verifyAdmin.phone}`);
    console.log(`   Login should work with: ${phoneNumber} or ${phoneWithCountryCode}`);
  } else {
    console.error("❌ Verification failed! Admin not found in database.");
    throw new Error("Admin verification failed");
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
