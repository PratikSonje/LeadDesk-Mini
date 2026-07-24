import { prisma } from "../src/lib/db";
import bcrypt from "bcryptjs";

async function main() {
  const adminEmail = "admin@demo.com";
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const password_hash = await bcrypt.hash("password123", 12);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password_hash,
        role: "ADMIN",
      },
    });
    console.log("Admin user created (admin@demo.com / password123)");
  } else {
    console.log("Admin user already exists");
  }

  // Create a dummy lead
  await prisma.lead.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
      budget: "$5k - $10k",
      message: "Looking for a full stack developer for my next project.",
    },
  });
  console.log("Dummy lead created");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
