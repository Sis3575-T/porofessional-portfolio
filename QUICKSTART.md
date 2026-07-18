# Portfolio Pro - Quick Start

## Architecture

```
portfolio-monorepo/
├── apps/
│   ├── web/          # Public portfolio frontend (React + Vite)
│   └── admin/        # Admin dashboard (React + Vite)
├── services/
│   └── api/          # Express REST API
├── prisma/
│   ├── schema.prisma # Database schema
│   └── seed.js       # Seed data
└── docker-compose.yml
```

## Run with Docker (Recommended)

```bash
# Build and start all services
docker compose up --build

# Services:
# - PostgreSQL on port 5432
# - API on port 5000
# - Web frontend on port 5173
# - Admin dashboard on port 5174
```

## Run without Docker

### Prerequisites
- Node.js 20+
- PostgreSQL 16+

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp services/api/.env.example services/api/.env
# Edit DATABASE_URL in services/api/.env

# 3. Push database schema
cd services/api
npx prisma db push

# 4. Seed database
node ../../prisma/seed.js

# 5. Start API
npm run dev:api

# 6. Start web frontend (in another terminal)
npm run dev:web

# 7. Start admin dashboard (in another terminal)
npm run dev:admin
```

## Default Admin Credentials
- Email: `admin@portfolio.dev`
- Password: `AdminPassword123!`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | Admin login |
| GET | `/api/v1/auth/me` | Get current user |
| POST | `/api/v1/auth/logout` | Logout |
| GET | `/api/v1/hero` | Get hero section |
| PUT | `/api/v1/hero` | Update hero |
| GET | `/api/v1/about` | Get about section |
| PUT | `/api/v1/about` | Update about |
| GET | `/api/v1/skills` | List skills |
| POST | `/api/v1/skills` | Create skill |
| PUT | `/api/v1/skills/:id` | Update skill |
| DELETE | `/api/v1/skills/:id` | Delete skill |
| GET | `/api/v1/services` | List services |
| POST | `/api/v1/services` | Create service |
| PUT | `/api/v1/services/:id` | Update service |
| DELETE | `/api/v1/services/:id` | Delete service |
| GET | `/api/v1/projects` | List projects |
| GET | `/api/v1/projects/:slug` | Get project by slug |
| POST | `/api/v1/projects` | Create project |
| PUT | `/api/v1/projects/:id` | Update project |
| DELETE | `/api/v1/projects/:id` | Delete project |
| GET | `/api/v1/experience` | List experience |
| POST | `/api/v1/experience` | Create experience |
| PUT | `/api/v1/experience/:id` | Update experience |
| DELETE | `/api/v1/experience/:id` | Delete experience |
| GET | `/api/v1/education` | List education |
| POST | `/api/v1/education` | Create education |
| PUT | `/api/v1/education/:id` | Update education |
| DELETE | `/api/v1/education/:id` | Delete education |
| GET | `/api/v1/testimonials` | List testimonials |
| POST | `/api/v1/testimonials` | Create testimonial |
| PUT | `/api/v1/testimonials/:id` | Update testimonial |
| DELETE | `/api/v1/testimonials/:id` | Delete testimonial |
| POST | `/api/v1/contact` | Submit contact form |
| GET | `/api/v1/contact` | List messages (admin) |
| GET | `/api/v1/contact/:id` | Get message (admin) |
| PUT | `/api/v1/contact/:id` | Update message (admin) |
| DELETE | `/api/v1/contact/:id` | Delete message (admin) |
| GET | `/api/v1/settings` | Get settings |
| PUT | `/api/v1/settings` | Update settings (admin) |
| GET | `/api/v1/dashboard` | Dashboard stats (admin) |
| POST | `/api/v1/upload` | Upload image (admin) |
