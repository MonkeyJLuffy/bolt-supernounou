import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthForm } from './components/auth/AuthForm';
import { CreateAccountForm } from './components/auth/CreateAccountForm';
import { ParentDashboard } from './components/dashboard/ParentDashboard';
import { NounouDashboard } from './components/dashboard/NounouDashboard';
import { GestionnaireDashboard } from './components/dashboard/GestionnaireDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { useAuthStore } from './stores/authStore';
import Cookies from 'js-cookie';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user?.role || '')) {
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
  const { checkAuth, isLoading, isAuthenticated } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    const token = Cookies.get('auth_token');
    if (token && !isAuthenticated && location.pathname !== '/signin') {
      checkAuth();
    }
  }, [checkAuth, location.pathname, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7ECBC3]"></div>
      </div>
    );
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

const router = createBrowserRouter([
  {
    path: '*',
    element: <AppRoutes />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}