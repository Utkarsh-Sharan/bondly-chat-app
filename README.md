# Bondly: Chat Application

A fullstack **MERN (MongoDB, Express, React, Node.js)** chat application with real-time messaging, authentication, and modern tooling.  
This project demonstrates secure JWT-based auth, scalable backend patterns, and a responsive frontend powered by Zustand.

---

## 🚀 Features

### Backend
- **Libraries**
  - [Arcjet](https://arcjet.com) → rate limiting & abuse prevention
  - [Cloudinary](https://cloudinary.com) → image storage & delivery
  - [Resend](https://resend.com) → sending welcome emails
  - [Socket.IO](https://socket.io) → real-time chatting
- **Database**
  - MongoDB Atlas → storing chat messages & user data
- **Middlewares**
  - Socket authentication
  - User authentication (JWT)
  - Input validators
  - Arcjet middleware for rate limiting
- **Custom Classes**
  - ES6 classes for error handling (`ApiError`)
  - ES6 classes for standardized API responses (`ApiResponse`)

### Frontend
- **State Management**
  - [Zustand](https://zustand-demo.pmnd.rs/) → global store for auth & chat state
- **Networking**
  - [Axios](https://axios-http.com/) → API calls with interceptors for token refresh
- **Custom Hooks**
  - Hook for playing sounds on events (e.g., new message notifications)

---

## 🔑 Authentication
- **Access Token** → short-lived JWT stored in httpOnly cookie
- **Refresh Token** → long-lived JWT for session persistence
- Automatic token refresh via Axios interceptor

---

## 🛠️ Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas cluster
- Cloudinary account
- Resend API key

### Installation
```bash
# Clone repo
git clone https://github.com/your-username/mern-chat-app.git
cd mern-chat-app

# Install dependencies
npm install

# Run backend
cd backend
npm run dev

# Run frontend
cd frontend
npm run dev
```

## 📸 Screenshots
- Signup Page:
<img width="2541" height="1306" alt="signup-page" src="https://github.com/user-attachments/assets/cbcb9f86-1052-4c4c-a17f-200cb84f5219" />


- Login Page:
<img width="2547" height="1311" alt="login-page" src="https://github.com/user-attachments/assets/c9e50900-ce1b-4296-a99b-0150c6fe1fe2" />

## ⚡ Tech Highlights
- Real-time messaging with Socket.IO
- Secure JWT auth with refresh tokens
- Rate limiting with Arcjet
- Cloud image storage with Cloudinary
- Zustand store for clean state management
- Axios interceptors for auto token refresh
- ES6 classes for robust error/response handling
