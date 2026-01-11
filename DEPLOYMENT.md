# Deployment Guide

This guide explains how to deploy the Loder application to Render (backend + database) and Vercel (frontend).

## Prerequisites

- GitHub account with your code pushed to a repository
- Render account (https://render.com)
- Vercel account (https://vercel.com)

## Part 1: Deploy Database and Backend to Render

### Step 1: Create PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `loder-db`
   - **Database**: `loder`
   - **User**: `loder` (or keep default)
   - **Region**: Choose closest to your users
   - **Plan**: Free (or paid for production)
4. Click **"Create Database"**
5. **Important**: Save the connection details shown:
   - Internal Database URL= postgresql://loder:w7DCz7kfRgrm5VICmA4U87EwBP39tVTl@dpg-d5dpi55actks73catijg-a/loder
   - External Database URL= postgresql://loder:w7DCz7kfRgrm5VICmA4U87EwBP39tVTl@dpg-d5dpi55actks73catijg-a.frankfurt-postgres.render.com/loder
   - Host, Port=5432, Database=loder, User=loder, Password=w7DCz7kfRgrm5VICmA4U87EwBP39tVTl

### Step 2: Deploy Backend Service

1. In Render Dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `loder-backend`
   - **Environment**: `Node`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=10000
   DB_USER=loder
   DB_HOST=dpg-d5dtcddactks73cddipg-a
   DB_NAME=loder-db
   DB_PASSWORD=fYm0xgADYMv6C0noY1RKp7mPJsRq1qXD
   DB_PORT=5432
   FRONTEND_URL=https://www.loderapp.com
   ```
   > **Note**: You'll update `FRONTEND_URL` after deploying to Vercel

5. Click **"Create Web Service"**
6. Wait for deployment to complete
7. Note your backend URL (e.g., `https://loder-backend.onrender.com`)

### Step 3: Initialize Database Schema

1. In Render Dashboard, go to your backend service
2. Click on **"Shell"** tab
3. Run the initialization script:
   ```bash
   node init-db.js
   ```
4. Verify success - you should see "Database initialized successfully!"

Alternatively, you can use the Render database's built-in SQL editor or connect via psql.

## Part 2: Deploy Frontend to Vercel

### Step 1: Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`
5. Add Environment Variable:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   ```
   > Replace `your-backend-url` with your actual Render backend URL

6. Click **"Deploy"**
7. Wait for deployment to complete
8. Note your frontend URL (e.g., `https://loder.vercel.app`)

### Step 2: Update Backend CORS

1. Go back to Render Dashboard
2. Edit your backend service
3. Update the `FRONTEND_URL` environment variable:
   ```
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
4. Save and redeploy

## Part 3: Post-Deployment Verification

### Test Backend

1. Health Check:
   ```
   https://your-backend.onrender.com/api/health
   ```
   Should return: `{"status":"ok","message":"Loder API is running"}`

2. Test Categories:
   ```
   https://your-backend.onrender.com/api/categories
   ```
   Should return array of categories

### Test Frontend

1. Visit your Vercel URL
2. Check browser console for any API errors
3. Test navigation and API calls
4. Verify categories load on homepage

## Environment Variables Summary

### Render (Backend)
- `NODE_ENV=production`
- `PORT=10000`
- `DB_USER` (from database)
- `DB_HOST` (from database)
- `DB_NAME=loder`
- `DB_PASSWORD` (from database)
- `DB_PORT=5432`
- `FRONTEND_URL` (your Vercel URL)

### Vercel (Frontend)
- `REACT_APP_API_URL` (your Render backend URL + `/api`)

## Troubleshooting

### Backend Issues

1. **Database Connection Errors**:
   - Verify all DB environment variables are correct
   - Check if database is running in Render dashboard
   - Ensure SSL is enabled for production connections

2. **CORS Errors**:
   - Verify `FRONTEND_URL` matches your Vercel URL exactly
   - Check backend logs in Render dashboard

3. **Service Not Starting**:
   - Check build logs in Render
   - Verify `package.json` has correct start script
   - Check Node version compatibility

### Frontend Issues

1. **API Connection Errors**:
   - Verify `REACT_APP_API_URL` is set correctly
   - Check browser console for CORS errors
   - Ensure backend is running (Render free tier spins down after inactivity)

2. **Build Failures**:
   - Check build logs in Vercel
   - Verify all dependencies are in `package.json`
   - Check for TypeScript/ESLint errors

### Render Free Tier Limitations

- Services spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Consider upgrading to paid plan for production

## Updating Deployments

### Backend Updates
- Push changes to GitHub
- Render will automatically redeploy
- Or manually trigger redeploy from Render dashboard

### Frontend Updates
- Push changes to GitHub
- Vercel will automatically redeploy
- Or manually trigger redeploy from Vercel dashboard

## Security Notes

1. Never commit `.env` files
2. Keep all sensitive data in platform environment variables
3. Use HTTPS URLs only (both platforms provide this)
4. Regularly update dependencies for security patches

## Support

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Project Issues: Check GitHub issues
