# HostelMate - Setup Guide

## Project Overview

HostelMate is a hostel management system built with a modern tech stack, featuring:
- **JWT-based authentication** with access and refresh tokens
- **Real-time karma economy system** for task management
- **Production-ready deployment** with clean, professional code

---

## Tech Stack

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB
- **Authentication**: JWT (jsonwebtoken)
- **Port**: 5000 (development) / Production: https://hostelmate-94en.onrender.com

### Frontend
- **Framework**: React + Vite
- **State Management**: React Context API
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios 
- **Port**: 5175/5174/5173 (auto-selected)

---

## Project Structure

```
HostelMate/
├── Backend/
│   ├── app.js                          # Express server entry point
│   ├── package.json                    # Backend dependencies
│   ├── .env                            # Environment variables
│   ├── controllers/
│   │   ├── userController.js           # Auth & user operations
│   │   └── taskController.js           # Task CRUD operations
│   ├── models/
│   │   ├── User.js                     # User schema
│   │   ├── Task.js                     # Task schema
│   │   └── History.js                  # History schema
│   ├── middleware/
│   │   └── authMiddleware.js           # JWT verification
│   └── routes/
│       ├── userRoutes.js               # User endpoints
│       └── taskRoutes.js               # Task endpoints
│
└── Frontend/
    ├── package.json                    # Frontend dependencies
    ├── vite.config.js                  # Vite configuration
    ├── tailwind.config.js              # Tailwind configuration
    ├── src/
    │   ├── App.jsx                     # Root component
    │   ├── main.jsx                    # Entry point
    │   ├── index.css                   # Global styles
    │   ├── services/
    │   │   └── apiClient.js            # Axios instance with interceptors
    │   ├── context/
    │   │   └── AuthContext.jsx         # Auth state management
    │   ├── Pages/
    │   │   ├── Login.jsx               # Login form
    │   │   ├── Signup.jsx              # Registration form
    │   │   ├── Activity.jsx            # Task management
    │   │   ├── CreateTask.jsx          # Create new task
    │   │   ├── History.jsx             # Task history
    │   │   ├── AvailableFavors.jsx     # Browse tasks
    │   │   ├── Leaderboard.jsx         # Ranking system
    │   │   └── Privacy.jsx             # Privacy policy
    │   └── Components/
    │       ├── Navbar.jsx              # Navigation bar
    │       ├── Sidebar.jsx             # Sidebar menu
    │       ├── TaskCard.jsx            # Task component
    │       ├── Notification.jsx        # Notification toast
    │       └── ConfirmDialog.jsx       # Confirmation dialog
    └── public/                         # Static assets
```

---

## Setup Instructions

### Backend Setup

1. **Navigate to Backend directory**
   ```bash
   cd Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file with:**
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   ACCESS_TOKEN_SECRET=your_secret_key_here
   REFRESH_TOKEN_SECRET=your_refresh_secret_here
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   Server runs on: `http://localhost:5000`

### Frontend Setup

1. **Navigate to Frontend directory**
   ```bash
   cd Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Application opens on: `http://localhost:5175` (or next available port)

---

## Authentication Flow

### Registration
1. User enters: Name, Email, Room Number, Password
2. Backend hashes password and creates user
3. JWT tokens are generated and returned
4. Tokens are stored in localStorage

### Login
1. User enters: Email, Password
2. Backend verifies credentials
3. JWT tokens returned
4. Tokens stored in localStorage
5. Auth context updated

### Token Refresh
- Access token expires in 15 minutes
- Refresh token expires in 7 days
- API client automatically handles token refresh
- Failed refresh redirects to login

---

## API Endpoints

### User Routes (`/api/users/`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /refresh` - Refresh access token
- `GET /profile` - Get user profile (protected)
- `GET /leaderboard` - Get top 10 users

### Task Routes (`/api/tasks/`)
- `POST /create` - Create new task (protected)
- `GET /available` - Get available tasks (protected)
- `PUT /accept` - Accept a task (protected)
- `PUT /complete/:id` - Complete task (protected)
- `GET /myTasks` - Get user's tasks (protected)
- `GET /history` - Get completed tasks (protected)
- `PUT /update/:id` - Update own task (protected)
- `DELETE /delete/:id` - Delete own task (protected)

---

## Key Features

### JWT Security
- Secure token-based authentication
- Automatic token refresh
- Protected API routes
- Logout clears tokens

### Karma System
- Users start with 100 karma points
- Can create tasks with point rewards
- Earn points by completing tasks
- Points deducted when creating tasks
- Real-time balance updates

### Task Management
- Create, read, update, delete tasks
- Accept/complete tasks with verification
- History tracking of completed tasks
- Requester approval system

### Leaderboard
- Real-time ranking by karma points
- User achievement levels
- Room number visibility
- Top 10 users display

---

## Development Best Practices

✅ **Clean Code**
✅ **Error Handling**: Proper error messages for users
✅ **Security**: JWT protection on sensitive routes
✅ **Responsive Design**: Mobile-friendly interface
✅ **State Management**: Centralized auth state
✅ **API Organization**: Interceptors for token injection

---

## Deployment

### Frontend Deployment
- Configure API endpoint in `src/services/apiClient.js`
- Currently points to production: `https://hostelmate-94en.onrender.com/api`
- Build: `npm run build`

### Backend Deployment
- Set environment variables on hosting platform
- Ensure MongoDB URI is correct
- Deploy to Render, Railway, Vercel, or similar

---

## Environment Variables

### Backend `.env`
```
PORT=5000
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/hostelmate
ACCESS_TOKEN_SECRET=your_long_random_string_here
REFRESH_TOKEN_SECRET=your_long_random_string_here
```

### Frontend (Vite)
API endpoint configured in `src/services/apiClient.js`:
```javascript
const API_BASE = 'https://hostelmate-94en.onrender.com/api';
```

---

## Testing

### Manual Testing Checklist
- [ ] Register new user
- [ ] Login with credentials
- [ ] Create new task
- [ ] Accept task from available list
- [ ] Complete task with verification
- [ ] Check history page
- [ ] View leaderboard
- [ ] Logout and verify redirect to login
- [ ] Test token refresh (wait 15 mins or set shorter timeout)

---

## Troubleshooting

### "Cannot read property 'user' of undefined"
- Check if AuthContext is provided to components
- Verify localStorage has valid tokens

### "401 No token provided"
- Ensure login was successful
- Check if tokens are in localStorage
- Verify AuthContext is storing tokens

### "403 Invalid token"
- Token may have expired
- Token refresh might have failed
- Check if secrets match in .env

### "MongoDB connection error"
- Verify MONGO_URI is correct
- Check if MongoDB is running
- Ensure IP whitelist includes server

---

## License & Credits

Developed as a professional hostel management solution.
Clean, production-ready codebase following industry standards.

---

## Support

For issues or questions, please check:
1. Backend logs on server
2. Browser console for frontend errors
3. Network tab for API response details
4. CLEANUP_SUMMARY.md for recent changes
