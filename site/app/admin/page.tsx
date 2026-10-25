import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { selectProfile, selectProjects, selectSkills } from "@/lib/queries";
import {
  deleteProject,
  deleteSkill,
  logout,
  moveProject,
  moveSkill,
  removePhoto,
  saveProfile,
  saveProject,
  saveSkill,
  uploadPhoto,
} from "./actions";
import { ActionForm } from "./_components/ActionForm";
import { Field } from "./_components/Field";
import styles from "./admin.module.css";
import type { Project, Skill } from "@/lib/types";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/avif";

export default function AdminPage() {
  return (
    <Suspense fallback={<main className="container section">Loading…</main>}>
      <Dashboard />
    </Suspense>
  );
}

async function Dashboard() {
  await requireAdmin();
  const [profile, projects, skills] = await Promise.all([selectProfile(), selectProjects(false), selectSkills()]);

  return (
    <main className={`container ${styles.admin}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>Admin</h1>
        <div className={styles.headerActions}>
          <a href="/" className="btn btn--small" target="_blank" rel="noopener noreferrer">View site</a>
          <form action={logout}>
            <button type="submit" className="btn btn--small">Sign out</button>
          </form>
        </div>
      </header>

      <section className={styles.panel} aria-labelledby="profile-h">
        <h2 id="profile-h">Profile</h2>
        <ActionForm action={saveProfile} submitLabel="Save profile" variant="solid" className={styles.stack}>
          <div className={styles.row2}>
            <Field label="Name" name="name" defaultValue={profile?.name} required maxLength={100} />
            <Field label="Role" name="role" defaultValue={profile?.role} required maxLength={100} />
          </div>
          <Field label="Headline" name="headline" defaultValue={profile?.headline} maxLength={200} />
          <Field label="Bio" name="bio" defaultValue={profile?.bio} multiline rows={6} maxLength={4000} hint="Separate paragraphs with a blank line." />
          <Field label="Email" name="email" type="email" defaultValue={profile?.email} required maxLength={254} />
          <Field
            label="Social links"
            name="social_links"
            multiline
            rows={4}
            defaultValue={profile?.social_links.map((l) => `${l.label} | ${l.url}`).join("\n")}
            hint="One per line: Label | https://url"
          />
        </ActionForm>

        <div className={styles.photoRow}>
          {profile?.photo_url ? (
            <Image src={profile.photo_url} alt="Current photo" width={96} height={96} className={styles.thumb} />
          ) : (
            <div className={`${styles.thumb} ${styles.thumbEmpty}`}>No photo</div>
          )}
          <ActionForm action={uploadPhoto} submitLabel="Upload photo" pendingLabel="Uploading…" className={styles.stack}>
            <div className={styles.field}>
              <label htmlFor="photo">Photo</label>
              <input id="photo" name="photo" type="file" accept={IMAGE_ACCEPT} required aria-describedby="photo-hint" />
              <p id="photo-hint" className={styles.hint}>JPEG, PNG, WebP or AVIF, up to 4 MB. Square works best.</p>
            </div>
          </ActionForm>
          {profile?.photo_url ? (
            <ActionForm action={removePhoto} submitLabel="Remove photo" confirmText="Remove the current photo?" />
          ) : null}
        </div>
      </section>

      <section className={styles.panel} aria-labelledby="projects-h">
        <h2 id="projects-h">Projects</h2>
        <ol className={styles.list}>
          {projects.map((p, i) => (
            <li key={p.id} className={styles.item}>
              <details>
                <summary>
                  <span>{p.title}</span>
                  {!p.visible ? <span className="label">Hidden</span> : null}
                </summary>
                <ProjectFields project={p} />
              </details>
              <div className={styles.itemActions}>
                <MoveButtons id={p.id} action={moveProject} first={i === 0} last={i === projects.length - 1} label={p.title} />
                <ActionForm action={deleteProject} submitLabel="Delete" pendingLabel="Deleting…" confirmText={`Delete "${p.title}" permanently?`} compact>
                  <input type="hidden" name="id" value={p.id} />
                </ActionForm>
              </div>
            </li>
          ))}
        </ol>
        <details className={styles.add}>
          <summary>Add project</summary>
          <ProjectFields />
        </details>
      </section>

      <section className={styles.panel} aria-labelledby="skills-h">
        <h2 id="skills-h">Skills</h2>
        <ol className={styles.list}>
          {skills.map((s, i) => (
            <li key={s.id} className={styles.item}>
              <SkillFields skill={s} />
              <div className={styles.itemActions}>
                <MoveButtons id={s.id} action={moveSkill} first={i === 0} last={i === skills.length - 1} label={s.name} />
                <ActionForm action={deleteSkill} submitLabel="Delete" pendingLabel="Deleting…" confirmText={`Delete "${s.name}"?`} compact>
                  <input type="hidden" name="id" value={s.id} />
                </ActionForm>
              </div>
            </li>
          ))}
        </ol>
        <div className={styles.add}>
          <h3 className="label">Add skill</h3>
          <SkillFields />
        </div>
      </section>
    </main>
  );
}

function ProjectFields({ project }: { project?: Project }) {
  const prefix = project ? `p${project.id}-` : "new-project-";
  return (
    <ActionForm action={saveProject} submitLabel={project ? "Save project" : "Add project"} variant="solid" className={styles.stack}>
      {project ? <input type="hidden" name="id" value={project.id} /> : null}
      <Field idPrefix={prefix} label="Title" name="title" defaultValue={project?.title} required maxLength={120} />
      <Field idPrefix={prefix} label="Description" name="description" defaultValue={project?.description} multiline rows={3} maxLength={1000} />
      <Field idPrefix={prefix} label="Tech" name="tech" defaultValue={project?.tech.join(", ")} hint="Comma separated." />
      <Field idPrefix={prefix} label="Link" name="link" type="url" defaultValue={project?.link} hint="https://…" />
      <Field idPrefix={prefix} label="Image URL" name="image_url" defaultValue={project?.image_url} hint="Filled automatically when you upload. Clear it to remove the image." />
      <div className={styles.field}>
        <label htmlFor={`${prefix}image`}>Upload image</label>
        <input id={`${prefix}image`} name="image" type="file" accept={IMAGE_ACCEPT} />
      </div>
      <label className={styles.check}>
        <input type="checkbox" name="visible" defaultChecked={project?.visible ?? true} /> Visible on site
      </label>
    </ActionForm>
  );
}

function SkillFields({ skill }: { skill?: Skill }) {
  const prefix = skill ? `s${skill.id}-` : "new-skill-";
  return (
    <ActionForm action={saveSkill} submitLabel={skill ? "Save" : "Add skill"} className={styles.inline}>
      {skill ? <input type="hidden" name="id" value={skill.id} /> : null}
      <Field idPrefix={prefix} label="Group" name="group_name" defaultValue={skill?.group_name} required maxLength={60} />
      <Field idPrefix={prefix} label="Skill" name="name" defaultValue={skill?.name} required maxLength={60} />
    </ActionForm>
  );
}

function MoveButtons({
  id,
  action,
  first,
  last,
  label,
}: {
  id: number;
  action: typeof moveProject;
  first: boolean;
  last: boolean;
  label: string;
}) {
  return (
    <>
      {!first ? (
        <ActionForm action={action} submitLabel="↑ Up" pendingLabel="Moving…" compact>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="direction" value="up" />
          <span className="visually-hidden">Move {label} up</span>
        </ActionForm>
      ) : null}
      {!last ? (
        <ActionForm action={action} submitLabel="↓ Down" pendingLabel="Moving…" compact>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="direction" value="down" />
          <span className="visually-hidden">Move {label} down</span>
        </ActionForm>
      ) : null}
    </>
  );
}
