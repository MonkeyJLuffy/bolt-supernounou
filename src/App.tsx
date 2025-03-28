import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthForm } from './components/auth/AuthForm';
import { useAuthStore } from './store/authStore';

function App() {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/signin"
          element={user ? <Navigate to="/tableau-de-bord" /> : <AuthForm type="signin" />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/tableau-de-bord" /> : <AuthForm type="signup" />}
        />
        <Route
          path="/"
          element={<Navigate to={user ? '/tableau-de-bord' : '/signin'} />}
        />
      </Routes>
    </Router>
  );
}

export default App;