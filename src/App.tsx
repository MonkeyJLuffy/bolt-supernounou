import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthForm } from './components/auth/AuthForm';
import { CreateAccountForm } from './components/auth/CreateAccountForm';
import { ParentDashboard } from './components/dashboard/ParentDashboard';
import { NounouDashboard } from './components/dashboard/NounouDashboard';
import { GestionnaireDashboard } from './components/dashboard/GestionnaireDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { useAuthStore } from './store/authStore';

function App() {
  const { user, loading } = useAuthStore();

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
        <Route path="/" element={<Navigate to="/signin" />} />
        <Route path="/signin" element={<AuthForm type="signin" />} />
        <Route path="/signup" element={<CreateAccountForm />} />
        <Route
          path="/tableau-de-bord"
          element={
            user ? (
              user.role === 'parent' ? (
                <ParentDashboard />
              ) : user.role === 'nounou' ? (
                <NounouDashboard />
              ) : user.role === 'gestionnaire' ? (
                <GestionnaireDashboard />
              ) : user.role === 'admin' ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/signin" />
              )
            ) : (
              <Navigate to="/signin" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;