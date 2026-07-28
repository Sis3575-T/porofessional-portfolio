import app from "./app.js";
import { prisma } from "shared";

const PORT = process.env.PORT || 5000;

async function testDbConnection() {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    console.log(`[DB] Database connection successful`);
  } catch (error) {
    console.error(`[DB] Database connection FAILED:`, error.message);
    console.error(`[DB] DATABASE_URL set:`, !!process.env.DATABASE_URL);
  }
}

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`Cloudinary config: cloud_name=${process.env.CLOUDINARY_CLOUD_NAME ? "SET" : "MISSING"}, api_key=${process.env.CLOUDINARY_API_KEY ? "SET" : "MISSING"}, api_secret=${process.env.CLOUDINARY_API_SECRET ? "SET" : "MISSING"}`);
  await testDbConnection();
});
