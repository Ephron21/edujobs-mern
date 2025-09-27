import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home';
import Services from './pages/Services';
import Apply from './pages/Apply';
import Contact from './pages/Contact';
import CSM from './pages/CSM';
import Jobs from './pages/Jobs';
import Students from './pages/Students';
import Announcements from './pages/Announcements';
import AdminAnnouncements from './pages/Admin/Announcements';
import AdminApplicants from './pages/Admin/Applicants';
import AdminFiles from './pages/Admin/Files';
import AdminStudents from './pages/Admin/Students';
import { AdminRoute } from './components/ProtectedRoute';
import React from 'react';

// Main App component with all routes
function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/apply" element={<Apply />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/students" element={<Students />} />
      <Route path="/announcements" element={<Announcements />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected admin routes */}
      <Route 
        path="/admin" 
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        } 
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<CSM />} />
        <Route path="applicants" element={<AdminApplicants />} />
        <Route path="files" element={<AdminFiles />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="announcements" element={<AdminAnnouncements />} />
      </Route>

      {/* Redirect /csm to /admin/dashboard */}
      <Route path="/csm" element={<Navigate to="/admin/dashboard" replace />} />

      {/* 404 route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Main layout component
function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 flex flex-col">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10 flex-1 w-full">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

// Root App component with providers
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </Router>
  );
}

export default App;