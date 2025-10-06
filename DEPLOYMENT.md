# Deployment Guide for Render

## 🚀 Backend Deployment on Render

### 1. Deploy Your Backend
1. Go to [Render.com](https://render.com) and sign up/login
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure your backend service:
   - **Name**: `edulearn-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend` (if your backend is in a subfolder)

### 2. Environment Variables on Render
Add these environment variables in your Render backend service:
```
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=10000
```

### 3. Get Your Backend URL
Once deployed, Render will give you a URL like:
```
https://edulearn-backend.onrender.com
```

## 🌐 Frontend Configuration

### 4. Update Frontend Environment
1. Create a `.env.local` file in your frontend root:
```env
VITE_API_URL=https://your-backend-name.onrender.com
```

Example:
```env
VITE_API_URL=https://edulearn-backend.onrender.com
```

### 5. Deploy Frontend (Optional)
You can deploy the frontend on:
- **Render**: Static Site
- **Vercel**: Connect your GitHub repo
- **Netlify**: Drag and drop build folder

### 6. Frontend Build Command
For deployment, build your frontend:
```bash
npm run build
```

## 🔧 Quick Setup Commands

### Local Development with Render Backend:
```bash
# 1. Create environment file
echo "VITE_API_URL=https://your-backend-name.onrender.com" > .env.local

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

### Test Backend Connection:
```bash
# Test if your backend is working
curl https://your-backend-name.onrender.com/api/health
```

## 📝 Important Notes

1. **Replace** `your-backend-name` with your actual Render service name
2. **Free Render services** may sleep after 15 minutes of inactivity
3. **CORS**: Make sure your backend allows requests from your frontend domain
4. **Environment Variables**: Never commit `.env.local` to version control

## 🐛 Troubleshooting

### Backend Issues:
- Check Render logs for deployment errors
- Verify MongoDB connection string
- Ensure all environment variables are set

### Frontend Issues:
- Clear browser cache after changing API URL
- Check browser console for network errors
- Verify `.env.local` file is in the correct location

### Common Render Backend URL Patterns:
```
https://edulearn-backend.onrender.com
https://my-app-backend-xyz123.onrender.com
https://elearning-api.onrender.com
```

Replace the `VITE_API_URL` in your `.env.local` file with your actual Render backend URL!