# Photo Memories - Frontend

React + TypeScript + Vite frontend for Photo Memories application.

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first styling
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **Zustand** - State management
- **Axios** - HTTP client
- **React Dropzone** - File upload

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:3000`

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your API URL
# VITE_API_URL=http://localhost:3000/api
```

### Development

```bash
# Start development server
npm run dev

# App will be available at http://localhost:5173
```

### Build

```bash
# Type check
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/        # React components
│   ├── common/       # Shared components (Layout, Button, etc)
│   ├── gallery/      # Gallery-specific components
│   ├── auth/         # Authentication components
│   └── albums/       # Album components
├── pages/            # Page components (routes)
├── hooks/            # Custom React hooks
├── services/         # API service functions
├── store/            # Zustand state stores
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── assets/           # Static assets
├── routes/           # Route definitions
├── App.tsx           # Main App component
├── main.tsx          # App entry point
└── index.css         # Global styles with Tailwind
```

## Features

### Current (MVP)
- Authentication (Login/Register)
- Responsive layouts (Desktop/Mobile)
- Protected routes
- Type-safe API client
- State management (Auth, Uploads)
- Error handling

### Planned
- Photo upload with drag-and-drop
- Gallery grid with lazy loading
- Album management
- Photo viewer (lightbox)
- Search functionality
- Favorites
- Tags
- Profile management

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000/api` |
| `VITE_APP_NAME` | Application name | `Photo Memories` |

### Tailwind Configuration

Custom theme colors are defined in `tailwind.config.js`:
- Primary color: Sky blue scale (0ea5e9)
- Custom utility classes in `src/index.css`

### Path Aliases

TypeScript path alias `@/*` maps to `src/*`:
```typescript
import { User } from '@/types'
import api from '@/services/api'
```

## API Integration

All API calls go through `src/services/api.ts` which:
- Adds JWT token to requests
- Handles 401 errors (auto-logout)
- Formats error messages
- Sets base URL from env

Service files:
- `auth.service.ts` - Authentication endpoints
- `photo.service.ts` - Photo CRUD operations
- `album.service.ts` - Album management
- `tag.service.ts` - Tag operations

## State Management

### Auth Store (`authStore.ts`)
- User data
- JWT token
- Login/Register/Logout
- Persisted to localStorage

### Upload Store (`uploadStore.ts`)
- File upload queue
- Upload progress tracking
- Upload status management

## Routing

Routes are defined in `src/routes/index.tsx`:

**Public routes:**
- `/` - Home page
- `/login` - Login page
- `/register` - Register page

**Protected routes:**
- `/gallery` - Main photo gallery
- `/albums` - Album list
- `/albums/:id` - Album details
- `/favorites` - Favorite photos
- `/profile` - User profile

## Styling

### Custom CSS Classes

Defined in `src/index.css`:

**Buttons:**
- `.btn-primary` - Primary action button
- `.btn-secondary` - Secondary button

**Forms:**
- `.input-field` - Standard form input

**Other:**
- `.card` - Card container
- `.scrollbar-hide` - Hide scrollbar

### Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Bottom navigation for mobile
- Top navigation for desktop

## TypeScript

All components use TypeScript with strict mode:
- Strict null checks
- No implicit any
- No unused locals/parameters
- Full type coverage

Type definitions in `src/types/index.ts` include:
- User, Photo, Album, Tag
- API request/response types
- Store interfaces
- Query parameters

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Build Optimization

Production builds include:
- Code splitting by route
- Tree-shaking unused code
- Minification
- Gzip/Brotli compression

## Development Tips

1. **Hot Module Replacement**: Vite provides instant HMR - changes reflect immediately
2. **Type Checking**: Run `npm run lint` before committing
3. **API Mocking**: Use `src/services/api.ts` interceptors for offline development
4. **React DevTools**: Install for component inspection
5. **React Query DevTools**: Add `@tanstack/react-query-devtools` for debugging

## Troubleshooting

**Port already in use:**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

**TypeScript errors:**
```bash
# Clear TypeScript cache
rm -rf node_modules/.vite
```

**CORS errors:**
- Check backend CORS configuration
- Verify `VITE_API_URL` in `.env`

## License

MIT
