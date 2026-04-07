# Jeevanam 360 Backend

Spring Boot + MongoDB backend for the Jeevanam 360 website.

## What it handles

- `POST /api/auth/signup` to create a member account in MongoDB
- `POST /api/auth/login` to log in and receive a JWT token
- `GET /api/auth/me` to read the signed-in member profile
- `POST /api/contact-messages` to save member contact enquiries in MongoDB
- `POST /api/payment-requests` to save plan/payment intent requests
- `GET /api/reviews/summaries` to load public review summaries
- `GET /api/reviews/items/{itemId}` to load reviews for a yoga type, program, or plan
- `POST /api/reviews/items/{itemId}` for logged-in members to create or update their review
- `DELETE /api/reviews/items/{itemId}/mine` for logged-in members to delete their review
- `POST /api/payments/razorpay/order` to create a Razorpay order for fixed-price plans
- `POST /api/payments/razorpay/verify` to verify the Razorpay payment signature
- `GET /api/health` to verify the backend is running

## Environment / configuration

Set these values before running:

```powershell
$env:MONGODB_URI="mongodb://localhost:27017/jeevanam360"
$env:CORS_ALLOWED_ORIGINS="http://localhost:5173,https://*.netlify.app,https://jeevanam360a.netlify.app"
$env:SERVER_PORT="8080"
$env:JWT_SECRET="change-this-jwt-secret-for-production"
$env:JWT_EXPIRATION_HOURS="72"
$env:MAIL_FROM="contact@example.com"
$env:CONTACT_RECEIVER_EMAIL="contact@example.com"
$env:APP_ADMIN_EMAILS="admin@example.com"
$env:APP_ADMIN_BOOTSTRAP_PASSWORD="change-admin-password"

$env:RAZORPAY_KEY_ID="rzp_test_xxxxx"
$env:RAZORPAY_KEY_SECRET="your_secret_here"
```

Note:

- Contact enquiries are saved in MongoDB and backend mail can also notify your inbox when SMTP is configured.
- Keep SMTP credentials, contact recipient, and admin bootstrap values in environment variables, not in git.


If your local machine has trouble with `mongodb+srv` DNS lookups, use the direct Atlas host format instead of the SRV URI. Example:

```powershell
$env:MONGODB_URI="mongodb://USERNAME:PASSWORD@ac-xxxxx-shard-00-00.example.mongodb.net:27017,ac-xxxxx-shard-00-01.example.mongodb.net:27017,ac-xxxxx-shard-00-02.example.mongodb.net:27017/jeevanam360?ssl=true&authSource=admin&replicaSet=atlas-xxxxxx-shard-0&retryWrites=true&w=majority&appName=Cluster0"
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
  `http://localhost:5173,https://*.netlify.app,https://jeevanam360a.netlify.app`

## Live URL

- Current production backend: `https://yoga-2-i5oy.onrender.com`

## Notes

- User accounts, contact data, payment request data, and review data are stored in MongoDB.
- Only logged-in members can contact the team or submit reviews.
- Fixed-price plans in the frontend use Razorpay checkout.
- WhatsApp still opens from the frontend after contact form submission.

