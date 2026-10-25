"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import {
  clearLoginAttempts,
  createSession,
  destroySession,
  registerLoginAttempt,
  requireAdmin,
  verifyCredentials,
} from "@/lib/auth";
import { PORTFOLIO_TAG } from "@/lib/data";
import { db } from "@/lib/db";
import type { ActionState } from "@/lib/types";
import { hasFile, removeImage, storeImage, UploadError } from "@/lib/upload";
import {
  firstError,
  idSchema,
  loginSchema,
  moveSchema,
  profileSchema,
  projectSchema,
  skillSchema,
} from "@/lib/validation";

const ok = (message: string): ActionState => ({ ok: true, message });
const fail = (message: string): ActionState => ({ ok: false, message });

// On-demand revalidation: the public page is rebuilt on the next request.
function refresh() {
  updateTag(PORTFOLIO_TAG);
  revalidatePath("/");
  revalidatePath("/admin");
}

async function guarded(run: () => Promise<ActionState>): Promise<ActionState> {
  await requireAdmin();
  try {
    return await run();
  } catch (err) {
    if (err instanceof UploadError) return fail(err.message);
    if (typeof err === "object" && err && "code" in err && err.code === "23505") {
      return fail("That entry already exists.");
    }
    console.error(err);
    return fail("Something went wrong. Please try again.");
  }
}

export async function login(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const wait = await registerLoginAttempt();
  if (wait > 0) return fail(`Too many attempts. Try again in ${wait} minute${wait === 1 ? "" : "s"}.`);

  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success || !(await verifyCredentials(parsed.data.email, parsed.data.password))) {
    return fail("Incorrect email or password.");
  }

  await clearLoginAttempts();
  await createSession();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}

export async function saveProfile(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const parsed = profileSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) return fail(firstError(parsed.error));
    const p = parsed.data;
    const sql = db();
    await sql`
      INSERT INTO profile (id, name, role, headline, bio, email, social_links)
      VALUES (1, ${p.name}, ${p.role}, ${p.headline}, ${p.bio}, ${p.email}, ${sql.json(p.social_links)})
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name, role = EXCLUDED.role, headline = EXCLUDED.headline,
        bio = EXCLUDED.bio, email = EXCLUDED.email, social_links = EXCLUDED.social_links`;
    refresh();
    return ok("Profile saved.");
  });
}

export async function uploadPhoto(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const file = formData.get("photo");
    if (!hasFile(file)) return fail("Choose an image to upload.");
    const sql = db();
    const [current] = await sql`SELECT photo_url FROM profile WHERE id = 1`;
    if (!current) return fail("Save the profile before uploading a photo.");
    const url = await storeImage(file, "profile");
    await sql`UPDATE profile SET photo_url = ${url} WHERE id = 1`;
    await removeImage(current.photo_url);
    refresh();
    return ok("Photo updated.");
  });
}

export async function removePhoto(): Promise<ActionState> {
  return guarded(async () => {
    const [current] = await db()`
      UPDATE profile p SET photo_url = NULL FROM profile old
      WHERE p.id = 1 AND old.id = 1 RETURNING old.photo_url`;
    await removeImage(current?.photo_url);
    refresh();
    return ok("Photo removed.");
  });
}

export async function saveProject(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const parsed = projectSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) return fail(firstError(parsed.error));
    const p = parsed.data;
    const sql = db();

    const file = formData.get("image");
    const uploaded = hasFile(file) ? await storeImage(file, "projects") : null;
    const imageUrl = uploaded ?? p.image_url;

    if (p.id) {
      const [old] = await sql`
        UPDATE projects n SET title = ${p.title}, description = ${p.description}, tech = ${p.tech},
          link = ${p.link}, image_url = ${imageUrl}, visible = ${p.visible}
        FROM projects o WHERE n.id = ${p.id} AND o.id = n.id
        RETURNING o.image_url AS old_image`;
      if (!old) {
        await removeImage(uploaded);
        return fail("Project not found.");
      }
      if (old.old_image !== imageUrl) await removeImage(old.old_image);
    } else {
      await sql`
        INSERT INTO projects (title, description, tech, link, image_url, visible, position)
        VALUES (${p.title}, ${p.description}, ${p.tech}, ${p.link}, ${imageUrl}, ${p.visible},
                (SELECT coalesce(max(position), 0) + 1 FROM projects))`;
    }
    refresh();
    return ok(p.id ? "Project saved." : "Project added.");
  });
}

export async function deleteProject(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const parsed = idSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) return fail("Invalid project.");
    const [row] = await db()`DELETE FROM projects WHERE id = ${parsed.data.id} RETURNING image_url`;
    if (row) await removeImage(row.image_url);
    refresh();
    return ok("Project deleted.");
  });
}

export async function saveSkill(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const parsed = skillSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) return fail(firstError(parsed.error));
    const s = parsed.data;
    const sql = db();
    if (s.id) {
      const rows = await sql`
        UPDATE skills SET group_name = ${s.group_name}, name = ${s.name} WHERE id = ${s.id} RETURNING id`;
      if (!rows.length) return fail("Skill not found.");
    } else {
      await sql`
        INSERT INTO skills (group_name, name, position)
        VALUES (${s.group_name}, ${s.name}, (SELECT coalesce(max(position), 0) + 1 FROM skills))`;
    }
    refresh();
    return ok(s.id ? "Skill saved." : "Skill added.");
  });
}

export async function deleteSkill(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const parsed = idSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) return fail("Invalid skill.");
    await db()`DELETE FROM skills WHERE id = ${parsed.data.id}`;
    refresh();
    return ok("Skill deleted.");
  });
}

// Swaps position with the neighbouring row; the deferred unique constraint allows the swap.
async function move(table: "projects" | "skills", formData: FormData): Promise<ActionState> {
  const parsed = moveSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail("Invalid move.");
  const { id, direction } = parsed.data;

  const moved = await db().begin(async (tx) => {
    const [cur] = await tx`SELECT position FROM ${tx(table)} WHERE id = ${id} FOR UPDATE`;
    if (!cur) return false;
    const [next] =
      direction === "up"
        ? await tx`SELECT id, position FROM ${tx(table)} WHERE position < ${cur.position}
                   ORDER BY position DESC LIMIT 1 FOR UPDATE`
        : await tx`SELECT id, position FROM ${tx(table)} WHERE position > ${cur.position}
                   ORDER BY position ASC LIMIT 1 FOR UPDATE`;
    if (!next) return false;
    await tx`UPDATE ${tx(table)} SET position = ${next.position} WHERE id = ${id}`;
    await tx`UPDATE ${tx(table)} SET position = ${cur.position} WHERE id = ${next.id}`;
    return true;
  });

  if (moved) refresh();
  return moved ? ok("Order updated.") : ok("Already at the edge.");
}

export async function moveProject(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(() => move("projects", formData));
}

export async function moveSkill(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return guarded(() => move("skills", formData));
}
