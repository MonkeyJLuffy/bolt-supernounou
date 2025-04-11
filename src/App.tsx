import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthForm } from './components/auth/AuthForm';
import { CreateAccountForm } from './components/auth/CreateAccountForm';
import { ParentDashboard } from './components/dashboard/ParentDashboard';
import { NounouDashboard } from './components/dashboard/NounouDashboard';
import { GestionnaireDashboard } from './components/dashboard/GestionnaireDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { useAuthStore } from './store/authStore';
import Cookies from 'js-cookie';

function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode, requiredRole?: string }) {
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { loading, checkAuth, user } = useAuthStore();

  useEffect(() => {
    const token = Cookies.get('auth_token');
    if (token) {
      checkAuth();
    }
  }, [checkAuth]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<AuthForm type="signin" />} />
        <Route path="/signup" element={<CreateAccountForm />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tableau-de-bord"
          element={
            <ProtectedRoute>
              {user?.role === 'parent' ? (
                <ParentDashboard />
              ) : user?.role === 'nounou' ? (
                <NounouDashboard />
              ) : user?.role === 'gestionnaire' ? (
                <GestionnaireDashboard />
              ) : user?.role === 'admin' ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/signin" replace />
              )}
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;