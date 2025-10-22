# Supabase Connection Troubleshooting Guide

Quick guide to fix "Can't reach database server" errors when connecting to Supabase.

## Quick Diagnosis

Run the diagnostic script:

```bash
cd backend
./diagnose-connection.sh
```

This will automatically check:
- ✅ .env.production file exists
- ✅ No placeholder values
- ✅ Connection string format
- ✅ DNS resolution
- ✅ Port connectivity
- ✅ Prisma connection test

## Common Issues & Solutions

### Issue 1: Using Wrong Connection String Format

**Problem:** Using direct connection instead of pooler, or wrong port.

**Solution:**

1. Go to Supabase Dashboard → Settings → Database → Connection string
2. At the top, you'll see tabs: **URI**, JDBC, etc.
3. Under URI, you'll see two modes:
   - **Transaction** (port 5432)
   - **Session** (port 6543) ← **USE THIS**

4. Select **Session mode**
5. Copy the connection string
6. It should look like:
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```

7. Replace `[YOUR-PASSWORD]` with your actual password
8. Update in `.env.production`

**Correct format:**
```bash
# GOOD (with pooler, port 6543)
DATABASE_URL="postgresql://postgres.abcdefgh:MyPass123@aws-0-us-west-1.pooler.supabase.com:6543/postgres"

# OK (direct connection, port 5432)
DATABASE_URL="postgresql://postgres:MyPass123@db.abcdefgh.supabase.co:5432/postgres"

# BEST (pooler with Session mode)
DATABASE_URL="postgresql://postgres.abcdefgh:MyPass123@aws-0-us-west-1.pooler.supabase.com:6543/postgres"
```

---

### Issue 2: Project is Paused

**Problem:** Free tier projects pause after 7 days of inactivity.

**Solution:**

1. Go to https://app.supabase.com
2. Check your project status
3. If it shows **"Paused"** → Click **"Restore project"**
4. Wait 1-2 minutes for it to resume
5. Try connection again

---

### Issue 3: Special Characters in Password

**Problem:** Password contains characters like `@`, `#`, `!`, `%`, `$`, `&` which break the URL format.

**Solution:**

Use the password encoder script:

```bash
cd backend
./encode-password.sh 'YourActualPassword!@#'
```

This will output the URL-encoded version. Use that in your DATABASE_URL.

**Manual encoding reference:**
```
@ → %40
# → %23
$ → %24
% → %25
! → %21
& → %26
= → %3D
+ → %2B
? → %3F
```

**Example:**
```bash
# Original password: MyPass!@#123
# Encoded password:  MyPass%21%40%23123

DATABASE_URL="postgresql://postgres.ref:MyPass%21%40%23123@aws-0-us-west-1.pooler.supabase.com:6543/postgres"
```

---

### Issue 4: Wrong Password

**Problem:** Forgot password or using wrong one.

**Solution:**

1. Supabase Dashboard → Settings → Database
2. Scroll to **"Database password"** section
3. Click **"Reset database password"**
4. Generate new password → **SAVE IT**
5. Update `.env.production` with new password

---

### Issue 5: Firewall or Network Issues

**Problem:** Your network/firewall blocks PostgreSQL port 6543.

**Tests:**

```bash
# Test if port is reachable
nc -zv aws-0-us-west-1.pooler.supabase.com 6543

# Test DNS resolution
nslookup aws-0-us-west-1.pooler.supabase.com
```

**Solutions:**

1. Try from a different network (mobile hotspot, different WiFi)
2. Check corporate firewall settings
3. Use VPN if behind restrictive network
4. Try port 5432 (Transaction mode) instead

---

### Issue 6: IPv6 vs IPv4 Issues

**Problem:** Some networks have IPv6 issues.

**Solution:**

Add `?options=-c%20statement_timeout=3000ms` to force IPv4:

```bash
DATABASE_URL="postgresql://postgres.ref:pass@aws-0-us-west-1.pooler.supabase.com:6543/postgres?options=-c%20statement_timeout=3000ms"
```

---

## Step-by-Step Connection Setup

### 1. Get Connection String from Supabase

```
Supabase Dashboard
  └─ Settings (⚙️)
      └─ Database
          └─ Connection string
              └─ URI tab
                  └─ Select "Session mode"
                      └─ Copy the string
```

### 2. Identify Your Values

From the connection string, identify:

```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
                     ↑              ↑                ↑
                PROJECT-REF      PASSWORD         REGION
```

Example:
- PROJECT-REF: `abcdefghijklmnop`
- PASSWORD: `MySecurePass123`
- REGION: `us-west-1`

### 3. Build Your Connection String

```bash
DATABASE_URL="postgresql://postgres.abcdefghijklmnop:MySecurePass123@aws-0-us-west-1.pooler.supabase.com:6543/postgres"
```

### 4. Handle Special Characters

If password has special characters, encode them:

```bash
./encode-password.sh 'MySecurePass123!'
# Output: MySecurePass123%21
```

### 5. Update .env.production

```bash
# Edit the file
nano .env.production

# Update this line with your actual connection string
DATABASE_URL="postgresql://postgres.abcdefghijklmnop:MySecurePass123%21@aws-0-us-west-1.pooler.supabase.com:6543/postgres"
```

### 6. Test Connection

```bash
./diagnose-connection.sh
```

Should show:
```
✓ .env.production file found
✓ Using connection pooler (recommended)
✓ Using Session mode (port 6543) - GOOD!
✓ Host resolves to: x.x.x.x
✓ Port 6543 is reachable
✓ Prisma can connect to database!
🎉 Connection successful!
```

### 7. Run Migrations

Once test passes:

```bash
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d= -f2 | tr -d '"') npx prisma migrate deploy
```

---

## Alternative: Use SQL Script Instead of Migrations

If Prisma migrations keep failing, use the SQL script directly:

### 1. Copy SQL Script Content

```bash
cat prisma/manual_schema_postgres.sql
```

### 2. Run in Supabase SQL Editor

1. Supabase Dashboard → **SQL Editor** (in sidebar)
2. Click **"New query"**
3. Paste the contents of `manual_schema_postgres.sql`
4. Click **"Run"** or press `Cmd/Ctrl + Enter`
5. Check for success message

### 3. Verify Tables Created

1. Supabase Dashboard → **Table Editor**
2. Should see 6 tables:
   - users
   - photos
   - albums
   - album_photos
   - tags
   - photo_tags

### 4. Generate Prisma Client

```bash
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d= -f2 | tr -d '"') npx prisma db pull
npx prisma generate
```

---

## Verification Checklist

Before running migrations:

- [ ] Supabase project is **Active** (not paused)
- [ ] Connection string copied from Supabase dashboard
- [ ] Using **Session mode** (port 6543)
- [ ] Password replaced (not `[YOUR-PASSWORD]`)
- [ ] Special characters URL-encoded
- [ ] `.env.production` file updated
- [ ] Diagnostic script passes all tests
- [ ] No firewall blocking port 6543

After migrations:

- [ ] Migration completed without errors
- [ ] Tables visible in Supabase Table Editor
- [ ] Prisma Client generated successfully
- [ ] Can run `npx prisma studio` and see tables

---

## Still Having Issues?

### Check Supabase Status

- Visit: https://status.supabase.com
- Check if there are any ongoing incidents

### Test with psql (if installed)

```bash
psql "postgresql://postgres.ref:pass@aws-0-us-west-1.pooler.supabase.com:6543/postgres"
```

Should connect and show `postgres=>` prompt.

### Review Logs

Supabase Dashboard → Database → Logs

Look for connection attempts and errors.

### Get More Details

Enable verbose Prisma logging:

```bash
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d= -f2 | tr -d '"') \
DEBUG="*" \
npx prisma migrate deploy
```

---

## Contact Support

If none of these work:

1. **Supabase Support**: https://supabase.com/support
2. **Supabase Discord**: https://discord.supabase.com
3. **GitHub Issues**: Include diagnostic output from `diagnose-connection.sh`

---

## Quick Reference

```bash
# Diagnose connection issues
./diagnose-connection.sh

# Encode password with special characters
./encode-password.sh 'MyPassword!@#'

# Test connection manually
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d= -f2 | tr -d '"') \
npx prisma db execute --stdin <<< "SELECT 1;"

# Run migrations
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d= -f2 | tr -d '"') \
npx prisma migrate deploy

# Alternative: Use SQL script
# Copy contents of prisma/manual_schema_postgres.sql
# Paste in Supabase SQL Editor → Run
```

---

**Most Common Solution:**

Use Session mode (port 6543) connection string from Supabase dashboard and properly URL-encode your password!
