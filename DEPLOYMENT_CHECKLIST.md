# Production Deployment Checklist

Use this checklist to ensure a smooth production deployment of Photo Memories.

## Pre-Deployment Checklist

### Code Preparation
- [ ] All code committed to GitHub
- [ ] All tests passing locally
- [ ] No console.log statements in production code
- [ ] All TypeScript errors resolved
- [ ] All linting errors resolved
- [ ] Environment variables documented
- [ ] Secrets removed from codebase
- [ ] `.gitignore` includes all sensitive files

### Local Testing
- [ ] Backend runs without errors: `cd backend && npm run dev`
- [ ] Frontend runs without errors: `cd frontend && npm run dev`
- [ ] Can register new user locally
- [ ] Can login successfully locally
- [ ] API endpoints respond correctly
- [ ] Database migrations work
- [ ] Build succeeds: `npm run build` (both frontend & backend)

---

## Part 1: Supabase Setup

### Account & Project
- [ ] Supabase account created
- [ ] New project created
- [ ] Database password saved securely (password manager)
- [ ] Project region selected (closest to users)

### Database Configuration
- [ ] Connection string copied from Supabase
- [ ] Password inserted in connection string
- [ ] Connection string tested locally
- [ ] Database migrations applied
- [ ] Tables verified in Supabase Table Editor (6 tables)
- [ ] Indexes created successfully

### Security
- [ ] Row Level Security (RLS) policies reviewed
- [ ] Database password is strong (20+ characters)
- [ ] Connection pooling enabled (if needed)
- [ ] SSL mode enabled (should be default)

### Verification
- [ ] Can connect to Supabase from local machine
- [ ] Prisma Studio can access Supabase database
- [ ] Sample user can be created in production database
- [ ] All 6 tables visible: users, photos, albums, album_photos, tags, photo_tags

---

## Part 2: Render Backend Deployment

### Account Setup
- [ ] Render account created
- [ ] GitHub account connected to Render
- [ ] Repository access granted

### Service Configuration
- [ ] Web service created
- [ ] Repository connected
- [ ] Root directory set to `backend`
- [ ] Build command correct: `npm install && npm run db:generate && npm run build`
- [ ] Start command correct: `npm start`
- [ ] Region selected (same as Supabase if possible)

### Environment Variables
All environment variables set in Render dashboard:

- [ ] `DATABASE_URL` - Supabase connection string
- [ ] `JWT_SECRET` - Strong random secret (64+ chars)
- [ ] `JWT_EXPIRES_IN` - Set to `7d`
- [ ] `NODE_ENV` - Set to `production`
- [ ] `PORT` - Set to `10000`
- [ ] `FRONTEND_URL` - Will update after Vercel deployment
- [ ] `MAX_FILE_SIZE` - Set to `20971520`
- [ ] `MAX_FILES_PER_UPLOAD` - Set to `10`
- [ ] `DEFAULT_STORAGE_LIMIT` - Set to `5368709120`

### Deployment
- [ ] Initial deployment triggered
- [ ] Deployment logs reviewed for errors
- [ ] Build completed successfully
- [ ] Service is live
- [ ] Health check passes: `https://your-app.onrender.com/health`

### Verification
- [ ] Backend URL accessible
- [ ] `/health` endpoint returns `{"status":"ok"}`
- [ ] CORS configured correctly
- [ ] Database connection successful (check logs)
- [ ] No errors in Render logs

---

## Part 3: Vercel Frontend Deployment

### Account Setup
- [ ] Vercel account created
- [ ] GitHub account connected to Vercel
- [ ] Repository access granted

### Project Configuration
- [ ] Project imported from GitHub
- [ ] Framework preset: Vite
- [ ] Root directory set to `frontend`
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Install command: `npm install`

### Environment Variables
All environment variables set in Vercel dashboard:

- [ ] `VITE_API_URL` - Render backend URL + `/api`
- [ ] `VITE_USE_MOCK_API` - Set to `false`
- [ ] `VITE_APP_NAME` - Set to `Photo Memories`

### Deployment
- [ ] Initial deployment triggered
- [ ] Build logs reviewed for errors
- [ ] Build completed successfully
- [ ] Deployment is live
- [ ] Production URL accessible

### Verification
- [ ] Frontend URL accessible
- [ ] Login page loads correctly
- [ ] No console errors in browser
- [ ] Static assets load (CSS, images)
- [ ] Favicon displays correctly
- [ ] Page is responsive (test mobile view)

---

## Part 4: Integration Testing

### Backend ↔ Database
- [ ] Backend can connect to Supabase
- [ ] Database queries work (check Render logs)
- [ ] Migrations are applied
- [ ] No connection pool errors

### Frontend ↔ Backend
- [ ] Update `FRONTEND_URL` in Render to Vercel URL
- [ ] Redeploy backend after env var change
- [ ] Frontend can reach backend
- [ ] No CORS errors in browser console
- [ ] API calls succeed (check Network tab)

### End-to-End User Flow
- [ ] Can access frontend URL
- [ ] Can view registration page
- [ ] Can register new account
- [ ] Registration creates user in Supabase database
- [ ] Can login with registered credentials
- [ ] JWT token stored in localStorage
- [ ] Protected routes accessible after login
- [ ] User info displayed correctly (navbar)
- [ ] Can logout successfully
- [ ] After logout, redirected to login page
- [ ] Cannot access protected routes when logged out

### API Endpoints Testing
Test with Postman or curl:

- [ ] `POST /api/auth/register` - Creates user
- [ ] `POST /api/auth/login` - Returns JWT token
- [ ] `GET /api/auth/me` - Returns user info (with auth)
- [ ] `GET /api/photos` - Returns empty array (with auth)
- [ ] `GET /api/albums` - Returns empty array (with auth)
- [ ] `GET /api/tags` - Returns empty array (with auth)

### Error Handling
- [ ] Invalid login shows error message
- [ ] 401 errors redirect to login
- [ ] 404 errors show not found page
- [ ] 500 errors handled gracefully
- [ ] Network errors show user-friendly message

---

## Part 5: Post-Deployment

### Monitoring Setup
- [ ] Render logs reviewed (no errors)
- [ ] Vercel deployment logs reviewed (no errors)
- [ ] Supabase logs reviewed (no errors)
- [ ] Browser console clean (no errors)
- [ ] Network tab shows successful API calls

### Performance Check
- [ ] Frontend loads in < 3 seconds
- [ ] Backend responds in < 500ms
- [ ] Database queries fast (check Supabase)
- [ ] No memory leaks in Render
- [ ] Render service doesn't sleep unnecessarily

### Security Review
- [ ] HTTPS enabled (automatic on Render/Vercel)
- [ ] CORS configured correctly (only your frontend)
- [ ] JWT secret is strong and unique
- [ ] No secrets in frontend code
- [ ] No secrets in GitHub repository
- [ ] Environment variables not in .env files in repo
- [ ] Database password is strong
- [ ] Supabase RLS policies reviewed

### Documentation
- [ ] Production URLs documented
- [ ] Deployment process documented
- [ ] Environment variables documented
- [ ] Access credentials stored securely
- [ ] Team members notified (if applicable)

### Backup & Recovery
- [ ] Supabase daily backups enabled (automatic on free tier)
- [ ] Database can be restored from backup
- [ ] Repository is backed up (GitHub)
- [ ] Environment variables documented securely

---

## Part 6: Optional Enhancements

### Custom Domains
- [ ] Domain purchased (if desired)
- [ ] DNS configured for frontend
- [ ] DNS configured for backend
- [ ] SSL certificates issued
- [ ] Environment variables updated with custom domains
- [ ] Services redeployed

### Analytics & Monitoring
- [ ] Error tracking configured (Sentry)
- [ ] Analytics configured (Google Analytics, Plausible)
- [ ] Uptime monitoring configured
- [ ] Alert notifications configured
- [ ] Performance monitoring configured

### Additional Services
- [ ] Cloudinary account created (for photo uploads)
- [ ] Cloudinary credentials added to Render
- [ ] Email service configured (SendGrid, Mailgun)
- [ ] Redis configured (for caching)

---

## Troubleshooting Reference

### Common Issues

**Backend won't connect to database:**
- Check DATABASE_URL format
- Verify Supabase project is active
- Check password in connection string
- Review Supabase connection limits

**CORS errors:**
- Verify FRONTEND_URL in Render matches Vercel URL exactly
- Include protocol: `https://` not `http://`
- No trailing slash in URL
- Redeploy backend after changing env vars

**Build fails on Render:**
- Check build logs for specific error
- Verify package.json scripts
- Ensure all dependencies in package.json
- Test build locally first

**Build fails on Vercel:**
- Check TypeScript errors
- Verify all imports are correct
- Test build locally first
- Check Vercel build logs

**Frontend can't reach backend:**
- Verify VITE_API_URL includes `/api`
- Check backend is actually running
- Test backend health endpoint directly
- Check for typos in URLs

---

## Deployment Complete! 🎉

### What's Working
✅ Supabase PostgreSQL database
✅ Render backend API
✅ Vercel frontend
✅ User registration & authentication
✅ Protected routes
✅ Full stack integration

### What's Next
- Implement photo upload (Cloudinary)
- Add remaining frontend features (from FEATURE_BACKLOG.md)
- Set up monitoring and alerts
- Add analytics
- Optimize performance
- Scale as needed

### Production URLs
```
Frontend:  https://_____________________.vercel.app
Backend:   https://_____________________.onrender.com
Database:  Managed in Supabase dashboard
```

### Support
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Project Issues: GitHub repository issues

---

**Date Deployed:** _______________
**Deployed By:** _______________
**Version:** 0.1.0 (MVP)
