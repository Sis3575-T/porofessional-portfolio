import "server-only";
import { db } from "./db";
import type { Profile, Project, Skill } from "./types";

// Rows are copied into plain objects so they can be cached and serialized.

export async function selectProfile(): Promise<Profile | null> {
  const [row] = await db()`
    SELECT name, role, headline, bio, email, photo_url, social_links
    FROM profile WHERE id = 1`;
  if (!row) return null;
  return {
    name: row.name,
    role: row.role,
    headline: row.headline,
    bio: row.bio,
    email: row.email,
    photo_url: row.photo_url,
    social_links: Array.isArray(row.social_links) ? row.social_links : [],
  };
}

export async function selectProjects(onlyVisible: boolean): Promise<Project[]> {
  const sql = db();
  const rows = onlyVisible
    ? await sql`SELECT id, title, description, tech, link, image_url, position, visible
                FROM projects WHERE visible ORDER BY position`
    : await sql`SELECT id, title, description, tech, link, image_url, position, visible
                FROM projects ORDER BY position`;
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    tech: [...r.tech],
    link: r.link,
    image_url: r.image_url,
    position: r.position,
    visible: r.visible,
  }));
}

export async function selectSkills(): Promise<Skill[]> {
  const rows = await db()`SELECT id, group_name, name, position FROM skills ORDER BY position`;
  return rows.map((r) => ({ id: r.id, group_name: r.group_name, name: r.name, position: r.position }));
}
