## URL Shortener

A full-stack URL shortener built with React.js, Express.js, and MongoDB. Shorten long URLs and track clicks!

## Features

- Shorten long URLs instantly
- Track click/visit counts
- User authentication (Login/Register)
- Personal dashboard to manage URLs
- Delete unwanted URLs
- Responsive UI

Tech Stack--

**Frontend:** React.js, React Router, Tailwind CSS, Axios  
**Backend:** Express.js, MongoDB, JWT, bcryptjs, nanoid

## Quick Setup

### Backend
```
cd backend
npm install
cp .env.example 
npm run dev           # Runs on http://localhost:5001
```

### Frontend
```
cd frontend
npm install
npm start            # Runs on http://localhost:5173
```

## 🔐 Environment Variables

**Backend (.env):**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/url-shortener
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5001
```

**Frontend (.env):**
```
REACT_APP_API_URL=http://localhost:5173
```

## 📌 Usage

1. Open http://localhost:5173
2. Enter a long URL and click "Shorten URL"
3. Sign up/Login for advanced features (save URLs, track clicks)
4. View all your URLs in "My URLs" dashboard

## 📁 Project Structure

- `backend/` - Express API with MongoDB
- `frontend/` - React app with routing

---
Created By Jay Gupta