import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function trackPageView(slug = null) {
  try {
    if (slug) {
      await prisma.project.updateMany({
        where: { slug },
        data: { viewCount: { increment: 1 } },
      });
    }
  } catch (error) {
    console.error("Analytics error:", error);
  }
}

export async function recordActivity({ userId, action, entity, entityId, changes = null }) {
  try {
    await prisma.activity.create({
      data: { userId, action, entity, entityId, changes },
    });
  } catch (error) {
    console.error("Activity record error:", error);
  }
}
