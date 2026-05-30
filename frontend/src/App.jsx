import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/Common/ProtectedRoute';
import { Layout } from './components/Layout/Layout';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';
import { AdminLogin } from './components/Auth/AdminLogin';
import { AdminRegister } from './components/Auth/AdminRegister';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Profile } from './components/Profile/Profile';
import { Library } from './components/Library/Library';
import { AlumniDirectory } from './components/Alumni/AlumniDirectory';
import { AlumniManage } from './components/Alumni/AlumniManage';
import { AdminPanel } from './components/Admin/AdminPanel';
import { MaterialUpload } from './components/Admin/MaterialUpload';

const AuthRedirect = ({ studentTo = '/dashboard', adminTo = '/library/upload' }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return null;
  return <Navigate to={isAdmin ? adminTo : studentTo} replace />;
};

const AppRoutes = () => {
  const { isAuthenticated, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-dark-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? <AuthRedirect adminTo="/library/upload" /> : <Login />
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? <AuthRedirect adminTo="/library/upload" /> : <Register />
          }
        />
        <Route
          path="/admin/login"
          element={
            isAuthenticated ? (
              <Navigate to={isAdmin ? '/library/upload' : '/dashboard'} replace />
            ) : (
              <AdminLogin />
            )
          }
        />
        <Route
          path="/admin/register"
          element={
            isAuthenticated ? (
              <Navigate to={isAdmin ? '/library/upload' : '/dashboard'} replace />
            ) : (
              <AdminRegister />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/library"
          element={
            <ProtectedRoute>
              <Layout>
                <Library />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/alumni"
          element={
            <ProtectedRoute>
              <Layout>
                <AlumniDirectory />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <AdminPanel />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/library/upload"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <MaterialUpload />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/alumni/manage"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <AlumniManage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated ? (isAdmin ? '/library/upload' : '/dashboard') : '/login'} />
          }
        />
        <Route
          path="*"
          element={
            <Navigate
              to={
                isAuthenticated
                  ? isAdmin
                    ? '/library/upload'
                    : '/dashboard'
                  : '/login'
              }
              replace
            />
          }
        />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
