import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { UserRole } from '../../types/auth';
import { Heart } from 'lucide-react';

export function CreateAccountForm() {
  const [role, setRole] = useState<'parent' | 'nounou'>('parent');
  const navigate = useNavigate();
  const { signUp, loading, error } = useAuthStore();

  // État du formulaire parent
  const [parentForm, setParentForm] = useState({
    parent1: {
      firstName: '',
      lastName: '',
    },
    parent2: {
      firstName: '',
      lastName: '',
    },
    child: {
      firstName: '',
      lastName: '',
    },
    address: '',
    primaryPhone: '',
    secondaryPhone: '',
    email: '',
    password: '',
  });

  // État du formulaire nounou
  const [nounouForm, setNounouForm] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    birthPlace: '',
    address: '',
    phone: '',
    email: '',
    password: '',
  });

  const handleParentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signUp(
      parentForm.email,
      parentForm.password,
      'parent',
      parentForm.parent1.firstName,
      parentForm.parent1.lastName
    );
  };

  const handleNounouSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signUp(
      nounouForm.email,
      nounouForm.password,
      'nounou',
      nounouForm.firstName,
      nounouForm.lastName
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <div className="flex items-center justify-center mb-8">
          <Heart className="text-pink-500 w-8 h-8" />
          <h1 className="text-3xl font-bold text-gray-800 ml-2">Super Nounou</h1>
        </div>

        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Demande de création de compte
        </h2>
        <p className="text-gray-600 mb-6">
          Veuillez remplir le formulaire correspondant à votre profil
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Sélection du rôle */}
        <div className="flex mb-8 bg-gray-50 rounded-lg">
          <button
            className={`flex-1 py-3 px-4 rounded-lg ${
              role === 'parent'
                ? 'bg-white shadow-md text-gray-800'
                : 'text-gray-600'
            }`}
            onClick={() => setRole('parent')}
          >
            Parent
          </button>
          <button
            className={`flex-1 py-3 px-4 rounded-lg ${
              role === 'nounou'
                ? 'bg-white shadow-md text-gray-800'
                : 'text-gray-600'
            }`}
            onClick={() => setRole('nounou')}
          >
            Nounou
          </button>
        </div>

        {role === 'parent' ? (
          <form onSubmit={handleParentSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Parent 1</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={parentForm.parent1.firstName}
                    onChange={(e) =>
                      setParentForm({
                        ...parentForm,
                        parent1: {
                          ...parentForm.parent1,
                          firstName: e.target.value,
                        },
                      })
                    }
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
                    value={parentForm.parent1.lastName}
                    onChange={(e) =>
                      setParentForm({
                        ...parentForm,
                        parent1: {
                          ...parentForm.parent1,
                          lastName: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Parent 2 (optionnel)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={parentForm.parent2.firstName}
                    onChange={(e) =>
                      setParentForm({
                        ...parentForm,
                        parent2: {
                          ...parentForm.parent2,
                          firstName: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={parentForm.parent2.lastName}
                    onChange={(e) =>
                      setParentForm({
                        ...parentForm,
                        parent2: {
                          ...parentForm.parent2,
                          lastName: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Enfant</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={parentForm.child.firstName}
                    onChange={(e) =>
                      setParentForm({
                        ...parentForm,
                        child: {
                          ...parentForm.child,
                          firstName: e.target.value,
                        },
                      })
                    }
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
                    value={parentForm.child.lastName}
                    onChange={(e) =>
                      setParentForm({
                        ...parentForm,
                        child: {
                          ...parentForm.child,
                          lastName: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse
              </label>
              <input
                type="text"
                value={parentForm.address}
                onChange={(e) =>
                  setParentForm({ ...parentForm, address: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone principal
                </label>
                <input
                  type="tel"
                  value={parentForm.primaryPhone}
                  onChange={(e) =>
                    setParentForm({ ...parentForm, primaryPhone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone secondaire (optionnel)
                </label>
                <input
                  type="tel"
                  value={parentForm.secondaryPhone}
                  onChange={(e) =>
                    setParentForm({
                      ...parentForm,
                      secondaryPhone: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={parentForm.email}
                onChange={(e) =>
                  setParentForm({ ...parentForm, email: e.target.value })
                }
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
                value={parentForm.password}
                onChange={(e) =>
                  setParentForm({ ...parentForm, password: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Chargement...' : 'Soumettre la demande'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleNounouSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom
                </label>
                <input
                  type="text"
                  value={nounouForm.firstName}
                  onChange={(e) =>
                    setNounouForm({ ...nounouForm, firstName: e.target.value })
                  }
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
                  value={nounouForm.lastName}
                  onChange={(e) =>
                    setNounouForm({ ...nounouForm, lastName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de naissance
                </label>
                <input
                  type="date"
                  value={nounouForm.birthDate}
                  onChange={(e) =>
                    setNounouForm({ ...nounouForm, birthDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lieu de naissance
                </label>
                <input
                  type="text"
                  value={nounouForm.birthPlace}
                  onChange={(e) =>
                    setNounouForm({ ...nounouForm, birthPlace: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse
              </label>
              <input
                type="text"
                value={nounouForm.address}
                onChange={(e) =>
                  setNounouForm({ ...nounouForm, address: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                value={nounouForm.phone}
                onChange={(e) =>
                  setNounouForm({ ...nounouForm, phone: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={nounouForm.email}
                onChange={(e) =>
                  setNounouForm({ ...nounouForm, email: e.target.value })
                }
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
                value={nounouForm.password}
                onChange={(e) =>
                  setNounouForm({ ...nounouForm, password: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Chargement...' : 'Soumettre la demande'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <span className="text-gray-600">Déjà un compte ?</span>{' '}
          <button
            onClick={() => navigate('/signin')}
            className="text-pink-500 hover:text-pink-600 font-medium"
          >
            Se connecter
          </button>
        </div>
      </div>
    </div>
  );
}