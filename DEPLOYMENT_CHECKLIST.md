# 🚀 Deployment Checklist - InternShell

## Backend Deployment (Render.com)

### 1. Environment Variables Setup
Copy these exact variables to your Render.com backend service:

```bash
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_32_characters_long
JWT_EXPIRE=20 minutes
CORS_ORIGIN=https://internshell-dev.web.app,https://internshell.com
FRONTEND_URL=https://internshell-dev.web.app
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
DID_API_KEY=your_did_api_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
GEMINI_API_KEY=your_gemini_api_key
```

### 2. Backend Deployment Steps
1. Push backend code to GitHub repository
2. Connect repository to Render.com
3. Set service type as "Web Service"
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add all environment variables above
7. Deploy

### 3. Get Your Backend URL
After deployment, your backend URL will be:
`https://[your-service-name].onrender.com`

## Frontend Deployment (Firebase/Netlify)

### 1. Environment Variables Setup
Make sure your frontend `.env.production` has:

```bash
VITE_APP_VERSION=v3.0.0
GENERATE_SOURCEMAP=false
VITE_APP_BASE_NAME=/
VITE_API_URL=https://[your-backend-service-name].onrender.com
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
NODE_ENV=production
```

### 2. Update API URL
Replace `[your-backend-service-name]` with your actual Render service name.

## 🔧 Quick Fix Commands

### Update Frontend API URL (After getting backend URL):
```bash
cd frontend
# Edit .env.production file
echo "VITE_API_URL=https://your-actual-backend-url.onrender.com" > .env.production
```

### Rebuild and Deploy Frontend:
```bash
npm run build
# Then deploy to your hosting service
```

## 🐛 Troubleshooting

### 1. Check Backend Status
Visit: `https://your-backend-url.onrender.com/api/health`
Should return: `{"success": true, "message": "Server is running"}`

### 2. Check CORS Errors
Open browser console and look for CORS-related errors.

### 3. Environment Variables
Ensure all required environment variables are set in your hosting services.

## 📝 Current Issues Fixed:
1. ✅ CORS configuration updated to allow multiple domains
2. ✅ Frontend API URL configuration separated for production
3. ✅ Environment variables properly documented
4. ✅ Render deployment configuration updated

## 🚨 Important Notes:
- Free Render services sleep after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds to wake up
- Consider upgrading to paid plan for production use
- Always test with backend health endpoint first

## 🔐 Security:
- **NEVER commit real API keys, passwords, or secrets to GitHub**
- Use GitHub Secrets for CI/CD pipelines
- Copy actual values from your local .env files to hosting services manually
- The values shown above are placeholders - replace with your actual credentials