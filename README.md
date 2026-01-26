# NihongoLab - Japanese Language Learning Platform

A full-stack Japanese language learning application with **spaced repetition system (SRS)**, gamified progress tracking, and JLPT-aligned content. Built with modern TypeScript, featuring real-time learning analytics and an intelligent review algorithm.

## 🌟 Features

### 🔐 Authentication & Security
- **Better Auth** integration with email/password
- Email verification flow
- Session management with HTTP-only cookies
- Rate limiting (100 req/15min global, 20 req/15min auth routes)
- CSRF protection on all non-auth routes
- Secure CORS configuration

### 📚 Learning System
- **Hiragana & Katakana**: Reading-only practice questions
- **Kanji Learning**: Multi-type questions (reading, meaning, kanji-to-reading, etc.)
- **JLPT Levels**: N5, N4 content (expandable to N3, N2, N1)
- **Vocabulary Browser**: 1000+ words organized by categories
- **Instant Feedback**: Real-time answer validation
- **XP & Leveling**: Gamified progression system

### 🧠 Spaced Repetition Algorithm
- **SM-2 Inspired SRS**: Intelligent review scheduling
- **Ease Factor Management**: 130-300 range with ±10/±20 adjustments
- **Dynamic Intervals**: 1-3 day review cycles based on performance
- **Progress Tracking**: Attempts, correctness, and review dates
- **Review Priority**: Oldest and due-first questions prioritized

### 📊 Dashboard Analytics
- **User Statistics**: Total answered, accuracy rate, streak days
- **Level Progress**: Per-level completion percentages
- **Activity Graph**: Last 7 days visualization
- **Mastery Metrics**: Questions mastered vs. needing review
- **Next Level Preview**: Progress towards next JLPT level

### 🖼️ Media Management
- **Cloudinary Integration**: Profile image uploads
- **Automatic Optimization**: Face detection, resizing (400x400)
- **Format Conversion**: Auto WebP support
- **Size Limits**: 5MB max, JPEG/PNG/WEBP only

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: [Hono](https://hono.dev/) - Ultrafast web framework
- **Language**: TypeScript 5+
- **Database**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Better Auth](https://www.better-auth.com/)
- **Validation**: Zod schemas
- **Image Upload**: Cloudinary SDK v2
- **Rate Limiting**: hono-rate-limiter

### Frontend
- **Framework**: SvelteKit
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

### Monorepo & Tooling
- **Monorepo**: Turborepo
- **Package Manager**: npm/pnpm
- **Linting**: ESLint with Svelte plugin
- **Formatting**: Prettier
- **Database Migrations**: Drizzle Kit

## 📁 Project Structure

```
nihongolab/
├── apps/
│   ├── web/                    # SvelteKit frontend
│   │   ├── src/
│   │   │   ├── routes/         # SvelteKit routes
│   │   │   ├── lib/            # Shared utilities
│   │   │   └── components/     # UI components
│   │   └── package.json
│   └── docs/                   # Documentation site
│
├── packages/
│   ├── db/                     # Database package
│   │   ├── schema.ts           # Drizzle schema definitions
│   │   ├── repositories/       # Data access layer
│   │   └── types/              # TypeScript types
│   ├── ui/                     # Shared Svelte components
│   └── eslint-config-custom/   # Shared ESLint config
│
└── api/                        # Hono backend server
    ├── controller/
    │   ├── userController.ts
    │   ├── learningController.ts
    │   ├── dashboardController.ts
    │   └── vocabularyController.ts
    ├── service/
    │   ├── userService.ts
    │   ├── learningService.ts
    │   ├── dashboardService.ts
    │   └── vocabularyService.ts
    ├── middleware/
    │   ├── auth.middleware.ts  # Better Auth session validation
    │   └── rateLimiter.ts      # Rate limit configuration
    ├── lib/
    │   ├── auth.ts             # Better Auth setup
    │   └── email.ts            # Email sending utilities
    └── index.ts                # Hono app entry point
```

## 🗃️ Database Schema

### Core Tables

#### `users`
- User accounts with learning progress
- Fields: `id`, `name`, `email`, `emailVerified`, `image`, `currentExp`, `currentLevelId`
- Integrated with Better Auth

#### `levels`
- JLPT levels (N5, N4, N3, N2, N1)
- Fields: `id`, `name`, `requiredExp`

#### `questions`
- Learning content (hiragana, katakana, kanji)
- Fields: `id`, `levelId`, `scriptType`, `questionType`, `questionText`, `correctAnswer`, `options`
- Question types: `reading`, `meaning`, `kanji-to-reading`, `kanji-to-meaning`, `meaning-to-kanji`

#### `user_progress`
- Individual question progress with SRS data
- Fields: `id`, `userId`, `questionId`, `isCorrect`, `attempts`, `answeredAt`, `lastAttemptedAt`, `nextReviewAt`, `easeFactor`
- Unique constraint: `(userId, questionId)`

#### `user_stats`
- Dashboard statistics
- Fields: `userId`, `totalAnswered`, `correctAnswers`, `streak`, `lastActiveAt`

#### `vocabulary`
- JLPT vocabulary with categories
- Fields: `id`, `word`, `reading`, `meaning`, `partOfSpeech`, `category`, `levelId`
- Indexed for fast search

#### Better Auth Tables
- `session`: Active user sessions
- `account`: OAuth account linking
- `verification`: Email verification tokens

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Cloudinary account (for image uploads)
- npm or pnpm

### Environment Variables

Create `.env` in the API root:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/nihongolab"

# Better Auth
BETTER_AUTH_SECRET="your-32-char-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Email (for verification)
DEV_MAIL="dev@example.com"

# App
NODE_ENV="development"
PORT=3000
```

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/nihongolab.git
cd nihongolab

# Install dependencies
npm install

# Setup database
cd packages/db
npm run db:push

# Seed initial data (levels, questions, vocabulary)
npm run db:seed
```

### Development

```bash
# Run all packages in dev mode (recommended)
npm run dev

# Or run specific packages
npm run dev --filter=api        # Backend only
npm run dev --filter=web        # Frontend only
npm run dev --filter=@nihongolab/db  # Watch database changes
```

**URLs:**
- API: `http://localhost:3000/api`
- Frontend: `http://localhost:5173`
- Better Auth: `http://localhost:3000/api/auth/*`

### Building for Production

```bash
# Build all packages
npm run build

# Build specific package
npm run build --filter=web
npm run build --filter=api

# Preview production build
npm run preview
```

## 🔌 API Endpoints Overview

### Authentication (`/api/auth/*`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/sign-up/email` | Register with email/password |
| POST | `/auth/sign-in/email` | Login and create session |
| POST | `/auth/sign-out` | Logout current session |
| GET | `/auth/get-session` | Get current session data |

### Users (`/api/users/*`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/users/me` | Get user profile with level | ✅ |
| PATCH | `/users/me` | Update name/image | ✅ |
| POST | `/users/upload-image` | Upload to Cloudinary (5MB max) | ✅ |

### Learning (`/api/learn/*`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/learn/:script?limit=10` | Get random questions (hiragana/katakana/kanji) | ❌ |
| POST | `/learn/submit` | Submit answer, get feedback + XP | ✅ |
| POST | `/learn/complete` | Complete lesson (5+ questions) | ✅ |

### Dashboard (`/api/dashboard/*`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/dashboard` | Full dashboard with stats | ✅ |
| GET | `/dashboard/review` | Count of questions needing review | ✅ |
| GET | `/dashboard/review/start` | Get 20 review questions (SRS) | ✅ |
| POST | `/dashboard/review/answer` | Submit review answer (updates SRS) | ✅ |
| GET | `/dashboard/kanji?level=N5` | Get kanji by JLPT level | ✅ |

### Vocabulary (`/api/vocabulary`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/vocabulary?levelId=1&limit=25&cursor=10&search=hello` | Browse vocabulary (paginated) | ❌ |

📘 **Full API documentation**: See `openapi.yaml` (OpenAPI 3.1 spec)

## 🧪 Testing

```bash
# Run tests (if configured)
npm test

# Run linter
npm run lint

# Format code
npm run format
```

## 🎮 Spaced Repetition Algorithm Details

### Initial State
- New questions start with `easeFactor: 250` (2.5x multiplier)
- First review scheduled after initial answer

### On Correct Answer
```typescript
newEaseFactor = Math.min(currentEase + 10, 300)  // Max 3.0x
intervalDays = Math.max(1, Math.round(newEaseFactor / 100))
// Examples: 250 → 2-3 days, 280 → 2-3 days, 300 → 3 days
```

### On Incorrect Answer
```typescript
newEaseFactor = Math.max(currentEase - 20, 130)  // Min 1.3x
intervalDays = 1  // Review tomorrow
```

### Review Priority
Questions are fetched in order:
1. Due questions (`nextReviewAt <= now`) - earliest first
2. Legacy incorrect questions (`isCorrect = false`)
3. Multi-attempt questions (`attempts > 1`)

Limit: 20 questions per session

## 🔒 Security Features

### Rate Limiting
- **Global**: 100 requests per 15 minutes per IP
- **Auth Routes**: 20 requests per 15 minutes per IP
- Uses `x-forwarded-for` and `x-real-ip` headers

### CSRF Protection
- Enabled for all non-auth routes
- Origin validation against `http://localhost:5173`
- Better Auth handles its own CSRF

### CORS
- **Allowed Origin**: `http://localhost:5173`
- **Credentials**: Enabled (for cookies)
- **Methods**: GET, POST, PATCH, DELETE, OPTIONS
- **Headers**: Content-Type, Authorization

### Session Security
- HTTP-only cookies
- Secure flag in production
- SameSite=Lax
- Better Auth session management

## 📦 Available Scripts

```bash
# Development
npm run dev              # Run all packages in dev mode
npm run dev:api          # Backend only
npm run dev:web          # Frontend only

# Building
npm run build            # Build all packages
npm run build:api        # Build backend
npm run build:web        # Build frontend

# Database
npm run db:push          # Push schema changes
npm run db:generate      # Generate migrations
npm run db:migrate       # Run migrations
npm run db:studio        # Open Drizzle Studio
npm run db:seed          # Seed initial data

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm run type-check       # TypeScript type checking
```

## 🌐 Deployment

### Backend (API)
1. Set environment variables on your host
2. Build: `npm run build --filter=api`
3. Start: `node dist/index.js`
4. Ensure PostgreSQL is accessible
5. Run migrations: `npm run db:migrate`

### Frontend (SvelteKit)
1. Build: `npm run build --filter=web`
2. Deploy to Vercel/Netlify/Cloudflare Pages
3. Configure environment variables
4. Set API base URL

### Database
- Use managed PostgreSQL (Railway, Supabase, Neon, etc.)
- Run migrations before deployment
- Backup strategy recommended

### Cloudinary
- Configure production domain in settings
- Set upload presets if needed
- Enable auto-optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

**Coding Standards:**
- Follow TypeScript/ESLint conventions
- Write meaningful commit messages
- Update OpenAPI spec for API changes
- Test authentication flows
- Update documentation

## 📝 License

[MIT]

## 🙏 Acknowledgments

- [Better Auth](https://www.better-auth.com/) for authentication
- [Hono](https://hono.dev/) for the fast backend framework
- [Drizzle ORM](https://orm.drizzle.team/) for type-safe database queries
- [Cloudinary](https://cloudinary.com/) for image management
- JLPT content providers and contributors

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/FardanHadafi/nihongolab/issues)
- **Discussions**: [GitHub Discussions](https://github.com/FardanHadafi/nihongolab/discussions)
- **Email**: fardan.hadafi@yahoo.com

---

**Made with ❤️ for Japanese language learners**