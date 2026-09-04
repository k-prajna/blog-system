# BlogPlatform — Full-Stack Blog with Comments

A modern, production-style blogging platform where users can register, log in, create and manage blog posts, and interact through comments.

Inspired by Medium, Hashnode, and Dev.to.

---

## Features

- **Authentication**
  - Register / Login with JWT
  - Password hashing (bcrypt)
  - Protected routes
  - Persistent login (localStorage + Zustand)

- **Blog Posts**
  - Create, Read, Update, Delete (CRUD)
  - Search, category filter, sort (newest / oldest / most viewed)
  - Pagination
  - Cover images, tags, categories, view count, reading time
  - Author-only edit/delete

- **Comments**
  - Add, edit, delete own comments
  - Nested under posts
  - Login required to comment

- **UI/UX**
  - Clean, responsive design (Tailwind CSS)
  - Loading skeletons, empty states, toasts
  - Confirmation dialogs
  - Mobile-friendly navigation

---

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- React Hook Form
- Zustand (auth state)
- Lucide React (icons)
- React Hot Toast

### Backend
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- JWT + bcryptjs
- Zod (validation)
- CORS + dotenv

---

## Project Structure

```
blog-platform/
├── frontend/                 # React + Vite app
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── pages/            # Route pages
│   │   ├── layouts/
│   │   ├── services/         # API clients
│   │   ├── store/            # Zustand stores
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── backend/                  # Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   ├── config/
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
├── .gitignore
└── README.md
```

---

## Installation

### Prerequisites
- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas URI)

### 1. Clone / Extract

```bash
cd blog-platform
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your values
npm install
```

Example `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blog-platform
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Frontend Setup

```bash
cd ../frontend
cp .env.example .env
npm install
```

Example `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Running the App

### Start MongoDB
Make sure MongoDB is running:

```bash
# Local
mongod
# or use MongoDB Atlas connection string in .env
```

### Seed the Database (optional but recommended)

```bash
cd backend
npm run seed
```

Sample credentials after seeding:

| Role  | Email              | Password    |
|-------|--------------------|-------------|
| Admin | alice@example.com  | password123 |
| User  | bob@example.com    | password123 |
| User  | carol@example.com  | password123 |

### Start Backend

```bash
cd backend
npm run dev
```

Server runs at `http://localhost:5000`

### Start Frontend

```bash
cd frontend
npm run dev
```

App runs at `http://localhost:5173`

---

## API Documentation

Base URL: `http://localhost:5000/api`

### Auth
| Method | Endpoint            | Auth | Description          |
|--------|---------------------|------|----------------------|
| POST   | /auth/register      | No   | Register new user    |
| POST   | /auth/login         | No   | Login                |
| GET    | /auth/me            | Yes  | Get current user     |

### Posts
| Method | Endpoint            | Auth | Description          |
|--------|---------------------|------|----------------------|
| GET    | /posts              | No   | List posts (query: page, limit, search, category, sort) |
| GET    | /posts/:id          | No   | Get single post      |
| POST   | /posts              | Yes  | Create post          |
| PUT    | /posts/:id          | Yes  | Update own post      |
| DELETE | /posts/:id          | Yes  | Delete own post      |

### Comments
| Method | Endpoint                      | Auth | Description       |
|--------|-------------------------------|------|-------------------|
| GET    | /posts/:postId/comments       | No   | List comments     |
| POST   | /posts/:postId/comments       | Yes  | Add comment       |
| PUT    | /comments/:id                 | Yes  | Update own comment|
| DELETE | /comments/:id                 | Yes  | Delete own comment|

### Users
| Method | Endpoint            | Auth | Description          |
|--------|---------------------|------|----------------------|
| GET    | /users/:id          | No   | Get user profile     |
| GET    | /users/:id/posts    | No   | Get posts by author  |

All responses follow:

```json
{
  "success": true|false,
  "message": "...",
  "data": {}
}
```

---

## Authentication Flow

1. User registers or logs in → backend returns JWT + user object.
2. Frontend stores token in localStorage and Zustand.
3. Axios interceptor attaches `Authorization: Bearer <token>` to every request.
4. Backend `protect` middleware verifies JWT and attaches `req.user`.
5. On page refresh, `loadUser()` calls `/auth/me` to restore session.

---

## Post → Comment Relationship

- `Comment` model has `post: ObjectId` (ref Post) and `author: ObjectId` (ref User).
- Deleting a post cascades and removes all its comments.
- Comment counts are computed on the fly when listing posts.

---

## Testing Checklist

- [ ] Register new user
- [ ] Login with valid/invalid credentials
- [ ] Duplicate email registration fails
- [ ] Create post (authenticated)
- [ ] Edit/delete only own posts
- [ ] Search / filter / sort / pagination
- [ ] Add / edit / delete own comments
- [ ] Unauthenticated users cannot comment or create posts
- [ ] Logout clears session

---

## Future Improvements

- Rich text editor (Tiptap / Quill)
- Image upload (Cloudinary / S3)
- Dark mode toggle
- Follow authors / like posts
- Email verification & password reset
- Admin dashboard
- SEO meta tags & sitemap

---

## License

MIT
