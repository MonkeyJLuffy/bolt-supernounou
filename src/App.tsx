import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ParentDashboard } from './components/dashboard/ParentDashboard';
import { NounouDashboard } from './components/dashboard/NounouDashboard';
import { GestionnaireDashboard } from './components/dashboard/GestionnaireDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { useAuthStore } from './store/authStore';
import { BrowserRouter } from 'react-router-dom';
import { AuthForm } from './components/auth/AuthForm';
import { CreateAccountForm } from './components/auth/CreateAccountForm';
import { LoadingSpinner } from './components/ui/loading-spinner';
import Cookies from 'js-cookie';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { user, token } = useAuthStore();
  const location = useLocation();

  console.log('ProtectedRoute - User:', user);
  console.log('ProtectedRoute - Allowed Roles:', allowedRoles);
  console.log('ProtectedRoute - User Role:', user?.role);

  if (!token) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    console.log('Access denied - User role not in allowed roles');
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

function DashboardRouter() {
  const { user } = useAuthStore();

  switch (user?.role) {
    case 'parent':
      return <ParentDashboard />;
    case 'nounou':
      return <NounouDashboard />;
    case 'gestionnaire':
      return <GestionnaireDashboard />;
    default:
      return <Navigate to="/signin" replace />;
  }
}

function AppRoutes() {
  const location = useLocation();
  const { token, checkAuth, loading, user } = useAuthStore();

  useEffect(() => {
    const checkAuthentication = async () => {
      const cookieToken = Cookies.get('auth_token');
      if (!token && cookieToken) {
        await checkAuth();
      }
    };

    checkAuthentication();
  }, [checkAuth, token]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const isPublicPage = location.pathname === '/signin' || location.pathname === '/signup';

  if (!token && !isPublicPage) {
    return <Navigate to="/signin" replace />;
  }

  // Redirection automatique en fonction du rôle
  if (token && user) {
    if (user.role === 'admin' && !location.pathname.startsWith('/admin')) {
      return <Navigate to="/admin" replace />;
    }
    if (['parent', 'nounou', 'gestionnaire'].includes(user.role) && !location.pathname.startsWith('/tableau-de-bord')) {
      return <Navigate to="/tableau-de-bord" replace />;
    }
  }

  return (
    <Routes>
      <Route path="/signin" element={<AuthForm type="signin" />} />
      <Route path="/signup" element={<AuthForm type="signup" />} />
      <Route path="/change-password" element={<CreateAccountForm />} />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tableau-de-bord"
        element={
          <ProtectedRoute allowedRoles={['parent', 'nounou', 'gestionnaire']}>
            <DashboardRouter />
          </ProtectedRoute>
        }
      />
      <Route path="/unauthorized" element={<div>Accès non autorisé</div>} />
      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}