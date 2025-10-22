# Known Issues & Fixes Needed

This document tracks issues discovered during database setup and full-stack testing.

## Issue Tracking

**Status Legend:**
- 🔴 **Critical** - Blocks functionality
- 🟡 **Important** - Should be fixed soon
- 🟢 **Minor** - Nice to have

---

## Issues Discovered During Setup

### Database & Backend Issues

*(To be populated during testing)*

---

### Frontend Issues

*(To be populated during testing)*

---

### Integration Issues

*(To be populated during testing)*

---

## TypeScript Issues (Non-blocking)

### 🟢 Minor - Unused Parameters in Middleware
**Location**: `src/middleware/errorHandler.ts`, `auth.ts`, `validate.ts`
**Issue**: Parameters prefixed with `_` but TypeScript still warns
**Impact**: None - code works fine
**Fix**: Add `// eslint-disable-next-line` or configure tsconfig
**Priority**: Low

### 🟢 Minor - JWT Sign Type Issue
**Location**: `src/utils/jwt.ts:12`
**Issue**: TypeScript type mismatch on jwt.sign expiresIn parameter
**Impact**: None - code works at runtime
**Fix**: Explicit type casting or update @types/jsonwebtoken
**Priority**: Low

### 🟢 Minor - Implicit Any Types
**Location**: `src/controllers/album.controller.ts:24`, `tag.controller.ts:23`
**Issue**: Map callback parameters implicitly typed as 'any'
**Impact**: None - type inference works
**Fix**: Add explicit type annotations
**Priority**: Low

---

## Planned Fixes

### High Priority
- [ ] Implement photo upload with Multer + Sharp
- [ ] Integrate Cloudinary for image storage
- [ ] Add database seeding script
- [ ] Fix all TypeScript strict mode warnings

### Medium Priority
- [ ] Add rate limiting middleware
- [ ] Implement comprehensive input validation
- [ ] Add request logging
- [ ] Setup error tracking (Sentry)

### Low Priority
- [ ] Add API documentation (Swagger)
- [ ] Setup automated testing
- [ ] Add performance monitoring
- [ ] Implement caching layer

---

## Testing Checklist

### Backend Testing
- [ ] PostgreSQL connection successful
- [ ] Prisma migrations run successfully
- [ ] Server starts without errors
- [ ] Health check endpoint works
- [ ] Authentication endpoints work
  - [ ] Register new user
  - [ ] Login existing user
  - [ ] Get current user
  - [ ] Update profile
- [ ] Photo endpoints work
  - [ ] List photos
  - [ ] Get single photo
  - [ ] Update photo
  - [ ] Delete photo
  - [ ] Toggle favorite
  - [ ] Get favorites
  - [ ] Search photos
- [ ] Album endpoints work
  - [ ] List albums
  - [ ] Create album
  - [ ] Get album
  - [ ] Update album
  - [ ] Delete album
  - [ ] Add photos to album
  - [ ] Remove photos from album
- [ ] Tag endpoints work
  - [ ] List tags
  - [ ] Create tag
  - [ ] Update tag
  - [ ] Delete tag

### Frontend Testing
- [ ] Frontend connects to real backend
- [ ] Login with real credentials works
- [ ] Register new user works
- [ ] Protected routes work
- [ ] Logout works
- [ ] Photos display from database
- [ ] Albums display from database
- [ ] Profile shows real data

### Integration Testing
- [ ] CORS configured correctly
- [ ] JWT tokens work end-to-end
- [ ] Error messages display properly
- [ ] Loading states work
- [ ] Pagination works
- [ ] Search works

---

## Environment Setup Issues

*(To be documented)*

---

## Deployment Issues

*(To be documented later)*

---

**Last Updated**: 2025-10-22
**Phase**: Database Setup & Testing
### 🟡 Important - PostgreSQL Not Available Locally

**Issue**: PostgreSQL is not installed in the development environment
**Impact**: Cannot test with PostgreSQL locally
**Solution Options**:
1. Use SQLite for local development (quick setup)
2. Use Supabase for PostgreSQL (recommended for production)
3. Use Docker PostgreSQL container

**Chosen Solution**: SQLite for local testing, document Supabase setup for production
**Status**: Implementing SQLite support


### 🔴 Critical - Prisma Engine Download Blocked

**Issue**: Cannot download Prisma engine binaries
**Error**: `403 Forbidden` when downloading from binaries.prisma.sh
**Impact**: Cannot run migrations
**Attempted**: Setting PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
**Root Cause**: Network/firewall blocking Prisma CDN

**Workaround Options**:
1. Use `prisma db push` (doesn't require migration engine)
2. Pre-download engines manually
3. Use different network/proxy
4. Document for production deployment

**Status**: Trying `prisma db push` workaround



**Resolution**: Prisma engine download is blocked in this environment.

**Alternative Approaches for Database Setup**:

1. **Local Development** (Recommended):
   ```bash
   # On your local machine with internet access:
   cd backend
   npm install
   npm run db:migrate  # or npm run db:push
   ```

2. **Supabase Setup** (Production):
   - Create project at supabase.com
   - Get PostgreSQL connection string
   - Update DATABASE_URL in .env
   - Run migrations from local machine

3. **Manual SQL** (Fallback):
   - Use the generated SQL migration files
   - Apply manually to database

**Next Steps**:
- Document complete setup guide
- Test on local machine or Supabase
- Create setup script for easy deployment

**Status**: ❌ Cannot complete in current environment
**Action Required**: Setup database externally

