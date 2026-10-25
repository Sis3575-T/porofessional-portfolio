// Inserts your real content once. Re-running never overwrites or duplicates:
// the profile is only inserted if missing, and projects/skills only if their
// table is empty. After seeding, edit everything from /admin.
// Usage: npm run db:seed
import postgres from "postgres";

// ---- Your content. Edit before the first run; afterwards edit from /admin. --
const profile = {
  name: "Sisay Temesgen",
  role: "Full Stack Developer",
  headline:
    "I build responsive web applications with modern technologies. Passionate about clean code and user experience.",
  bio: [
    "I'm a full-stack developer based in Addis Ababa, Ethiopia. I love solving complex problems and creating intuitive user interfaces.",
    "I specialise in React, Node.js and modern web technologies, and I'm always learning and exploring new tools.",
  ].join("\n\n"),
  // TODO: replace with the address you want shown publicly.
  email: "you@example.com",
  // Served from /public; upload a new one from /admin (stored in Vercel Blob).
  photo_url: "/profile.webp",
  social_links: [{ label: "GitHub", url: "https://github.com/Sis3575-T" }],
};

// Listed in display order. Groups appear in the order they first occur.
const skills = [
  { group_name: "Frontend", name: "React" },
  { group_name: "Frontend", name: "Next.js" },
  { group_name: "Frontend", name: "Tailwind CSS" },
  { group_name: "Languages", name: "TypeScript" },
  { group_name: "Languages", name: "JavaScript" },
  { group_name: "Languages", name: "Python" },
  { group_name: "Backend", name: "Node.js" },
  { group_name: "Backend", name: "Express" },
  { group_name: "Backend", name: "Prisma" },
  { group_name: "Databases", name: "PostgreSQL" },
  { group_name: "Databases", name: "MongoDB" },
  { group_name: "DevOps & Tools", name: "Docker" },
  { group_name: "DevOps & Tools", name: "AWS" },
  { group_name: "DevOps & Tools", name: "Git" },
];

// Listed in display order. image_url must be null, a path in /public, or a
// Vercel Blob URL; you can also upload images later from /admin.
const projects = [
  {
    title: "Ethio Tourist Destination",
    description:
      "Full-stack tourism platform for East Africa: destination explorer with filters, personalised trip recommendations, booking flow and a traveller dashboard.",
    tech: ["React", "Vite", "Tailwind CSS", "Node.js", "Express", "MongoDB"],
    link: "https://tourist-destination-eight.vercel.app",
    image_url: null,
  },
  {
    title: "Abay Grand Hotel",
    description: "Hotel website with a guest-facing frontend, an admin panel and a Node.js backend, containerised with Docker.",
    tech: ["JavaScript", "Node.js", "Docker"],
    link: "https://abay-grand-hotel-1.vercel.app",
    image_url: null,
  },
  {
    title: "AI Digital Life Manager",
    description:
      "In progress: a secure personal document vault that understands its contents through OCR, extraction and AI analysis, with reminders and tasks.",
    tech: ["TypeScript"],
    link: "https://github.com/Sis3575-T/AI-document-assistant-storage",
    image_url: null,
  },
];
// ---------------------------------------------------------------------------

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const sql = postgres(process.env.DATABASE_URL, { max: 1 });

try {
  await sql.begin(async (tx) => {
    const inserted = await tx`
      INSERT INTO profile (id, name, role, headline, bio, email, photo_url, social_links)
      VALUES (1, ${profile.name}, ${profile.role}, ${profile.headline}, ${profile.bio},
              ${profile.email}, ${profile.photo_url}, ${tx.json(profile.social_links)})
      ON CONFLICT (id) DO NOTHING
      RETURNING id`;
    console.log(inserted.length ? "Profile inserted." : "Profile exists, skipped.");

    const [{ count: projectCount }] = await tx`SELECT count(*)::int AS count FROM projects`;
    if (projectCount === 0) {
      for (const [i, p] of projects.entries()) {
        await tx`
          INSERT INTO projects (title, description, tech, link, image_url, position, visible)
          VALUES (${p.title}, ${p.description}, ${p.tech}, ${p.link}, ${p.image_url}, ${i + 1}, true)`;
      }
      console.log(`${projects.length} projects inserted.`);
    } else {
      console.log("Projects exist, skipped.");
    }

    const [{ count: skillCount }] = await tx`SELECT count(*)::int AS count FROM skills`;
    if (skillCount === 0) {
      for (const [i, s] of skills.entries()) {
        await tx`
          INSERT INTO skills (group_name, name, position)
          VALUES (${s.group_name}, ${s.name}, ${i + 1})`;
      }
      console.log(`${skills.length} skills inserted.`);
    } else {
      console.log("Skills exist, skipped.");
    }
  });
} finally {
  await sql.end();
}
