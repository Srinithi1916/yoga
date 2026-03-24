# Jeevanam 360 Backend

Spring Boot + MongoDB backend for the Jeevanam 360 website.

## What it handles

- `POST /api/contact-messages` to save contact enquiries and send a private backend email notification
- `POST /api/payment-requests` to save plan/payment intent requests
- `POST /api/payments/razorpay/order` to create a Razorpay order for fixed-price plans
- `POST /api/payments/razorpay/verify` to verify the Razorpay payment signature
- `GET /api/health` to verify the backend is running

## Environment / configuration

Set these values before running:

```powershell
$env:MONGODB_URI="mongodb://localhost:27017/jeevanam360"
$env:CORS_ALLOWED_ORIGINS="http://localhost:5173,https://*.netlify.app,https://your-domain.example,https://www.your-domain.example"
$env:SERVER_PORT="8080"

$env:MAIL_HOST="smtp.gmail.com"
$env:MAIL_PORT="587"
$env:MAIL_USERNAME="your-email@gmail.com"
$env:MAIL_PASSWORD="your-app-password"
$env:MAIL_FROM="your-email@gmail.com"
$env:CONTACT_RECEIVER_EMAIL="srinithisrinithi09@gmail.com"
$env:MAIL_SMTP_AUTH="true"
$env:MAIL_SMTP_STARTTLS_ENABLE="true"
$env:MAIL_BRAND_NAME="Jeevanam 360"

$env:RAZORPAY_KEY_ID="rzp_test_xxxxx"
$env:RAZORPAY_KEY_SECRET="your_secret_here"
```

## Run locally

```powershell
cd backend
mvn spring-boot:run
```

## Package

```powershell
cd backend
mvn -DskipTests package
```

## Docker deploy

This repo includes `backend/Dockerfile` for cloud deployment.
The app now supports host-provided `PORT` automatically.

Example local Docker build:

```powershell
cd backend
docker build -t jeevanam360-backend .
```

Example local Docker run:

```powershell
docker run -p 8080:8080 --env-file .env jeevanam360-backend
```

## Recommended production setup

- Frontend: Netlify
- Backend: Render or Railway
- Database: MongoDB Atlas

For Render:

- Root directory: `backend`
- Build method: `Docker`
- Add all backend environment variables in the dashboard
- Set `CORS_ALLOWED_ORIGINS` to something like:
  `http://localhost:5173,https://*.netlify.app,https://your-domain.example,https://www.your-domain.example`

## Notes

- Contact data and payment request data are stored in MongoDB.
- Contact email is sent privately from the backend through SMTP.
- Fixed-price plans in the frontend use Razorpay checkout.
- WhatsApp still opens from the frontend after contact form submission.
- For Gmail SMTP, use an app password instead of your normal account password.
