import "server-only";
import { createHash, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "./db";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession, verifySession } from "./session";

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  keylen: number,
  options: { N: number; r: number; p: number },
) => Promise<Buffer>;

function safeEqual(a: Buffer, b: Buffer): boolean {
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function verifyCredentials(email: string, password: string): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const stored = process.env.ADMIN_PASSWORD_HASH;
  if (!adminEmail || !stored) throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD_HASH must be set.");

  const [scheme, saltHex, hashHex] = stored.split(":");
  if (scheme !== "scrypt" || !saltHex || !hashHex) throw new Error("ADMIN_PASSWORD_HASH has an invalid format.");

  // Always run scrypt so timing does not reveal whether the email matched.
  const derived = await scryptAsync(password, Buffer.from(saltHex, "hex"), 64, { N: 16384, r: 8, p: 1 });
  const passwordOk = safeEqual(derived, Buffer.from(hashHex, "hex"));
  const emailOk = safeEqual(
    Buffer.from(email.trim().toLowerCase()),
    Buffer.from(adminEmail.trim().toLowerCase()),
  );
  return passwordOk && emailOk;
}

export async function createSession(): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, await signSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession(): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, "", { path: "/admin", maxAge: 0 });
}

export async function isAdmin(): Promise<boolean> {
  return verifySession((await cookies()).get(SESSION_COOKIE)?.value);
}

// Call at the top of every admin page and server action.
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}

const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;

// On Vercel, x-forwarded-for is set by the platform (client-supplied values are overwritten).
async function clientKey(): Promise<string> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  return createHash("sha256").update(`${process.env.SESSION_SECRET}:${ip}`).digest("hex");
}

async function bump(key: string, max: number): Promise<number> {
  const [row] = await db()`
    INSERT INTO login_attempts (key, attempts, window_start)
    VALUES (${key}, 1, now())
    ON CONFLICT (key) DO UPDATE SET
      attempts = CASE WHEN login_attempts.window_start < now() - make_interval(mins => ${WINDOW_MINUTES})
                      THEN 1 ELSE login_attempts.attempts + 1 END,
      window_start = CASE WHEN login_attempts.window_start < now() - make_interval(mins => ${WINDOW_MINUTES})
                          THEN now() ELSE login_attempts.window_start END
    RETURNING attempts,
      ceil(extract(epoch FROM (window_start + make_interval(mins => ${WINDOW_MINUTES}) - now())) / 60)::int AS wait`;
  return row.attempts > max ? Math.max(1, row.wait) : 0;
}

// Fixed-window limiter per client: returns minutes to wait, or 0 if the attempt is allowed.
// No global cap on purpose: it would let anyone lock the owner out.
export async function registerLoginAttempt(): Promise<number> {
  await db()`DELETE FROM login_attempts WHERE window_start < now() - interval '1 day'`;
  return bump(await clientKey(), MAX_ATTEMPTS);
}

export async function clearLoginAttempts(): Promise<void> {
  const key = await clientKey();
  await db()`DELETE FROM login_attempts WHERE key = ${key}`;
}
