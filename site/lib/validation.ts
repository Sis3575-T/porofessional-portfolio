import { z } from "zod";

const BLOB_HOST_SUFFIX = ".public.blob.vercel-storage.com";

const httpUrl = z.url({ protocol: /^https?$/, hostname: z.regexes.domain }).max(500);

// Images must be local (/public) or in Vercel Blob so next/image can optimise them.
export const imageUrl = z
  .string()
  .trim()
  .max(500)
  .refine((v) => {
    if (/^\/(?!\/)[\w\-./]+$/.test(v)) return true;
    try {
      const u = new URL(v);
      return u.protocol === "https:" && u.hostname.endsWith(BLOB_HOST_SUFFIX);
    } catch {
      return false;
    }
  }, "Image must be a /path in public or a Vercel Blob URL.");

const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess((v) => (v === undefined || (typeof v === "string" && v.trim() === "") ? null : v), schema.nullable());

const str = (max: number) => z.string().trim().max(max);
const required = (label: string, max: number) => z.string().trim().min(1, `${label} is required.`).max(max);

export const socialLinksField = z.preprocess(
  (v) =>
    String(v ?? "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [label, ...rest] = line.split("|");
        return { label: label?.trim() ?? "", url: rest.join("|").trim() };
      }),
  z
    .array(z.object({ label: required("Link label", 40), url: httpUrl }))
    .max(12, "At most 12 social links."),
);

export const profileSchema = z.object({
  name: required("Name", 100),
  role: required("Role", 100),
  headline: str(200),
  bio: str(4000),
  email: z.email("Enter a valid email.").max(254),
  social_links: socialLinksField,
});

const id = z.coerce.number().int().positive();

export const projectSchema = z.object({
  id: optional(id),
  title: required("Title", 120),
  description: str(1000),
  tech: z.preprocess(
    (v) =>
      String(v ?? "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    z.array(z.string().max(40)).max(20, "At most 20 tech tags."),
  ),
  link: optional(httpUrl),
  image_url: optional(imageUrl),
  visible: z.preprocess((v) => v === "on" || v === "true", z.boolean()),
});

export const skillSchema = z.object({
  id: optional(id),
  group_name: required("Group", 60),
  name: required("Skill", 60),
});

export const idSchema = z.object({ id });

export const moveSchema = z.object({ id, direction: z.enum(["up", "down"]) });

export const loginSchema = z.object({
  email: z.email().max(254),
  password: z.string().min(1).max(200),
});

export function firstError(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Invalid input.";
}
