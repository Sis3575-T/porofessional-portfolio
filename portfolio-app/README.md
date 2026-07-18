# Portfolio Pro - Full Stack Portfolio Builder

A premium, professional portfolio website with a powerful admin CMS. Built with React, Express, PostgreSQL, and Three.js for 3D hero animations.

## Features

✨ **Public Portfolio Website**
- Hero section with 3D animations
- About, skills, services, experience, education sections
- Project showcase with filtering and search
- Testimonials carousel
- Contact form with backend integration
- Responsive design (mobile-first)
- Dark professional theme

🔐 **Admin Dashboard**
- Secure JWT authentication
- Edit all portfolio content
- Image upload and management
- Contact message management
- Activity logging
- Analytics dashboard

🚀 **Technology Stack**
- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion, Three.js
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose
- **Authentication**: JWT
- **File Upload**: Cloudinary (optional)

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- PostgreSQL (or use Docker version)

### Installation

1. **Clone and setup**
```bash
cd portfolio-app
cp .env.example .env
```

2. **Start with Docker (Recommended)**
```bash
npm run docker:up
npm run db:push
npm run seed
```

3. **Access the apps**
- Public Portfolio: http://localhost:5173
- Admin Dashboard: http://localhost:5174
- API: http://localhost:5000

### Local Development (without Docker)

```bash
# Install dependencies
npm install

# Setup database
npm run db:push
npm run seed

# Start all services
npm run dev:all
```

## Project Structure

```
portfolio-app/
├── apps/
│   ├── web/           # Public portfolio (React + Vite)
│   └── admin/         # Admin dashboard (React + Vite)
├── services/
│   └── api/           # Express backend + Prisma
├── prisma/
│   ├── schema.prisma  # Database schema
│   └── migrations/
├── docker/
│   ├── Dockerfile.api
│   ├── Dockerfile.web
│   └── Dockerfile.admin
├── docker-compose.yml
└── README.md
```

## Available Scripts

```bash
# Development
npm run dev              # Start all services with Docker
npm run dev:all         # Start all services locally

# Database
npm run db:push         # Sync Prisma schema to DB
npm run db:studio       # Open Prisma Studio (GUI)
npm run migrate         # Run migrations
npm run seed            # Seed demo data

# Docker
npm run docker:up       # Start containers
npm run docker:down     # Stop containers
npm run docker:logs     # View logs

# Build
npm run build           # Build all apps for production
```

## Admin Login

Default credentials (after seed):
- **Email**: admin@portfolio.dev
- **Password**: AdminPassword123!

⚠️ **IMPORTANT**: Change these credentials in production!

## API Documentation

### Authentication
```bash
POST /api/v1/auth/login
```

### Public Endpoints
```bash
GET /api/v1/hero
GET /api/v1/about
GET /api/v1/skills
GET /api/v1/services
GET /api/v1/projects
GET /api/v1/experience
GET /api/v1/education
GET /api/v1/testimonials
GET /api/v1/settings
```

### Admin Endpoints (Protected)
```bash
PUT /api/v1/hero
PUT /api/v1/about
POST /api/v1/skills
PUT /api/v1/skills/:id
DELETE /api/v1/skills/:id
# ... and more for all sections
```

## Environment Variables

See `.env.example` for all available options.

Key variables:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `API_PORT`: Backend API port (default: 5000)
- `VITE_API_URL`: API URL for frontend

## Deployment

### Docker Deployment
```bash
docker-compose -f docker-compose.yml up -d
```

### Platform Deployment
- **Render**: Use `render.yaml`
- **Railway**: Use `railway.json`
- **DigitalOcean**: Use Docker image

See `deployment/` for detailed guides.

## Database Schema

### Core Models
- **User**: Admin accounts with JWT auth
- **Hero**: Hero section content
- **About**: Biography and personal details
- **Skill**: Technical skills with categories
- **Service**: Service offerings
- **Experience**: Work history
- **Education**: Academic background
- **Project**: Portfolio projects
- **Testimonial**: Client feedback
- **ContactMessage**: Inbound contact forms
- **Setting**: Site configuration
- **MediaAsset**: Uploaded images

## Performance

- Optimized images with responsive sizes
- Code splitting and lazy loading
- Database query optimization with Prisma
- Redis caching (optional)
- CDN-ready architecture

## Security

- JWT-based authentication
- Password hashing with bcrypt
- CSRF protection
- Input validation and sanitization
- Rate limiting on public endpoints
- Secure headers with Helmet.js
- SQL injection prevention via Prisma

## Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation
- Screen reader support
- Semantic HTML
- Sufficient color contrast
- Focus management

## Contributing

1. Create a feature branch
2. Make your changes
3. Test locally with Docker
4. Submit a pull request

## License

MIT

## Support

For issues or questions:
1. Check the `/docs` folder
2. Review the API documentation
3. Check `.env.example` for configuration

---

**Built with ❤️ for developers who want a professional portfolio.**
