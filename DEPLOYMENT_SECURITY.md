# Deployment and Secret Safety

## Before you push to GitHub

Do not commit these files:

- `.env`
- `backend/.env`
- `dist/`
- `backend/target/`
- any `.pem`, `.key`, `.p12`, `.jks`, or keystore files

This project now ignores those files through `.gitignore`.

## What should stay private

Keep these only in hosting dashboards or local env files:

- `MONGODB_URI`
- `MAIL_PASSWORD`
- `RAZORPAY_KEY_SECRET`
- any database password
- any SMTP password or secret mail credential

## What is client-visible in a frontend app

These values are not true secrets when used in the browser:

- `VITE_API_BASE_URL`
- Razorpay `key id`

Razorpay `key id` is safe for frontend checkout, but the secret must always stay on the backend.
Email sending is now handled privately by the Spring Boot backend, so the frontend no longer needs EmailJS keys.

## Netlify publish setup

Use Netlify only for the React frontend.
The Spring Boot backend must be deployed separately on a Java-capable host such as Render, Railway, or your own server.

### Netlify environment variables

Set this in Netlify Site Settings -> Environment Variables:

- `VITE_API_BASE_URL=https://your-backend-domain.com/api`

## Backend host environment variables

Set these in your backend hosting dashboard:

- `MONGODB_URI=your_mongodb_connection_string`
- `CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com`
- `SERVER_PORT=8080`
- `MAIL_HOST=smtp.gmail.com`
- `MAIL_PORT=587`
- `MAIL_USERNAME=your-email@gmail.com`
- `MAIL_PASSWORD=your-app-password`
- `MAIL_FROM=your-email@gmail.com`
- `CONTACT_RECEIVER_EMAIL=srinithisrinithi09@gmail.com`
- `MAIL_SMTP_AUTH=true`
- `MAIL_SMTP_STARTTLS_ENABLE=true`
- `MAIL_BRAND_NAME=Jeevanam 360`
- `RAZORPAY_KEY_ID=your_razorpay_key_id`
- `RAZORPAY_KEY_SECRET=your_razorpay_secret`

## Custom .com domain

### On Netlify

1. Deploy the frontend repo.
2. Open Site configuration -> Domain management.
3. Add your custom `.com` domain.
4. Update your DNS records at the domain registrar using the Netlify instructions.
5. Enable HTTPS after DNS is connected.

### For the backend

Point your backend host to its own subdomain, for example:

- frontend: `https://jeevanam360.com`
- backend: `https://api.jeevanam360.com`

Then set `VITE_API_BASE_URL=https://api.jeevanam360.com/api` in Netlify.