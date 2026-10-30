import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { prisma } from '../shared/utils/prisma.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function exportSnapshot() {
  console.log('[SNAPSHOT] Connecting to database...');

  const models = [
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
    'avatar3D',
  ];

  const snapshot = {
    exportedAt: new Date().toISOString(),
    version: '1.0.0',
    data: {},
  };

  for (const model of models) {
    try {
      if (prisma[model]) {
        const records = await prisma[model].findMany();
        snapshot.data[model] = records;
        console.log(`[SNAPSHOT] Exported ${records.length} records from ${model}`);
      }
    } catch (err) {
      console.warn(`[SNAPSHOT] Warning exporting ${model}:`, err.message);
    }
  }

  const outPath = path.join(__dirname, 'database-snapshot.json');
  fs.writeFileSync(outPath, JSON.stringify(snapshot, null, 2), 'utf8');
  console.log(`[SNAPSHOT] Snapshot successfully saved to: ${outPath}`);
  process.exit(0);
}

exportSnapshot().catch((err) => {
  console.error('[SNAPSHOT] Failed to export snapshot:', err);
  process.exit(1);
});
