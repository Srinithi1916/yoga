# Jeevanam 360

Premium wellness website built with a React + Vite frontend and a Spring Boot + MongoDB backend.

## Tech Stack

- React
- Vite
- Tailwind CSS
- Framer Motion
- Spring Boot
- Spring Security + JWT
- MongoDB Atlas
- Razorpay
- EmailJS

## Core Features

- Member signup and login stored in MongoDB
- JWT-protected contact flow
- Store-style reviews for yoga types, special programs, and pricing plans
- Only logged-in members can contact the team or post reviews
- Review details stored in MongoDB
- Contact enquiries stored in MongoDB
- Razorpay checkout for fixed-price plans

## Local Run

Frontend:

```powershell
npm install
npm run dev
```

Backend:

```powershell
npm run backend:dev
```

## Build

```powershell
npm run build
npm run backend:build
```

## Deployment

### Frontend on Netlify

- Connect this GitHub repo to Netlify.
- Build command: `npm run build`
- Publish directory: `dist`
- Production frontend: `https://jeevanam360a.netlify.app/`
- Netlify builds now use `https://yoga-2-i5oy.onrender.com/api` automatically from `netlify.toml`
- If your backend URL changes later, update `VITE_API_BASE_URL`

### Backend hosting

The current Spring Boot backend cannot run on Netlify as a long-running server.
Use a backend host such as Render or Railway with the `backend/Dockerfile` included in this repo.

Required backend environment variables:

- `MONGODB_URI`
- `CORS_ALLOWED_ORIGINS`
  Example: `http://localhost:5173,https://*.netlify.app,https://jeevanam360a.netlify.app`
- `JWT_SECRET`
- `JWT_EXPIRATION_HOURS`
- `MAIL_FROM`
- `CONTACT_RECEIVER_EMAIL`
- `APP_ADMIN_EMAILS`
- `APP_ADMIN_BOOTSTRAP_PASSWORD`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

Frontend contact email uses public EmailJS browser keys, so those frontend env vars must also be present on Netlify:

- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`

## Live URLs

- Frontend: `https://jeevanam360a.netlify.app/`
- Backend: `https://yoga-2-i5oy.onrender.com`
