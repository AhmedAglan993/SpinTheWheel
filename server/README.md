# Spin the Wheel - Backend Server

Backend API server for the Spin the Wheel application built with Node.js, Express, Prisma, and PostgreSQL.

## Prerequisites

- Node.js v18+ installed
- PostgreSQL installed and running

## PostgreSQL Setup

### Windows Installation

1. **Download PostgreSQL**: Visit https://www.postgresql.org/download/windows/
2. **Install**: Run the installer and follow the wizard
   - Remember the password you set for the `postgres` user
   - Default port is `5432`
3. **Verify Installation**: Open Command Prompt and run:
   ```bash
   psql --version
   ```

### Create Database

1. Open **pgAdmin** (installed with PostgreSQL) or use command line
2. Create a new database named `spinthewheel`

**Using pgAdmin:**
- Right-click on "Databases" → Create → Database
- Name: `spinthewheel`
- Click Save

**Using Command Line:**
```bash
psql -U postgres
CREATE DATABASE spinthewheel;
\q
```

## Environment Setup

1. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

2. Update `.env` with your PostgreSQL credentials:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/spinthewheel?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL="http://localhost:5173"
   ```

   Replace `YOUR_PASSWORD` with the password you set during PostgreSQL installation.

## Installation

```bash
npm install
```

## Database Migration

Run Prisma migrations to create database tables:

```bash
npm run db:push
```

This will create all tables defined in `prisma/schema.prisma`.

## Seed Database (Optional)

Populate the database with demo data:

```bash
npm run db:seed
```

This creates:
- Demo tenant account (email: `demo@example.com`, password: `demo123`)
- Sample prizes
- Sample users
- Spin configuration

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new tenant
- `POST /api/auth/login` - Login tenant
- `GET /api/auth/me` - Get current tenant info (requires auth)

### Prizes
- `GET /api/prizes` - Get all prizes (requires auth)
- `POST /api/prizes` - Create prize (requires auth)
- `PUT /api/prizes/:id` - Update prize (requires auth)
- `DELETE /api/prizes/:id` - Delete prize (requires auth)

### Users
- `GET /api/users` - Get all users (requires auth)
- `POST /api/users` - Create user (requires auth)
- `DELETE /api/users/:id` - Delete user (requires auth)

### Spin Wheel
- `GET /api/spin/config/:tenantId` - Get public spin configuration
- `PUT /api/spin/config` - Update spin configuration (requires auth)
- `POST /api/spin/record` - Record a spin result
- `GET /api/spin/history` - Get spin history (requires auth)

### Subscription
- `GET /api/subscription` - Get subscription details (requires auth)
- `POST /api/subscription/upgrade` - Upgrade plan (requires auth)
- `GET /api/subscription/invoices` - Get invoices (requires auth)

### Tenant
- `GET /api/tenant` - Get tenant settings (requires auth)
- `PUT /api/tenant` - Update tenant settings (requires auth)

## Prisma Studio

View and edit your database with Prisma's GUI:

```bash
npm run prisma:studio
```

Opens at `http://localhost:5555`

## Troubleshooting

### Can't connect to PostgreSQL

1. Verify PostgreSQL is running:
   - Open Services (Windows + R, type `services.msc`)
   - Look for "postgresql-x64-XX" service
   - Ensure it's running

2. Check your DATABASE_URL in `.env`
3. Verify database exists: `psql -U postgres -l`

### Prisma errors

- Regenerate Prisma Client: `npm run prisma:generate`
- Reset database: `npx prisma migrate reset`

## Project Structure

```
server/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── prisma.config.ts       # Prisma configuration
├── src/
│   ├── db/
│   │   └── prisma.ts          # Prisma client instance
│   ├── middleware/
│   │   └── auth.ts            # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.ts            # Authentication routes
│   │   ├── prizes.ts          # Prize management routes
│   │   ├── users.ts           # User management routes
│   │   ├── spin.ts            # Spin wheel routes
│   │   ├── subscription.ts    # Subscription routes
│   │   └── tenant.ts          # Tenant settings routes
│   ├── utils/
│   │   ├── jwt.ts             # JWT utilities
│   │   └── password.ts        # Password hashing utilities
│   ├── index.ts               # Main server file
│   └── seed.ts                # Database seeding script
├── .env                       # Environment variables (not in git)
├── .env.example               # Environment template
├── package.json
└── tsconfig.json
```
