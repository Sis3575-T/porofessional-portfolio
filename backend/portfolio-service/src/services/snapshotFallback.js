import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const snapshotPath = path.join(__dirname, "../../../prisma/database-snapshot.json");

let cachedSnapshot = null;

export function getSnapshotData(modelKey) {
  try {
    if (!cachedSnapshot && fs.existsSync(snapshotPath)) {
      const raw = fs.readFileSync(snapshotPath, "utf8");
      cachedSnapshot = JSON.parse(raw);
    }
    if (cachedSnapshot?.data?.[modelKey]) {
      return cachedSnapshot.data[modelKey];
    }
  } catch (err) {
    console.warn(`[SNAPSHOT] Could not read snapshot for ${modelKey}:`, err.message);
  }
  return null;
}
