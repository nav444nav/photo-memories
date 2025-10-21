# Technology Decision Records

## Why These Technologies?

### 1. React + Vite (Frontend)

**Decision**: Use React with Vite as build tool

**Reasoning**:
- React has the largest ecosystem for component libraries
- Vite provides instant hot module replacement (HMR)
- Fast build times compared to Create React App
- Better developer experience
- Native ES modules support

**Alternatives Considered**:
- Vue.js: Smaller ecosystem for image libraries
- Next.js: Overkill for SPA, adds complexity
- Svelte: Less mature ecosystem

**Cost**: Free, open-source

---

### 2. TailwindCSS (Styling)

**Decision**: Use TailwindCSS utility framework

**Reasoning**:
- Rapid prototyping with utility classes
- No CSS naming conflicts
- Built-in responsive design
- Easy to customize theme
- Smaller bundle size (tree-shaking)

**Alternatives Considered**:
- Material-UI: Heavier bundle, opinionated design
- Styled-components: Runtime cost, slower
- Plain CSS: More development time

**Cost**: Free

---

### 3. Node.js + Express (Backend)

**Decision**: Use Node.js with Express framework

**Reasoning**:
- JavaScript full-stack (same language)
- Huge npm ecosystem
- Excellent image processing libraries (Sharp)
- Easy deployment on free platforms
- Non-blocking I/O perfect for file uploads

**Alternatives Considered**:
- Python + Django: Heavier, slower for I/O
- Go: Steeper learning curve, smaller ecosystem
- PHP: Legacy feel, less modern tooling

**Cost**: Free

---

### 4. PostgreSQL via Supabase (Database)

**Decision**: Use Supabase (managed PostgreSQL)

**Reasoning**:
- Free tier: 500MB database + 1GB bandwidth
- Built-in authentication APIs
- Real-time subscriptions (bonus feature)
- Row-level security built-in
- REST API auto-generated
- PostgreSQL is battle-tested, ACID compliant

**Alternatives Considered**:
- MongoDB Atlas: Only 512MB free, NoSQL not needed
- PlanetScale: MySQL, more complex branching
- Firebase: NoSQL, expensive at scale

**Cost**: $0/month (free tier)
**Upgrade**: $25/month if needed

---

### 5. Cloudinary (Image Storage & CDN)

**Decision**: Use Cloudinary for image storage

**Reasoning**:
- Free tier: 25GB storage + 25GB bandwidth
- Built-in image transformations (resize, crop, optimize)
- Automatic WebP conversion
- Global CDN included
- On-the-fly image manipulation via URL
- No need to manage image processing pipeline

**Alternatives Considered**:
- AWS S3 + CloudFront: Complex setup, costs add up
- Cloudflare R2: Good but no built-in transformations
- ImageKit: Lower free tier (20GB)
- Self-hosted: Need to manage storage, backups, CDN

**Cost**: $0/month (free tier)
**Upgrade**: $99/month at ~1000 users

**Why not S3?**
S3 costs would be:
- Storage: $0.023/GB = ~$0.50/month (25GB)
- Bandwidth: $0.09/GB = ~$2.25/month (25GB)
- Requests: $0.0004/1000 = ~$0.10/month
- CloudFront CDN: +$0.085/GB = +$2.13/month
- Lambda for processing: +$0.20/month
**Total: ~$5/month vs $0 with Cloudinary**

---

### 6. Vercel (Frontend Hosting)

**Decision**: Deploy frontend on Vercel

**Reasoning**:
- Free tier: Unlimited sites, 100GB bandwidth
- Automatic deployments from Git
- Global CDN (edge network)
- Zero configuration for React/Vite
- Preview deployments for PRs
- Excellent performance (built by Next.js team)

**Alternatives Considered**:
- Netlify: Similar, slightly slower builds
- GitHub Pages: No server-side logic
- Cloudflare Pages: Good alternative

**Cost**: $0/month (free tier)

---

### 7. Render (Backend Hosting)

**Decision**: Deploy backend on Render

**Reasoning**:
- Free tier: 512MB RAM, 750 hours/month
- Easy Node.js deployment
- Automatic HTTPS
- Environment variables management
- Health checks and auto-restart
- Direct database connections

**Downside**: App sleeps after 15min inactivity
**Solution**: Acceptable for MVP, upgrade to $7/month for always-on

**Alternatives Considered**:
- Heroku: No longer has free tier
- Railway: Similar, 500 hours/month
- Fly.io: More complex setup
- AWS EC2: Need to manage servers

**Cost**: $0/month (free tier with sleep)
**Upgrade**: $7/month for always-on

---

### 8. Sharp (Image Processing)

**Decision**: Use Sharp library for server-side processing

**Reasoning**:
- Fastest Node.js image library
- Uses libvips (faster than ImageMagick)
- Memory efficient
- Supports all major formats
- Can resize 1MB image in ~50ms
- Perfect for generating thumbnails

**Alternatives Considered**:
- Jimp: Pure JS, much slower (10x)
- ImageMagick: Memory hungry, slower
- GraphicsMagick: Legacy, less active

**Cost**: Free, open-source

---

## Cost Comparison: MVP vs Scale

### MVP (0-100 users)
| Service | Free Tier | Usage | Cost |
|---------|-----------|-------|------|
| Cloudinary | 25GB/25GB | 10GB/15GB | $0 |
| Supabase | 500MB/1GB | 200MB/500MB | $0 |
| Vercel | 100GB bandwidth | 20GB | $0 |
| Render | 750 hours | 720 hours | $0 |
| **Total** | | | **$0/month** |

### Scale (1000 users)
| Service | Need | Cost |
|---------|------|------|
| Cloudinary | 100GB/100GB | $99 |
| Supabase | 8GB/unlimited | $25 |
| Vercel | Still in free tier | $0 |
| Render | Always-on | $7 |
| **Total** | | **$131/month** |

### Alternative (Self-hosted at scale)
| Service | Need | Cost |
|---------|------|------|
| DigitalOcean Droplet | 4GB RAM | $24 |
| S3 Storage | 100GB | $2.30 |
| CloudFront CDN | 100GB | $8.50 |
| Database backup | S3 | $1 |
| **Total** | | **$35/month** |

**Decision**: Start with managed services (easier), migrate if >1000 users

---

## When to Consider Paid Options?

### Render: Upgrade to $7/month when:
- You have regular daily users
- App sleep delay is annoying users
- Faster response times needed

### Cloudinary: Upgrade to $99/month when:
- Storage exceeds 25GB
- Bandwidth exceeds 25GB/month
- Need advanced transformations

### Supabase: Upgrade to $25/month when:
- Database exceeds 500MB
- Need more than 1GB bandwidth
- Want automated backups

### Self-hosting: Consider when:
- Monthly costs exceed $150/month
- Have DevOps expertise
- Need full control
- Estimate: Can reduce to ~$50/month self-hosted

---

## Free Forever Options

These will never require payment:
- GitHub (source control)
- GitHub Actions (CI/CD - 2000 mins/month free)
- Cloudflare DNS (free tier sufficient)
- Google Analytics (free forever)
- Sentry error tracking (5K errors/month free)

---

## Tech Stack Summary

**Frontend**: React + Vite + TailwindCSS + Vercel
**Backend**: Node.js + Express + Render
**Database**: PostgreSQL (Supabase)
**Storage**: Cloudinary
**Cost**: $0/month for MVP, $131/month at scale

**Total Development Cost**: $0
**Time to MVP**: 3-4 weeks
**Scalability**: Can handle 1000+ users before paid plans needed
