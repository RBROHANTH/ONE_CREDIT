import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { AdminProvider } from './contexts/AdminContext';
import { StudentProvider } from './contexts/StudentContext';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import CourseList from './pages/CourseList';
import CourseDetails from './pages/CourseDetails';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AddCourse from './pages/AddCourse';
import ManageCourses from './pages/ManageCourses';
import StudentLogin from './pages/StudentLogin';
import StudentSignup from './pages/StudentSignup';
import ProtectedRoute from './components/ProtectedRoute';
import StudentProtectedRoute from './components/StudentProtectedRoute';
import './index.css';

// Layout component
const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

// About page component
const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">About EduLearn</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              EduLearn is an educational platform inspired by NPTEL, designed to provide 
              high-quality online courses across various domains of technology and science.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-6">
              To democratize access to quality education by providing comprehensive, 
              well-structured courses that are accessible to learners worldwide.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Features</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Expert-led video lectures</li>
              <li>Structured learning modules</li>
              <li>Comprehensive course materials</li>
              <li>Progress tracking</li>
              <li>Mobile-responsive design</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Technology Stack</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-2">Frontend</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• React 18</li>
                  <li>• Vite</li>
                  <li>• React Router</li>
                  <li>• Tailwind CSS</li>
                </ul>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-2">Development</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Modern ES6+ JavaScript</li>
                  <li>• Functional Components</li>
                  <li>• React Hooks</li>
                  <li>• Responsive Design</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Error page component
const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist.
        </p>
        <a
          href="/"
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  );
};

// Router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/courses",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <StudentProtectedRoute>
            <CourseList />
          </StudentProtectedRoute>
        ),
      },
      {
        path: ":courseId",
        element: (
          <StudentProtectedRoute>
            <CourseDetails />
          </StudentProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/about",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <StudentProtectedRoute>
            <About />
          </StudentProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/admin",
    children: [
      {
        path: "login",
        element: <AdminLogin />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "add-course",
        element: (
          <ProtectedRoute>
            <AddCourse />
          </ProtectedRoute>
        ),
      },
      {
        path: "manage-courses",
        element: (
          <ProtectedRoute>
            <ManageCourses />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/student",
    children: [
      {
        path: "login",
        element: <StudentLogin />,
      },
      {
        path: "signup",
        element: <StudentSignup />,
      },
    ],
  },
]);

function App() {
  return (
    <AdminProvider>
      <StudentProvider>
        <RouterProvider router={router} />
      </StudentProvider>
    </AdminProvider>
  );
}

export default App;