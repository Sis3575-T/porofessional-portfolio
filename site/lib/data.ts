import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { selectProfile, selectProjects, selectSkills } from "./queries";
import type { SkillGroup } from "./types";

export const PORTFOLIO_TAG = "portfolio";

// Cached until an admin save calls updateTag(PORTFOLIO_TAG).
export async function getPortfolio() {
  "use cache";
  cacheTag(PORTFOLIO_TAG);
  cacheLife("max");

  const [profile, projects, skills] = await Promise.all([
    selectProfile(),
    selectProjects(true),
    selectSkills(),
  ]);

  const groups: SkillGroup[] = [];
  for (const s of skills) {
    const g = groups.find((x) => x.group === s.group_name);
    if (g) g.skills.push(s.name);
    else groups.push({ group: s.group_name, skills: [s.name] });
  }

  return { profile, projects, skillGroups: groups };
}

export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}
