# Environment Variables Guide

## 🎯 Current Setup (Already Configured!)

Your application is correctly using environment variables:

### Backend Environment Variables (`backend/.env`):
```bash
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://rbrohanth179:rbrohanth179@mern2025.a8lo6iy.mongodb.net/...
JWT_SECRET=your_jwt_secret_key_here_change_in_production
ADMIN_EMAIL=admin@edulearn.com
ADMIN_PASSWORD=admin123
```

### Frontend Environment Variables (`.env.local`):
```bash
VITE_API_URL=http://localhost:5000
```

## 🚀 For Render Deployment

### Backend on Render:
Set these environment variables in Render dashboard:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://rbrohanth179:rbrohanth179@mern2025.a8lo6iy.mongodb.net/?retryWrites=true&w=majority&appName=MERN2025
JWT_SECRET=your_secure_production_jwt_secret
ADMIN_EMAIL=admin@edulearn.com
ADMIN_PASSWORD=admin123
PORT=10000
```

### Frontend Environment:
Create `.env.local` with your Render backend URL:
```bash
VITE_API_URL=https://your-backend-name.onrender.com
```

## 🔒 Security Best Practices

### ✅ Already Implemented:
- MongoDB URI in backend environment variables ✓
- JWT secrets in environment variables ✓
- API endpoints configurable via environment ✓
- CORS origins configurable ✓

### 🔧 For Production:
1. **Change JWT_SECRET** to a strong random string
2. **Use process.env.PORT** (already implemented)
3. **Configure CORS** for your production domain
4. **Never commit .env files** to version control

## 📁 File Structure:
```
backend/
├── .env                 # Your actual backend config (NOT in git)
├── .env.example        # Template for backend config
└── config/database.js  # Uses process.env.MONGODB_URI

frontend/
├── .env.local          # Your actual frontend config (NOT in git)
├── .env.example        # Template for frontend config
└── src/config/api.js   # Uses import.meta.env.VITE_API_URL
```

## ✅ Your Setup is Perfect!

Your application already uses environment variables correctly:
- **Backend**: MongoDB URI from `process.env.MONGODB_URI`
- **Frontend**: API URL from `import.meta.env.VITE_API_URL`
- **Security**: Sensitive data in environment variables, not code

Just create `.env.local` in frontend root when deploying:
```bash
echo "VITE_API_URL=https://your-render-backend.onrender.com" > .env.local
```