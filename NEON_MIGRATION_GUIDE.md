# Migration from Supabase to Neon.tech

This guide explains the migration from Supabase to Neon.tech for the Photo Memories application.

## Why Neon.tech?

Neon.tech offers several advantages for this project:

1. **Serverless Architecture**: Auto-scales compute based on demand
2. **Auto-Suspend**: Automatically suspends after inactivity, saving compute hours
3. **Instant Branching**: Create development branches instantly for testing
4. **Generous Free Tier**: 512MB storage + 191.9 compute hours/month
5. **Fast Cold Starts**: Resume from suspend in ~300ms
6. **PostgreSQL 16**: Latest stable version with all modern features
7. **Built-in Connection Pooling**: No additional setup needed
8. **Simple Pricing**: $19/month Launch plan when you need to upgrade

## What Changed

### Environment Variables

**Before (Supabase):**
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

**After (Neon.tech):**
```env
DATABASE_URL="postgresql://[user]:[password]@[endpoint].neon.tech/neondb?sslmode=require"
```

**Important**: The `?sslmode=require` parameter is required for Neon connections.

### No Code Changes Required

The application uses Prisma ORM with PostgreSQL, so:
- ✅ Database schema remains exactly the same
- ✅ No application code changes needed
- ✅ No dependency changes required
- ✅ Prisma migrations work identically

## Migration Steps

### Step 1: Create Neon.tech Account

1. Go to [https://neon.tech](https://neon.tech)
2. Sign up with GitHub (recommended)
3. Verify your email

### Step 2: Create New Project

1. Click "New Project"
2. Configure:
   - **Project Name**: `photo-memories` (or your choice)
   - **PostgreSQL Version**: 16 (recommended)
   - **Region**: Choose closest to your users
3. Click "Create Project" (instant creation!)

### Step 3: Get Connection String

1. In the Neon dashboard, find "Connection Details"
2. Select "Prisma" from the dropdown
3. Copy the full connection string
4. Save it securely - you'll need it for deployment

### Step 4: Run Database Migrations

**On your local machine:**

```bash
cd backend

# Set the DATABASE_URL for Neon
export DATABASE_URL="your-neon-connection-string-here"

# Run Prisma migrations
npx prisma migrate deploy

# Or use db push for faster initial setup
npx prisma db push
```

**Verify the migration:**
```bash
# Open Prisma Studio connected to Neon
npx prisma studio
```

### Step 5: Update Production Environment

**For Render (Backend):**

1. Go to your Render service dashboard
2. Navigate to "Environment" tab
3. Update the `DATABASE_URL` variable with your Neon connection string
4. Save changes (will trigger automatic redeploy)

**For Local Development:**

```bash
cd backend

# Update your .env file
nano .env

# Update DATABASE_URL to point to Neon
DATABASE_URL="your-neon-connection-string-here"
```

### Step 6: Test the Connection

```bash
# Test backend connection
cd backend
npm run dev

# You should see successful database connection in logs
```

## Migrating Existing Data (If Applicable)

If you have existing data in Supabase that you want to migrate:

### Option 1: Using pg_dump (Recommended)

```bash
# Export from Supabase
pg_dump "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" \
  --data-only \
  --no-owner \
  --no-acl \
  > supabase_data.sql

# Import to Neon
psql "postgresql://[user]:[password]@[endpoint].neon.tech/neondb?sslmode=require" \
  < supabase_data.sql
```

### Option 2: Using Prisma Studio

1. Connect to Supabase database with Prisma Studio
2. Export data manually or use a script
3. Connect to Neon database
4. Import the data

### Option 3: Fresh Start

If you don't have important production data yet:
1. Just start fresh with Neon
2. Run migrations to create tables
3. Users can register new accounts

## Advantages of Neon.tech Over Supabase

| Feature | Neon.tech | Supabase |
|---------|-----------|----------|
| **Database Storage** | 512 MB | 500 MB |
| **Architecture** | Serverless, auto-suspend | Always-on |
| **Branching** | Instant, copy-on-write | Manual setup |
| **Cold Start** | ~300ms | N/A (always on) |
| **Compute Hours** | 191.9 hours/month free | Unlimited (but always on) |
| **PostgreSQL Version** | 16 (latest) | 15 |
| **Pricing (Paid)** | $19/month (Launch) | $25/month (Pro) |
| **Extra Features** | Database branching | Auth, Storage, Realtime |

## Key Differences to Note

### Auto-Suspend Behavior

Neon automatically suspends your database after 5 minutes of inactivity (on free tier):
- First query after suspend takes ~300ms (cold start)
- Subsequent queries are instant
- This is GREAT for free tier - saves compute hours
- Can disable on paid plans for always-on

### Connection Pooling

Neon has built-in connection pooling:
- No need for external pooling services
- Handles concurrent connections efficiently
- Works seamlessly with Prisma

### Database Branching

Unique Neon feature:
- Create instant database branches for testing
- Copy-on-write technology (no duplication overhead)
- Perfect for development and staging environments

```bash
# Create a development branch
neon branches create --project-id your-project-id --name dev

# Each branch gets its own connection string
```

## Troubleshooting

### "SSL required" error

**Problem**: Connection fails with SSL error

**Solution**: Ensure your connection string includes `?sslmode=require`

```env
DATABASE_URL="postgresql://...neon.tech/neondb?sslmode=require"
```

### "Database not found" error

**Problem**: Tables don't exist

**Solution**: Run Prisma migrations

```bash
npx prisma migrate deploy
# or
npx prisma db push
```

### Slow first query after inactivity

**Problem**: First query takes ~300ms

**Explanation**: This is normal - Neon auto-suspends after 5 minutes of inactivity. The database resumes on first query.

**Solutions**:
- Accept it (300ms is still fast!)
- Implement a periodic "keep-alive" ping
- Upgrade to paid plan to disable auto-suspend

### Connection string format issues

**Problem**: Can't connect to database

**Solution**: Verify your connection string format:

```
postgresql://[username]:[password]@[endpoint].neon.tech/[database]?sslmode=require
```

Example:
```
postgresql://user1:abc123xyz@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

## Monitoring Your Neon Database

### View Usage

1. Go to Neon Console
2. Select your project
3. Click "Usage" tab
4. Monitor:
   - Storage usage
   - Compute hours used
   - Active time
   - Connections

### View Metrics

1. Click "Monitoring" in Neon Console
2. See real-time metrics:
   - Query performance
   - Connection count
   - Database size
   - Latency

### View Logs

1. Click "Logs" in Neon Console
2. See connection logs and errors
3. Filter by time range

## Cost Comparison

### Free Tier (0-100 users)

| Service | Neon.tech | Supabase |
|---------|-----------|----------|
| Database | $0 | $0 |
| Storage | 512 MB | 500 MB |
| Compute | 191.9 hrs/mo | Unlimited |
| Features | Branching, auto-suspend | Auth, Storage, Realtime |

### Paid Tier (1000+ users)

| Service | Neon.tech | Supabase |
|---------|-----------|----------|
| Launch/Pro | $19/mo | $25/mo |
| Storage | More than 512 MB | 8 GB |
| Compute | Always-on option | Always-on |
| Features | Unlimited branches | Full auth suite |

## Rollback Plan

If you need to rollback to Supabase:

1. Keep your Supabase project active
2. Change `DATABASE_URL` back to Supabase connection string
3. Redeploy your application
4. No code changes needed

## Next Steps

1. ✅ Create Neon.tech account
2. ✅ Create new project
3. ✅ Get connection string
4. ✅ Run migrations
5. ✅ Update environment variables
6. ✅ Test the connection
7. ✅ Deploy to production
8. 🎉 Enjoy serverless PostgreSQL!

## Support Resources

- **Neon Documentation**: https://neon.tech/docs
- **Neon Discord**: https://discord.gg/neon
- **Neon GitHub**: https://github.com/neondatabase
- **Prisma + Neon Guide**: https://neon.tech/docs/guides/prisma

## Summary

The migration to Neon.tech is straightforward:
- ✅ No code changes required
- ✅ Just update `DATABASE_URL`
- ✅ Run Prisma migrations
- ✅ Same PostgreSQL database, better serverless experience
- ✅ Save money with auto-suspend on free tier
- ✅ Get instant branching for development

Happy migrating! 🚀
