# Quick Start Guide

## Prerequisites
- Docker & Docker Compose installed
- Node.js 18+
- PostgreSQL client (optional, for debugging)

## Setup

### 1. Clone and Configure
```bash
cd portfolio-app
cp .env.example .env
```

### 2. Start with Docker
```bash
docker-compose up -d
```

The services will start automatically:
- PostgreSQL on port 5432
- API on port 5000
- Web app on port 5173  
- Admin app on port 5174

### 3. Initialize Database
```bash
npm run db:push
npm run seed
```

### 4. Login to Admin
- URL: http://localhost:5174
- Email: admin@portfolio.dev
- Password: AdminPassword123!

## Development

### Local Development (without Docker)
```bash
npm install
npm run db:push
npm run seed
npm run dev:all
```

### Available Commands
- `npm run dev` - Start all services with Docker
- `npm run docker:up` - Start containers
- `npm run docker:down` - Stop containers
- `npm run db:studio` - Open Prisma Studio GUI
- `npm run db:push` - Sync schema to database
- `npm run seed` - Populate demo data

## Troubleshooting

### Port conflicts
If ports are already in use, modify `.env` and `docker-compose.yml`

### Database errors
```bash
docker exec portfolio_db psql -U portfolio_user -d portfolio_db
```

### Check logs
```bash
docker-compose logs -f api
docker-compose logs -f web
```

## What's Next

1. **Customize Content**: Login to admin and edit portfolio sections
2. **Add 3D Scene**: Implement Three.js hero section in `apps/web/src/components/Hero3D.tsx`
3. **Connect API**: Update components to fetch data from backend
4. **Deploy**: Use Render, Railway, or DigitalOcean (see deployment guides)
5. **Add Images**: Upload portfolio images via admin panel

## File Structure

```
portfolio-app/
├── apps/
│   ├── web/              # Public portfolio (React + Vite)
│   └── admin/            # Admin dashboard (React + Vite)
├── services/
│   └── api/              # Express backend with Prisma
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Demo data
├── docker/               # Docker configurations
└── docker-compose.yml    # Orchestration
```

## API Endpoints

### Public
- GET `/api/v1/hero` - Hero content
- GET `/api/v1/about` - About section
- GET `/api/v1/skills` - Skills list
- GET `/api/v1/projects` - Projects list
- GET `/api/v1/contact` - Contact form

### Protected (Admin)
- POST `/api/v1/auth/login` - Admin login
- PUT `/api/v1/hero` - Update hero
- POST/PUT/DELETE `/api/v1/skills` - Manage skills
- POST/PUT/DELETE `/api/v1/projects` - Manage projects

## Customization

### Colors
Edit color palette in:
- `apps/web/src/index.css` - Global styles
- `apps/web/tailwind.config.ts` - Tailwind config

### Database
Edit schema in:
- `prisma/schema.prisma` - Database models
- Run `npm run db:push` to apply changes

### Content Types
Add new content types by:
1. Adding model to `prisma/schema.prisma`
2. Creating controller in `services/api/src/controllers/`
3. Creating route in `services/api/src/routes/`
4. Creating editor component in `apps/admin/src/pages/editors/`

## Performance Tips
- Enable Redis caching for frequently accessed data
- Use image optimization for thumbnails
- Implement pagination for large lists
- Add lazy loading for components
- Configure CDN for static assets

## Security Checklist
- [ ] Change JWT secret in production
- [ ] Update admin credentials
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Configure CORS properly
- [ ] Validate all inputs
- [ ] Use environment variables for secrets
- [ ] Enable database backups

## Support

For issues:
1. Check Docker logs: `docker-compose logs`
2. Verify database connection
3. Check API health: `http://localhost:5000/health`
4. Review console errors in browser

Happy coding! 🚀
