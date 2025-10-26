# Photo Memories

A modern, cloud-based photo management application inspired by Google Photos, Flickr, and Apple Photos. Built with free/low-cost technologies to deliver a professional-grade user experience.

## Features

### MVP Features (Phase 1)
- Upload photos with drag-and-drop
- Responsive gallery grid with lazy loading
- Create and manage albums
- Full-screen photo viewer with zoom
- Search photos by name, date, tags
- User authentication and profiles
- Automatic image optimization

### Planned Features (Phase 2+)
- Timeline view by date
- Favorites and likes
- Advanced tagging system
- Share albums via link
- Face detection
- Smart search (AI-powered)
- Basic photo editing
- Mobile PWA support

## Tech Stack

### Frontend
- React 18 + Vite
- TailwindCSS for styling
- React Query for data fetching
- Zustand for state management
- React Image Gallery for photo viewing

### Backend
- Node.js + Express
- Sharp for image processing
- Passport.js for authentication
- Prisma ORM

### Infrastructure
- **Database**: PostgreSQL (Neon.tech) - Free 512MB
- **Storage**: Cloudinary - Free 25GB
- **Hosting**: Vercel (frontend) + Render (backend)
- **Cost**: $0/month for MVP

## Project Structure

```
photo-memories/
├── docs/
│   ├── SYSTEM_DESIGN.md      # Complete system design
│   ├── TECH_DECISIONS.md     # Technology choices explained
│   └── API.md                # API documentation
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom hooks
│   │   ├── services/         # API clients
│   │   ├── store/            # State management
│   │   └── utils/            # Helper functions
│   ├── public/               # Static assets
│   └── package.json
├── backend/                  # Express API
│   ├── src/
│   │   ├── routes/           # API routes
│   │   ├── controllers/      # Route controllers
│   │   ├── middleware/       # Express middleware
│   │   ├── services/         # Business logic
│   │   ├── models/           # Prisma models
│   │   └── utils/            # Helper functions
│   ├── prisma/               # Database schema
│   └── package.json
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git
- Neon.tech account (free)
- Cloudinary account (free)

### Setup Instructions

1. **Clone the repository**
```bash
git clone <repository-url>
cd photo-memories
```

2. **Setup Neon.tech**
   - Go to [neon.tech](https://neon.tech)
   - Create new project
   - Copy database connection string

3. **Setup Cloudinary**
   - Go to [cloudinary.com](https://cloudinary.com)
   - Create free account
   - Copy cloud name, API key, and API secret

4. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run db:migrate
npm run dev
```

5. **Frontend Setup**
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with API URL
npm run dev
```

6. **Access the app**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

## Development Workflow

### Running locally
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### Database migrations
```bash
cd backend
npm run db:migrate       # Run migrations
npm run db:studio        # Open Prisma Studio
```

### Building for production
```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && npm run build
```

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy automatically on push

### Backend (Render)
1. Connect repository to Render
2. Select Node.js environment
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables
6. Deploy

### Environment Variables

**Backend (.env)**
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Photo Memories
```

## Architecture

### High-Level Overview
```
React SPA (Vercel)
    ↓ REST API
Express Backend (Render)
    ↓                    ↓
PostgreSQL (Neon.tech)  Cloudinary (Images)
```

### Data Flow
1. User uploads photo → Frontend
2. Frontend sends to API → Backend
3. Backend processes image → Sharp
4. Backend uploads to cloud → Cloudinary
5. Backend saves metadata → PostgreSQL
6. Frontend displays photo → CDN

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Photos
- `GET /api/photos` - List photos (paginated)
- `POST /api/photos` - Upload photos
- `GET /api/photos/:id` - Get photo details
- `DELETE /api/photos/:id` - Delete photo
- `PUT /api/photos/:id` - Update metadata

### Albums
- `GET /api/albums` - List albums
- `POST /api/albums` - Create album
- `GET /api/albums/:id` - Get album with photos
- `POST /api/albums/:id/photos` - Add photos to album

See [API.md](docs/API.md) for complete documentation.

## Database Schema

### Core Tables
- `users` - User accounts
- `photos` - Photo metadata and URLs
- `albums` - Photo collections
- `album_photos` - Album-Photo relationships
- `tags` - Photo tags
- `photo_tags` - Photo-Tag relationships

See [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md) for complete schema.

## Performance

### Optimization Strategies
- Image lazy loading with Intersection Observer
- Virtual scrolling for large galleries
- CDN for global content delivery
- Database query optimization with indexes
- Code splitting by route
- WebP format for smaller file sizes

### Target Metrics
- Page load: < 2 seconds
- Photo upload: < 5 seconds (5MB)
- Gallery scroll: 60fps
- API response: < 200ms (p95)

## Security

- JWT authentication with HttpOnly cookies
- Password hashing with bcrypt
- File type validation (magic bytes)
- Rate limiting on uploads
- CORS whitelist
- SQL injection protection (Prisma)
- XSS protection (React escaping)
- HTTPS only in production

## Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## Roadmap

### Phase 1 (Weeks 1-3) - MVP
- [x] System design
- [ ] Project setup
- [ ] Authentication
- [ ] Photo upload & processing
- [ ] Gallery view
- [ ] Albums
- [ ] Deploy to staging

### Phase 2 (Weeks 4-6) - Enhanced
- [ ] Search functionality
- [ ] Tags management
- [ ] Favorites
- [ ] Timeline view
- [ ] Sharing
- [ ] Performance optimization

### Phase 3 (Weeks 7-8) - Advanced
- [ ] Face detection
- [ ] Smart search (AI)
- [ ] Photo editing
- [ ] PWA optimization
- [ ] Analytics dashboard

## Cost Analysis

### Free Tier (0-100 users)
- Cloudinary: 25GB storage + 25GB bandwidth
- Neon.tech: 512MB database + generous compute hours
- Vercel: 100GB bandwidth
- Render: 750 hours/month
- **Total: $0/month**

### At Scale (1000 users)
- Cloudinary: $99/month
- Neon.tech: $19/month (Launch plan)
- Render: $7/month (always-on)
- Vercel: Still free
- **Total: $125/month**

## License

MIT License - see LICENSE file for details

## Support

- Documentation: [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md)
- Issues: GitHub Issues
- Discussions: GitHub Discussions

## Acknowledgments

Inspired by:
- Google Photos - Smart organization and search
- Flickr - High-quality storage and albums
- Apple Photos - Clean UI and memories
- Unsplash - Beautiful image layouts

---

Built with ❤️ using free and open-source technologies
