# ArchFlow

ArchFlow is a real-time collaborative system architecture design tool with a "blueprint" theme, built on the MERN stack with Socket.io, React Flow, Next.js, and Anthropic Claude.

## Features Built
- **Authentication**: JWT-based auth via Next.js Context & Express.
- **Project Dashboard**: View, search, and manage diagram projects.
- **Interactive Canvas**: React Flow integration with 10 custom nodes and "Blueprint" styling.
- **Drag & Drop Sidebar**: Easy to use component library.
- **Real-Time Collaboration**: Live cursors, node movements, additions, and deletions using `Socket.io`.
- **Comments & Export**: Drop comments on specific nodes and export to PNG/PDF/JSON.
- **AI Generation**: Tell Claude about an architecture and instantly spawn a complete diagram on the canvas.

## Getting Started Locally

1. **Install dependencies** in the root:
   ```bash
   npm install
   ```

2. **Configure Environment Variables** in `backend/.env`:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_atlas_uri
   JWT_SECRET=super_secret_jwt_key
   FRONTEND_URL=http://localhost:3000
   ANTHROPIC_API_KEY=your_claude_api_key
   ```

3. **Start the Development Servers** (runs both frontend and backend concurrently):
   ```bash
   npm run dev
   ```

## Deployment Guide

### Database (MongoDB Atlas)
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Allow access from any IP (`0.0.0.0/0`) or specific Render IPs.
3. Copy the Connection String and add it as `MONGO_URI` to your backend.

### Backend (Render)
1. Push this repo to GitHub.
2. Go to [Render](https://render.com) -> New Web Service.
3. Connect your GitHub repo.
4. **Root Directory**: `backend`
5. **Build Command**: `npm install && npm run build`
6. **Start Command**: `npm start`
7. Add Environment Variables (`MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL` pointing to your Vercel URL, `ANTHROPIC_API_KEY`).

### Frontend (Vercel)
1. Go to [Vercel](https://vercel.com) -> New Project.
2. Import the GitHub repo.
3. **Framework Preset**: Next.js
4. **Root Directory**: `frontend`
5. *Important*: Vercel will automatically run `npm install` and `npm run build`.
6. Make sure to update your frontend to point to the deployed Render backend URL instead of `http://localhost:5000` (e.g., via `NEXT_PUBLIC_API_URL`).
