# 🚀 InternShell - Project Setup Guide

## 📋 Overview

InternShell एक Job/Internship Management Platform है जिसमें:
- **Frontend**: React.js + Vite + Material UI
- **Backend**: Node.js + Express.js + MongoDB
- **Features**: Google OAuth, AI Integration (Gemini), Video Generation (D-ID), Real-time Messaging (Socket.io)

---

## 📁 Project Structure

```
Internshell/
├── backend/          # Node.js Express Server
│   ├── controllers/  # API Controllers
│   ├── models/       # MongoDB Models
│   ├── routes/       # API Routes
│   ├── middleware/   # Auth Middleware
│   ├── utils/        # Utility Functions
│   └── uploads/      # File Uploads
│
└── frontend/         # React Vite Application
    ├── src/
    │   ├── views/    # Pages/Views
    │   ├── layout/   # Layout Components
    │   ├── component/# Reusable Components
    │   ├── routes/   # React Router Config
    │   ├── services/ # API Services
    │   └── themes/   # MUI Theme Config
    └── public/       # Static Assets
```

---

## 🔧 Prerequisites (पहले से Install होना चाहिए)

1. **Node.js** (v18 या उससे ऊपर)
   ```bash
   # Check version
   node --version
   
   # Download from: https://nodejs.org/
   ```

2. **MongoDB** (Local या Atlas Cloud)
   ```bash
   # Local MongoDB Install (Ubuntu)
   sudo apt-get install mongodb
   
   # Start MongoDB
   sudo systemctl start mongodb
   
   # या MongoDB Atlas (Cloud) use करें: https://www.mongodb.com/atlas
   ```

3. **Git** (Optional - for version control)
   ```bash
   sudo apt-get install git
   ```

---

## 📥 Step 1: Project Clone/Download करें

```bash
# अगर Git से clone कर रहे हैं
git clone <your-repo-url>
cd Internshell

# या folder को unzip करें अगर zip file है
```

---

## ⚙️ Step 2: Backend Setup

### 2.1 Backend Directory में जाएं
```bash
cd backend
```

### 2.2 Dependencies Install करें
```bash
npm install
```

### 2.3 Environment File (.env) बनाएं
Backend folder में `.env` file बनाएं और नीचे दी गई settings add करें:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# MongoDB Configuration
# Option 1: MongoDB Atlas (Cloud) - Recommended
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/internhub?retryWrites=true&w=majority

# Option 2: Local MongoDB
# MONGODB_URI=mongodb://localhost:27017/internhub

# JWT Secret Key (कोई भी random string use करें, minimum 32 characters)
JWT_SECRET=your_super_secret_jwt_key_here_minimum_32_characters_long
JWT_EXPIRE=30d

# CORS Origin (Frontend URL)
CORS_ORIGIN=http://localhost:3000

# Frontend URL (Email verification links के लिए)
FRONTEND_URL=http://localhost:3000

# Google OAuth Configuration
# Google Cloud Console से प्राप्त करें: https://console.cloud.google.com/
GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# D-ID Video Generation API (Optional)
# https://studio.d-id.com/ से API key लें
DID_API_KEY=Basic your_base64_encoded_api_key

# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password_here

# Gemini AI Configuration (Optional)
# https://makersuite.google.com/app/apikey से API key लें
GEMINI_API_KEY=your_gemini_api_key_here
```

### 📧 Gmail App Password कैसे बनाएं:
1. Gmail Account में जाएं
2. **Google Account → Security → 2-Step Verification** Enable करें
3. **App Passwords** में जाएं
4. "Mail" और "Windows Computer" select करें
5. **Generate** click करें
6. 16-character password मिलेगा, उसे `EMAIL_PASSWORD` में use करें

### 2.4 Backend Server Start करें
```bash
# Development Mode (auto-restart on file changes)
npm run dev

# या Production Mode
npm start
```

✅ **Success Message**: `Server running on port 5001` & `MongoDB Connected`

---

## 🎨 Step 3: Frontend Setup

### 3.1 Frontend Directory में जाएं
```bash
cd ../frontend
# या नई terminal में
cd frontend
```

### 3.2 Dependencies Install करें
```bash
npm install
```

### 3.3 Environment File (.env) बनाएं
Frontend folder में `.env` file बनाएं:

```env
VITE_APP_VERSION=v3.0.0
GENERATE_SOURCEMAP=false

VITE_APP_BASE_NAME=/

# API Base URL (Backend URL)
VITE_API_URL=http://localhost:5001/api

# Google OAuth Client ID (Backend के साथ same होना चाहिए)
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
```

### 3.4 Frontend Development Server Start करें
```bash
npm start
# या
npm run dev
```

✅ **Success**: Browser में `http://localhost:3000` खुलेगा

---

## 🔗 Step 4: Google OAuth Setup (Optional but Recommended)

1. **Google Cloud Console** जाएं: https://console.cloud.google.com/
2. **New Project** बनाएं
3. **APIs & Services → OAuth consent screen** configure करें
4. **Credentials → Create Credentials → OAuth 2.0 Client IDs**
5. Application type: **Web application**
6. **Authorized JavaScript origins** में add करें:
   - `http://localhost:3000`
   - `http://localhost:5001`
7. **Authorized redirect URIs** में add करें:
   - `http://localhost:3000`
   - `http://localhost:5001/api/auth/google/callback`
8. **Client ID** और **Client Secret** copy करें
9. दोनों `.env` files में update करें

---

## 🗄️ Step 5: MongoDB Atlas Setup (Cloud Database)

1. **MongoDB Atlas** जाएं: https://www.mongodb.com/atlas
2. **Sign Up / Login** करें
3. **Free Cluster** बनाएं
4. **Database Access** में user बनाएं (username & password)
5. **Network Access** में `0.0.0.0/0` add करें (Allow All IPs)
6. **Connect → Connect your application** से connection string copy करें
7. Backend `.env` में `MONGODB_URI` update करें

---

## 🚀 Step 6: Full Application चलाएं

### Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

### Access Points:
| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5001/api |

---

## 📦 Step 7: Production Build

### Frontend Build:
```bash
cd frontend
npm run build
```
Output `dist/` folder में होगा

### Backend Production:
```bash
cd backend
NODE_ENV=production npm start
```

---

## 🔧 Common Issues & Solutions

### Issue 1: MongoDB Connection Failed
```
Error: MongooseServerSelectionError
```
**Solution:**
- Check if MongoDB is running: `sudo systemctl status mongodb`
- Verify `MONGODB_URI` is correct
- For Atlas: Check Network Access whitelist

### Issue 2: CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- Backend `.env` में `CORS_ORIGIN=http://localhost:3000` verify करें
- Frontend और Backend ports सही होने चाहिए

### Issue 3: Port Already in Use
```
Error: EADDRINUSE: address already in use
```
**Solution:**
```bash
# Find and kill process using port
sudo lsof -i :5001
sudo kill -9 <PID>

# या different port use करें
PORT=5002 npm run dev
```

### Issue 4: npm install fails
```
npm ERR! code ERESOLVE
```
**Solution:**
```bash
npm install --legacy-peer-deps
# या
rm -rf node_modules package-lock.json
npm install
```

### Issue 5: Email Not Sending
**Solution:**
- Gmail में 2-Step Verification enable करें
- App Password generate करें
- Less Secure Apps को allow करें (not recommended)

---

## 📚 API Endpoints Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User Registration |
| POST | `/api/auth/login` | User Login |
| POST | `/api/auth/google` | Google OAuth |
| GET | `/api/auth/verify-email/:token` | Email Verification |
| POST | `/api/auth/forgot-password` | Forgot Password |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | Get All Jobs |
| POST | `/api/jobs` | Create Job (Employer) |
| GET | `/api/jobs/:id` | Get Job Details |
| PUT | `/api/jobs/:id` | Update Job |
| DELETE | `/api/jobs/:id` | Delete Job |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/applications` | Apply for Job |
| GET | `/api/applications/my` | Get My Applications |
| GET | `/api/applications/job/:id` | Get Job Applications |

### Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile/me` | Get My Profile |
| PUT | `/api/profile` | Update Profile |
| POST | `/api/profile/upload-resume` | Upload Resume |

---

## 🛠️ Tech Stack Details

### Backend Dependencies:
- **express**: Web Framework
- **mongoose**: MongoDB ODM
- **jsonwebtoken**: JWT Authentication
- **bcryptjs**: Password Hashing
- **nodemailer**: Email Sending
- **socket.io**: Real-time Communication
- **multer**: File Uploads
- **@google/generative-ai**: Gemini AI Integration

### Frontend Dependencies:
- **react**: UI Library
- **vite**: Build Tool
- **@mui/material**: Material UI Components
- **react-router-dom**: Routing
- **axios**: HTTP Client
- **redux**: State Management
- **socket.io-client**: Real-time Communication
- **formik + yup**: Form Handling & Validation

---

## 📞 Support

अगर कोई problem आए तो:
1. Console errors check करें
2. `.env` files verify करें
3. MongoDB connection check करें
4. CORS settings verify करें

---

## 🎯 Quick Start Commands

```bash
# Clone & Setup
git clone <repo-url>
cd Internshell

# Backend Setup
cd backend
npm install
cp .env.example .env  # Edit .env with your values
npm run dev

# Frontend Setup (New Terminal)
cd frontend
npm install
# Create .env file
npm start
```

---

------complet----