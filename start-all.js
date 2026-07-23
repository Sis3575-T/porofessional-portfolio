import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const child = spawn('node', [join(__dirname, 'services/backend/src/server.js')], {
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: '5000',
    NODE_ENV: 'production',
  },
});

child.on('error', (err) => {
  console.error('[backend] Error:', err.message);
});

console.log('[backend] Started on port 5000');
