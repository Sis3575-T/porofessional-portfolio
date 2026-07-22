# Portfolio Pro — Quick Start

## Architecture

```
portfolio-monorepo/
├── apps/
│   ├── web/            # Public portfolio frontend (React + Vite + Tailwind + Three.js + Framer Motion)
│   └── admin/          # Admin dashboard (React + Vite + Tailwind)
├── services/
│   ├── api/            # API Gateway (Express proxy to microservices, port 5000)
│   ├── auth-service/   # Authentication service (JWT, port 5001)
│   ├── portfolio-service/ # Portfolio content CRUD (port 5002)
│   ├── media-service/  # File upload/management (port 5003)
│   ├── dashboard-service/ # Dashboard analytics (port 5004)
│   └── shared/         # Shared middleware & utilities
├── prisma/
│   ├── schema.prisma   # Database schema (15 models)
│   └── seed.js         # Seed data with demo content
├── docker-compose.yml
├── setup.bat           # One-click Windows setup
└── QUICKSTART.md
```

## Quick Start (Docker — Recommended)

```bash
docker compose up --build
```

This starts PostgreSQL + all 5 backend services + web + admin.

## Quick Start (Manual)

### Prerequisites
- Node.js 20+
- PostgreSQL 16+ (or Neon cloud)

### Steps

```bash
# Install root dependencies (workspaces)
npm install

# Push database schema
npx prisma db push --schema=prisma/schema.prisma

# Seed demo data
node prisma/seed.js

# Start all services (each in a separate terminal)
npm run dev:gateway     # Terminal 1 - API Gateway (port 5000)
npm run dev:auth        # Terminal 2 - Auth Service (port 5001)
npm run dev:portfolio   # Terminal 3 - Portfolio Service (port 5002)
npm run dev:media       # Terminal 4 - Media Service (port 5003)
npm run dev:dashboard   # Terminal 5 - Dashboard Service (port 5004)
npm run dev:web         # Terminal 6 - Web Frontend (port 5175)
npm run dev:admin       # Terminal 7 - Admin Dashboard (port 5174)
```

## Default Admin Credentials
- **Email:** `sisay3575@gmail.com`
- **Password:** `Sis3575@`

## Access URLs

| Service | URL |
|---------|-----|
| Portfolio | http://localhost:5175 |
| Admin Dashboard | http://localhost:5174 |
| API Gateway | http://localhost:5000 |
| Health Check | http://localhost:5000/health |

## Key Features

| Feature | Details |
|---------|---------|
| 3D Hero | Three.js office scene with floating objects, particles, contact shadows. Auto-reduces on low-end/mobile devices. |
| Animations | Scroll-triggered fade-ins on all sections, animated skill bars, timeline draw-in, testimonial carousel transitions. |
| Responsive | Mobile-first, all sections stack gracefully at 320px+. |
| Accessibility | Skip link, ARIA labels, aria-current, focus rings, keyboard nav. |
| Theme Toggle | Dark/light mode with localStorage persistence. |
| SEO | Meta tags, OG tags, Twitter cards per page. |
| Performance | Lazy-loaded sections, code-split routes, lazy images. |
| Security | Helmet, rate limiting, JWT auth, input validation, CORS. |

## Admin Panel

Access at `http://localhost:5174/login`.

Editable sections: Hero, About, Skills, Services, Experience, Education, Projects, Testimonials, Contact Messages, Settings, 3D Avatar, Media Library, Activity Logs.

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/auth/login` | — | Admin login |
| GET | `/api/v1/auth/me` | Admin | Current user |
| GET | `/api/v1/hero` | — | Hero section |
| PUT | `/api/v1/hero` | Admin | Update hero |
| GET | `/api/v1/about` | — | About section |
| PUT | `/api/v1/about` | Admin | Update about |
| GET | `/api/v1/skills` | — | List skills |
| POST | `/api/v1/skills` | Admin | Create skill |
| PUT | `/api/v1/skills/:id` | Admin | Update skill |
| DELETE | `/api/v1/skills/:id` | Admin | Delete skill |
| GET | `/api/v1/services` | — | List services |
| POST | `/api/v1/services` | Admin | Create service |
| PUT | `/api/v1/services/:id` | Admin | Update service |
| DELETE | `/api/v1/services/:id` | Admin | Delete service |
| GET | `/api/v1/experience` | — | List experience |
| POST | `/api/v1/experience` | Admin | Create experience |
| PUT | `/api/v1/experience/:id` | Admin | Update experience |
| DELETE | `/api/v1/experience/:id` | Admin | Delete experience |
| GET | `/api/v1/education` | — | List education |
| POST | `/api/v1/education` | Admin | Create education |
| PUT | `/api/v1/education/:id` | Admin | Update education |
| DELETE | `/api/v1/education/:id` | Admin | Delete education |
| GET | `/api/v1/projects` | — | List projects |
| GET | `/api/v1/projects/:slug` | — | Project by slug |
| POST | `/api/v1/projects` | Admin | Create project |
| PUT | `/api/v1/projects/:id` | Admin | Update project |
| DELETE | `/api/v1/projects/:id` | Admin | Delete project |
| GET | `/api/v1/testimonials` | — | List testimonials |
| POST | `/api/v1/testimonials` | Admin | Create testimonial |
| PUT | `/api/v1/testimonials/:id` | Admin | Update testimonial |
| DELETE | `/api/v1/testimonials/:id` | Admin | Delete testimonial |
| POST | `/api/v1/contact` | — | Submit contact |
| GET | `/api/v1/contact` | Admin | List messages |
| GET | `/api/v1/contact/:id` | Admin | Get message |
| PUT | `/api/v1/contact/:id` | Admin | Update message |
| DELETE | `/api/v1/contact/:id` | Admin | Delete message |
| GET | `/api/v1/settings` | — | Site settings |
| PUT | `/api/v1/settings` | Admin | Update settings |
| GET | `/api/v1/avatar` | — | Get 3D avatar |
| POST | `/api/v1/avatar/generate` | Admin | Generate avatar from photo |
| POST | `/api/v1/avatar` | Admin | Save avatar |
| DELETE | `/api/v1/avatar` | Admin | Delete avatar |
| GET | `/api/v1/dashboard` | Admin | Dashboard stats |
| POST | `/api/v1/upload` | Admin | Upload image |
| GET | `/api/v1/media` | Admin | List media |
| DELETE | `/api/v1/media/:filename` | Admin | Delete media |
| GET | `/api/v1/activities` | Admin | Activity logs |
| GET | `/health` | — | Health check |
