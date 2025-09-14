# Multi-Tenant SaaS Notes Application

A full-stack multi-tenant SaaS application built with Node.js, Express, MongoDB, React, and deployed on Vercel.

## 🏗 Architecture

### Multi-Tenancy Approach
This application uses **Shared Schema with Tenant ID** approach for multi-tenancy:
- Single database shared across all tenants
- Each document has a `tenantId` field for isolation
- Application-level tenant isolation ensures strict data separation
- Cost-effective and easy to maintain for small to medium scale

### Tech Stack
**Backend:**
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- CORS enabled for cross-origin requests

**Frontend:**
- React 18 with Vite
- React Router for navigation  
- Tailwind CSS for styling
- Axios for API calls
- Context API for state management

## 🚀 Features

### ✅ Multi-Tenancy
- Strict tenant isolation - data never leaks between tenants
- Two pre-configured tenants: Acme Corporation and Globex Corporation
- Tenant-aware API endpoints

### ✅ Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin/Member)
- Protected routes and API endpoints

### ✅ Subscription Feature Gating
- **Free Plan**: Limited to 3 notes maximum
- **Pro Plan**: Unlimited notes
- Admin-only upgrade functionality
- Real-time limit enforcement

### ✅ Notes CRUD Operations
- Create, Read, Update, Delete notes
- Tenant-isolated note storage
- Rich note editing interface
- Real-time note count tracking

### ✅ Admin Panel
- User invitation system
- Tenant user management
- Plan upgrade controls
- Tenant statistics dashboard

## 🔐 Test Accounts

All test accounts use password: `password`

| Email | Role | Tenant | Plan |
|-------|------|--------|------|
| admin@acme.test | Admin | Acme | Free |
| user@acme.test | Member | Acme | Free |
| admin@globex.test | Admin | Globex | Free |
| user@globex.test | Member | Globex | Free |

## 📋 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Notes (All require authentication + tenant isolation)
- `POST /api/notes` - Create a note
- `GET /api/notes` - List all notes for current tenant
- `GET /api/notes/:id` - Get specific note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Admin Only
- `POST /api/users/invite` - Invite new user (Admin only)
- `GET /api/users/tenant-users` - List tenant users (Admin only)
- `POST /api/tenants/:slug/upgrade` - Upgrade tenant plan (Admin only)

### Health Check
- `GET /health` - Health check endpoint

## 🛠 Local Development

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Git

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run seed  # Seed database with test data
npm run dev   # Start development server
```

### Frontend Setup  
```bash
cd frontend
npm install
npm run dev   # Start development server
```

### Environment Variables

**Backend (.env):**
```
MONGO_URI=mongodb://localhost:27017/notes-app
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
```

**Frontend (.env):**
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 🌐 Deployment

### Backend Deployment (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy backend with `vercel.json` configuration

### Frontend Deployment (Vercel)
1. Build the frontend: `npm run build`
2. Deploy dist folder to Vercel
3. Configure environment variables for production API URL

### Production URLs
- **Backend**: `https://your-backend.vercel.app`
- **Frontend**: `https://your-frontend.vercel.app` 
- **Health Check**: `https://your-backend.vercel.app/health`

## 🧪 Testing

The application includes comprehensive automated testing validation for:

- ✅ Health endpoint availability
- ✅ Authentication for all test accounts  
- ✅ Tenant isolation enforcement
- ✅ Role-based access restrictions
- ✅ Free plan note limits (3 note maximum)
- ✅ Pro plan upgrade functionality
- ✅ CRUD operations for notes
- ✅ Frontend accessibility and functionality

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Role-based authorization
- Tenant data isolation
- CORS configuration
- Input validation and sanitization
- Error handling without information leakage

## 📁 Project Structure

```
notes-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.js
│   ├── package.json
│   └── vercel.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── vercel.json
└── README.md
```

## 🎯 Key Implementation Details

### Tenant Isolation
- Every database query includes `tenantId` filtering
- JWT tokens contain user's tenant information
- Middleware validates tenant access on all protected routes

### Subscription Limits
- Free plan users blocked from creating 4th note
- Real-time note count validation
- Immediate limit removal after upgrade

### Role-Based Access
- Admin: Can invite users, upgrade plans, manage tenant
- Member: Can only manage their own notes
- Middleware enforces role restrictions

### Error Handling
- Comprehensive error messages
- Production-safe error responses
- Detailed logging for debugging

## 🚀 Future Enhancements

- Email notifications for user invitations
- Advanced note features (tags, categories)
- File attachments for notes
- Audit logging for admin actions
- Multiple subscription tiers
- Tenant customization options

## 📞 Support

For issues or questions regarding this application:
1. Check the automated testing results
2. Verify all environment variables are set correctly
3. Ensure database connectivity
4. Check CORS configuration for cross-origin issues

---

*This application satisfies all requirements for the multi-tenant SaaS Notes Application assignment, including deployment on Vercel with full tenant isolation, role-based access control, and subscription feature gating.*