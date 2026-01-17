# RENDER DEPLOYMENT ENVIRONMENT VARIABLES
# Copy these exact key-value pairs to Render.com Environment Variables

NODE_ENV=production
PORT=10000

# Database (Required) - MongoDB Atlas
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/internshell

# JWT (Required) - Generate using: openssl rand -base64 32
JWT_SECRET=generate_a_strong_32_character_secret_key
JWT_EXPIRE=30d

# CORS (Required) - Your frontend URLs (comma-separated)
CORS_ORIGIN=https://internshell-dev.web.app,https://internshell.com

# Frontend URL (for email verification links)
FRONTEND_URL=https://internshell-dev.web.app

# Email (Required for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password

# Google OAuth (Required for login)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# AI Features (Optional)
GEMINI_API_KEY=your-gemini-api-key

# Video Generation (Optional)
DID_API_KEY=your-did-api-key