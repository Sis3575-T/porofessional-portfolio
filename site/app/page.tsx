import Image from "next/image";
import { CopyButton } from "@/app/components/CopyButton";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import { getPortfolio } from "@/lib/data";

export default async function HomePage() {
  const { profile, projects, skillGroups } = await getPortfolio();

  if (!profile) {
    return (
      <main className="container section">
        <h1>Portfolio coming soon</h1>
        <p className="muted">Run the seed script or sign in to the admin to add content.</p>
      </main>
    );
  }

  const initials = profile.name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="topbar">
        <nav className="container topbar__inner" aria-label="Primary">
          <a href="#home" className="topbar__brand">
            {profile.name}
          </a>
          <ul className="topbar__links">
            <li><a href="#about">About</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <ThemeToggle />
        </nav>
      </header>

      <main id="main">
        <section id="home" className="container section hero" aria-labelledby="hero-name">
          <div className="hero__text">
            <p className="label">{profile.role}</p>
            <h1 id="hero-name">{profile.name}</h1>
            {profile.headline ? <p className="hero__headline">{profile.headline}</p> : null}
            <div className="hero__actions">
              <a href="#projects" className="btn btn--solid">View projects</a>
              <a href="#contact" className="btn">Get in touch</a>
            </div>
          </div>
          <div className="hero__photo tilt">
            {profile.photo_url ? (
              <Image
                src={profile.photo_url}
                alt={`Portrait of ${profile.name}`}
                width={320}
                height={320}
                sizes="(min-width: 768px) 320px, 240px"
                preload
                loading="eager"
                fetchPriority="high"
                className="photo"
              />
            ) : (
              <div className="photo photo--empty" aria-hidden="true">{initials}</div>
            )}
          </div>
        </section>

        <section id="about" className="container section" aria-labelledby="about-title">
          <h2 id="about-title" className="section__title"><span className="label">01</span>About</h2>
          <div className="about">
            <div className="prose">
              {profile.bio.split(/\n{2,}/).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            {skillGroups.length > 0 ? (
              <div className="skills">
                <h3 className="visually-hidden">Skills</h3>
                {skillGroups.map((g) => (
                  <div key={g.group} className="skills__group">
                    <h4 className="label">{g.group}</h4>
                    <ul className="tags">
                      {g.skills.map((s) => (
                        <li key={s} className="tag">{s}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        <section id="projects" className="container section" aria-labelledby="projects-title">
          <h2 id="projects-title" className="section__title"><span className="label">02</span>Projects</h2>
          {projects.length ? (
            <ul className="grid">
              {projects.map((p) => (
                <li key={p.id} className="card tilt">
                  {p.image_url ? (
                    <Image
                      src={p.image_url}
                      alt={`Screenshot of ${p.title}`}
                      width={800}
                      height={500}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="card__image"
                    />
                  ) : null}
                  <div className="card__body">
                    <h3 className="card__title">{p.title}</h3>
                    <p className="card__desc">{p.description}</p>
                    {p.tech.length ? (
                      <ul className="tags" aria-label="Tech used">
                        {p.tech.map((t) => (
                          <li key={t} className="tag">{t}</li>
                        ))}
                      </ul>
                    ) : null}
                    {p.link ? (
                      <a href={p.link} className="card__link" target="_blank" rel="noopener noreferrer">
                        View project<span className="visually-hidden">: {p.title} (opens in a new tab)</span>
                        <span aria-hidden="true"> ↗</span>
                      </a>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">Projects coming soon.</p>
          )}
        </section>

        <section id="contact" className="container section" aria-labelledby="contact-title">
          <h2 id="contact-title" className="section__title"><span className="label">03</span>Contact</h2>
          <div className="contact">
            <p className="label">Email</p>
            <div className="contact__email">
              <span className="email">{profile.email}</span>
              <CopyButton text={profile.email} label="Copy email" />
            </div>
            {profile.social_links.length ? (
              <ul className="socials" aria-label="Social links">
                {profile.social_links.map((l) => (
                  <li key={l.url}>
                    <a href={l.url} target="_blank" rel="me noopener noreferrer">
                      {l.label}<span className="visually-hidden"> (opens in a new tab)</span>
                      <span aria-hidden="true"> ↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>
      </main>

      <footer className="container footer">
        <p className="label">© {profile.name}</p>
      </footer>
    </>
  );
}
