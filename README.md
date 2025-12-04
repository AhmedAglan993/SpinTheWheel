# Spin the Wheel - Full Stack Setup Guide

This guide will help you set up both the backend (Node.js/Express/PostgreSQL) and frontend (React/Vite) for the Spin the Wheel application.

## Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **PostgreSQL** ([Download](https://www.postgresql.org/download/))
- **Git** (optional, for version control)

---

## Part 1: PostgreSQL Database Setup

### 1. Install PostgreSQL

**Windows:**
1. Download from https://www.postgresql.org/download/windows/
2. Run the installer
3. **Remember the password** you set for the `postgres` user
4. Default port: `5432`

**Verify Installation:**
```bash
psql --version
```

### 2. Create Database

**Option A: Using pgAdmin (GUI)**
1. Open pgAdmin (installed with PostgreSQL)
2. Right-click "Databases" → Create → Database
3. Name: `spinthewheel`
4. Click Save

**Option B: Using Command Line**
```bash
psql -U postgres
CREATE DATABASE spinthewheel;
\q
```

---

## Part 2: Backend Setup

### 1. Navigate to Server Directory
```bash
cd server
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env`:
```bash
copy .env.example .env
```

Edit `.env` and update with your PostgreSQL password:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD_HERE@localhost:5432/spinthewheel?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
```

**Replace `YOUR_PASSWORD_HERE`** with the password you set during PostgreSQL installation.

### 4. Initialize Database

Push the Prisma schema to create all tables:
```bash
npm run db:push
```

You should see output like:
```
✔ Generated Prisma Client
🚀  Your database is now in sync with your Prisma schema.
```

### 5. Seed Database (Optional but Recommended)

Populate with demo data:
```bash
npm run db:seed
```

This creates:
- Demo account: `demo@example.com` / `demo123`
- Sample prizes
- Sample users
- Spin configuration

### 6. Start Backend Server

```bash
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:3001
📝 Environment: development
🌐 CORS enabled for: http://localhost:5173
```

**Test the server:** Open http://localhost:3001 in your browser. You should see a JSON response with API information.

---

## Part 3: Frontend Setup

### 1. Open New Terminal

Keep the backend server running, and open a **new terminal window**.

### 2. Navigate to Project Root
```bash
cd d:\PersonalProducts\SpinTheWheel
```

### 3. Install Frontend Dependencies (if not already done)
```bash
npm install
```

### 4. Start Frontend Development Server
```bash
npm run dev
```

You should see:
```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 5. Open Application

Open your browser and go to: **http://localhost:5173**

---

## Part 4: Testing the Application

### Test 1: Sign Up
1. Click "Sign Up" or "Get Started"
2. Fill in:
   - Business Name: `Test Restaurant`
   - Email: `test@example.com`
   - Password: `test123`
3. Click "Start Free Trial"
4. You should be redirected to the admin dashboard

### Test 2: Login
1. Logout (if logged in)
2. Go to Login page
3. Use demo credentials:
   - Email: `demo@example.com`
   - Password: `demo123`
4. Click "Log In"
5. You should see the admin dashboard

### Test 3: Manage Prizes
1. Go to "Prizes" in the sidebar
2. Click "Add Prize"
3. Create a new prize
4. Verify it appears in the list
5. Try editing and deleting prizes

### Test 4: Manage Users
1. Go to "Users" in the sidebar
2. Add a new user
3. Verify it appears in the list

### Test 5: Customize Spin Wheel
1. Go to "Settings"
2. Update business name, logo URL, or primary color
3. Save changes
4. Verify changes are reflected

### Test 6: Public Spin Wheel
1. In the admin dashboard, note your Tenant ID (shown in URL or settings)
2. Open: `http://localhost:5173/#/play/YOUR_TENANT_ID`
3. The spin wheel should display with your customizations
4. Try spinning the wheel

---

## Troubleshooting

### Backend Issues

**Error: "Can't connect to PostgreSQL"**
- Verify PostgreSQL is running (check Services on Windows)
- Check your `DATABASE_URL` in `.env`
- Verify database `spinthewheel` exists

**Error: "Prisma Client not found"**
```bash
cd server
npm run prisma:generate
```

**Port 3001 already in use**
- Change `PORT` in `server/.env` to another port (e.g., `3002`)
- Update `VITE_API_URL` in frontend if needed

### Frontend Issues

**Error: "Network Error" or "Failed to fetch"**
- Verify backend server is running on http://localhost:3001
- Check browser console for CORS errors
- Verify `VITE_API_URL` in frontend `.env.local` (if created)

**Login/Signup not working**
- Open browser DevTools (F12) → Network tab
- Check API requests to `/api/auth/login` or `/api/auth/signup`
- Look for error messages in the response

### Database Issues

**Want to reset database?**
```bash
cd server
npx prisma migrate reset
npm run db:seed
```

**View database contents:**
```bash
cd server
npm run prisma:studio
```
Opens GUI at http://localhost:5555

---

## Project Structure

```
SpinTheWheel/
├── server/                    # Backend
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── prisma.config.ts   # Prisma config
│   ├── src/
│   │   ├── routes/            # API endpoints
│   │   ├── middleware/        # Auth middleware
│   │   ├── utils/             # JWT, password utils
│   │   ├── db/                # Prisma client
│   │   ├── index.ts           # Express server
│   │   └── seed.ts            # Database seeding
│   ├── .env                   # Environment variables
│   └── package.json
│
├── src/                       # Frontend
│   ├── services/
│   │   └── api.ts             # API service layer
│   ├── contexts/
│   │   └── DataContext.tsx    # State management
│   ├── pages/                 # React pages
│   ├── components/            # React components
│   └── types.ts               # TypeScript types
│
├── package.json               # Frontend dependencies
└── README.md                  # This file
```

---

## API Endpoints

All endpoints are prefixed with `/api`

### Authentication
- `POST /api/auth/signup` - Register new tenant
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (requires auth)

### Prizes (all require auth)
- `GET /api/prizes` - List all prizes
- `POST /api/prizes` - Create prize
- `PUT /api/prizes/:id` - Update prize
- `DELETE /api/prizes/:id` - Delete prize

### Users (all require auth)
- `GET /api/users` - List all users
- `POST /api/users` - Create user
- `DELETE /api/users/:id` - Delete user

### Spin Wheel
- `GET /api/spin/config/:tenantId` - Get public config
- `PUT /api/spin/config` - Update config (requires auth)
- `POST /api/spin/record` - Record spin result
- `GET /api/spin/history` - Get history (requires auth)

### Subscription (all require auth)
- `GET /api/subscription` - Get subscription
- `POST /api/subscription/upgrade` - Upgrade plan
- `GET /api/subscription/invoices` - Get invoices

### Tenant (all require auth)
- `GET /api/tenant` - Get settings
- `PUT /api/tenant` - Update settings

---

## Next Steps

1. **Customize the application** to match your business needs
2. **Add more prizes** and configure the spin wheel
3. **Share the public spin URL** with your customers
4. **Monitor spin history** and user engagement in the admin dashboard

## Need Help?

- Check the browser console (F12) for errors
- Check the backend terminal for server errors
- Review the API documentation above
- Ensure both frontend and backend servers are running

---

## Production Deployment

For production deployment, you'll need to:
1. Deploy backend to a Node.js hosting service (Heroku, Railway, Render)
2. Deploy frontend to a static hosting service (Vercel, Netlify)
3. Use a production PostgreSQL database (Supabase, Railway, Heroku Postgres)
4. Update environment variables for production URLs
5. Change `JWT_SECRET` to a secure random string

Good luck with your Spin the Wheel application! 🎉
#   U p d a t e d  
 