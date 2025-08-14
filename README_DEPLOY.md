# Deployment Guide for Scribbly (Fullstack)

## 1. Backend Deployment (Recommended: Render or Railway)

- Push your backend code to GitHub (in the `backend` folder).
- Create a new web service on [Render](https://render.com) or [Railway](https://railway.app).
- Set the build/start command to `npm install && npm start`.
- Add environment variables from `backend/.env.example` (set your real MongoDB URI).
- Note your deployed backend URL (e.g., `https://scribbly-backend.onrender.com`).

## 2. Frontend Deployment (Vercel)

- Push your frontend code to GitHub (in the `frontend/my-app` folder).
- Go to [Vercel](https://vercel.com) and import your repo.
- Set the root directory to `frontend/my-app`.
- Set the build command to `npm run build` and output directory to `dist`.
- Add environment variable `VITE_API_URL` with your backend URL.
- (Optional) Use the provided `vercel.json` for API rewrites.

## 3. Environment Variables

- Copy `.env.example` to `.env` in both frontend and backend folders and fill in real values.
- Add these in the Vercel/Render/Railway dashboard as well.

## 4. API Usage in Frontend

- Use `import.meta.env.VITE_API_URL` for all API calls in your React code.

## 5. Test

- After deployment, test your Vercel frontend URL. All features should work and connect to your backend.

---

**Need help?**
- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [Railway Docs](https://docs.railway.app/)
