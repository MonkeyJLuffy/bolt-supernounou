import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Heart, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthFormProps, UserRole } from '../../types/auth';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '../ui/use-toast';

export function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<UserRole>('parent');
  const navigate = useNavigate();
  const { signIn, signUp, error, setDemoUser } = useAuthStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (type === 'signin') {
        const result = await signIn(email, password);
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/tableau-de-bord');
        }
      } else {
        await signUp(email, password, role, firstName, lastName);
        navigate('/tableau-de-bord');
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoParent = () => {
    const demoUser = {
      id: 'demo-parent-123',
      email: 'parent@demo.com',
      role: 'parent' as const,
      firstName: 'Jean',
      lastName: 'Dupont',
      createdAt: new Date(),
    };

    setDemoUser(demoUser);
    navigate('/tableau-de-bord');
  };

  const fillAdminCredentials = () => {
    setEmail('admin@supernounou.fr');
    setPassword('SuperNounouPassword');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-[#7ECBC3] mr-4 sm:mr-12">Super Nounou</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-[calc(100vh-64px)]">
        {/* Left Column - Logo and Info */}
        <div className="w-full lg:w-1/2 bg-[#B5E5E0] flex flex-col items-center justify-center p-6 sm:p-12">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full flex items-center justify-center mb-4 sm:mb-8">
            <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-[#7ECBC3]" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-6 text-center">Bienvenue sur Super Nounou</h2>
          <p className="text-white text-base sm:text-xl text-center max-w-md">
            La plateforme qui simplifie la gestion de garde d'enfants entre parents et nounous.
          </p>
        </div>

        {/* Right Column - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-12">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4 sm:mb-6 text-center">
              {type === 'signin' ? 'Connexion' : 'Inscription'}
            </h2>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
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
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7ECBC3] focus:border-transparent"
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
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7ECBC3] focus:border-transparent"
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
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7ECBC3] focus:border-transparent"
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
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7ECBC3] focus:border-transparent"
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
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7ECBC3] focus:border-transparent"
                  required
                />
              </div>

              <div className="flex flex-col gap-4">
                <Button
                  type="submit"
                  className="w-full bg-[#7ECBC3] text-white py-2 sm:py-3 rounded-lg hover:bg-[#6BA59E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? 'Chargement...' : type === 'signin' ? 'Se connecter' : 'S\'inscrire'}
                </Button>

                {type === 'signin' && (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleDemoParent}
                    >
                      Voir le dashboard parent (démo)
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={fillAdminCredentials}
                    >
                      Remplir identifiants admin
                    </Button>
                  </>
                )}
              </div>
            </form>

            <div className="mt-8 text-center">
              <button
                onClick={() => navigate(type === 'signin' ? '/signup' : '/signin')}
                className="text-[#7ECBC3] hover:underline"
              >
                {type === 'signin' ? 'Créer un compte' : 'Se connecter'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}