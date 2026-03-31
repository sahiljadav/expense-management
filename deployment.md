# Deployment Guide (Render)

This guide provides step-by-step instructions for deploying your Expense Manager System to [Render](https://render.com/).

## 1. Prerequisites
- Create a [Render account](https://dashboard.render.com/).
- Push your project to a GitHub repository.

## 2. Deploy the Database (PostgreSQL)
1. In Render Dashboard, click **New** -> **PostgreSQL**.
2. Name it `expense-manager-db`.
3. Copy the **Internal Database URL** (e.g., `postgres://user:password@hostname:port/db`).

## 3. Deploy the Backend (Web Service)
1. Click **New** -> **Web Service**.
2. Select your GitHub repository.
3. Configure:
   - **Name**: `expense-manager-api`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add Environment Variables:
   - `DATABASE_URL`: (The URL from step 2)
   - `PORT`: `5000`
   - `JWT_SECRET`: (Your secret key)
   - `FRONTEND_URL`: (The URL of your frontend, once created)

## 4. Run Database Migrations
Since you are using Prisma, you need to sync the database schema:
1. In the Backend Web Service on Render, go to the **Shell** tab.
2. Run: `npx prisma migrate deploy`
3. (Optional) Run seed: `npm run seed`

## 5. Deploy the Frontend (Static Site)
1. Click **New** -> **Static Site**.
2. Select your GitHub repository.
3. Configure:
   - **Name**: `expense-manager-web`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. Add Environment Variables:
   - `VITE_API_BASE_URL`: `https://your-api-url.onrender.com/api`

---
**Note**: Once the frontend is live, make sure to update the `FRONTEND_URL` in your Backend environment variables to match the frontend's address.
