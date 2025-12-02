# Deployment Guide - Spin the Wheel

This guide covers deploying your Spin the Wheel application to production. We'll deploy the frontend and backend separately.

## Deployment Architecture

```
Frontend (React/Vite) → Static Hosting (Vercel/Netlify)
Backend (Node.js/Express) → Platform as a Service (Railway/Render/Heroku)
Database (PostgreSQL) → Managed Database (Railway/Supabase/Neon)
```

---

## Option 1: Railway (Recommended - Easiest)

Railway provides everything in one place: backend hosting + PostgreSQL database.

### Step 1: Prepare Backend for Deployment

1. **Add start script** to `server/package.json` (already done):
```json
"scripts": {
  "start": "node dist/index.js",
  "build": "tsc"
}
```

2. **Create `server/.gitignore`** (already done):
```
node_modules
dist
.env
```

3. **Ensure Prisma config** is correct in `server/prisma/prisma.config.ts`

### Step 2: Deploy Backend to Railway

1. **Sign up** at https://railway.app (free tier available)

2. **Create New Project** → "Deploy from GitHub repo"
   - Connect your GitHub account
   - Select your repository
   - Railway will auto-detect it's a Node.js app

3. **Add PostgreSQL Database**
   - In your project, click "New" → "Database" → "Add PostgreSQL"
   - Railway automatically creates a database and sets `DATABASE_URL`

4. **Configure Environment Variables**
   - Go to your service → "Variables" tab
   - Add these variables:
   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secret-production-key-change-this
   PORT=3001
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```
   - `DATABASE_URL` is automatically set by Railway

5. **Set Root Directory** (Important!)
   - Go to "Settings" tab
   - Set "Root Directory" to `server`
   - Set "Build Command" to `npm install && npm run build && npx prisma generate`
   - Set "Start Command" to `npm start`

6. **Deploy**
   - Railway will automatically deploy
   - After deployment, run database migration:
     - Go to your service
     - Click "..." → "Run Command"
     - Run: `npx prisma db push`
     - Then run: `npm run db:seed` (to add demo data)

7. **Get Backend URL**
   - Railway provides a URL like: `https://your-app.up.railway.app`
   - Copy this URL for frontend configuration

### Step 3: Deploy Frontend to Vercel

1. **Update Frontend Environment**
   - Create `d:\PersonalProducts\SpinTheWheel\.env.production`:
   ```env
   VITE_API_URL=https://your-app.up.railway.app/api
   ```

2. **Sign up** at https://vercel.com (free tier available)

3. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Vercel auto-detects Vite

4. **Configure Build Settings**
   - Framework Preset: Vite
   - Root Directory: `./` (leave as root)
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Add Environment Variables**
   - In project settings → "Environment Variables"
   - Add: `VITE_API_URL` = `https://your-app.up.railway.app/api`

6. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your frontend
   - You'll get a URL like: `https://your-app.vercel.app`

7. **Update Backend CORS**
   - Go back to Railway
   - Update `FRONTEND_URL` variable to your Vercel URL
   - Redeploy backend

---

## Option 2: Render (Alternative)

Render offers free tier for both backend and PostgreSQL.

### Backend on Render

1. **Sign up** at https://render.com

2. **Create PostgreSQL Database**
   - Dashboard → "New" → "PostgreSQL"
   - Name: `spinthewheel-db`
   - Free tier is fine
   - Copy the "Internal Database URL"

3. **Create Web Service**
   - Dashboard → "New" → "Web Service"
   - Connect GitHub repository
   - Settings:
     - Name: `spinthewheel-api`
     - Root Directory: `server`
     - Environment: `Node`
     - Build Command: `npm install && npm run build && npx prisma generate`
     - Start Command: `npm start`

4. **Environment Variables**
   ```
   DATABASE_URL=<your-postgres-internal-url>
   NODE_ENV=production
   JWT_SECRET=your-secret-key
   FRONTEND_URL=https://your-app.vercel.app
   ```

5. **After First Deploy**
   - Go to "Shell" tab
   - Run: `npx prisma db push`
   - Run: `npm run db:seed`

### Frontend on Vercel
Same as Option 1, Step 3 above.

---

## Option 3: Heroku (Traditional)

### Backend on Heroku

1. **Install Heroku CLI**
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login and Create App**
   ```bash
   heroku login
   cd server
   heroku create your-app-name
   ```

3. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:essential-0
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-secret-key
   heroku config:set FRONTEND_URL=https://your-app.vercel.app
   ```

5. **Create Procfile** in `server/Procfile`:
   ```
   web: npm start
   release: npx prisma db push && npm run db:seed
   ```

6. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

---

## Option 4: Supabase Database (Managed PostgreSQL)

If you want to use Supabase for just the database:

1. **Sign up** at https://supabase.com

2. **Create Project**
   - Create new project
   - Set database password
   - Wait for setup to complete

3. **Get Connection String**
   - Go to Project Settings → Database
   - Copy "Connection string" (URI format)
   - Replace `[YOUR-PASSWORD]` with your password

4. **Use in Railway/Render**
   - Set `DATABASE_URL` to Supabase connection string
   - Format: `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`

---

## Post-Deployment Checklist

### ✅ Backend Verification

1. **Test Health Endpoint**
   ```bash
   curl https://your-backend-url.com/health
   ```
   Should return: `{"status":"ok"}`

2. **Test API Root**
   ```bash
   curl https://your-backend-url.com/
   ```
   Should return API information

3. **Test Login**
   ```bash
   curl -X POST https://your-backend-url.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"demo@example.com","password":"demo123"}'
   ```
   Should return token and tenant info

### ✅ Frontend Verification

1. Open your Vercel URL
2. Try signing up with a new account
3. Try logging in with demo account
4. Test creating/editing prizes
5. Test the public spin wheel URL

### ✅ Database Verification

1. **Check tables exist**
   - Railway: Use built-in database viewer
   - Render: Connect via provided connection string
   - Supabase: Use Table Editor

2. **Verify demo data**
   - Should see demo tenant
   - Should see sample prizes
   - Should see sample users

---

## Environment Variables Summary

### Backend (.env in production)
```env
DATABASE_URL=<provided-by-hosting-service>
NODE_ENV=production
JWT_SECRET=<strong-random-string>
PORT=3001
FRONTEND_URL=<your-vercel-url>
```

### Frontend (.env.production)
```env
VITE_API_URL=<your-backend-url>/api
```

---

## Troubleshooting

### Backend won't start
- Check logs in Railway/Render dashboard
- Verify all environment variables are set
- Ensure `DATABASE_URL` is correct
- Check if Prisma client was generated during build

### Database connection errors
- Verify `DATABASE_URL` format is correct
- Check if database is running
- Ensure IP whitelist allows connections (if applicable)
- Try running `npx prisma db push` manually

### CORS errors
- Verify `FRONTEND_URL` in backend matches your actual frontend URL
- Check browser console for exact error
- Ensure no trailing slashes in URLs

### Frontend can't reach backend
- Check `VITE_API_URL` is set correctly
- Verify backend is running (test health endpoint)
- Check browser Network tab for failed requests
- Ensure backend URL includes `/api` path

---

## Cost Breakdown (Free Tiers)

| Service | Free Tier | Limits |
|---------|-----------|--------|
| **Railway** | $5 credit/month | ~500 hours runtime |
| **Render** | Free | 750 hours/month, sleeps after 15min inactive |
| **Vercel** | Free | Unlimited bandwidth for personal projects |
| **Supabase** | Free | 500MB database, 2GB bandwidth |
| **Heroku** | Free tier removed | Now paid only |

**Recommended for Free:** Railway (backend + DB) + Vercel (frontend)

---

## Scaling Considerations

When your app grows:

1. **Upgrade Database**
   - Move to paid tier for more storage/connections
   - Consider connection pooling (PgBouncer)

2. **Add Caching**
   - Redis for session storage
   - Cache frequently accessed data

3. **CDN for Assets**
   - Vercel includes CDN
   - Consider Cloudflare for additional caching

4. **Monitoring**
   - Add error tracking (Sentry)
   - Add analytics (PostHog, Plausible)
   - Monitor database performance

---

## Quick Start (Railway + Vercel)

**5-Minute Deployment:**

1. Push code to GitHub
2. Railway: New Project → Import Repo → Add PostgreSQL → Deploy
3. Railway: Run `npx prisma db push` and `npm run db:seed` in shell
4. Vercel: Import Project → Add `VITE_API_URL` env var → Deploy
5. Railway: Update `FRONTEND_URL` to Vercel URL → Redeploy

Done! Your app is live. 🚀

---

## Need Help?

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Prisma Deployment**: https://www.prisma.io/docs/guides/deployment

Good luck with your deployment! 🎉
