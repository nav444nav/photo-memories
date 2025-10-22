# Backend Deployment Guide

Quick guide for deploying the Photo Memories backend to production.

## Switching Between SQLite (Local) and PostgreSQL (Production)

### Current Setup
- **Local Development**: SQLite (`prisma/schema.prisma` uses SQLite)
- **Production**: PostgreSQL (Supabase)

### For Local Development (SQLite)

Your `prisma/schema.prisma` should have:

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

And `.env`:
```bash
DATABASE_URL="file:./dev.db"
```

### For Production Deployment (PostgreSQL)

**Option 1: Manual Update (Recommended)**

Before deploying to Render, ensure production uses PostgreSQL:

1. Copy production schema:
```bash
cp prisma/schema.prisma.production prisma/schema.prisma
```

2. The schema now uses PostgreSQL:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

3. Environment variables on Render should have:
```bash
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"
```

**Option 2: Use DATABASE_PROVIDER Environment Variable**

Modify `schema.prisma` to use a variable (future enhancement):

```prisma
datasource db {
  provider = env("DATABASE_PROVIDER")  // "sqlite" or "postgresql"
  url      = env("DATABASE_URL")
}
```

Then set env vars accordingly.

## Pre-Deployment Checklist

- [ ] Schema uses PostgreSQL provider
- [ ] All migrations tested locally with PostgreSQL
- [ ] Environment variables documented
- [ ] Build succeeds: `npm run build`
- [ ] TypeScript compiles without errors: `npm run lint`
- [ ] Dependencies up to date

## Deployment Steps

### 1. Run Migrations on Supabase

```bash
# Set production database URL
export DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"

# Generate Prisma Client for PostgreSQL
npm run db:generate

# Run migrations
npm run db:migrate deploy

# Verify
npx prisma studio
```

### 2. Push Code to GitHub

```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### 3. Configure Render

See `../PRODUCTION_SETUP_GUIDE.md` for full instructions.

**Build Command:**
```bash
npm install && npx prisma generate && npm run build
```

**Start Command:**
```bash
npm start
```

**Environment Variables:**
- `DATABASE_URL` - Supabase PostgreSQL connection string
- `JWT_SECRET` - Strong random secret (64+ chars)
- `NODE_ENV` - `production`
- `FRONTEND_URL` - Your Vercel URL
- All others from `.env.production.example`

### 4. Verify Deployment

```bash
# Health check
curl https://your-app.onrender.com/health

# Should return: {"status":"ok","timestamp":"..."}
```

## Common Issues

### Issue: Prisma Client not generated
**Solution:**
```bash
npm run db:generate
```

### Issue: Migration fails on Render
**Solution:**
Run migrations manually before deploying:
```bash
DATABASE_URL="your-supabase-url" npx prisma migrate deploy
```

### Issue: Database connection fails
**Solution:**
1. Verify DATABASE_URL is correct
2. Check Supabase project is active
3. Ensure password is correctly escaped in URL
4. Check connection limits (60 on free tier)

### Issue: Build fails
**Solution:**
1. Test build locally: `npm run build`
2. Check TypeScript errors: `npm run lint`
3. Review Render build logs for specific error

## Database Migrations

### Creating a New Migration

```bash
# 1. Update schema.prisma
# 2. Create migration
npx prisma migrate dev --name add_new_feature

# 3. Test locally
npm run dev

# 4. Push to git
git add .
git commit -m "Add migration: add_new_feature"
git push

# 5. Run on production BEFORE deploying code
DATABASE_URL="production-url" npx prisma migrate deploy
```

### Rollback Migration

```bash
# Not directly supported by Prisma
# Manual process:

# 1. Find migration in prisma/migrations/
# 2. Create reverse migration
# 3. Apply manually via SQL or Prisma Studio
```

## Monitoring

### View Logs
- Render Dashboard → Service → Logs
- Real-time streaming
- Filter by log level

### Database Performance
- Supabase Dashboard → Database → Logs
- Query performance
- Slow queries
- Connection count

### Metrics
- Render Dashboard → Service → Metrics
- CPU usage
- Memory usage
- Request rate
- Response time

## Scaling

### When to Upgrade Render

Free tier limitations:
- Service sleeps after 15 min inactivity
- 512 MB RAM
- 0.1 CPU
- 100 GB bandwidth/month

Upgrade to Starter ($7/month) when:
- Don't want service to sleep
- Need more resources
- High traffic expected

### Database Scaling

Free tier: 500 MB database, 2 GB bandwidth

Upgrade to Pro ($25/month) when:
- Database > 500 MB
- Need more bandwidth
- Want better backups
- Need point-in-time recovery

## Environment Variables Reference

See `.env.production.example` for complete list:

**Required:**
- DATABASE_URL
- JWT_SECRET
- NODE_ENV
- PORT
- FRONTEND_URL

**Optional:**
- CLOUDINARY_* (for photo uploads)
- SMTP_* (for emails)
- REDIS_URL (for caching)
- SENTRY_DSN (for error tracking)

## Prisma Commands

```bash
# Generate client
npm run db:generate

# Create migration
npm run db:migrate

# Deploy migrations
DATABASE_URL="prod" npx prisma migrate deploy

# View database
npm run db:studio

# Push schema (without migration)
npm run db:push

# Pull schema from database
npx prisma db pull

# Reset database (DANGER!)
npx prisma migrate reset
```

## Support

- Render: https://render.com/docs
- Supabase: https://supabase.com/docs
- Prisma: https://www.prisma.io/docs
- Main Guide: ../PRODUCTION_SETUP_GUIDE.md
