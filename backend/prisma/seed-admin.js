import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { prisma } from "../shared/utils/prisma.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });
dotenv.config({ path: path.join(__dirname, "../../.env") });

async function seedAdmin() {
  const adminPassword = process.env.ADMIN_PASSWORD || "Sis3575@";
  const adminEmail = (process.env.ADMIN_EMAIL || "sisay3575@gmail.com").trim().toLowerCase();
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const emailsToEnsure = Array.from(new Set([adminEmail, "sisay3575@gmail.com", "sisay@example.com"]));
  for (const email of emailsToEnsure) {
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        role: UserRole.ADMIN,
        isActive: true,
      },
      create: {
        email,
        password: hashedPassword,
        role: UserRole.ADMIN,
        isActive: true,
      },
    });
    console.log(`[OK] Admin user ensured: ${user.email} (ID: ${user.id}, Role: ${user.role})`);
  }
}

seedAdmin()
  .then(() => {
    console.log("Admin setup complete!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Admin setup failed:", err);
    process.exit(1);
  });
