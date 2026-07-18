# Portfolio Pro: Full Stack Portfolio Builder Prompt (50 Tasks)

## Project Vision
Build a premium, fully editable, full-stack portfolio website that looks modern, dark, polished, and immersive, with a 3D hero experience and a powerful admin panel. The design should feel high-end and professional, inspired by a dark futuristic aesthetic, but remain original.

The site must be built from scratch using:
- Frontend: React + Vite + Tailwind CSS + Framer Motion + Three.js
- Backend: Node.js + Express + Prisma + PostgreSQL
- Auth: JWT-based admin authentication
- Containerization: Docker + Docker Compose
- Architecture: Microservice-ready structure with separate services for auth, content, and media if needed
- Admin CMS: Every visible content section must be editable from the admin dashboard

Important: The goal is to create an original portfolio with the same professional visual direction, not to copy any image 1:1.

---

## Global Design System

### Color Palette
- Background: #050816
- Surface: #0F172A
- Card: #111827
- Card Alt: #1E293B
- Primary Accent: #22D3EE
- Secondary Accent: #8B5CF6
- Success: #10B981
- Warning: #F59E0B
- Danger: #EF4444
- Text Primary: #F8FAFC
- Text Secondary: #94A3B8
- Border: #334155

### Typography
- Headings: Inter, Poppins, or Space Grotesk
- Body: Inter
- Hero title size: 56–72px desktop, 36–48px mobile
- Section title: 32–40px
- Card title: 20–24px
- Body text: 16–18px
- Caption: 13–14px

### Spacing Scale
- 4, 8, 12, 16, 24, 32, 48, 64, 96, 128

### Border Radius
- Small: 8px
- Medium: 12px
- Large: 16px
- XL: 24px

### Shadow System
- Soft: 0 8px 24px rgba(0,0,0,0.25)
- Accent: 0 12px 40px rgba(34,211,238,0.15)
- Card Hover: 0 20px 50px rgba(0,0,0,0.35)

### Layout Width
- Max content width: 1280px
- Horizontal padding: 24px mobile, 32px tablet, 48px desktop

### Section Spacing
- Section gap: 96px desktop, 64px tablet, 48px mobile

---

## Master Prompt for AI Builder
Use the following as the main instruction for the implementation agent:

Create a premium full-stack portfolio website from scratch with a dark, futuristic, 3D-inspired design and a fully editable admin system. Build the frontend as a React + Vite application with Tailwind CSS, Framer Motion, and Three.js for the hero section. Build the backend as a Node.js + Express API using Prisma and PostgreSQL. Implement JWT-based authentication for an admin dashboard. Make all visible content editable from the admin panel, including hero, about, skills, services, experience, education, projects, testimonials, contact details, footer, and site settings. Containerize the app with Docker Compose. Ensure the final website is responsive, accessible, SEO-friendly, performant, secure, and polished. Use a highly professional visual language with glassmorphism, gradients, subtle glows, animated cards, layered sections, and interactive 3D elements.

---

# 50 Development Tasks

## Task 1 — Project Setup and Repository Structure
Objective: Initialize the monorepo or multi-service project structure.

Deliverables:
- Create a structured workspace with folders for frontend, backend, admin, docker, prisma, and documentation.
- Add package.json files for services.
- Set up environment variable templates.

Implementation Notes:
- Use a monorepo approach for faster delivery.
- Create folders:
  - apps/web
  - apps/admin
  - services/auth
  - services/content
  - services/media
  - prisma
  - docker

Acceptance Criteria:
- The project can be run locally with one Docker command.
- All folders and configs exist.

---

## Task 2 — Docker and Local Development Environment
Objective: Containerize the entire stack.

Deliverables:
- Dockerfile for frontend/admin/backend services.
- docker-compose.yml with PostgreSQL, Prisma, admin service, content service, frontend, and admin UI.

Implementation Notes:
- PostgreSQL should run in a container.
- Add healthchecks.
- Use named volumes for DB persistence.

Acceptance Criteria:
- Docker Compose starts the app successfully.
- The frontend, admin panel, and backend all connect correctly.

---

## Task 3 — Database Design with Prisma
Objective: Model the portfolio and admin system in PostgreSQL.

Deliverables:
- Prisma schema with models for User, Profile, Hero, About, Skill, Service, Experience, Education, Project, Testimonial, ContactMessage, Setting, MediaAsset, and ActivityLog.

Implementation Notes:
- Use Prisma relations properly.
- Use enums for roles and section status.

Acceptance Criteria:
- Prisma migrations can be generated and applied.
- All key content types are represented in the database.

---

## Task 4 — Authentication Service
Objective: Create secure admin login and JWT authentication.

Deliverables:
- Register and login endpoints.
- Password hashing with bcrypt.
- JWT creation and validation middleware.
- Admin-only route protection.

Acceptance Criteria:
- Admin can log in and receive a token.
- Protected routes reject unauthorized requests.

---

## Task 5 — Content Service API Design
Objective: Build a backend service that serves all portfolio content.

Deliverables:
- REST endpoints for fetching public content.
- CRUD endpoints for admin content editing.
- Filters for projects by category and featured status.

Suggested Endpoints:
- GET /api/hero
- GET /api/about
- GET /api/skills
- GET /api/services
- GET /api/experience
- GET /api/education
- GET /api/projects
- GET /api/projects/:slug
- GET /api/testimonials
- GET /api/settings
- POST /api/contact

Acceptance Criteria:
- Public routes return data correctly.
- Admin routes modify content successfully.

---

## Task 6 — Media Upload Service
Objective: Handle image upload for portfolio sections and admin assets.

Deliverables:
- Upload endpoint for portfolio images.
- Integration with Cloudinary or local upload storage.
- Image URL and public ID persistence in Prisma.

Acceptance Criteria:
- Admin can upload images and receive a valid URL.
- Images are stored and displayed correctly.

---

## Task 7 — Frontend Project Foundation
Objective: Scaffold the public-facing website.

Deliverables:
- React + Vite app.
- Tailwind configuration.
- Global styles and design tokens.
- Base layout with navbar and footer placeholders.

Acceptance Criteria:
- The app renders a blank but structured shell.
- Tailwind and global styles are active.

---

## Task 8 — Admin Panel Foundation
Objective: Create the admin dashboard shell.

Deliverables:
- Sidebar navigation.
- Topbar with logout and notifications area.
- Dashboard cards for stats.
- Protected route structure.

Acceptance Criteria:
- Admin can access the dashboard after login.
- Dashboard sections are clearly organized.

---

## Task 9 — Global Design Tokens and CSS Base
Objective: Define the visual system for the whole app.

Deliverables:
- Custom CSS variables for colors, spacing, radius, shadows, and typography.
- Base styles for body, headings, buttons, cards, and forms.

Implementation Notes:
- Use CSS variables so sections stay coordinated.
- Create a reusable component style foundation.

Acceptance Criteria:
- All components use shared design variables.
- The visual system is consistent across pages.

---

## Task 10 — Navbar and Mobile Menu
Objective: Create the top navigation.

Deliverables:
- Logo area.
- Navigation links for Home, About, Skills, Projects, Contact.
- Resume button.
- Mobile hamburger menu.
- Sticky behavior and scroll-based background change.

Acceptance Criteria:
- Navbar works on desktop and mobile.
- Smooth scrolling and active link state work properly.

---

## Task 11 — Hero Section UI
Objective: Build the first impression of the portfolio.

Deliverables:
- Greeting text.
- Developer name.
- Professional title.
- Short description.
- Primary and secondary buttons.
- Social links.
- A right-side 3D scene or animated visual.

UI Specs:
- Left content aligned vertically with 24px spacing.
- Buttons: primary cyan gradient, secondary dark outline.
- Main heading size 56–72px.
- Text shadow and glow effect subtle.

Acceptance Criteria:
- Hero section is visually strong and fully responsive.
- Content is editable from the admin panel.

---

## Task 12 — About Section
Objective: Present the biography and personal profile.

Deliverables:
- Profile image.
- Short biography.
- Key personal details.
- Download CV button.
- Optional contact button.

UI Specs:
- Two-column layout desktop, stacked mobile.
- Image card with border and glow.
- Section title with accent line.

Acceptance Criteria:
- The section looks polished and editable.
- Resume link can be configured from admin settings.

---

## Task 13 — Skills Section
Objective: Display technical skills professionally.

Deliverables:
- Category sections such as Frontend, Backend, Database, DevOps, Tools.
- Skill cards with name, level, and icon.
- Optional progress bars.

UI Specs:
- Card width 220–280px.
- Gap 16–24px.
- Hover effect with slight elevation.

Acceptance Criteria:
- Skills can be added, edited, deleted from admin.
- Sorting and grouping are functional.

---

## Task 14 — Services Section
Objective: Show the developer’s service offerings.

Deliverables:
- Service cards.
- Icon, title, description, and bullet features.
- CTA button.

UI Specs:
- 3-card grid desktop.
- Glass effect and soft glow.
- Padding 24px.

Acceptance Criteria:
- Services are configurable from admin and render correctly.

---

## Task 15 — Experience Timeline
Objective: Create a professional work history section.

Deliverables:
- Vertical timeline with company name, role, date range, and description.
- Optional technologies used.

UI Specs:
- Left accent bar with circular node.
- Spacing 24px between items.
- Card padding 24px.

Acceptance Criteria:
- Timeline items are editable from admin.
- Timeline is responsive and readable.

---

## Task 16 — Education Timeline
Objective: Present academic background.

Deliverables:
- Education items with institution, degree, date range, and description.
- Similar visual style as experience.

Acceptance Criteria:
- Education data can be added and changed by admin.

---

## Task 17 — Portfolio Projects Section
Objective: Showcase case studies and work examples.

Deliverables:
- Project cards with thumbnail, title, short description, tags, and action buttons.
- Filter by category or featured.
- Optional search bar.

UI Specs:
- 3-column desktop grid.
- Hover overlay with details.
- Border radius 16px.

Acceptance Criteria:
- Projects appear cleanly and are easy to manage from admin.

---

## Task 18 — Project Detail Page
Objective: Provide a dedicated details page for each project.

Deliverables:
- Banner image.
- Description section.
- Tech stack.
- Key features.
- Challenges and solutions.
- Live demo and GitHub links.

Acceptance Criteria:
- Each project can be opened in a detail view.
- Project content is editable from admin.

---

## Task 19 — Testimonials Section
Objective: Add social proof and client feedback.

Deliverables:
- Testimonial cards with avatar, name, role, company, review, and star rating.
- Optional carousel or slider.

UI Specs:
- Dark card background with accent border.
- Review text size 15–16px.

Acceptance Criteria:
- Testimonials render correctly and are editable in admin.

---

## Task 20 — Statistics and Metrics Section
Objective: Add visual credibility and impact.

Deliverables:
- Metrics like years of experience, projects completed, happy clients, technologies used.
- Animated counters.

UI Specs:
- Use 4 cards in a grid.
- Accent numbers in cyan.

Acceptance Criteria:
- Stats animate smoothly and are configurable.

---

## Task 21 — Contact Section
Objective: Create a working contact area.

Deliverables:
- Contact details card.
- Contact form with fields for name, email, subject, and message.
- Validation.
- Success/error message handling.

UI Specs:
- Two-column layout desktop.
- Soft glass cards.
- Input fields with dark backgrounds and border focus states.

Acceptance Criteria:
- Contact form submits to backend.
- Messages are saved in the database.

---

## Task 22 — Footer and Back-to-Top
Objective: Finish the page with a professional closing section.

Deliverables:
- Brand name.
- Short intro.
- Quick links.
- Social icons.
- Copyright text.
- Back-to-top button.

Acceptance Criteria:
- Footer is responsive and visually aligned with the rest of the site.

---

## Task 23 — 3D Hero Experience
Objective: Build a memorable hero scene.

Deliverables:
- A Three.js scene with floating or rotating 3D objects.
- Soft lighting and ambient glow.
- Lightweight rendering for performance.

Implementation Notes:
- Use a simplified 3D object if full complexity is too heavy.
- Disable heavy effects on low-end devices.

Acceptance Criteria:
- The hero feels modern and immersive.
- The scene does not hurt performance.

---

## Task 24 — Motion Design and Micro-Interactions
Objective: Add polished animations.

Deliverables:
- Fade-ins on section entrance.
- Hover animations for cards and buttons.
- Floating particles or subtle glow motion.
- Smooth page transitions.

Acceptance Criteria:
- Motion feels elegant, not distracting.
- Performance stays smooth.

---

## Task 25 — Responsive Layout System
Objective: Make the site look perfect on all devices.

Deliverables:
- Mobile, tablet, and desktop breakpoints.
- Responsive spacing and typography.
- Mobile navigation and stacked content sections.

Acceptance Criteria:
- The layout is clean and usable on 320px+ screens.

---

## Task 26 — Content Editing Models in Admin
Objective: Build admin forms for every editable section.

Deliverables:
- Forms for hero, about, skills, services, experience, education, projects, testimonials, settings, and contact information.
- Save buttons and status feedback.

Acceptance Criteria:
- Admin can update content without code changes.

---

## Task 27 — CMS Dashboard Analytics
Objective: Create an admin overview page.

Deliverables:
- Stats cards for projects, messages, skills, and visits.
- Recent activity list.
- Quick actions for content management.

Acceptance Criteria:
- The dashboard displays meaningful information.

---

## Task 28 — Settings Management
Objective: Make the site configuration editable.

Deliverables:
- Site title.
- Description.
- Meta tags.
- Social links.
- Contact details.
- Footer text.

Acceptance Criteria:
- Site settings can be updated from admin and immediately reflected on the frontend.

---

## Task 29 — Image Manager and Media Library
Objective: Build a media management experience.

Deliverables:
- Admin image uploader.
- List of uploaded assets.
- Ability to select an image for a section.

Acceptance Criteria:
- Images can be uploaded and reused across sections.

---

## Task 30 — Form Validation and Error Handling
Objective: Make forms robust and user-friendly.

Deliverables:
- Client-side validation for contact form and admin forms.
- Server-side validation for all API requests.
- Friendly error messages.

Acceptance Criteria:
- Invalid input is handled clearly.
- Errors are consistent and readable.

---

## Task 31 — SEO Basics
Objective: Improve discoverability.

Deliverables:
- Meta tags.
- Open Graph metadata.
- Title tags per page.
- Structured data where appropriate.

Acceptance Criteria:
- The portfolio is SEO ready.

---

## Task 32 — Accessibility and Keyboard Support
Objective: Make the site usable for everyone.

Deliverables:
- Proper semantic HTML.
- ARIA labels where needed.
- Focus states.
- Contrast improvements.
- Keyboard navigation support.

Acceptance Criteria:
- Core pages can be navigated by keyboard.
- Accessibility issues are notably reduced.

---

## Task 33 — Performance Optimization
Objective: Keep the site fast.

Deliverables:
- Lazy loading for images.
- Image compression.
- Code splitting.
- Optimized bundle size.
- Proper caching.

Acceptance Criteria:
- Page performance is good on both desktop and mobile.

---

## Task 34 — Security Hardening
Objective: Protect the app from common issues.

Deliverables:
- Helmet middleware.
- Rate limiting.
- JWT secret configuration.
- XSS-safe rendering.
- Input sanitization.

Acceptance Criteria:
- The app follows standard security practices.

---

## Task 35 — Search, Filter, and Sorting for Projects
Objective: Improve project discovery.

Deliverables:
- Search bar.
- Category filters.
- Featured sorting.
- Pagination or load more.

Acceptance Criteria:
- Visitors can browse projects easily.

---

## Task 36 — Loading States and Empty States
Objective: Make async behavior feel professional.

Deliverables:
- Skeleton loaders for content sections.
- Empty states for no projects or no testimonials.
- Error placeholders for failed fetches.

Acceptance Criteria:
- Users always get feedback when data is loading or absent.

---

## Task 37 — Error Boundaries and Route Handling
Objective: Prevent app crashes and improve resilience.

Deliverables:
- Global error boundary.
- Not-found page.
- Friendly 500 page.

Acceptance Criteria:
- Unexpected UI errors show a graceful fallback.

---

## Task 38 — Logging and Activity Tracking
Objective: Track admin activity and debugging events.

Deliverables:
- Activity log for create/update/delete actions.
- Backend logs for errors and requests.

Acceptance Criteria:
- Admin actions leave a trace in the system.

---

## Task 39 — Role-Based Access Control
Objective: Restrict access to admin features.

Deliverables:
- Super admin and editor roles.
- Different permissions for dashboard and content editing.

Acceptance Criteria:
- Unauthorized roles cannot modify protected content.

---

## Task 40 — Contact Message Management
Objective: Let admin manage inbound contacts.

Deliverables:
- Message list view.
- Message detail view.
- Mark as read or archived.

Acceptance Criteria:
- Admin can review incoming contact requests.

---

## Task 41 — Theme Toggle and Personalization
Objective: Add optional user preference controls.

Deliverables:
- Theme switcher between dark and light modes.
- Persistent preference storage.

Acceptance Criteria:
- The site theme can be toggled without breaking the layout.

---

## Task 42 — Blog or News Section (Optional)
Objective: Add an optional content-driven section if desired.

Deliverables:
- Blog cards or updates section.
- Admin CRUD for blog posts.

Acceptance Criteria:
- Optional posts are editable and can be shown publicly.

---

## Task 43 — Testing Setup
Objective: Add automated confidence to the project.

Deliverables:
- Unit tests for utilities and components.
- API tests for core endpoints.
- Basic E2E flow for login and content edit.

Acceptance Criteria:
- Core flows are covered by reliable tests.

---

## Task 44 — Continuous Integration and Deployment
Objective: Prepare the app for live deployment.

Deliverables:
- CI pipeline configuration.
- Environment-specific config files.
- Deployment guide for Render, Railway, DigitalOcean, or VPS.

Acceptance Criteria:
- The app can be deployed from the repository with minimal manual work.

---

## Task 45 — Final Visual Polish
Objective: Refine the experience to feel premium.

Deliverables:
- Tighter spacing.
- Better gradients and glow effects.
- Consistent hover states.
- Better section transitions.

Acceptance Criteria:
- The app feels polished and production-ready.

---

## Task 46 — Content Seed Data
Objective: Populate the app with initial demo content.

Deliverables:
- Seed data for hero, about, skills, services, projects, testimonials, and settings.
- Professional placeholder content that matches the design.

Acceptance Criteria:
- The app looks complete immediately after setup.

---

## Task 47 — Internationalization (Optional)
Objective: Add multilingual support if required.

Deliverables:
- Language toggle.
- Translation files for English and one second language.

Acceptance Criteria:
- Content can be served in more than one language.

---

## Task 48 — PWA and Offline Support (Optional)
Objective: Improve installability and resilience.

Deliverables:
- Basic PWA features.
- App manifest.
- Offline shell support.

Acceptance Criteria:
- The website can be installed and used more like an app.

---

## Task 49 — Final QA and Launch Checklist
Objective: Validate the entire experience before delivery.

Deliverables:
- Visual QA pass on mobile and desktop.
- Broken links and empty states check.
- Form submission and auth flow validation.
- Performance and SEO review.

Acceptance Criteria:
- The site is stable, polished, and launch-ready.

---

## Task 50 — Production Handoff and Documentation
Objective: Prepare the final handoff package.

Deliverables:
- README with setup instructions.
- Architecture overview.
- Admin user guide.
- Deployment notes.
- List of all editable content sections.

Acceptance Criteria:
- A new developer can understand and continue the project easily.

---

# Implementation Priority for a 1-Week Delivery
To finish in one week, follow this order:
1. Set up Docker + Prisma + PostgreSQL
2. Create auth and content APIs
3. Build the public portfolio UI
4. Build the admin dashboard
5. Connect admin forms to backend
6. Add image upload and settings
7. Add animations, responsiveness, and polish
8. Deploy and test

# Recommended Delivery Scope for 7 Days
If the timeline is tight, prioritize these features first:
- Hero
- About
- Skills
- Projects
- Contact
- Admin login
- Editable content management
- Image upload
- Responsive design
- Docker deployment

This scope is realistic for a one-week MVP while still producing a professional, editable portfolio.
