# EduLearn Backend API

A robust Express.js backend for the EduLearn educational platform with MongoDB Atlas integration.

## Features

- **Authentication System**: Separate authentication for students and admins
- **Course Management**: Full CRUD operations for courses
- **Student Enrollment**: Course enrollment and progress tracking
- **MongoDB Atlas**: Cloud database integration
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Centralized error handling middleware
- **CORS Support**: Cross-origin resource sharing enabled

## API Endpoints

### Health Check
- `GET /api/health` - API health check

### Student Authentication
- `POST /api/auth/student/register` - Register new student
- `POST /api/auth/student/login` - Student login
- `GET /api/auth/student/profile` - Get student profile (Protected)

### Admin Authentication
- `POST /api/auth/admin/login` - Admin login
- `GET /api/auth/admin/profile` - Get admin profile (Protected)
- `POST /api/auth/admin/create-default` - Create default admin (Development only)

### Courses
- `GET /api/courses` - Get all courses (with pagination and filters)
- `GET /api/courses/:id` - Get single course
- `POST /api/courses` - Create course (Admin only)
- `PUT /api/courses/:id` - Update course (Admin only)
- `DELETE /api/courses/:id` - Delete course (Admin only)
- `POST /api/courses/:id/enroll` - Enroll in course (Student only)
- `GET /api/courses/student/enrolled` - Get enrolled courses (Student only)

## Environment Variables

Create a `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://rbrohanth179:rbrohanht179@mern2025.a8lo6iy.mongodb.net/edulearn?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here_change_in_production
ADMIN_EMAIL=admin@edulearn.com
ADMIN_PASSWORD=admin123
```

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Environment Variables**
   - Copy `.env.example` to `.env`
   - Update the variables as needed

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Start Production Server**
   ```bash
   npm start
   ```

## Database Models

### Student Schema
- Personal information (firstName, lastName, email)
- Authentication (password with bcrypt hashing)
- Course enrollment tracking
- Profile information

### Admin Schema
- Authentication credentials
- Role-based permissions
- Administrative capabilities

### Course Schema
- Course details (title, description, instructor)
- Media content (video URL, thumbnail)
- Student enrollment tracking
- Categorization and difficulty levels

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

- **Student Routes**: Require student authentication
- **Admin Routes**: Require admin authentication
- **Public Routes**: No authentication required

### Authorization Header Format
```
Authorization: Bearer <your_jwt_token>
```

## Error Handling

The API includes comprehensive error handling:

- **Validation Errors**: Input validation with detailed error messages
- **Authentication Errors**: Unauthorized access handling
- **Database Errors**: MongoDB operation error handling
- **Server Errors**: Internal server error handling

## Security Features

- **Password Hashing**: bcrypt for secure password storage
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: express-validator for request validation
- **CORS Configuration**: Controlled cross-origin access
- **Error Sanitization**: Secure error message handling

## Development

### Project Structure
```
backend/
├── config/
│   └── database.js         # MongoDB connection
├── middleware/
│   ├── auth.js            # Authentication middleware
│   └── error.js           # Error handling middleware
├── models/
│   ├── Admin.js           # Admin model
│   ├── Course.js          # Course model
│   └── Student.js         # Student model
├── routes/
│   ├── adminAuth.js       # Admin authentication routes
│   ├── courses.js         # Course management routes
│   └── studentAuth.js     # Student authentication routes
├── .env                   # Environment variables
├── package.json           # Dependencies and scripts
└── server.js              # Main server file
```

### Database Connection

The application connects to MongoDB Atlas using the provided connection string. Ensure your MongoDB Atlas cluster is properly configured and accessible.

## Testing

Test the API endpoints using tools like:
- Postman
- curl
- REST Client extensions

### Example Requests

**Create Default Admin:**
```bash
curl -X POST http://localhost:5000/api/auth/admin/create-default
```

**Student Registration:**
```bash
curl -X POST http://localhost:5000/api/auth/student/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Get Courses:**
```bash
curl -X GET http://localhost:5000/api/courses
```