# Vercel Deployment Guide

## Quick Setup

### 1. Create a Vercel Postgres Database

1. Go to your Vercel dashboard
2. Navigate to the **Storage** tab
3. Click **Create Database**
4. Select **Postgres**
5. Choose a name (e.g., `brandcat-db`) and region
6. Click **Create**

### 2. Connect Database to Your Project

1. In the Vercel Postgres dashboard, go to the **Settings** tab
2. Find your project in the list and click **Connect**
3. This automatically sets the `DATABASE_URL` environment variable

Alternatively, manually copy the connection string:
1. Go to the **`.env.local`** tab in your Postgres dashboard
2. Copy the `POSTGRES_PRISMA_URL` value
3. In your Vercel project settings, go to **Settings** → **Environment Variables**
4. Add a new variable:
   - **Name**: `DATABASE_URL`
   - **Value**: Paste the Postgres connection string
   - **Environment**: Select all (Production, Preview, Development)

### 3. Set NextAuth Secret

1. In Vercel project settings → **Environment Variables**
2. Add a new variable:
   - **Name**: `NEXTAUTH_SECRET`
   - **Value**: Generate a random string (you can use `openssl rand -base64 32`)
   - **Environment**: Select all

### 4. Redeploy

1. Go to **Deployments** tab
2. Click the **three dots** on the latest deployment
3. Select **Redeploy**
4. The build will now run database migrations automatically

## Environment Variables Summary

Your Vercel project needs these environment variables:

| Variable | Value | Required |
|----------|-------|----------|
| `DATABASE_URL` | PostgreSQL connection string from Vercel Postgres | ✅ Yes |
| `NEXTAUTH_SECRET` | Random secret string (32+ characters) | ⚠️  Has fallback, but recommended |
| `NEXTAUTH_URL` | Your deployment URL (e.g., `https://brandcat.vercel.app`) | ℹ️ Auto-detected by Vercel |

## Testing the Deployment

Once deployed:

1. Visit your Vercel deployment URL
2. You'll be redirected to the login page
3. Enter **any email and password** to create your account
4. The first user becomes a **Brand Owner**
5. Additional users become regular **Users**

## Troubleshooting

### "Invalid email or password" error

**Cause**: Database not connected or migrations not run

**Solution**:
1. Verify `DATABASE_URL` is set in Vercel environment variables
2. Check the **Build Logs** for any Prisma migration errors
3. Redeploy the application

### Build fails with Prisma errors

**Cause**: Database connection issues during build

**Solution**:
1. Make sure the database is in the same region as your Vercel deployment (or close by)
2. Check that the `DATABASE_URL` is accessible from Vercel's build environment
3. For Vercel Postgres, use the `POSTGRES_PRISMA_URL` connection string

### "Missing secret" error

**Cause**: `NEXTAUTH_SECRET` not set (though app has a fallback)

**Solution**: Add `NEXTAUTH_SECRET` environment variable in Vercel settings

## Database Migrations

Migrations run automatically during the build process via:
```bash
prisma migrate deploy
```

This is defined in the `build` script in `package.json`:
```json
"build": "prisma generate && prisma migrate deploy && next build"
```

## Alternative: External PostgreSQL Database

If you prefer to use an external PostgreSQL database (not Vercel Postgres):

1. Create a PostgreSQL database with your provider (Railway, Supabase, Neon, etc.)
2. Get the connection string
3. Add it as `DATABASE_URL` in Vercel environment variables
4. Make sure the database allows connections from Vercel's IP addresses
5. Redeploy

## Local Development

To run locally with your production database:

1. Install Vercel CLI: `npm i -g vercel`
2. Pull environment variables: `vercel env pull .env.local`
3. Run dev server: `npm run dev`

This creates a `.env.local` file with your production environment variables.
