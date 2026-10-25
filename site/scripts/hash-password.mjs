// Prints a value for ADMIN_PASSWORD_HASH. Usage: npm run hash-password -- "your password"
import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";

const password = process.argv[2];
if (!password || password.length < 12) {
  console.error('Usage: npm run hash-password -- "a password of 12+ characters"');
  process.exit(1);
}

const salt = randomBytes(16);
const hash = await promisify(scrypt)(password, salt, 64, { N: 16384, r: 8, p: 1 });
console.log(`scrypt:${salt.toString("hex")}:${hash.toString("hex")}`);
