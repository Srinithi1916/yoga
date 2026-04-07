# Deprecated EmailJS Notes

This project no longer uses EmailJS for contact form delivery.

Contact emails are now sent privately from the Spring Boot backend through SMTP, which keeps the real mail password and server credentials off the public frontend.

## Use this instead

Configure these backend environment variables on your Java host:

```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=your-email@gmail.com
CONTACT_RECEIVER_EMAIL=contact@example.com
MAIL_SMTP_AUTH=true
MAIL_SMTP_STARTTLS_ENABLE=true
MAIL_BRAND_NAME=Jeevanam 360
```

## Recommendation

For Gmail, use an app password instead of your normal account password.

## Frontend env now

```env
VITE_API_BASE_URL=https://yoga-2-i5oy.onrender.com/api
```
