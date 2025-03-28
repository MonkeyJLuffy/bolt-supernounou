import React, { useState } from 'react';
import { UserRole } from '../../types/auth';
import { useAuthStore } from '../../store/authStore';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthFormProps {
  type: 'signin' | 'signup';
}

export function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<UserRole>('parent');
  const navigate = useNavigate();

  const { signIn, signUp, loading, error, simulateUser } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'signin') {
      await signIn(email, password);
    } else {
      await signUp(email, password, role, firstName, lastName);
    }
  };

  const handleSimulateLogin = async (role: UserRole) => {
    simulateUser(role);
    navigate('/tableau-de-bord');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Heart className="text-pink-500 w-8 h-8" />
          <h1 className="text-3xl font-bold text-gray-800 ml-2">Super Nounou</h1>
        </div>

        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
          {type === 'signin' ? 'Connexion' : 'Inscription'}
        </h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'signup' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rôle
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="parent">Parent</option>
                  <option value="nounou">Nounou</option>
                  <option value="gestionnaire">Gestionnaire</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresse e-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Chargement...' : type === 'signin' ? 'Se connecter' : 'S\'inscrire'}
          </button>
        </form>

        {type === 'signin' && (
          <div className="mt-6 space-y-2">
            <p className="text-sm text-gray-600 text-center mb-2">Simuler une connexion :</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleSimulateLogin('parent')}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Parent (Marie Dupont)
              </button>
              <button
                onClick={() => handleSimulateLogin('nounou')}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Nounou (Sophie Martin)
              </button>
              <button
                onClick={() => handleSimulateLogin('gestionnaire')}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Gestionnaire (Lucas Bernard)
              </button>
              <button
                onClick={() => handleSimulateLogin('admin')}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Admin (Admin System)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}