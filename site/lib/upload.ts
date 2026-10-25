import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { del, put } from "@vercel/blob";
import { db } from "@/lib/db";

export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // Vercel functions accept 4.5 MB bodies.

const TYPES: Record<string, { ext: string; magic: (b: Uint8Array) => boolean }> = {
  "image/jpeg": { ext: "jpg", magic: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  "image/png": { ext: "png", magic: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
  "image/webp": {
    ext: "webp",
    magic: (b) => ascii(b, 0, 4) === "RIFF" && ascii(b, 8, 12) === "WEBP",
  },
  "image/avif": { ext: "avif", magic: (b) => ascii(b, 4, 8) === "ftyp" && /^avi[fs]$/.test(ascii(b, 8, 12)) },
};

function ascii(b: Uint8Array, start: number, end: number): string {
  return String.fromCharCode(...b.subarray(start, end));
}

export function hasFile(value: FormDataEntryValue | null): value is File {
  return value instanceof File && value.size > 0;
}

// Validates type (declared and actual bytes) and size, stores the file and returns its URL.
export async function storeImage(file: File, folder: string): Promise<string> {
  const type = TYPES[file.type];
  if (!type) throw new UploadError("Use a JPEG, PNG, WebP or AVIF image.");
  if (file.size > MAX_UPLOAD_BYTES) throw new UploadError("Image must be 4 MB or smaller.");

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!type.magic(bytes)) throw new UploadError("File content does not match its image type.");

  const name = `${folder}/${randomUUID()}.${type.ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(name, Buffer.from(bytes), {
      access: "public",
      contentType: file.type,
      addRandomSuffix: false,
    });
    return blob.url;
  }

  // Local development fallback only; Vercel's filesystem is read-only.
  if (process.env.NODE_ENV !== "production") {
    const target = path.join(process.cwd(), "public", "uploads", name);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, bytes);
    return `/uploads/${name}`;
  }

  throw new UploadError("BLOB_READ_WRITE_TOKEN is not set.");
}

const OWNED_PATH = /^\/(?:profile|projects)\/[0-9a-f-]{36}\.(?:jpg|png|webp|avif)$/;

// Only files this app uploaded (our folder/UUID naming, in our own Blob store) may be deleted.
function isOwnedUpload(url: string): boolean {
  if (url.startsWith("/uploads/")) {
    return process.env.NODE_ENV !== "production" && OWNED_PATH.test(url.slice("/uploads".length));
  }
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const storeId = token?.split("_")[3];
  if (!storeId) return false;
  try {
    const u = new URL(url);
    return (
      u.protocol === "https:" &&
      u.hostname === `${storeId.toLowerCase()}.public.blob.vercel-storage.com` &&
      OWNED_PATH.test(u.pathname)
    );
  } catch {
    return false;
  }
}

// Deletes a stored image once no profile or project row references it, so only current files are kept.
export async function removeImage(url: string | null | undefined): Promise<void> {
  if (!url || !isOwnedUpload(url)) return;
  try {
    const [inUse] = await db()`
      SELECT 1 FROM profile WHERE photo_url = ${url}
      UNION ALL SELECT 1 FROM projects WHERE image_url = ${url}
      LIMIT 1`;
    if (inUse) return;
    if (url.startsWith("/uploads/")) await unlink(path.join(process.cwd(), "public", url));
    else await del(url);
  } catch (err) {
    console.error("Failed to remove image", err);
  }
}

export class UploadError extends Error {}
