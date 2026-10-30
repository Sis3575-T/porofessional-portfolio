import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { prisma } from '../shared/utils/prisma.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function restoreSnapshot() {
  const snapshotPath = path.join(__dirname, 'database-snapshot.json');
  if (!fs.existsSync(snapshotPath)) {
    console.error(`[RESTORE] Snapshot file not found at: ${snapshotPath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(snapshotPath, 'utf8');
  const { data } = JSON.parse(raw);

  console.log('[RESTORE] Restoring database from snapshot...');

  const modelOrder = [
    'user',
    'hero',
    'about',
    'skill',
    'service',
    'experience',
    'education',
    'project',
    'testimonial',
    'contactMessage',
    'setting',
    'mediaAsset',
    'statistic',
  ];

  for (const model of modelOrder) {
    const records = data[model];
    if (!Array.isArray(records) || records.length === 0) continue;

    console.log(`[RESTORE] Processing ${records.length} records for ${model}...`);
    for (const record of records) {
      const dataToSave = { ...record };

      // Parse date fields if present
      for (const key of Object.keys(dataToSave)) {
        if (
          (key.toLowerCase().includes('date') || key === 'createdAt' || key === 'updatedAt' || key === 'lastLogin') &&
          dataToSave[key] &&
          typeof dataToSave[key] === 'string'
        ) {
          dataToSave[key] = new Date(dataToSave[key]);
        }
      }

      try {
        if (dataToSave.id) {
          await prisma[model].upsert({
            where: { id: dataToSave.id },
            update: dataToSave,
            create: dataToSave,
          });
        } else if (model === 'user' && dataToSave.email) {
          await prisma.user.upsert({
            where: { email: dataToSave.email },
            update: dataToSave,
            create: dataToSave,
          });
        }
      } catch (err) {
        console.warn(`[RESTORE] Could not upsert record ${dataToSave.id || 'unknown'} in ${model}:`, err.message);
      }
    }
  }

  console.log('[RESTORE] Database snapshot restoration complete!');
  process.exit(0);
}

restoreSnapshot().catch((err) => {
  console.error('[RESTORE] Snapshot restoration failed:', err);
  process.exit(1);
});
