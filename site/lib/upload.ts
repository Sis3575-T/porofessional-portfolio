import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { del, put } from "@vercel/blob";

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
    const blob = await put(name, Buffer.from(bytes), { access: "public", contentType: file.type });
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

// Removes a previously stored image so only current files are kept.
export async function removeImage(url: string | null | undefined): Promise<void> {
  if (!url) return;
  try {
    if (url.startsWith("https://") && process.env.BLOB_READ_WRITE_TOKEN) await del(url);
    else if (url.startsWith("/uploads/") && process.env.NODE_ENV !== "production") {
      await unlink(path.join(process.cwd(), "public", url));
    }
  } catch (err) {
    console.error("Failed to remove image", err);
  }
}

export class UploadError extends Error {}
