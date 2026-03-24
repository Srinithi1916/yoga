# Jeevanam 360

Premium wellness website built with a React + Vite frontend and a Spring Boot + MongoDB backend.

## Tech Stack

- React
- Vite
- Tailwind CSS
- Framer Motion
- Spring Boot
- MongoDB Atlas
- Razorpay
- Gmail SMTP

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
- Set `VITE_API_BASE_URL` to your deployed backend URL plus `/api`
  Example: `https://your-backend.onrender.com/api`

### Backend hosting

The current Spring Boot backend cannot run on Netlify as a long-running server.
Use a backend host such as Render or Railway with the `backend/Dockerfile` included in this repo.

Required backend environment variables:

- `MONGODB_URI`
- `CORS_ALLOWED_ORIGINS`
- `MAIL_HOST`
- `MAIL_PORT`
- `MAIL_USERNAME`
- `MAIL_PASSWORD`
- `MAIL_FROM`
- `CONTACT_RECEIVER_EMAIL`
- `MAIL_SMTP_AUTH`
- `MAIL_SMTP_STARTTLS_ENABLE`
- `MAIL_BRAND_NAME`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
